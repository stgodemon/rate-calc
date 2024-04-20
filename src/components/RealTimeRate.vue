
<script setup>
import {
    Refresh
} from '@element-plus/icons-vue'

defineProps({
    rate: Number,
    updateTime: Number,
})

</script>

<template>
    <el-card class="box-card">
        <template #header>
            <el-text size="large" class="card-header">实时参考汇率</el-text>
        </template>
        <div v-if="rate">
            <el-row style="align-items: center;">
                <el-text class="rate-text vertical-middle"><b>{{ rate }}</b>&nbsp;</el-text>
                <el-button class="vertical-middle" :icon="Refresh" round @click="$emit('updateRate')">刷新</el-button>
            </el-row>
            <el-row class="box-card">
                <el-text size="small" style="color: #a6a9ad">更新时间：{{new Date(updateTime)}}</el-text>
            </el-row>
            <el-row class="box-card">
                <el-link icon="link" type="primary" href="https://www.kylc.com/huilv/d-unionpay-jpy.html" target="_blank">查看银联精确汇率</el-link>
            </el-row>
        </div>
        <div v-else>
            <el-text>正在加载实时汇率...</el-text>
        </div>
    </el-card>
</template>

<style scoped>
.box-card {
    margin-top: 8px;
}
.rate-text {
    font-size: 28px;
}
</style>