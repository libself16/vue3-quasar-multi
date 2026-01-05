<template>
  <q-btn flat :ripple="false" class="no-ripple">
    <span v-if="inUseWallet" class="bln-balance normal-case font-bold">
      <span class="mr-4">
        {{ `${activeWalletLabel} : ${moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0")}` }}
      </span>
      <div class="bln-ico flex items-center" @click.stop="getBalance">
        <i :class="{ 'fas fa-sync-alt': !isSpinning, 'fas fa-sync-alt fa-spin': isSpinning }"></i>
      </div>
    </span>
    <q-menu dark :offset="[0, 10]" anchor="bottom right" self="top right">
      <div class="dropdown-menu">
        <div class="currency-wrap">
          <div class="currency-head">
            <div class="pref rounded-tl-lg">{{ $t("game.preferred") }}</div>
            <div class="bal">{{ $t("game.balance") }}</div>
          </div>
          <div class="af-currency">
            <div class="af-amt">
              <label v-for="key in Object.keys(userWalletMap)" :key="key" :class="{'checked-currency': userWalletMap[key][WALLET_TYPE.Enums.Cash].currency_code === activeWalletCurrencyCode}">
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
import { WALLET_TYPE } from "src/common/utils/constants"
import { ref } from "vue"

const { moneyFormat } = useCommon()
const {
  activeWalletLabel,
  activeWalletCurrencyCode,
  inUseWallet,
  userWalletMap,
  getWalletLabel,
  setUserActiveWallet,
  getUserWalletList
} = useUserInfo()

const isSpinning = ref(false)
const getBalance = () => {
  isSpinning.value = true
  setTimeout(() => {
    getUserWalletList()
    isSpinning.value = false
  }, 1000)
}
</script>

<style lang="scss" setup>
.bln-ico {
  position: absolute;
  color: #fff;
  right: 0;
  margin: 0 10px;
}
.bln-balance {
  background: rgba(72, 16, 16, 1);
  color: #fff;
  font-weight: 800;
  text-transform: uppercase;
  border: none;
  border-radius: 20px;
  width: auto;
  min-width: 120px;
  height: 32px;
  font-size: 11px;
  padding: 7px 15px;
  display: flex;
  align-items: center;
  position: relative;
}
.dropdown-menu {
  background: rgba(61, 2, 2, 1);
  border: 1px solid rgba(209, 68, 68, 1);
  padding: 5px;
  border-radius: 5px;
  min-width: 300px;
  right: 0px !important;
  left: auto !important;
  top: 42px !important;
  transform: translate3d(0px, 0px, 0px) !important;
}

.currency-wrap {
  margin: 0 auto;
}

.currency-head {
  @apply font-bold grid grid-cols-5 gap-1;
  color: #fff;
  /* display: flex; */
  text-align: center;
}

.currency-head .pref {
  @apply col-span-2;
  background: linear-gradient(180deg, rgba(215, 47, 47, 1) 0%, rgba(143, 0, 0, 1) 100%);
  border-radius: 5px 0px 0px 0px;
  padding: 5px 10px;
  font-size: 14px;
}

.currency-head .bal {
  @apply col-span-3;
  background: linear-gradient(180deg, rgba(215, 47, 47, 1) 0%, rgba(143, 0, 0, 1) 100%);
  border-radius: 0px 5px 0px 0px;
  padding: 5px 10px;
  margin-left: 3px;
  font-size: 14px;
}

.currency-row {
  display: flex;
  display: grid;
  grid-template-columns: 40% 60%;
  text-align: center;
  margin: 3px 0px;
}

.currency-radio {
  background: #1b2d39;
  padding: 5px;
  text-align: center;
  display: flex;
  justify-content: center;
}

.currency-amt {
  display: flex;
  justify-content: space-between;
  padding: 5px;
  margin-left: 3px;
  /* background: #08192b; */
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
  gap: 5px;
  padding: 10px 0px;
}

.crc-close-btn {
  background: #c22323;
  color: #fff;
  font-weight: 800;
  text-transform: uppercase;
  border: none;
  border-radius: 10px;
  width: 110px;
  height: 30px;
  font-size: 13px;
  box-shadow: inset 0px 0px 5px #fff;
}

.crc-save-btn {
  color: #fff;
  font-weight: 800;
  text-transform: uppercase;
  border: none;
  border-radius: 10px;
  width: 110px;
  height: 30px;
  font-size: 13px;
  margin-right: 5px;
  background: linear-gradient(to bottom, rgba(169, 211, 32, 1) 0%, rgba(56, 131, 18, 1) 100%);
  box-shadow: inset 0px 0px 5px #fff;
}

.af-currency {
  margin-top: 5px;
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
  background: #1b2d39;
  margin-bottom: 3px;
  padding: 4px;
  &.checked-currency {
    background: rgba(121, 15, 15, 1);
  }
}

.option-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -o-appearance: none;
  appearance: none;
  position: relative;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 30px;
  width: 30px;
  transition: all 0.15s ease-out 0s;
  background: #cbd1d8;
  border: none;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  margin-right: 0.5rem;
  outline: none;
  z-index: 1000;
}

.option-input:hover {
  background: #9faab7;
}

.option-input:checked {
  background: #97c618;
}

.option-input:checked::before {
  width: 30px;
  height: 30px;
  display: flex;
  content: "\f00c";
  font-size: 18px;
  font-weight: bold;
  position: absolute;
  align-items: center;
  justify-content: center;
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
    height: 40px;
    width: 40px;
    opacity: 0.35;
    position: relative;
  }

  100% {
    height: 200px;
    width: 200px;
    margin-left: -80px;
    margin-top: -80px;
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
