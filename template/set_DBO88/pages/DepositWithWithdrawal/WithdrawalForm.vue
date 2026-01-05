<template>
  <section class="withdraw-wrapper">
    <q-form @submit="handleWithdralSubmit()">
      <!-- 幣別選擇 -->
      <div class="pay-area">
        <div class="pay-area-title">{{ $t("member.bank.selectCurrency") }}</div>
        <div class="currency-btn-wrapper">
          <span
            v-for="(withdraw, key) in withdrawState.supportedCurrency"
            @click="handleWithdralCurrencyClick(withdraw)"
            :key="key"
            :class="{ active: `${withdraw}` === withdrawState.form.currency }"
            class="currency-btn"
          >
            {{ $t(withdraw) }}
          </span>
        </div>
      </div>
      <!-- 支付類型選擇 -->
      <div class="pay-area">
        <ul class="pay-btn-wrapper">
          <li
            v-for="fundType in withdrawState.fundTypeList"
            :key="fundType"
            :class="{ active: fundType === `${withdrawState.usingFundType}` }"
            class="pay-btn"
            @click="handleWithdralFundTypeClick(fundType)"
          >
            {{ $t(`member.bank.${fundType}`) }}
          </li>
        </ul>
      </div>
      <div v-if="withdrawState.usingPaymentInfoList.length > 0 && !withdrawState.gateWayHidden" class="pay-area">
        <div class="field-input flex flex-col gap-[10px]">
          <span class="form-title">{{ $t("modal.gateway") }}</span>
          <ul class="form-methods">
            <li
              v-for="(item, key) in withdrawState.usingPaymentInfoList"
              :key="key"
              class="method-item"
              :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
              @click="handleWithdralPaymentClick(item.type, item.id)"
            >
              <img :src="item.imgUrl" />
            </li>
          </ul>
        </div>
      </div>
      <!-- Bank Card List -->
      <div class="card-layout">
        <BankCard
          v-for="bankCard in withdrawState.bankCards"
          :key="bankCard.id"
          :card="bankCard"
          :activeId="withdrawState.form.bank_id"
          :bankList="bankList"
          :gatewayFilterList="gatewayFilterList"
          @click="handleWithdralBankCardClick(bankCard.id, bankCard.crypto_rate)"
        />
        <AddBankCard @click="openAddBankCard()" />
      </div>
      <div class="balance-wrapper">
        <div class="field-input flex flex-col gap-[10px] pt-[10px]">
          <span class="form-title">{{ $t("member.withdrawal.balance") }}</span>
          <q-input v-model.trim="withdrawState.form.balance" outlined :disable="true">
            <template v-slot:prepend>
              <q-icon name="fas fa-coins" class="field-icon" />
            </template>
          </q-input>
        </div>
        <div class="field-input flex flex-col gap-[10px] pt-[10px]">
          <span class="form-title">{{ $t("member.withdrawal.auditTurnover") }}</span>
          <q-input v-model.trim="withdrawState.form.remaining_turnover" outlined :disable="true">
            <template v-slot:prepend>
              <q-icon name="fas fa-clipboard-check" class="field-icon" />
            </template>
          </q-input>
        </div>
        <div class="field-input flex flex-col gap-[10px] pt-[10px]">
          <span class="form-title">{{ $t("member.withdrawal.withdrawalAmmount") }}</span>
          <q-input
            v-if="withdrawState.gateWayHidden"
            v-model.trim="withdrawState.form.amount"
            outlined
            :label="`${$t('member.deposit.withdrawAmount')}`"
            lazy-rules
            @keypress="Rules.validatePositiveNumber"
            inputmode="decimal"
            :rules="[Rules.requiredInt]"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-file-invoice-dollar" class="field-icon" />
            </template>
          </q-input>
          <q-input
            v-else
            v-model.trim="withdrawState.form.amount"
            outlined
            :placeholder="`${$t('member.deposit.withdrawAmount')}`"
            lazy-rules
            :rules="[Rules.requiredInt]"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-file-invoice-dollar" class="field-icon" />
            </template>
          </q-input>
          <ul class="text-white" v-show="withdrawState.form.crypto_rate">
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
      <div>
        <q-btn class="btn-submit" type="submit" :loading="isLoading">
          {{ $t("common.btn.submit") }}
        </q-btn>
      </div>
    </q-form>
  </section>
</template>

<script setup lang="ts">
import { useBank } from "src/common/composables/useBank"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted } from "vue"
import AddBankCard from "../BankDetails/AddBankCard.vue"
import BankCard from "../BankDetails/BankCard.vue"

const eventbus = injectStrict(EventBusKey)
const Rules = useRule()
const {
  withdrawState,
  bankList,
  gatewayFilterList,
  getBankList,
  getGatewayList,
  getWithdralPaymentList,
  handleWithdralCurrencyClick,
  handleWithdralFundTypeClick,
  handleWithdralBankCardClick,
  handleWithdralPaymentClick,
  handleWithdralSubmit,
  getPaymentTypeList
} = useBank()
const { isLoading } = useAuth()

const openAddBankCard = () => {
  eventbus.emit("openAddBankCard", true)
  eventbus.emit("openDepositWithWithdrawal", false)
}

onMounted(async () => {
  await getWithdralPaymentList()
  getBankList()
  getGatewayList()
  await getPaymentTypeList(withdrawState.form.currency)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";
@import "app/template/set_DBO88/assets/css/button.scss";

.pay-area {
  @apply p-4 my-[.9375rem] rounded-[.625rem];
  background: #2c2e34;
  color: $text-white;

  .pay-area-title {
    @apply font-semibold py-[.3125rem];
  }

  .pay-btn-wrapper {
    @apply grid justify-between gap-[.9375rem];
    grid-template-columns: repeat(3, 1fr);

    @include iphone-width {
      @apply grid-cols-2;
    }
  }

  .pay-btn {
    @apply flex items-center justify-center text-[.875rem] font-semibold;
    @apply cursor-pointer rounded-[3.125rem] p-[.625rem] text-white;
    background: #24262b;

    &:hover,
    &.active {
      background: $primary-color;
    }

    @include iphone-width {
      @apply text-sm;
    }
  }
}

.balance-wrapper {
  @apply p-4 my-[.9375rem] rounded-[.625rem];
  background: #2c2e34;

  ::v-deep(.q-field--disabled) {
    opacity: 0.6;
  }
}

.form-title {
  @apply text-base font-bold;
  color: $primary-color;
}

.withdraw-wrapper {
  .card-layout {
    @apply grid gap-[.625rem];
    grid-template-columns: repeat(2, 1fr);

    @include pad-large-width {
      @apply flex flex-col gap-[.625rem];
    }
  }

  .field-icon {
    color: $primary-color;
  }

  .btn-submit {
    @apply w-full mt-1 mb-0 text-white py-3 font-extrabold rounded-[.625rem];
    background: $primary-color;
  }
}

.form-methods {
  @apply grid gap-[.1875rem];
  grid-template-columns: repeat(3, 1fr);

  .method-item {
    @apply flex flex-col items-center justify-center p-[.625rem] relative;
    @apply cursor-pointer;
    border: 1px solid $primary-color;
    border-radius: 0.25rem;
    transition: all 0.3s ease;

    img {
      @apply w-[6.75rem] h-[1.875rem];
    }

    span {
      margin-top: 0.125rem;
      font-size: 0.75rem;
    }

    &.active {
      background: $primary-color;

      &::after {
        @apply absolute right-[1px] bottom-[1px] w-[25px] h-[25px];
        content: "";
        background: url("../../../assets/images/svg/checked.svg");
        background-repeat: no-repeat;
        background-size: contain;
      }

      span {
        @apply font-bold;
        color: $primary-color;
      }
    }
  }
}

:deep(.q-field--outlined .q-field__control) {
  background: #191b1e !important;
  color: $text-white !important;
}

:deep(.q-field--outlined .q-field__label) {
  color: $text-white !important;
}

:deep(.q-field--labeled .q-field__native) {
  color: $text-white !important;
}

:deep(.q-field--auto-height.q-field--dense .q-field__native) {
  color: $text-white !important;
}

:deep(.q-select__dropdown-icon) {
  color: $text-white !important;
}

:deep(.q-field__native) {
  color: $text-white !important;
}
</style>
