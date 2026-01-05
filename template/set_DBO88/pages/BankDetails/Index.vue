<template>
  <ModalBase
    v-model="modalShow"
    :templateType="'primary'"
    use-title
    :title="t('menu.bankDetails')"
    max-width="50rem"
    modal-class="primary-modal"
  >
    <div class="details-wrapper">
      <section class="card-layout">
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
            <i class="fas fa-trash delete-icon" @click="openConfirm(item.id, item.crypto_rate)"></i>
            <i
              data-bs-toggle="modal"
              data-bs-target="#addbank-modal"
              class="fas fa-edit text-edit"
              @click="openAddCardDialog('Edit', item.id)"
            >
            </i>
          </div>
        </BankCard>
        <AddBankCard @click="openAddCardDialog('Add')" />
      </section>
    </div>
    <!-- Add or Edit Bank Card Modal -->
    <ModalBase
      v-model="cardModal"
      :templateType="'primary'"
      use-title
      :title="modalType === 'Add' ? t('menu.bank_add') : t('menu.bank_edit')"
      max-width="50rem"
      modal-class="primary-modal"
    >
      <q-card class="payment-card">
        <q-form @submit="submitForm()" class="currency-wrapper">
          <q-card-section class="currency-list">
            <div class="currency-title">{{ $t("member.bank.selectCurrency") }}</div>
            <div class="currency-btn-wrapper">
              <span
                v-for="currency in availCurrencyList"
                :key="currency.id"
                class="currency-btn"
                :class="{ active: `${currency.code}` === bankCardState.form.currency }"
                @click="changeCurrency(currency.code)"
                >{{ $t(currency.code) }}</span
              >
            </div>
          </q-card-section>
          <q-card-section class="currency-list">
            <ul class="payment-type-container">
              <li
                v-for="item in paymentTypeList"
                :key="item.value"
                :class="{ active: String(item.value) === `${bankCardState.form.payment_type_id}` }"
                @click="changePaymentType(item.value)"
              >
                {{ $t(item.label) }}
              </li>
            </ul>
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet">
              <div class="field-input">
                <span class="form-title">{{ $t("modal.gateway") }}</span>
                <q-select
                  v-model="bankCardState.form.payment_gateway_id"
                  :options="paymentGatewayList"
                  dense
                  emit-value
                  map-options
                  bg-color="white"
                  color="black"
                  behavior="menu"
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-credit-card" class="field-icon" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label class="text-white">{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="field-input">
                <span class="form-title">{{ $t("member.bank.withdrawalBank") }}</span>
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  :disable="!bankCardState.form.payment_gateway_id"
                  dense
                  emit-value
                  map-options
                  bg-color="white"
                  color="black"
                  behavior="menu"
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-bank" class="field-icon" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label class="text-white">{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
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
                  <template v-slot:prepend>
                    <q-icon name="fas fa-coins" class="field-icon" />
                  </template>
                </q-input>
              </div>
            </template>
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
                <template v-slot:prepend>
                  <q-icon name="fas fa-user" class="field-icon" />
                </template>
              </q-input>
            </div>
            <!-- 虛擬幣種 - 銀行轉帳 -->
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoWallet">
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
                  <template v-slot:prepend>
                    <q-icon name="fas fa-wallet" class="field-icon" />
                  </template>
                </q-input>
              </div>
              <!-- currencyBrand -->
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
                  behavior="menu"
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-credit-card" class="field-icon" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label class="text-white">{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <!-- chain -->
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
                  behavior="menu"
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-credit-card" class="field-icon" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label class="text-white">{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </template>
            <!-- 虛擬幣種 - 三方支付 -->
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoPayment">
              <div class="field-input">
                <span class="form-title">{{ $t("modal.gateway") }}</span>
                <q-select
                  v-model="bankCardState.form.payment_gateway_id"
                  :options="paymentGatewayList"
                  dense
                  emit-value
                  map-options
                  bg-color="white"
                  color="black"
                  behavior="menu"
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-credit-card" class="field-icon" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label class="text-white">{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <!-- chain -->
              <div class="field-input">
                <span class="form-title">{{ $t("member.bank.chain") }}</span>
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  :disable="!bankCardState.form.payment_gateway_id"
                  dense
                  emit-value
                  map-options
                  bg-color="white"
                  color="black"
                  behavior="menu"
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-credit-card" class="field-icon" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label class="text-white">{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <!-- currencyBrand -->
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
                  behavior="menu"
                  outlined
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-credit-card" class="field-icon" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label class="text-white">{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
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
                  <template v-slot:prepend>
                    <q-icon name="fas fa-wallet" class="field-icon" />
                  </template>
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
                  <template v-slot:prepend>
                    <q-icon name="fas fa-id-card" class="field-icon" />
                  </template>
                </q-input>
              </div>
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
                  <template v-slot:prepend>
                    <q-icon name="fas fa-sort-numeric-down" class="field-icon" />
                  </template>
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
import { FUND_METHOD_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import ModalBase from "app/template/set_DBO88/components/Modal/ModalBase.vue"
import AddBankCard from "./AddBankCard.vue"
import BankCard from "./BankCard.vue"

const Rules = useRule()
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
  if (modalType.value === "Edit") return
  bankCardState.form.currency = currency
  handleBankCardCurrencyClick(currency)
}

const changePaymentType = (type: string) => {
  if (modalType.value === "Edit") return
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
  eventbus.on("openAddBankCard", (show: boolean) => {
    modalShow.value = show
    fetchBankCardList()
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
@import "app/template/set_DBO88/assets/css/_variable.scss";
@import "app/template/set_DBO88/assets/css/button.scss";

.details-wrapper {
  @apply px-[.625rem] py-5;

  .card-layout {
    @apply grid gap-[.625rem];
    grid-template-columns: repeat(2, 1fr);

    @include pad-large-width {
      @apply flex flex-col gap-[.625rem];
    }
  }
}

.edit-bank {
  @apply flex items-center gap-[1.25rem] text-base cursor-pointer;

  .delete-icon {
    color: #ed0000;
  }
}

.payment-card {
  @apply w-full p-0 rounded-none;
  background: transparent !important;
  box-shadow: none !important;
}

.payment-type-container {
  @apply grid gap-[.9375rem] mb-2;
  grid-template-columns: repeat(3, 1fr);

  li {
    @apply flex items-center justify-center cursor-pointer p-[.625rem] text-white;
    @apply text-sm rounded-[3.125rem];
    background: $dark-slate-bg;

    &:hover,
    &.active {
      background: $primary-color;
      color: $text-white;
    }
  }
}

.currency-wrapper {
  .currency-list {
    @apply p-4 rounded-lg;
  }

  .currency-title {
    @apply text-base font-bold py-2;
  }

  .form-title {
    color: $text-white;
    font-weight: bold;
  }

  .field-input {
    @apply flex flex-col gap-[.625rem];
    ::v-deep(.q-field__control) {
      @apply flex items-center;
      height: 2.5rem !important;
    }
  }

  .field-icon {
    @apply text-base ml-1;
    color: $primary-color;
  }
}

.details-btn-wrapper {
  @apply flex justify-between items-center gap-3 text-white px-4;

  .btn-cancel,
  .btn-submit {
    @apply w-1/2 font-extrabold py-3 rounded-[.625rem];
    background: $primary-color;
  }
}

.delete-card {
  @apply min-w-[15rem];

  .delete-card-header {
    @apply flex items-center justify-center text-white capitalize;
    background: $primary-color;
    color: $danger-color;

    .modal-title {
      @apply text-xl font-bold;
    }
  }

  .delete-card-actions {
    @apply flex items-center justify-center gap-3 text-white;
  }

  .btn-delete-cancel,
  .btn-delete-confirm {
    @apply capitalize;
    background: $pink-shadow-color !important;

    &:hover {
      color: $primary-color;
    }
  }
}

:deep(.q-field--outlined .q-field__control) {
  background: #191b1e !important;
  color: $text-white !important;
  border-bottom: 1px solid #dee3f026 !important;
}

:deep(.q-field--outlined .q-field__label) {
  color: $text-white !important;
}

:deep(.q-field--labeled .q-field__native) {
  color: $text-white !important;
}

:deep(.q-field--auto-height.q-field--dense .q-field__native) {
  color: $text-white !important;
}
</style>
