<template>
  <q-header>
    <q-toolbar class="header-toolbar">
      <div class="header-logo-wrapper">
        <button class="menu-btn" @click="toggleDrawer">
          <q-img
            :src="isDrawerOpen ? headerCloseDrawer : headerOpenDrawer"
            class="menu-btn-icon"
            alt="menu-btn-icon"
            fit="contain"
            lazy-load
          />
        </button>
        <q-img
          :src="getWideLogo()"
          class="header-logo"
          alt="header-logo"
          fit="scale-down"
          lazy-load
          @click="handleLogoClick"
        />
      </div>
      <div class="header-info-wrapper">
        <template v-if="!isLogin">
          <q-btn class="header-btn login-btn" @click="openDialog('openLoginWithRegister', true, 'login')">{{
            $t("common.btn.login")
          }}</q-btn>
          <q-btn class="header-btn signup-btn" @click="openDialog('openLoginWithRegister', true, 'register')">{{
            $t("home.signUp")
          }}</q-btn>
        </template>
        <template v-else>
          <WalletDropdown />
          <UserMenuDropdown
            :username="userInfo.username"
            :userMenuItems="userMenuItems"
            @selectItem="handleMenuSelect"
          />
        </template>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { getUserMenuItems, UserMenuValue } from "app/template/set_DBO88/composables/userMenuItems"
import { Events } from "src/boot/eventbus/types"
import { useBank } from "src/common/composables/useBank"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useLogo } from "src/common/composables/useLogo"
import { useSiteImg } from "app/template/set_DBO88/hooks/useSiteImg"
import UserMenuDropdown from "./UserMenuDropdown.vue"
import WalletDropdown from "./WalletDropdown.vue"

const { t } = useI18n()
const { isLogin, handleLogout } = useAuth()
const eventbus = injectStrict(EventBusKey)
const { userInfo, getUserWalletList, getUserInfo } = useUserInfo()
const router = useRouter()
const { needWithdrawalPassword } = useBank()
const userMenuItems = getUserMenuItems(t, needWithdrawalPassword.value)
const { getWideLogo } = useLogo()
const { headerOpenDrawer, headerCloseDrawer } = useSiteImg()

// 開闔 Drawer
const isDrawerOpen = ref(false)
const emits = defineEmits(["toggle-drawer"])
const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
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
  getUserInfo()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";

.q-header {
  @apply h-[4rem] px-6 relative;
  background: $dark-charcoal-bg;

  @include pad-large-width() {
    @apply px-3;
  }

  :deep(.q-toolbar) {
    @apply p-0 h-full;
  }

  &::before {
    content: "";
    @apply absolute top-0 left-0 w-[20rem] h-[4.875rem];
    background-image: url("app/template/set_DBO88/assets/images/Header/menu-bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;

    @include pad-large-width() {
      display: none;
    }
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

    .menu-btn-icon {
      @apply w-[2.3125rem] h-[.875rem];
    }

    .header-logo {
      @apply w-[12.9375rem] h-full max-h-[3.875rem] cursor-pointer;

      @include pad-large-width() {
        @apply w-[10.5rem];
      }
      @include iphone-width() {
        @apply max-w-[5.5rem] ml-4;
      }
    }
  }

  .header-info-wrapper {
    @apply flex items-center gap-[.625rem];

    .header-btn {
      @apply text-[.75rem] font-bold whitespace-nowrap h-[2.75rem] rounded-[.625rem];
      min-width: fit-content;
      color: $text-white;
    }

    .login-btn {
      @apply w-[4.6875rem];
      background: $login-button-bg;
    }

    .signup-btn {
      @apply w-[5rem];
      background: $register-button-bg;
    }

    @include pad-large-width() {
      @apply gap-0;

      .login-btn {
        @apply mr-1;
      }
    }
  }
}
</style>
