<template>
  <q-btn flat :ripple="false" class="no-ripple px-0">
    <span v-if="inUseWallet" class="bln-balance normal-case font-bold">
      <span class="mr-2">
        {{ `${$t("common.btn.point")} : ${balanceFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0")}` }}
      </span>
      <span class="bln-ico" @click.stop="getBalance">
        <i :class="{ 'fas fa-sync-alt': !isSpinning, 'fas fa-sync-alt fa-spin': isSpinning }"></i>
      </span>
    </span>
    <q-menu dark :offset="[120, 10]" anchor="bottom right" self="top right">
      <div v-if="inUseWallet" class="dropdown-menu">
        <div class="remark-container">
          <div class="remark-row h5-flex-column">
            <div class="title">{{ $t("common.btn.point") }}：</div>
            <div>
              <div>
                <span class="w-20 mr-2 inline-block">{{ $t("common.btn.point") }}</span>
                <span>{{ balanceFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0") }}</span>
              </div>
              <div v-if="showBonusWallet">
                <span class="w-20 mr-2 inline-block">{{ $t("common.btn.bonus") }}</span>
                <span>{{ balanceFormat(inUseWallet[WALLET_TYPE.Enums.Bonus].balance || "0") }}</span>
              </div>
            </div>
          </div>
          <div class="remark-row" v-html="userRemark"></div>
        </div>
        <!-- <div class="currency-wrap">
          <div class="currency-head">
            <div class="pref">{{ $t("game.preferred") }}</div>
            <div class="bal">{{ $t("game.balance") }}</div>
          </div>
          <div class="af-currency">
            <div class="af-amt">
              <label v-for="(currency, key) in userWalletList" :key="key">
                <input
                  type="radio"
                  class="option-input radio"
                  name="example"
                  :checked="currency.currency_code === activeWalletCurrencyCode"
                  @click="setUserActiveWallet(currency.currency_id)"
                />
                <div class="currency-amt">
                  <span class="currency-country">{{ currency.currency_code }}</span>
                  <span>{{ balanceFormat(currency.balance) }}</span>
                </div>
              </label>
            </div>
          </div>
        </div> -->
      </div>
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnv, AGENT_CODE_LIST } from "src/common/hooks/useEnv"
import { WALLET_TYPE } from "src/common/utils/constants"

const { moneyFormat } = useCommon()
const { envData, isCredit, showBonusWallet } = useEnv()
const {
  userWalletList,
  inUseWallet,
  activeWalletCurrencyCode,
  userRemark,
  getUserWalletList,
  setUserActiveWallet,
  getUserRemark
} = useUserInfo()

const isSpinning = ref(false)
const getBalance = () => {
  isSpinning.value = true
  setTimeout(() => {
    getUserWalletList()
    if (isCredit.value) {
      getUserRemark()
    }
    isSpinning.value = false
  }, 1000)
}
const balanceFormat = (balance: string) => {
  if (envData().agentCode === AGENT_CODE_LIST.SAMJ) {
    return moneyFormat(parseInt(`${balance}`))
  }
  return moneyFormat(balance)
}

watchEffect(() => {
  if (isCredit.value) {
    getUserRemark()
  }
})
</script>

<style lang="scss" setup>
@import "src/common/css/_variable.sass";
@import "app/template/set_amuse/assets/css/_variable.sass";

.bln-ico {
  color: $gold-color;
}
.bln-balance {
  color: $gold-color;
  text-transform: uppercase;
  border: none;
  border-radius: 20px;
  width: auto;
  min-width: 120px;
  height: 32px;
  display: flex;
  align-items: center;
  position: relative;
}
.dropdown-menu {
  background: #000;
  border: 1px solid $gold-color;
  padding: 5px;
  border-radius: 7px;
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
  display: grid;
  grid-template-columns: 40% 60%;
  /* display: flex; */
  text-align: center;
}

.currency-head .pref {
  background: linear-gradient(to bottom, $gold-color 0%, #5c5203 100%);
  color: #fff;
  border-radius: 5px 0px 0px 0px;
  padding: 5px 10px;
  font-size: 14px;
}

.currency-head .bal {
  background: linear-gradient(to bottom, $gold-color 0%, #5c5203 100%);
  color: #fff;
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
  color: $gold-color;
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
  background: rgba($color: #fff, $alpha: 0.1);
  margin-bottom: 3px;
  padding: 4px;
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
  position: relative;
  z-index: 1000;
}

.option-input:hover {
  background: #9faab7;
}

.option-input:checked {
  background: $primary-color;
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

.remark-container {
  background: rgba($color: #fff, $alpha: 0.1);
  margin: 0.3125rem;
  padding: 1rem 1.75rem;
  .remark-row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 1.25rem;
    text-align: left;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
    .title {
      margin-right: 0.625rem;
      color: $gold-color;
      font-weight: bold;
      text-transform: uppercase;
    }
    @include pad-width {
      &.h5-flex-column {
        @apply flex-col items-start;
      }
    }
  }
}
</style>
