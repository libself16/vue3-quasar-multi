<template>
  <q-card class="withdrawal-layout">
    <!-- VIP暫時隱藏 -->
    <!-- <VipCard /> -->
    <q-form @submit="handleWithdralSubmit">
      <q-card-section class="withdrawal-container">
        <div class="currency-row">
          <div class="currency-title">{{ $t("member.bank.selectCurrency") }}</div>
          <div class="currency-btns">
            <q-btn
              v-for="(item, key) in withdrawState.supportedCurrency"
              :key="key"
              :class="{ active: `${item}` === withdrawState.form.currency }"
              @click="handleWithdralCurrencyClick(item)"
              color="currency"
              class="mr-5"
            >
              {{ $t(item) }}
            </q-btn>
          </div>
        </div>
        <div class="payment-info-container">
          <ul class="payment-type-container">
            <li
              v-for="item in withdrawState.fundTypeList"
              :key="item"
              :class="{ active: item === `${withdrawState.usingFundType}` }"
              @click="handleWithdralFundTypeClick(item)"
            >
              <span>{{ $t(`member.bank.${item}`) }}</span>
            </li>
          </ul>
          <div class="payment-form">
            <!-- 支付方式 -->
            <div class="form-row" v-if="!withdrawState.gateWayHidden">
              <label class="form-title">{{ $t("member.bank.withdrawalChannel") }}:</label>
              <div class="form-methods">
                <div
                  v-for="(item, key) in withdrawState.usingPaymentInfoList"
                  :key="key"
                  class="method-item"
                  :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
                  @click="handleWithdralPaymentClick(item.type, item.id)"
                >
                  <img :src="item.imgUrl" alt="" class="w-full h-full p-1" />
                </div>
              </div>
            </div>
            <div class="bank-cards">
              <BankCard
                v-for="item in withdrawState.bankCards"
                :key="item.id"
                :card="item"
                :bankList="bankList"
                :gatewayFilterList="gatewayFilterList"
                :activeId="withdrawState.form.bank_id"
                @click="handleWithdralBankCardClick(item.id)"
              />
              <AddBankCard @click="router.push({ name: 'ProfileBank' })" />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="withdrawal-container">
        <div class="form-row-amount">
          <label class="form-title">{{ $t("member.withdrawal.balance") }}:</label>
          <q-input
            v-model.trim="withdrawState.form.balance"
            bg-color="white"
            outlined
            class="form-input"
            :disable="true"
          />
        </div>
        <div class="form-row-amount">
          <label class="form-title">{{ $t("member.withdrawal.auditTurnover") }}:</label>
          <q-input
            v-model.trim="withdrawState.form.remaining_turnover"
            bg-color="white"
            outlined
            class="form-input"
            :disable="true"
          />
        </div>
        <div class="form-row-amount">
          <label class="form-title">{{ $t("member.withdrawal.withdrawalAmmount") }}:</label>
          <q-input
            v-if="withdrawState.gateWayHidden"
            v-model.trim="withdrawState.form.amount"
            bg-color="white"
            outlined
            class="form-input"
            :placeholder="`${$t('member.deposit.withdrawAmount')}`"
            lazy-rules
            @keypress="Rules.validatePositiveNumber"
            inputmode="decimal"
            :rules="[Rules.requiredInt]"
          />
          <q-input
            v-else
            v-model.trim="withdrawState.form.amount"
            bg-color="white"
            outlined
            class="form-input"
            :placeholder="`${$t('member.deposit.withdrawAmount')}`"
            lazy-rules
            @keypress="Rules.validatePositiveNumber"
            inputmode="decimal"
            :rules="[Rules.requiredInt]"
          />
        </div>
        <div class="form-row-submit">
          <q-btn rounded color="submit" push :label="$t('common.btn.submit')" type="submit" class="btn-submit" />
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { useBank } from "src/common/composables/useBank"
import { useRule } from "src/common/hooks/useRule"
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import AddBankCard from "./components/AddBankCard.vue"
import BankCard from "./components/BankCard.vue"

const router = useRouter()
const Rules = useRule()
const {
  withdrawState,
  bankList,
  gatewayFilterList,
  getBankList,
  getGatewayList,
  getWithdralPaymentList,
  handleWithdralCurrencyClick,
  handleWithdralFundTypeClick,
  handleWithdralPaymentClick,
  handleWithdralBankCardClick,
  handleWithdralSubmit
} = useBank()

onMounted(() => {
  getWithdralPaymentList()
  getBankList()
  getGatewayList()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/set33_BLUE/assets/css/button.sass'

.withdrawal-layout
  @apply block text-white bg-transparent shadow-none
  min-height: 37.5rem
  border-radius: .625rem
  .withdrawal-container
    @apply text-white mt-2 p-6 w-full rounded-lg
    background: #021524
    border: 1px solid #086eb8
    +pad-width
      @apply mt-0 rounded-none
      padding: 1.25rem .625rem .625rem
      border: 0
    .currency-row
      @apply relative w-full mx-auto mb-8 pb-4 flex items-center
      border-bottom: 1px solid #0f9fdc
      +pad-width
        @apply flex-wrap
      .currency-title
        width: 37%
        +pad-width
          width: 100%
      .currency-btns
        @apply w-full p-0 flex items-center overflow-auto
        +pad-width
          @apply mt-3
    .payment-info-container
      @apply w-full flex justify-between gap-5
      +pad-width
        @apply flex-col p-3
      .payment-type-container
        @apply flex flex-col gap-3 mr-3
        width: 12.5rem
        +pad-width
          @apply w-full grid grid-cols-2
        li
          @apply list-none text-white text-sm cursor-pointer
          background: #08192b
          border-radius: 3.125rem
          border: 1px solid #0c9bd5
          padding: .625rem 0 .625rem .9375rem
          +pad-width
            +setFlex
            @apply text-xs p-1 text-center
          &.active, &:hover
            background: linear-gradient(to bottom, rgb(16, 183, 243) 0%, rgb(12, 112, 170) 33%, rgb(8, 93, 143) 100%)
      .payment-form
        width: 72%
        +pad-width
          width: 100%
        .form-row
          @apply flex mb-5 items-center
          +pad-width
            @apply flex-wrap gap-4
          .form-title
            @apply m-0 font-bold
            width: 12rem
            color: #0c9bd5
            +pad-width
              @apply w-full
          .form-methods
            @apply flex flex-wrap justify-start gap-1
            width: 70%
            +pad-width
              @apply w-full grid grid-cols-4 gap-0
            +phone-width
              @apply grid-cols-3
            .method-item
              @apply relative w-auto flex justify-center items-center rounded-lg p-0 cursor-pointer
              height: 2.8125rem
              max-width: 30%
              margin: .3125rem
              border: 1px solid #079ad9
              +pad-width
                height: 2.1875rem
                max-width: fit-content
              &.active
                background: linear-gradient(to bottom,rgb(16,183,243) 0%,rgb(12,112,170) 33%,rgb(8,93,143) 100%)
                color: #fff
        .bank-cards
          @apply grid grid-cols-2 gap-4
          +phone-width
            @apply grid-cols-1
    .form-row-amount
      @apply flex items-center my-3
      +pad-width
        @apply flex-wrap gap-3
      .form-title
        @apply m-0 font-bold text-white
        width: 30%
        +pad-width
          @apply w-full
      .form-input
        width:  70%
        +pad-width
          @apply w-full
        :deep(.q-field__control)
          height: 2.375rem
          min-height: auto
          .q-field__native
            min-height: auto
          .q-field__append
            height: 2.375rem
    .form-row-submit
      @apply flex justify-end
      +pad-width
        .bg-submit
          @apply w-full
</style>
