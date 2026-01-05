<template>
  <div class="acc-wrap">
    <div class="flex justify-end">
      <q-btn :to="{ name: 'Profile' }" :label="$t('home.edit_info')" flat size="md" no-caps dense class="custom-btn">
        <template v-slot:default>
          <q-icon size=".75rem" name="fas fa-angle-right" class="ml-2" />
        </template>
      </q-btn>
    </div>

    <div class="acc-pic">
      <div class="acc-detail">
        <span class="acc-name">{{ userInfo.username }}</span>
        <span class="acc-num">Welcome joining 6M88</span>
      </div>
    </div>
    <div class="acc-wl-row mt-4">
      <q-btn :to="{ name: 'Deposit' }" class="custom-btn custom-rounded custom-shaow w-full py-3" unelevated no-caps>
        <q-img width="2rem" class="mr-2" :src="result('after-login/icon-deposit.png')" />
        <div>{{ $t("common.btn.deposit") }}</div>
      </q-btn>

      <q-btn :to="{ name: 'Withdraw' }" class="custom-btn custom-rounded custom-shaow w-full py-3" unelevated no-caps>
        <q-img width="2rem" class="mr-2" :src="result('after-login/icon-withdraw.png')" />
        <div>{{ $t("common.btn.withdraw") }}</div>
      </q-btn>
    </div>
    <div class="purple-wrap py-0 !pb-0">
      <div class="purple-inner-wrap wallet-currency">
        <div class="currency-title">{{ activeWalletLabel }}</div>
        <span>{{ balanceFormat(displayBalance) }}</span>
      </div>
    </div>
    <div class="purple-wrap py-0 !pb-0">
      <div class="purple-inner-wrap">
        <div class="wallet-list">
          <q-btn :to="{ name: 'TransactionHistory' }" class="custom-btn" unelevated no-caps>
            <q-img width="1.75rem" :src="result('after-login/transaction.png')" />
            <div class="w-full">{{ $t("common.btn.transactionHistory") }}</div>
          </q-btn>
        </div>
      </div>
    </div>
  </div>

  <div class="acc-link">
    <q-list separator>
      <template v-for="item in profileMenuList" :key="item.name">
        <q-item :to="{ name: item.name }" v-ripple class="custom-color" clickable>
          <q-item-section side>
            <q-img width="2rem" :src="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t(item.i18n) }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon size=".75rem" name="fas fa-angle-right" class="ml-2" />
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnv, AGENT_CODE_LIST } from "src/common/hooks/useEnv"
import { useSiteImg } from "app/template/set_6M88/hooks/useSiteImg"
import { onMounted, ref, watch } from "vue"
import { WALLET_TYPE } from "src/common/utils/constants"

const { userInfo, getUserInfo, inUseWallet, activeWalletLabel } = useUserInfo()
const { envData } = useEnv()
const { moneyFormat } = useCommon()
const { result } = useSiteImg()
const displayBalance = ref(0)

const balanceFormat = (balance: string | number) => {
  if (envData().agentCode === AGENT_CODE_LIST.SAMJ) {
    return moneyFormat(parseInt(`${balance}`))
  }
  return moneyFormat(balance)
}

const profileMenuList = [
  {
    icon: result("after-login/wallet.png"),
    i18n: "menu.bank",
    name: "BankDetails"
  },
  {
    icon: result("after-login/tpending.png"),
    i18n: "menu.pendingTransaction",
    name: "PendingTransaction"
  },
  {
    icon: result("after-login/changepassword.png"),
    i18n: "menu.password",
    name: "ChangePassword"
  },
  {
    icon: result("after-login/messaging.png"),
    i18n: "menu.inbox",
    name: "Inbox"
  }
  // {
  //   icon: result("after-login/referral.png"),
  //   i18n: "menu.referral",
  //   name: "Referral"
  // }
]

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

watch(() => inUseWallet.value, animateBalance)

onMounted(async () => {
  await getUserInfo()
  animateBalance()
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/custom.scss";
@import "../../assets/css/_variable.scss";

.wallet-currency {
  @apply flex flex-col items-center justify-center py-4 gap-1;
  color: $secondary;
  .currency-title {
    @apply text-sm;
    font-weight: 500;
  }
  span {
    @apply font-bold text-[16px];
  }
}
</style>
