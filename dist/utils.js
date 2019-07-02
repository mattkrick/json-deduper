export function isObject(value) {
    return typeof value === 'object' && value !== null;
}
export const runTransforms = (data, transforms, parent, key) => {
    let ignoreKeys = [];
    for (let i = 0; i < transforms.length; i++) {
        const res = transforms[i](data, { parent, key, ignoreKeys });
        if (res) {
            data = res.data;
            ignoreKeys = res.ignoreKeys || [];
        }
    }
    return { transformedData: data, ignoreKeys };
};
//# sourceMappingURL=utils.js.map