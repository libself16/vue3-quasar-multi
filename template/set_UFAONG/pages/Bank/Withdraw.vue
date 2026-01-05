<template>
  <section class="withdraw-wrapper px-[10px] pb-[90px]">
    <q-form @submit="handleWithdralSubmit()">
      <!-- 幣別選擇 -->
      <div class="currency-list">
        <div class="currency-title text-yellow">{{ $t("member.bank.selectCurrency") }}</div>
        <div class="flex gap-[10px]">
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
      <div class="pb-[1rem]">
        <ul class="payment-type-container">
          <li
            v-for="fundType in withdrawState.fundTypeList"
            :key="fundType"
            :class="{ active: fundType === `${withdrawState.usingFundType}` }"
            @click="handleWithdralFundTypeClick(fundType)"
          >
            {{ $t(`member.bank.${fundType}`) }}
          </li>
        </ul>
      </div>
      <div class="balance-wrapper">
        <div class="field-input flex flex-col gap-[10px] pt-[10px]" v-if="!withdrawState.gateWayHidden">
          <span class="form-title">{{ $t("modal.gateway") }}</span>
          <ul class="payment-type-container">
            <li
              v-for="(item, key) in withdrawState.usingPaymentInfoList"
              :key="key"
              class="method-item"
              :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
            >
              <img :src="item.imgUrl" alt="" class="w-auto" @click="handleWithdralPaymentClick(item.type, item.id)" />
            </li>
          </ul>
        </div>
      </div>

      <!-- Bank Card List -->
      <div class="flex flex-col gap-[10px]">
        <BankCard
          v-for="bankCard in withdrawState.bankCards"
          :key="bankCard.id"
          :card="bankCard"
          :activeId="withdrawState.form.bank_id"
          :bankList="bankList"
          :gatewayFilterList="gatewayFilterList"
          @click="handleWithdralBankCardClick(bankCard.id)"
        />
        <AddBankCard @click="router.push({ name: 'BankDetails' })" />
      </div>
      <div class="balance-wrapper">
        <div class="field-input flex flex-col gap-[10px] pt-[10px]">
          <span class="form-title">{{ $t("member.withdrawal.balance") }}</span>
          <q-input v-model.trim="withdrawState.form.balance" bg-color="white" outlined :disable="true">
            <template v-slot:prepend>
              <q-icon name="fas fa-coins" class="text-black" />
            </template>
          </q-input>
        </div>
        <div class="field-input flex flex-col gap-[10px] pt-[10px]">
          <span class="form-title">{{ $t("member.withdrawal.auditTurnover") }}</span>
          <q-input v-model.trim="withdrawState.form.remaining_turnover" bg-color="white" outlined :disable="true">
            <template v-slot:prepend>
              <q-icon name="fas fa-clipboard-check" class="text-black" />
            </template>
          </q-input>
        </div>
        <div class="field-input flex flex-col gap-[10px] pt-[10px]">
          <span class="form-title">{{ $t("member.withdrawal.withdrawalAmmount") }}</span>
          <q-input
            v-if="withdrawState.gateWayHidden"
            v-model.trim="withdrawState.form.amount"
            bg-color="white"
            color="black"
            outlined
            :label="`${$t('member.deposit.withdrawAmount')}`"
            lazy-rules
            @keypress="Rules.validatePositiveNumber"
            inputmode="decimal"
            :rules="[Rules.requiredInt]"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-file-invoice-dollar" class="text-black" />
            </template>
          </q-input>
          <q-input
            v-else
            v-model.trim="withdrawState.form.amount"
            bg-color="white"
            color="black"
            outlined
            :placeholder="`${$t('member.deposit.withdrawAmount')}`"
            lazy-rules
            :rules="[Rules.requiredInt]"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-file-invoice-dollar" class="text-black" />
            </template>
          </q-input>
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
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import AddBankCard from "./components/AddBankCard.vue"
import BankCard from "./components/BankCard.vue"

const router = useRouter()
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

onMounted(async () => {
  await getWithdralPaymentList()
  getBankList()
  getGatewayList()
  await getPaymentTypeList(withdrawState.form.currency)
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
@import "../../assets/css/main.scss";

.currency-list {
  @apply pb-[1rem] mb-[1rem];

  .currency-title {
    @apply font-semibold py-[.625rem];
  }

  .currency-btn {
    @apply flex items-center justify-center min-w-[58px] min-h-[31px];
    @apply font-semibold cursor-pointer;
    font-size: 0.875rem;
    border-radius: 0.625rem;

    &:hover,
    &.active {
      color: $dark-bg;
      background: $gradient-to-bottom;
    }
  }
}

.payment-type-container {
  li {
    @apply text-base;

    @include phone-width {
      @apply text-sm;
    }

    img {
      max-height: 2rem;
    }
  }
}

.balance-wrapper {
  ::v-deep(.q-field--disabled) {
    opacity: 0.6;
  }

  .form-title {
    @apply text-base font-bold;
    color: $primary;
  }
}
</style>
