# json-deduper

Compress JSON trees by deduplicating nested objects, strings, and numbers
## Installation

`yarn add @mattkrick/json-deduper`

## Why

Smaller payloads mean faster websites

## High level architecture

- Traverses JSON payload, extracting every object & replacing it with a reference
- After traversal is complete, it re-inlines unique objects
- Duplicate objects are replace with a positive even number that serves as a pointer
- Any pre-existing positive even numbers are turned to odd numbers for decompression, then back during decompression

## Gotchas

- The compressed object must be serialized before being decompressed to ensure there are no shared sub-objects
- Decompression mutates the input object for performance reasons. If that's bad, just clone the object first.

## Usage

See bench/bench.ts for example and benchmarks.
For best results, use this, then msgpack, then gzip or brotli.

## API

```js
import compress from '@mattkrick/json-deduper/dist/compress'
import decompress from '@mattkrick/json-deduper/dist/decompress'
const compressedNode = compress({foo: {bar: 1}, baz: {bar: 1}}, options)
const decompressedNode = decompress(JSON.parse(JSON.stringify(compressedNode)), options)
```

Options
- strings: boolean, defaults to false. set to true to deduplicate strings (good for raw, not significantly better after gzip)
- numbers: boolean, defaults to false. set to true to deduplicate numbers
- transforms: Advanced! used for extra compression, given a schema. `Array<(object: any, {parent: any, key: string | number}) => any>`

## License

MIT
