<template>
  <div class="bank-layout">
    <BankCard
      v-for="item in bankCardState.list"
      :key="item.id"
      :card="item"
      :activeId="withdrawState.form.bank_id"
      :bankList="bankList"
      :gatewayFilterList="gatewayFilterList"
      @click="handleWithdralBankCardClick(item.id)"
    >
      <div class="edit-bar" v-if="envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN">
        <i class="fas fa-trash delete" @click="openConfirm(item.id)"></i>
        <i
          data-bs-toggle="modal"
          data-bs-target="#addbank-modal"
          class="fas fa-edit edit"
          @click="openAddCardDialog('Edit', item.id)"
        >
        </i>
      </div>
    </BankCard>
    <AddBankCard v-if="envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN" @click="openAddCardDialog('Add')" />
  </div>
  <!-- dialog -->
  <q-dialog v-model="modalShow">
    <q-card class="form-card">
      <q-form @submit="submitForm()">
        <q-card-actions class="currency-row">
          <div class="title">{{ $t("member.bank.selectCurrency") }}</div>
          <div class="btns">
            <q-btn
              v-for="item in availCurrencyList"
              :key="item.id"
              :class="{ active: `${item.code}` === bankCardState.form.currency }"
              @click="handleBankCardCurrencyClick(item.code)"
            >
              {{ $t(item.code) }}
            </q-btn>
          </div>
        </q-card-actions>
        <q-card-section class="payment-info-container">
          <ul class="payment-type-container">
            <li
              v-for="item in paymentTypeList"
              :key="item.value"
              :class="{ active: String(item.value) === `${bankCardState.form.payment_type_id}` }"
              @click="handleBankCardPaymentTypeClick(item.value)"
            >
              {{ $t(item.label) }}
            </li>
          </ul>
          <div class="form-container">
            <!-- Gateway -->
            <template v-if="showGateway(bankCardState.form.payment_type_id)">
              <div class="form-row">
                <label class="form-title">{{ $t("modal.gateway") }}</label>
                <q-select
                  v-model="bankCardState.form.payment_gateway_id"
                  :options="paymentGatewayList"
                  emit-value
                  map-options
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                  class="form-input"
                />
              </div>
            </template>

            <!-- BankTransfer -->
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.BankTransfer">
              <div class="form-row">
                <label class="form-title">{{ $t("member.bank.withdrawalBank") }}</label>
                <q-input
                  v-model="bankCardState.form.bank_name"
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input"
                  :placeholder="$t('member.bank.withdrawalBank')"
                />
              </div>
              <div class="form-row">
                <label class="form-title">{{ $t("member.bank.name") }}</label>
                <q-input
                  v-model="bankCardState.form.name"
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input"
                  :placeholder="$t('member.bank.name')"
                />
              </div>
              <div class="form-row">
                <label class="form-title">{{ $t("member.bank.accountName") }}</label>
                <q-input
                  v-model="bankCardState.form.account_name"
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input"
                  :placeholder="$t('member.bank.accountName')"
                />
              </div>
              <div class="form-row">
                <label class="form-title">{{ $t("member.bank.accountNumber") }}</label>
                <q-input
                  v-model="bankCardState.form.account_number"
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input"
                  :placeholder="$t('member.bank.accountNumber')"
                  @update:model-value="validateAlphanumeric"
                />
              </div>
            </template>

            <!-- EWallet -->
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet">
              <div class="form-row">
                <label class="form-title">{{ $t("member.bank.withdrawalBank") }}</label>
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  :disable="!bankCardState.form.payment_gateway_id"
                  emit-value
                  map-options
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                  class="form-input"
                />
              </div>
              <div class="form-row">
                <label class="form-title">{{ $t("member.bank.name") }}</label>
                <q-input
                  v-model="bankCardState.form.name"
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input"
                  :placeholder="$t('member.bank.name')"
                />
              </div>
              <div class="form-row">
                <label class="form-title">{{ $t("member.bank.accountName") }}</label>
                <q-input
                  v-model="bankCardState.form.account_name"
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input"
                  :placeholder="$t('member.bank.accountName')"
                />
              </div>
              <div class="form-row">
                <label class="form-title">{{ $t("member.bank.accountNumber") }}</label>
                <q-input
                  v-model="bankCardState.form.account_number"
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input"
                  :placeholder="$t('member.bank.accountNumber')"
                  @update:model-value="validateAlphanumeric"
                />
              </div>
            </template>

            <!-- CryptoWallet -->
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoWallet">
              <div class="form-row">
                <label class="form-title">{{ $t("member.bank.name") }}</label>
                <q-input
                  v-model="bankCardState.form.name"
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input"
                  :placeholder="$t('member.bank.name')"
                />
              </div>
              <div class="form-row">
                <label class="form-title">{{ $t("member.deposit.currencyBrand") }}</label>
                <q-select
                  v-model="bankCardState.form.crypto_id"
                  :options="cryptoList"
                  emit-value
                  map-options
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                  class="form-input"
                />
              </div>
              <div class="form-row">
                <label class="form-title">{{ $t("member.deposit.chain") }}</label>
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  emit-value
                  map-options
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                  class="form-input"
                />
              </div>
              <div class="form-row">
                <label class="form-title">{{ $t("member.deposit.walletAddress") }}</label>
                <q-input
                  v-model="bankCardState.form.wallet_address"
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input"
                  :placeholder="$t('member.deposit.walletAddress')"
                />
              </div>
            </template>

            <!-- CryptoPayment -->
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoPayment">
              <div class="form-row">
                <label class="form-title">{{ $t("member.bank.name") }}</label>
                <q-input
                  v-model="bankCardState.form.name"
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input"
                  :placeholder="$t('member.bank.name')"
                />
              </div>
              <div class="form-row">
                <label class="form-title">{{ $t("member.deposit.currencyBrand") }}</label>
                <q-select
                  v-model="bankCardState.form.crypto_id"
                  :options="cryptoList"
                  emit-value
                  map-options
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                  class="form-input"
                />
              </div>
              <div class="form-row">
                <label class="form-title">{{ $t("member.deposit.chain") }}</label>
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  :disable="!bankCardState.form.payment_gateway_id"
                  emit-value
                  map-options
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                  class="form-input"
                />
              </div>
              <div class="form-row">
                <label class="form-title">{{ $t("member.deposit.walletAddress") }}</label>
                <q-input
                  v-model="bankCardState.form.wallet_address"
                  bg-color="white"
                  outlined
                  lazy-rules
                  :rules="[Rules.required()]"
                  class="form-input"
                  :placeholder="$t('member.deposit.walletAddress')"
                />
              </div>
            </template>

            <!-- btns -->
            <div class="form-row-submit">
              <q-btn
                rounded
                color="cancel"
                push
                :label="$t('common.btn.cancel')"
                type="reset"
                v-close-popup
                class="btn-cancel"
              />
              <q-btn rounded color="submit" push :label="$t('common.btn.submit')" class="btn-submit" type="submit" />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
  <!-- 確認刪除卡片彈窗 -->
  <q-dialog v-model="confirmModal" persistent>
    <q-card class="bg-confirm text-confirm">
      <q-card-section class="row items-center">
        <span class="q-ml-sm">{{ $t("member.bank.deleteMessage") }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('common.btn.cancel')" color="normal" v-close-popup />
        <q-btn flat :label="$t('common.btn.confirm')" color="primary" @click="deleteCardForm()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from "quasar"
import { useBank } from "src/common/composables/useBank"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE, MEMBER_BANK_EDIT } from "src/common/utils/constants"
import { useEnvInfoStore } from "src/stores/envStore"
import { onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import AddBankCard from "../AddBankCard.vue"
import BankCard from "../BankCard.vue"

const { t } = useI18n()
const { envInfo } = useEnvInfoStore()
const Rules = useRule()
const {
  availCurrencyList,
  getAvailCurrencyList,
  bankCardState,
  validateNumeric,
  validateAlphanumeric,
  getBankCardList,
  getBankCardInfo,
  withdrawState,
  handleWithdralBankCardClick,
  getPaymentTypeList,
  paymentGatewayList,
  paymentTypeList,
  currencyList,
  handleBankCardCurrencyClick,
  handleBankCardPaymentTypeClick,
  getGatewayList,
  gatewayFilterList,
  getBankList,
  bankList,
  handleBankCardAdd,
  handleBankCardEdit,
  handleBankCardDelete,
  resetBankCardForm,
  showGateway,
  cryptoList,
  getCryptoList
} = useBank()

const modalShow = ref(false)
const confirmModal = ref(false)
const modalType = ref("")
const $q = useQuasar()

const deleteCardForm = async () => {
  $q.loading.show()
  confirmModal.value = false

  const isSuccess = await handleBankCardDelete(withdrawState.form.bank_id)
  if (isSuccess) {
    modalShow.value = false
    await getBankCardList()
    resetBankCardForm()
  }
}

async function openConfirm(id: number) {
  confirmModal.value = true
  handleWithdralBankCardClick(id)
}

async function openAddCardDialog(type: string, id?: number) {
  modalShow.value = true
  modalType.value = type
  if (modalType.value === "Edit") {
    await getBankCardInfo({ id: id as number })
    await getPaymentTypeList(bankCardState.form.currency)
    return
  } else {
    await getPaymentTypeList(bankCardState.form.currency)
  }

  resetBankCardForm()
}

async function addBankCard() {
  const isSuccess = await handleBankCardAdd()
  if (isSuccess) {
    await getBankCardList()
    modalShow.value = false
    resetBankCardForm()
  }
}

async function editBankCard() {
  const isSuccess = await handleBankCardEdit()
  if (isSuccess) {
    modalShow.value = false
    await getBankCardList()
    resetBankCardForm()
  }
}

const submitForm = () => {
  modalType.value === "Edit" ? editBankCard() : addBankCard()
}

onMounted(() => {
  getBankCardList()
  getGatewayList()
  getBankList()
  getAvailCurrencyList()
  getCryptoList()
})

watch(
  () => bankCardState.form.payment_gateway_id,
  (newId) => {
    getBankList(newId)
  }
)
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import "app/template/set33_RED/assets/css/_variable.sass"
@import "app/template/set33_RED/assets/css/button.sass"

.edit-bar
  position: absolute
  right: 10px
  top: 10px
  i
    margin: 0 4px
    font-size: 12px
    &.edit
      color: #99cc0d
    &.delete
      color: #fa6a60

.bank-layout
  @apply py-5 px-3 block mx-auto grid grid-cols-2 gap-3
  max-width: 46.875rem
  +phone-width
    @apply grid-cols-1 px-5

.form-card
  @apply p-5
  min-height: 24.375rem
  max-width: 50.9375rem
  width: 50.9375rem
  background: #3D0202
  border-radius: 8px
  border: 1px solid #D14444
  .currency-row
    @apply relative w-full mx-auto mb-8 flex items-start pb-4 flex-nowrap
    border-bottom: 1px solid rgba(209, 68, 68, 1)
    +pad-width
      @apply flex-wrap
    .title
      width: 37%
      font-size: .875rem
      margin: 0 0 1rem
      color: #fff
      +pad-width
        width: 100%
    .btns
      @apply w-full flex items-center overflow-auto
      flex-wrap: wrap
      width: 63%
      +pad-width
        width: 100%
        @apply grid grid-cols-4
      .q-btn
        @apply mr-5 text-center cursor-pointer mt-2 text-xs
        width: 4.375rem
        background: #250101
        border-radius: 20px
        color: #fff
        &.active
          background: linear-gradient(180deg, #F5E986 0%, #C4A242 100%)
          color: #000
  .payment-info-container
    @apply w-full flex justify-between gap-5 p-0
    +pad-width
      @apply flex-col
    .payment-type-container
      @apply flex flex-col gap-3 mr-3
      width: 12.5rem
      +pad-width
        @apply w-full grid grid-cols-2
      li
        @apply list-none text-white text-sm cursor-pointer text-center font-bold
        background: rgba(37, 1, 1, 1)
        border-radius: 3.125rem
        padding: .625rem 0 .625rem .9375rem
        +pad-width
          @apply text-xs p-1 text-center
        &.active, &:hover
          background: linear-gradient(180deg, #F5E386 0%, #9C7C24 100%)
          color: #000
    .form-container
      width: 72%
      +pad-width
        width:100%
      .form-row
        @apply flex items-center w-full text-white mb-5
        line-height: 2.1875rem
        +pad-width
          @apply flex-col
        .form-title
          font-size: .875rem
          width: 40%
          padding-bottom: 1.25rem
          +pad-width
            width: 100%
            padding-bottom: .9375rem
        .form-input
          @apply w-full
          :deep(.q-field__control)
            height: 2.375rem
            min-height: auto
            .q-field__native
              min-height: auto
            .q-field__append
              height: 2.375rem
      .form-row-submit
        @apply flex justify-end gap-3
        .btn-submit
          color: #000!important
        +pad-width
          @apply justify-start
          .btn-cancel
            width: 9.375rem
          .btn-submit
            width: 100%
</style>
