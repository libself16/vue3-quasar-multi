<template>
  <q-form class="order-wrapper" @submit="handleSubmit">
    <BackBtn />
    <div class="order-content">
      <h2 class="order-title">{{ bankCardId ? $t("common.btn.edit") : $t("common.btn.add") }}</h2>
      <div class="form-content">
        <!-- currency -->
        <div class="form-item row">
          <div class="label col-12">{{ $t("member.bank.selectCurrency") }}</div>
          <div class="radio-content col-12">
            <q-radio
              v-for="item in availCurrencyList"
              :key="item.id"
              dense
              :model-value="bankCardState.form.currency"
              @update:model-value="handleBankCardCurrencyClick($event)"
              :val="item.code"
              :label="item.code"
              checked-icon="circle"
            />
          </div>
        </div>
        <!-- payment type -->
        <div class="form-item row">
          <div class="label col-12">{{ $t("modal.type") }}</div>
          <div class="radio-content col-12 q-mb-md radio-content-type">
            <q-radio
              v-for="item in paymentTypeList"
              :key="item.value"
              dense
              @update:modelValue="handleBankCardPaymentTypeClick(item.value)"
              :modelValue="bankCardState.form.payment_type_id"
              :val="parseInt(item.value)"
              :label="$t(item.label)"
              checked-icon="circle"
            />
          </div>
        </div>
        <!-- payment gateway -->
        <div class="form-item row" v-if="showGateway(bankCardState.form.payment_type_id)">
          <div class="label col-12">{{ $t("modal.gateway") }}</div>
          <div class="radio-content col-12 q-mb-md radio-content-type">
            <q-radio
              v-for="item in paymentGatewayList"
              :key="item.value"
              dense
              v-model="bankCardState.form.payment_gateway_id"
              :val="item.value"
              :label="showGatewayName(item.label)"
              checked-icon="circle"
            />
          </div>
        </div>
        <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoWallet">
          <div class="form-item row input-row">
            <!-- name -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="label col-12">{{ $t("member.bank.name") }}</div>
              <div class="input-content col-12">
                <q-input
                  standout
                  v-model="bankCardState.form.name"
                  :placeholder="$t('member.bank.name')"
                  rounded
                  outlined
                  dense
                  borderless
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- wallet address -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="label col-12">{{ $t("member.bank.walletAddress") }}</div>
              <div class="input-content col-12">
                <q-input
                  standout
                  v-model="bankCardState.form.wallet_address"
                  :placeholder="$t('member.bank.walletAddress')"
                  rounded
                  outlined
                  dense
                  borderless
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
          </div>
          <div class="form-item row input-row">
            <!-- bank branch -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="form-title label col-12">{{ $t("member.deposit.currencyBrand") }}</div>
              <div class="input-content col-12">
                <q-select
                  v-model="bankCardState.form.crypto_id"
                  :options="cryptoList"
                  emit-value
                  map-options
                  outlined
                  dense
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                  class="form-input"
                />
              </div>
            </div>
            <!-- chain -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="form-title label col-12">{{ $t("member.deposit.chain") }}</div>
              <div class="input-content col-12">
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  emit-value
                  map-options
                  outlined
                  dense
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                  class="form-input"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoPayment">
          <div class="form-item row input-row">
            <!-- name -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="label col-12">{{ $t("member.bank.name") }}</div>
              <div class="input-content col-12">
                <q-input
                  standout
                  v-model="bankCardState.form.name"
                  :placeholder="$t('member.bank.name')"
                  rounded
                  outlined
                  dense
                  borderless
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- wallet address -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="label col-12">{{ $t("member.bank.walletAddress") }}</div>
              <div class="input-content col-12">
                <q-input
                  standout
                  v-model="bankCardState.form.wallet_address"
                  :placeholder="$t('member.bank.walletAddress')"
                  rounded
                  outlined
                  dense
                  borderless
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
          </div>
          <div class="form-item row input-row">
            <!-- bank branch -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="form-title label col-12">{{ $t("member.deposit.currencyBrand") }}</div>
              <div class="input-content col-12">
                <q-select
                  v-model="bankCardState.form.crypto_id"
                  :options="cryptoList"
                  emit-value
                  map-options
                  outlined
                  dense
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                  class="form-input"
                />
              </div>
            </div>
            <!-- chain -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="form-title label col-12">{{ $t("member.deposit.chain") }}</div>
              <div class="input-content col-12">
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  emit-value
                  map-options
                  outlined
                  dense
                  lazy-rules
                  :disable="!bankCardState.form.payment_gateway_id"
                  :rules="[Rules.requiredInt]"
                  class="form-input"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.BankTransfer">
          <div class="form-item row input-row">
            <!-- bank name -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="label col-12">{{ $t("member.bank.bankName") }}</div>
              <div class="input-content col-12">
                <q-input
                  standout
                  v-model="bankCardState.form.bank_name"
                  :placeholder="$t('member.bank.bankName')"
                  rounded
                  outlined
                  dense
                  borderless
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- name -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="label col-12">{{ $t("member.bank.name") }}</div>
              <div class="input-content col-12">
                <q-input
                  standout
                  v-model="bankCardState.form.name"
                  :placeholder="$t('member.bank.name')"
                  rounded
                  outlined
                  dense
                  borderless
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
          </div>
          <div class="form-item row input-row">
            <!-- account name -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="label col-12">{{ $t("member.bank.accountName") }}</div>
              <div class="input-content col-12">
                <q-input
                  standout
                  v-model="bankCardState.form.account_name"
                  :placeholder="$t('member.bank.accountName')"
                  rounded
                  outlined
                  dense
                  borderless
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- account number -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="label col-12">{{ $t("member.bank.accountNumber") }}</div>
              <div class="input-content col-12">
                <q-input
                  standout
                  v-model="bankCardState.form.account_number"
                  :placeholder="$t('member.bank.accountNumber')"
                  rounded
                  outlined
                  dense
                  borderless
                  lazy-rules
                  :rules="[Rules.required()]"
                  @update:model-value="validateAlphanumeric"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet">
          <div class="form-item row input-row">
            <!-- bank name -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="label col-12">{{ $t("member.bank.bankName") }}</div>
              <div class="input-content col-12">
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  emit-value
                  map-options
                  outlined
                  dense
                  lazy-rules
                  :disable="!bankCardState.form.payment_gateway_id"
                  :rules="[Rules.requiredInt]"
                  class="form-input"
                />
              </div>
            </div>
            <!-- name -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="label col-12">{{ $t("member.bank.name") }}</div>
              <div class="input-content col-12">
                <q-input
                  standout
                  v-model="bankCardState.form.name"
                  :placeholder="$t('member.bank.name')"
                  rounded
                  outlined
                  dense
                  borderless
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
          </div>
          <div class="form-item row input-row">
            <!-- account name -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="label col-12">{{ $t("member.bank.accountName") }}</div>
              <div class="input-content col-12">
                <q-input
                  standout
                  v-model="bankCardState.form.account_name"
                  :placeholder="$t('member.bank.accountName')"
                  rounded
                  outlined
                  dense
                  borderless
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- account number -->
            <div class="row col-11 col-sm-5 mr-5">
              <div class="label col-12">{{ $t("member.bank.accountNumber") }}</div>
              <div class="input-content col-12">
                <q-input
                  standout
                  v-model="bankCardState.form.account_number"
                  :placeholder="$t('member.bank.accountNumber')"
                  rounded
                  outlined
                  dense
                  borderless
                  lazy-rules
                  :rules="[Rules.required()]"
                  @update:model-value="validateAlphanumeric"
                />
              </div>
            </div>
          </div>
        </template>

        <div class="action-btns multi-btns row justify-center no-wrap">
          <q-btn text-color="white" :label="$t('common.btn.cancel')" class="cancle-btn" @click="goMemberBank" />
          <q-btn text-color="black" :label="$t('common.btn.submit')" class="submit-btn" type="submit" />
        </div>
      </div>
    </div>
  </q-form>
</template>
<script lang="ts" setup>
import BackBtn from "app/template/set_r016/components/Button/Back.vue"
import { useQuasar } from "quasar"
import { useBank } from "src/common/composables/useBank"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE } from "src/common/utils/constants"
import { computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const Rules = useRule()
const {
  showGateway,
  availCurrencyList,
  getAvailCurrencyList,
  bankCardState,
  validateNumeric,
  validateAlphanumeric,
  paymentTypeList,
  paymentGatewayList,
  getPaymentTypeList,
  currencyList,
  bankList,
  getBankList,
  cryptoList,
  getCryptoList,
  handleBankCardCurrencyClick,
  handleBankCardPaymentTypeClick,
  handleBankCardAdd,
  handleBankCardEdit,
  resetBankCardForm,
  getBankCardInfo
} = useBank()

const bankCardId = computed(() => {
  if (route.params.id) {
    return parseInt(route.params.id as string)
  }
  return 0
})

const goMemberBank = () => {
  resetBankCardForm()
  router.push({ name: "memberBank" })
}
const handleSubmit = async () => {
  const submitFunction = bankCardId.value ? handleBankCardEdit : handleBankCardAdd
  const isSuccess = await submitFunction()
  if (isSuccess) {
    goMemberBank()
  }
}

const showGatewayName = (label: string) => {
  switch (label) {
    case "365pay_cny":
      return "365钱包"
    case "jdpay_cny":
      return "JD钱包"
    case "baobi_cny":
      return "宝币钱包"
    case "mpay_cny":
      return "Mpay钱包"
    case "direpay_cny_usdt":
      return "DIREPAY"
    case "17pay_bank_cny":
      return "17pay"
    case "heropay_cny":
      return "豪杰支付 (CNY)"
    case "heropay_online_bank_cny":
      return "豪杰支付-网银 (CNY)"

    default:
      return "无此渠道"
  }
}

watch(
  () => bankCardState.form.payment_gateway_id,
  async (gatewayId) => {
    await getBankList(gatewayId)
  }
)

onMounted(async () => {
  $q.loading.show()
  await getCryptoList()
  await getAvailCurrencyList()
  resetBankCardForm()

  if (bankCardId.value) {
    await getBankCardInfo({ id: bankCardId.value })
    getPaymentTypeList(bankCardState.form.currency)
  } else {
    getPaymentTypeList(bankCardState.form.currency)
  }
  $q.loading.hide()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import 'app/template/set_r016/assets/css/style.sass'
@import 'app/template/set_r016/assets/css/_variable.scss'

.action-btns
  .cancle-btn
    background-color: #fff !important
    width: 50% !important
    color: $primary04 !important
  .submit-btn
    background: linear-gradient(180deg, $primary04 0%, $primary05 100%)
    width: 50% !important
    color: #fff !important

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
        padding: 1rem 1.5rem
        border-radius: .5rem
      .submit-btn
        width: 300px
        border-radius: 10px
        background: linear-gradient(180deg, $primary04 0%, $primary05 100%)
        color: $neutral01 !important
      .form-item
        margin-left: 0rem
        .label
          padding-left: 0rem
        .payment-form
          width: 100%
          margin-top: 1.25rem
          .form-methods
            margin: 20px 10px
            +setFlex(flex-start)
            flex-direction: row
            flex-wrap: wrap
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
                width: 8rem
                height: auto
                max-height: 4rem
                margin-right: 20px
              &.active
                background: rgba(255, 255, 255, 0.2)
                border: 1px solid #F9E8E8
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
          padding-top: 1.2rem
          gap: 1.563vw
          :deep(.q-radio)
            .q-icon
              color: $primary06
          +iphone-width
            flex-wrap: wrap
            padding: 1.125rem 0
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

:deep(.nav-content)
  +iphone-width
    background: $primary-btn-bg!important
</style>
