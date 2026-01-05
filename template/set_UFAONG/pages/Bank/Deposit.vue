<template>
  <section class="deposit-wrapper px-[10px] pb-[90px]">
    <!-- 幣別選擇 -->
    <div class="currency-list">
      <div class="currency-title text-yellow">{{ $t("member.bank.selectCurrency") }}</div>
      <div v-if="depositState.supportedCurrency.length > 0" class="flex gap-[10px]">
        <span
          v-for="(deposit, key) in depositState.supportedCurrency"
          :key="key"
          :class="{ active: `${deposit}` === depositState.form.currency }"
          @click="handleDepositCurrencyClick(deposit)"
          class="currency-btn"
        >
          {{ $t(deposit) }}
        </span>
      </div>
      <div v-else class="no-data">
        <p class="text-center text-yellow-primary">
          {{ $t("tableHeader.no_data") }}
        </p>
      </div>
    </div>
    <!-- 支付方式選擇 -->
    <div class="py-[20px]">
      <ul v-if="depositState.fundTypeList.length > 0" class="payment-type-container">
        <li
          v-for="fundType in depositState.fundTypeList"
          :key="fundType"
          :class="{ active: fundType === `${depositState.usingFundType}` }"
          @click="handleDepositFundTypeClick(fundType)"
        >
          {{ $t(`member.bank.${fundType}`) }}
        </li>
      </ul>
      <div v-else class="no-data">
        <p class="text-center text-yellow-primary">
          {{ $t("tableHeader.no_data") }}
        </p>
      </div>
    </div>
    <q-form class="payment-form" @submit="handleSubmit">
      <!-- 支付方式 -->
      <div class="form-row flex flex-col">
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
          <p class="text-center text-yellow-primary">
            {{ $t("tableHeader.no_data") }}
          </p>
        </div>
      </div>
      <!-- 支付資訊 -->
      <div class="form-row flex flex-col" v-if="depositState.usingFundType === 'BankTransfer'">
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
      <div class="form-row flex flex-col" v-if="depositState.usingFundType === 'CryptoWallet'">
        <label class="form-title py-[10px]">{{ $t("member.deposit.depositInfo") }}:</label>
        <ul class="bank-account">
          <li>
            <span class="mr-2">{{ depositState.paymentDetail.currency_brand }}</span>
            <q-icon name="save" @click="copyMessage(depositState.paymentDetail.currency_brand)" />
          </li>
          <li class="mb-2">
            <span class="mr-2">{{ depositState.paymentDetail.chain }}</span>
            <q-icon name="save" @click="copyMessage(depositState.paymentDetail.chain)" />
          </li>
          <li class="mb-2">
            <span class="mr-2">{{
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
      <div class="form-row flex flex-col" v-if="depositState.usingFundType === 'CryptoPayment'">
        <label class="form-title py-[10px]">{{ $t("member.deposit.depositInfo") }}:</label>
        <ul class="bank-account">
          <li>
            <span class="mr-2">{{ depositState.paymentDetail.currency_brand }}</span>
            <q-icon name="save" @click="copyMessage(depositState.paymentDetail.currency_brand)" />
          </li>
        </ul>
      </div>
      <!-- 手續費 -->
      <div
        v-if="hasFee(depositState.paymentDetail) && depositState.usingFundType === 'BankTransfer'"
        class="form-row field-input flex flex-col"
      >
        <p class="form-title py-[10px]">
          {{ $t("member.deposit.handlingFee") }}
          :
          <span class="text-white">
            {{ handlingFee }}
          </span>
        </p>
      </div>
      <!-- 存款金額 -->
      <div class="form-row field-input flex flex-col">
        <span class="form-title py-[10px]">{{ $t("member.deposit.depositAmount") }}</span>
        <q-input
          :model-value="inputAmount"
          @update:model-value="handleInputChange"
          bg-color="white"
          color="black"
          :placeholder="$t('member.deposit.depositAmount')"
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
            <q-icon name="fas fa-coins" class="text-black" />
          </template>
        </q-input>
        <ul class="form-title" v-show="depositState.paymentDetail.usdt_rate">
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
      <div class="form-row field-input flex flex-col" v-if="depositState.paymentDetail.extra_field_key">
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
      <!-- 存款備註 -->
      <div
        class="form-row field-input flex flex-col"
        v-if="depositState.paymentDetail.extra_remark && depositState.paymentDetail.extra_remark.length > 0"
      >
        <div class="form-title py-[10px]">{{ $t("member.deposit.remark") }}</div>
        <div class="form-remark">
          <div v-for="(item, index) in depositState.paymentDetail.extra_remark" :key="index" class="form-remark-item">
            <div class="form-remark-input">
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
      <!--活動-->
      <div v-if="depositState.promotion_list.length" class="form-row field-input flex flex-col q-pb-md">
        <span class="form-title py-[10px]">{{ $t("member.deposit.depositReward") }}</span>

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
import { usePixelCodesTrigger } from "src/common/hooks/usePixelCodesTrigger"
import { FEE_TYPE, FIELD_TYPE } from "src/common/utils/constants"
import { computed, onMounted, ref, watch } from "vue"
import { useRouter } from "vue-router"
import PromotionList from "./components/PromotionList.vue"

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
const router = useRouter()
const { hasFee } = usePayment()

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
  if (status) router.push({ name: "PendingTransaction" })
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
  usePixelCodesTrigger()
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
@import "../../assets/css/main.scss";

// common style
.form-input {
  @apply w-full;
  :deep(.q-icon) {
    color: #000;
  }

  :deep(.q-field__control) {
    height: 50px;
    height: auto;
    border: 0.0625rem solid #fff;
    background: #fff;
    border-radius: 0.3rem;
    .q-field__control-container {
      padding: 0;
    }

    .q-field__native {
      min-height: 3.125rem;
      color: #000;
      .q-field__input {
        color: #000;
      }
    }

    .q-field__label {
      min-height: 3.125rem;
      color: dimgrey;
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

.currency-list {
  @apply pb-[15px];

  .currency-title {
    @apply font-semibold py-[10px];
  }

  .currency-btn {
    @apply flex items-center justify-center min-w-[58px] min-h-[31px];
    @apply font-semibold cursor-pointer;
    font-size: 0.875rem;
    border-radius: 0.625rem;

    &:hover,
    &.active {
      color: $dark-bg;
      background: $gradient-to-bottom;
    }
  }
}

.form-row {
  .form-title {
    @apply text-base font-bold;
    color: $primary;
  }

  .form-methods {
    @apply grid gap-[.1875rem] mb-3;
    grid-template-columns: repeat(3, 1fr);

    .method-item {
      @apply flex flex-col items-center justify-center p-[.625rem] relative;
      @apply cursor-pointer bg-white text-black;
      border-radius: 0.25rem;
      border-color: #becaec;
      transition: all 0.3s ease;

      img {
        @apply w-[3.75rem] h-[1.875rem];
      }

      span {
        margin-top: 0.125rem;
        font-size: 0.75rem;
      }

      &.active {
        &::after {
          @apply absolute right-[1px] bottom-[1px] w-[25px] h-[25px];
          content: "";
          background: url("../../assets/images/svg/checked.svg");
          background-repeat: no-repeat;
          background-size: contain;
        }

        span {
          color: #4a89fc;
          font-weight: bold;
        }
      }
    }
  }
}

.bank-account {
  @apply h-auto p-[.25rem];
  @apply flex flex-col;
  width: 100%;
  // background: #2b2b2b;
  // border: 1px solid $primary;
  // border-radius: 0.8rem;
}

.quick-btn-wrapper {
  @apply flex flex-wrap gap-[.5rem] max-h-[2.5rem] mb-[3.125rem];

  .quick-btn {
    @apply cursor-pointer bg-white text-black relative;
    @apply flex items-center justify-center min-h-[40px];
    border-radius: 0.25rem;
    border-color: #becaec;
    width: auto !important;
    min-width: 3.75rem !important;
    padding: 0.5rem;

    &.active {
      color: #4a89fc;
      font-weight: bold;

      &::after {
        @apply absolute right-[.0625rem] bottom-[.0625rem] w-[1.5625rem] h-[1.5625rem];
        content: "";
        background: url("../../assets/images/svg/checked.svg");
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }
}

.payment-type-container {
  li {
    @apply text-sm;
  }
}

.form-promo {
  @apply flex justify-between;
  width: 100%;
  font-size: 0.75rem;
  gap: 0.5625rem;
  flex-wrap: wrap;
}

.form-remark {
  .form-remark-input {
    margin-bottom: 0.625rem;
  }
}
</style>
