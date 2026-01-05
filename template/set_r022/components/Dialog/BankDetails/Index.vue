<template>
  <ModalBase
    v-model="modalShow"
    :templateType="'primary'"
    use-title
    :title="t('common.btn.wallet')"
    max-width="50rem"
    modal-class="primary-modal"
  >
    <div class="details-wrapper">
      <section class="card-container">
        <BankCard
          v-for="item in bankCardState.list"
          :key="item.id"
          :card="item"
          :activeId="withdrawState.form.bank_id"
          :bankList="bankList"
          :gatewayFilterList="gatewayFilterList"
          @edit="openAddCardDialog('Edit', item.id)"
          @updateList="fetchBankCardList"
          @click="handleWithdralBankCardClick(item.id, item.crypto_rate)"
        >
          <div class="edit-bank">
            <i class="fas fa-trash" @click="openConfirm(item.id, item.crypto_rate)"></i>
            <i
              data-bs-toggle="modal"
              data-bs-target="#addbank-modal"
              class="fas fa-edit text-edit"
              @click="openAddCardDialog('Edit', item.id)"
            >
            </i>
          </div>
        </BankCard>
        <AddBankCard
          v-if="envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN"
          @click="openAddCardDialog('Add')"
        />
      </section>
    </div>
    <!-- Add or Edit Bank Card Modal -->
    <ModalBase
      v-model="cardModal"
      :templateType="'primary'"
      use-title
      :title="t('common.btn.wallet')"
      max-width="50rem"
      modal-class="primary-modal"
    >
      <q-card class="payment-card">
        <q-form @submit="submitForm()" class="currency-wrapper">
          <q-card-section class="pay-area">
            <div class="pay-area-title">{{ $t("member.bank.selectCurrency") }}</div>
            <div class="pay-btn-wrapper">
              <span
                v-for="currency in availCurrencyList"
                :key="currency.id"
                class="pay-btn"
                :class="{ active: `${currency.code}` === bankCardState.form.currency }"
                @click="changeCurrency(currency.code)"
              >
                <q-icon name="fas fa-coins" class="field-icon" />
                {{ $t(currency.code) }}
              </span>
            </div>
          </q-card-section>
          <q-card-section class="pay-area">
            <div class="pay-area-title">{{ $t("member.deposit.type") }}</div>
            <ul class="pay-btn-wrapper">
              <li
                v-for="item in paymentTypeList"
                :key="item.value"
                class="pay-btn"
                :class="{ active: String(item.value) === `${bankCardState.form.payment_type_id}` }"
                @click="changePaymentType(item.value)"
              >
                {{ $t(item.label) }}
              </li>
            </ul>
          </q-card-section>
          <q-card-section class="pay-area">
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet">
              <div class="field-input">
                <div class="pay-area-title">{{ $t("modal.gateway") }}</div>
                <q-select
                  v-model="bankCardState.form.payment_gateway_id"
                  :options="paymentGatewayList"
                  dense
                  emit-value
                  map-options
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                </q-select>
              </div>
              <div class="field-input">
                <div class="pay-area-title">{{ $t("member.bank.withdrawalBank") }}</div>
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  :disable="!bankCardState.form.payment_gateway_id"
                  dense
                  emit-value
                  map-options
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                </q-select>
              </div>
            </template>
            <!-- Bank Transfer -->
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.BankTransfer">
              <div class="field-input">
                <div class="pay-area-title">{{ $t("member.bank.withdrawalBank") }}</div>
                <q-input
                  v-model="bankCardState.form.bank_name"
                  outlined
                  dense
                  lazy-rules
                  :rules="[Rules.required()]"
                  :label="$t('member.bank.withdrawalBank')"
                >
                </q-input>
              </div>
            </template>
            <!-- Name -->
            <div class="field-input">
              <div class="pay-area-title">{{ $t("member.bank.name") }}</div>
              <q-input
                v-model="bankCardState.form.name"
                outlined
                dense
                lazy-rules
                :rules="[Rules.required()]"
                :label="$t('member.bank.name')"
              >
              </q-input>
            </div>
            <!-- 虛擬幣種 - 銀行轉帳 -->
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoWallet">
              <!-- Wallet Address -->
              <div class="field-input">
                <div class="pay-area-title">{{ $t("member.bank.walletAddress") }}</div>
                <q-input
                  v-model="bankCardState.form.wallet_address"
                  outlined
                  dense
                  lazy-rules
                  :rules="[Rules.required()]"
                  :label="$t('member.bank.walletAddress')"
                >
                </q-input>
              </div>
              <!-- currencyBrand -->
              <div class="field-input">
                <div class="pay-area-title">{{ $t("member.bank.currencyBrand") }}</div>
                <q-select
                  v-model="bankCardState.form.crypto_id"
                  :options="cryptoList"
                  dense
                  emit-value
                  map-options
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                </q-select>
              </div>
              <!-- chain -->
              <div class="field-input">
                <div class="pay-area-title">{{ $t("member.bank.chain") }}</div>
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  dense
                  emit-value
                  map-options
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                </q-select>
              </div>
            </template>
            <!-- 虛擬幣種 - 三方支付 -->
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoPayment">
              <div class="field-input">
                <div class="pay-area-title">{{ $t("modal.gateway") }}</div>
                <q-select
                  v-model="bankCardState.form.payment_gateway_id"
                  :options="paymentGatewayList"
                  dense
                  emit-value
                  map-options
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                </q-select>
              </div>
              <!-- chain -->
              <div class="field-input">
                <div class="pay-area-title">{{ $t("member.bank.chain") }}</div>
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  :disable="!bankCardState.form.payment_gateway_id"
                  dense
                  emit-value
                  map-options
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                </q-select>
              </div>
              <!-- currencyBrand -->
              <div class="field-input">
                <div class="pay-area-title">{{ $t("member.bank.currencyBrand") }}</div>
                <q-select
                  v-model="bankCardState.form.crypto_id"
                  :options="cryptoList"
                  dense
                  emit-value
                  map-options
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                </q-select>
              </div>
              <!-- Wallet Address -->
              <div class="field-input">
                <div class="pay-area-title">{{ $t("member.bank.walletAddress") }}</div>
                <q-input
                  v-model="bankCardState.form.wallet_address"
                  outlined
                  dense
                  lazy-rules
                  :rules="[Rules.required()]"
                  :label="$t('member.bank.walletAddress')"
                >
                </q-input>
              </div>
            </template>
            <template
              v-if="
                bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.BankTransfer ||
                bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet
              "
            >
              <div class="field-input">
                <div class="pay-area-title">{{ $t("member.bank.accountName") }}</div>
                <q-input
                  v-model="bankCardState.form.account_name"
                  outlined
                  dense
                  lazy-rules
                  :rules="[Rules.required()]"
                  :label="$t('member.bank.accountName')"
                >
                </q-input>
              </div>
              <div class="field-input">
                <div class="pay-area-title">{{ $t("member.bank.accountNumber") }}</div>
                <q-input
                  v-model="bankCardState.form.account_number"
                  outlined
                  dense
                  lazy-rules
                  :rules="[Rules.required()]"
                  :label="$t('member.bank.accountNumber')"
                  @update:model-value="validateAlphanumeric"
                >
                </q-input>
              </div>
            </template>
          </q-card-section>
          <div class="details-btn-wrapper">
            <q-btn class="btn-cancel" type="reset" v-close-popup>
              {{ $t("common.btn.cancel") }}
            </q-btn>
            <q-btn class="btn-submit" type="submit" :loading="isLoading">
              {{ $t("common.btn.submit") }}
            </q-btn>
          </div>
        </q-form>
      </q-card>
    </ModalBase>
    <!-- Delete Bank Card Modal -->
    <q-dialog v-model="confirmModal" persistent>
      <q-card class="delete-card">
        <q-card-section class="delete-card-header">
          <div class="modal-title">{{ $t("member.bank.deleteMessage") }}</div>
        </q-card-section>
        <q-card-actions class="delete-card-actions">
          <q-btn flat :label="$t('common.btn.cancel')" class="btn-delete-cancel" v-close-popup />
          <q-btn flat :label="$t('common.btn.confirm')" class="btn-delete-confirm" @click="deleteCardForm()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </ModalBase>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar"
import { useBank } from "src/common/composables/useBank"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE, MEMBER_BANK_EDIT } from "src/common/utils/constants"
import { useEnvInfoStore } from "src/stores/envStore"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import ModalBase from "../ModalBase.vue"
import AddBankCard from "./AddBankCard.vue"
import BankCard from "./BankCard.vue"

const Rules = useRule()
const { envInfo } = useEnvInfoStore()
const {
  cryptoList,
  getCryptoList,
  availCurrencyList,
  getAvailCurrencyList,
  bankCardState,
  validateAlphanumeric,
  getBankCardInfo,
  getBankCardList,
  withdrawState,
  handleWithdralBankCardClick,
  getPaymentTypeList,
  paymentGatewayList,
  paymentTypeList,
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
const { isLoading, isLogin } = useAuth()
const modalShow = ref(false)
const cardModal = ref(false)
const confirmModal = ref(false)
const modalType = ref("")
const $q = useQuasar()
const eventbus = injectStrict(EventBusKey)
const { t } = useI18n()

const openAddCardDialog = async (type: string, id?: number) => {
  cardModal.value = true
  modalType.value = type
  resetBankCardForm()
  if (modalType.value === "Edit") {
    await getBankCardInfo({ id: id as number })
    await getCryptoList()
    await getBankList()
    await getPaymentTypeList(bankCardState.form.currency)
    return
  } else {
    await getCryptoList()
    await getPaymentTypeList(bankCardState.form.currency)
    console.log(paymentTypeList.value)
    if (paymentTypeList.value.length) changePaymentType(paymentTypeList.value[0].value)
  }
}

const openConfirm = (id: number, rate: number) => {
  confirmModal.value = true
  handleWithdralBankCardClick(id, rate)
}

const deleteCardForm = async () => {
  $q.loading.show()
  confirmModal.value = false

  const isSuccess = await handleBankCardDelete(withdrawState.form.bank_id)
  if (isSuccess) {
    await getBankCardList()
    cardModal.value = false
    resetBankCardForm()
  }
}

const addBankCard = async () => {
  const isSuccess = await handleBankCardAdd()
  if (isSuccess) {
    await getBankCardList()
    cardModal.value = false
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

const changeCurrency = (currency: string) => {
  // if (modalType.value === "Edit") return
  bankCardState.form.currency = currency
  handleBankCardCurrencyClick(currency)
}

const changePaymentType = (type: string) => {
  // if (modalType.value === "Edit") return
  bankCardState.form.payment_type_id = Number(type)
  handleBankCardPaymentTypeClick(type)
}

const submitForm = () => {
  modalType.value === "Edit" ? editBankCard() : addBankCard()
}

const fetchBankCardList = () => {
  if (isLogin.value) {
    $q.loading.show()
    getBankCardList()
    getGatewayList()
    getBankList()
    getAvailCurrencyList()
    $q.loading.hide()
  }
}

onMounted(() => {
  eventbus.on("openAddBankCard", async (show: boolean, id: number) => {
    modalShow.value = show
    await fetchBankCardList()
    if (id) openAddCardDialog("Edit", id)
  })
})

watch(
  () => bankCardState.form.payment_gateway_id,
  (newId) => {
    $q.loading.show()
    getBankList(newId)
    $q.loading.hide()
  }
)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.details-wrapper {
  @apply px-[.625rem] py-5;
  width: 100%;
  height: 38rem;
  overflow-y: auto;

  @include pad-large-width {
    width: 100%;
    height: calc(100vh - 6rem);
  }

  .card-container {
    color: var(--neutral-09);
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem; // 等於 Tailwind 的 gap-5

    @include pc-width {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.25rem;
    }

    @include pad-large-width {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      gap: 1.5rem; // 等於 Tailwind 的 gap-6
      width: 100%;
      margin: 0 auto;
      padding: 0;

      @include hideScrollBar;
    }
  }
}

.edit-bank {
  @apply flex items-center gap-[1.25rem] text-base cursor-pointer;
}

.text-edit {
  color: var(--text-01);
}

.payment-card {
  @apply w-full p-0 rounded-none;
  height: 38rem;
  overflow-y: auto;
  background: transparent !important;
  box-shadow: none !important;

  @include pad-large-width {
    height: 90vh;
  }
}

.payment-type-container {
  @apply grid gap-[.9375rem] mb-2;
  grid-template-columns: repeat(3, 1fr);

  li {
    @apply flex items-center justify-center cursor-pointer p-[.625rem] text-white;
    @apply text-sm;
    border-radius: 9.51px;
    border: 0.951px solid var(--neutral-07);
    background: var(--neutral-01);

    &:hover,
    &.active {
      border: 0.951px solid var(--primary-01);
      background: var(--primary-04);
    }
  }
}

.pay-area {
  @apply p-4 rounded-[.625rem];
  margin-bottom: 0.9375rem;
  background: var(--neutral-01);

  @include pad-large-width {
    margin-bottom: 0rem;
    border-radius: 0;
  }

  .field-input {
    :deep(.q-field__control) {
      &::before {
        border-color: var(--neutral-03);
      }
    }
  }

  .pay-area-title {
    color: var(--secondary-01);
    font-family: "Segoe UI";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px; /* 157.143% */
    margin-bottom: 0.75rem;
  }

  .pay-btn-wrapper {
    @apply grid justify-between gap-[.9375rem];
    grid-template-columns: repeat(3, 1fr);

    @include pad-large-width {
      @apply grid-cols-2;
    }
  }

  .pay-btn {
    @apply flex items-center justify-center text-[.875rem] font-semibold;
    @apply cursor-pointer rounded-[.625rem] p-[.625rem];
    border-radius: 9.51px;
    border: 0.951px solid var(--neutral-07);
    background: var(--neutral-01);

    &.limit-height {
      width: auto;
      height: 90px;
    }

    &:hover {
      border: 0.951px solid var(--primary-01);
    }

    &.active {
      border: 0.951px solid var(--primary-01);
      background: var(--primary-04);
    }
    .field-icon {
      color: var(--secondary-01);
      text-align: center;
      font-family: "Font Awesome 5 Free";
      font-size: 1.6rem;
      padding: 0 1rem;
      font-style: normal;
      font-weight: 900;
      line-height: 26.095px; /* 100.146% */
    }

    @include pad-large-width {
      @apply text-sm;
    }
  }
}

.details-btn-wrapper {
  @apply flex justify-between items-center gap-3 text-white;
  padding: 0 1rem;

  @include pad-large-width {
    margin-top: 0.5rem;
  }

  .btn-cancel {
    @apply w-full mb-0;
    height: 44px;
    border-radius: 8px;
    border: 2px solid var(--primary-01);
    background: var(--primary-04);
    color: var(--primary-01);
    display: flex;
    justify-content: center;
    @include pad-large-width {
      margin: 0 auto;
      width: 80vw;
    }
  }
  .btn-submit {
    @apply w-full mb-0;
    height: 44px;
    border-radius: 8px;
    background: var(--primary-01);
    color: var(--text-01);
    display: flex;
    justify-content: center;
    @include pad-large-width {
      margin: 0 auto;
      width: 80vw;
    }
  }
}

.delete-card {
  @apply min-w-[15rem];

  .delete-card-header {
    @apply flex items-center justify-center text-white capitalize;
    border-bottom: 0.727px solid var(--primary-07);
    background: var(--bg-headerbottom);

    .modal-title {
      @apply text-xl font-bold;
    }
  }

  .delete-card-actions {
    @apply flex items-center justify-center gap-3 text-white;
  }

  .btn-delete-confirm {
    @apply capitalize;
    border-radius: 8px;
    background: var(--primary-01);
  }

  .btn-delete-cancel {
    border-radius: 8px;
    border: 2px solid var(--primary-01);
    background: var(--primary-04);
  }
}
</style>
