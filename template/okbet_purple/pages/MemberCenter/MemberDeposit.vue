<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" titleI18n="member.deposit.title" variant="purple-dark">
    <q-form class="deposit-layout h5" @submit="handleDepositSubmit">
      <div v-if="showCurrencyArea" class="deposit-container">
        <!-- currency -->
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.deposit.selectCurrency") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <q-btn
              icon="fas fa-coins"
              :label="$t(item as string)"
              :class="{ active: depositState.form.currency === item }"
              v-for="item in depositState.supportedCurrency"
              :key="item"
              @click="handleDepositCurrencyClick(item)"
            >
              <div class="triangle">
                <i class="fas fa-check inner-icon"></i>
              </div>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="deposit-container">
        <!-- type -->
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.deposit.type") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <q-btn
              :label="$t(item as string)"
              :class="{ active: depositState.usingFundType === item }"
              v-for="item in depositState.fundTypeList"
              :key="item"
              @click="handleDepositFundTypeClick(item)"
            >
              <div class="triangle">
                <i class="fas fa-check inner-icon"></i>
              </div>
            </q-btn>
          </div>
        </div>
      </div>
      <!-- 支付方式 -->
      <div class="deposit-container">
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.deposit.selectMethod") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <q-btn
              :class="{ active: String(item.id) === `${depositState.form.payment_gateway_id}` }"
              v-for="(item, key) in depositState.usingPaymentInfoList"
              :key="key"
              @click="handleDepositPaymentClick(item.id)"
            >
              <div :style="{ backgroundImage: `url('${item.imgUrl}')` }" class="h-full w-full" />
            </q-btn>
          </div>
        </div>
      </div>
      <div class="deposit-container">
        <!-- bank account -->
        <div class="info-row read-only">
          <p class="mt-2.5 info-title">{{ $t("member.deposit.bankAccount") }}</p>
          <div class="flex-col w-full info-content normal col-12 col-sm-10">
            <div class="w-full input-content col-12">
              <ul class="bank-content col-12">
                <li class="w-full flex items-center !justify-between">
                  <span>{{ depositState.paymentDetail.bank_name }}</span>
                  <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.bank_name)" />
                </li>
                <li class="w-full flex items-center !justify-between">
                  <span>{{ depositState.paymentDetail.bank_account }}</span>
                  <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.bank_account)" />
                </li>
                <img
                  v-if="depositState.paymentDetail.qrcode_image_id !== 0"
                  :src="depositState.paymentDetail.imgUrl"
                  alt=""
                  class="w-full md:w-64"
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="deposit-container">
        <!-- fee -->
        <div v-if="hasFee(depositState.paymentDetail)" class="info-row read-only">
          <p class="info-title mt-2.5">
            {{ $t("member.deposit.handlingFee") }}
            ：
            <span>
              {{
                depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
                  ? depositState.paymentDetail.fee_amount
                  : `${depositState.paymentDetail.fee_rate}%`
              }}
            </span>
          </p>
        </div>
      </div>
      <div class="deposit-container">
        <!-- amount -->
        <div class="info-row">
          <div class="info-title mt-2.5 col-12">{{ $t("member.deposit.depositAmount") }}</div>
          <div class="info-content flex-col normal col-12 col-sm-10 w-full">
            <div class="input-content col-12 w-full">
              <q-input
                v-model="depositState.form.amount"
                :rules="[Rules.required()]"
                @keypress="Rules.validatePositiveNumber"
                inputmode="decimal"
                lazy-rules
                :placeholder="`${depositState.paymentDetail.deposit_min} ~ ${depositState.paymentDetail.deposit_max}`"
              />
            </div>
            <div class="input-content mb-2.5 col-12 w-full">
              <div class="flex justify-start gap-1">
                <q-btn
                  v-for="item in depositState.quickBtns"
                  :key="item"
                  color="quick"
                  text-color="black"
                  @click="handleDepositQuickBtnClick(item)"
                >
                  {{ item }}
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 活動 -->
      <div v-if="depositState.promotion_list.length" class="deposit-container">
        <!-- type -->
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">
            {{ $t("member.deposit.depositReward") }}
          </div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
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
        </div>
      </div>
      <div class="justify-center action-btns row">
        <q-btn :label="$t('common.btn.submit')" class="submit-btn text-capitalize" type="submit" />
      </div>
    </q-form>
    <FooterNav />
  </HeaderTitleBack>
  <div v-else class="deposit-layout pc">
    <div class="deposit-header">
      <p class="deposit-title">{{ $t("member.deposit.title") }}</p>
    </div>
    <div class="deposit-body">
      <!-- <PaymentNav /> -->
      <q-form @submit="handleDepositSubmit">
        <div class="profile-form column">
          <div class="form-content">
            <!-- currency -->
            <div class="mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("member.deposit.selectCurrency") }}</div>
              <div class="btn-content col-12 col-sm-10">
                <q-btn
                  color="primary"
                  icon="fas fa-coins"
                  :label="$t(item as string)"
                  :class="{ active: depositState.form.currency === item }"
                  v-for="item in depositState.supportedCurrency"
                  :key="item"
                  @click="handleDepositCurrencyClick(item)"
                >
                  <div class="triangle">
                    <i class="fas fa-check inner-icon"></i>
                  </div>
                </q-btn>
              </div>
            </div>
            <!-- type -->
            <div class="mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("member.deposit.type") }}</div>
              <div class="btn-content col-12 col-sm-10">
                <q-btn
                  color="primary"
                  :label="$t(item as string)"
                  :class="{ active: depositState.usingFundType === item }"
                  v-for="item in depositState.fundTypeList"
                  :key="item"
                  @click="handleDepositFundTypeClick(item)"
                >
                  <div class="triangle">
                    <i class="fas fa-check inner-icon"></i>
                  </div>
                </q-btn>
              </div>
            </div>
            <!-- 支付方式 -->
            <div class="mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("member.deposit.selectMethod") }}</div>
              <div class="form-methods">
                <div
                  v-for="(item, key) in depositState.usingPaymentInfoList"
                  :key="key"
                  class="method-item"
                  :class="{ active: String(item.id) === `${depositState.form.payment_gateway_id}` }"
                  @click="handleDepositPaymentClick(item.id)"
                >
                  <img :src="item.imgUrl" alt="" class="w-full h-full" />
                </div>
              </div>
            </div>
            <!-- bank account -->
            <div class="form-item row">
              <div class="mr-16 col-12 col-sm-12">
                <div class="form-title label col-12">{{ $t("member.deposit.bankAccount") }}</div>
                <ul class="bank-content col-12">
                  <li class="w-full flex items-center !justify-between">
                    <span>{{ depositState.paymentDetail.bank_name }}</span>
                    <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.bank_name)" />
                  </li>
                  <li class="w-full flex items-center !justify-between">
                    <span>{{ depositState.paymentDetail.bank_account }}</span>
                    <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.bank_account)" />
                  </li>
                  <img
                    v-if="depositState.paymentDetail.qrcode_image_id !== 0"
                    :src="depositState.paymentDetail.imgUrl"
                    alt=""
                    class="w-full md:w-64"
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
            <!-- fullName -->
            <div class="form-item row">
              <div class="row col-12 col-sm-4">
                <div class="form-title label col-12">{{ $t("member.deposit.depositAmount") }}</div>
                <div class="input-content col-12">
                  <q-input
                    v-model="depositState.form.amount"
                    :rules="[Rules.required()]"
                    @keypress="Rules.validatePositiveNumber"
                    lazy-rules
                    :placeholder="`${depositState.paymentDetail.deposit_min} ~ ${depositState.paymentDetail.deposit_max}`"
                  />
                </div>
              </div>
            </div>
            <div class="form-item">
              <div class="flex flex-wrap justify-start gap-3">
                <q-btn
                  v-for="item in depositState.quickBtns"
                  :key="item"
                  color="quick"
                  text-color="black"
                  class="quickBtns"
                  @click="handleDepositQuickBtnClick(item)"
                >
                  {{ item }}
                </q-btn>
              </div>
            </div>

            <!-- 活動 -->
            <div v-if="depositState.promotion_list.length" class="mb-5 form-item row">
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

            <div class="justify-center action-btns row">
              <q-btn :label="$t('common.btn.confirm')" class="submit-btn text-capitalize" type="submit" />
            </div>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import { useQuasar } from "quasar"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useBank } from "src/common/composables/useBank"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { usePayment } from "src/common/hooks/usePayment"
import { useRule } from "src/common/hooks/useRule"
import { FEE_TYPE, GENDER, PROFILE_DETAIL_EDIT_TYPE } from "src/common/utils/constants"
import { computed, onMounted, reactive, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import FooterNav from "../../components/Footer/FooterNav.vue"
import PromotionList from "./components/PromotionList.vue"
import { useDebounceFn } from "@vueuse/core"

const { userInfoForm, resetUserInfoForm, setUserInfo, qDateAdultOptions } = useUserInfo()
const { userWalletMap } = useUserInfo()
const { copyMessage, genEnumToDropdown } = useCommon()
const $q = useQuasar()
const { t } = useI18n()
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
  handleDepositSubmit: originalHandleDepositSubmit
} = useBank()
const router = useRouter()
const { hasFee } = usePayment()

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

  await originalHandleDepositSubmit()
  depositState.form.amount = ""
  router.push({ name: "orders" })
}

const dialog = reactive({
  show: false,
  type: PROFILE_DETAIL_EDIT_TYPE.Enums.RealName
})

async function handleH5Submit() {
  await setUserInfo()
  dialog.show = false
}

function handleDialogOpen(type: PROFILE_DETAIL_EDIT_TYPE.Enums) {
  dialog.show = true
  dialog.type = type
}

function closeDialog() {
  dialog.show = false
  resetUserInfoForm()
}

const genderDropdown = computed(() =>
  genEnumToDropdown(GENDER.Enums, GENDER.I18nKeys).map((e) => {
    e.label = t(e.label)
    return e
  })
)

function setGender(gender: GENDER.Enums) {
  userInfoForm.gender = gender
}

onMounted(async () => {
  $q.loading.show()
  await getDepositPaymentList()
  await getPromotionList()
  $q.loading.hide()
})

// 監聽 amount
const debounceFn = useDebounceFn(() => getPromotionList(), 500)
watch(
  () => depositState.form.amount,
  () => debounceFn()
)
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import "app/template/okbet_purple/assets/css/_variable.sass"
@import "app/template/okbet_purple/assets/css/button.scss"
@import "app/template/okbet_purple/assets/css/member.scss"

// common style
.input-content
  ::v-deep(.q-field__control)
    border-radius: 0px
    border: 0
    border-bottom: 2px solid $border-dark
    background: transparent
  ::v-deep(.q-field__native)
    color: $text-light-secondary !important
.triangle
  width: 0
  height: 0
  border-top: 0px solid transparent
  border-right: 0px solid transparent
  border-bottom: 25px solid $bg-secondary
  border-left: 25px solid transparent
  position: absolute
  display: none
  right: 0
  bottom: 0
  i
    position: absolute
    right: 2px
    bottom: -25px
    color: #fff
    font-size: 0.8rem

.bg-quick
  color: $text-light-secondary !important
  padding: .5rem
  border: 1px solid $border-dark-secondary
  background: $border-dark-secondary
  box-shadow: 0px 2px 6px 0px #00000099
  min-width: 3.75rem !important
  width: auto !important
  border-radius: .5rem

// h5 mode
.deposit-layout.h5
  width: 100%
  display: inline-grid
  row-gap: 1rem
  overflow: hidden
  background-color: $bg-dark
  padding-bottom: 6rem
  @include phone-width
    row-gap: 0.5rem
  .action-btns
    margin: 0.5rem 0.5rem 1rem 0.5rem
    .submit-btn
      @apply w-full
      color: $text-light-secondary
      background-color: $bg-secondary
  .deposit-container
    width: 100%
    list-style: none
    background: $bg-dark
    .info-row
      display: flex
      align-items: center
      justify-content: space-between
      flex-flow: row
      padding-left: 1.875rem
      padding-right: 1.25rem
      flex-flow: wrap
      flex: 1 1 0%
      font-size: 1.75rem
      line-height: 2.5rem
      color: $text-light-secondary
      +phone-width
        padding-left: 0.6875rem
        padding-right: 0.6875rem
        min-height: 5rem
        height: auto
        font-size: 1rem
        line-height: 1.375rem
        width: 100vw
        &.read-only
          min-height: 5rem
      .info-title
        font-family: Helvetica
        width: 100%
        text-transform: capitalize
        border-bottom: 1px solid rgb(227, 232, 238)
        padding-bottom: 0.8rem
        +phone-width
          padding-bottom: 0.4rem
      .info-content
        font-family: Helvetica
        color: rgb(167, 178, 196)
        width: 100%
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        display: flex
        flex-wrap: wrap
        align-items: center
        gap: 1.563vw
        &.normal
          ::v-deep(.q-btn)
            text-transform: none
            display: flex
            -webkit-box-align: center
            align-items: center
            padding: 0px 10px
            position: relative
            width: calc(33.33% - 0.2rem)
            height: 20px
            font-size: 1rem
        &.currency
          ::v-deep(.q-btn)
            text-transform: none
            display: flex
            -webkit-box-align: center
            align-items: center
            border: 2px solid $border-dark !important
            border-radius: 10px
            padding: 0
            position: relative
            width: 110px
            height: 75px
            font-size: 1rem
            color: $text-light-secondary !important
            overflow: hidden
            &.active
              border: 2px solid $bg-secondary !important
              color: $text-light-secondary !important
              .triangle
                display: block
            .q-btn__content
              width: 100%
              height: 100%
              div
                background-repeat: no-repeat
                background-position: center
                background-size: cover
        .bank-content
          width: 100%
          max-width: 400px
          height: auto
          padding: 0.625rem 0
          list-style: none
          li
            @apply flex justify-start my-2 p-2
            align-items: center
            border: 2px solid $border-dark
            border-radius: 0.2rem
            color: $text-light-secondary
            i
              margin: 0 5px
              color: $bg-secondary
              font-size: 1.2rem
              cursor: pointer
              padding: 0
          +phone-width
            padding: 0.5rem 0
        .q-icon
          margin-left: 1.25rem
          margin-right: 0.625rem
          @include phone-width
            margin-left: 0.6875rem
            margin-right: 0.375rem
            +setFlex(flex-start)
            padding-top: 1rem
            padding-left: .75rem
    .q-separator
      margin-left: 1.75rem
      margin-right: 1.75rem
      height: 1px
      background-color: $border-dark
      @include phone-width
        margin-left: 14px
        margin-right: 14px

.edit-dialog
  .dialog-card
    width: 100%
    height: 500px
    background-color: rgb(255, 255, 255)

    .dialog-header
      height: 5.5rem
      font-size: 2rem
      padding: 1.25rem 1.75rem
      border-bottom: 1px solid rgba(227, 232, 238, 0.5)
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
        color: rgb(167, 178, 196)
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
          color: #e5e7eb !important
        .dialog-form-title
          font-weight: 400
          line-height: 2.87
          letter-spacing: 0.00938em
          position: relative
          display: block
          transform-origin: left top
          text-overflow: ellipsis
          max-width: 100%
          color: rgb(83, 93, 118)
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
          color: rgb(83, 93, 118)
          font-size: 1.75rem
          padding: 0px 1.75rem
          display: flex
          align-items: center
          justify-content: space-between
          .check-img
            display: none
          &.active
            color: rgb(65, 70, 85)
            font-weight: bold
            background: rgba(232, 239, 253, 0.5)
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

// pc mode
.deposit-layout.pc
  width: 55rem
  height: 100%
  padding: 4.375rem 3.125rem 1.875rem
  .deposit-header
    @apply w-full flex justify-between items-center
    .deposit-title
      @apply text-[3.125rem] font-extrabold
      color: $text-light-secondary
      text-transform: capitalize
  .deposit-body
    max-width: 62.5rem
    margin-top: 1.5625rem
    overflow: hidden
    +iphone-width
      padding: 0
    .profile-form
      width: 100%
      display: flex
      flex-direction: column
      -webkit-box-pack: start
      justify-content: flex-start
      padding: 30px
      border: 2px solid $border-dark
      border-radius: 14px
      +iphone-width
        margin-top: 0
        padding: 0
        background: #24262B
      .form-content
        +iphone-width
          width: 100%
          margin: 1rem auto
          padding: 1rem 1.5rem
          background: #1C1E22
          border-radius: .5rem
        .form-item
          .form-title
            font-family: OpenSans
            font-size: 1.2rem
            font-weight: 590
            color: $text-light-secondary
          .form-methods
            @apply flex flex-wrap justify-start gap-1
            width: 100%
            +pad-width
              width: 100%
            +phone-width
              @apply grid-cols-3
            .method-item
              @apply relative w-auto flex justify-center items-center rounded-lg p-0 cursor-pointer
              height: 2.8125rem
              max-width: 45%
              margin: .3125rem
              padding: 0.2rem
              border: 1px solid $border-dark
              +pad-width
                height: 4rem
                max-width: fit-content
              +iphone-width
                width: 100%
                height: auto
              &.active
                background: linear-gradient(to bottom, rgb(153, 106, 255) 0%, rgb(114, 56, 204) 33%, rgb(82, 40, 153) 100%)
                color: $text-light-secondary
          .input-content
            margin-top: .5rem
            padding-top: 1rem
            padding-left: 0.75rem
            :deep(.q-field--disabled)
              .q-field__control
                div
                  opacity: 1 !important
          .bank-content
            width: 100%
            max-width: 400px
            height: auto
            list-style: none
            li
              @apply flex justify-start my-2 p-2
              align-items: center
              background: #030A13
              border: 2px solid #8A8A8A
              border-radius: 0.2rem
              color: $text-light-secondary
              i
                margin: 0 5px
                color: $bg-secondary
                font-size: 1.2rem
                cursor: pointer
          .btn-content
            +setFlex(flex-start)
            flex-wrap: wrap
            padding-top: 1rem
            padding-left: .75rem
            gap: 1.563vw
            ::v-deep(.q-btn)
              font-family: OpenSans
              text-transform: none
              display: flex
              -webkit-box-align: center
              align-items: center
              border-radius: 10px
              padding: 0px 15px
              position: relative
              width: 150px
              height: 60px
              font-size: 1rem
              overflow: hidden
              background: $border-dark-secondary !important
              color: $text-light-secondary !important
              border: 2px solid $border-dark !important
              &.active
                border: 2px solid $bg-secondary !important
                color: $bg-secondary !important
                .triangle
                  display: block
            +iphone-width
              flex-wrap: wrap
              padding-top: 1.125rem
              padding-left: .625rem
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
            @apply w-full
            color: $text-light-secondary
            background-color: $bg-secondary

.form-promo
  @apply flex justify-between
  font-size: .75rem
  gap: .5625rem
  flex-wrap: wrap
  width: 85%
  +phone-width
   width: 100%
</style>
