export default [
    { limit: 1000, rate: 0.055, fee: 5.5 },
    { limit: 5000, rate: 0.054 },
    { limit: 10000, rate: 0.053 },
    { limit: 30000, rate: 0.052 },
    { limit: 50000, rate: 0.0515 },
    { limit: 100000, rate: 0.051 },
    { limit: 1000000, rate: 0.0505 },
    { limit: Infinity, rate: 0.0505 },
].sort((a, b) => a.limit - b.limit)
  