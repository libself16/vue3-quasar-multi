<template>
  <div :class="cx('w-full', PAGE_X_SPACING, FLEX_CENTER)" class="deposit-layout">
    <div class="deposit-header">
      <span>{{ $t("common.btn.deposit") }}</span>
      <svg
        width="20"
        height="21"
        viewBox="0 0 20 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="cursor-pointer hidden phone:!block"
      >
        <path
          d="M15 3.5C15.5523 3.5 16 3.94772 16 4.5V16.5C16 17.0523 15.5523 17.5 15 17.5H5C4.44772 17.5 4 17.0523 4 16.5V4.5C4 3.94772 4.44772 3.5 5 3.5H15ZM6 14.5V15.7002H14V14.5H6ZM6 12.7998H14V11.5996H6V12.7998ZM6 9.7998H14V8.59961H6V9.7998ZM6 6.7998H11V5.59961H6V6.7998Z"
          class="fill-[var(--icon-02)]"
        />
      </svg>
      <q-menu class="bg-transparent hidden phone:!block" :offset="[-20, 0]">
        <MemberNav module="module2" />
      </q-menu>
    </div>
    <div class="deposit-body">
      <!-- <PaymentNav /> -->
      <q-form @submit="handleDepositSubmit">
        <div class="profile-form column">
          <div class="form-content">
            <!-- currency -->
            <div v-if="showCurrencyArea" :class="cx('currency-item', 'form-item', 'row')">
              <div class="form-title label col-12">{{ $t("member.deposit.selectCurrency") }}</div>
              <div class="btn-content col-12">
                <ExtraSelect
                  :modelValue="depositState.form.currency"
                  @update:modelValue="($event) => handleDepositCurrencyClick($event)"
                  :field="{
                    field_code: 'currency',
                    field_name: 'currency',
                    is_required: true,
                    type: FIELD_TYPE.Enums.Select,
                    values: depositState.supportedCurrency.map(item => ({
                      label: $t(formatterCurrency(item) as string),
                      value: item
                    }))
                  }"
                  optionStyle="option-style"
                  class="form-input"
                ></ExtraSelect>
              </div>
            </div>
            <!-- type -->
            <div :class="cx('type-item', 'form-item', 'row')">
              <div class="form-title label col-12">{{ $t("member.deposit.type") }}</div>
              <div class="btn-content col-12">
                <ExtraSelect
                  :modelValue="depositState.usingFundType"
                  @update:modelValue="($event) => handleDepositFundTypeClick($event)"
                  :field="{
                    field_code: 'usingFundType',
                    field_name: 'usingFundType',
                    is_required: true,
                    type: FIELD_TYPE.Enums.Select,
                    values: depositState.fundTypeList.map((item) => ({
                      label: typeI18n(item),
                      value: item
                    }))
                  }"
                  optionStyle="option-style"
                  class="form-input"
                ></ExtraSelect>
              </div>
            </div>
            <!-- 支付方式 -->
            <div class="mb-2 form-item row">
              <div class="form-title label col-12">{{ $t("member.deposit.selectMethod") }}</div>
              <div class="form-methods">
                <div
                  v-for="(item, key) in depositState.usingPaymentInfoList"
                  :key="key"
                  class="method-item"
                  :class="{ active: String(item.id) === `${depositState.form.payment_gateway_id}` }"
                  @click="handleDepositPaymentClick(item.id)"
                >
                  <img :src="item.imgUrl" alt="" class="method-item-img" />
                  <div class="method-item-title">
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 支付資訊 -->
            <div class="mb-2 form-item row" v-if="depositState.usingFundType === 'BankTransfer'">
              <div class="col-12 col-sm-12 mr-16">
                <ul class="bank-content col-12">
                  <li class="w-full flex items-center !justify-between">{{ $t("member.deposit.depositInfo") }}</li>
                  <li class="w-full flex items-center !justify-between">
                    <span>{{ depositState.paymentDetail.bank_name }}</span>
                    <q-img
                      @click="copyMessage(depositState.paymentDetail.bank_name)"
                      :src="commonSvgIcon('copy')"
                    ></q-img>
                  </li>
                  <li class="w-full flex items-center !justify-between">
                    <span>{{ depositState.paymentDetail.bank_account }}</span>
                    <q-img
                      @click="copyMessage(depositState.paymentDetail.bank_account)"
                      :src="commonSvgIcon('copy')"
                    ></q-img>
                  </li>
                  <img
                    v-if="depositState.paymentDetail.qrcode_image_id !== 0"
                    :src="depositState.paymentDetail.imgUrl"
                    alt=""
                    class="w-20rem h-20rem"
                  />
                </ul>
              </div>
              <div v-if="hasFee(depositState.paymentDetail)" class="col-12 col-sm-12 mr-16">
                <div class="form-title label col-12">
                  {{ $t("member.deposit.handlingFee") }}
                  ：
                  <span>
                    {{
                      depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
                        ? depositState.paymentDetail.fee_amount
                        : `${depositState.paymentDetail.fee_rate}%`
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div class="mb-2 form-item row" v-else-if="depositState.usingFundType === 'CryptoWallet'">
              <div class="col-12 col-sm-12 mr-16">
                <div class="form-title label col-12">{{ $t("member.deposit.depositInfo") }}</div>
                <ul class="bank-content col-12">
                  <li class="w-full flex items-center">
                    <span class="title">{{ $t("member.deposit.currencyBrand") }}</span>
                    <span>{{ depositState.paymentDetail.currency_brand }}</span>
                  </li>
                  <li class="w-full flex items-center">
                    <span class="title">{{ $t("member.deposit.chain") }}</span>
                    <span>{{ depositState.paymentDetail.chain }}</span>
                  </li>
                  <li class="w-full flex items-center !justify-between">
                    <div>
                      <span class="title">{{ $t("member.deposit.walletAddress") }}</span>
                      <!-- <span>{{ 'tx0123123' }}</span> -->
                      <span>{{
                        depositState.paymentDetail.wallet_address.length > 15
                          ? depositState.paymentDetail.wallet_address.substring(0, 15) + "..."
                          : depositState.paymentDetail.wallet_address
                      }}</span>
                    </div>
                    <q-img
                      @click="copyMessage(depositState.paymentDetail.wallet_address)"
                      :src="commonSvgIcon('copy')"
                    ></q-img>
                  </li>
                  <img
                    v-if="depositState.paymentDetail.qrcode_image_id !== 0"
                    :src="depositState.paymentDetail.imgUrl"
                    alt=""
                    class="w-20rem h-20rem"
                  />
                </ul>
              </div>
              <div v-if="hasFee(depositState.paymentDetail)" class="col-12 col-sm-12 mr-16">
                <div class="form-title label col-12">
                  {{ $t("member.deposit.handlingFee") }}
                  ：
                  <span>
                    {{
                      depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
                        ? depositState.paymentDetail.fee_amount
                        : `${depositState.paymentDetail.fee_rate}%`
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div class="mb-2 form-item row" v-else-if="depositState.usingFundType === 'CryptoPayment'">
              <div class="col-12 col-sm-12 mr-16">
                <div class="form-title label col-12">{{ $t("member.deposit.depositInfo") }}</div>
                <ul class="bank-content col-12">
                  <li class="w-full flex items-center !justify-between">
                    <div>
                      <span class="title">{{ $t("member.deposit.currencyBrand") }}</span>
                      <span>{{ depositState.paymentDetail.currency_brand }}</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-if="hasFee(depositState.paymentDetail)" class="col-12 col-sm-12 mr-16">
                <div class="form-title label col-12">
                  {{ $t("member.deposit.handlingFee") }}
                  ：
                  <span>
                    {{
                      depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
                        ? depositState.paymentDetail.fee_amount
                        : `${depositState.paymentDetail.fee_rate}%`
                    }}
                  </span>
                </div>
              </div>
            </div>
            <!-- amount -->
            <div class="form-item row">
              <div class="row col-12">
                <div class="form-title label col-12">{{ $t("member.deposit.depositAmount") }}</div>
                <div class="btn-content col-12">
                  <q-input
                    v-model="depositState.form.amount"
                    class="form-input"
                    dense
                    borderless
                    lazy-rules
                    @keypress="Rules.validatePositiveNumber"
                    :rules="[Rules.required()]"
                    :placeholder="
                      `${$t('member.deposit.mixMaxLimit')}:` +
                      ` ${depositState.paymentDetail.deposit_min} ~ ${depositState.paymentDetail.deposit_max}`
                    "
                  >
                    <template #prepend>
                      <div class="divider-error"></div>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
            <div class="form-item mb-2" v-show="depositState.paymentDetail.usdt_rate">
              <ul>
                <li>
                  <span class="form-title label col-12">{{ `${$t("member.withdrawal.rate")}: ` }}</span>
                  <span class="form-title label col-12">{{ depositState.paymentDetail.usdt_rate }}</span>
                </li>
                <li>
                  <span class="form-title label col-12">{{ `${$t("member.withdrawal.actualAmount")}: ` }}</span>
                  <span class="form-title label col-12">{{ rateResult }}</span>
                </li>
              </ul>
            </div>
            <div class="form-item mb-8">
              <div class="quick-btns flex flex-wrap gap-2">
                <q-btn
                  v-for="item in depositState.quickBtns"
                  :key="item"
                  color="quick"
                  class="quickBtns"
                  :class="{ active: depositState.form.amount === item }"
                  @click="handleDepositQuickBtnClick(item)"
                >
                  {{ item }}
                </q-btn>
              </div>
            </div>
            <!-- 額外欄位 -->
            <div class="form-item row" v-if="depositState.paymentDetail.extra_field_key">
              <div class="row col-12">
                <div class="form-title label col-12">{{ $t("bank_column.client_Info") }}</div>
                <div
                  class="input-content col-12"
                  v-for="(field, key) in depositState.paymentDetail.extra_field[
                    depositState.paymentDetail.extra_field_key
                  ]"
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
                    optionStyle="option-style"
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
            </div>

            <!-- 活動 -->
            <div class="mb-5 form-item row" v-if="depositState.promotion_list.length > 0">
              <div class="form-title label col-12">{{ $t("member.deposit.depositReward") }}</div>
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

            <!-- 存款備註 -->
            <div
              class="mb-5 form-item row"
              v-if="depositState.paymentDetail.extra_remark && depositState.paymentDetail.extra_remark.length > 0"
            >
              <div class="form-title label col-12">{{ $t("member.deposit.remark") }}</div>
              <div class="btn-content col-12">
                <template v-for="(item, index) in depositState.paymentDetail.extra_remark" :key="index">
                  <q-input
                    v-model="item.content"
                    class="form-input"
                    dense
                    borderless
                    lazy-rules
                    :placeholder="item.titles.find((lang) => lang.lang === nowLang)?.title"
                  >
                    <template #prepend>
                      <div class="divider-error"></div>
                    </template>
                  </q-input>
                </template>
              </div>
            </div>

            <div class="form-item row" v-if="depositState.uploadConfig.uploadSwitch">
              <div class="form-title label col-12">{{ $t("tableHeader.uploadDetail") }}</div>
              <div class="uploaded" v-if="depositState.uploadConfig.images.length > 0">
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
            </div>
            <div class="form-item row" v-if="depositState.uploadConfig.uploadSwitch">
              <div class="upload-area" @click="openUploader()">
                <q-img :src="commonSvgIcon('cloud-arrow-up')" size="32px"></q-img>
                <div class="warning">
                  {{ $t("member.deposit.depositDetailUploadWarning", { mb: maxSizeInMb }) }}
                </div>
              </div>
            </div>

            <div class="action-btns row justify-center">
              <q-btn :label="$t('common.btn.confirm')" class="submit-btn text-capitalize" type="submit" />
            </div>
          </div>
        </div>
      </q-form>
    </div>
  </div>
  <q-dialog v-model="imageDialogOpen">
    <q-card>
      <q-card-section class="flex justify-center">
        <img :src="previewImage" class="preview-image max-w-full max-h-[80vh]" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { cx } from "src/common/utils/cx"
import { PAGE_X_SPACING, FLEX_CENTER } from "src/common/utils/constants/styles"
import { useDebounceFn } from "@vueuse/core"
import { useQuasar } from "quasar"
import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"
import { useBank } from "src/common/composables/useBank"
import { useLanguage } from "src/common/composables/useLanguage"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useCommon } from "src/common/hooks/useCommon"
import { usePayment } from "src/common/hooks/usePayment"
import { useRule } from "src/common/hooks/useRule"
import { AI_HELPER_EVENT_ROUTES, FEE_TYPE, FIELD_TYPE } from "src/common/utils/constants"
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import PromotionList from "./components/PromotionList.vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import MemberNav from "src/common/components/MemberNav/Index.vue"

const { isTelegramMiniApp, listenPreventOverflow, removeListenPreventOverflow } = useTelegram()
const { userWalletMap } = useUserInfo()
const { copyMessage, preciseMultiply, uploadImage } = useCommon()
const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const {
  depositState,
  typeI18n,
  getPromotionList,
  getDepositPaymentList,
  handleDepositCurrencyClick,
  handleDepositFundTypeClick,
  handleDepositPaymentClick,
  handleDepositQuickBtnClick,
  handlePromotionClick,
  handleDepositUploadImageDelete,
  handleDepositSubmit: originalHandleDepositSubmit,
  formatterCurrency
} = useBank()
const router = useRouter()
const { hasFee } = usePayment()
const { nowLang } = useLanguage()
const { handleAIHelperRouteEvent } = useAIHelperEvent()
const { openUploader, uploadInit, maxSizeInMb } = uploadImage()

const imageDialogOpen = ref(false)
const previewImage = ref("")
const { commonResult, commonSvgIcon } = useCommonImg()

const showBiggerImage = (base64: string) => {
  imageDialogOpen.value = true
  previewImage.value = base64
}

const rateResult = computed(
  () => `${preciseMultiply(Number(depositState.form.amount), Number(depositState.paymentDetail.usdt_rate))}`
)

const showCurrencyArea = computed(() => {
  const userWalletMapLength = Object.keys(userWalletMap.value).length
  return depositState.supportedCurrency.length > 1 || userWalletMapLength > 1
})

const handleDepositSubmit = async () => {
  // 檢查是否正確選擇 payment gateway id
  if (depositState.form.payment_gateway_id == 0 || depositState.form.currency == "") {
    $q.notify({
      type: "negative",
      message: t("common.validate.verificationError"),
      position: "top",
      timeout: 1000
    })
    return
  }

  depositState.form.images = depositState.uploadConfig.images.map((item) => item.image.base64)

  let { status } = await originalHandleDepositSubmit()
  depositState.form.amount = ""
  if (status) router.push({ name: "orders", query: { search_type: 1 } })
}

onMounted(async () => {
  $q.loading.show()
  uploadInit(depositState.uploadConfig.images, 5) // 上傳組件初始化config
  handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.DEPOSIT)
  await getDepositPaymentList()
  await listenPreventOverflow()
  await getPromotionList()
  $q.loading.hide()
})

onUnmounted(() => {
  removeListenPreventOverflow()
})

// 監聽 amount
const debounceFn = useDebounceFn(() => getPromotionList(), 500)
watch(
  () => depositState.form.amount,
  () => debounceFn()
)

defineExpose({
  showBiggerImage,
  imageDialogOpen,
  previewImage
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_r017/assets/css/_variable.scss"

// common style
.header-back-area
  top: 3.6875rem !important
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
.option-style
  color: #000
// 上傳組件樣式
.preview-image
  width: 50vw
  height: auto
  +iphone-width
    width: 100vw
.uploaded
  margin-top: 1rem
  @apply grid grid-cols-2 gap-4 w-full
  .item
    @apply relative
    @apply rounded overflow-hidden
    border: 2px dashed var(--bg-line-03)
    width: 100%
    height: 200px
    img
      @apply w-full
    .delete-btn
      @apply p-2 absolute right-4 bottom-4
  +iphone-width
    @apply grid grid-cols-1 gap-4
    .item
      width: 100%
      height: auto
      margin: 0 auto

.upload-area
  display: flex
  height: 89px
  width: 100%
  padding: 20px
  margin: 1rem 0
  justify-content: center
  align-items: center
  gap: 10px
  align-self: stretch
  border-radius: 12px
  border: 2px dashed var(--bg-line-03)
  cursor: pointer
  .q-img
    color: var(--neutral-01)
    width: 1.5rem
  .warning
    @apply text-sm

// 表格樣式
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
  font-family: Helvetica
  ::v-deep(.q-field__control)
    border-radius: 0px
    border: 0px
    border-bottom: 2px solid var(--neutral-03)
.triangle
  width: 0
  height: 0
  border-top: 0px solid transparent
  border-right: 0px solid transparent
  border-bottom: 25px solid var(--emotional-06)
  border-left: 25px solid transparent
  position: absolute
  display: none
  right: 0
  bottom: 0
  i
    position: absolute
    right: 2px
    bottom: -25px
    color: var(--neutral-01)
    font-size: 0.8rem

.deposit-layout
  // max-width: 55rem
  width: 100%
  height: 100%
  border-radius: 12px
  background: var(--bg-11)
  padding: 20px
  gap: 10px
  flex: 1 0 0
  +phone-width
    background: transparent
    padding: 0

  .deposit-header
    @apply w-full flex justify-start items-center
    span
      margin-right: 5px
      color: $neutral01
      font-family: "Noto Sans"
      font-size: 1.2rem
      font-style: normal
      font-weight: 700
      line-height: normal
      text-transform: capitalize
  .deposit-body
    color: var(--neutral-01)
    width: 100%
    max-width: 560px
    overflow: hidden
    +iphone-width
      padding: 0
    .profile-form
      width: 100%
      display: flex
      flex-direction: column
      -webkit-box-pack: start
      justify-content: flex-start
      +iphone-width
        margin-top: 0
        padding: 0
      .form-content
        @apply w-full
        .form-item
          &.currency-item
            +phone-width
              display: inline-block
              width: calc(30% - 0.5rem)
              margin-right: 1rem
          &.type-item
            +phone-width
              display: inline-block
              width: calc(70% - 0.5rem)
          .quick-btns
            justify-content: flex-start
          .form-title
            color: var(--text-03)
            /* 次標題 */
            font-family: "Noto Sans TC"
            font-size: 14px
            font-style: normal
            font-weight: 700
            line-height: normal
          .form-methods
            display: grid
            grid-template-columns: 1fr 1fr 1fr 1fr
            gap: 0.5rem
            padding-top: 0.5rem
            width: 100%
            +pad-width
              width: 100%
            +phone-width
              @apply grid grid-cols-3
            .method-item
              display: flex
              width: 100%
              min-height: 5rem
              padding: 8px 10px
              flex-direction: column
              justify-content: center
              align-items: center
              gap: 2px
              border-radius: 8px
              border: 1px solid var(--btn-border-01)
              .method-item-img
                display: flex
                width: 35px
                height: 35px
                justify-content: center
                align-items: center
                aspect-ratio: 1/1
                border-radius: 50%
                overflow: hidden
              .method-item-title
                color: var(--btn-text-02)
                text-align: center
                font-family: "Noto Sans"
                font-size: 12px
                font-style: normal
                font-weight: 700
                line-height: normal
              +phone-width
                width: 100%
                height: auto
              &.active
                border: 2px solid var(--btn-border-02)
          .input-content
            margin: 1rem 0
            :deep(.q-field__control)
              font-family: Helvetica
              border: 0px !important
            :deep(.q-field--disabled)
              .q-field__control
                div
                  opacity: 1 !important
          .deposit-content
            width: 100%
            max-width: 400px
            height: auto
            list-style: none
            padding: 0.5rem
            li
              @apply flex justify-start my-2 p-2
              align-items: center
              background: var(--neutral-01)
              border: 2px solid var(--neutral-03)
              border-radius: 0.2rem
              color: $primany01
              i
                margin: 0 5px
                color: $emotional01
                font-size: 1.2rem
                cursor: pointer
              span
                font-family: Helvetica
                color: $neutral10
                font-size: 0.8rem
                &.title
                  font-size: 1rem
                  color: $primany01
                  margin-right: 0.5rem
          .bank-content
            margin-top: 0.5rem
            display: flex
            padding: 8px 10px
            flex-direction: column
            align-items: flex-start
            gap: 6px
            align-self: stretch
            border-radius: 12px
            border: 1px solid var(--card-border-01)
            background: var(--card-bg-01)
            li
              color: var(--card-text-02)
              font-size: 0.8rem
              font-style: normal
              font-weight: 700
              line-height: normal
              span
                font-family: "Noto Sans"
                &.title
                  font-size: 0.8rem
                  color: $primany01
                  margin-right: 0.5rem
              .q-img
                width: 1rem !important
                cursor: pointer
          .btn-content
            @apply flex-wrap gap-3
            +setFlex(flex-start)
            flex-wrap: wrap
            padding-top: 0.5rem
            gap: 1.563vw
            ::v-deep(.q-btn)
              word-break: break-word
              overflow-wrap: break-word
              hyphens: auto
              font-family: OpenSans
              text-transform: none
              display: flex
              -webkit-box-align: center
              align-items: center
              border: 2px solid var(--neutral-03) !important
              border-radius: 10px
              padding: 0px 15px
              position: relative
              width: 150px
              height: 60px
              font-size: 1rem
              background: var(--neutral-01) !important
              color: $secondary11 !important
              overflow: hidden
              &.active
                border: 2px solid $primany01 !important
                color: $primany01 !important
                .triangle
                  display: block
            +iphone-width
              flex-wrap: wrap
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
        .action-btns
          .submit-btn
            border-radius: 4px
            background: linear-gradient(90deg, var(--btn-bg-01, #F26319) 0%, var(--btn-bg-02, #D12D00) 100%)
            width: 100%

.quickBtns
  display: flex
  padding: 6px 10px
  justify-content: center
  align-items: center
  gap: 4px
  border-radius: 15px
  background: var(--tab-bg-04)
  color: var(--tab-text-01)
  font-family: "Noto Sans TC"
  &.active
    background: var(--btn-bg-01)
    color: var(--btn-text-01)


.form-promo
  @apply flex justify-between
  font-size: .75rem
  gap: .5625rem
  padding-top: 0.5rem
  flex-wrap: wrap
  width: 100%
  +phone-width
    width: 100%

.form-remark
  @apply flex flex-col gap-4 pl-[0.5rem]
  color: $neutral10
  +phone-width
    @apply w-full pl-0
  .form-remark-item
    @apply flex items-center gap-2
    +phone-width
      @apply flex-col items-start w-full
    .form-remark-title
      @apply min-w-[100px]
      +phone-width
        @apply min-w-[250px]
    .form-remark-input
      +phone-width
        @apply w-full


.deposit-input
  width: 100%
  display: flex
  ul
    color: $neutral10
    width: 20rem
    display: flex
    margin: 1rem
    align-content: center
    flex-direction: column
    font-size: 0.8rem
  :deep(.q-field__native)
    font-family: Helvetica !important
    border-radius: 0
    border-bottom: 2px solid var(--neutral-03)
  +phone-width
    :deep(.q-field--with-bottom)
      padding-bottom: 0.625rem
</style>
