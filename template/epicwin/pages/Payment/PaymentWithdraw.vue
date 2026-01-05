<template>
  <div class="withdraw-layout">
    <!-- 選擇幣別 -->
    <div class="nav-content">
      <div
        v-for="(item, key) in withdrawState.supportedCurrency"
        :key="key"
        class="nav-item"
        :class="{ active: `${item}` === withdrawState.form.currency }"
        @click="handleWithdralCurrencyClick(item)"
      >
        <div class="mt-2">
          {{ $t(item) }}
        </div>
      </div>
    </div>
    <div class="withdraw-container">
      <!-- 選擇支付類型 -->
      <label class="col-form-label">{{ $t("tableHeader.paymentType") }} : </label>
      <div class="payment-row">
        <div
          v-for="item in withdrawState.fundTypeList"
          :key="item"
          class="payment-item"
          :class="{ active: item === `${withdrawState.usingFundType}` }"
          @click="handleWithdralFundTypeClick(item)"
        >
          <!-- <i :class="item.iconClass"></i> -->
          <span class="ml-1 whitespace-nowrap">{{ $t(item) }}</span>
          <div class="checked-selected">
            <i class="fas fa-check"></i>
          </div>
        </div>
      </div>
      <!-- 選擇支付方式 -->
      <label v-if="withdrawState.usingFundType !== 'BankTransfer'" class="col-form-label"
        >{{ $t("tableHeader.paymentChannel") }} :
      </label>
      <div class="payment-row" v-if="withdrawState.usingFundType !== 'BankTransfer'">
        <div
          v-for="(item, key) in withdrawState.usingPaymentInfoList"
          :key="key"
          class="payment-item"
          :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
          @click="handleWithdralPaymentClick(item.type, item.id)"
        >
          <!-- <i :class="item.iconClass"></i> -->
          <span class="ml-1 whitespace-nowrap">{{ $t(item.name) }}</span>
          <div class="checked-selected">
            <i class="fas fa-check"></i>
          </div>
        </div>
      </div>

      <!-- 選擇銀行卡 -->
      <label class="col-form-label">{{ $t("tableHeader.selesctBank") }} : </label>
      <div class="payment-row">
        <BankCard :card-list="withdrawState.bankCards" @updateBankId="(id) => handleWithdralBankCardClick(id)" />
      </div>

      <!-- 支付金額 -->
      <label class="col-form-label">{{ $t("tableHeader.amount") }}</label>
      <div class="payment-row">
        <input type="text" class="form-control" v-model="withdrawState.form.amount" />
      </div>

      <div class="flex justify-center my-8">
        <button :disabled="withdrawState.form.amount === ''" class="btn" @click="handleWithdralSubmit">
          {{ $t("common.btn.withdral") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useBank } from "src/common/composables/useBank"
import { onMounted } from "vue"
import BankCard from "./components/BankCard.vue"

const {
  withdrawState,
  getWithdralPaymentList,
  handleWithdralCurrencyClick,
  handleWithdralFundTypeClick,
  handleWithdralPaymentClick,
  handleWithdralBankCardClick,
  handleWithdralSubmit
} = useBank()

onMounted(() => {
  getWithdralPaymentList()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/epicwin/css/_variable.sass'
@import 'app/template/epicwin/css/button.sass'
@import 'app/template/epicwin/css/form.sass'

.nav-content
  @apply w-full flex font-bold overflow-x-auto
  background-color: $member-nav-bg-color
  border-bottom: 10px solid #280056
  .nav-item
    @apply w-1/4 text-center flex flex-col items-center py-4 m-2 cursor-pointer
    filter: grayscale(1)
    &.active
      border: 1px solid #7a18a5
      background-color: #7a18a5
      filter: grayscale(0)
    .nav-img
      max-width: 3.125rem

.withdraw-layout
  @apply p-5 mx-auto rounded-lg w-full
  +phone-width
    @apply p-4
  .withdraw-container
    @apply p-5
    background-color: $member-nav-bg-color
    +phone-width
      @apply p-4
    .payment-row
      @apply p-5 mb-3 flex overflow-auto
      +iphone-width
        @apply flex-col
      .payment-item
        @apply py-3 px-10 my-1 cursor-pointer relative text-center flex items-center text-base
        .checked-selected
          display: none
        &.active
          border: 1px solid $member-payment-type-border-color
          .checked-selected
            @apply block absolute top-0 right-0 w-5
            background-color: $member-payment-type-check-color
</style>
