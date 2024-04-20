<script setup>
import QuickCalulator from '../components/QuickCalulator.vue';
import RealTimeRate from '../components/RealTimeRate.vue';
import PolicyTable from '../components/PolicyTable.vue';
import exchangeTable from '../config/exchange.js';

const rate = defineModel('rate', {default: 0});
const updateTime = defineModel('updateTime', {default: 0});

async function updateRate() {
    const response = await fetch('https://dafrokcurrencyapi.azurewebsites.net/api/latest');
    const data = await response.json();
    rate.value = data[0];
    updateTime.value = data[1];
}

updateRate();

</script>

<template>
  <QuickCalulator :policy="exchangeTable" :rate="rate" />
  <RealTimeRate :rate="rate" :updateTime="updateTime" @updateRate="updateRate" />
  <PolicyTable :policy="exchangeTable" />
</template>
<style>

.card-header {
    color: #2a598a
}
</style>