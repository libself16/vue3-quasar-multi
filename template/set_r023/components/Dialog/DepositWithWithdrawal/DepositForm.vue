<template>
  <section class="deposit-wrapper">
    <div class="pay-area money-background">
      <div class="pay-area-title">{{ $t("tableHeader.currentBalance") }}</div>
      <div class="wallet-balance" v-if="inUseWallet">
        <span class="balance-label">{{ activeWalletLabel }}</span>
        <span class="balance-amount">{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance) }}</span>
        <span class="wallet-dropdown-icon" @click.stop.prevent="getBalance">
          <i :class="{ 'fas fa-sync-alt': !isSpinning, 'fas fa-sync-alt fa-spin': isSpinning }"></i>
        </span>
      </div>
    </div>

    <slot name="tab" />

    <!-- 幣別選擇 -->
    <div class="pay-area">
      <div class="pay-area-title">{{ $t("member.deposit.selectCurrency") }}</div>
      <div v-if="depositState.supportedCurrency.length > 0" class="pay-btn-wrapper">
        <span
          v-for="(deposit, key) in depositState.supportedCurrency"
          :key="key"
          :class="{ active: `${deposit}` === depositState.form.currency }"
          @click="handleDepositCurrencyClick(deposit)"
          class="pay-btn"
        >
          <q-icon name="fas fa-coins" class="field-icon" />
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
    <div class="form-row pay-area" v-if="depositState.fundTypeList.length > 0">
      <div class="form-title pb-3">{{ $t("member.deposit.type") }}</div>
      <ul class="pay-btn-wrapper">
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
    </div>
    <q-form class="payment-form" @submit="handleSubmit">
      <!-- 支付方式 -->
      <div class="form-row pay-area">
        <div class="form-title pb-3">{{ $t("member.deposit.selectMethod") }}</div>
        <div v-if="depositState.usingPaymentInfoList.length > 0" class="pay-btn-wrapper">
          <div
            v-for="(item, key) in depositState.usingPaymentInfoList"
            :key="key"
            class="pay-btn limit-height"
            :class="{ active: String(item.id) === `${depositState.form.payment_gateway_id}` }"
            @click="handleDepositPaymentClick(item.id)"
          >
            <img :src="item.imgUrl" alt="" class="w-full h-full" />
            <!-- <span>{{ item.name }}</span> -->
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
        <div class="form-title pb-3">{{ $t("member.deposit.bankAccount") }}</div>
        <ul class="bank-account">
          <li>
            <span class="mr-2">{{ depositState.paymentDetail.bank_name }}</span>
            <q-icon
              name="fa-solid fa-copy"
              class="copy-icon"
              size="1.125rem"
              @click="copyMessage(depositState.paymentDetail.bank_name)"
            />
          </li>
          <li class="mb-2">
            <span class="mr-2">{{ depositState.paymentDetail.bank_account }}</span>
            <q-icon
              name="fa-solid fa-copy"
              class="copy-icon"
              size="1.125rem"
              @click="copyMessage(depositState.paymentDetail.bank_account)"
            />
          </li>
        </ul>

        <img
          v-if="depositState.paymentDetail.qrcode_image_id !== 0"
          :src="depositState.paymentDetail.imgUrl"
          alt=""
          class="w-23 h-23 mb-3"
        />

        <!-- 手續費 -->
        <div
          v-if="hasFee(depositState.paymentDetail) && depositState.usingFundType === 'BankTransfer'"
          class="fee-area"
        >
          {{ `${$t("member.deposit.handlingFee")}:` }}
          <span>{{ handlingFee }}</span>
        </div>
      </div>
      <div class="form-row pay-area" v-if="depositState.usingFundType === 'CryptoWallet'">
        <div class="form-title pb-3">{{ $t("member.deposit.depositInfo") }}:</div>
        <ul class="bank-account">
          <li class="mb-2">
            <div>
              <span class="title">{{ `${$t("member.deposit.currencyBrand")}: ` }}</span>
              <span class="mr-2">{{ depositState.paymentDetail.currency_brand }}</span>
            </div>
            <q-icon
              name="fa-solid fa-copy"
              class="copy-icon"
              size="1.125rem"
              @click="copyMessage(depositState.paymentDetail.currency_brand)"
            />
          </li>
          <li class="mb-2">
            <div>
              <span class="title">{{ `${$t("member.deposit.chain")}: ` }}</span>
              <span class="mr-2">{{ depositState.paymentDetail.chain }}</span>
            </div>
            <q-icon
              name="fa-solid fa-copy"
              class="copy-icon"
              size="1.125rem"
              @click="copyMessage(depositState.paymentDetail.chain)"
            />
          </li>
          <li class="mb-2">
            <div>
              <span class="title">{{ `${$t("member.deposit.walletAddress")}: ` }}</span>
              <span>{{
                depositState.paymentDetail.wallet_address.length > 15
                  ? depositState.paymentDetail.wallet_address.substring(0, 15) + "..."
                  : depositState.paymentDetail.wallet_address
              }}</span>
            </div>
            <q-icon
              name="fa-solid fa-copy"
              class="copy-icon"
              size="1.125rem"
              @click="copyMessage(depositState.paymentDetail.wallet_address)"
            />
          </li>
        </ul>
        <img
          v-if="depositState.paymentDetail.qrcode_image_id !== 0"
          :src="depositState.paymentDetail.imgUrl"
          alt=""
          class="w-23 h-23"
        />
      </div>
      <div class="form-row pay-area" v-if="depositState.usingFundType === 'CryptoPayment'">
        <div class="form-title pb-3">{{ $t("member.deposit.depositInfo") }}:</div>
        <ul class="bank-account">
          <li class="mb-2">
            <div>
              <span class="title">{{ `${$t("member.deposit.currencyBrand")}: ` }}</span>
              <span class="mr-2">{{ depositState.paymentDetail.currency_brand }}</span>
            </div>
            <q-icon
              name="fa-solid fa-copy"
              class="copy-icon"
              size="1.125rem"
              @click="copyMessage(depositState.paymentDetail.currency_brand)"
            />
          </li>
        </ul>
      </div>
      <!-- 存款金額 -->
      <div class="form-row field-input flex flex-col pay-area">
        <div class="form-title pb-3">{{ $t("member.deposit.depositAmount") }}</div>
        <div class="pay-btn-wrapper depoist-amount-pay-btn-wrapper">
          <span
            v-for="item in depositState.quickBtns"
            :key="item"
            class="pay-btn amount-btn"
            @click="handleDepositQuickBtnClick(item)"
            :class="{ active: item === depositState.form.amount }"
          >
            {{ moneyFormat(item) }}
          </span>
        </div>
        <q-input
          :model-value="inputAmount"
          @update:model-value="handleInputChange"
          class="form-input mt-4"
          outlined
          lazy-rules
          @keypress="Rules.validatePositiveNumber"
          inputmode="decimal"
          :rules="[
            Rules.required,
            (val: string) =>
              Rules.depositAmount({
                min: depositState.paymentDetail.deposit_min,
                max: depositState.paymentDetail.deposit_max,
                val: val.replace(/,/g, '')
              })
          ]"
        >
        </q-input>
        <div class="form-title">
          {{ $t("member.deposit.mixMaxLimit") }}: {{ moneyFormat(depositState.paymentDetail.deposit_min) }} /
          {{ moneyFormat(depositState.paymentDetail.deposit_max) }}
        </div>
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

      <div v-if="depositState.uploadConfig.uploadSwitch" class="pay-area">
        <div class="form-title label col-12">{{ $t("tableHeader.uploadDetail") }}</div>
        <div class="uploaded">
          <div class="item" v-for="(item, index) in depositState.uploadConfig.images" :key="index">
            <img @click="showBiggerImage(item.image.base64)" :src="item.image.base64" alt="" />
            <q-btn
              color="red"
              rounded
              dense
              icon="delete"
              class="delete-btn"
              size="sm"
              @click="handleDepositUploadImageDelete(index)"
            ></q-btn>
          </div>
        </div>
        <div class="upload-area" @click="openUploader()">
          <q-icon name="add" size="32px"></q-icon>
          <div class="warning">
            {{ $t("member.deposit.depositDetailUploadWarning", { mb: maxSizeInMb }) }}
          </div>
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
import { useRouter } from "vue-router"
import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"
import { useBank } from "src/common/composables/useBank"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { usePayment } from "src/common/hooks/usePayment"
import { useRule } from "src/common/hooks/useRule"
import { FEE_TYPE, FIELD_TYPE, WALLET_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, ref, watch } from "vue"
import PromotionList from "./PromotionList.vue"

const { inUseWallet, activeWalletLabel, getUserWalletList } = useUserInfo()
const { copyMessage, moneyFormat, preciseMultiply, uploadImage } = useCommon()
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
  handleDepositUploadImageDelete,
  handleDepositSubmit
} = useBank()
const router = useRouter()
const { isLoading } = useAuth()
const $q = useQuasar()
const { hasFee } = usePayment()
const { openUploader, uploadInit, maxSizeInMb } = uploadImage()

const imageDialogOpen = ref(false)
const previewImage = ref("")
const isSpinning = ref(false)

const showBiggerImage = (base64: string) => {
  imageDialogOpen.value = true
  previewImage.value = base64
}
const eventbus = injectStrict(EventBusKey)

const rateResult = computed(
  () => `${preciseMultiply(Number(depositState.form.amount), Number(depositState.paymentDetail.usdt_rate))}`
)

const handlingFee = computed(() => {
  return depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
    ? depositState.paymentDetail.fee_amount
    : `${depositState.paymentDetail.fee_rate}%`
})
const inputAmount = ref(null)

const updateInputDisplay = () => {
  inputAmount.value = depositState.form.amount !== "" ? moneyFormat(depositState.form.amount).toString() : ""
}

watch(() => depositState.form.amount, updateInputDisplay, { immediate: true })

const handleInputChange = (value: string | number | null) => {
  const numericValue = (value ?? "").toString().replace(/[^\d]/g, "")
  if (numericValue !== depositState.form.amount) {
    depositState.form.amount = numericValue
  }
}

const handleSubmit = async () => {
  // 上傳圖片帶入Form
  depositState.form.images = depositState.uploadConfig.images.map((item) => item.image.base64)
  let { status } = await handleDepositSubmit()
  inputAmount.value = ""
  depositState.form.amount = ""
  if (status) {
    eventbus.emit("openDepositWithWithdrawal", false)
    router.push({ name: "orders" })
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

const getBalance = () => {
  isSpinning.value = true
  setTimeout(() => {
    getUserWalletList()
    isSpinning.value = false
  }, 1000)
}

// 監聽 amount
const debounceFn = useDebounceFn(() => getPromotionList(), 500)
watch(
  () => depositState.form.amount,
  () => debounceFn()
)

onMounted(() => {
  uploadInit(depositState.uploadConfig.images, 5) // 上傳組件初始化config
  initDepositForm()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r023/assets/css/_variable.scss";

// common style
// 上傳組件
.preview-image {
  width: 50vw;
  height: auto;

  @include iphone-width {
    width: 100vw;
  }
}

.uploaded {
  @apply grid grid-cols-3 gap-4;

  .item {
    @apply relative border border-black/20 rounded overflow-hidden;
    width: 200px;
    height: 200px;

    img {
      @apply w-full;
    }

    .delete-btn {
      @apply p-2 absolute right-4 bottom-4;
    }
  }

  @include iphone-width {
    @apply grid grid-cols-1 gap-4;

    .item {
      width: 300px;
      height: auto;
      margin: 0 auto;
    }
  }
}

.upload-area {
  color: var(--secondary-01);
  border-color: var(--secondary-01);
  margin: 1rem 0;

  @apply aspect-video rounded flex flex-col gap-2 px-4 items-center justify-center cursor-pointer hover:bg-black/15 border-dashed border break-all;

  .warning {
    @apply text-sm;
  }
}

.form-input {
  :deep(.q-field__inner) {
    @apply w-full;
    min-height: 40px;
    height: 100%;
    background: var(--neutral-01);
    border-radius: 0.5rem;
    .q-field__control {
      height: 44px;
      border-radius: 8px;

      &::before {
        border-color: var(--neutral-03);
      }
    }
    .q-field__control-container {
      padding: 0;
    }
    .q-field__native {
      min-height: 44px;
      color: var(--neutral-10);

      &::placeholder {
        color: var(--primary-08);
      }
    }
    .q-field__label {
      min-height: 3.125rem;
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
  @apply p-4 rounded-[.625rem];
  margin-bottom: 0.9375rem;
  background: var(--neutral-01);

  @include pad-large-width {
    border-radius: 0;
  }

  &.money-background {
    border-radius: 12px;
    background: linear-gradient(0deg, var(--neutral-01, #143241) 39.9%, var(--neutral-03, #215a78) 100%);

    @include pad-large-width {
      margin: 1rem;
    }
  }

  .pay-area-title {
    @apply font-semibold pb-3;
    color: var(--secondary-01);
    font-family: "Segoe UI";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px; /* 157.143% */
  }

  .wallet-balance {
    .balance-label {
      color: var(--secondary-01);
      font-family: OpenSans;
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
      line-height: 22px;
    }
    .balance-amount {
      margin: 0 0.375rem;
      color: var(--primary-01, #2d7eff);
      font-family: OpenSans;
      font-size: 20px;
      font-weight: 600;
      line-height: 22px; /* 157.15% */
    }
    .wallet-dropdown-icon {
      cursor: pointer;
    }
  }

  ul {
    font-size: 14px;
  }

  .pay-btn-wrapper {
    @apply grid justify-between gap-[.9375rem];
    grid-template-columns: repeat(3, 1fr);

    &.depoist-amount-pay-btn-wrapper {
      @apply flex flex-wrap justify-start;
    }

    @include iphone-width {
      @apply grid-cols-2;
    }
  }

  .pay-btn {
    @apply flex items-center justify-center text-[.875rem] cursor-pointer rounded-[.625rem] p-[.625rem];
    border-radius: 0.594375rem;
    border: 0.951px solid var(--neutral-03);
    background: var(--neutral-01);
    color: var(--secondary-01);

    &.amount-btn {
      border-radius: 0.5rem;
      min-width: 3.75rem !important;
      width: auto !important;
    }

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
      margin-right: 0.6875rem;
      font-style: normal;
      font-weight: 900;
      line-height: 26.095px; /* 100.146% */
    }

    @include iphone-width {
      @apply text-sm;
    }
  }
}

.form-row {
  .form-title {
    color: var(--secondary-01);
    font-family: "Segoe UI";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px; /* 157.143% */
  }

  .fee-area {
    color: var(--primary-01);
    font-size: 0.875rem;
    font-weight: 600;
  }
}

.bank-account {
  @apply flex flex-col w-full h-auto p-[.25rem];
  li {
    display: flex;
    height: 42.91px;
    padding: 9.45px 13.45px 9.06px 9.46px;
    margin-bottom: 12px;
    justify-content: space-between;
    align-items: center;
    border-radius: 3.2px;
    border: 1px solid var(--neutral-03);
    .title {
      font-size: 14px;
    }

    .copy-icon {
      color: var(--primary-03);
    }
  }
}

.quick-btn-wrapper {
  @apply grid gap-[.5rem] max-h-[2.5rem] mb-[3.125rem];
  grid-template-columns: repeat(4, 1fr);

  .quick-btn {
    @apply cursor-pointer relative;
    @apply flex items-center justify-center min-h-[40px];
    border-radius: 0.25rem;
    background-color: var(--neutral-01);
    border: 1px solid var(--neutral-03);
    color: var(--primary-02);

    &.active {
      border: 0.951px solid var(--primary-01);
      background: var(--primary-04);
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
  @include pad-large-width {
    padding-bottom: 30vh;
  }

  .field-icon {
    color: var(--secondary-01);
  }

  .btn-submit {
    @apply w-full mb-0;

    border-radius: 8px;
    background: var(--primary-09);
    display: flex;
    justify-content: center;
    height: 2.75rem;
    margin-bottom: 1rem;
    color: var(--text-01);

    @include pad-large-width {
      margin: 0 auto;
      width: 82vw;
    }
  }
}
</style>
