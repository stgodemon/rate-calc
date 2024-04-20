
<script setup>import {
    Refresh
} from '@element-plus/icons-vue'
const rate = defineModel('rate', {default: 0});
const updateTime = defineModel('updateTime', {default: 0});

async function updateRate() {
    const response = await fetch('https://dafrokcurrencyapi.azurewebsites.net/api/latest');
    const data = await response.json();
    rate.value = data[0];
    updateTime.value = new Date(data[1]);
}

updateRate();

</script>

<template>
    <el-card class="box-card">
        <template #header>
            <el-text size="large" class="card-header">实时汇率</el-text>
        </template>
        <div v-if="rate">
            <el-row style="align-items: center;">
                <el-text class="rate-text vertical-middle"><b>{{ rate }}</b>&nbsp;</el-text>
                <el-button class="vertical-middle" :icon="Refresh" round @click="updateRate">刷新</el-button>
            </el-row>
            <el-row class="box-card">
                <el-text size="small" style="color: #a6a9ad">更新时间：{{updateTime}}</el-text>
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