<template>
  <BannerMember />
  <div class="profile-layout">
    <div class="profile-content">
      <PaymentNav />
      <div class="form-title-content">
        <img :src="svgIcon('member-title-icon')" />
        <div class="title">{{ $t("member.withdrawal.title") }}</div>
      </div>
      <q-form @submit="handleWithdralSubmit">
        <div class="profile-form column">
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
                  <div class="label col-12">{{ $t("member.bank.withdrawalChannel") }}</div>
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
                        class="w-full h-full"
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
                    @update-list="getWithdrawBankCardList"
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
            <div class="form-item row mb-5">
              <div class="label col-12">{{ $t("member.withdrawal.withdrawalDetail") }}</div>
              <div class="input-content col-12 col-sm-12">
                <div class="wrap">
                  <table>
                    <tr>
                      <th>{{ $t("tableHeader.title") }}</th>
                      <th>{{ $t("tableHeader.content") }}</th>
                    </tr>
                    <tr>
                      <td>{{ $t("member.withdrawal.balance") }}</td>
                      <td>{{ withdrawState.form.balance }}</td>
                    </tr>
                    <tr>
                      <td>{{ $t("member.withdrawal.auditTurnover") }}</td>
                      <td>{{ withdrawState.form.remaining_turnover }}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div class="action-btns row justify-center">
              <q-btn text-color="white" label="SUBMIT" class="submit-btn" type="submit" />
            </div>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BannerMember from "app/template/set_jokerhill/components/BannerMember.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useBank } from "src/common/composables/useBank"
import { useRule } from "src/common/hooks/useRule"
import { onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import PaymentNav from "../../components/PaymentNav.vue"
import AddBankCard from "./components/AddBankCard.vue"
import BankCard from "./components/BankCard.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"

const router = useRouter()
const { svgIcon } = useSiteImg()
const Rules = useRule()
const { activeWalletCurrencyCode } = useUserInfo()
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
  getWithdrawBankCardList
} = useBank()

onMounted(async () => {
  await getWithdralPaymentList()
  getBankList()
  getGatewayList()
  await getPaymentTypeList(withdrawState.form.currency)
})

// 監聽 activeWalletCurrencyCode 和 supportedCurrency，自動同步幣別選擇
watch(
  [() => activeWalletCurrencyCode.value, () => withdrawState.supportedCurrency],
  ([currencyCode, supportedCurrencies]) => {
    if (!supportedCurrencies || supportedCurrencies.length === 0) return

    // 檢查當前活躍錢包幣別是否在支持的幣別列表中
    if (currencyCode && supportedCurrencies.includes(currencyCode)) {
      // 如果支持該幣別且當前選擇的幣別不是該幣別，則切換
      if (withdrawState.form.currency !== currencyCode) {
        handleWithdralCurrencyClick(currencyCode)
      }
    } else {
      // 如果不支持或沒有活躍幣別，選擇第一個
      if (supportedCurrencies[0] && withdrawState.form.currency !== supportedCurrencies[0]) {
        handleWithdralCurrencyClick(supportedCurrencies[0])
      }
    }
  },
  { immediate: true }
)
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import "../../assets/css/form.sass"

.wrap
  overflow: hidden
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.35)
  border-radius: 10px
  table
    font-family: "NotoSansTC"
    border-collapse: collapse
    width: 100%
    th
      background-color: #6288D2
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
      // background-color: #363636
      color: rgba(20, 20, 20, 0.40) !important
      width: 25vw
      height: 50px
      font-weight: bold
      text-align: center
      transition: all 0.3s ease-in-out
      +iphone-width
        height: 8vw

    tr
      // border-bottom: 1px solid #2a2a2a
      &:nth-child(odd)
        background-color: #E2ECFF !important
      &:nth-child(even)
        background-color: #CEDCF6 !important
      &:last-of-type
        border-bottom: none
      td
        &:first-child
          color: rgba(79,192,210,0.6)
          transition: all 0.3s ease-in-out

.card-container
  @apply grid grid-cols-3 gap-5
  +pc-width
    @apply grid-cols-2 gap-5
  +iphone-width
    @apply grid-cols-1 gap-6
    width: 100%
    height: auto
    min-height: 15rem
    margin: 1rem auto
    background-color: #fff
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
    // padding: 6vw 0
    overflow: hidden
    +iphone-width
      padding: 0
    .profile-form
      // margin-top: 2.5rem
      // width: 100%
      border-radius: 8px
      background: #fff
      padding: 2rem 2.6875rem
      +iphone-width
        // width: 100%
        margin-top: 0
        padding: 0
        background: #fff
      .form-content
        +iphone-width
          width: 100%
          margin: 1rem auto
          padding: 1rem 1.5rem
          background: #fff
          border-radius: 0rem
        .form-item
          .payment-form
            width: 100%
            .form-methods
              margin: 20px 10px
              +setFlex(flex-start)
              flex-direction: row
              flex-wrap: wrap
              width: 100%
              +iphone-width
                @apply grid grid-cols-3 gap-2
              .method-item
                width: 8rem
                margin: 0px 20px 10px 0
                cursor: pointer
                +setFlex(flex-start)
                +iphone-width
                  width: auto
                  margin: 0
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
            padding-top: 1.75rem
            padding-left: .75rem
            gap: 1.563vw
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
</style>
