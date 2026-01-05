<template>
  <BannerMember />
  <div class="profile-layout">
    <div class="profile-content">
      <PaymentNav />
      <div class="form-title-content">
        <img :src="svgIcon('member-title-icon')" />
        <div class="title">{{ $t("member.deposit.title") }}</div>
      </div>
      <q-form @submit="handleSubmit">
        <div class="profile-form column">
          <div class="form-content">
            <!-- currency -->
            <div class="form-item row mb-5">
              <div class="label col-12">{{ $t("member.deposit.selectCurrency") }}</div>
              <div class="radio-content col-12 col-sm-10">
                <q-radio
                  v-for="item in depositState.supportedCurrency"
                  :key="item"
                  dense
                  v-model="depositState.form.currency"
                  @click="handleDepositCurrencyClick(item)"
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
                  v-for="item in depositState.fundTypeList"
                  :key="item"
                  dense
                  v-model="depositState.usingFundType"
                  @click="handleDepositFundTypeClick(item)"
                  :val="item"
                  :label="$t('member.bank.'+item as string)"
                  checked-icon="circle"
                />
              </div>
            </div>
            <!-- 支付方式 -->
            <div class="form-item row mb-5">
              <div class="label col-12">{{ $t("member.deposit.selectMethod") }}</div>
              <div class="form-methods">
                <div
                  v-for="(item, key) in depositState.usingPaymentInfoList"
                  :key="key"
                  class="method-item"
                  :class="{ active: String(item.id) === `${depositState.form.payment_gateway_id}` }"
                  @click="handleDepositPaymentClick(item.id)"
                >
                  <img :src="item.imgUrl" alt="" class="w-full h-full" />
                </div>
              </div>
            </div>
            <!-- bank account -->
            <div
              class="form-item row"
              v-if="depositState.usingFundType === FUND_METHOD_TYPE.BackendKeysEnums.BankTransfer"
            >
              <div class="col-12 col-sm-4 mr-16">
                <div class="label col-12">{{ $t("member.deposit.bankAccount") }}</div>
                <ul class="bank-content col-12">
                  <li class="input-style">
                    <span>{{ depositState.paymentDetail.bank_name }}</span>
                    <q-icon name="save" @click="copyMessage(depositState.paymentDetail.bank_name)" />
                  </li>
                  <li class="input-style">
                    <span>{{ depositState.paymentDetail.bank_account }}</span>
                    <q-icon name="save" @click="copyMessage(depositState.paymentDetail.bank_account)" />
                  </li>
                  <img
                    v-if="depositState.paymentDetail.qrcode_image_id !== 0"
                    :src="depositState.paymentDetail.imgUrl"
                    alt=""
                    class="w-20 h-20"
                  />
                </ul>
              </div>
              <div v-if="hasFee(depositState.paymentDetail)" class="col-12 col-sm-4 mr-16">
                <div class="label col-12">{{ $t("member.deposit.handlingFee") }}</div>
                <ul class="bank-content col-12">
                  <li class="handling-fee-style">
                    <span>
                      {{
                        depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
                          ? depositState.paymentDetail.fee_amount
                          : `${depositState.paymentDetail.fee_rate}%`
                      }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="form-item row"
              v-if="depositState.usingFundType === FUND_METHOD_TYPE.BackendKeysEnums.CryptoWallet"
            >
              <div class="col-12 col-sm-4 mr-16">
                <div class="label col-12">{{ $t("member.deposit.depositInfo") }}</div>
                <ul class="bank-content col-12">
                  <li class="input-style">
                    <span>{{ depositState.paymentDetail.currency_brand }}</span>
                    <q-icon name="save" @click="copyMessage(depositState.paymentDetail.currency_brand)" />
                  </li>
                  <li class="input-style">
                    <span>{{ depositState.paymentDetail.chain }}</span>
                    <q-icon name="save" @click="copyMessage(depositState.paymentDetail.chain)" />
                  </li>
                  <li class="input-style">
                    <span>{{
                      depositState.paymentDetail.wallet_address.length > 15
                        ? depositState.paymentDetail.wallet_address.substring(0, 15) + "..."
                        : depositState.paymentDetail.wallet_address
                    }}</span>
                    <q-icon name="save" @click="copyMessage(depositState.paymentDetail.wallet_address)" />
                  </li>
                  <img
                    v-if="depositState.paymentDetail.qrcode_image_id !== 0"
                    :src="depositState.paymentDetail.imgUrl"
                    alt=""
                    class="w-20 h-20"
                  />
                </ul>
              </div>
              <div v-if="hasFee(depositState.paymentDetail)" class="col-12 col-sm-4 mr-16">
                <div class="label col-12">{{ $t("member.deposit.handlingFee") }}</div>
                <ul class="bank-content col-12">
                  <li class="handling-fee-style">
                    <span>
                      {{
                        depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
                          ? depositState.paymentDetail.fee_amount
                          : `${depositState.paymentDetail.fee_rate}%`
                      }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="form-item row"
              v-if="depositState.usingFundType === FUND_METHOD_TYPE.BackendKeysEnums.CryptoPayment"
            >
              <div class="col-12 col-sm-4 mr-16">
                <div class="label col-12">{{ $t("member.deposit.depositInfo") }}</div>
                <ul class="bank-content col-12">
                  <li class="input-style">
                    <span>{{ depositState.paymentDetail.currency_brand }}</span>
                    <q-icon name="save" @click="copyMessage(depositState.paymentDetail.currency_brand)" />
                  </li>
                </ul>
              </div>
              <div v-if="hasFee(depositState.paymentDetail)" class="col-12 col-sm-4 mr-16">
                <div class="label col-12">{{ $t("member.deposit.handlingFee") }}</div>
                <ul class="bank-content col-12">
                  <li class="handling-fee-style">
                    <span>
                      {{
                        depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
                          ? depositState.paymentDetail.fee_amount
                          : `${depositState.paymentDetail.fee_rate}%`
                      }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <!-- amount -->
            <div class="form-item row">
              <div class="row col-12 col-sm-4">
                <div class="label col-12">{{ $t("member.deposit.depositAmount") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="depositState.form.amount"
                    rounded
                    outlined
                    dense
                    borderless
                    :rules="[Rules.required()]"
                    lazy-rules
                    @keypress="Rules.validatePositiveNumber"
                    inputmode="decimal"
                    :placeholder="$t('member.deposit.depositAmount')"
                  />
                  <ul v-show="depositState.paymentDetail.usdt_rate">
                    <li>
                      <span>{{ `${$t("member.withdrawal.rate")}: ` }}</span>
                      <span>{{ depositState.paymentDetail.usdt_rate }}</span>
                    </li>
                    <li>
                      <span>{{ `${$t("member.withdrawal.actualAmount")}: ` }}</span>
                      <span>{{ rateResult }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- tip -->
            <div class="form-item max-min-tip">
              <div class="my-1">
                {{ $t("member.deposit.mixMaxLimit") }}: {{ depositState.paymentDetail.deposit_min }} /
                {{ depositState.paymentDetail.deposit_max }}
              </div>
              <div class="flex justify-start flex-wrap">
                <q-btn
                  v-for="item in depositState.quickBtns"
                  :key="item"
                  color="quick"
                  @click="handleDepositQuickBtnClick(item)"
                >
                  {{ item }}
                </q-btn>
              </div>
            </div>
            <!-- 額外欄位 -->
            <div class="form-item row" v-if="depositState.paymentDetail.extra_field_key">
              <div class="row col-12 col-sm-4">
                <div class="label col-12">{{ $t("bank_column.client_Info") }}</div>
                <div class="input-content col-12">
                  <div
                    class="info-contentflex-col normal col-12 col-sm-10 w-full"
                    v-for="(field, key) in depositState.paymentDetail.extra_field[
                      depositState.paymentDetail.extra_field_key
                    ]"
                    :key="key"
                  >
                    <!-- 文字輸入框 -->
                    <ExtraInput
                      v-if="field.type === FIELD_TYPE.Enums.Input"
                      v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
                      :field="field"
                      class="form-input"
                    ></ExtraInput>

                    <!-- 下拉選單類型 -->
                    <ExtraSelect
                      v-else-if="field.type === FIELD_TYPE.Enums.Select"
                      v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
                      :field="field"
                      class="form-input"
                    ></ExtraSelect>

                    <!-- 其他 -->
                    <ExtraInput
                      v-else
                      v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
                      :field="field"
                      class="form-input"
                    ></ExtraInput>
                  </div>
                </div>
              </div>
            </div>
            <!-- 存款備註 -->
            <div
              class="form-item row"
              v-if="depositState.paymentDetail.extra_remark && depositState.paymentDetail.extra_remark.length > 0"
            >
              <div class="row col-12 col-sm-4">
                <div class="label col-12">{{ $t("member.deposit.remark") }}</div>
                <div class="form-remark">
                  <div
                    class="form-remark-item"
                    v-for="(item, index) in depositState.paymentDetail.extra_remark"
                    :key="index"
                  >
                    <div class="form-remark-title">{{ item.titles.find((lang) => lang.lang === nowLang)?.title }}</div>
                    <div class="form-remark-input">
                      <q-input outlined dense v-model="item.content" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 活動 -->
            <div v-if="depositState.promotion_list.length" class="form-item row mb-5">
              <div class="label col-12">{{ $t("member.deposit.depositReward") }}</div>
              <div class="form-promo">
                <PromotionList
                  v-for="item in depositState.promotion_list"
                  :key="item.id"
                  :item="item"
                  :activeId="depositState.form.promotion_id"
                  @click="handlePromotionClick(item.id)"
                ></PromotionList>
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
import { useDebounceFn } from "@vueuse/core"
import BannerMember from "app/template/set_jokerhill/components/BannerMember.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"
import { useBank } from "src/common/composables/useBank"
import { useLanguage } from "src/common/composables/useLanguage"
import { useCommon } from "src/common/hooks/useCommon"
import { usePayment } from "src/common/hooks/usePayment"
import { useRule } from "src/common/hooks/useRule"
import { FEE_TYPE, FIELD_TYPE, FUND_METHOD_TYPE } from "src/common/utils/constants"
import { computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import PaymentNav from "../../components/PaymentNav.vue"
import PromotionList from "./components/PromotionList.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"

const router = useRouter()
const { copyMessage, preciseMultiply } = useCommon()
const { nowLang } = useLanguage()
const { svgIcon } = useSiteImg()
const Rules = useRule()
const { hasFee } = usePayment()
const { activeWalletCurrencyCode } = useUserInfo()
const {
  depositState,
  getPromotionList,
  getDepositPaymentList,
  handleDepositCurrencyClick,
  handleDepositFundTypeClick,
  handleDepositPaymentClick,
  handleDepositQuickBtnClick,
  handlePromotionClick,
  handleDepositSubmit
} = useBank()

const rateResult = computed(
  () => `${preciseMultiply(Number(depositState.form.amount), Number(depositState.paymentDetail.usdt_rate))}`
)

const handleSubmit = async () => {
  let { status } = await handleDepositSubmit()
  if (status) router.push({ name: "orders" })
}

// 監聽 amount
const debounceFn = useDebounceFn(() => getPromotionList(), 500)
watch(
  () => depositState.form.amount,
  () => debounceFn()
)

// 監聽 activeWalletCurrencyCode 和 supportedCurrency，自動同步幣別選擇
watch(
  [() => activeWalletCurrencyCode.value, () => depositState.supportedCurrency],
  ([currencyCode, supportedCurrencies]) => {
    if (!supportedCurrencies || supportedCurrencies.length === 0) return

    // 檢查當前活躍錢包幣別是否在支持的幣別列表中
    if (currencyCode && supportedCurrencies.includes(currencyCode)) {
      // 如果支持該幣別且當前選擇的幣別不是該幣別，則切換
      if (depositState.form.currency !== currencyCode) {
        handleDepositCurrencyClick(currencyCode)
      }
    } else {
      // 如果不支持或沒有活躍幣別，選擇第一個
      if (supportedCurrencies[0] && depositState.form.currency !== supportedCurrencies[0]) {
        handleDepositCurrencyClick(supportedCurrencies[0])
      }
    }
  },
  { immediate: true }
)

onMounted(async () => {
  await getDepositPaymentList()
  await getPromotionList()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import "../../assets/css/form.sass"

// common style
.bg-quick
  color: #14A8A4 !important
  padding: .5rem
  border: 1px solid rgba(255, 255, 255, 0.15)
  min-width: 3.75rem !important
  width: auto !important
  border-radius: 0rem

.form-input
  @apply w-full
  :deep(.q-icon)
    color: dimgrey
  :deep(.q-field__control)
    min-height: 40px
    height: auto
    border-radius: .5rem
    .q-field__control-container
      padding: 0
    .q-field__native
      min-height: 2rem
      font-weight: 100
      color: dimgrey
      .q-field__input
        color: dimgrey
    .q-field__label
      min-height: 2rem
      color: dimgrey
    .q-field__append
      height: 2rem
      line-height: 2rem
    &::after
      height: 100%

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
          border-radius: .5rem
        .form-item
          .form-methods
            @apply flex flex-wrap justify-start gap-1
            width: 70%
            +pad-width
              // @apply w-full grid grid-cols-4 gap-1
              width: 100%
            +iphone-width
              @apply grid grid-cols-2
            .method-item
              @apply relative w-auto flex justify-center items-center rounded-lg p-0 cursor-pointer
              height: 2.8125rem
              max-width: 45%
              margin: .3125rem
              border: 1px solid #079ad9
              +pad-width
                height: 4rem
                max-width: fit-content
              +iphone-width
                width: 100%
                height: auto
              &.active
                background: linear-gradient(to bottom,rgb(16,183,243) 0%,rgb(12,112,170) 33%,rgb(8,93,143) 100%)
                color: #fff
          .input-content
            margin-top: .5rem
            padding: 0
            :deep(.q-field--disabled)
              .q-field__control
                div
                  opacity: 1 !important
            :deep(.q-field__control)
              .q-field__native
                font-weight: 100
            ul
              color: #EB5757
          .bank-content
            width: 100%
            max-width: 400px
            height: auto
            padding: 10px
            list-style: none
            .input-style
              @apply flex justify-start my-2 p-2
              align-items: center
              background: #fff
              border: 1px solid #6288D2
              border-radius: 0.2rem
              color: rgba(20, 20, 20, 0.40)
              i
                margin: 0 5px
                color: #d50c14
                font-size: 1.2rem
                cursor: pointer
            .handling-fee-style
              color: rgba(20, 20, 20, 0.40)
          .radio-content
            +setFlex(flex-start)
            flex-wrap: wrap
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
          &.max-min-tip
            color: #EB5757
.form-promo
  @apply flex justify-between
  font-size: .75rem
  gap: .5625rem
  flex-wrap: wrap
  width: 70%
  +phone-width
   width: 100%

.form-remark
  @apply flex flex-col gap-4 pl-[0.5rem]
  color: rgba(20, 20, 20, 0.4)
  +phone-width
    @apply w-full  gap-1
  .form-remark-item
    @apply flex items-center gap-2
    +phone-width
      @apply flex-col items-start w-full
      margin-top: 1rem
    .form-remark-title
      @apply min-w-[80px]
      +phone-width
        @apply min-w-[250px]
    .form-remark-input
      +phone-width
        @apply w-full
</style>
