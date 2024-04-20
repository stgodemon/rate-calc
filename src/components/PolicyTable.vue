<script setup>
defineProps({
  policy: Object,
})
</script>
<template>
    <el-card class="box-card box-card-full">
        <template #header>
            <el-text size="large" class="card-header">价格策略</el-text>
        </template>
        <div>
            <el-table :data="policy" stripe border>
                <el-table-column prop="limit" label="进货价上限（JPY）" width="150" />
                <el-table-column prop="rate" label="实算汇率" width="120" />
                <el-table-column prop="fee" label="手续费" />
            </el-table>
        </div>
    </el-card>
</template>

<style scoped>
.box-card {
    margin-top: 8px;
}
</style>