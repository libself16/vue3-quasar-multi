<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" titleI18n="member.withdrawal.title" variant="setR025">
    <q-form class="withdraw-layout h5" :class="{ '!pb-[24rem]': isTelegramMiniApp }" @submit="handleWithdralSubmit">
      <div class="withdraw-container">
        <!-- currency -->
        <div v-if="showCurrencyArea" class="info-row">
          <p v-if="envInfo.withdraw_kyc_verify === 1 && !userInfo2.approval_status" class="withdrawal-kyc-container">
            <q-img :src="withdrawalKycImg" alt="withdrawal-kyc" class="withdrawal-kyc-img" contain />
            <span class="withdrawal-kyc-text">{{ $t("common.validate.withdrawalKyc") }}</span>
          </p>
          <div class="mt-2.5 info-title col-12">{{ $t("member.deposit.selectCurrency") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <q-btn
              icon="fas fa-coins"
              :label="$t(formatterCurrency(item) as string)"
              :class="{ active: withdrawState.form.currency === item }"
              v-for="item in withdrawState.supportedCurrency"
              :key="item"
              @click="handleWithdralCurrencyClick(item)"
            >
              <div class="triangle">
                <i class="fas fa-check inner-icon"></i>
              </div>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="withdraw-container">
        <!-- type -->
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.withdrawal.type") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <q-btn
              :label="typeI18n(item)"
              :class="{ active: withdrawState.usingFundType === item }"
              v-for="item in withdrawState.fundTypeList"
              :key="item"
              @click="handleWithdralFundTypeClick(item)"
            >
              <div class="triangle">
                <i class="fas fa-check inner-icon"></i>
              </div>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="withdraw-container" v-if="withdrawState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet">
        <!-- channel -->
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.withdrawal.selectMethod") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <q-btn
              :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
              v-for="(item, key) in withdrawState.usingPaymentInfoList"
              :key="key"
              @click="handleWithdralPaymentClick(item.type, item.id)"
            >
              <!-- <div :style="{ backgroundImage: `url('${item.imgUrl}')` }" class="h-full w-full" /> -->
              <img :src="item.imgUrl" class="h-full" />
              <div class="triangle">
                <i class="fas fa-check inner-icon"></i>
              </div>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="withdraw-container">
        <!-- card -->
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.withdrawal.selectBankCard") }}</div>
          <div class="flex-row my-2.5 info-content normal col-12 col-sm-10">
            <div class="card-container">
              <BankCard
                v-for="item in withdrawState.bankCards"
                :key="item.id"
                :card="item"
                :activeId="withdrawState.form.bank_id"
                :bankList="bankList"
                :gatewayFilterList="gatewayFilterList"
                @click="handleWithdralBankCardClick(item.id, item.crypto_rate)"
              />
              <AddBankCard
                v-if="envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN"
                @click="router.push({ name: 'memberBank' })"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="withdraw-container" v-if="withdrawState.uploadConfig.uploadSwitch">
        <div class="info-row">
          <div class="mt-5 info-title col-12">
            {{ $t("tableHeader.uploadDetail") }}
          </div>
          <div class="flex justify-center flex-row my-5 w-full">
            <div class="uploaded">
              <div class="item" v-for="(item, index) in withdrawState.uploadConfig.images" :key="index">
                <img @click="showBiggerImage(item.image.base64)" :src="item.image.base64" alt="" />
                <q-btn
                  color="red"
                  rounded
                  dense
                  icon="delete"
                  class="delete-btn"
                  size="sm"
                  @click="handleWithdralUploadImageDelete(index)"
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
        </div>
      </div>
      <div class="withdraw-container">
        <div class="wrap px-6 phone:px-4">
          <table>
            <tr>
              <th>{{ $t("tableHeader.title") }}</th>
              <th>{{ $t("tableHeader.content") }}</th>
            </tr>
            <tr>
              <td>{{ $t("member.withdrawal.balance") }}</td>
              <td>{{ withdrawState.form.balance }}</td>
            </tr>
            <tr>
              <td>{{ $t("member.withdrawal.auditTurnover") }}</td>
              <td>{{ withdrawState.form.remaining_turnover }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="withdraw-container">
        <!-- amount -->
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.withdrawal.withdrawalAmmount") }}</div>
          <div class="flex-col w-full info-content normal col-12 col-sm-10">
            <div class="w-full input-content withdrawal-input col-12">
              <q-input
                v-model="withdrawState.form.amount"
                :rules="[Rules.required()]"
                @keypress="Rules.validatePositiveNumber"
                inputmode="decimal"
                lazy-rules
                :placeholder="`${$t('member.deposit.withdrawAmount')}`"
                type="tel"
              />
              <ul v-show="withdrawState.form.crypto_rate">
                <li>
                  <span>{{ `${$t("member.withdrawal.rate")}: ` }}</span>
                  <span>{{ withdrawState.form.crypto_rate ? withdrawState.form.crypto_rate : " -" }}</span>
                </li>
                <li>
                  <span>{{ `${$t("member.withdrawal.receivePay")}: ` }}</span>
                  <span>{{ Number(withdrawState.form.amount) * Number(withdrawState.form.crypto_rate) }}</span>
                </li>
              </ul>
            </div>
          </div>
          <template v-if="needWithdrawalPassword">
            <div class="info-title mt-2.5 col-12">{{ $t("member.withdrawal.withdrawPassword") }}</div>
            <div class="info-content flex-col normal col-12 col-sm-10 w-full">
              <div class="input-content withdrawal-input col-12 w-full">
                <q-input
                  v-model="withdrawState.form.withdrawal_password"
                  type="password"
                  autocomplete="off"
                  :rules="[Rules.required()]"
                  lazy-rules
                  :placeholder="`${$t('member.withdrawal.withdrawPassword')}`"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="justify-center action-btns row">
        <q-btn
          text-color="white"
          color="primary"
          class="submit-btn"
          type="submit"
          :disable="envInfo.withdraw_kyc_verify === 1 && !userInfo2.approval_status"
        >
          {{ $t("common.btn.confirm") }}
        </q-btn>
      </div>
    </q-form>
    <FooterNav />
  </HeaderTitleBack>
  <div v-else class="withdraw-layout pc">
    <div class="withdraw-header">
      <img :src="memberImg('withdraw.png')" alt="withdraw" class="title-img" />
    </div>
    <p v-if="envInfo.withdraw_kyc_verify === 1 && !userInfo2.approval_status" class="withdrawal-kyc-container">
      <q-img :src="withdrawalKycImg" alt="withdrawal-kyc" class="withdrawal-kyc-img" contain />
      <span class="withdrawal-kyc-text">{{ $t("common.validate.withdrawalKyc") }}</span>
    </p>
    <div class="withdraw-body">
      <!-- <PaymentNav /> -->
      <q-form @submit="handleWithdralSubmit">
        <div class="profile-form column">
          <div class="form-content">
            <!-- currency -->
            <div v-if="showCurrencyArea" class="mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("member.deposit.selectCurrency") }}</div>
              <div class="btn-content col-12 col-sm-10">
                <q-btn
                  color="primary"
                  icon="fas fa-coins"
                  :label="$t(formatterCurrency(item) as string)"
                  :class="{ active: withdrawState.form.currency === item }"
                  v-for="item in withdrawState.supportedCurrency"
                  :key="item"
                  @click="handleWithdralCurrencyClick(item)"
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
                  :label="typeI18n(item)"
                  :class="{ active: withdrawState.usingFundType === item }"
                  v-for="item in withdrawState.fundTypeList"
                  :key="item"
                  @click="handleWithdralFundTypeClick(item)"
                >
                  <div class="triangle">
                    <i class="fas fa-check inner-icon"></i>
                  </div>
                </q-btn>
              </div>
            </div>
            <!-- channel -->
            <div class="mb-5 form-item row" v-if="!withdrawState.gateWayHidden">
              <div class="form-title label col-12">{{ $t("modal.gateway") }}</div>
              <div class="form-methods">
                <div
                  class="method-item"
                  :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
                  v-for="(item, key) in withdrawState.usingPaymentInfoList"
                  :key="key"
                  @click="handleWithdralPaymentClick(item.type, item.id)"
                >
                  <img :src="item.imgUrl" alt="" class="w-full h-full" />
                </div>
              </div>
            </div>
            <!-- bank card -->
            <div class="mb-5 form-item row">
              <div class="card-container">
                <BankCard
                  v-for="item in withdrawState.bankCards"
                  :key="item.id"
                  :card="item"
                  :activeId="withdrawState.form.bank_id"
                  :bankList="bankList"
                  :gatewayFilterList="gatewayFilterList"
                  @click="handleWithdralBankCardClick(item.id, item.crypto_rate)"
                  @updateList="getWithdrawBankCardList"
                />
                <AddBankCard
                  v-if="envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN"
                  @click="router.push({ name: 'memberBank' })"
                />
              </div>
            </div>
            <div class="mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("member.withdrawal.withdrawalAmmount") }}</div>
              <div class="input-content withdrawal-input col-12 col-sm-4">
                <q-input
                  v-model="withdrawState.form.amount"
                  :rules="[Rules.required()]"
                  @keypress="Rules.validatePositiveNumber"
                  lazy-rules
                  :placeholder="`${$t('member.deposit.withdrawAmount')}`"
                />
                <ul v-show="withdrawState.form.crypto_rate">
                  <li>
                    <span>{{ `${$t("member.withdrawal.rate")}: ` }}</span>
                    <span>{{ withdrawState.form.crypto_rate ? withdrawState.form.crypto_rate : " -" }}</span>
                  </li>
                  <li>
                    <span>{{ `${$t("member.withdrawal.receivePay")}: ` }}</span>
                    <span>{{ Number(withdrawState.form.amount) * Number(withdrawState.form.crypto_rate) }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="needWithdrawalPassword" class="form-item row mb-5">
              <div class="form-title label col-12">{{ $t("member.withdrawal.withdrawPassword") }}</div>
              <div class="input-content withdrawal-input col-12 col-sm-4">
                <q-input
                  v-model="withdrawState.form.withdrawal_password"
                  type="password"
                  autocomplete="off"
                  :rules="[Rules.required()]"
                  lazy-rules
                  :placeholder="`${$t('member.withdrawal.withdrawPassword')}`"
                />
              </div>
            </div>
            <div v-if="withdrawState.uploadConfig.uploadSwitch" class="form-item row">
              <div class="form-title label col-12">{{ $t("tableHeader.uploadDetail") }}</div>
              <div class="uploaded">
                <div class="item" v-for="(item, index) in withdrawState.uploadConfig.images" :key="index">
                  <img @click="showBiggerImage(item.image.base64)" :src="item.image.base64" alt="" />
                  <q-btn
                    color="red"
                    rounded
                    dense
                    icon="delete"
                    class="delete-btn"
                    size="sm"
                    @click="handleWithdralUploadImageDelete(index)"
                  ></q-btn>
                </div>
              </div>
            </div>
            <div v-if="withdrawState.uploadConfig.uploadSwitch" class="form-item row">
              <div class="upload-area" @click="openUploader()">
                <q-icon name="add" size="32px"></q-icon>
                <div class="warning">
                  {{ $t("member.deposit.depositDetailUploadWarning", { mb: maxSizeInMb }) }}
                </div>
              </div>
            </div>

            <div class="mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("member.withdrawal.withdrawalDetail") }}</div>
              <div class="input-content col-12 col-sm-12">
                <div class="wrap">
                  <table>
                    <tr>
                      <th>{{ $t("tableHeader.title") }}</th>
                      <th>{{ $t("tableHeader.content") }}</th>
                    </tr>
                    <tr>
                      <td>{{ $t("member.withdrawal.balance") }}</td>
                      <td>{{ withdrawState.form.balance }}</td>
                    </tr>
                    <tr>
                      <td>{{ $t("member.withdrawal.auditTurnover") }}</td>
                      <td>{{ withdrawState.form.remaining_turnover }}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>

            <div class="justify-center action-btns row">
              <q-btn
                text-color="white"
                color="primary"
                class="submit-btn"
                type="submit"
                :disable="envInfo.withdraw_kyc_verify === 1 && !userInfo2.approval_status"
              >
                {{ $t("common.btn.confirm") }}
              </q-btn>
            </div>
          </div>
        </div>
      </q-form>
    </div>
  </div>
  <!-- 給修改出款密碼用 -->
  <router-view></router-view>
  <q-dialog v-model="imageDialogOpen">
    <q-card>
      <q-card-section class="flex justify-center">
        <img :src="previewImage" class="preview-image max-w-full max-h-[80vh]" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useSiteImg } from "app/template/set_r025/hooks/useSiteImg"
import { useQuasar } from "quasar"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useBank } from "src/common/composables/useBank"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE, MEMBER_BANK_EDIT } from "src/common/utils/constants"
import { useEnvInfoStore } from "src/stores/envStore"
import { computed, onMounted, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import FooterNav from "../../components/Footer/FooterNav.vue"
import AddBankCard from "./components/AddBankCard.vue"
import BankCard from "./components/BankCard.vue"

const { memberImg, withdrawalKycImg } = useSiteImg()
const { uploadImage } = useCommon()
const router = useRouter()
const Rules = useRule()
const { envInfo } = useEnvInfoStore()
const $q = useQuasar()
const { userInfo2, userWalletMap, getUserInfo2 } = useUserInfo()
const { t } = useI18n()
const {
  gatewayFilterList,
  bankList,
  withdrawState,
  typeI18n,
  getBankList,
  getGatewayList,
  getPaymentTypeList,
  getWithdralPaymentList,
  handleWithdralCurrencyClick,
  handleWithdralFundTypeClick,
  handleWithdralPaymentClick,
  handleWithdralBankCardClick,
  handleWithdralUploadImageDelete,
  handleWithdralSubmit: originalHandleWithdralSubmit,
  needWithdrawalPassword,
  checkWithdrawalPassword,
  getWithdrawBankCardList,
  formatterCurrency
} = useBank()

const { isTelegramMiniApp, listenPreventOverflow, removeListenPreventOverflow } = useTelegram()

const showCurrencyArea = computed(() => {
  const userWalletMapLength = Object.keys(userWalletMap.value).length
  return withdrawState.supportedCurrency.length > 1 || userWalletMapLength > 1
})

const { openUploader, uploadInit, maxSizeInMb } = uploadImage()

const imageDialogOpen = ref(false)
const previewImage = ref("")

const showBiggerImage = (base64: string) => {
  imageDialogOpen.value = true
  previewImage.value = base64
}

const handleWithdralSubmit = async () => {
  withdrawState.form.images = withdrawState.uploadConfig.images.map((item) => item.image.base64)

  let res = await originalHandleWithdralSubmit()

  withdrawState.form.amount = ""
  withdrawState.form.withdrawal_password = ""
  if (res) {
    router.push({ name: "orders", query: { search_type: 2 } })
  }
}

onMounted(async () => {
  uploadInit(withdrawState.uploadConfig.images, 5) // 上傳組件初始化config
  checkWithdrawalPassword({ routeName: "memberChangeWithdrawalPassword" })
  await getUserInfo2()
  await getWithdralPaymentList()
  await getGatewayList()
  await getBankList()
  await getPaymentTypeList(withdrawState.form.currency)
  // getWithdrawBankCardList()
  listenPreventOverflow()
})

onUnmounted(() => {
  removeListenPreventOverflow()
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "src/css/form.sass"
@import "app/template/set_r025/assets/css/_variable.sass"
@import "app/template/set_r025/assets/css/button.scss"

// common style
// 上傳組件樣式
.preview-image
  width: 50vw
  height: auto
  +iphone-width
    width: 100vw
.uploaded
  @apply grid grid-cols-3 gap-4
  .item
    @apply relative
    @apply border border-black/20 rounded overflow-hidden
    width: 200px
    height: 200px
    img
      @apply w-full
    .delete-btn
      @apply p-2 absolute right-4 bottom-4
  +iphone-width
    @apply grid grid-cols-1 gap-4
    .item
      width: 300px
      height: auto
      margin: 0 auto

.upload-area
  color: $neutral-01
  border-color: $neutral-01
  margin: 1rem 0
  @apply aspect-video rounded border-dashed border break-all flex flex-col gap-2 px-4 items-center justify-center cursor-pointer
  .warning
    @apply text-sm

.input-content
  display: flex
  flex-direction: row
  font-family: Helvetica
  :deep(.q-field__control)
    border-radius: 0px
    border: 0px
    background: transparent
    color: $primany-01
    padding: 0 1.2rem
    &:before
      border-color: $neutral-01
    .q-field__native
      color: $neutral-01
      &:placeholder
        color: $neutral-02
      &:focus
        color: $neutral-01
  ul
    color: $text-dark-color

.wrap
  overflow: hidden
  box-shadow: 0 0 20px rgba($box-shadow-dark-color, 0.35)
  +iphone-width
    padding: 1rem
  table
    font-family: 'Oswald', sans-serif
    border-collapse: collapse
    width: 100%
    th
      font-family: OpenSans
      background-color: $primary-color !important
      border: 2px solid $primary-color
      color: $text-light-color
      width: 25vw
      height: 50px
      +iphone-width
        font-family: Helvetica
        height: 8vw
    td
      font-family: OpenSans
      border: 2px solid $primary-color !important
      color: $neutral-01 !important
      width: 25vw
      height: 50px
      text-align: center
      transition: all 0.3s ease-in-out
      +iphone-width
        font-family: Helvetica
        height: 8vw

    tr
      border-bottom: 1px solid $border-charcoal-gray-dark-color
      &:last-of-type
        border-bottom: none
      td
        &:first-child
          color: rgba($text-turquoise-blue-color, 0.6)
          transition: all 0.3s ease-in-out
  :deep(.q-field__control)
    border-radius: 0px

.triangle
  width: 0
  height: 0
  border-top: 0px solid transparent
  border-right: 0px solid transparent
  border-bottom: 25px solid $primany-01
  border-left: 25px solid transparent
  position: absolute
  display: none
  right: 0
  bottom: 0
  i
    position: absolute
    right: 2px
    bottom: -25px
    color: $text-light-color
    font-size: 0.8rem

.card-container
  @apply py-4 px-0
  @apply grid grid-cols-2 gap-5
  color: $text-charcoal-gray-color
  width: 100%
  +pc-width
    @apply grid-cols-2 gap-5 px-2
  +iphone-width
    @apply grid-cols-1 gap-6
    width: 100%
    height: auto
    margin: 0 auto
    padding: 0
    +hideScrollBar
.bg-quick
  color: $text-light-color
  padding: .5rem
  border: 1px solid rgba($border-light-color, 0.15)
  width: 3.4375rem
  border-radius: .5rem
  +pad-width
    width: 17%

// h5 mode
.withdraw-layout.h5
  width: 100%
  display: inline-grid
  row-gap: 1rem
  overflow: hidden
  background: $background-background
  padding-bottom: 6rem
  @include phone-width
    row-gap: 0.5rem
  .action-btns
    @apply mt-2 mb-4
    .submit-btn
      font-family: serif
      width: 100%
  .withdraw-container
    width: 100%
    list-style: none
    background: $secondary-card
    box-sizing: border-box
    .info-row
      @apply px-6 phone:px-4
      display: flex
      align-items: center
      justify-content: space-between
      flex-flow: row
      flex-flow: wrap
      flex: 1 1 0%
      font-size: 1.75rem
      line-height: 2.5rem
      color: $neutral-01
      +phone-width
        min-height: 5rem
        height: auto
        font-size: 1rem
        line-height: 1.375rem
        &.read-only
          min-height: 5rem
      .info-title
        font-family: Helvetica
        width: 100%
        text-transform: capitalize
        border-bottom: 1px solid $functional-line
        padding-bottom: 0.8rem
        +phone-width
          padding-bottom: 0.4rem
      .info-content
        @apply flex items-center flex-wrap gap-6 phone:gap-4
        font-family: Helvetica
        color: $neutral-01
        width: 100%
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        &.normal
          :deep(.q-btn)
            text-transform: none
            display: flex
            -webkit-box-align: center
            align-items: center
            padding: 0px 15px
            position: relative
            width: calc(33.33% - 0.2rem)
            height: 20px
            font-size: 1rem
        &.currency
          :deep(.q-btn)
            @apply whitespace-normal break-all
            @apply w-[calc((100%_-_1.5rem)_/_2)] phone:w-[calc((100%_-_1rem)_/_2)] h-[75px]
            @apply flex items-center
            @apply relative p-0 rounded-[10px] overflow-hidden
            @apply text-base normal-case
            text-transform: none
            -webkit-box-align: center
            border: 2px solid $functional-line !important
            color: $neutral-01 !important
            &.active
              border: 2px solid $primany-01 !important
              color: $neutral-01 !important
              .triangle
                display: block
            .q-btn__content
              width: 100%
              height: 100%
              div
                background-repeat: no-repeat
                background-position: center
                background-size: 100%
        .bank-content
          width: 100%
          max-width: 400px
          height: auto
          padding: 10px
          list-style: none
          li
            @apply flex justify-start my-2 p-2
            align-items: center
            background: $background-light-color
            border: 2px solid $border-pale-gray-color
            border-radius: 0.2rem
            color: $text-dark-color
            i
              margin: 0 5px
              color: $text-danger-tertiary-color
              font-size: 1.2rem
              cursor: pointer
              padding: 0
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
      background-color: $background-pale-gray-color
      @include phone-width
        margin-left: 14px
        margin-right: 14px

.edit-dialog
  .dialog-card
    width: 100%
    height: 500px
    background-color: $background-light-color

    .dialog-header
      height: 5.5rem
      font-size: 2rem
      padding: 1.25rem 1.75rem
      border-bottom: 1px solid rgba($border-pale-gray-color, 0.5)
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
        color: $text-sky-gray-color
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
          color: $text-pale-gray-color !important
        .dialog-form-title
          font-weight: 400
          line-height: 2.87
          letter-spacing: 0.00938em
          position: relative
          display: block
          transform-origin: left top
          text-overflow: ellipsis
          max-width: 100%
          font-family: "PingFang SC"
          color: $text-charcoal-gray-color-light
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
          color: $text-charcoal-gray-color-light
          font-size: 1.75rem
          padding: 0px 1.75rem
          display: flex
          align-items: center
          justify-content: space-between
          .check-img
            display: none
          &.active
            color: $text-charcoal-gray-color
            font-weight: bold
            background: rgba($background-pale-blue-color, 0.5)
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
.withdraw-layout.pc
  width: 55rem
  height: 100%
  padding: 4.375rem 3.125rem 1.875rem
  .withdraw-header
    @apply w-full flex justify-between items-center
    .title-img
      width: 12rem
      height: auto
  .withdraw-body
    color: $text-light-color
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
      border: 2px solid $functional-line
      border-radius: 14px
      +iphone-width
        margin-top: 0
        padding: 0
        background: $background-midnight-gray-color
      .form-content
        width: 100%
        +iphone-width
          width: 100%
          margin: 1rem auto
          padding: 1rem 1.5rem
          background: $background-eclipse-gray-color
          border-radius: .5rem
        .form-item
          .form-title
            @apply p-0 my-4
            font-family: OpenSans
            font-size: 1.2rem
            font-weight: 590
            color: $neutral-01
          .form-methods
            @apply flex flex-wrap justify-start gap-1
            padding-left: 0.5rem
            width: 100%
            +pad-width
              width: 100%
            +phone-width
              @apply grid-cols-3
            .method-item
              @apply relative w-auto flex justify-center items-center rounded-md p-0 cursor-pointer
              height: 90px
              display: flex
              align-items: center
              justify-content: center
              // max-width: 45%
              margin-right: .5rem
              padding: 0.2rem
              border: 1px solid $primany-01
              +pad-width
                height: 4rem
                max-width: fit-content
              +iphone-width
                width: 100%
                height: auto
              &.active
              background: $primany-01
              color: $text-light-color
          .input-content
            font-family: OpenSans
            :deep(.q-field--disabled)
              .q-field__control
                div
                  opacity: 1 !important
          .payment-form
            width: 100%
          .bank-content
            width: 100%
            max-width: 400px
            height: auto
            padding: 10px
            list-style: none
            li
              @apply flex justify-start my-2 p-2
              align-items: center
              background: $functional-input
              border-radius: 0.2rem
              color: $functional-btn-text-secondary
              i
                margin: 0 5px
                color: $primany-01
                font-size: 1.2rem
                cursor: pointer
          .btn-content
            @apply gap-3
            +setFlex(flex-start)
            flex-wrap: wrap
            :deep(.q-btn)
              font-family: OpenSans
              text-transform: none
              display: flex
              -webkit-box-align: center
              align-items: center
              border: 2px solid $functional-line !important
              border-radius: 10px
              padding: 0px 15px
              position: relative
              width: 150px
              height: 60px
              font-size: 1rem
              background: $secondary-card !important
              color: $neutral-01 !important
              overflow: hidden
              &.active
                border: 2px solid $primary-color !important
                color: $primary-color !important
                .triangle
                  display: block
        .action-btns
          .submit-btn
            font-family: Arial
            width: 100%

.withdrawal-input
  width: 100%
  ul
    display: flex
    margin: 1rem
    align-content: center
    flex-direction: column
    font-size: 0.8rem
  :deep(.q-field__native)
    font-family: Helvetica !important
    border-radius: 0
.withdrawal-kyc-container
  @apply flex items-center mt-2 p-[.5rem] rounded-[.25rem] max-w-[28.75rem]
  background: $semantic-warning-bg
  color: $semantic-warning
  .withdrawal-kyc-img
    @apply w-4 h-4 mr-2 flex-shrink-0
//common styles
.action-btns
  @apply px-6 phone:px-4
</style>
