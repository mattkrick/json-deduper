export type Key = string | number
export type IgnoreKeys = Key[]

interface TransformContext {
  parent: any
  key: Key | undefined
  ignoreKeys: IgnoreKeys
}

export type Transform = (
  data: any,
  context: TransformContext,
) => undefined | {data: any; ignoreKeys: IgnoreKeys}

export function isObject(value: any): value is {[key: string]: any} {
  return typeof value === 'object' && value !== null
}

export const runTransforms = (
  data: any,
  transforms: Transform[],
  parent: object | undefined,
  key: Key | undefined,
) => {
  let ignoreKeys: Key[] = []
  for (let i = 0; i < transforms.length; i++) {
    const res = transforms[i](data, {
      parent,
      key,
      ignoreKeys,
    })
    if (res) {
      data = res.data
      ignoreKeys = res.ignoreKeys || []
    }
  }
  return {
    transformedData: data,
    ignoreKeys,
  }
}
