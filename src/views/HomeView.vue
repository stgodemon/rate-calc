<script setup>
import { ref, watch } from 'vue'

const resultPrice = defineModel({default: 0})
const exchangeTable = [
  { limit: 1000, rate: 0.06, fee: 6 },
  { limit: 5000, rate: 0.58 },
  { limit: 10000, rate: 0.575 },
  { limit: 30000, rate: 0.57 },
  { limit: 50000, rate: 0.56 },
  { limit: 100000, rate: 0.555 },
  { limit: 1000000, rate: 0.55 },
].sort((a, b) => b.limit - a.limit)

function calc(source) {
  const price = parseInt(source, 10)
  for (const item of exchangeTable) {
    const {limit, rate, fee = 0} = item
    if (price > limit) {
      continue;
    }
    return price * rate + fee
  }
  return 0
}
const originPrice = ref('')

watch(originPrice, value => {
  resultPrice.value = calc(value)
})
// const resultPrice = calc(originPrice)
</script>

<template>
  <el-input v-model="originPrice"></el-input>
  <el-input :value="resultPrice"></el-input>
</template>
