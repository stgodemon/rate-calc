<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  policy: Object,
  rate: Number,
})
const exchangeTable = props.policy;
const sellingPrice = defineModel('sellingPrice', {default: 0});
const resultProfit = defineModel('resultProfit', {default: 0});

function calc(source) {
  const price = parseInt(source, 10)
  if (!price) {
    return [0, 0];
  }
  for (const item of exchangeTable) {
    const {limit, rate, fee = 0} = item
    if (price > limit - 1) {
      continue;
    }
    const sellingPrice = Math.floor(price * rate + fee);
    const profit = Math.floor(props.rate ? (price * rate - price * props.rate + fee) / props.rate : 0);
    return [sellingPrice, profit];
  }
  return [0, 0];
}
const originPrice = ref('')

watch(originPrice, value => {
  const [price, profit] = calc(value);
  sellingPrice.value = price;
  resultProfit.value = profit;
})
</script>
<template>
  <el-card>
    <template #header>
      <el-text size="large" class="card-header">速算</el-text>
    </template>
    <el-form-item label="进货价">
      <el-input v-model="originPrice">
        <template #append>JPY￥</template>
      </el-input>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-statistic title="出货价" :value="sellingPrice">
          <template #suffix> <el-text size="small">CNY</el-text></template>
        </el-statistic>
      </el-col>
      <el-col :span="12">
        <el-statistic title="估算利润" :value="resultProfit">
          <template #suffix> <el-text size="small">JPY</el-text></template>
        </el-statistic>
      </el-col>
    </el-row>
  </el-card>
</template>
