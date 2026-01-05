<template>
  <q-btn flat :ripple="false" class="no-ripple px-1">
    <div class="btn-balance normal-case font-bold">
      <div class="active-wallet" v-if="activeWallet">
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
      <q-btn class="deposit-btn mobile-deposit-btn" @click.stop="handleDeposit">{{ $t("common.btn.deposit") }}</q-btn>
    </div>
    <q-menu dark :offset="[0, 10]" anchor="bottom right" self="top right">
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
                <div class="currency-amt">
                  <span class="currency-country">{{ getWalletLabel(userWalletMap[key][WALLET_TYPE.Enums.Cash]) }}</span>
                  <span>{{ moneyFormat(userWalletMap[key][WALLET_TYPE.Enums.Cash].balance) }}</span>
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
import { useRouter } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { WALLET_TYPE } from "src/common/utils/constants"

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
const router = useRouter()

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
  router.push({
    name: "DepositWithdrawal",
    query: { type: "deposit" }
  })
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";

.btn-balance {
  @apply flex items-center w-auto h-[2rem] text-black font-extrabold py-[.3125rem] px-[.5rem] text-[.75rem];
  text-transform: uppercase;
  border-radius: 1.25rem;

  @include iphone-pro-width() {
    @apply pl-[.25rem] pr-[.125rem];
  }
}

.active-wallet {
  @apply flex gap-2 items-center mr-1 rounded-[.625rem] pl-4 h-[2.5rem] text-base;
  background: $charcoal-dark-bg;
  color: $text-white;

  .refresh-icon {
    @apply cursor-pointer mr-2;
  }

  .deposit-btn {
    @apply rounded-[.625rem] text-white h-[2.4rem];
    background: $primary-color;
  }

  @include pad-large-width() {
    @apply hidden;
  }
}

.mobile-deposit-btn {
  @apply hidden whitespace-nowrap;

  @include pad-large-width() {
    @apply block text-white rounded-[.625rem] h-[2.4rem] max-w-[5.25rem];
    background: $primary-color;
  }

  @include iphone-width() {
    line-height: 2rem;
  }
}

.dropdown-menu {
  border: 0.0625rem solid $primary-color;
  padding: 0.3125rem;
  border-radius: 0.5rem;
  min-width: 18.75rem;
  transform: translate3d(0rem, 0rem, 0rem) !important;
}

.currency-wrap {
  margin: 0 auto;
}

.currency-head {
  @apply grid text-white text-center;
  grid-template-columns: 40% 60%;
}

.currency-head .pref {
  @apply text-[.875rem];
  background: $primary-color;
  border-radius: 0.3125rem 0 0 0rem;
  padding: 0.3125rem 0.625rem;
}

.currency-head .bal {
  @apply text-[.875rem] ml-[.1875rem];
  background: $primary-color;
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
}

.currency-country {
  color: #fff;
  font-weight: bold;
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
}

.af-amt {
  height: auto;
  overflow: hidden;
}

.af-amt label {
  @apply grid items-center justify-between;
  grid-template-columns: 40% 60%;
  background: $medium-navy-bg;
  margin-bottom: 0.1875rem;
  padding: 0.25rem;
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
