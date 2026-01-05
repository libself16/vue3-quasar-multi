<template>
  <BannerMember />
  <div class="profile-layout">
    <div class="profile-content">
      <PaymentNav />
      <q-form @submit="handleWithdralSubmit">
        <div class="profile-form column">
          <div class="form-title-content">
            <div class="color-label"></div>
            <div class="title">
              <p>{{ $t("member.withdrawal.title") }}</p>
            </div>
          </div>
          <p v-if="envInfo.withdraw_kyc_verify === 1 && !userInfo.approval_status" class="withdrawal-kyc-text">
            <q-img :src="withdrawalKycImg" alt="withdrawal-kyc" class="withdrawal-kyc-img" contain />
            <span>{{ $t("common.validate.withdrawalKyc") }}</span>
          </p>
          <div class="form-content">
            <!-- currency -->
            <div class="form-item row mb-5">
              <div class="label col-12">{{ $t("member.deposit.selectCurrency") }}</div>
              <div class="radio-content col-12 col-sm-10">
                <q-radio
                  v-for="item in withdrawState.supportedCurrency"
                  :key="item"
                  dense
                  v-model="withdrawState.form.currency"
                  @click="handleWithdralCurrencyClick(item)"
                  :val="item"
                  :label="$t(item as string)"
                  checked-icon="circle"
                />
              </div>
            </div>
            <!-- type -->
            <div class="form-item row mb-5">
              <div class="label col-12">{{ $t("member.deposit.type") }}</div>
              <div class="radio-content col-12 col-sm-10">
                <q-radio
                  v-for="item in withdrawState.fundTypeList"
                  :key="item"
                  dense
                  :model-value="withdrawState.usingFundType"
                  @update:model-value="handleWithdralFundTypeClick(item)"
                  :val="item"
                  :label="$t('member.bank.'+item as string)"
                  checked-icon="circle"
                />
              </div>
            </div>
            <!-- bank account -->
            <div class="form-item row mb-5">
              <div class="payment-form">
                <!-- 支付方式 -->
                <div class="form-row" v-if="!withdrawState.gateWayHidden">
                  <div class="label col-12">{{ $t("modal.gateway") }}</div>
                  <div class="form-methods">
                    <div
                      v-for="(item, key) in withdrawState.usingPaymentInfoList"
                      :key="key"
                      class="method-item"
                      :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
                    >
                      <img
                        :src="item.imgUrl"
                        alt=""
                        class="w-auto"
                        @click="handleWithdralPaymentClick(item.type, item.id)"
                      />
                    </div>
                  </div>
                </div>

                <div class="card-container">
                  <BankCard
                    v-for="item in withdrawState.bankCards"
                    :key="item.id"
                    :card="item"
                    :activeId="withdrawState.form.bank_id"
                    :bankList="bankList"
                    :gatewayFilterList="gatewayFilterList"
                    @click="handleWithdralBankCardClick(item.id)"
                    @updateList="getWithdrawBankCardList"
                  />
                  <AddBankCard @click="router.push({ name: 'memberBank' })" />
                </div>
              </div>
            </div>
            <div class="form-item row mb-5">
              <div class="label col-12">{{ $t("member.withdrawal.withdrawalAmmount") }}</div>
              <div class="input-content col-12 col-sm-4">
                <q-input
                  standout
                  v-model="withdrawState.form.amount"
                  rounded
                  outlined
                  dense
                  borderless
                  :rules="[Rules.required()]"
                  lazy-rules
                  @keypress="Rules.validatePositiveNumber"
                  inputmode="decimal"
                  :placeholder="`${$t('member.deposit.withdrawAmount')}`"
                />
              </div>
            </div>
            <div v-if="needWithdrawalPassword" class="form-item row mb-5">
              <div class="label col-12">{{ $t("member.withdrawal.withdrawPassword") }}</div>
              <div class="input-content col-12 col-sm-4">
                <q-input
                  standout
                  v-model="withdrawState.form.withdrawal_password"
                  rounded
                  outlined
                  dense
                  borderless
                  :rules="[Rules.required()]"
                  lazy-rules
                  :placeholder="`${$t('member.withdrawal.withdrawPassword')}`"
                  autocomplete="off"
                  type="password"
                />
              </div>
            </div>
            <div class="form-item row mb-5">
              <div class="label col-12">{{ $t("member.withdrawal.withdrawalDetail") }}</div>
              <div class="input-content col-12 col-sm-12">
                <div class="wrap">
                  <table>
                    <tr>
                      <th>{{ $t("tableHeader.title") }}</th>
                      <th>{{ $t("tableHeader.content") }}</th>
                    </tr>
                    <tr class="bg-[#3E0303]">
                      <td>{{ $t("member.withdrawal.balance") }}</td>
                      <td>{{ withdrawState.form.balance }}</td>
                    </tr>
                    <tr class="bg-[#5A3030]">
                      <td>{{ $t("member.withdrawal.auditTurnover") }}</td>
                      <td>{{ withdrawState.form.remaining_turnover }}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div class="action-btns row justify-center">
              <q-btn
                text-color="black"
                label="SUBMIT"
                class="submit-btn"
                type="submit"
                :disable="envInfo.withdraw_kyc_verify === 1 && !userInfo.approval_status"
              />
            </div>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useBank } from "src/common/composables/useBank"
import { useRule } from "src/common/hooks/useRule"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useEnvInfoStore } from "src/stores/envStore"
import { useSiteImg } from "app/template/set49/hooks/useSiteImg"
import PaymentNav from "src/common/components/PaymentNav.vue"
import BannerMember from "app/template/set49/components/BannerMember.vue"
import AddBankCard from "./components/AddBankCard.vue"
import BankCard from "./components/BankCard.vue"

const router = useRouter()
const Rules = useRule()
const {
  bankCardState,
  withdrawState,
  bankList,
  gatewayFilterList,
  getBankList,
  getPaymentTypeList,
  getGatewayList,
  getWithdralPaymentList,
  handleWithdralCurrencyClick,
  handleWithdralFundTypeClick,
  handleWithdralPaymentClick,
  handleWithdralBankCardClick,
  handleWithdralSubmit,
  getWithdrawBankCardList,
  needWithdrawalPassword,
  checkWithdrawalPassword
} = useBank()
const { withdrawalKycImg } = useSiteImg()
const { envInfo } = useEnvInfoStore()
const { userInfo } = useUserInfo()

onMounted(async () => {
  checkWithdrawalPassword({ routeName: "memberChangeWithdrawalPassword" })
  await getWithdralPaymentList()
  getBankList()
  getGatewayList()
  await getPaymentTypeList(withdrawState.form.currency)
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import 'app/template/set49/assets/css/style.sass'
@import 'app/template/set49/assets/css/_variable.scss'

.wrap
  overflow: hidden
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.35)
  table
    font-family: 'Oswald', sans-serif
    border-collapse: collapse
    width: 100%
    th
      background-color: $primary-btn-bg
      color: #ffffff
      width: 25vw
      height: 50px
      &:first-child
        border-top-left-radius: 10px
      &:last-child
        border-top-right-radius: 10px
      +iphone-width
        height: 8vw
    td
      color: #ffffff
      width: 25vw
      height: 50px
      text-align: center
      transition: all 0.3s ease-in-out
      +iphone-width
        height: 8vw

    tr
      &:last-of-type
        border-bottom: none
      &:hover
        td
          transition: all 0.3s ease-in-out
          &:first-child
            transition: all 0.3s ease-in-out
      td
        &:first-child
          transition: all 0.3s ease-in-out

.card-container
  @apply grid grid-cols-2 gap-5
  +pc-width
    @apply grid-cols-2 gap-5
  +iphone-width
    @apply grid-cols-1 gap-6
    width: 100%
    height: 40rem
    margin: 1rem auto
    background-color: $primary-bg
    padding: .75rem 0
    overflow: auto
    +hideScrollBar
.bg-quick
  color: #fff
  padding: .5rem
  border: 1px solid rgba(255, 255, 255, 0.15)
  width: 3.4375rem
  border-radius: .5rem
  +pad-width
    width: 17%

.profile-layout
  .profile-content
    color: white
    max-width: 62.5rem
    margin: 0 auto
    overflow: hidden
    +iphone-width
      padding: 0
    .profile-form
      border-radius: 8px
      background: $primary-modal-bg
      padding: 2rem 2.6875rem
      +iphone-width
        margin-top: 0
        padding: 0
      .form-content
        +iphone-width
          width: 100%
          margin: 1rem auto
          padding: 1rem 1.5rem
          border-radius: .5rem
        .form-item
          .payment-form
            width: 100%
            .form-methods
              margin: 20px 10px
              +setFlex(flex-start)
              flex-direction: row
              flex-wrap: wrap
              .method-item
                @apply  px-2 py-1
                width: 8rem
                margin-right: 20px
                border: 1px solid rgba(255, 255, 255, 0.3)
                &.active
                  transition: transform 0.3s ease
                  border: 2px solid #ffe400
                  box-shadow: 0 0 0.3125rem 0.0625rem rgba(255, 255, 255, 0.5019607843)
          .input-content
            margin-top: .5rem
            padding: 0
            :deep(.q-field--disabled)
              .q-field__control
                div
                  opacity: 1 !important
          .bank-content
            width: 100%
            max-width: 400px
            height: auto
            padding: 10px
            list-style: none
            li
              @apply flex justify-start my-2 p-2
              align-items: center
              background: #fff
              border: 1px solid rgba(255, 255, 255, 0.50)
              border-radius: 0.2rem
              color: #000
              i
                margin: 0 5px
                color: #d50c14
                font-size: 1.2rem
                cursor: pointer
          .radio-content
            +setFlex(flex-start)
            flex-wrap: wrap
            padding-top: 1.75rem
            padding-left: .75rem
            gap: 1.563vw
            :deep(.q-radio)
              .q-icon
                color: $primary-modal-bg
            +iphone-width
              flex-wrap: wrap
              padding-top: 1.125rem
              padding-left: .625rem
              gap: 1.25rem
          &.birth-content
            gap: 1.25rem
            +iphone-width
              gap: 0
              justify-content: space-between
            .month-day-content
              flex-wrap: nowrap
              gap: 1.25rem
              +iphone-width
                @apply grid grid-cols-2

:deep(.q-pagination)
  .q-pagination__content
    .q-btn
      .q-btn__content
        .q-icon
          color: #FFC002!important

:deep(.nav-content)
  +iphone-width
    background: $primary-btn-bg!important

.withdrawal-kyc-text
  @apply ml-[1.25rem] mt-2 p-[.5rem] text-black rounded-[.25rem] max-w-[29.25rem]
  background-color: #FFC002
  +iphone-width
    @apply ml-[2.75rem] max-w-[80%]
  .withdrawal-kyc-img
    @apply w-4 h-[.875rem] mb-1 mr-1
</style>
