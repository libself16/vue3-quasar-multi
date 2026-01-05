<template>
  <div class="bank-add-layout">
    <div class="bank-add-container">
      <div class="bank-header">
        <span>{{ bankCardId ? $t("common.btn.edit") : $t("common.btn.add") }}</span>
      </div>
      <div class="bank-body column">
        <div class="profile-form column">
          <q-form class="form-content" @submit="handleSubmit">
            <div class="form-row grid grid-cols-2 gap-4">
              <!-- currency -->
              <div class="form-item row">
                <div class="form-title label col-12">{{ $t("member.bank.selectCurrency") }}</div>
                <div class="btn-content col-12">
                  <ExtraSelect
                    :modelValue="bankCardState.form.currency"
                    @update:modelValue="($event) => handleBankCardCurrencyClick($event)"
                    :field="{
                      field_code: 'currency',
                      field_name: 'currency',
                      is_required: true,
                      type: FIELD_TYPE.Enums.Select,
                      values: availCurrencyList.map(item => ({
                        label: $t(formatterCurrency(item.code) as string),
                        value: item.code
                      }))
                    }"
                    optionStyle="option-style"
                    class="form-input"
                  ></ExtraSelect>
                </div>
              </div>
              <!-- payment type -->
              <div class="form-item row">
                <div class="form-title label col-12">{{ $t("modal.type") }}</div>
                <div class="btn-content col-12">
                  <ExtraSelect
                    :modelValue="bankCardState.form.payment_type_id"
                    @update:modelValue="($event) => handleBankCardPaymentTypeClick($event)"
                    :field="{
                      field_code: 'usingFundType',
                      field_name: 'usingFundType',
                      is_required: true,
                      type: FIELD_TYPE.Enums.Select,
                      values: paymentTypeList.map((item) => ({
                        label: $t(item.label as string),
                        value: item.value
                      }))
                    }"
                    optionStyle="option-style"
                    class="form-input"
                  ></ExtraSelect>
                </div>
              </div>
            </div>

            <!-- payment gateway -->
            <div class="form-item row" v-if="showGateway(bankCardState.form.payment_type_id)">
              <div class="form-title label col-12">{{ $t("modal.gateway") }}</div>
              <div class="btn-content col-12">
                <ExtraSelect
                  :modelValue="bankCardState.form.payment_gateway_id"
                  @update:modelValue="($event) => (bankCardState.form.payment_gateway_id = $event)"
                  :field="{
                    field_code: 'gateway',
                    field_name: 'gateway',
                    is_required: true,
                    type: FIELD_TYPE.Enums.Select,
                    values: paymentGatewayList.map((item) => ({
                      label: $t(item.label),
                      value: item.value
                    }))
                  }"
                  optionStyle="option-style"
                  class="form-input"
                ></ExtraSelect>
              </div>
            </div>
            <!-- 底下的Type特定欄位-->
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoWallet">
              <div class="form-row grid grid-cols-2 gap-4">
                <!-- name -->
                <div class="form-item row input-row">
                  <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
                  <div class="btn-content col-12">
                    <q-input
                      v-model="bankCardState.form.name"
                      :placeholder="$t('member.bank.name')"
                      class="form-input"
                      dense
                      borderless
                      lazy-rules
                      :rules="[Rules.required()]"
                    >
                      <template #prepend>
                        <div class="divider-error"></div>
                      </template>
                    </q-input>
                  </div>
                </div>
                <!-- currencyBrand -->
                <div class="form-item row input-row">
                  <div class="form-title label col-12">{{ $t("member.deposit.currencyBrand") }}</div>
                  <div class="btn-content col-12">
                    <ExtraSelect
                      :modelValue="bankCardState.form.crypto_id"
                      @update:modelValue="($event) => (bankCardState.form.crypto_id = $event)"
                      :field="{
                        field_code: 'crypto',
                        field_name: 'crypto',
                        is_required: true,
                        type: FIELD_TYPE.Enums.Select,
                        values: cryptoList.map((item) => ({
                          label: item.label,
                          value: item.value
                        }))
                      }"
                      optionStyle="option-style"
                      class="form-input"
                    ></ExtraSelect>
                  </div>
                </div>
              </div>
              <div class="form-row grid grid-cols-2 gap-4">
                <!-- chain -->
                <div class="form-item row input-row">
                  <div class="form-title label col-12">{{ $t("member.deposit.chain") }}</div>
                  <div class="btn-content col-12">
                    <ExtraSelect
                      :modelValue="bankCardState.form.bank_id"
                      @update:modelValue="($event) => (bankCardState.form.bank_id = $event)"
                      :field="{
                        field_code: 'bank',
                        field_name: 'bank',
                        is_required: true,
                        type: FIELD_TYPE.Enums.Select,
                        values: bankList.map((item) => ({
                          label: item.label,
                          value: item.value
                        }))
                      }"
                      optionStyle="option-style"
                      class="form-input"
                    ></ExtraSelect>
                  </div>
                </div>
                <!-- wallet address -->
                <div class="form-item row input-row">
                  <div class="form-title label col-12">{{ $t("member.deposit.walletAddress") }}</div>
                  <div class="btn-content col-12">
                    <q-input
                      v-model="bankCardState.form.wallet_address"
                      :placeholder="$t('member.deposit.walletAddress')"
                      class="form-input"
                      dense
                      borderless
                      lazy-rules
                      :rules="[Rules.required()]"
                    >
                      <template #prepend>
                        <div class="divider-error"></div>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoPayment">
              <div class="form-row grid grid-cols-2 gap-4">
                <!-- name -->
                <div class="form-item row input-row">
                  <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.name"
                      :placeholder="$t('member.bank.name')"
                      class="form-input"
                      dense
                      borderless
                      lazy-rules
                      :rules="[Rules.required()]"
                    >
                      <template #prepend>
                        <div class="divider-error"></div>
                      </template>
                    </q-input>
                  </div>
                </div>
                <!-- currencyBrand -->
                <div class="form-item row input-row">
                  <div class="form-title label col-12">{{ $t("member.deposit.currencyBrand") }}</div>
                  <div class="input-content col-12">
                    <ExtraSelect
                      :modelValue="bankCardState.form.crypto_id"
                      @update:modelValue="($event) => (bankCardState.form.crypto_id = $event)"
                      :field="{
                        field_code: 'currency',
                        field_name: 'currency',
                        is_required: true,
                        type: FIELD_TYPE.Enums.Select,
                        values: cryptoList.map((item) => ({
                          label: item.label,
                          value: item.value
                        }))
                      }"
                      optionStyle="option-style"
                      class="form-input"
                    ></ExtraSelect>
                  </div>
                </div>
              </div>
              <div class="form-row grid grid-cols-2 gap-4">
                <!-- chain -->
                <div class="form-item row input-row pt-5">
                  <div class="form-title label col-12">{{ $t("member.deposit.chain") }}</div>
                  <div class="input-content col-12">
                    <ExtraSelect
                      :modelValue="bankCardState.form.bank_id"
                      @update:modelValue="($event) => (bankCardState.form.bank_id = $event)"
                      :field="{
                        field_code: 'bank',
                        field_name: 'bank',
                        is_required: true,
                        type: FIELD_TYPE.Enums.Select,
                        values: bankList.map((item) => ({
                          label: item.label,
                          value: item.value
                        }))
                      }"
                      optionStyle="option-style"
                      class="form-input"
                    ></ExtraSelect>
                  </div>
                </div>
                <!-- wallet address -->
                <div class="form-item row input-row pt-5">
                  <div class="form-title label col-12">{{ $t("member.deposit.walletAddress") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.wallet_address"
                      :placeholder="$t('member.deposit.walletAddress')"
                      class="form-input"
                      dense
                      borderless
                      lazy-rules
                      :rules="[Rules.required()]"
                    >
                      <template #prepend>
                        <div class="divider-error"></div>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.BankTransfer">
              <div class="form-row grid grid-cols-2 gap-4">
                <div class="form-item row input-row">
                  <!-- bank name -->
                  <div class="form-title label col-12">{{ $t("member.bank.bankName") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.bank_name"
                      :placeholder="$t('member.bank.bankName')"
                      class="form-input"
                      dense
                      borderless
                      lazy-rules
                      :rules="[Rules.required()]"
                    >
                      <template #prepend>
                        <div class="divider-error"></div>
                      </template>
                    </q-input>
                  </div>
                </div>
                <div class="form-item row input-row">
                  <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.name"
                      :placeholder="$t('member.bank.name')"
                      class="form-input"
                      dense
                      borderless
                      lazy-rules
                      :rules="[Rules.required()]"
                    >
                      <template #prepend>
                        <div class="divider-error"></div>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
              <div class="form-row grid grid-cols-2 gap-4">
                <!-- name -->
                <div class="form-item row input-row pt-5">
                  <!-- account name -->
                  <div class="form-title label col-12">{{ $t("member.bank.accountName") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.account_name"
                      :placeholder="$t('member.bank.accountName')"
                      class="form-input"
                      dense
                      borderless
                      lazy-rules
                      :rules="[Rules.required()]"
                    >
                      <template #prepend>
                        <div class="divider-error"></div>
                      </template>
                    </q-input>
                  </div>
                </div>
                <!-- account number -->
                <div class="form-item row input-row pt-5">
                  <div class="form-title label col-12">{{ $t("member.bank.accountNumber") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.account_number"
                      :placeholder="$t('member.bank.accountNumber')"
                      class="form-input"
                      dense
                      borderless
                      lazy-rules
                      :rules="[Rules.required()]"
                      @update:model-value="validateAlphanumeric"
                    >
                      <template #prepend>
                        <div class="divider-error"></div>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet">
              <div class="form-row grid grid-cols-2 gap-4">
                <!-- bank branch -->
                <div class="form-item row input-row">
                  <div class="form-title label col-12">{{ $t("member.bank.bankName") }}</div>
                  <div class="btn-content col-12">
                    <ExtraSelect
                      :modelValue="bankCardState.form.bank_id"
                      @update:modelValue="($event) => (bankCardState.form.bank_id = $event)"
                      :field="{
                        field_code: 'bank_name',
                        field_name: 'bank_name',
                        is_required: true,
                        type: FIELD_TYPE.Enums.Select,
                        values: bankList.map((item) => ({
                          label: item.label,
                          value: item.value
                        }))
                      }"
                      optionStyle="option-style"
                      class="form-input"
                    ></ExtraSelect>
                  </div>
                </div>
                <!-- name -->
                <div class="form-item row input-row">
                  <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
                  <div class="btn-content col-12">
                    <q-input
                      v-model="bankCardState.form.name"
                      :placeholder="$t('member.bank.name')"
                      class="form-input"
                      dense
                      borderless
                      lazy-rules
                      :rules="[Rules.required()]"
                    >
                      <template #prepend>
                        <div class="divider-error"></div>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
              <div class="form-row grid grid-cols-2 gap-4">
                <div class="form-item row input-row">
                  <!-- account name -->
                  <div class="form-title label col-12">{{ $t("member.bank.accountName") }}</div>
                  <div class="btn-content col-12">
                    <q-input
                      v-model="bankCardState.form.account_name"
                      :placeholder="$t('member.bank.accountName')"
                      class="form-input"
                      dense
                      borderless
                      lazy-rules
                      :rules="[Rules.required()]"
                    >
                      <template #prepend>
                        <div class="divider-error"></div>
                      </template>
                    </q-input>
                  </div>
                </div>
                <!-- account number -->
                <div class="form-item row input-row">
                  <div class="form-title label col-12">{{ $t("member.bank.accountNumber") }}</div>
                  <div class="btn-content col-12">
                    <q-input
                      v-model="bankCardState.form.account_number"
                      :placeholder="$t('member.bank.accountNumber')"
                      class="form-input"
                      dense
                      borderless
                      lazy-rules
                      :rules="[Rules.required()]"
                      @update:model-value="validateAlphanumeric"
                    >
                      <template #prepend>
                        <div class="divider-error"></div>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </template>

            <div class="action-btns grid grid-cols-2 gap-4">
              <q-btn class="cancle-btn" @click="goMemberBank">
                {{ $t("common.btn.cancel") }}
              </q-btn>
              <q-btn class="submit-btn" type="submit">
                {{ $t("common.btn.confirm") }}
              </q-btn>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import { useQuasar } from "quasar"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useBank } from "src/common/composables/useBank"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE, FIELD_TYPE } from "src/common/utils/constants"
import { computed, onMounted, onUnmounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"

const { isTelegramMiniApp, listenPreventOverflow, removeListenPreventOverflow } = useTelegram()
const { memberImg } = useSiteImg()
const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const Rules = useRule()
const {
  typeI18n,
  showGateway,
  availCurrencyList,
  getAvailCurrencyList,
  paymentGatewayList,
  bankCardState,
  validateNumeric,
  validateAlphanumeric,
  paymentTypeList,
  currencyList,
  bankList,
  getBankList,
  cryptoList,
  getCryptoList,
  cryptoRate,
  getWithdrawCryptoRate,
  getPaymentTypeList,
  getUsingPaymentGatewayList,
  handleBankCardAdd,
  handleBankCardEdit,
  handleBankCardCurrencyClick,
  handleBankCardPaymentTypeClick,
  resetBankCardForm,
  getBankCardInfo,
  formatterCurrency
} = useBank()

// const showRate = computed(() => {
//   const { crypto_id } = bankCardState.form
//   if (crypto_id) return true

//   return false
// })

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

watch(
  () => bankCardState.form.payment_gateway_id,
  (newId) => {
    switch (bankCardState.form.payment_type_id) {
      case FUND_METHOD_TYPE.Enums.EWallet:
      case FUND_METHOD_TYPE.Enums.CryptoPayment:
        getBankList(newId)
        break
      default:
        break
    }
  }
)

onMounted(async () => {
  getCryptoList()
  await getAvailCurrencyList()

  // 编辑模式：先获取银行卡信息（包含正确的币别），再获取支付类型列表
  if (bankCardId.value) {
    await getBankCardInfo({ id: bankCardId.value })
    await getPaymentTypeList(bankCardState.form.currency) // 使用从后端获取的正确币别
    await getUsingPaymentGatewayList()
    switch (bankCardState.form.payment_type_id) {
      case FUND_METHOD_TYPE.Enums.CryptoWallet:
        getBankList()
        break
    }
  } else {
    // 新增模式：先获取支付类型列表，再设置默认值
    await getPaymentTypeList(bankCardState.form.currency)
    handleBankCardPaymentTypeClick(paymentTypeList.value[0].value)
  }

  if (isTelegramMiniApp.value) {
    listenPreventOverflow()
  }
})

onUnmounted(() => {
  if (isTelegramMiniApp.value) {
    removeListenPreventOverflow()
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
// @import "src/css/form.sass"
@import "app/template/set_r017/assets/css/_variable.scss"

.form-input
  margin-top: 0

  ::v-deep(.q-field__inner)
    height: 2.6875rem
    border-radius: 0.25rem
    border: 2px solid var(--neutral-05)
    background: var(--secondary-10)
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5)

    .q-field__native
      color: var(--neutral-01)

    .q-field__control
      color: var(--primany-01)
      border-radius: 0.25rem
      // padding: 0 0.75rem
.form-input
  @apply w-full
  +phone-width
    padding-bottom: 0.625rem
    margin-bottom: 0
  :deep(.q-icon)
    color: var(--neutral-01)
  :deep(.q-field__control)
    // min-height: 45px
    height: 100%
    border-bottom: .0625rem solid #dee3f026
    border-radius: .5rem
    .q-field__control-container
      padding: 0
    .q-field__native
      height: 100%
      color: var(--neutral-01)
      .q-field__input
        color: var(--neutral-01)
    .q-field__label
      height: 100%
      color: dimgrey
    .q-field__append
      height: 100%
      line-height: 100%
    &::after
      height: 100%

.input-content
  ::v-deep(.q-field__control)
    border-radius: 0px
    border: 0px
    // border-bottom: 2px solid $neutral01
    .q-field__label
      font-family: "Noto Sans CJK TC" !important
      font-weight: bold
  ::v-deep(.q-field--with-bottom)
    padding-bottom: 0
  p
    color: $neutral10

.radio-content
  width: 100%
  +setFlex(flex-start)
  flex-wrap: wrap
  ::v-deep(.q-radio)
    .q-radio__inner
      margin-left: .625rem
      margin-right: .625rem
      color: $emotional07 !important
      background-color: $neutral01 !important
      border-color: $emotional07 !important
      .q-radio__icon-container
        border-radius: 50%
        border: 2px solid $emotional07 !important
    .q-icon
      font-size: .625rem
      color: $emotional07
    .q-radio__label
      color: $neutral05 !important

.triangle
  width: 0
  height: 0
  border-top: 0px solid transparent
  border-right: 0px solid transparent
  border-bottom: 25px solid $emotional03
  border-left: 25px solid transparent
  position: absolute
  display: none
  right: 0
  bottom: 0
  i
    position: absolute
    right: 2px
    bottom: -25px
    color: $neutral01
    font-size: 0.8rem

.edit-dialog
  .dialog-card
    width: 100%
    height: 500px
    background-color: $neutral01

    .dialog-header
      height: 5.5rem
      font-size: 2rem
      padding: 1.25rem 1.75rem
      border-bottom: 1px solid rgba($neutral01, 0.5)
      display: flex
      align-items: center
      justify-content: space-between
      .q-btn
        font-size: 2rem
        text-transform: capitalize
        font-weight: 400
        padding: 0
        min-height: auto
      .btn-cancel
        color: $neutral02
      .title
        font-weight: bold
        max-width: 20rem
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        font-weight: 700
    .dialog-body
      .dialog-form-row
        width: 100%
        padding: 20px
        height: 134px
        :deep(.q-field__control)
          color: $neutral02 !important
        .dialog-form-title
          font-weight: 400
          line-height: 2.87
          letter-spacing: 0.00938em
          position: relative
          display: block
          transform-origin: left top
          text-overflow: ellipsis
          max-width: 100%
          font-family: "PingFang SC"
          color: $neutral04
          font-size: 1.75rem
          padding: 0px
          white-space: nowrap
          overflow: hidden
          transition: color 200ms cubic-bezier(0, 0, 0.2, 1), transform 200ms cubic-bezier(0, 0, 0.2, 1), max-width 200ms cubic-bezier(0, 0, 0.2, 1)
        .dialog-form-input
          font-size: 1.75rem
          font-weight: 400
          :deep(.q-icon)
            font-size: 1.875rem !important
      .select-container
        height: 25.75rem
        overflow-y: scroll
        .select-row
          width: 100%
          height: 96px
          list-style: none
          color: $neutral04
          font-size: 1.75rem
          padding: 0px 1.75rem
          display: flex
          align-items: center
          justify-content: space-between
          .check-img
            display: none
          &.active
            color: $neutral05
            font-weight: bold
            background: rgba($neutral02, 0.5)
            .check-img
              display: block
              width: 2.5rem
              height: 2.5rem
    @include phone-width
      height: 350px
      .dialog-header
        height: 2.9375rem
        font-size: 16px
        padding: 10px 14px
        .q-btn
          font-size: 1rem
        .title
          max-width: 160px
          font-size: 1.125rem
      .dialog-body
        .dialog-form-row
          .dialog-form-title
            font-size: 0.875rem
          .dialog-form-input
            font-size: 0.875rem
        .select-container
          height: 12.875rem
          .select-row
            height: 3rem
            font-size: 0.875rem
            padding: 0px 0.875rem
            &.active
              .check-img
                width: 1.375rem
                height: 1.375rem

.bank-add-layout
  // max-width: 55rem
  width: 100%
  height: 100%
  border-radius: 12px
  height: 560px
  background: var(--bg-11)
  padding: 20px
  gap: 10px
  flex: 1 0 0
  +phone-width
    height: 700px
    background: transparent
    padding: 0
  .bank-add-container
    +setFlex
    flex-direction: column
    width: 100%
    height: 100%
    .bank-header
      @apply w-full flex justify-between items-center
      span
        color: $neutral01
        font-family: "Noto Sans"
        font-size: 1.2rem
        font-style: normal
        font-weight: 700
        line-height: normal
        text-transform: capitalize
    .bank-body
      height: 100%
      color: $neutral01
      width: 100%
      max-width: 560px
      margin-top: 1.5625rem
      // padding: 6vw 0
      overflow: hidden
      +iphone-width
        padding: 0
      .profile-form
        width: 100%
        height: 100%
        display: flex
        flex-direction: column
        -webkit-box-pack: start
        justify-content: flex-start
        .form-title-content
          width: 100%
          .color-label
            background-color: $emotional07 !important
          .title
            color: $emotional07
        .form-content
          width: 100%
          height: 100%
          .form-row
            +phone-width
              @apply grid-cols-1
          .form-item
            +setFlex(flex-start)
            &.input-row
              +iphone-width
                gap: 0
                justify-content: center
            .form-title
              color: var(--text-03)
              /* 次標題 */
              font-family: "Noto Sans TC"
              font-size: 14px
              font-style: normal
              font-weight: 700
              line-height: normal
            .btn-content
              +setFlex(flex-start)
              flex-wrap: wrap
              padding-top: 0.5rem
              // padding-left: .75rem
              gap: 1.563vw
              ::v-deep(.q-btn)
                text-transform: none
                display: flex
                -webkit-box-align: center
                align-items: center
                border: 2px solid $neutral01 !important
                border-radius: 10px
                padding: 0px 15px
                position: relative
                width: 150px
                height: 60px
                font-size: 1rem
                background: $neutral01 !important
                color: $neutral05 !important
                overflow: hidden
                &.active
                  border: 2px solid $emotional07 !important
                  color: $emotional07 !important
                  .triangle
                    display: block
            .input-content
              // margin: .5rem .5rem 0 0.8rem
              padding-top: 0.5rem
            .radio-content
              // +setFlex(flex-start)
              padding-top: 1.75rem
              padding-left: .75rem
              gap: 1.875rem
              +iphone-width
                padding-top: 1.125rem
                padding-left: .625rem
                gap: 1.25rem
            .btn-toggle-content
              +setFlex(flex-start)
              padding-top: 1.75rem
              padding-left: .75rem
              gap: 1.875rem
              +iphone-width
                padding-top: 1.125rem
                padding-left: .625rem
                gap: 1.25rem
      .action-btns
        width: 100%
        position: absolute
        bottom: 0
        padding: 10px 0
        .q-btn
          display: flex
          height: 36px
          padding: 10px
          justify-content: center
          align-items: center
          gap: 4px
          flex: 1 0 0
        .cancle-btn
          border-radius: 4px
          border: 1px solid var(--btn-border-02)
          box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.12)
          color: var(--btn-text-04)
        .submit-btn
          border-radius: 4px !important
          background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%) !important
</style>
