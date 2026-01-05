<template>
  <q-form class="order-wrapper" @submit="handleSubmit">
    <BackBtn />
    <div class="order-content">
      <h2 class="order-title">{{ $t("member.deposit.title") }}</h2>
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
          <div class="label col-12">
            {{ $t("member.deposit.selectMethod") }}
            <span class="learn-wallet">
              <q-img :src="svgIcon('bank-info')" loading="lazy"></q-img>{{ $t("member.deposit.understandWallet") }}：
              <q-btn
                flat
                :label="$t('member.deposit.biBao')"
                type="a"
                href="https://marketing.baobiweb.com/tutorial"
                target="_blank"
                rel="noopener"
                class="hide-hover"
              />、
              <q-btn
                flat
                :label="$t('member.deposit.mpayWallet')"
                type="a"
                href="https://www.mp11.ag/guide_support_detail/65811f8fbbd49c394a5b7c8c"
                target="_blank"
                rel="noopener"
                class="hide-hover"
              />、
              <q-btn
                flat
                :label="$t('member.deposit.jdWallet')"
                type="a"
                href="https://prnt.sc/ZDB-bAPZ3aIh"
                target="_blank"
                rel="noopener"
                class="hide-hover"
              />
            </span>

            <!-- <span>
              <q-btn label="打開 Google" type="a" href="https://www.google.com" target="_blank" rel="noopener" />
            </span> -->
          </div>
          <div class="form-methods">
            <div
              v-for="(item, key) in depositState.usingPaymentInfoList"
              :key="key"
              class="method-item"
              :class="{ active: String(item.id) === `${depositState.form.payment_gateway_id}` }"
              @click="handleDepositPaymentClick(item.id)"
            >
              <img :src="item.imgUrl" alt="" class="w-auto h-full" />
            </div>
          </div>
        </div>
        <div class="form-item row" v-if="depositState.usingFundType === FUND_METHOD_TYPE.BackendKeysEnums.BankTransfer">
          <div class="col-12 col-sm-4 mr-16">
            <div class="label col-12">{{ $t("member.deposit.bankAccount") }}</div>
            <ul class="bank-content col-12">
              <li class="input-style">
                <span>{{ depositState.paymentDetail.bank_name }}</span>
                <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.bank_name)" />
              </li>
              <li class="input-style">
                <span>{{ depositState.paymentDetail.bank_account }}</span>
                <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.bank_account)" />
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
              <li>
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
        <div class="form-item row" v-if="depositState.usingFundType === FUND_METHOD_TYPE.BackendKeysEnums.CryptoWallet">
          <div class="col-12 col-sm-4 mr-16">
            <div class="label col-12">{{ $t("member.deposit.depositInfo") }}</div>
            <ul class="bank-content col-12">
              <li class="input-style">
                <span>{{ depositState.paymentDetail.currency_brand }}</span>
                <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.currency_brand)" />
              </li>
              <li class="input-style">
                <span>{{ depositState.paymentDetail.chain }}</span>
                <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.chain)" />
              </li>
              <li class="input-style">
                <span>{{
                  depositState.paymentDetail.wallet_address.length > 15
                    ? depositState.paymentDetail.wallet_address.substring(0, 15) + "..."
                    : depositState.paymentDetail.wallet_address
                }}</span>
                <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.wallet_address)" />
              </li>
              <img
                v-if="depositState.paymentDetail.qrcode_image_id !== 0"
                :src="depositState.paymentDetail.imgUrl"
                alt=""
                class="w-20 h-20"
              />
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
                <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.currency_brand)" />
              </li>
            </ul>
          </div>
        </div>
        <!-- deposit amount -->
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
                :placeholder="depositAmountPlaceholder"
              />
              <ul class="my-1 mx-1" v-show="depositState.paymentDetail.usdt_rate">
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
        <div class="form-item">
          <div class="quick-area flex justify-start flex-wrap gap-3">
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
            <div
              class="input-content col-12"
              v-for="(field, key) in depositState.paymentDetail.extra_field[depositState.paymentDetail.extra_field_key]"
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
        <!-- 存款備註 -->
        <div
          class="form-item row"
          v-if="depositState.paymentDetail.extra_remark && depositState.paymentDetail.extra_remark.length > 0"
        >
          <div class="row col-12 col-sm-4">
            <div class="label col-12">{{ $t("member.deposit.remark") }}</div>
            <div class="input-content col-12">
              <div v-for="(item, index) in depositState.paymentDetail.extra_remark" :key="index">
                <div class="form-remark-input mb-2 pb-4">
                  <q-input
                    :placeholder="item.titles.find((lang) => lang.lang === nowLang)?.title"
                    outlined
                    dense
                    v-model="item.content"
                    class="form-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--活動-->
        <div v-if="depositState.promotion_list.length" class="form-item q-pt-md row col-12 col-sm-4 w-full">
          <div class="label col-12">{{ $t("member.deposit.depositReward") }}</div>
          <div class="col-12 overflow-x-auto mt-5">
            <div class="form-promo">
              <PromotionList
                v-for="item in depositState.promotion_list"
                :key="item.id"
                :item="item"
                :activeId="depositState.form.promotion_id"
                @click="handlePromotionClick(item.id)"
              />
            </div>
          </div>
        </div>

        <div class="action-btns row justify-center">
          <q-btn text-color="black" class="submit-btn" type="submit">
            {{ $t("common.btn.submit") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-form>
</template>
<script lang="ts" setup>
import { useDebounceFn } from "@vueuse/core"
import BackBtn from "app/template/set_r016/components/Button/Back.vue"
import { useQuasar } from "quasar"
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
import PromotionList from "./components/PromotionList.vue"
import { useI18n } from "vue-i18n"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { ERROR_CODE_TYPE } from "src/common/utils/constants"

const $q = useQuasar()
const { t } = useI18n()
const { nowLang } = useLanguage()
const router = useRouter()
const { copyMessage, preciseMultiply } = useCommon()
const Rules = useRule()
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
const { hasFee } = usePayment()
const { svgIcon } = useSiteImg()

const rateResult = computed(
  () => `${preciseMultiply(Number(depositState.form.amount), Number(depositState.paymentDetail.usdt_rate))}`
)

const depositAmountPlaceholder = computed(() => {
  return `${t("member.deposit.mixMaxLimit")}: ${depositState.paymentDetail.deposit_min} / ${
    depositState.paymentDetail.deposit_max
  }`
})

const handleSubmit = async () => {
  let { status, code } = await handleDepositSubmit()
  if (status) router.push({ name: "orders" })

  /** ME9客製，未設定姓名時跳轉至個人信息畫面 */
  if (code === ERROR_CODE_TYPE.Enums.P_REAL_NAME_NOT_EXIST) {
    router.push({ name: "memberProfile" })
  }
}

// 監聽 amount
const debounceFn = useDebounceFn(() => getPromotionList(), 500)
watch(
  () => depositState.form.amount,
  () => debounceFn()
)

onMounted(async () => {
  await getDepositPaymentList()
  await getPromotionList()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import 'app/template/set_r016/assets/css/style.sass'
@import 'app/template/set_r016/assets/css/_variable.scss'
@import 'app/template/set_r016/assets/css/button.scss'

.bg-quick
  color: #CF0808 !important
  font-feature-settings: 'liga' off, 'clig' off
  font-family: Helvetica
  font-size: 1rem
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: capitalize
  padding: .5rem
  border: 1px solid rgba(255, 255, 255, 0.15)
  min-width: 3.75rem !important
  width: auto !important
  border-radius: 10px
  background: #FFF
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.20)

.order-wrapper
  max-width: 75rem
  margin: 1.25rem auto
  +phone-width
    margin: 0
    padding: 0.625rem 0.375rem
  .order-content
    margin-top: 1.25rem
    padding: 3.75rem
    background-color: $primary07
    color: $neutral01
    border-radius: 0.625rem
    +phone-width
      margin-top: 0.625rem
      padding: 1.25rem
    .order-title
      +fontStyle(1.625rem)
      color: $secondary03
    .form-content
      margin-top: 2.5rem
      +iphone-width
        width: 100%
        margin: 1rem auto
        padding: 1rem 0rem
        border-radius: .5rem
      .submit-btn
        width: 300px
        border-radius: 10px
        background: linear-gradient(180deg, $primary04 0%, $primary05 100%)
        color: $neutral01 !important
      .form-item
        margin-left: 0rem
        .label
          color: $neutral01
          padding-left: 0rem
          .learn-wallet
            +fontStyle(1.125rem, 400, 1.3125rem)
            color: $secondary03
            .q-img
              width: 1.25rem
              height: 1.25rem
              margin-right: .25rem
              margin-left: .625rem
            .q-btn
              +fontStyle(1.125rem, 400, 1.3125rem)
              padding: 0
              color: #48C2FF
              text-decoration: underline

        .form-methods
          @apply flex flex-wrap justify-start gap-1
          width: 70%
          margin-top: 1.25rem
          +pad-width
            width: 100%
          +phone-width
            @apply grid-cols-3
          .method-item
            @apply relative w-auto flex justify-center items-center rounded-lg px-2 py-1 cursor-pointer
            height: 2.8125rem
            width: 8rem
            margin: .3125rem
            border: 1px solid rgba(255, 255, 255, 0.20)
            border-radius: 10px
            +pad-width
              height: 4rem
              max-width: fit-content
            +iphone-width
              width: 7rem
              height: auto
              max-height: 3rem
            &.active
              background: rgba(255, 255, 255, 0.2)
              border: 1px solid #F9E8E8
        .input-content
          margin-top: 1.25rem
          padding: 0
          :deep(.q-field--disabled)
            .q-field__control
              div
                opacity: 1 !important
        .bank-content
          width: 100%
          max-width: 400px
          height: auto
          padding: 10px 0
          list-style: none
          .input-style
            @apply flex justify-between my-2
            align-items: center
            padding: 0.5rem 1rem
            background: #fff
            border: 1px solid rgba(255, 255, 255, 0.50)
            color: #000
            border-radius: 10px
            box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.10)
            i
              margin: 0 5px
              color: #d50c14
              font-size: 1.2rem
              cursor: pointer
        .radio-content
          +setFlex(flex-start)
          flex-wrap: wrap
          padding-top: 1.2rem
          padding-left: 0rem
          gap: 1.563vw
          :deep(.q-radio)
            .q-icon
              color: $primary06
          :deep(.q-radio__label)
            color: $neutral01
          +iphone-width
            flex-wrap: wrap
            padding-top: 1.125rem
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

.form-promo
  @apply flex
  gap: 1.2rem
  flex-wrap: wrap
  width: 100%
  +phone-width
    gap: unset
    flex-wrap: nowrap

:deep(.q-pagination)
  .q-pagination__content
    .q-btn
      .q-btn__content
        .q-icon
          color: #FFC002!important

:deep(.nav-content)
  +iphone-width
    background: $primary-btn-bg!important
</style>
