<template>
  <BannerMember />
  <div class="bank-add-layout">
    <div class="bank-add-content">
      <MemberNav />
      <div class="bank-add-form column">
        <div class="form-title-content">
          <img :src="svgIcon('member-title-icon')" />
          <div class="title">{{ bankCardId ? $t("common.btn.edit") : $t("common.btn.add") }}</div>
        </div>
        <q-form class="form-content w-full" @submit="handleSubmit">
          <!-- currency -->
          <div class="form-item row">
            <div class="label col-12">{{ $t("member.bank.selectCurrency") }}</div>
            <div class="radio-content col-12">
              <q-radio
                v-for="item in availCurrencyList"
                :key="item.id"
                dense
                :model-value="bankCardState.form.currency"
                @update:model-value="handleBankCardCurrencyClick($event)"
                :val="item.code"
                :label="item.code"
                checked-icon="circle"
              />
            </div>
          </div>
          <!-- payment type -->
          <div class="form-item row">
            <div class="label col-12">{{ $t("modal.type") }}</div>
            <div class="radio-content col-12 q-mb-md radio-content-type">
              <q-radio
                v-for="item in paymentTypeList"
                :key="item.value"
                dense
                v-model="bankCardState.form.payment_type_id"
                :val="parseInt(item.value)"
                :label="$t(item.label)"
                checked-icon="circle"
                @update:model-value="handleBankCardPaymentTypeClick(item.value)"
              />
            </div>
          </div>
          <!-- payment gateway -->
          <div class="form-item row" v-if="showGateway(bankCardState.form.payment_type_id)">
            <div class="label col-12">{{ $t("modal.gateway") }}</div>
            <div class="radio-content col-12 q-mb-md radio-content-type">
              <q-radio
                v-for="item in paymentGatewayList"
                :key="item.value"
                dense
                v-model="bankCardState.form.payment_gateway_id"
                :val="item.value"
                :label="$t(item.label)"
                checked-icon="circle"
              />
            </div>
          </div>
          <!-- BankTransfer -->
          <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.BankTransfer">
            <div class="form-item row input-row">
              <!-- bank name -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.bank.bankName") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="bankCardState.form.bank_name"
                    :placeholder="$t('member.bank.bankName')"
                    rounded
                    outlined
                    dense
                    borderless
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </div>
              <!-- name -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.bank.name") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="bankCardState.form.name"
                    :placeholder="$t('member.bank.name')"
                    rounded
                    outlined
                    dense
                    borderless
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </div>
            </div>
            <div class="form-item row input-row">
              <!-- account name -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.bank.accountName") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="bankCardState.form.account_name"
                    :placeholder="$t('member.bank.accountName')"
                    rounded
                    outlined
                    dense
                    borderless
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </div>
              <!-- account number -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.bank.accountNumber") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="bankCardState.form.account_number"
                    :placeholder="$t('member.bank.accountNumber')"
                    rounded
                    outlined
                    dense
                    borderless
                    lazy-rules
                    :rules="[Rules.required()]"
                    @update:model-value="validateAlphanumeric"
                  />
                </div>
              </div>
            </div>
          </template>
          <!-- EWallet -->
          <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet">
            <div class="form-item row input-row">
              <!-- bank name -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.bank.bankName") }}</div>
                <div class="input-content col-12">
                  <q-select
                    v-model="bankCardState.form.bank_id"
                    :options="bankList"
                    emit-value
                    map-options
                    outlined
                    dense
                    lazy-rules
                    :disable="!bankCardState.form.payment_gateway_id"
                    :rules="[Rules.requiredInt]"
                    class="form-input"
                  />
                </div>
              </div>
              <!-- name -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.bank.name") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="bankCardState.form.name"
                    :placeholder="$t('member.bank.name')"
                    rounded
                    outlined
                    dense
                    borderless
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </div>
            </div>
            <div class="form-item row input-row">
              <!-- account name -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.bank.accountName") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="bankCardState.form.account_name"
                    :placeholder="$t('member.bank.accountName')"
                    rounded
                    outlined
                    dense
                    borderless
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </div>
              <!-- account number -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.bank.accountNumber") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="bankCardState.form.account_number"
                    :placeholder="$t('member.bank.accountNumber')"
                    rounded
                    outlined
                    dense
                    borderless
                    lazy-rules
                    :rules="[Rules.required()]"
                    @update:model-value="validateAlphanumeric"
                  />
                </div>
              </div>
            </div>
          </template>
          <!-- CryptoWallet -->
          <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoWallet">
            <div class="form-item row input-row">
              <!-- name -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.bank.name") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="bankCardState.form.name"
                    :placeholder="$t('member.bank.name')"
                    rounded
                    outlined
                    dense
                    borderless
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </div>
              <!-- currency brand -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.deposit.currencyBrand") }}</div>
                <div class="input-content col-12">
                  <q-select
                    v-model="bankCardState.form.crypto_id"
                    :options="cryptoList"
                    emit-value
                    map-options
                    outlined
                    dense
                    lazy-rules
                    :rules="[Rules.requiredInt]"
                    class="form-input"
                  />
                </div>
              </div>
            </div>
            <div class="form-item row input-row">
              <!-- chain -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.deposit.chain") }}</div>
                <div class="input-content col-12">
                  <q-select
                    v-model="bankCardState.form.bank_id"
                    :options="bankList"
                    emit-value
                    map-options
                    outlined
                    dense
                    lazy-rules
                    :rules="[Rules.requiredInt]"
                    class="form-input"
                  />
                </div>
              </div>
              <!-- wallet address -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.deposit.walletAddress") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="bankCardState.form.wallet_address"
                    :placeholder="$t('member.deposit.walletAddress')"
                    rounded
                    outlined
                    dense
                    borderless
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </div>
            </div>
          </template>
          <!-- CryptoPayment -->
          <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoPayment">
            <div class="form-item row input-row">
              <!-- name -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.bank.name") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="bankCardState.form.name"
                    :placeholder="$t('member.bank.name')"
                    rounded
                    outlined
                    dense
                    borderless
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </div>
              <!-- currency brand -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.deposit.currencyBrand") }}</div>
                <div class="input-content col-12">
                  <q-select
                    v-model="bankCardState.form.crypto_id"
                    :options="cryptoList"
                    emit-value
                    map-options
                    outlined
                    dense
                    lazy-rules
                    :rules="[Rules.requiredInt]"
                    class="form-input"
                  />
                </div>
              </div>
            </div>
            <div class="form-item row input-row">
              <!-- chain -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.deposit.chain") }}</div>
                <div class="input-content col-12">
                  <q-select
                    v-model="bankCardState.form.bank_id"
                    :options="bankList"
                    :disable="!bankCardState.form.payment_gateway_id"
                    emit-value
                    map-options
                    outlined
                    dense
                    lazy-rules
                    :rules="[Rules.requiredInt]"
                    class="form-input"
                  />
                </div>
              </div>
              <!-- wallet address -->
              <div class="row col-11 col-sm-5">
                <div class="label col-12">{{ $t("member.deposit.walletAddress") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="bankCardState.form.wallet_address"
                    :placeholder="$t('member.deposit.walletAddress')"
                    rounded
                    outlined
                    dense
                    borderless
                    lazy-rules
                    :rules="[Rules.required()]"
                  />
                </div>
              </div>
            </div>
          </template>

          <div class="action-btns multi-btns row justify-center no-wrap">
            <q-btn text-color="white" label="Cancel" class="cancle-btn" @click="goMemberBank" />
            <q-btn text-color="white" label="SUBMIT" class="submit-btn" type="submit" />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BannerMember from "app/template/set_jokerhill/components/BannerMember.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useQuasar } from "quasar"
import { useBank } from "src/common/composables/useBank"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE } from "src/common/utils/constants"
import { computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import MemberNav from "../../components/MemberNav.vue"

const $q = useQuasar()
const { svgIcon } = useSiteImg()
const router = useRouter()
const route = useRoute()
const Rules = useRule()
const {
  showGateway,
  availCurrencyList,
  getAvailCurrencyList,
  bankCardState,
  validateNumeric,
  validateAlphanumeric,
  paymentTypeList,
  paymentGatewayList,
  getPaymentTypeList,
  currencyList,
  bankList,
  getBankList,
  cryptoList,
  getCryptoList,
  handleBankCardCurrencyClick,
  handleBankCardPaymentTypeClick,
  handleBankCardAdd,
  handleBankCardEdit,
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

watch(
  () => bankCardState.form.payment_gateway_id,
  async (gatewayId) => {
    await getBankList(gatewayId)
  }
)

onMounted(async () => {
  await getBankList()
  await getAvailCurrencyList()
  resetBankCardForm()

  if (bankCardId.value) {
    await getBankCardInfo({ id: bankCardId.value })
    getPaymentTypeList(bankCardState.form.currency)
  } else {
    getPaymentTypeList(bankCardState.form.currency)
  }
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import "../../assets/css/form.sass"

.bank-add-layout
  padding-top: 6rem
  +iphone-width
    padding-top: 0
    ::v-deep(.q-radio)
      .q-radio__inner
        margin-left: .425rem
        margin-right: 0.425rem
  .bank-add-content
    color: white
    overflow: hidden
    max-width: 62.5rem
    margin: 0 auto
    +iphone-width
      padding: 0
    .bank-add-form
      margin-top: 2.5rem
      width: 100%
      border-radius: .5rem
      // background: #fff
      padding: 2rem 2.5rem
      +iphone-width
        width: 100vw
        margin-top: 0
        padding: 0
        border-radius: 0
        // background: #24262B
      .form-content
        border-radius: 8px
        background: #fff
        padding: 3rem
        +iphone-width
          width: 100%
          padding: 1rem 1.5rem
          background: #fff
          border-radius: .5rem
        .form-item
          &.input-row
            gap: 1.875rem
            +iphone-width
              gap: 0
          .label
            +iphone-width
              margin-top: 0rem
          .input-content
            margin-top: .5rem
            padding: 0
            +iphone-width
              padding-left: 2vw
          .radio-content
            +setFlex(flex-start)
            padding-top: 1.75rem
            padding-left: 0rem
            padding-bottom: 0.4rem
            gap: 1.875rem
            +iphone-width
              padding-top: 1.125rem
              padding-left: 0
              padding-bottom: 0.2rem
              gap: 1.25rem
          .radio-content-type
            +iphone-width
              display: inline-block
              padding-bottom: 0
              .q-radio
                margin-bottom: 1rem
                margin-right: 1rem
          .btn-toggle-content
            +setFlex(flex-start)
            padding-top: 1.75rem
            padding-left: .75rem
            gap: 1.875rem
            +iphone-width
              padding-top: 1.125rem
              padding-left: .625rem
              gap: 1.25rem
</style>
