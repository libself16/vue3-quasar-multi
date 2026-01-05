<template>
  <div class="bank-add-layout">
    <div class="bank-add-container">
      <q-form @submit="handleBankCardAdd">
        <!-- 選擇幣別 -->
        <div class="mt-5">{{ $t("tableHeader.curr") }} :</div>
        <div class="select-row currenct">
          <div
            v-for="item in currencyList"
            :key="item.value"
            class="select-item currency"
            :class="{ active: `${item.label}` === bankCardState.form.currency }"
            @click="handleBankCardCurrencyClick(item.label)"
          >
            <span class="ml-1 whitespace-nowrap">{{ $t(item.label) }}</span>
            <div class="checked-selected">
              <i class="fas fa-check"></i>
            </div>
          </div>
        </div>

        <!-- 選擇支付方式 -->
        <div class="mt-5">{{ $t("tableHeader.paymentType") }} :</div>
        <div class="select-row">
          <div
            v-for="item in paymentTypeList"
            :key="item.value"
            class="select-item payment"
            :class="{ active: item.value === `${bankCardState.form.payment_type_id}` }"
            @click="handleBankCardPaymentTypeClick(item.value)"
          >
            <i :class="item.iconClass"></i>
            <span class="ml-1 whitespace-nowrap">{{ $t(item.label) }}</span>
            <div class="checked-selected">
              <i class="fas fa-check"></i>
            </div>
          </div>
        </div>

        <!-- form -->
        <div class="form-container p-5">
          <!-- branch -->
          <div class="form-row mb-2">
            <div v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet">
              <q-select
                v-model="bankCardState.form.bank_id"
                :options="bankList"
                emit-value
                map-options
                bg-color="white"
                outlined
                :label="$t('member.bank.bankBranch')"
                lazy-rules
                :rules="[Rules.requiredInt]"
              />
            </div>
            <q-input
              v-else
              v-model="bankCardState.form.branch"
              bg-color="white"
              outlined
              :label="$t('member.bank.bankBranch')"
              lazy-rules
              :rules="[Rules.required()]"
            />
          </div>
          <!-- name -->
          <div class="form-row mb-2">
            <q-input
              v-model="bankCardState.form.name"
              bg-color="white"
              outlined
              :label="$t('member.bank.name')"
              lazy-rules
              :rules="[Rules.required()]"
            />
          </div>
          <!-- accountName -->
          <div class="form-row mb-2">
            <q-input
              v-model="bankCardState.form.account_name"
              bg-color="white"
              outlined
              :label="$t('member.bank.accountName')"
              lazy-rules
              :rules="[Rules.required()]"
            />
          </div>
          <!-- accountNumber -->
          <div class="form-row mb-2">
            <q-input
              v-model="bankCardState.form.account_number"
              bg-color="white"
              outlined
              :label="$t('member.bank.accountNumber')"
              lazy-rules
              :rules="[Rules.required()]"
              @update:model-value="validateNumeric"
            />
          </div>
        </div>

        <!-- btn -->
        <div class="flex justify-center my-6">
          <button class="btn" type="submit">{{ $t("common.btn.submit") }}</button>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useBank } from "src/common/composables/useBank"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE } from "src/common/utils/constants"
import { onMounted } from "vue"

const Rules = useRule()

const {
  bankCardState,
  validateNumeric,
  paymentTypeList,
  handleBankCardPaymentTypeClick,
  currencyList,
  handleBankCardCurrencyClick,
  bankList,
  getBankList,
  handleBankCardAdd
} = useBank()

onMounted(() => {
  getBankList()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/epicwin/css/_variable.sass'
@import 'app/template/epicwin/css/button.sass'
@import 'app/template/epicwin/css/form.sass'


.bank-add-layout
  @apply p-5 mx-auto rounded-lg w-full
  +phone-width
    @apply p-4
  .bank-add-container
    @apply p-5
    background-color: $member-nav-bg-color
    +phone-width
      @apply p-4
</style>
