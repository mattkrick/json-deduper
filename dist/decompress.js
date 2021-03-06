import { isObject, runTransforms } from "./utils";
const getValue = (val, parent, idx, context) => {
    const { refTable } = context;
    if (isObject(val)) {
        const { transformedData } = runTransforms(val, context.transforms, parent, idx);
        decompress(transformedData, context);
        return transformedData;
    }
    if (Number.isInteger(val) && val >= 0) {
        // numbers that are positive & even are refs, positive and odd are numbers normalized to be odd via 2k + 1
        return val % 2 === 0 ? refTable[val / 2] : (val - 1) / 2;
    }
    return val;
};
const decompress = (fragment, context) => {
    if (Array.isArray(fragment)) {
        for (let i = 0; i < fragment.length; i++) {
            const val = fragment[i];
            fragment[i] = getValue(val, fragment, i, context);
        }
    }
    else {
        const keys = Object.keys(fragment);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const val = fragment[key];
            fragment[key] = getValue(val, fragment, key, context);
        }
    }
};
export default (refTable, options = {}) => {
    if (!Array.isArray(refTable))
        return refTable;
    const context = {
        transforms: options.transforms || [],
        refTable
    };
    for (let i = 0; i < refTable.length; i++) {
        const fragment = refTable[i];
        if (!isObject(fragment))
            break;
        decompress(fragment, context);
    }
    return refTable[0];
};
//# sourceMappingURL=decompress.js.map