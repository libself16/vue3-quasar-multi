<template>
  <q-select
    v-model="activeCurrencyId"
    :options="walletDropdown"
    @update:model-value="handleWalletChange"
    map-options
    dense
    rounded
    borderless
    dark
    class="wallet-select"
  >
    <template #selected>
      <div v-if="inUseWallet">
        <span>{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance) }}</span>
        <span class="text-white ml-2">{{ activeWalletLabel }}</span>
      </div>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { WALLET_TYPE } from "src/common/utils/constants"

type WalletDropItem = {
  label: string
  value: number
}
const { moneyFormat } = useCommon()
const { activeWalletLabel, inUseWallet, userWalletMap, getWalletLabel, setUserActiveWallet } = useUserInfo()

const activeCurrencyId = ref(0)
const walletDropdown = computed<WalletDropItem[]>(() => {
  return Object.keys(userWalletMap.value).map((e) => {
    const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
    const label = `${moneyFormat(cashWallet.balance)}  ${getWalletLabel(cashWallet)}`
    const value = cashWallet.currency_id
    return { label, value }
  })
})
function handleWalletChange(value: WalletDropItem) {
  setUserActiveWallet(value.value)
}

watchEffect(() => {
  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    activeCurrencyId.value = inUseWallet.value[WALLET_TYPE.Enums.Cash].currency_id || 0
  }
})
</script>

<style lang="sass" scoped>
@import "app/template/set49/assets/css/_variable.scss"

$wallet-text: rgba(255,255,255,0.3)
.wallet-select
  :deep(.q-field__inner )
    background: #0F0F10
    border-radius: .5rem
    padding-left: .625rem
    padding-right: .625rem
    .q-field__native
      color: $wallet-text
    .q-field__append
      color: $wallet-text
</style>
