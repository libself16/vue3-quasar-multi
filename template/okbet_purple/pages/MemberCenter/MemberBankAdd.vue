<template>
  <HeaderTitleBack
    v-if="$q.platform.is.mobile"
    :titleI18n="bankCardId ? 'common.btn.edit' : 'common.btn.add'"
    variant="purple"
  >
    <q-form class="bank-add-layout h5" @submit="handleSubmit">
      <div class="withdraw-container">
        <!-- currency -->
        <div class="info-row">
          <div class="info-title mt-5 col-12">{{ $t("member.deposit.selectCurrency") }}</div>
          <div class="info-content currency flex-row col-12 my-5 col-sm-10">
            <q-btn
              icon="fas fa-coins"
              :label="$t(item.code as string)"
              :class="{ active: bankCardState.form.currency === item.code }"
              v-for="item in availCurrencyList"
              :key="item.code"
              @click="handleBankCardCurrencyClick(item.code)"
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
          <div class="info-title mt-5 col-12">{{ $t("member.withdrawal.type") }}</div>
          <div class="info-content currency flex-row col-12 my-5 col-sm-10">
            <q-btn
              :label="$t(item.label as string)"
              :class="{ active: bankCardState.form.payment_type_id === +item.value }"
              v-for="item in paymentTypeList"
              :key="item.value"
              @click="handleBankCardPaymentTypeClick(item.value)"
            >
              <div class="triangle">
                <i class="fas fa-check inner-icon"></i>
              </div>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="withdraw-container">
        <div class="form-item row input-row p-5">
          <!-- bank branch -->
          <div class="row col-12 col-sm-5">
            <div class="form-title label col-12">{{ $t("member.bank.bankName") }}</div>
            <div class="input-content col-12">
              <q-select
                v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet"
                v-model="bankCardState.form.bank_id"
                :options="bankList"
                emit-value
                map-options
                bg-color="white"
                lazy-rules
                :rules="[Rules.requiredInt]"
                class="form-input"
              />
              <q-input
                v-else
                v-model="bankCardState.form.bank_name"
                :placeholder="$t('member.bank.bankName')"
                lazy-rules
                :rules="[Rules.required()]"
              />
            </div>
          </div>
          <!-- name -->
          <div class="row col-12 col-sm-5">
            <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
            <div class="input-content col-12">
              <q-input
                v-model="bankCardState.form.name"
                :placeholder="$t('member.bank.name')"
                lazy-rules
                :rules="[Rules.required()]"
              />
            </div>
          </div>
          <!-- account name -->
          <div class="row col-12 col-sm-5">
            <div class="form-title label col-12">{{ $t("member.bank.accountName") }}</div>
            <div class="input-content col-12">
              <q-input
                v-model="bankCardState.form.account_name"
                :placeholder="$t('member.bank.accountName')"
                lazy-rules
                :rules="[Rules.required()]"
              />
            </div>
          </div>
          <!-- account number -->
          <div class="row col-12 col-sm-5">
            <div class="form-title label col-12">{{ $t("member.bank.accountNumber") }}</div>
            <div class="input-content col-12">
              <q-input
                v-model="bankCardState.form.account_number"
                :placeholder="$t('member.bank.accountNumber')"
                lazy-rules
                :rules="[Rules.required()]"
                @update:model-value="validateAlphanumeric"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="action-btns row justify-center">
        <q-btn label="Confirm" class="submit-btn" type="submit" />
      </div>
    </q-form>
  </HeaderTitleBack>
  <div v-else class="bank-add-layout pc">
    <div class="bank-add-container">
      <div class="bank-header">
        <p class="bank-title">{{ $t("menu.bank") }}</p>
      </div>
      <div class="bank-body column">
        <div class="profile-form column">
          <div class="form-title-content">
            <div class="color-label"></div>
            <div class="title">{{ bankCardId ? $t("common.btn.edit") : $t("common.btn.add") }}</div>
          </div>
          <q-form class="form-content" @submit="handleSubmit">
            <!-- currency -->
            <div class="form-item row">
              <div class="form-title label col-12">{{ $t("member.bank.selectCurrency") }}</div>
              <div class="btn-content col-12 col-sm-10">
                <q-btn
                  icon="fas fa-coins"
                  :label="$t(item.code as string)"
                  :class="{ active: bankCardState.form.currency === item.code }"
                  v-for="item in availCurrencyList"
                  :key="item.code"
                  @click="handleBankCardCurrencyClick(item.code)"
                >
                  <div class="triangle">
                    <i class="fas fa-check inner-icon"></i>
                  </div>
                </q-btn>
              </div>
            </div>
            <!-- payment type -->
            <div class="form-item row">
              <div class="form-title label col-12">{{ $t("modal.type") }}</div>
              <div class="btn-content col-12 col-sm-10">
                <q-btn
                  :label="$t(item.label as string)"
                  :class="{ active: bankCardState.form.payment_type_id === +item.value }"
                  v-for="item in paymentTypeList"
                  :key="item.value"
                  @click="handleBankCardPaymentTypeClick(item.value)"
                >
                  <div class="triangle">
                    <i class="fas fa-check inner-icon"></i>
                  </div>
                </q-btn>
              </div>
            </div>
            <div class="form-item row input-row">
              <!-- bank branch -->
              <div class="row col-10 col-sm-5">
                <div class="form-title label col-12">{{ $t("member.bank.bankName") }}</div>
                <div class="input-content col-12">
                  <q-select
                    v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet"
                    v-model="bankCardState.form.bank_id"
                    :options="bankList"
                    emit-value
                    map-options
                    bg-color="white"
                    lazy-rules
                    :rules="[Rules.requiredInt]"
                    class="form-input"
                  />
                  <q-input
                    v-else
                    v-model="bankCardState.form.bank_name"
                    :placeholder="$t('member.bank.bankName')"
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </div>
              <!-- name -->
              <div class="row col-10 col-sm-5">
                <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
                <div class="input-content col-12">
                  <q-input
                    v-model="bankCardState.form.name"
                    :placeholder="$t('member.bank.name')"
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </div>
            </div>
            <div class="form-item row input-row">
              <!-- account name -->
              <div class="row col-10 col-sm-5">
                <div class="form-title label col-12">{{ $t("member.bank.accountName") }}</div>
                <div class="input-content col-12">
                  <q-input
                    v-model="bankCardState.form.account_name"
                    :placeholder="$t('member.bank.accountName')"
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </div>
              <!-- account number -->
              <div class="row col-10 col-sm-5">
                <div class="form-title label col-12">{{ $t("member.bank.accountNumber") }}</div>
                <div class="input-content col-12">
                  <q-input
                    v-model="bankCardState.form.account_number"
                    :placeholder="$t('member.bank.accountNumber')"
                    lazy-rules
                    :rules="[Rules.required()]"
                    @update:model-value="validateAlphanumeric"
                  />
                </div>
              </div>
            </div>

            <div class="action-btns multi-btns row justify-center no-wrap">
              <q-btn label="Cancel" class="cancle-btn" @click="goMemberBank" />
              <q-btn label="SUBMIT" class="submit-btn" type="submit" />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import { useQuasar } from "quasar"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useBank } from "src/common/composables/useBank"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE } from "src/common/utils/constants"
import { computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

const { memberImg } = useSiteImg()
const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const Rules = useRule()
const {
  bankCardState,
  validateAlphanumeric,
  paymentTypeList,
  availCurrencyList,
  getAvailCurrencyList,
  bankList,
  getBankList,
  getPaymentTypeList,
  handleBankCardAdd,
  handleBankCardEdit,
  handleBankCardCurrencyClick,
  handleBankCardPaymentTypeClick,
  resetBankCardForm,
  getBankCardInfo
} = useBank()

const bankCardId = computed(() => {
  if (route.params.id) {
    return parseInt(route.params.id as string)
  }
  return 0
})

const goMemberBank = () => {
  resetBankCardForm()
  router.push({ name: "memberBank" })
}
const handleSubmit = async () => {
  const submitFunction = bankCardId.value ? handleBankCardEdit : handleBankCardAdd
  const isSuccess = await submitFunction()
  if (isSuccess) {
    goMemberBank()
  }
}

onMounted(async () => {
  getBankList()
  await getAvailCurrencyList()
  await getPaymentTypeList(bankCardState.form.currency)

  if (bankCardId.value) {
    getBankCardInfo({ id: bankCardId.value })
  } else {
    handleBankCardPaymentTypeClick(paymentTypeList.value[0].value)
  }
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

// h5 mode
.bank-add-layout.h5
  width: 100%
  display: inline-grid
  row-gap: 1rem
  overflow: hidden
  background-color: $bg-dark-secondary
  @include phone-width
    row-gap: 0.5rem
  .action-btns
    margin: 0.5rem 0.5rem 1rem 0.5rem
    .submit-btn
      @apply w-full
      background: $bg-secondary
      color: $text-light-secondary
  .withdraw-container
    width: 100%
    list-style: none
    background: $bg-dark-secondary
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
        min-height: 10rem
        height: auto
        font-size: 1rem
        line-height: 1.375rem
        &.read-only
          min-height: 5rem
      .info-title
        width: 100%
        text-transform: capitalize
        border-bottom: 1px solid $border-dark
        padding-bottom: 0.8rem
      .info-content
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
            border: 2px solid $border-dark !important
            border-radius: 10px
            padding: 0px 12px
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
        .bank-content
          width: 100%
          max-width: 400px
          height: auto
          padding: 10px
          list-style: none
          li
            @apply flex justify-start my-2 p-2
            align-items: center
            background: $bg-secondary
            border: 2px solid $border-dark
            border-radius: 0.2rem
            color: $text-light-secondary
            i
              margin: 0 5px
              color: $text-light-secondary
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
      background-color: $border-dark
      @include phone-width
        margin-left: 14px
        margin-right: 14px

.edit-dialog
  .dialog-card
    width: 100%
    height: 500px
    background-color: $bg-secondary

    .dialog-header
      height: 5.5rem
      font-size: 2rem
      padding: 1.25rem 1.75rem
      border-bottom: 1px solid $border-dark
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
        color: $text-light-secondary
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
          color: $text-light-secondary !important
        .dialog-form-title
          font-weight: 400
          line-height: 2.87
          letter-spacing: 0.00938em
          position: relative
          display: block
          transform-origin: left top
          text-overflow: ellipsis
          max-width: 100%
          color: $text-light-secondary
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
          color: $text-light-secondary
          font-size: 1.75rem
          padding: 0px 1.75rem
          display: flex
          align-items: center
          justify-content: space-between
          .check-img
            display: none
          &.active
            color: $text-light-secondary
            font-weight: bold
            background: $bg-dark-secondary
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

.bank-add-layout.pc
  +iphone-width
    padding-top: 0
  .bank-add-container
    width: 55rem
    height: 100%
    padding: 4.375rem 3.125rem 1.875rem
    .bank-header
      @apply w-full flex justify-between items-center
      .bank-title
        @apply text-[3.125rem] font-extrabold
        color: $text-light-secondary
        text-transform: capitalize
      .title-img
        width: 13rem
        height: auto
    .bank-body
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
          background: $bg-dark-secondary
        .form-title-content
          .color-label
            background-color: $bg-secondary !important
          .title
            color: $text-light-secondary
        .form-content
          +iphone-width
            width: 100%
            padding: 1rem 1.5rem
            background: transparent
            border-radius: .5rem
          .form-item
            &.input-row
              gap: 1.875rem
              +iphone-width
                gap: 0
                justify-content: center
            .form-title
              font-size: 1.2rem
              font-weight: 590
              color: $bg-secondary
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
                border: 2px solid $border-dark !important
                border-radius: 10px
                padding: 0px 15px
                position: relative
                width: 150px
                height: 60px
                font-size: 1rem
                color: $text-light-secondary !important
                overflow: hidden
                &.active
                  border: 2px solid $bg-secondary !important
                  color: $bg-secondary !important
                  .triangle
                    display: block
            .label
              +iphone-width
                margin-top: 1.6875rem
            .input-content
              margin: .5rem .5rem 0 0.8rem
              padding: 0
            .radio-content
              +setFlex(flex-start)
              padding-top: 1.75rem
              padding-left: .75rem
              gap: 1.875rem
              +iphone-width
                padding-top: 1.125rem
                padding-left: .625rem
                gap: 1.25rem
            .btn-toggle-content
              +setFlex(flex-start)
              padding-top: 1.75rem
              padding-left: .75rem
              gap: 1.875rem
              +iphone-width
                padding-top: 1.125rem
                padding-left: .625rem
                gap: 1.25rem
      .action-btns
        .cancle-btn
          background-color: $bg-secondary !important
        .submit-btn
          width: 100%
          color: $text-light-secondary !important
          background-color: $bg-secondary !important
</style>
