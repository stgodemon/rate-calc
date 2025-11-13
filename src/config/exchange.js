export default [
    { limit: 1000, rate: 0.058, fee: 5.8 },
    { limit: 5000, rate: 0.056 },
    { limit: 10000, rate: 0.055 },
    { limit: 30000, rate: 0.054 },
    { limit: 50000, rate: 0.0535 },
    { limit: 100000, rate: 0.053 },
    { limit: 1000000, rate: 0.0525 },
    { limit: Infinity, rate: 0.0525 },
].sort((a, b) => a.limit - b.limit)
  