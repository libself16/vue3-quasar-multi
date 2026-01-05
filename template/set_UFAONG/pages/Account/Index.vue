<template>
  <div class="flex flex-col px-[10px]">
    <div class="user-wrapper flex">
      <div class="user-image"></div>
      <div class="user-info">
        <p class="user-name">{{ userInfo.username }}</p>
        <span class="user-email">Welcome Joining {{ companyName }}</span>
      </div>
    </div>
    <q-btn flat :ripple="false" class="currency-wrapper">
      <div class="currency-item">
        <div class="currency-title">{{ activeWalletLabel }}</div>
        <span>{{ balanceFormat(displayBalance) }}</span>
      </div>

      <q-menu dark :offset="[0, 10]" anchor="bottom middle" self="top middle">
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
                    <span class="currency-country">{{
                      getWalletLabel(userWalletMap[key][WALLET_TYPE.Enums.Cash])
                    }}</span>
                    <span>{{ moneyFormat(userWalletMap[key][WALLET_TYPE.Enums.Cash].balance) }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </q-menu>
    </q-btn>
    <div class="deposit-wrapper">
      <div class="deposit-item" @click="redirectionPage('Deposit')">
        <img :src="depositIcon" alt="deposit" />
        <span class="hover:text-white">{{ $t("common.btn.deposit") }}</span>
      </div>
      <div class="deposit-item" @click="redirectionPage('Withdraw')">
        <img :src="withdrawIcon" alt="withdraw" />
        <span class="hover:text-white">{{ $t("common.btn.withdraw") }}</span>
      </div>
    </div>
    <!-- <div v-if="isVipRewardsOpen" class="history-wrapper">
      <div class="transaction-history" @click="redirectionPage('Vip')">
        <img :src="vipIcon" alt="transaction" />
        <span class="hover:text-white">{{ $t("vip.vipRewards") }}</span>
      </div>
    </div> -->
    <div class="history-wrapper">
      <div class="transaction-history" @click="redirectionPage('TransactionHistory')">
        <img :src="transactionIcon" alt="transaction" />
        <span class="hover:text-white">{{ $t("menu.transactionHistory") }}</span>
      </div>
      <!-- <div class="white-border"></div>
      <div class="vip-exclusive"></div> -->
    </div>
    <div class="account-table">
      <div v-for="item in accountList" :key="item.routeName" class="list-item" @click="redirectionPage(item.routeName)">
        <div class="list-icon">
          <img :src="item.icon" alt="account" />
          <span class="list-name">{{ $t(item.name) }}</span>
        </div>
        <i class="fa-solid fa-angle-right"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"
import depositIcon from "../../assets/images/common/deposit.png"
import withdrawIcon from "../../assets/images/common/withdraw.png"
import transactionIcon from "../../assets/images/common/transaction.png"
import vipIcon from "../../assets/images/common/icon-route.png"
import bankDetailsIcon from "../../assets/images/common/bank-details.png"
import pendingTransactionIcon from "../../assets/images/common/pending.png"
import ChangePasswordIcon from "../../assets/images/common/change-password.png"
import notifyIcon from "../../assets/images/common/notify.png"
import { useEnv, AGENT_CODE_LIST } from "src/common/hooks/useEnv"
import { useCommon } from "src/common/hooks/useCommon"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useEnvInfoStore } from "src/stores/envStore"

const router = useRouter()
const { companyName, envData } = useEnv()
const { moneyFormat } = useCommon()
const {
  userInfo,
  inUseWallet,
  activeWalletLabel,
  userWalletMap,
  activeWalletCurrencyCode,
  setUserActiveWallet,
  getWalletLabel
} = useUserInfo()
const displayBalance = ref(0)
const { isVipRewardsOpen } = useEnvInfoStore()

const accountList = [
  { name: "menu.bankDetails", icon: bankDetailsIcon, routeName: "BankDetails" },
  { name: "menu.pendingTransaction", icon: pendingTransactionIcon, routeName: "PendingTransaction" },
  { name: "menu.changePassword", icon: ChangePasswordIcon, routeName: "ChangePassword" },
  { name: "menu.inbox", icon: notifyIcon, routeName: "Inbox" }
  // { name: "menu.referral", icon: referralIcon, routeName: "Referral" } // TODO: 尚未開放的功能(無 API)
]

const redirectionPage = (link: string) => {
  router.push({ name: link })
}

const animateBalance = () => {
  const startValue = 0
  const endValue = parseFloat(inUseWallet.value ? inUseWallet.value[WALLET_TYPE.Enums.Cash].balance : " 0")
  const duration = 1000
  const startTime = performance.now()

  function updateValue(currentTime: number) {
    const elapsedTime = currentTime - startTime
    if (elapsedTime < duration) {
      const progress = elapsedTime / duration
      displayBalance.value = Math.floor(startValue + progress * (endValue - startValue))
      requestAnimationFrame(updateValue)
    } else {
      displayBalance.value = endValue
    }
  }

  requestAnimationFrame(updateValue)
}

const balanceFormat = (balance: string | number) => {
  if (envData().agentCode === AGENT_CODE_LIST.SAMJ) {
    return moneyFormat(parseInt(`${balance}`))
  }
  return moneyFormat(balance)
}

watch(() => inUseWallet.value, animateBalance)

onMounted(() => {
  animateBalance()
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";

.user-wrapper {
  .user-image {
    @apply w-[55px] h-[55px] mr-2.5;
    background-image: url("../../assets/images/Vip/1-warrior.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .user-info {
    @apply flex flex-col justify-center;
    color: $primary;

    p {
      @apply text-base font-semibold;
    }

    span {
      @apply text-sm font-medium;
    }
  }
}

.currency-wrapper {
  background: #2b2b2b;
  background-size: 100% 100%;
  padding: 1rem;
  border-radius: 0.625rem;
  text-align: center;
  margin: 0.625rem 0;

  .currency-item {
    @apply font-medium;
    color: $primary;
    span {
      @apply text-white font-semibold;
      font-size: 1.125rem;
      transition: color 0.3s ease;
    }
  }
}

.dropdown-menu {
  background: #011422;
  border: 0.0625rem solid $primary;
  padding: 0.3125rem;
  border-radius: 0.5rem;
  min-width: 18.75rem;
  transform: translate3d(0px, 0px, 0px) !important;

  .currency-wrap {
    margin: 0 auto;

    .currency-head {
      display: grid;
      grid-template-columns: 40% 60%;
      text-align: center;

      .pref {
        background: $gradient-to-bottom;
        color: #000;
        border-radius: 0.3125rem 0 0 0rem;
        padding: 0.3125rem 0.625rem;
        font-size: 0.875rem;
      }

      .bal {
        background: $gradient-to-bottom;
        color: #000000;
        border-radius: 0 0.3125rem 0 0;
        padding: 0.3125rem 0.625rem;
        margin-left: 0.1875rem;
        font-size: 0.875rem;
      }
    }

    .af-currency {
      margin-top: 0.3125rem;

      .af-amt {
        height: auto;
        overflow: hidden;

        label {
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

          &.radio {
            border-radius: 50%;
            &::after {
              border-radius: 50%;
            }
          }

          &:hover {
            background: #9faab7;
          }

          &:checked {
            background: $gradient-to-bottom;
          }

          &:checked::before {
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

          &:checked::after {
            -webkit-animation: click-wave 0.65s;
            -moz-animation: click-wave 0.65s;
            animation: click-wave 0.65s;
            background: #40e0d0;
            content: "";
            display: block;
            position: relative;
            z-index: 100;
          }
        }

        .currency-amt {
          display: flex;
          justify-content: space-between;
          padding: 0.3125rem;
          margin-left: 0.1875rem;

          .currency-country {
            color: #fff;
            font-weight: bold;
          }
        }
      }
    }
  }
}

.deposit-wrapper {
  @apply flex justify-between items-center gap-[10px] cursor-pointer;
  color: $primary;

  .deposit-item {
    @apply flex w-full items-center justify-center gap-[10px] p-[10px];
    color: $primary;
    gap: 0.625rem;
    background: #2b2b2b;
    box-shadow: 0 0.1875rem 0.3125rem rgba(107, 123, 168, 0.25);
    border-radius: 0.625rem;

    img {
      @apply w-[35px] h-[35px];
    }
  }
}

.history-wrapper {
  @apply flex items-center text-center justify-evenly gap-[10px] cursor-pointer p-[10px] my-[10px];
  background: #2b2b2b;
  border-radius: 0.625rem;
  color: $primary;

  .transaction-history {
    @apply flex flex-col items-center gap-1;

    img {
      @apply w-[30px] h-[30px];
    }
  }

  .white-border {
    border-right: 0.125rem solid #eaeaea;
    height: 2.5rem;
  }
}

.account-table {
  @apply flex flex-col;
  background: #2b2b2b;
  box-shadow: 0 0.25rem 0.75rem 0 rgba(107, 123, 168, 0.25);
  padding: 0 1rem;

  .list-item {
    @apply flex items-center justify-between cursor-pointer;
    padding: 0.625rem 0.9375rem;
    color: $primary;
    border-bottom: 0.0625rem solid #eaeaea;

    &:hover {
      background: #343434;

      span {
        @apply text-white;
      }
    }

    &:last-child {
      border-bottom: none;
    }

    .list-icon {
      @apply gap-2 flex items-center;
      img {
        @apply w-[30px] h-[30px];
      }
      span {
        font-weight: 600;
      }
    }
  }
}
</style>
