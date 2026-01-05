<template>
  <HeaderTitleBack titleI18n="menu.withdrawal" v-bind="HTBConfig">
    <section class="withdraw-wrapper px-[10px] pb-[90px]">
      <q-form @submit="handleWithdralSubmit()">
        <!-- 幣別選擇 -->
        <div class="currency-list">
          <div class="currency-title">{{ $t("member.bank.selectCurrency") }}</div>
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
              placeholder="0"
              lazy-rules
              :rules="[Rules.requiredInt]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-file-invoice-dollar" class="text-black" />
              </template>
            </q-input>

            <ul class="text-black" v-show="withdrawState.form.crypto_rate">
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
  </HeaderTitleBack>
</template>

<script setup lang="ts">
import { useBank } from "src/common/composables/useBank"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import AddBankCard from "./components/AddBankCard.vue"
import BankCard from "./components/BankCard.vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useHTBConfig } from "../../hooks/useHTBConfig"
import { useQuasar } from "quasar"
import { useUserInfo } from "src/common/composables/useUserInfo"

const { HTBConfig } = useHTBConfig()
const router = useRouter()
const Rules = useRule()
const { activeWalletCurrencyCode } = useUserInfo()
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
  handleWithdralSubmit
} = useBank()
const { isLoading } = useAuth()
const $q = useQuasar()

onMounted(async () => {
  $q.loading.show()
  await getWithdralPaymentList()
  await getBankList()
  await getGatewayList()
  $q.loading.hide()
})

// 監聽 activeWalletCurrencyCode 和 supportedCurrency，自動同步幣別選擇
watch(
  [() => activeWalletCurrencyCode.value, () => withdrawState.supportedCurrency],
  ([currencyCode, supportedCurrencies]) => {
    if (!supportedCurrencies || supportedCurrencies.length === 0) return

    // 檢查當前活躍錢包幣別是否在支持的幣別列表中
    if (currencyCode && supportedCurrencies.includes(currencyCode)) {
      // 如果支持該幣別且當前選擇的幣別不是該幣別，則切換
      if (withdrawState.form.currency !== currencyCode) {
        handleWithdralCurrencyClick(currencyCode)
      }
    } else {
      // 如果不支持或沒有活躍幣別，選擇第一個
      if (supportedCurrencies[0] && withdrawState.form.currency !== supportedCurrencies[0]) {
        handleWithdralCurrencyClick(supportedCurrencies[0])
      }
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
@import "../../assets/css/main.scss";

.currency-list {
  @apply pb-[1rem] mb-[1rem];
  border-color: $secondary;

  .currency-title {
    @apply font-semibold py-[.625rem];
    color: $primary;
  }

  .currency-btn {
    @apply flex items-center justify-center min-w-[58px] min-h-[31px];
    @apply cursor-pointer;
    font-size: 0.875rem;
    border-radius: 0.625rem;
    background: $light;
    color: $primary;

    &:hover,
    &.active {
      color: #000;
      border: 1px solid $border-blue;
    }
  }
}

.payment-type-container {
  li {
    @apply text-base;

    @include phone-width {
      @apply text-xs;
    }

    img {
      max-height: 2rem;
    }
  }
}

.balance-wrapper {
  @apply bg-transparent;

  ::v-deep(.q-field--disabled) {
    opacity: 0.6;
  }

  .form-title {
    @apply text-base font-bold;
    color: $primary;
  }
}
</style>
