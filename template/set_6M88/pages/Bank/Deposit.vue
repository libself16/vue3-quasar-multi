<template>
  <HeaderTitleBack titleI18n="menu.deposit" v-bind="HTBConfig">
    <section class="deposit-wrapper px-[10px] pb-[90px]">
      <!-- 幣別選擇 -->
      <div class="currency-list">
        <div class="currency-title">{{ $t("member.bank.selectCurrency") }}</div>
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
              <img :src="item.imgUrl" alt="" />
              <!-- <span>{{ item.name.length > 16 ? item.name.slice(0, 16) + "..." : item.name }}</span> -->
            </div>
          </div>
          <div v-else class="no-data">
            <p class="text-center text-yellow-primary">
              {{ $t("tableHeader.no_data") }}
            </p>
          </div>
        </div>
        <!-- 銀行帳號 -->
        <div class="form-row flex flex-col" v-if="depositState.usingFundType === 'BankTransfer'">
          <label class="form-title py-[10px]">{{ $t("member.deposit.bankAccount") }}:</label>
          <ul class="bank-account">
            <li>
              <span class="mr-2">{{ depositState.paymentDetail.bank_name }}</span>
              <q-img :src="copyIconImg" @click="copyMessage(depositState.paymentDetail.bank_name)" class="w-4 h-4" />
            </li>
            <li class="mb-2">
              <span class="mr-2">{{ depositState.paymentDetail.bank_account }}</span>
              <q-img :src="copyIconImg" @click="copyMessage(depositState.paymentDetail.bank_account)" class="w-4 h-4" />
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
              <q-img
                :src="copyIconImg"
                @click="copyMessage(depositState.paymentDetail.currency_brand)"
                class="w-4 h-4"
              />
            </li>
            <li class="mb-2">
              <span class="mr-2">{{ depositState.paymentDetail.chain }}</span>
              <q-img :src="copyIconImg" @click="copyMessage(depositState.paymentDetail.chain)" class="w-4 h-4" />
            </li>
            <li class="mb-2">
              <span class="mr-2">{{
                depositState.paymentDetail.wallet_address.length > 15
                  ? depositState.paymentDetail.wallet_address.substring(0, 15) + "..."
                  : depositState.paymentDetail.wallet_address
              }}</span>
              <q-img
                :src="copyIconImg"
                @click="copyMessage(depositState.paymentDetail.wallet_address)"
                class="w-4 h-4"
              />
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
              <q-img
                :src="copyIconImg"
                @click="copyMessage(depositState.paymentDetail.currency_brand)"
                class="w-4 h-4"
              />
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
            <span class="text-black">
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
            :label="$t('member.deposit.depositAmount')"
            outlined
            lazy-rules
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
          <div class="form-title py-[10px]">
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
            >
            </ExtraInput>

            <!-- 下拉選單類型 -->
            <ExtraSelect
              v-else-if="field.type === FIELD_TYPE.Enums.Select"
              v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
              :field="field"
              :class="'form-input'"
            ></ExtraSelect>

            <!-- 其他 -->
            <ExtraInput
              v-else
              v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
              :field="field"
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
                  :label="item.titles.find((lang) => lang.lang === nowLang)?.title"
                  outlined
                  dense
                  v-model="item.content"
                />
              </div>
            </div>
          </div>
        </div>
        <!--活動優惠-->
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
  </HeaderTitleBack>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core"
import { useQuasar } from "quasar"
import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useBank } from "src/common/composables/useBank"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommon } from "src/common/hooks/useCommon"
import { usePayment } from "src/common/hooks/usePayment"
import { useRule } from "src/common/hooks/useRule"
import { FEE_TYPE, FIELD_TYPE } from "src/common/utils/constants"
import { computed, onMounted, reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { useHTBConfig } from "../../hooks/useHTBConfig"
import PromotionList from "./components/PromotionList.vue"
import { useSiteImg } from "app/template/set_6M88/hooks/useSiteImg"
import { useUserInfo } from "src/common/composables/useUserInfo"

const { copyMessage, moneyFormat, preciseMultiply } = useCommon()
const { nowLang } = useLanguage()
const Rules = useRule()
const { activeWalletCurrencyCode } = useUserInfo()
const {
  depositState,
  getDepositPaymentList,
  getPromotionList,
  handleDepositCurrencyClick,
  handleDepositFundTypeClick,
  handleDepositPaymentClick,
  handleDepositQuickBtnClick,
  handleDepositSubmit,
  handlePromotionClick
} = useBank()
const { isLoading } = useAuth()
const $q = useQuasar()
const router = useRouter()
const { hasFee } = usePayment()
const { HTBConfig } = useHTBConfig()
const { copyIconImg } = useSiteImg()

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
  $q.loading.show()
  await getDepositPaymentList()
  await getPromotionList()
  $q.loading.hide()
}

// 監聽 amount
const debounceFn = useDebounceFn(() => getPromotionList(), 500)
watch(
  () => depositState.form.amount,
  () => debounceFn() //
)

// 監聽 activeWalletCurrencyCode 和 supportedCurrency，自動同步幣別選擇
watch(
  [() => activeWalletCurrencyCode.value, () => depositState.supportedCurrency],
  ([currencyCode, supportedCurrencies]) => {
    if (!supportedCurrencies || supportedCurrencies.length === 0) return

    // 檢查當前活躍錢包幣別是否在支持的幣別列表中
    if (currencyCode && supportedCurrencies.includes(currencyCode)) {
      // 如果支持該幣別且當前選擇的幣別不是該幣別，則切換
      if (depositState.form.currency !== currencyCode) {
        handleDepositCurrencyClick(currencyCode)
      }
    } else {
      // 如果不支持或沒有活躍幣別，選擇第一個
      if (supportedCurrencies[0] && depositState.form.currency !== supportedCurrencies[0]) {
        handleDepositCurrencyClick(supportedCurrencies[0])
      }
    }
  },
  { immediate: true }
)

onMounted(() => {
  initDepositForm()
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
@import "../../assets/css/main.scss";

.currency-list {
  @apply pb-[15px];
  border-color: $secondary;

  .currency-title {
    @apply font-semibold py-[10px];
    color: $primary;
  }

  .currency-btn {
    @apply flex items-center justify-center min-w-[58px] min-h-[31px];
    @apply cursor-pointer;
    font-size: 0.875rem;
    border-radius: 0.625rem;
    background: $light;
    color: $primary;

    &:hover,
    &.active {
      color: #000;
      border: 1px solid $border-blue;
    }
  }
}

.form-row {
  .form-title {
    @apply text-base font-bold;
    color: $primary;
  }

  .form-methods {
    @apply grid gap-2.5 mb-3;
    grid-template-columns: repeat(2, 1fr);

    .method-item {
      @apply flex flex-col items-center justify-center p-[.625rem] relative;
      @apply cursor-pointer text-black rounded-full;
      // border-radius: 0.5rem;
      transition: all 0.3s ease;
      background-color: $light;
      border: 1px solid transparent;
      height: 50px;

      img {
        // @apply w-[3.75rem] h-auto;
        @apply w-auto h-auto max-h-[1.875rem];
      }

      // span {
      //   margin-top: 0.0625rem; // 1px
      //   font-size: 0.75rem;
      // }

      &.active {
        border: 1px solid $border-blue;

        // &::after {
        //   @apply absolute right-0 bottom-0 w-[25px] h-[25px];
        //   content: "";
        //   background: url("../../assets/images/svg/checked.svg");
        //   background-repeat: no-repeat;
        //   background-size: contain;
        // }
      }
    }
  }
}

.bank-account {
  @apply h-auto p-[.25rem];
  @apply flex flex-col;
  width: 100%;
}

.quick-btn-wrapper {
  @apply grid gap-[.5rem] max-h-[2.5rem] mb-[3.125rem];
  grid-template-columns: repeat(4, 1fr);

  .quick-btn {
    @apply cursor-pointer text-black relative;
    @apply flex items-center justify-center min-h-[40px];
    min-width: 3.75rem !important;
    width: auto !important;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    color: $primary;
    background-color: $light;

    &.active {
      border-color: $border-blue;
      color: #000;

      &::after {
        @apply absolute right-0 bottom-0 w-[1.5625rem] h-[1.5625rem];
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
    @apply text-xs;
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
    padding: 0.25rem 0;
  }
}
</style>
