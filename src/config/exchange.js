export default [
    { limit: 1000, rate: 0.06, fee: 6 },
    { limit: 5000, rate: 0.058 },
    { limit: 10000, rate: 0.0575 },
    { limit: 30000, rate: 0.057 },
    { limit: 50000, rate: 0.056 },
    { limit: 100000, rate: 0.0555 },
    { limit: 1000000, rate: 0.055 },
    { limit: Infinity, rate: 0.055 },
].sort((a, b) => a.limit - b.limit)
  