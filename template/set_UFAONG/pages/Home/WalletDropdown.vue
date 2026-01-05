<template>
  <q-btn flat :ripple="false" class="no-ripple px-1">
    <div class="btn-balance normal-case font-bold">
      <span class="mr-1 min-w-10">{{ $t("game.balance") }}</span>
      <span class="bln-ico" @click.stop="getBalance">
        <i :class="{ 'fas fa-sync-alt': !isSpinning, 'fas fa-sync-alt fa-spin': isSpinning }"></i>
      </span>
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
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { ref } from "vue"
import { WALLET_TYPE } from "src/common/utils/constants"

const { moneyFormat } = useCommon()
const { activeWalletCurrencyCode, userWalletMap, getWalletLabel, setUserActiveWallet, getUserWalletList } =
  useUserInfo()

const isSpinning = ref(false)
const getBalance = () => {
  isSpinning.value = true
  setTimeout(() => {
    getUserWalletList()
    isSpinning.value = false
  }, 1000)
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";

.btn-balance {
  @apply flex items-center w-auto h-[32px] text-black font-extrabold py-[5px] px-[8px] text-[.75rem];
  background: $gradient-to-bottom;
  text-transform: uppercase;
  border-radius: 1.25rem;

  &:hover {
    @apply text-white;
  }
}

.dropdown-menu {
  background: #011422;
  border: 0.0625rem solid $primary;
  padding: 0.3125rem;
  border-radius: 0.5rem;
  min-width: 18.75rem;
  transform: translate3d(0px, 0px, 0px) !important;
}

.currency-wrap {
  margin: 0 auto;
}

.currency-head {
  display: grid;
  grid-template-columns: 40% 60%;
  text-align: center;
}

.currency-head .pref {
  background: $gradient-to-bottom;
  color: #000;
  border-radius: 0.3125rem 0 0 0rem;
  padding: 0.3125rem 0.625rem;
  font-size: 0.875rem;
}

.currency-head .bal {
  background: $gradient-to-bottom;
  color: #000000;
  border-radius: 0 0.3125rem 0 0;
  padding: 0.3125rem 0.625rem;
  margin-left: 0.1875rem;
  font-size: 0.875rem;
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
  box-shadow: inset 0px 0px 5px #fff;
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
  background: $gradient-to-bottom;
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
  align-items: center;
  justify-content: space-between;
  display: grid;
  grid-template-columns: 40% 60%;
  background: #4d4d4d;
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
  background: #9faab7;
}

.option-input:checked {
  background: $gradient-to-bottom;
}

.option-input:checked::before {
  display: flex;
  content: "\f00c";
  width: 1.875rem;
  height: 1.875rem;
  font-size: 1.125rem;
  font-weight: bold;
  position: absolute;
  align-items: center;
  justify-content: center;
  color: #000;
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
