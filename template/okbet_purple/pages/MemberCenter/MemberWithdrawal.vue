<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" titleI18n="member.withdrawal.title" variant="purple-dark">
    <q-form class="withdraw-layout h5" @submit="handleWithdralSubmit">
      <div class="withdraw-container">
        <!-- currency -->
        <div v-if="showCurrencyArea" class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.deposit.selectCurrency") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <q-btn
              icon="fas fa-coins"
              :label="$t(item as string)"
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
              :label="$t(item as string)"
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
              <div :style="{ backgroundImage: `url('${item.imgUrl}')` }" class="h-full w-full" />
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
                @click="handleWithdralBankCardClick(item.id)"
              />
              <AddBankCard @click="router.push({ name: 'memberBank' })" />
            </div>
          </div>
        </div>
      </div>
      <div class="withdraw-container">
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
              />
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
        <q-btn text-color="white" label="Confirm" class="submit-btn" type="submit" />
      </div>
    </q-form>
    <FooterNav />
  </HeaderTitleBack>
  <div v-else class="withdraw-layout pc">
    <div class="withdraw-header">
      <p class="withdraw-title">{{ $t("member.withdrawal.title") }}</p>
    </div>
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
                  icon="fas fa-coins"
                  :label="$t(item as string)"
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
                  :label="$t(item as string)"
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
              <div class="form-title label col-12">{{ $t("member.bank.withdrawalChannel") }}</div>
              <div class="form-methods">
                <div
                  v-for="(item, key) in withdrawState.usingPaymentInfoList"
                  :key="key"
                  class="method-item"
                  :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
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
                  @click="handleWithdralBankCardClick(item.id)"
                  @updateList="getWithdrawBankCardList"
                />
                <AddBankCard @click="router.push({ name: 'memberBank' })" />
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
              <q-btn text-color="white" label="Confirm" class="submit-btn" type="submit" />
            </div>
          </div>
        </div>
      </q-form>
    </div>
  </div>
  <!-- 給修改出款密碼用 -->
  <router-view></router-view>
</template>
<script lang="ts" setup>
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useBank } from "src/common/composables/useBank"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE } from "src/common/utils/constants"
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"
import AddBankCard from "./components/AddBankCard.vue"
import BankCard from "./components/BankCard.vue"
import FooterNav from "../../components/Footer/FooterNav.vue"

const router = useRouter()
const Rules = useRule()
const { userWalletMap } = useUserInfo()
const {
  withdrawState,
  getBankCardList,
  getWithdralPaymentList,
  handleWithdralCurrencyClick,
  handleWithdralFundTypeClick,
  handleWithdralPaymentClick,
  handleWithdralBankCardClick,
  handleWithdralSubmit: originalHandleWithdralSubmit,
  needWithdrawalPassword,
  checkWithdrawalPassword,
  getWithdrawBankCardList
} = useBank()

const showCurrencyArea = computed(() => {
  const userWalletMapLength = Object.keys(userWalletMap.value).length
  return withdrawState.supportedCurrency.length > 1 || userWalletMapLength > 1
})

const handleWithdralSubmit = async () => {
  const res = await originalHandleWithdralSubmit()
  if (res) {
    withdrawState.form.amount = ""
    withdrawState.form.withdrawal_password = ""
  }
}

onMounted(() => {
  checkWithdrawalPassword({ routeName: "memberChangeWithdrawalPassword" })
  getWithdralPaymentList()
  getBankCardList()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import "app/template/okbet_purple/assets/css/_variable.sass"

.input-content
  ::v-deep(.q-field__control)
    border-radius: 0px
    border: 0px
    border-bottom: 2px solid $border-dark
    background: transparent
    padding: 0 1.2rem

  ::v-deep(.q-field__native)
    color: $text-light-secondary !important

.wrap
  overflow: hidden
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.35)
  +iphone-width
    padding: 1rem
  table
    border-collapse: collapse
    width: 100%
    th
      background-color: $bg-secondary !important
      border: 2px solid $bg-secondary
      color: $text-light-secondary
      width: 25vw
      height: 50px
      +iphone-width
        font-family: Helvetica
        height: 8vw
    td
      background-color: $bg-dark-secondary
      border: 2px solid $bg-secondary !important
      color: $text-light-secondary !important
      width: 25vw
      height: 50px
      text-align: center
      transition: all 0.3s ease-in-out
      +iphone-width
        font-family: Helvetica
        height: 8vw

    tr
      border-bottom: 1px solid #2a2a2a
      &:last-of-type
        border-bottom: none
      td
        &:first-child
          color: $bg-secondary
          transition: all 0.3s ease-in-out
  ::v-deep(.q-field__control)
    border-radius: 0px

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

.card-container
  color: $text-light-secondary
  width: 100%
  padding: 1rem 0.5rem
  @apply grid grid-cols-2 gap-5
  +pc-width
    @apply grid-cols-2 gap-5
  +iphone-width
    @apply grid-cols-1 gap-6
    width: 100%
    height: auto
    margin: 0 auto
    padding: 0
    +hideScrollBar
.bg-quick
  color: $text-light-secondary
  padding: .5rem
  border: 1px solid $border-dark-secondary
  background: $border-dark-secondary
  box-shadow: 0px 2px 6px 0px #00000099
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
  .withdraw-container
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
      height: 6.25rem
      flex-flow: wrap
      flex: 1 1 0%
      font-size: 1.75rem
      line-height: 2.5rem
      color: $text-light-secondary
      +phone-width
        padding-left: 1rem
        padding-right: 0.6875rem
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
        border-bottom: 1px solid $text-light-secondary
        padding-bottom: 0.8rem
        +phone-width
          padding-bottom: 0.4rem
      .info-content
        font-family: Helvetica
        color: $text-light-secondary
        width: 100%
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        max-width: 400px
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
            padding: 0px 15px
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
            border: 2px solid $border-dark-secondary !important
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
              color: $bg-secondary !important
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
            border: 2px solid $border-dark-secondary
            border-radius: 0.2rem
            color: $text-light-secondary
            i
              margin: 0 5px
              color: #d50c14
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
      background-color: $border-dark-secondary
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
          font-family: "PingFang SC"
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
.withdraw-layout.pc
  width: 55rem
  height: 100%
  padding: 4.375rem 3.125rem 1.875rem
  .withdraw-header
    @apply w-full flex justify-between items-center
    .withdraw-title
      @apply text-[3.125rem] font-extrabold
      color: $text-light-secondary
      text-transform: capitalize
  .withdraw-body
    color: white
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
            font-size: 1.2rem
            font-weight: 590
            color: $text-light-secondary
          .input-content
            padding-top: 1rem
            padding-left: 0.75rem
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
              background: $border-dark-secondary
              border: 1px solid $border-dark
              border-radius: 0.2rem
              color: $text-light-secondary
              i
                margin: 0 5px
                color: $bg-secondary
                font-size: 1.2rem
                cursor: pointer
          .btn-content
            +setFlex(flex-start)
            padding-top: 1rem
            padding-left: .75rem
            gap: 1.563vw
            ::v-deep(.q-btn)
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
        .action-btns
          .submit-btn
            @apply w-full
            color: $text-light-secondary
            background-color: $bg-secondary

.withdrawal-input
  :deep(.q-field__native)
    font-family: Helvetica !important
    border-radius: 0
    border-bottom: 2px solid $border-dark
</style>
