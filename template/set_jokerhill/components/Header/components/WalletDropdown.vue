<template>
  <q-select
    v-model="activeCurrencyId"
    :options="walletDropdown"
    @update:model-value="handleWalletChange"
    map-options
    dense
    borderless
    behavior="menu"
    class="wallet-select"
    ref="selectRef"
    dropdown-icon="keyboard_arrow_down"
    :menu-offset="[0, 5]"
  >
    <template #selected>
      <div v-if="inUseWallet" class="wallet_title flex flex-nowrap justify-between items-center w-full">
        <span class="balance">{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0") }}</span>
        <span class="currency_code">{{ activeWalletLabel }}</span>
      </div>
    </template>
    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps" class="wallet_list">
        <q-item-section side class="pup_checkbox">
          <q-checkbox :model-value="selected" @update:model-value="toggleOption(opt)" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="pup_balance">{{ opt.label.split(" ")[0] }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="pup_currency">{{ opt.label.split(" ")[2] }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:after>
      <q-btn round dense flat class="wallet wallet_pc" @click="goDeposit"> {{ $t("common.btn.wallet") }}</q-btn>
      <q-btn round dense flat icon="wallet" class="wallet wallet_m" @click="goDeposit"></q-btn>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
import type { QSelect } from "quasar"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { computed, ref, watchEffect } from "vue"
import { useRouter } from "vue-router"
import { WALLET_TYPE } from "src/common/utils/constants"

type WalletDropItem = {
  label: string
  value: number
}

const router = useRouter()
const { moneyFormat } = useCommon()
const { activeWalletLabel, inUseWallet, userWalletMap, getWalletLabel, setUserActiveWallet } = useUserInfo()
const selectRef = ref<InstanceType<typeof QSelect> | null>(null)
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

function goDeposit() {
  router.push({ name: "MemberDeposit" })
}

watchEffect(() => {
  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    activeCurrencyId.value = inUseWallet.value[WALLET_TYPE.Enums.Cash].currency_id || 0
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.q-select__dialog
  background: red

$wallet-text: rgba(255,255,255,0.3)


.wallet_list
  background: #4b5d7f
  width: 200px
  +iphone-width
    width: 100%
    padding: 8px 4px
  :deep(.q-checkbox__inner)
    font-size: 26px
  :deep(.q-checkbox__bg)
    background-color: white
    border: 0
  :deep(.q-checkbox__inner--truthy .q-checkbox__bg)
    background: #6FCF97
  :deep(.q-checkbox__svg)
    color: black
    opacity: 0.7
  .pup_checkbox
    +phone-width
      padding-right: 0
  .pup_balance
    color: white
    opacity: 0.7
    font-size: 12px
  .pup_currency
    text-align: center
    margin-left: 16px
    color: white
    font-size: 12px

.wallet-select
  width: 250px

  .wallet_m
    display: none

  .wallet_title
    @apply pl-4
  .wallet
    border-radius: 0px 8px 8px 0px
    background: rgba(255, 255, 255, 0.20)
    color: white
    padding: 12px 10px 12px
    border-top-left-radius: 0
    border-bottom-left-radius: 0
    border-top-right-radius: 10px
    border-bottom-right-radius: 10px
    font-size: 10px
  .balance
    @apply text-sm text-white opacity-70
  .currency_code
    @apply text-xs text-white/30
  :deep(.q-field__after)
    padding: 0
    flex-wrap: wrap
  :deep(.q-field__inner)
    background: #4B5D7F
    border-top-right-radius: 0
    border-bottom-right-radius: 0
    border-top-left-radius: 10px
    border-bottom-left-radius: 10px
    padding-right: .625rem
    padding-top: 0.1rem
    .q-field__native
      color: $wallet-text
    .q-field__append
      color: #fff
  +iphone-width
    width: 186px
    :deep(.q-field__inner)
      padding-top: 0rem
      padding-right: 0rem
      padding-left: 0rem
      .q-field__control
        height: 28px
        min-height: 28px
        .q-field__append
          height: 28px
          min-height:28px
      .q-field__native
        @apply py-0 leading-none
        height: 28px
        min-height: 28px
    :deep(.q-field__after)
      height: 28px

    .wallet_m
      display: block

    .wallet_pc
      display: none
    .wallet_title
      @apply pl-2
    .balance
      @apply text-xs
    .currency_code
      @apply text-xs
    .wallet
      padding: 0
      margin-left: 0
      top: 0px
      font-size: 12px
      height: 28px

      :deep(.q-field__append)
        @apply pl-0
      :deep(.q-btn .q-spinner)
        font-size: 1.4em
      :deep(.q-select__dropdown-icon)
        font-size: 5vw
        width: 1em
        height: 0em
      :deep(.q-icon)
        line-height: 28px
</style>
