import { isObject, runTransforms } from "./utils";
const SINGLE_BYTE = [null, undefined, true, false];
let nextID = 0;
const upsertHash = (flatData, parent, idx, hash, cache) => {
    const entry = cache[hash];
    if (entry) {
        const { refs, id } = entry;
        refs.push({
            parent, idx
        });
        return id;
    }
    const id = nextID += 2;
    cache[hash] = {
        refs: [{
                parent, idx
            }],
        id,
        value: flatData,
    };
    return id;
};
const handleNumber = (flatData, parent, idx, context) => {
    const { dedupeNumbers, numberCache } = context;
    return dedupeNumbers ? upsertHash(flatData, parent, idx, String(flatData), numberCache) : Number.isInteger(flatData) && flatData >= 0 ? flatData * 2 + 1 : flatData;
};
const handleString = (flatData, parent, idx, context) => {
    const { dedupeStrings, stringCache } = context;
    return dedupeStrings ? upsertHash(flatData, parent, idx, flatData, stringCache) : flatData;
};
const handleObject = (flatData, parent, idx, context) => {
    const { objectCache, objectToHash } = context;
    const hash = JSON.stringify(flatData);
    objectToHash.set(flatData, hash);
    return upsertHash(flatData, parent, idx, hash, objectCache);
};
const compress = (data, parent, idx, context) => {
    let flatData = data;
    if (isObject(data)) {
        const { transformedData, ignoreKeys } = runTransforms(data, context.transforms, parent, idx);
        flatData = transformedData;
        if (Array.isArray(transformedData)) {
            for (let i = 0; i < transformedData.length; i++) {
                const item = transformedData[i];
                if (!ignoreKeys.includes(i)) {
                    flatData[i] = compress(item, transformedData, i, context);
                }
            }
        }
        else {
            const keys = Object.keys(transformedData);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (!ignoreKeys.includes(key)) {
                    flatData[key] = compress(transformedData[key], transformedData, key, context);
                }
            }
        }
    }
    if (!parent || SINGLE_BYTE.includes(flatData))
        return flatData;
    switch (typeof flatData) {
        case 'number':
            return handleNumber(flatData, parent, idx, context);
        case 'string':
            return handleString(flatData, parent, idx, context);
        default:
            return handleObject(flatData, parent, idx, context);
    }
};
const createRefTable = (json, context) => {
    const refTable = [];
    refTable.push(json);
    const { objectToHash, objectCache, stringCache } = context;
    const caches = [objectCache, stringCache];
    caches.forEach((cache) => {
        const hashes = Object.keys(cache);
        for (let i = 0; i < hashes.length; i++) {
            const hash = hashes[i];
            const val = cache[hash];
            const { value, refs } = val;
            const parentHashes = refs.map((ref) => objectToHash.get(ref.parent));
            const refCount = new Set(parentHashes).size;
            const commitValue = refCount > 1 ? (refTable.push(value) - 1) * 2 : value;
            for (let j = 0; j < refs.length; j++) {
                const ref = refs[j];
                const { parent, idx } = ref;
                parent[idx] = commitValue;
            }
        }
    });
    return refTable;
};
export default (json, options = {}) => {
    if (!isObject(json))
        return json;
    const dedupeStrings = options.strings === undefined ? false : options.strings;
    const dedupeNumbers = options.numbers === undefined ? false : options.numbers;
    const context = {
        objectCache: {},
        stringCache: {},
        numberCache: {},
        dedupeStrings,
        dedupeNumbers,
        transforms: options.transforms || [],
        objectToHash: new WeakMap()
    };
    compress(json, undefined, undefined, context);
    return createRefTable(json, context);
};
//# sourceMappingURL=compress.js.map