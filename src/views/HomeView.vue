<script setup>
import QuickCalulator from '../components/QuickCalulator.vue';
import RealTimeRate from '../components/RealTimeRate.vue';
import PolicyTable from '../components/PolicyTable.vue';
import exchangeTable from '../config/exchange.js';
</script>

<template>
  <QuickCalulator :policy="exchangeTable" />
  <RealTimeRate />
  <PolicyTable :policy="exchangeTable" />
</template>
<style>

.card-header {
    color: #2a598a
}
</style>