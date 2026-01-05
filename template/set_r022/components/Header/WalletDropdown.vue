<template>
  <q-select
    v-model="activeCurrencyId"
    :options="walletDropdown"
    @update:model-value="handleWalletChange"
    transition-show="flip-up"
    transition-hide="flip-down"
    map-options
    dense
    rounded
    borderless
    class="wallet-container"
    ref="selectRef"
    :menu-offset="[120, 10]"
    :popup-content-style="{ padding: '22px', background: 'var(--neutral-01)' }"
    hide-dropdown-icon
    :readonly="!isCash"
  >
    <template #selected>
      <div v-if="inUseWallet" class="wallet-balance">
        <div class="balance-label">{{ activeWalletLabel }}</div>
        <div class="flex items-center justify-end">
          <span class="balance-amount">{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance) }}</span>
        </div>
      </div>
    </template>
    <template #append>
      <span v-if="inUseWallet" class="wallet-dropdown-icon" @click.stop.prevent="getBalance">
        <i :class="{ 'fas fa-sync-alt': !isSpinning, 'fas fa-sync-alt fa-spin': isSpinning }"></i>
      </span>
    </template>
    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps" class="wallet-list wallet-bg-image">
        <q-item-section side>
          <q-checkbox :model-value="selected" @update:model-value="toggleOption(opt)" />
        </q-item-section>
        <q-item-section avatar>
          <q-item-label class="pup_currency">{{ opt.label.split(" ")[2] }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="pup_balance">{{ opt.label.split(" ")[0] }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
import type { QSelect } from "quasar"
import { computed, ref, watchEffect } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { useCommon } from "src/common/hooks/useCommon"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useUserInfo } from "src/common/composables/useUserInfo"

type WalletDropItem = {
  label: string
  value: number
}

const { isCash } = useEnv()
const { moneyFormat } = useCommon()
const { activeWalletLabel, inUseWallet, userWalletMap, getWalletLabel, setUserActiveWallet, getUserWalletList } =
  useUserInfo()

const selectRef = ref<InstanceType<typeof QSelect> | null>(null)
const activeCurrencyId = ref(0)
const isSpinning = ref(false)

const walletDropdown = computed<WalletDropItem[]>(() => {
  return Object.keys(userWalletMap.value).map((e) => {
    const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
    const label = `${moneyFormat(cashWallet.balance)}  ${getWalletLabel(cashWallet)}`
    const value = cashWallet.currency_id
    return { label, value }
  })
})

const handleWalletChange = (value: WalletDropItem) => {
  setUserActiveWallet(value.value)
}

const getBalance = () => {
  isSpinning.value = true
  setTimeout(() => {
    getUserWalletList()
    isSpinning.value = false
  }, 1000)
}

watchEffect(() => {
  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    activeCurrencyId.value = inUseWallet.value[WALLET_TYPE.Enums.Cash].currency_id || 0
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.wallet-container {
  margin-right: 0.47875rem;

  @include pad-large-width {
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .wallet-balance {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    font-weight: 400;
    font-size: 0.75rem;

    .balance-label {
      color: var(--primary-02);
    }

    .balance-amount {
      color: var(--secondary-01);
      margin-right: 1rem;
    }
  }
}

:deep(.q-field__append) {
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translateY(-25%);
  padding-left: 0;
  align-items: flex-end;

  .wallet-dropdown-icon {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    color: var(--primary-01);
    width: 0.75rem;
    height: 0.75rem;

    i {
      position: absolute;
      font-size: 0.75rem;
    }
  }
}

.wallet-list {
  @apply w-[25rem];

  @include pad-large-width {
    @apply w-full;
  }
}

.wallet-bg-image {
  @apply mb-[1.25rem];
  border-radius: 0.625rem;
  background-image: url("../../assets/images/wallet-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  color: var(--text-01);

  &:last-child {
    @apply mb-0;
  }
}
</style>
