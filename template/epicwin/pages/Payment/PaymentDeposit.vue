<template>
  <div class="deposit-layout">
    <!-- 選擇幣別 -->
    <div class="nav-content">
      <div
        v-for="(item, key) in depositState.supportedCurrency"
        :key="key"
        class="nav-item"
        :class="{ active: `${item}` === depositState.form.currency }"
        @click="handleDepositCurrencyClick(item)"
      >
        <div class="mt-2">
          {{ $t(item) }}
        </div>
      </div>
    </div>
    <div class="deposit-container">
      <!-- 選擇支付類型 -->
      <label class="col-form-label">{{ $t("tableHeader.paymentType") }} : </label>
      <div class="payment-type-row">
        <div
          v-for="item in depositState.fundTypeList"
          :key="item"
          class="payment-type-item"
          :class="{ active: item === `${depositState.usingFundType}` }"
          @click="handleDepositFundTypeClick(item)"
        >
          <!-- <i :class="item.iconClass"></i> -->
          <span class="ml-1 whitespace-nowrap">{{ $t(item) }}</span>
          <div class="checked-selected">
            <i class="fas fa-check"></i>
          </div>
        </div>
      </div>

      <!-- 選擇支付方式 -->
      <label class="col-form-label">{{ $t("tableHeader.paymentChannel") }} : </label>
      <div class="payment-type-row">
        <div
          v-for="(item, key) in depositState.usingPaymentInfoList"
          :key="key"
          class="payment-type-item"
          :class="{ active: String(item.id) === `${depositState.form.payment_gateway_id}` }"
          @click="handleDepositPaymentClick(item.id)"
        >
          <!-- <i :class="item.iconClass"></i> -->
          <span class="ml-1 whitespace-nowrap">{{ $t(item.name) }}</span>
          <div class="checked-selected">
            <i class="fas fa-check"></i>
          </div>
        </div>
      </div>

      <!-- 顯示銀行資料 -->
      <label v-if="depositState.usingFundType === 'BankTransfer'" class="col-form-label"
        >{{ $t("tableHeader.bankAccount") }} :
      </label>
      <div v-if="depositState.usingFundType === 'BankTransfer'" class="payment-type-row">
        <div class="bank-box">
          <span>{{ depositState.paymentDetail.bank_account }}</span>
          <div class="qr-code">
            <img :src="depositState.paymentDetail.imgUrl" alt="" />
          </div>
        </div>
      </div>

      <!-- 支付金額 -->
      <label class="col-form-label">{{ $t("tableHeader.amount") }} : </label>
      <div class="payment-amount-row">
        <!-- <div>{{ $t("member.profile.email") }} :</div> -->
        <div>
          <input type="text" class="form-control" v-model="depositState.form.amount" />
        </div>
      </div>

      <div class="flex justify-center my-8">
        <button :disabled="depositState.form.amount === ''" class="btn" @click="handleDepositSubmit">
          {{ $t("common.btn.deposit") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useBank } from "src/common/composables/useBank"
import { onMounted } from "vue"

const {
  depositState,
  getDepositPaymentList,
  handleDepositCurrencyClick,
  handleDepositFundTypeClick,
  handleDepositPaymentClick,
  handleDepositSubmit
} = useBank()

onMounted(() => {
  getDepositPaymentList()
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

.deposit-layout
  width: 100%
  @apply p-5 mx-auto rounded-lg w-full
  +phone-width
    @apply p-4
  .deposit-container
    @apply p-5
    background-color: $member-nav-bg-color
    +phone-width
      @apply p-4
    .payment-type-row
      @apply p-5 mb-3 flex overflow-auto
      +iphone-width
        @apply flex-col
      .bank-box
        @apply py-3 px-10 my-1 relative text-center flex flex-col items-start text-base
        border: 1px solid #7a18a5
        // background: #000000
        // border-radius: 1rem
        width: 100%
        height: auto
        min-height: 25vw
        span
          @apply py-3 cursor-pointer
        .qr-code
          width: 150px
      .payment-type-item
        @apply py-3 px-10 my-1 cursor-pointer relative text-center flex items-center text-base
        .checked-selected
          display: none
        &.active
          border: 1px solid $member-payment-type-border-color
          .checked-selected
            @apply block absolute top-0 right-0 w-5
            background-color: $member-payment-type-check-color
</style>
