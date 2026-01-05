<template>
  <q-header>
    <q-toolbar class="header-toolbar">
      <div class="header-logo-wrapper">
        <button class="menu-btn" @click="toggleDrawer">
          <i class="fas fa-bars logo-icon"></i>
        </button>
        <img :src="getWideLogo()" class="header-logo" alt="header-logo" lazy-load @click="handleLogoClick" />
      </div>
      <div class="header-info-wrapper">
        <template v-if="!isLogin">
          <q-btn class="header-btn login-btn" @click="openDialog('openLoginWithRegister', true, 'login')">
            {{ $t("common.btn.login") }}
          </q-btn>
          <q-btn class="header-btn signup-btn" @click="openDialog('openLoginWithRegister', true, 'register')">
            {{ $t("home.signUp") }}
          </q-btn>
        </template>
        <template v-else>
          <WalletDropdown />
          <UserMenuDropdown
            :username="accountInfo.fullname || accountInfo.nickname || accountInfo.account"
            :userMenuItems="userMenuItems"
            @selectItem="handleMenuSelect"
          />
        </template>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts" setup>
import { getUserMenuItems, UserMenuValue } from "app/template/set_ed8888/composables/userMenuItems"
import { Events } from "src/boot/eventbus/types"
import { useBank } from "src/common/composables/useBank"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useLogo } from "src/common/composables/useLogo"

import UserMenuDropdown from "./UserMenuDropdown.vue"
import WalletDropdown from "./WalletDropdown.vue"

const { t } = useI18n()
const { isLogin, handleLogout } = useAuth()
const eventbus = injectStrict(EventBusKey)
const { accountInfo, getUserWalletList, getAccountInfo } = useUserInfo()
const router = useRouter()
const { needWithdrawalPassword } = useBank()
const userMenuItems = getUserMenuItems(t, needWithdrawalPassword.value)
const { getWideLogo } = useLogo()

// 開闔 Drawer
const emits = defineEmits(["toggle-drawer"])
const toggleDrawer = () => {
  emits("toggle-drawer")
}

const openDialog = (dialogName: keyof Events, value = true, type?: string) => {
  eventbus.emit(dialogName, value, type)
}

const menuActions = {
  deposit: () => openDialog("openDepositWithWithdrawal", true, "deposit"),
  withdrawal: () => openDialog("openDepositWithWithdrawal", true, "withdrawal"),
  history: () => openDialog("openHistory", true),
  pending: () => openDialog("openPendingTransaction", true),
  changePassword: () => openDialog("openChangePassword", true),
  profile: () => openDialog("openProfile", true),
  inbox: () => openDialog("openInbox", true),
  bankDetails: () => openDialog("openAddBankCard", true),
  setWithdrawalPassword: () => openDialog("openSetWithdrawalPassword", true),
  logout: () => {
    handleLogout()
    router.push({ name: "Home" })
  }
} as const

type MenuActionKey = keyof typeof menuActions

const handleMenuSelect = (value: UserMenuValue) => {
  const action = menuActions[value as MenuActionKey]
  if (action) {
    action()
  }
}

const handleLogoClick = () => {
  router.push({ name: "Home" })
}

onMounted(() => {
  getUserWalletList()
  getAccountInfo()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/_variable.scss";

.q-header {
  @apply h-[4rem] px-6;
  background: $header-bg-color;

  @include pad-large-width() {
    @apply z-[3001];
    padding: 0 0.6875rem;
  }

  :deep(.q-toolbar) {
    @apply p-0 h-full;
  }
}

.header-toolbar {
  @apply flex justify-between items-center;

  .header-logo-wrapper {
    @apply flex items-center gap-[.9375rem];

    @include phone-width() {
      @apply gap-0;
    }

    .menu-btn {
      @apply border-none text-[2.1875rem] bg-clip-text text-transparent;
      background: $pink-button-gradient;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .logo-icon {
      @apply font-black;
    }

    .header-logo {
      @apply w-[12.9375rem] h-full cursor-pointer;

      @include pad-large-width() {
        @apply w-[10.5rem];
      }
      @include iphone-width() {
        @apply w-[10rem];
        margin-left: 0.625rem;
      }
    }
  }

  .header-info-wrapper {
    @apply flex items-center gap-[.625rem];

    .header-btn {
      @apply text-[.75rem] font-bold text-white whitespace-nowrap h-[2.75rem];
      border-radius: 1.5625rem;
      min-width: fit-content;
    }

    .login-btn {
      @apply w-[4.6875rem];
      border: 2px solid $pink-shadow-color;
    }

    .signup-btn {
      @apply w-[5rem];
      background: $pink-button-gradient;
    }

    @include pad-large-width() {
      @apply gap-0;
      justify-content: flex-end;

      .login-btn {
        @apply mr-1;
      }
    }
  }
}
</style>
