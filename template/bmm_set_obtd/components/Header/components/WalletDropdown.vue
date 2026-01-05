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
    :popup-content-style="{ padding: '20px' }"
    hide-dropdown-icon
  >
    <template #selected>
      <div v-if="inUseWallet" class="selected-content">
        <span class="mr-2 currency-code">{{ activeWalletLabel }}</span>
        <span class="balance">{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0") }}</span>
      </div>
    </template>
    <template #append>
      <span class="wallet-dropdown-icon" @click.stop.prevent="getBalance">
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
import { computed, ref, watchEffect } from "vue"
import type { QSelect } from "quasar"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { WALLET_TYPE } from "src/common/utils/constants"

type WalletDropItem = {
  label: string
  value: number
}
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
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";

.wallet-container {
  @apply min-w-[11.4375rem];

  @include phone-width {
    @apply min-w-[6.25rem] px-[0] text-[.75rem];
    @apply flex whitespace-nowrap items-center justify-center;
  }

  :deep(.q-field__inner) {
    @apply px-[10px] rounded-[3.125rem];
    background: rgba($background-cool-blue-color, 0.8);

    @include phone-width {
      @apply flex items-center h-[2rem];
    }
  }

  .selected-content {
    @apply flex items-center w-full overflow-hidden whitespace-nowrap;
    color: $text-light-color;
  }

  .currency-code {
    @apply mr-2 flex-shrink-0;
  }

  .balance {
    @apply overflow-hidden text-ellipsis;
    flex: 1;
    min-width: 0;
  }
}

.wallet-dropdown-icon {
  @apply flex items-center justify-center relative h-[1rem] w-[1rem];
  color: $text-light-color;

  i {
    @apply absolute text-[0.75rem];
  }
}

.wallet-list {
  @apply w-[25rem];

  @include phone-width {
    @apply w-full;
  }
}

.wallet-bg-image {
  @apply mb-[1.25rem];
  border-radius: 0.625rem;
  background-image: url("../../../assets/images/wallet-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  color: $text-light-color;

  &:last-child {
    @apply mb-0;
  }
}
</style>
