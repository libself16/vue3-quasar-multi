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
    ref="selectRef"
    :dropdown-icon="isCash ? 'keyboard_arrow_down' : 'null'"
  >
    <template #selected>
      <div v-if="inUseWallet" class="flex flex-nowrap justify-between items-center w-full">
        <span class="balance">{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0") }}</span>
        <span class="text-white ml-2 mr-1 currency_code wallet_m">{{ activeWalletLabel }}</span>
      </div>
    </template>
    <template v-slot:option="{ itemProps, opt }">
      <!-- <template v-slot:option="{ itemProps, opt, selected, toggleOption }"> -->
      <q-item v-bind="itemProps" class="wallet_list">
        <!-- <q-item-section side class="pup_checkbox">
          <q-checkbox :model-value="selected" @update:model-value="toggleOption(opt)" />
        </q-item-section> -->
        <q-item-section>
          <q-item-label class="pup_balance ml-8">{{ opt.label.split(" ")[0] }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="pup_currency mr-8">{{ opt.label.split(" ")[2] }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:after>
      <q-btn round dense flat class="wallet wallet_pc" @click="openPopup">
        {{ isCash ? $t("common.btn.wallet") : $t("common.btn.point") }}
      </q-btn>

      <q-btn round dense flat icon="wallet" class="wallet wallet_m" @click="openPopup" />
    </template>
  </q-select>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect, nextTick } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import type { QSelect } from "quasar"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useEnv } from "src/common/hooks/useEnv"

type WalletDropItem = {
  label: string
  value: number
}
const { moneyFormat } = useCommon()
const { activeWalletLabel, inUseWallet, userWalletMap, getWalletLabel, setUserActiveWallet } = useUserInfo()
const { isCash, isCredit } = useEnv()

const selectRef = ref<InstanceType<typeof QSelect> | null>(null)
const activeCurrencyId = ref(0)

const walletDropdown = computed<WalletDropItem[]>(() => {
  if (isCredit.value) return []

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

function openPopup() {
  nextTick(() => {
    if (selectRef.value) {
      selectRef.value.showPopup()
    }
  })
}

watchEffect(() => {
  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    activeCurrencyId.value = inUseWallet.value[WALLET_TYPE.Enums.Cash].currency_id || 0
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set49/assets/css/_variable.scss"

$wallet-text: rgba(255,255,255,0.3)
.wallet_list
  display: flex
  justify-content: center
  width: 200px
  background: $primary-btn-bg
  +phone-width
    @apply w-full
    padding: 8px 2px
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
  width: 200px
  .wallet_m
    display: none

  .wallet
    background-color: $primary-btn-bg
    color: white
    padding: 12px 10px 12px
    border-top-left-radius: 0
    border-bottom-left-radius: 0
    border-top-right-radius: 10px
    border-bottom-right-radius: 10px
    font-size: 10px
  .balance
    padding-left: 1rem
    padding-right: 5.1rem
    color: white
    opacity: 0.7
  :deep(.q-field__after)
    padding: 0
    flex-wrap: wrap


  :deep(.q-field__inner )
    background: #0F0F10
    border-top-right-radius: 0
    border-bottom-right-radius: 0
    border-top-left-radius: 10px
    border-bottom-left-radius: 10px
    padding-right: .625rem
    padding-top: 0.1rem
    .q-field__native
      color: $wallet-text
    .q-field__append
      color: $wallet-text
  +iphone-width
    width: 40vw

    :deep(.q-field__inner )
      padding-top: 0rem
    .wallet_m
      display: block

    .wallet_pc
      display: none
    .balance
      padding-left: 0.3rem
      padding-right: 0.5rem
      font-size: 2.7vw
      +phone-width
        padding-right: 0
        font-size: 10px
    .currency_code
      font-size: 2.7vw
      +phone-width
        font-size: 10px
    .wallet
      padding: 7px 0
      top: 0px
      font-size: 14px
      :deep(.q-btn .q-spinner)
        font-size: 1.4em
    :deep(.q-select__dropdown-icon)
      font-size: 5vw
      width: 0em
      height: 0em
</style>
