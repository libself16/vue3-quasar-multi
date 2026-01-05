<template>
  <template v-if="isLogin && inUseWallet">
    <div>
      <div class="index-al-name">
        {{ userInfo.username }}
        <div class="h-8 ml-1">
          <img v-if="currentVIP && currentVIP.img" class="w-full h-full" :src="currentVIP.img" />
        </div>
      </div>
      <div class="balance-container" @click="openWalletDropdown">
        <div class="balance-label">{{ activeWalletLabel }}</div>
        <div :class="{ 'opacity-40': isLoading }">
          {{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0") }}
        </div>
        <q-btn
          @click="getUserWalletList"
          :loading="isLoading"
          size=".5rem"
          flat
          dense
          icon="fa-solid fa-arrows-rotate"
        />
      </div>
    </div>
  </template>
  <template v-else>
    <a @click="router.push({ name: 'Login' })" class="index-login-btn">{{ $t("common.btn.loginAndRegister") }}</a>
  </template>

  <q-dialog v-model="walletDialogOpened" position="bottom" class="z-[6002]">
    <q-card class="bg-[#f4faff]">
      <q-card-section class="bg-white mb-2" @click="walletDialogOpened = false">
        <div class="text-lg text-[#2599f8]">{{ $t("common.btn.cancel") }}</div>
      </q-card-section>
      <q-list separator class="bg-white">
        <q-item
          clickable
          v-ripple
          v-for="wallet in walletDropdown"
          :key="wallet.value"
          @click="handleWalletChange(wallet)"
        >
          <q-item-section>
            <div class="flex items-center">
              <q-item-label class="wallet-label" :class="{ 'text-primary': wallet.value === activeCurrencyId }">
                {{ wallet.label }}
              </q-item-label>
              <q-item-label caption :class="{ 'text-primary': wallet.value === activeCurrencyId }">
                {{ wallet.balance }}
              </q-item-label>
            </div>
          </q-item-section>
          <q-item-section side v-if="wallet.value === activeCurrencyId">
            <q-icon size="1rem" color="primary" name="fa-solid fa-check" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watchEffect, onMounted } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useAuth } from "src/common/hooks/useAuth"
import { useRouter } from "vue-router"
import { useCommon } from "src/common/hooks/useCommon"
import { useVip } from "src/common/composables/useVip"

const { isLogin } = useAuth()
const router = useRouter()
const {
  isLoading,
  userInfo,
  activeWalletLabel,
  inUseWallet,
  userWalletMap,
  getWalletLabel,
  setUserActiveWallet,
  getUserWalletList
} = useUserInfo()
const { moneyFormat } = useCommon()
const { handleVipList, memberVipList } = useVip()

const walletDialogOpened = ref(false)
const activeCurrencyId = ref(0)

const currentVIP = computed(() => {
  if (!memberVipList.value || !memberVipList.value.length) return null
  if (!userInfo.value || !userInfo.value.member_level) return null

  const result = memberVipList.value.find((e) => e.id === userInfo.value.member_level)
  if (!result) return null

  return result
})

const walletDropdown = computed(() => {
  return Object.keys(userWalletMap.value).map((e) => {
    const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
    const label = getWalletLabel(cashWallet)
    const balance = moneyFormat(cashWallet.balance || "0")
    const value = cashWallet.currency_id
    return { label, balance, value }
  })
})

const openWalletDropdown = () => {
  walletDialogOpened.value = true
}

const handleWalletChange = (wallet) => {
  setUserActiveWallet(wallet.value)
  walletDialogOpened.value = false
}

// Watch for active wallet changes
watchEffect(() => {
  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    activeCurrencyId.value = inUseWallet.value[WALLET_TYPE.Enums.Cash].currency_id || 0
  }
})

onMounted(async () => {
  await handleVipList()
})
</script>

<style lang="scss" scoped>
@import "app/template/set_6M88/assets/css/_variable.scss";

.index-login-btn {
  @apply flex items-center justify-center font-bold relative overflow-hidden;
  @apply rounded-[3.125rem] h-[2.5rem] w-[40%] cursor-pointer;
  background: linear-gradient(180deg, #36e3ff 0%, #2393ff 100%);
  color: #fff;
  font-size: 0.875rem;
  white-space: nowrap;
  font-family: "Open Sans";

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -75%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-25deg);
    animation: shine 4s infinite;
  }
}

@keyframes shine {
  0% {
    left: -75%;
  }
  25% {
    left: 125%;
  }
  100% {
    left: 125%;
  }
}

.balance-container {
  @apply flex py-[.375rem] px-[.625rem] justify-center items-center;
  @apply gap-[.25rem] rounded-full mt-1 cursor-pointer;
  background: $primary;
  color: $neutral01;
}

.wallet-label {
  min-width: 2.5rem;
  margin-right: 0.25rem;
}
</style>
