<script setup>
import { ref, watch, computed } from 'vue'
import { useTransition } from '@vueuse/core'

const props = defineProps({
  policy: Object,   // 价格策略表
  rate: Number,     // 实时参考汇率（CNY/JPY）
})

const exchangeTable = props.policy

// 向外暴露：出货价（无折扣） & 日元利润（无折扣）
const sellingPrice = defineModel('sellingPrice', { default: 0 })
const resultProfit = defineModel('resultProfit', { default: 0 })

// 进货价（JPY）
const originPrice = ref('')

// 本月结算汇率（手动输入）
const manualRate = ref('0.0469')

// 实际用于“成本”计算的汇率（CNY/JPY）
const effectiveRate = computed(() => {
  const v = parseFloat(manualRate.value)
  if (Number.isFinite(v) && v > 0) {
    return v
  }
  return props.rate || 0
})

// —— 折扣率（用户输入 98 / 97 这种） —— //
const discountRate1 = ref('98')
const discountRate2 = ref('97')

// 把输入转成折扣系数：
//  - 98 → 0.98
//  - 97 → 0.97
//  - 0.95 → 0.95
//  - 其它乱输 → 1（按原价）
function parseDiscountInput(v) {
  let d = parseFloat(v)
  if (!Number.isFinite(d) || d <= 0) return 1
  if (d >= 10) d = d / 100
  if (d > 1.5) d = 1
  return d
}

const discount1 = computed(() => parseDiscountInput(discountRate1.value))
const discount2 = computed(() => parseDiscountInput(discountRate2.value))

// 基础数据
const strategyRate = ref(0)        // 无折扣策略汇率 (CNY/JPY)
const baseSellingPrice = ref(0)    // 无折扣出货价 (CNY)

// 便于模板使用的数值进货价
const originPriceNumber = computed(() => parseInt(originPrice.value, 10) || 0)

// —— 根据进货价 & 有效汇率，计算基础出货价和利润 —— //
function recalcBase() {
  const price = originPriceNumber.value
  const er = effectiveRate.value

  if (!price) {
    strategyRate.value = 0
    baseSellingPrice.value = 0
    sellingPrice.value = 0
    resultProfit.value = 0
    return
  }

  // 从策略表中找到对应档位
  let matched = null
  for (const item of exchangeTable) {
    const { limit } = item
    if (price <= limit) {
      matched = item
      break
    }
  }

  if (!matched) {
    strategyRate.value = 0
    baseSellingPrice.value = 0
    sellingPrice.value = 0
    resultProfit.value = 0
    return
  }

  const { rate, fee = 0 } = matched
  strategyRate.value = rate

  const selling = Math.floor(price * rate + fee) // 代购价（无折扣，整数 CNY）
  baseSellingPrice.value = selling

  // 用无折扣方案算一遍日元利润，暴露给外部
  if (er && price) {
    const costCny = price * er
    const profitCny = selling - costCny
    const profitJpy = profitCny / er
    sellingPrice.value = selling
    resultProfit.value = Math.floor(profitJpy)
  } else {
    sellingPrice.value = selling
    resultProfit.value = 0
  }
}

// 进货价或使用汇率变化时，重新计算基础数据
watch([originPrice, effectiveRate], () => {
  recalcBase()
})

// —— 折扣后的出货价 —— //
const discountedPrice1 = computed(() =>
  Math.floor(baseSellingPrice.value * discount1.value)
)
const discountedPrice2 = computed(() =>
  Math.floor(baseSellingPrice.value * discount2.value)
)

// 折扣后的“使用汇率”（策略汇率 * 折扣）
const strategyRate1 = computed(() =>
  strategyRate.value * discount1.value
)
const strategyRate2 = computed(() =>
  strategyRate.value * discount2.value
)

// —— 三种方案的人民币利润（保留两位小数） —— //
function calcProfitCny(sellPriceCny) {
  const er = effectiveRate.value
  const price = originPriceNumber.value
  if (!er || !price || !sellPriceCny) return 0
  const cost = price * er
  const diff = sellPriceCny - cost
  return Math.round(diff * 100) / 100   // 保留两位
}

const profitCny0 = computed(() => calcProfitCny(baseSellingPrice.value))
const profitCny1 = computed(() => calcProfitCny(discountedPrice1.value))
const profitCny2 = computed(() => calcProfitCny(discountedPrice2.value))

// —— 三种方案的日元利润（整数） —— //
function cnyToJpy(cny) {
  const er = effectiveRate.value
  if (!er) return 0
  return Math.floor(cny / er)
}

const profitJpy0 = computed(() => cnyToJpy(profitCny0.value))
const profitJpy1 = computed(() => cnyToJpy(profitCny1.value))
const profitJpy2 = computed(() => cnyToJpy(profitCny2.value))

// —— 手动代购 —— //
const manualDaigouPrice = ref('')  // CNY 出货价（手动代购）

const daigouProfitCny = computed(() => {
  const sell = parseFloat(manualDaigouPrice.value)
  const er = effectiveRate.value
  const price = originPriceNumber.value
  if (!Number.isFinite(sell) || sell <= 0 || !er || !price) return 0
  const cost = price * er
  const diff = sell - cost
  return Math.round(diff * 100) / 100
})

const daigouProfitJpy = computed(() => cnyToJpy(daigouProfitCny.value))

// 手动代购对应的「使用汇率」 = 出货价 / 进货价
const manualDaigouRate = computed(() => {
  const price = originPriceNumber.value
  const sell = parseFloat(manualDaigouPrice.value)
  if (!price || !Number.isFinite(sell) || sell <= 0) return 0
  return sell / price
})

// —— 动画过渡 —— //
const outputBaseSelling = useTransition(baseSellingPrice, { duration: 200 })
const outputDiscountPrice1 = useTransition(discountedPrice1, { duration: 200 })
const outputDiscountPrice2 = useTransition(discountedPrice2, { duration: 200 })

// —— 辅助格式化 —— //
function formatRate4(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n.toFixed(4) : '0.0000'
}

function formatMoney2(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n.toFixed(2) : '0.00'
}
</script>

<template>
  <el-card>
    <template #header>
      <el-text size="large" class="card-header">速算</el-text>
    </template>

    <!-- 本月结算汇率 -->
    <el-form-item label="本月结算汇率">
      <el-input
        v-model="manualRate"
        type="number"
        placeholder="不填或填错则使用实时汇率"
      >
        <template #append>CNY / JPY</template>
      </el-input>
    </el-form-item>

    <el-text size="small" type="info">
      当前用于估算利润的汇率：
      {{ effectiveRate || 0 }}
      <span v-if="manualRate">（使用自定义月汇率）</span>
      <span v-else>（使用实时参考汇率）</span>
    </el-text>

    <el-divider />

    <!-- 四列矩阵：无折扣 / 折扣价1 / 折扣价2 / 手动代购 -->
    <div style="overflow-x: auto; margin-top: 12px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 4px 8px;">
              快速计算利润
            </th>
            <th style="text-align: center; padding: 4px 8px;">无折扣</th>
            <th style="text-align: center; padding: 4px 8px;">折扣价1</th>
            <th style="text-align: center; padding: 4px 8px;">折扣价2</th>
            <th style="text-align: center; padding: 4px 8px;">手动代购</th>
          </tr>
        </thead>
        <tbody>
          <!-- 第一行：商品价格 / 折扣设置 / 手动代购买价输入 -->
          <tr>
            <th style="text-align: left; padding: 4px 8px;">
              商品价格/折扣率
            </th>

            <!-- 无折扣：进货价 -->
            <td style="padding: 4px 8px;">
              <el-input v-model="originPrice" type="number" size="small">
                
              </el-input>
            </td>

            <!-- 折扣率1：输入 98/97 这类 -->
            <td style="padding: 4px 8px;">
              <el-input
                v-model="discountRate1"
                type="number"
                size="small"
                placeholder="如 98"
              >
                
              </el-input>
            </td>

            <!-- 折扣率2 -->
            <td style="padding: 4px 8px;">
              <el-input
                v-model="discountRate2"
                type="number"
                size="small"
                placeholder="如 97"
              >
                
              </el-input>
            </td>

            <!-- 手动代购：这里先留空，代购在下一行输入 -->
            <td style="padding: 4px 8px;">
              <el-input
                :model-value="originPrice"
                disabled
                size="small"
              >
              
            </el-input>
            </td>
          </tr>

          <!-- 第二行：代购价格 (CNY) -->
          <tr>
            <td style="padding: 4px 8px;">代购价格 (CNY)</td>

            <!-- 无折扣代购价（整数） -->
            <td style="text-align: right; padding: 4px 8px;">
              {{ outputBaseSelling }}
            </td>

            <!-- 折扣1代购价 -->
            <td style="text-align: right; padding: 4px 8px;">
              {{ outputDiscountPrice1 }}
            </td>

            <!-- 折扣2代购价 -->
            <td style="text-align: right; padding: 4px 8px;">
              {{ outputDiscountPrice2 }}
            </td>

            <!-- 手动代购出货价输入 -->
            <td style="padding: 4px 8px;">
              <el-input
                v-model="manualDaigouPrice"
                type="number"
                size="small"
                placeholder="手动输入代购价"
              >                
              </el-input>
            </td>
          </tr>

          <!-- 第三行：使用汇率 (卖价 / 进货价)，保留四位小数 -->
          <tr>
            <td style="padding: 4px 8px;">使用汇率 (CNY/JPY)</td>
            <td style="text-align: right; padding: 4px 8px;">
              {{ formatRate4(strategyRate) }}
            </td>
            <td style="text-align: right; padding: 4px 8px;">
              {{ formatRate4(strategyRate1) }}
            </td>
            <td style="text-align: right; padding: 4px 8px;">
              {{ formatRate4(strategyRate2) }}
            </td>
            <td style="text-align: right; padding: 4px 8px;">
              {{ formatRate4(manualDaigouRate) }}
            </td>
          </tr>

          <!-- 第四行：人民币利润 (CNY) -->
          <tr>
            <td style="padding: 4px 8px;">人民币利润 (CNY)</td>
            <td style="text-align: right; padding: 4px 8px;">
              {{ formatMoney2(profitCny0) }}
            </td>
            <td style="text-align: right; padding: 4px 8px;">
              {{ formatMoney2(profitCny1) }}
            </td>
            <td style="text-align: right; padding: 4px 8px;">
              {{ formatMoney2(profitCny2) }}
            </td>
            <td style="text-align: right; padding: 4px 8px;">
              {{ formatMoney2(daigouProfitCny) }}
            </td>
          </tr>

          <!-- 第五行：日元利润 (JPY) -->
          <tr>
            <td style="padding: 4px 8px;">日元利润 (JPY)</td>
            <td style="text-align: right; padding: 4px 8px;">
              {{ profitJpy0 }}
            </td>
            <td style="text-align: right; padding: 4px 8px;">
              {{ profitJpy1 }}
            </td>
            <td style="text-align: right; padding: 4px 8px;">
              {{ profitJpy2 }}
            </td>
            <td style="text-align: right; padding: 4px 8px;">
              {{ daigouProfitJpy }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </el-card>
</template>


<style scoped>
:deep(.el-input__inner) {
  text-align: right;
}
</style>

