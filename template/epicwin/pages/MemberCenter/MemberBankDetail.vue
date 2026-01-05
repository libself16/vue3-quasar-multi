<template>
  <div class="bank-detail-layout">
    <div class="bank-detail-container">
      <!-- 選擇幣別 -->
      <div class="mt-5">{{ $t("tableHeader.curr") }} :</div>
      <div class="select-row">
        <div
          v-for="item in currencyList"
          :key="item.value"
          class="select-item currency"
          :class="{ active: `${item.value}` === queryParameter.currency_id }"
          @click="setQueryCurrency(`${item.value}`)"
        >
          <span class="ml-1 whitespace-nowrap">{{ $t(item.label) }}</span>
          <div class="checked-selected">
            <i class="fas fa-check"></i>
          </div>
        </div>
      </div>

      <!-- 選擇支付方式 -->
      <div class="mt-5">{{ $t("tableHeader.paymentType") }} :</div>
      <div class="select-row">
        <div
          v-for="item in paymentTypeList"
          :key="item.value"
          class="select-item payment"
          :class="{ active: item.value === queryParameter.payment_type_id }"
          @click="queryParameter.payment_type_id = item.value"
        >
          <i :class="item.iconClass"></i>
          <span class="ml-1 whitespace-nowrap">{{ $t(item.label) }}</span>
          <div class="checked-selected">
            <i class="fas fa-check"></i>
          </div>
        </div>
      </div>

      <div v-if="bankCardState.list.length" class="card-container px-5 flex justify-between">
        <BankCard v-for="item in bankCardState.list" :key="item.id" :card="item" />
      </div>
      <div v-else class="text-center">
        <div>
          {{ $t("common.alarm.pleaseAddCard") }}
        </div>
        <div
          class="inline-block px-1 mt-1 rounded-sm cursor-pointer bg-green-500 text-blue-700"
          @click="router.push({ name: 'memberBankAdd' })"
        >
          {{ $t("common.alarm.clickHereToAdd") }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, watchEffect, computed } from "vue"
import { useRouter } from "vue-router"
import { useBank } from "src/common/composables/useBank"
import { FUND_METHOD_TYPE } from "src/common/utils/constants"
import type * as Request from "src/api/request.type"
import BankCard from "./components/BankCard.vue"

const router = useRouter()
const { bankCardState, currencyList, getBankCardList, getDepositPaymentList, depositState } = useBank()

const queryParameter = reactive<Request.GetBankCardList>({
  currency_id: "0",
  payment_type_id: `${FUND_METHOD_TYPE.Enums.BankTransfer}`
})

const paymentTypeList = computed(() => {
  const currency = currencyList.value.find((e) => e.value === Number(queryParameter.currency_id))?.label || ""
  if (!depositState.list.hasOwnProperty(currency)) {
    return []
  }
  return Object.keys(depositState.list[currency]).map((key) => {
    const value = FUND_METHOD_TYPE.Enums[key as keyof typeof FUND_METHOD_TYPE.Enums]
    const label = FUND_METHOD_TYPE.I18nKeys[value]
    const iconClass = FUND_METHOD_TYPE.iconClass[value]

    return {
      name: key,
      label,
      value: `${value}`,
      iconClass
    }
  })
})

function setQueryCurrency(currency_id: string) {
  queryParameter.currency_id = currency_id
  const currency = currencyList.value.find((e) => e.value === Number(currency_id))?.label || ""
  if (!depositState.list.hasOwnProperty(currency)) {
    queryParameter.payment_type_id = ""
    return
  }

  const paymentTypeList = Object.keys(depositState.list[currency])
  if (!paymentTypeList.length) {
    queryParameter.payment_type_id = ""
    return
  }
  const payment_type_id = FUND_METHOD_TYPE.Enums[paymentTypeList[0] as keyof typeof FUND_METHOD_TYPE.Enums]
  queryParameter.payment_type_id = `${payment_type_id}`
}

watchEffect(() => {
  if (currencyList.value.length) {
    queryParameter.currency_id = `${currencyList.value[0].value}`
  }
})

watchEffect(() => {
  if (queryParameter.currency_id && queryParameter.payment_type_id) {
    getBankCardList(queryParameter)
  }
})

onMounted(async () => {
  await getDepositPaymentList()
  await getBankCardList()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/epicwin/css/_variable.sass'
@import 'app/template/epicwin/css/button.sass'
@import 'app/template/epicwin/css/form.sass'


.bank-detail-layout
  @apply p-5 mx-auto rounded-lg w-full
  +phone-width
    @apply p-4
  .bank-detail-container
    @apply p-5
    background-color: $member-nav-bg-color
    +phone-width
      @apply p-4
</style>
