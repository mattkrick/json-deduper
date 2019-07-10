export declare type Key = string | number
export declare type IgnoreKeys = Key[]
interface TransformContext {
  parent: any
  key: Key | undefined
  ignoreKeys: IgnoreKeys
}
export declare type Transform = (
  data: any,
  context: TransformContext,
) =>
  | undefined
  | {
      data: any
      ignoreKeys: IgnoreKeys
    }
export declare function isObject(
  value: any,
): value is {
  [key: string]: any
}
export declare const runTransforms: (
  data: any,
  transforms: Transform[],
  parent: object | undefined,
  key: string | number | undefined,
) => {
  transformedData: any
  ignoreKeys: (string | number)[]
}
export {}
//# sourceMappingURL=utils.d.ts.map
