<template>
  <section class="deposit-wrapper">
    <!-- 幣別選擇 -->
    <div class="pay-area">
      <div class="pay-area-title">{{ $t("member.bank.selectCurrency") }}</div>
      <div v-if="depositState.supportedCurrency.length > 0" class="pay-btn-wrapper">
        <span
          v-for="(deposit, key) in depositState.supportedCurrency"
          :key="key"
          :class="{ active: `${deposit}` === depositState.form.currency }"
          @click="handleDepositCurrencyClick(deposit)"
          class="pay-btn"
        >
          {{ $t(deposit) }}
        </span>
      </div>
      <div v-else class="no-data">
        <p class="text-center">
          {{ $t("tableHeader.no_data") }}
        </p>
      </div>
    </div>
    <!-- 支付方式選擇 -->
    <div class="pay-area">
      <ul v-if="depositState.fundTypeList.length > 0" class="pay-btn-wrapper">
        <li
          v-for="fundType in depositState.fundTypeList"
          :key="fundType"
          class="pay-btn"
          :class="{ active: fundType === `${depositState.usingFundType}` }"
          @click="handleDepositFundTypeClick(fundType)"
        >
          {{ $t(`member.bank.${fundType}`) }}
        </li>
      </ul>
      <div v-else class="no-data">
        <p class="text-center">
          {{ $t("tableHeader.no_data") }}
        </p>
      </div>
    </div>
    <q-form class="payment-form" @submit="handleSubmit">
      <!-- 支付方式 -->
      <div class="form-row pay-area">
        <label class="form-title py-[10px]">{{ $t("member.deposit.selectMethod") }}:</label>
        <div v-if="depositState.usingPaymentInfoList.length > 0" class="form-methods">
          <div
            v-for="(item, key) in depositState.usingPaymentInfoList"
            :key="key"
            class="method-item"
            :class="{ active: String(item.id) === `${depositState.form.payment_gateway_id}` }"
            @click="handleDepositPaymentClick(item.id)"
          >
            <img :src="item.imgUrl" alt="" class="w-full h-full" />
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div v-else class="no-data">
          <p class="text-center">
            {{ $t("tableHeader.no_data") }}
          </p>
        </div>
      </div>
      <!-- 銀行帳號 / 存款資料 -->
      <div class="form-row pay-area" v-if="depositState.usingFundType === 'BankTransfer'">
        <label class="form-title py-[10px]">{{ $t("member.deposit.bankAccount") }}:</label>
        <ul class="bank-account">
          <li>
            <span class="mr-2">{{ depositState.paymentDetail.bank_name }}</span>
            <q-icon name="save" @click="copyMessage(depositState.paymentDetail.bank_name)" />
          </li>
          <li class="mb-2">
            <span class="mr-2">{{ depositState.paymentDetail.bank_account }}</span>
            <q-icon name="save" @click="copyMessage(depositState.paymentDetail.bank_account)" />
          </li>
        </ul>
        <img
          v-if="depositState.paymentDetail.qrcode_image_id !== 0"
          :src="depositState.paymentDetail.imgUrl"
          alt=""
          class="w-20 h-20"
        />
      </div>
      <div class="form-row pay-area" v-if="depositState.usingFundType === 'CryptoWallet'">
        <label class="form-title py-[10px]">{{ $t("member.deposit.depositInfo") }}:</label>
        <ul class="bank-account">
          <li class="mb-2">
            <span class="title">{{ `${$t("member.deposit.currencyBrand")}: ` }}</span>
            <span class="mr-2">{{ depositState.paymentDetail.currency_brand }}</span>
          </li>
          <li class="mb-2">
            <span class="title">{{ `${$t("member.deposit.chain")}: ` }}</span>
            <span class="mr-2">{{ depositState.paymentDetail.chain }}</span>
          </li>
          <li class="mb-2">
            <span class="title">{{ `${$t("member.deposit.walletAddress")}: ` }}</span>
            <span>{{
              depositState.paymentDetail.wallet_address.length > 15
                ? depositState.paymentDetail.wallet_address.substring(0, 15) + "..."
                : depositState.paymentDetail.wallet_address
            }}</span>
            <q-icon name="save" @click="copyMessage(depositState.paymentDetail.wallet_address)" />
          </li>
        </ul>
        <img
          v-if="depositState.paymentDetail.qrcode_image_id !== 0"
          :src="depositState.paymentDetail.imgUrl"
          alt=""
          class="w-20 h-20"
        />
      </div>
      <div class="form-row pay-area" v-if="depositState.usingFundType === 'CryptoPayment'">
        <label class="form-title py-[10px]">{{ $t("member.deposit.depositInfo") }}:</label>
        <ul class="bank-account">
          <li class="mb-2">
            <span class="title">{{ `${$t("member.deposit.currencyBrand")}: ` }}</span>
            <span class="mr-2">{{ depositState.paymentDetail.currency_brand }}</span>
          </li>
        </ul>
      </div>
      <!-- 手續費 -->
      <div
        v-if="hasFee(depositState.paymentDetail) && depositState.usingFundType === 'BankTransfer'"
        class="form-row pay-area"
      >
        <p class="form-title py-[10px]">
          {{ $t("member.deposit.handlingFee") }}
          :
          <span>
            {{ handlingFee }}
          </span>
        </p>
      </div>
      <!-- 存款金額 -->
      <div class="form-row field-input flex flex-col pay-area">
        <span class="form-title py-[10px]">{{ $t("member.deposit.depositAmount") }}</span>
        <q-input
          :model-value="inputAmount"
          @update:model-value="handleInputChange"
          bg-color="white"
          color="black"
          :label="$t('member.deposit.depositAmount')"
          outlined
          lazy-rules
          @keypress="Rules.validatePositiveNumber"
          inputmode="decimal"
          :rules="[
            Rules.requiredInt,
            (val: string) =>
              Rules.depositAmount({
                min: depositState.paymentDetail.deposit_min,
                max: depositState.paymentDetail.deposit_max,
                val: val.replace(/,/g, '')
              })
          ]"
        >
          <template #prepend>
            <q-icon name="fas fa-coins" class="field-icon" />
          </template>
        </q-input>
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
        <div class="form-title">
          {{ $t("member.deposit.mixMaxLimit") }}: {{ moneyFormat(depositState.paymentDetail.deposit_min) }} /
          {{ moneyFormat(depositState.paymentDetail.deposit_max) }}
        </div>
        <div class="quick-btn-wrapper">
          <span
            v-for="item in depositState.quickBtns"
            :key="item"
            class="quick-btn"
            @click="handleDepositQuickBtnClick(item)"
            :class="{ active: item === depositState.form.amount }"
          >
            {{ moneyFormat(item) }}
          </span>
        </div>
      </div>

      <!-- 額外欄位 -->
      <div class="form-row field-input flex flex-col pay-area" v-if="depositState.paymentDetail.extra_field_key">
        <span class="form-title py-[10px]">{{ $t("bank_column.client_Info") }}</span>
        <div
          class="col-12"
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
            popup-content-style="background-color: #292929; color: rgb(255, 255, 255);"
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
      <!-- 備註欄位 -->
      <div
        class="form-row field-input flex flex-col pay-area"
        v-if="depositState.paymentDetail.extra_remark && depositState.paymentDetail.extra_remark.length > 0"
      >
        <span class="form-title py-[10px]">{{ $t("member.deposit.remark") }}</span>
        <div v-for="(item, index) in depositState.paymentDetail.extra_remark" :key="index" class="col-12">
          <q-input
            class="form-input mb-5"
            outlined
            dense
            v-model="item.content"
            :placeholder="item.titles.find((lang) => lang.lang === nowLang)?.title"
          />
        </div>
      </div>
      <!--活動-->
      <div v-if="depositState.promotion_list.length" class="form-row field-input flex flex-col pay-area">
        <span class="form-title">{{ $t("member.deposit.depositReward") }}</span>

        <div class="form-promo py-2">
          <PromotionList
            v-for="item in depositState.promotion_list"
            :key="item.id"
            :item="item"
            :activeId="depositState.form.promotion_id"
            @click="handlePromotionClick(item.id)"
          ></PromotionList>
        </div>
      </div>

      <q-btn class="btn-submit" type="submit" :loading="isLoading">
        {{ $t("common.btn.submit") }}
      </q-btn>
    </q-form>
  </section>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core"
import { useQuasar } from "quasar"
import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"
import { useBank } from "src/common/composables/useBank"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommon } from "src/common/hooks/useCommon"
import { usePayment } from "src/common/hooks/usePayment"
import { useRule } from "src/common/hooks/useRule"
import { FEE_TYPE, FIELD_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, ref, watch } from "vue"
import PromotionList from "./PromotionList.vue"

const { copyMessage, moneyFormat, preciseMultiply } = useCommon()
const { nowLang } = useLanguage()
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
const { isLoading } = useAuth()
const $q = useQuasar()
const { hasFee } = usePayment()
const eventbus = injectStrict(EventBusKey)

const rateResult = computed(
  () => `${preciseMultiply(Number(depositState.form.amount), Number(depositState.paymentDetail.usdt_rate))}`
)

const handlingFee = computed(() => {
  return depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
    ? depositState.paymentDetail.fee_amount
    : `${depositState.paymentDetail.fee_rate}%`
})
const inputAmount = ref("")

const updateInputDisplay = () => {
  inputAmount.value = moneyFormat(depositState.form.amount ?? "").toString()
}

watch(() => depositState.form.amount, updateInputDisplay, { immediate: true })

const handleInputChange = (value: string | number | null) => {
  const numericValue = (value ?? "").toString().replace(/[^\d]/g, "")
  if (numericValue !== depositState.form.amount) {
    depositState.form.amount = numericValue
  }
}

const handleSubmit = async () => {
  let { status } = await handleDepositSubmit()
  inputAmount.value = ""
  depositState.form.amount = ""
  if (status) {
    eventbus.emit("openDepositWithWithdrawal", false)
    eventbus.emit("openPendingTransaction", true)
  }
}

const initDepositForm = async () => {
  try {
    $q.loading.show()
    await getDepositPaymentList()
    await getPromotionList()
    $q.loading.hide()
  } catch (error) {
    $q.loading.hide()
  }
}

// 監聽 amount
const debounceFn = useDebounceFn(() => getPromotionList(), 500)
watch(
  () => depositState.form.amount,
  () => debounceFn()
)

onMounted(() => {
  initDepositForm()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_paisa24/assets/css/_variable.scss";

// common style

.form-input {
  :deep(.q-field__inner) {
    @apply w-full;
    min-height: 40px;
    height: 100%;
    background: #fff;
    border-bottom: 0.0625rem solid #dee3f026;
    border-radius: 0.5rem;
    .q-field__control-container {
      padding: 0;
    }
    .q-field__native {
      min-height: 3.125rem;
      color: dimgrey;
      .q-field__input {
        color: dimgrey;
      }
    }
    .q-field__label {
      min-height: 3.125rem;
      color: red;
    }
    .q-field__append {
      height: 3.125rem;
      line-height: 3.125rem;
    }
    &::after {
      height: 100%;
    }
  }
}

.pay-area {
  @apply p-4 my-[.9375rem] rounded-[.625rem];
  background: $history-search-wrapper-bg;

  .pay-area-title {
    @apply font-semibold py-[.3125rem];
  }

  .pay-btn-wrapper {
    @apply grid justify-between gap-[.9375rem];
    grid-template-columns: repeat(3, 1fr);

    @include iphone-width {
      @apply grid-cols-2;
    }
  }

  .pay-btn {
    @apply flex items-center justify-center text-[.875rem] font-semibold;
    @apply cursor-pointer rounded-[.625rem] p-[.625rem] text-white;
    background: $primary-color;

    &:hover,
    &.active {
      background: $pink-shadow-color;
    }

    @include iphone-width {
      @apply text-sm;
    }
  }
}

.form-row {
  .form-title {
    @apply text-base font-bold;
    color: $input-text-color;
  }

  .form-methods {
    @apply grid gap-[.1875rem];
    grid-template-columns: repeat(3, 1fr);

    .method-item {
      @apply flex flex-col items-center justify-center p-[.625rem] relative;
      @apply cursor-pointer;
      border-radius: 0.25rem;
      border-color: $primary-color;
      background-color: $secondary-color;
      transition: all 0.3s ease;
      color: $input-text-color;

      img {
        @apply w-[3.75rem] h-[1.875rem];
      }

      span {
        margin-top: 0.125rem;
        font-size: 0.75rem;
      }

      &.active {
        background-color: $primary-color;
        &::after {
          @apply absolute right-[1px] bottom-[1px] w-[25px] h-[25px];
          content: "";
          background: url("../../../assets/images/svg/checked.svg");
          background-repeat: no-repeat;
          background-size: contain;
        }

        span {
          @apply font-bold;
          color: $input-text-color;
        }
      }
    }
  }
}

.bank-account {
  @apply flex flex-col w-full h-auto p-[.25rem];
}

.quick-btn-wrapper {
  @apply flex flex-wrap gap-[.5rem] max-h-[2.5rem] mb-[3.125rem];

  .quick-btn {
    @apply cursor-pointer relative;
    @apply flex items-center justify-center min-h-[40px];
    border-radius: 0.25rem;
    background-color: $secondary-color;
    color: $input-text-color;
    width: auto !important;
    min-width: 3.75rem !important;
    padding: 0.5rem;

    &.active {
      background-color: $primary-color;
      font-weight: bold;

      &::after {
        @apply absolute right-[.0625rem] bottom-[.0625rem] w-[1.5625rem] h-[1.5625rem];
        content: "";
        background: url("../../../assets/images/svg/checked.svg");
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }
}

.form-promo {
  @apply flex justify-between;
  width: 100%;
  font-size: 0.75rem;
  gap: 0.5625rem;
  flex-wrap: wrap;
}

.deposit-wrapper {
  .field-icon {
    color: $primary-color;
  }

  .btn-submit {
    @apply w-full mb-0 text-white;
    background: $pink-button-gradient;
  }
}
</style>
