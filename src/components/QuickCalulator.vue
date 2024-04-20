<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  policy: Object,
})

const exchangeTable = props.policy;
const resultPrice = defineModel({default: 0})

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
  <el-card>
    <template #header>
      <el-text size="large" class="card-header">速算</el-text>
    </template>
    <el-form-item label="进货价（JPY）">
      <el-input v-model="originPrice"></el-input>
    </el-form-item>
    <el-form-item label="出货价（CNY）">
      <el-input :value="resultPrice" readonly></el-input>
    </el-form-item>
  </el-card>
</template>
