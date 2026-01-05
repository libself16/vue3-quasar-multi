<template>
  <q-card class="deposit-layout">
    <!-- VIP暫時隱藏 -->
    <!-- <VipCard /> -->
    <q-card-section class="deposit-container">
      <div class="currency-row">
        <div class="currency-title">{{ $t("member.bank.selectCurrency") }}</div>
        <div class="currency-btns">
          <q-btn
            v-for="(item, key) in depositState.supportedCurrency"
            :key="key"
            :class="{ active: `${item}` === depositState.form.currency }"
            @click="handleDepositCurrencyClick(item)"
            color="currency"
            class="mx-1 my-1"
          >
            {{ $t(item) }}
          </q-btn>
        </div>
      </div>
      <div class="payment-info-container">
        <ul class="payment-type-container">
          <li
            v-for="item in depositState.fundTypeList"
            :key="item"
            :class="{ active: item === `${depositState.usingFundType}` }"
            @click="handleDepositFundTypeClick(item)"
          >
            {{ $t(`member.bank.${item}`) }}
          </li>
        </ul>
        <q-form class="payment-form" @submit="handleSubmit">
          <!-- 支付方式 -->
          <div class="form-row">
            <label class="form-title">{{ $t("member.deposit.selectMethod") }}:</label>
            <div class="form-methods">
              <div
                v-for="(item, key) in depositState.usingPaymentInfoList"
                :key="key"
                class="method-item"
                :class="{ active: String(item.id) === `${depositState.form.payment_gateway_id}` }"
                @click="handleDepositPaymentClick(item.id)"
              >
                <img :src="item.imgUrl" alt="" class="w-full h-full p-1" />
              </div>
            </div>
          </div>
          <!-- 手續費 -->
          <div
            v-if="hasFee(depositState.paymentDetail) && depositState.usingFundType === 'BankTransfer'"
            class="form-row fee"
          >
            <label class="form-title">{{ $t("member.deposit.handlingFee") }}:</label>
            <div class="input-container">
              <p>
                {{
                  depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
                    ? depositState.paymentDetail.fee_amount
                    : `${depositState.paymentDetail.fee_rate}%`
                }}
              </p>
            </div>
          </div>
          <!-- 支付資訊 -->
          <div class="form-row" v-if="depositState.usingFundType === 'BankTransfer'">
            <label class="form-title">{{ $t("member.deposit.bankAccount") }}:</label>
            <ul class="bank-container">
              <li>
                <span>{{ depositState.paymentDetail.bank_name }}</span>
                <q-icon name="save" @click="copyMessage(depositState.paymentDetail.bank_name)" />
              </li>
              <li>
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
          <div class="form-row" v-if="depositState.usingFundType === 'CryptoWallet'">
            <label class="form-title">{{ $t("member.deposit.depositInfo") }}:</label>
            <ul class="bank-container">
              <li>
                <span>{{ depositState.paymentDetail.currency_brand }}</span>
                <q-icon name="save" @click="copyMessage(depositState.paymentDetail.currency_brand)" />
              </li>
              <li>
                <span>{{ depositState.paymentDetail.chain }}</span>
                <q-icon name="save" @click="copyMessage(depositState.paymentDetail.chain)" />
              </li>
              <li>
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
          <div class="form-row" v-if="depositState.usingFundType === 'CryptoPayment'">
            <label class="form-title">{{ $t("member.deposit.depositInfo") }}:</label>
            <ul class="bank-container">
              <li>
                <span>{{ depositState.paymentDetail.currency_brand }}</span>
                <q-icon name="save" @click="copyMessage(depositState.paymentDetail.currency_brand)" />
              </li>
            </ul>
          </div>
          <!-- 存款金額 -->
          <div class="form-row item-start">
            <label class="form-title">{{ $t("member.deposit.depositAmount") }}:</label>
            <div class="input-container">
              <q-input
                v-model.trim="depositState.form.amount"
                bg-color="white"
                outlined
                class="form-input"
                :placeholder="$t('member.deposit.depositAmount')"
                lazy-rules
                @keypress="Rules.validatePositiveNumber"
                inputmode="decimal"
                :rules="[
                  Rules.requiredInt,
                  (val: string) =>
                    Rules.depositAmount({
                      min: depositState.paymentDetail.deposit_min,
                      max: depositState.paymentDetail.deposit_max,
                      val
                    })
                ]"
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
              <div class="my-1">
                {{ $t("member.deposit.mixMaxLimit") }}: {{ depositState.paymentDetail.deposit_min }} /
                {{ depositState.paymentDetail.deposit_max }}
              </div>
              <div class="flex justify-start flex-wrap gap-3">
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
          </div>
          <!-- 額外欄位 -->
          <div class="form-row item-start" v-if="depositState.paymentDetail.extra_field_key">
            <label class="form-title">{{ $t("bank_column.client_Info") }}:</label>
            <div class="input-container">
              <template
                v-for="(field, key) in depositState.paymentDetail.extra_field[
                  depositState.paymentDetail.extra_field_key
                ]"
                :key="key"
              >
                <!-- 文字輸入框 -->
                <ExtraInput
                  v-if="field.type === FIELD_TYPE.Enums.Input"
                  :field="field"
                  class="form-input"
                  v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
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
                  :field="field"
                  class="form-input"
                  v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
                ></ExtraInput>
              </template>
            </div>
          </div>
          <!-- 存款備註 -->
          <div
            class="mb-5 form-item form-row"
            v-if="depositState.paymentDetail.extra_remark && depositState.paymentDetail.extra_remark.length > 0"
          >
            <div class="form-title label col-12">{{ $t("member.deposit.remark") }}</div>
            <div class="form-remark">
              <div
                v-for="(item, index) in depositState.paymentDetail.extra_remark"
                :key="index"
                class="form-remark-item"
              >
                <div class="form-remark-input">
                  <q-input
                    outlined
                    dense
                    v-model="item.content"
                    :placeholder="item.titles.find((lang) => lang.lang === nowLang)?.title"
                  />
                </div>
              </div>
            </div>
          </div>
          <!--活動-->
          <div v-if="depositState.promotion_list.length" class="form-row item-start">
            <label class="form-title">{{ $t("member.deposit.depositReward") }}: </label>

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
          <div class="form-row-submit">
            <q-btn rounded color="submit" push :label="$t('common.btn.submit')" type="submit" class="btn-submit" />
          </div>
        </q-form>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core"
import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"
import { useBank } from "src/common/composables/useBank"
import { useLanguage } from "src/common/composables/useLanguage"
import { useCommon } from "src/common/hooks/useCommon"
import { usePayment } from "src/common/hooks/usePayment"
import { useRule } from "src/common/hooks/useRule"
import { FEE_TYPE, FIELD_TYPE } from "src/common/utils/constants"
import { computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import PromotionList from "./components/PromotionList.vue"

const router = useRouter()
const { nowLang } = useLanguage()
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

const rateResult = computed(
  () => `${preciseMultiply(Number(depositState.form.amount), Number(depositState.paymentDetail.usdt_rate))}`
)

const handleSubmit = async () => {
  let { status } = await handleDepositSubmit()
  if (status) router.push({ name: "MemberOrder" })
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
@import 'app/template/set33_BLUE/assets/css/button.sass'

// common style
.form-input
  @apply w-full
  :deep(.q-icon)
    color: dimgrey
  :deep(.q-field__control)
    min-height: 40px
    height: auto
    background: #fff
    border-bottom: .0625rem solid #dee3f026
    border-radius: .5rem
    .q-field__control-container
      padding: 0
    .q-field__native
      min-height: 3.125rem
      color: dimgrey
      .q-field__input
        color: dimgrey
    .q-field__label
      min-height: 3.125rem
      color: dimgrey
    .q-field__append
      height: 3.125rem
      line-height: 3.125rem
    &::after
      height: 100%

.deposit-layout
  @apply block text-white bg-transparent shadow-none
  min-height: 37.5rem
  border-radius: .625rem
  .deposit-container
    @apply text-white mt-2 p-6 w-full rounded-lg
    background: #021524
    border: 1px solid #086eb8
    +pad-width
      @apply mt-0 rounded-none
      padding: 1.25rem .625rem .625rem
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
        @apply w-full p-0 flex items-center
        flex-wrap: wrap
        gap: 0.1rem
        +pad-width
          @apply mt-3
    .payment-info-container
      @apply w-full flex justify-between gap-5
      +pad-width
        @apply flex-col
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
            @apply text-xs p-1 text-center
          &.active, &:hover
            background: linear-gradient(to bottom, rgb(16, 183, 243) 0%, rgb(12, 112, 170) 33%, rgb(8, 93, 143) 100%)
      .payment-form
        width: 72%
        +pad-width
          width: 100%
        .form-row
          @apply flex mb-5 items-start
          &.item-start
            @apply items-start
          &.fee
            @apply h-10
            .input-container
              @apply h-full flex justify-start items-center
            +pad-width
              height: auto

          +pad-width
            @apply flex-wrap gap-4
          .form-title
            @apply m-0 font-bold my-2
            width: 30%
            +pad-width
              @apply w-full my-0
          .form-methods
            @apply flex flex-wrap justify-start gap-1
            width: 70%
            +pad-width
              // @apply w-full grid grid-cols-4 gap-1
              width: 100%
            +phone-width
              @apply grid-cols-3
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
                width: 45%
                height: auto
              &.active
                background: linear-gradient(to bottom,rgb(16,183,243) 0%,rgb(12,112,170) 33%,rgb(8,93,143) 100%)
                color: #fff
          .bank-container
            width: 50%
            height: auto
            padding: 10px
            background: #03233a
            border: 1px solid #0c9bd5
            border-radius: 0.8rem
            list-style: none
            li
              @apply flex justify-start
              align-items: center
              padding-bottom: 8px
              i
                margin: 0 5px
                color: #d50c14
                font-size: 1.2rem
                cursor: pointer
            +pad-width
              width: 100%
          .input-container
            width: 70%
            .input-style
              padding: 6px
              background: #fff
              color: rgba(0, 0, 0, 0.87)
              border-radius: 3px
              min-height: 10px
              width: 100%
            .form-input
              width:  100%
              :deep(.q-field__control)
                height: 2.375rem
                min-height: auto
                .q-field__native
                  min-height: auto
                .q-field__append
                  height: 2.375rem
            .bg-quick
              background: #03233a
              color: #fff
              padding: .5rem
              border: 1px solid #0c9bd5
              min-width: 3.75rem !important
              width: auto !important
              border-radius: .5rem
        .form-row-submit
          @apply flex justify-end
          +pad-width
            .bg-submit
              @apply w-full

.form-remark
  @apply text-black
  @apply flex flex-col gap-4
  width: 100%
  +phone-width
    @apply w-full pl-0
  .form-remark-item
    width: 100%
    @apply flex items-center gap-2
    +phone-width
      @apply flex-col items-start w-full
    .form-remark-title
      color: #fff
      @apply min-w-[100px]
      width: 26%
      +phone-width
        @apply min-w-[250px]
    .form-remark-input
      height: 40px
      width: 100%
      height: auto
      background: #fff
      border: .0625rem solid #dee3f026
      border-radius: .5rem
      +phone-width
        @apply w-full

.form-promo
  @apply flex justify-between
  font-size: .75rem
  gap: .5625rem
  flex-wrap: wrap
  width: 70%
  +phone-width
   width: 100%
</style>
