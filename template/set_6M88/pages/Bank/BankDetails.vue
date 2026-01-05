<template>
  <HeaderTitleBack titleI18n="menu.bank" v-bind="HTBConfig">
    <div class="details-wrapper px-[.625rem] pt-7 pb-[5.625rem]">
      <section class="flex flex-col gap-3">
        <BankCard
          v-for="item in bankCardState.list"
          :key="item.id"
          :card="item"
          :activeId="withdrawState.form.bank_id"
          :bankList="bankList"
          :gatewayFilterList="gatewayFilterList"
          @click="handleWithdralBankCardClick(item.id, item.crypto_rate)"
        >
          <div class="edit-bank">
            <i class="fas fa-trash delete" @click="openConfirm(item.id, item.crypto_rate)"></i>
            <i
              data-bs-toggle="modal"
              data-bs-target="#addbank-modal"
              class="fas fa-edit text-green"
              @click="openAddCardDialog('Edit', item.id)"
            >
            </i>
          </div>
        </BankCard>
        <AddBankCard @click="openAddCardDialog('Add')" />
      </section>
    </div>
  </HeaderTitleBack>
  <!-- Add or Edit Bank Card Modal -->
  <q-dialog v-model="modalShow">
    <q-card class="payment-card p-[1.25rem]">
      <q-form @submit="submitForm()" class="currency-wrapper">
        <q-card-section class="currency-list">
          <div class="currency-title text-[#005f79] py-[.625rem] font-bold">{{ $t("member.bank.selectCurrency") }}</div>
          <div class="flex gap-1">
            <span
              v-for="currency in availCurrencyList"
              :key="currency.id"
              class="currency-btn"
              :class="{ active: `${currency.code}` === bankCardState.form.currency }"
              @click="handleBankCardCurrencyClick(currency.code)"
              >{{ $t(currency.code) }}</span
            >
          </div>
        </q-card-section>
        <div class="py-[1.25rem]">
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
        </div>
        <div class="field-input" v-if="showGateway(bankCardState.form.payment_type_id)">
          <span class="form-title">{{ $t("modal.gateway") }}</span>
          <q-select
            v-model="bankCardState.form.payment_gateway_id"
            :options="paymentGatewayList"
            dense
            emit-value
            map-options
            bg-color="white"
            color="black"
            outlined
            lazy-rules
            :rules="[Rules.requiredInt]"
          >
          </q-select>
        </div>
        <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet">
          <!-- bank name -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.bankName") }}</span>
            <q-select
              v-model="bankCardState.form.bank_id"
              :options="bankList"
              :disable="!bankCardState.form.payment_gateway_id"
              dense
              emit-value
              map-options
              bg-color="white"
              color="black"
              outlined
              lazy-rules
              :rules="[Rules.requiredInt]"
            >
            </q-select>
          </div>
          <!-- Name -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.name") }}</span>
            <q-input
              v-model="bankCardState.form.name"
              outlined
              dense
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[Rules.required()]"
              :label="$t('member.bank.name')"
            >
            </q-input>
          </div>
          <!-- Account Name -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.accountName") }}</span>
            <q-input
              v-model="bankCardState.form.account_name"
              outlined
              dense
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[Rules.required()]"
              :label="$t('member.bank.accountName')"
            >
            </q-input>
          </div>
          <!-- Account Number -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.accountNumber") }}</span>
            <q-input
              v-model="bankCardState.form.account_number"
              outlined
              dense
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[Rules.required()]"
              :label="$t('member.bank.accountNumber')"
              @update:model-value="validateAlphanumeric"
            >
            </q-input>
          </div>
        </template>
        <!-- Bank Transfer -->
        <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.BankTransfer">
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.withdrawalBank") }}</span>
            <q-input
              v-model="bankCardState.form.bank_name"
              outlined
              dense
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[Rules.required()]"
              :label="$t('member.bank.withdrawalBank')"
            >
            </q-input>
          </div>
          <!-- Name -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.name") }}</span>
            <q-input
              v-model="bankCardState.form.name"
              outlined
              dense
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[Rules.required()]"
              :label="$t('member.bank.name')"
            >
            </q-input>
          </div>
          <!-- Account Name -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.accountName") }}</span>
            <q-input
              v-model="bankCardState.form.account_name"
              outlined
              dense
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[Rules.required()]"
              :label="$t('member.bank.accountName')"
            >
            </q-input>
          </div>
          <!-- Account Number -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.accountNumber") }}</span>
            <q-input
              v-model="bankCardState.form.account_number"
              outlined
              dense
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[Rules.required()]"
              :label="$t('member.bank.accountNumber')"
              @update:model-value="validateAlphanumeric"
            >
            </q-input>
          </div>
        </template>
        <!-- 虛擬幣種 -->
        <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoWallet">
          <!-- Name -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.name") }}</span>
            <q-input
              v-model="bankCardState.form.name"
              outlined
              dense
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[Rules.required()]"
              :label="$t('member.bank.name')"
            >
            </q-input>
          </div>
          <!-- Wallet Address -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.walletAddress") }}</span>
            <q-input
              v-model="bankCardState.form.wallet_address"
              outlined
              dense
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[Rules.required()]"
              :label="$t('member.bank.walletAddress')"
            >
            </q-input>
          </div>
          <!-- Currency Brand -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.currencyBrand") }}</span>
            <q-select
              v-model="bankCardState.form.crypto_id"
              :options="cryptoList"
              dense
              emit-value
              map-options
              bg-color="white"
              color="black"
              outlined
              lazy-rules
              :rules="[Rules.requiredInt]"
            >
            </q-select>
          </div>
          <!-- Chain -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.chain") }}</span>
            <q-select
              v-model="bankCardState.form.bank_id"
              :options="bankList"
              dense
              emit-value
              map-options
              bg-color="white"
              color="black"
              outlined
              lazy-rules
              :rules="[Rules.requiredInt]"
            >
            </q-select>
          </div>
        </template>
        <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoPayment">
          <!-- Name -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.name") }}</span>
            <q-input
              v-model="bankCardState.form.name"
              outlined
              dense
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[Rules.required()]"
              :label="$t('member.bank.name')"
            >
            </q-input>
          </div>
          <!-- Wallet Address -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.walletAddress") }}</span>
            <q-input
              v-model="bankCardState.form.wallet_address"
              outlined
              dense
              bg-color="white"
              color="black"
              lazy-rules
              :rules="[Rules.required()]"
              :label="$t('member.bank.walletAddress')"
            >
            </q-input>
          </div>
          <!-- Currency Brand -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.currencyBrand") }}</span>
            <q-select
              v-model="bankCardState.form.crypto_id"
              :options="cryptoList"
              dense
              emit-value
              map-options
              bg-color="white"
              color="black"
              outlined
              lazy-rules
              :rules="[Rules.requiredInt]"
            >
            </q-select>
          </div>
          <!-- Chain -->
          <div class="field-input">
            <span class="form-title">{{ $t("member.bank.chain") }}</span>
            <q-select
              v-model="bankCardState.form.bank_id"
              :options="bankList"
              dense
              emit-value
              map-options
              bg-color="white"
              color="black"
              outlined
              lazy-rules
              :rules="[Rules.requiredInt]"
            >
            </q-select>
          </div>
        </template>
        <div class="details-btn-wrapper">
          <q-btn no-caps unelevated flat class="btn-cancel" push type="reset" v-close-popup>
            {{ $t("common.btn.cancel") }}
          </q-btn>
          <q-btn no-caps unelevated flat class="btn-submit" type="submit" :loading="isLoading">
            {{ $t("common.btn.submit") }}
          </q-btn>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
  <!-- Delete Bank Card Modal -->
  <q-dialog v-model="confirmModal" persistent>
    <q-card class="q-dark">
      <q-card-section>
        <div class="modal-title delete">{{ $t("member.bank.deleteMessage") }}</div>
      </q-card-section>
      <q-card-actions>
        <q-btn flat :label="$t('common.btn.cancel')" color="normal" v-close-popup />
        <q-btn flat :label="$t('common.btn.confirm')" color="normal" @click="deleteCardForm()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useHTBConfig } from "app/template/set_6M88/hooks/useHTBConfig"
import { useQuasar } from "quasar"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useBank } from "src/common/composables/useBank"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE } from "src/common/utils/constants"
import { onMounted, ref, watch } from "vue"
import AddBankCard from "./components/AddBankCard.vue"
import BankCard from "./components/BankCard.vue"

const { HTBConfig } = useHTBConfig()
const Rules = useRule()
const {
  showGateway,
  availCurrencyList,
  getAvailCurrencyList,
  bankCardState,
  validateNumeric,
  validateAlphanumeric,
  getBankCardInfo,
  getBankCardList,
  withdrawState,
  handleWithdralBankCardClick,
  getPaymentTypeList,
  paymentGatewayList,
  paymentTypeList,
  currencyList,
  cryptoList,
  getCryptoList,
  handleBankCardCurrencyClick,
  handleBankCardPaymentTypeClick,
  bankList,
  gatewayFilterList,
  getBankList,
  getGatewayList,
  handleBankCardEdit,
  handleBankCardAdd,
  handleBankCardDelete,
  resetBankCardForm
} = useBank()
const { isLoading } = useAuth()
const modalShow = ref(false)
const confirmModal = ref(false)
const modalType = ref("")
const $q = useQuasar()

const openAddCardDialog = async (type: string, id?: number) => {
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

const openConfirm = (id: number, crypto_rate: number) => {
  confirmModal.value = true
  handleWithdralBankCardClick(id, crypto_rate)
}

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

const addBankCard = async () => {
  const isSuccess = await handleBankCardAdd()
  if (isSuccess) {
    await getBankCardList()
    modalShow.value = false
    resetBankCardForm()
  }
}

const editBankCard = async () => {
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
  getCryptoList()
  getBankCardList()
  getGatewayList()
  getBankList()
  getAvailCurrencyList()
})

watch(
  () => bankCardState.form.payment_gateway_id,
  (newId) => {
    getBankList(newId)
  }
)
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
@import "../../assets/css/main.scss";

.edit-bank {
  @apply flex items-center gap-3 text-sm cursor-pointer;
}

.delete {
  color: #fa6a60;
}

.payment-card {
  width: 100%;
  max-width: 50.9375rem;
  border: 1px solid $primary;
  border-radius: 0.5rem;
}

.payment-type-container {
  @apply grid gap-[.625rem];
  grid-template-columns: repeat(2, 1fr);

  li {
    @apply flex items-center justify-center cursor-pointer p-[.625rem] text-white;
    @apply bg-[#f4faff] text-[#005f79];
    font-size: 1rem;
    border-radius: 3.125rem;
    border: 0;

    @include iphone-width {
      font-size: 0.6563rem;
    }

    &:hover,
    &.active {
      background: #f4faff;
      color: #000;
      border: 1px solid #2599f8;
    }
  }
}

.currency-wrapper {
  .currency-list {
    border-bottom-color: #0897be;
  }
  .currency-btn {
    @apply flex items-center justify-center cursor-pointer px-2 py-0.5;
    @apply bg-[#f4faff] text-[#005f79];
    font-size: 0.75rem;
    border-radius: 0.625rem;

    &:hover,
    &.active {
      @apply bg-transparent;
      color: #000;
      border: 1px solid #2599f8;
    }
  }

  .form-title {
    color: $secondary;
    font-weight: bold;
  }

  .field-input {
    @apply flex flex-col gap-[.625rem];
    ::v-deep(.q-field__control) {
      @apply flex items-center;
      height: 40px !important;
    }
  }
  .btn-cancel {
    background: transparent;
    border: 0.0625rem solid $secondary;
    border-radius: 1.25rem;
    height: 2.5rem;
    margin-top: 0.3125rem;
    color: $secondary;
  }
  .btn-submit {
    @apply shadow-none;
  }
}

.details-btn-wrapper {
  @apply flex justify-between items-center gap-3;

  .btn-cancel {
    @apply w-1/3;
  }

  .btn-submit {
    @apply w-2/3;
  }
}
</style>
