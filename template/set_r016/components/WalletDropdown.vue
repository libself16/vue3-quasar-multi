<template>
  <div class="wallet-wrapper">
    <q-select
      v-model="activeCurrencyId"
      :options="walletDropdown"
      @update:model-value="handleWalletChange"
      map-options
      dense
      rounded
      borderless
      stack-label
      behavior="menu"
      class="wallet-select"
      :readonly="isSingleWalletCurrency"
      popup-content-class="no-border"
      :label="$t('common.btn.wallet')"
    >
      <template #selected>
        <div v-if="inUseWallet && inUseWallet[WALLET_TYPE.Enums.Cash]">
          <!-- <span class="text-gray-500 ml-2 text-bold">{{ activeWalletLabel }}</span> -->
          <span class="selected-value">{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance) }}</span>
        </div>
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" class="option-item">
          <q-item-section class="option-section no-border">
            <span :style="{ color: scope.opt.labelColor, minWidth: '50px', marginRight: '8px' }">
              {{ scope.opt.label.title }}
            </span>
            <span :style="{ color: scope.opt.valueColor }">
              {{ scope.opt.label.subtitle }}
            </span>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <div v-if="inUseWallet && inUseWallet[WALLET_TYPE.Enums.Bonus]" class="wallet-bonus">
      <div class="wallet-bonus-title">{{ $t("common.btn.giftCode") }}</div>
      <div class="wallet-bonus-value">{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Bonus].balance) }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { WALLET_TYPE } from "src/common/utils/constants"
import { computed, ref, watchEffect } from "vue"

type WalletDropItem = {
  label: {
    title: any
    subtitle: any
  }
  value: number
  labelColor: string
  valueColor: string
}
const { moneyFormat } = useCommon()
const { activeWalletLabel, inUseWallet, userWalletMap, isSingleWalletCurrency, getWalletLabel, setUserActiveWallet } =
  useUserInfo()

const activeCurrencyId = ref(0)
const walletDropdown = computed<WalletDropItem[]>(() => {
  return Object.keys(userWalletMap.value).map((e) => {
    const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
    // const label = `${getWalletLabel(cashWallet)}${moneyFormat(cashWallet.balance)}`
    const labelPart = getWalletLabel(cashWallet)
    const balancePart = moneyFormat(cashWallet.balance)
    const value = cashWallet.currency_id
    const colorItem = {
      labelColor: "rgb(107, 114, 128)", // label 顏色
      valueColor: "#000" // value 顏色
    }
    return {
      value,
      label: {
        title: labelPart,
        subtitle: balancePart
      },
      ...colorItem
    }
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
@import "app/template/set_r016/assets/css/_variable.scss"
@import "src/common/css/_variable.sass"

$wallet-text: rgba(0,0,0,0.3)

.wallet-wrapper
  @apply flex flex-nowrap gap-[.375rem]
  +phone-width
    @apply  flex-wrap

.no-border
  border: none !important
  box-shadow: none !important
.wallet-select
  min-width: 10rem
  border-radius: 10px
  background: #F9E8E8
  display: flex
  flex-direction: column
  justify-content: center
  align-items: flex-start
  gap: 6px
  align-self: stretch
  height: 70px
  :deep(.q-field__inner )
    .q-field__control
      padding: 10px
      align-items: center
    .q-field__native
      color: $wallet-text
      margin-top: 6px
      .selected-value
        +fontStyle(1.5rem, 700, 1.75rem)
        color: $neutral10
    .q-field__append
      color: $neutral10
    .q-field__label
      color: #A80707
      font-family: Helvetica
      font-size: .875rem
      font-style: normal
      font-weight: 700
      line-height: normal
      text-transform: capitalize
      transform: translateY(-30%) scale(1)
      top: 4px
  &.q-field--readonly
    :deep(.q-field__append )
      display: none
  +phone-width
    @apply flex-grow min-w-max
    margin: 0 !important
.option-item
  background: #F9E8E8
  margin: 0px
  +iphone-width
    margin: 10px
  .option-section
    width: 100%
    padding: 0px
    display: flex
    justify-content: flex-start
    flex-direction: row
.wallet-bonus
  @apply p-[.625rem] rounded-[.625rem]
  min-width: 10rem
  background: $primary01
  height: 70px
  +phone-width
    @apply flex-grow min-w-max
  .wallet-bonus-title
    color: #A80707
    text-transform: capitalize
    +fontStyle(.875rem, 700, 1rem)
  .wallet-bonus-value
    +fontStyle(1.5rem, 700, 1.75rem)
    color: $neutral10
    margin-top: .375rem
</style>
