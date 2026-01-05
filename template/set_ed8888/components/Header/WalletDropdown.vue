<template>
  <q-btn flat :ripple="false" class="no-ripple px-1">
    <div class="btn-balance normal-case font-bold">
      <template v-if="activeWallet">
        <!-- PC -->
        <div class="active-wallet">
          <span class="active-code">
            {{ activeWalletLabel }}
          </span>
          <span class="active-balance">
            {{ moneyFormat(activeWallet.balance) }}
          </span>
          <span class="refresh-icon" @click.stop="getBalance">
            <i :class="{ 'fas fa-sync-alt': !isSpinning, 'fas fa-sync-alt fa-spin': isSpinning }"></i>
          </span>
          <q-btn class="deposit-btn" @click.stop="handleDeposit">{{ $t("common.btn.deposit") }}</q-btn>
        </div>

        <!-- Mobile -->
        <q-btn class="deposit-btn mobile-deposit-btn">{{ $t("member.withdrawal.balance") }}</q-btn>
      </template>
    </div>
    <q-menu
      dark
      :offset="[0, 10]"
      anchor="bottom right"
      self="top right"
      class="menu-area"
      :class="{ '!bg-transparent !shadow-none': isLargeTablet }"
    >
      <div class="dropdown-menu">
        <div class="currency-wrap">
          <div class="currency-head">
            <div class="pref">{{ $t("game.preferred") }}</div>
            <div class="bal">{{ $t("game.balance") }}</div>
          </div>
          <div class="af-currency">
            <div class="af-amt">
              <label v-for="key in Object.keys(userWalletMap)" :key="key">
                <input
                  type="radio"
                  class="option-input radio"
                  name="example"
                  :checked="userWalletMap[key][WALLET_TYPE.Enums.Cash].currency_code === activeWalletCurrencyCode"
                  @click="setUserActiveWallet(userWalletMap[key][WALLET_TYPE.Enums.Cash].currency_id)"
                />
                <input
                  type="checkbox"
                  name="example"
                  class="mobile-option-input"
                  :checked="userWalletMap[key][WALLET_TYPE.Enums.Cash].currency_code === activeWalletCurrencyCode"
                  @click="setUserActiveWallet(userWalletMap[key][WALLET_TYPE.Enums.Cash].currency_id)"
                />
                <div class="currency-amt">
                  <span class="currency-country">{{ getWalletLabel(userWalletMap[key][WALLET_TYPE.Enums.Cash]) }}</span>
                  <span class="currency-amount">
                    {{ moneyFormat(userWalletMap[key][WALLET_TYPE.Enums.Cash].balance) }}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { WALLET_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { moneyFormat } = useCommon()
const {
  activeWalletLabel,
  activeWalletCurrencyCode,
  userWalletMap,
  getWalletLabel,
  setUserActiveWallet,
  getUserWalletList
} = useUserInfo()
const isSpinning = ref(false)
const { isLargeTablet } = useMediaQuery()
const eventbus = injectStrict(EventBusKey)

const activeWallet = computed(() => {
  if (!userWalletMap || !Object.keys(userWalletMap).length) return null
  for (const key of Object.keys(userWalletMap.value)) {
    const wallet = userWalletMap.value[key][WALLET_TYPE.Enums.Cash]
    if (wallet?.currency_code === activeWalletCurrencyCode.value) {
      return wallet
    }
  }
  return null
})

const getBalance = () => {
  isSpinning.value = true
  setTimeout(() => {
    getUserWalletList()
    isSpinning.value = false
  }, 1000)
}

const handleDeposit = () => {
  eventbus.emit("openDepositWithWithdrawal", true, "deposit")
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/_variable.scss";

.btn-balance {
  @apply flex items-center w-auto h-[2rem] text-black font-extrabold py-[.3125rem] px-[.5rem] text-[.75rem];
  text-transform: uppercase;
  border-radius: 1.25rem;

  @include pad-large-width() {
    width: 100%;
  }

  @include iphone-pro-width() {
    @apply pl-[.25rem] pr-[.125rem];
  }
}

.active-wallet {
  @apply flex gap-2 items-center mr-1 rounded-[.625rem] text-white pl-4 h-[2.5rem] text-base;
  background: $primary-color;

  .refresh-icon {
    @apply cursor-pointer mr-2;

    i {
      color: $pink-shadow-color !important;
    }
  }

  .deposit-btn {
    @apply rounded-[.625rem] text-white h-[2.4rem];
    background: $pink-button-gradient;
  }

  @include pad-large-width() {
    @apply hidden;
  }
}

.mobile-deposit-btn {
  @apply rounded-[.625rem] text-white h-[2.4rem];
  background: $pink-button-gradient;
  display: none;
  margin-right: 0.375rem;
  font-size: 1rem;

  @include pad-large-width() {
    display: flex;
  }
}

.dropdown-menu {
  background: $primary-color;
  border: 0.0625rem solid $primary-color-light;
  padding: 0.3125rem;
  border-radius: 0.5rem;
  min-width: 18.75rem;
  transform: translate3d(0rem, 0rem, 0rem) !important;

  @include pad-large-width() {
    background: #1c1e22;
    padding: 0.875rem 1.0625rem;
    border-radius: 0.625rem;
    border: none;
  }
}

.currency-wrap {
  margin: 0 auto;
}

.currency-head {
  @apply grid text-white text-center;
  grid-template-columns: 40% 60%;

  @include pad-large-width() {
    display: none;
  }
}

.currency-head .pref {
  @apply text-[.875rem];
  background: $primary-color-light;
  border-radius: 0.3125rem 0 0 0rem;
  padding: 0.3125rem 0.625rem;
}

.currency-head .bal {
  @apply text-[.875rem] ml-[.1875rem];
  background: $primary-color-light;
  border-radius: 0 0.3125rem 0 0;
  padding: 0.3125rem 0.625rem;
}

.currency-row {
  display: flex;
  display: grid;
  grid-template-columns: 40% 60%;
  text-align: center;
  margin: 0.1875rem 0;
}

.currency-radio {
  background: #4d4d4d;
  padding: 0.3125rem;
  text-align: center;
  display: flex;
  justify-content: center;
}

.currency-amt {
  display: flex;
  justify-content: space-between;
  padding: 0.3125rem;
  margin-left: 0.1875rem;

  @include pad-large-width() {
    width: 100%;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.7);
  }
}

.currency-country {
  color: #fff;
  font-weight: bold;

  @include pad-large-width() {
    order: 1;
    font-size: 0.75rem;
  }
}

.currency-amount {
  @include pad-large-width() {
    font-size: 0.75rem;
  }
}

.currency-radio input[type="radio"] {
  position: absolute;
  visibility: hidden;
}

.currency-wrap table {
  color: #fff;
}

.crc-btn-wrap {
  display: flex;
  text-align: center;
  justify-content: center;
  gap: 0.3125rem;
  padding: 0.625rem 0;
}

.crc-close-btn {
  background: #c22323;
  color: #fff;
  font-weight: 800;
  text-transform: uppercase;
  border: none;
  border-radius: 0.625rem;
  width: 6.875rem;
  height: 1.875rem;
  font-size: 0.8125rem;
  box-shadow: inset 0rem 0rem 0.3125rem #fff;
}

.crc-save-btn {
  color: #fff;
  font-weight: 800;
  text-transform: uppercase;
  border: none;
  border-radius: 0.625rem;
  width: 6.875rem;
  height: 1.875rem;
  font-size: 0.8125rem;
  margin-right: 0.3125rem;
  box-shadow: inset 0 0 0.3125rem #fff;
}

.af-currency {
  margin-top: 0.3125rem;

  @include pad-large-width() {
    margin-top: 0;
  }
}

.af-amt {
  height: auto;
  overflow: hidden;

  @include pad-large-width() {
    gap: 0.75rem;
    display: grid;
  }
}

.af-amt label {
  @apply grid items-center justify-between;
  grid-template-columns: 40% 60%;
  background: $primary-color-light;
  margin-bottom: 0.1875rem;
  padding: 0.25rem;

  @include pad-large-width() {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: transparent;
    padding: 0;
  }
}

.option-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -o-appearance: none;
  appearance: none;
  position: relative;
  top: 0;
  right: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 1.875rem;
  width: 1.875rem;
  transition: all 0.15s ease-out 0s;
  background: #cbd1d8;
  border: none;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  margin-right: 0.5rem;
  outline: none;
  position: relative;
  z-index: 50;

  @include pad-large-width() {
    display: none;
  }
}

.option-input:hover {
  background: $wallet-checked-color;
}

.option-input:checked {
  background: $wallet-checked-color;
}

.option-input:checked::before {
  @apply flex text-white items-center justify-center absolute font-bold;
  content: "\f00c";
  width: 1.875rem;
  height: 1.875rem;
  font-size: 1.125rem;
  font-family: "Font Awesome 5 Free";
}

.option-input:checked::after {
  -webkit-animation: click-wave 0.65s;
  -moz-animation: click-wave 0.65s;
  animation: click-wave 0.65s;
  background: #40e0d0;
  content: "";
  display: block;
  position: relative;
  z-index: 100;
}

.option-input.radio {
  border-radius: 50%;
}

.option-input.radio::after {
  border-radius: 50%;
}

.mobile-option-input {
  display: none;

  @include pad-large-width() {
    display: block;
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -o-appearance: none;
    appearance: none;
    height: 1rem;
    width: 1rem;
    transition: all 0.15s ease-out 0s;
    background: #f2f2f2;
    border: none;
    cursor: pointer;
    display: inline-block;
    margin-right: 0.5rem;
    outline: none;
    position: relative;
    z-index: 50;

    &:checked {
      background: #6fcf97;

      &::before {
        @apply flex  items-center justify-center absolute font-bold;
        content: "\f00c";
        height: 0.9rem;
        width: 0.9rem;
        font-size: 0.9rem;
        font-family: "Font Awesome 5 Free";
        color: #1c1e22;
      }
    }
  }
}

@keyframes click-wave {
  0% {
    height: 2.5rem;
    width: 2.5rem;
    opacity: 0.35;
    position: relative;
  }

  100% {
    height: 12.5rem;
    width: 12.5rem;
    margin-left: -5rem;
    margin-top: -5rem;
    opacity: 0;
  }
}

.fa-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
