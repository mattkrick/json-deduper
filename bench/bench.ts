import {join} from 'path'
import {gzipSync} from 'zlib'
import {crunch, uncrunch} from 'graphql-crunch'
import msgpack from 'msgpack-lite'
import {performance, PerformanceObserver} from 'perf_hooks'
import compress from '../src/compress'
import decompress from '../src/decompress'

const blobs = {
  // From https://gist.githubusercontent.com/stevekrenzel/8553b5cc5462164bc9ac5b2897978405/raw/f07292666eb621a2d29dc8cee0c78a4ddb3bbadd/swapi.json
  'Large SWAPI': join(__dirname, '../json/large.json'),

  // From https://gist.githubusercontent.com/stevekrenzel/88c16d8655d25bed7c1b61f1750eb362/raw/4c4b7806ba51afa479224011f8138ef1346f08f6/swapi.json
  'Small SWAPI': join(__dirname, '../json/small.json'),

  // From https://catalog.data.gov/dataset/2010-census-populations-by-zip-code/resource/74f7a51d-36ae-4a28-9345-d8e07321f2e4
  Census: join(__dirname, '../json/census.json'),

  // From https://data.oregon.gov/api/views/i8h7-mn6v/rows.json
  Businesses: join(__dirname, '../json/businesses.json'),

  //"Banter Feed": join(__dirname, './json/feed.json'),
}

const encoders = {
  'Crunch 2.0': {
    encode: (data: any) => JSON.stringify(crunch(data, 2)),
    decode: (data: any) => uncrunch(JSON.parse(data)),
  },
  //
  'json-deduper': {
    encode: (data: any) => JSON.stringify(compress(data)),
    decode: (data: any) => decompress(JSON.parse(data)),
  },
  'json-deduper w/ strings + numbers + MSGPACK': {
    encode: (data: any) => msgpack.encode(compress(data, {strings: true, numbers: true})),
    decode: (data: any) => decompress(msgpack.decode(data)),
  },

  'json-deduper w/ strings + MSGPACK': {
    encode: (data: any) => msgpack.encode(compress(data, {strings: true})),
    decode: (data: any) => decompress(msgpack.decode(data)),
  },

  'json-deduper w/ numbers + MSGPACK': {
    encode: (data: any) => msgpack.encode(compress(data, {numbers: true})),
    decode: (data: any) => decompress(msgpack.decode(data)),
  },
}

interface BlobResult {
  'Raw (bytes)'?: number
  "GZip'd (bytes)"?: number
  'Serialized (ms)'?: number
  'Deserialized (ms)'?: number
}

interface EncoderResult {
  [encoderName: string]: BlobResult
}

interface Results {
  [blobName: string]: EncoderResult
}

const iterations = 20
const total = Object.keys(blobs).length * Object.keys(encoders).length * 2
let cur = 0
console.log('Running... (this will take a minute)')
const obs = new PerformanceObserver((list) => {
  cur++
  const entries = list.getEntries()
  entries.forEach((entry) => {
    const [blobName, dataName, type] = entry.name.split('-')
    const typeLabel = type === 'encode' ? 'Serialized (ms)' : 'Deserialized (ms)'
    results[blobName][dataName][typeLabel] = entry.duration / iterations
    performance.clearMarks()
  })
  if (cur === total) {
    for (let blob in blobs) {
      const result = results[blob]
      console.log(blob)
      console.table(result)
    }
  }
})
obs.observe({entryTypes: ['measure']})
const results = {} as Results
for (let blob in blobs) {
  const result = (results[blob] = {} as EncoderResult)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const payload = require(blobs[blob as keyof typeof blobs])
  for (let key in encoders) {
    const solution = encoders[key as keyof typeof encoders]
    const serialized = solution.encode(payload)
    const zipped = gzipSync(serialized)
    result[key as keyof typeof encoders] = {
      'Raw (bytes)': serialized.length,
      "GZip'd (bytes)": zipped.length,
    }

    const fns = ['encode', 'decode'] as ['encode', 'decode']
    for (let i = 0; i < fns.length; i++) {
      const data = i === 0 ? payload : serialized
      const type = fns[i]
      const fn = solution[type]
      performance.mark('start')
      for (let i = 0; i < iterations; i++) {
        fn(data)
      }
      performance.mark('stop')
      performance.measure(`${blob}-${key}-${type}`, 'start', 'stop')
    }
  }
}
