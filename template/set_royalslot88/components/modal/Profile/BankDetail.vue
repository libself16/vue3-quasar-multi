<template>
  <div class="af-bnk-wrap">
    <BankCard
      v-for="item in bankCardState.list"
      :key="item.id"
      :card="item"
      :activeId="activeId"
      :bankList="bankList"
      :gatewayFilterList="gatewayFilterList"
      @click="activeId = item.id"
      @updateList="getBankCardList"
    />
    <BankCardAdd />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useBank } from "src/common/composables/useBank"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import BankCard from "../../BankCard/Index.vue"
import BankCardAdd from "../../BankCard/Add.vue"

const { bankCardState, getBankCardList, bankList, gatewayFilterList, getGatewayList, getBankList } = useBank()
const eventbus = injectStrict(EventBusKey)
const activeId = ref(0)

onMounted(() => {
  getBankCardList()
  getGatewayList()
  getBankList()
  eventbus.on("updateBankCardList", getBankCardList)
})
</script>

<style lang="scss" scoped>
@import "app/template/set_royalslot88/assets/css/withdrawal.css";
</style>
