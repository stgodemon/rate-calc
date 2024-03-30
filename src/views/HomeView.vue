<script setup>
import { ref, watch } from 'vue'

const resultPrice = defineModel({default: 0})
const exchangeTable = [
  { limit: 1000, rate: 0.06, fee: 6 },
  { limit: 5000, rate: 0.058 },
  { limit: 10000, rate: 0.0575 },
  { limit: 30000, rate: 0.057 },
  { limit: 50000, rate: 0.056 },
  { limit: 100000, rate: 0.0555 },
  { limit: 1000000, rate: 0.055 },
].sort((a, b) => a.limit - b.limit)

function calc(source) {
  const price = parseInt(source, 10)
  if (!price) {
    return 0;
  }
  for (const item of exchangeTable) {
    const {limit, rate, fee = 0} = item
    if (price > limit - 1) {
      continue;
    }
    return Math.floor(price * rate + fee)
  }
  return 0
}
const originPrice = ref('')

watch(originPrice, value => {
  resultPrice.value = calc(value)
})
</script>

<template>
  <el-form-item label="进货价（JPY）">
    <el-input v-model="originPrice"></el-input>
  </el-form-item>
  <el-form-item label="出货价（CNY）">
    <el-input :value="resultPrice"></el-input>
  </el-form-item>
  <el-table :data="exchangeTable" style="width: 100%">
    <el-table-column prop="limit" label="进货价上限（JPY）" width="180" />
    <el-table-column prop="rate" label="汇率" width="180" />
    <el-table-column prop="fee" label="手续费" />
  </el-table>
</template>
