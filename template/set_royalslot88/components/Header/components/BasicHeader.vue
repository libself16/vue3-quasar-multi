<template>
  <div class="header-container">
    <!-- 使用者相關資訊內容 -->
    <div class="header-user-section">
      <div v-if="isLogin" class="avatar mobile-not-display">
        <Avatar />
      </div>
      <div class="user-operation mobile-not-display">
        <template v-if="!isLogin">
          <q-btn class="operation-btn register-btn" @click="openDialog('openRegister')">
            {{ $t("common.btn.register") }}
          </q-btn>
          <q-btn class="operation-btn login-btn" @click="openDialog('openLogin')">
            {{ $t("common.btn.login") }}
          </q-btn>
        </template>
        <template v-else>
          <p class="operation-btn user-name">{{ userInfo.username }}</p>
          <q-btn class="operation-btn login-btn" @click="Logout()">
            {{ $t("common.btn.logout") }}
          </q-btn>
        </template>
      </div>
      <div v-if="isLogin && inUseWallet" @click="openUserInfoDialog('openBalance')" class="balance-container">
        <div>
          {{ activeWalletLabel }}
          <i
            v-if="isMobile"
            @click.stop="getUserWalletList"
            class="fas fa-sync-alt refresh-icon"
            :class="{ active: isLoading }"
          ></i>
        </div>
        <div class="amount">
          <span>{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0") }}</span>
          <i
            v-if="!isMobile"
            @click.stop="getUserWalletList"
            class="fas fa-sync-alt refresh-icon"
            :class="{ active: isLoading }"
          ></i>
        </div>
      </div>
    </div>
    <!-- 使用者操作 Button -->
    <div class="header-actions-section">
      <div class="deposit-wrapper basic-image mobile-not-display">
        <div class="deposit-container">
          <div class="text-container">
            <span @click="openUserInfoDialog('openDeposit')" class="deposit-text">{{ $t("common.btn.deposit") }}</span>
            <span class="yellow-line"></span>
            <span @click="openUserInfoDialog('openWithdraw')" class="withdraw-text">{{
              $t("common.btn.withdraw")
            }}</span>
          </div>
          <div class="basic-image deposit-image"></div>
        </div>
      </div>
      <div @click="openUserInfoDialog('openInbox')" class="inbox-wrapper">
        <div class="basic-image inbox-image"></div>
      </div>
      <div @click="openSideMenu" class="side-menu">
        <div class="basic-image side-menu-image"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { Events } from "src/boot/eventbus/types"
import { useRouter } from "vue-router"
import { useCommon } from "src/common/hooks/useCommon"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import Avatar from "./Avatar.vue"

const { isLogin, handleLogout } = useAuth()
const { moneyFormat } = useCommon()
const { userInfo, inUseWallet, activeWalletLabel, getUserWalletList, isLoading } = useUserInfo()
const { isMobile } = useMediaQuery()
const eventbus = injectStrict(EventBusKey)
const router = useRouter()
const emit = defineEmits(["openSideMenu"])
const activeCurrencyId = ref(0)

const openDialog = (dialogName: keyof Events, value = true) => {
  eventbus.emit(dialogName, value)
}

const openSideMenu = () => {
  emit("openSideMenu")
}

const openUserInfoDialog = (action: keyof Events, value = true) => {
  if (isLogin.value) {
    eventbus.emit(action, value)
  } else {
    openDialog("openLogin")
  }
}

const Logout = async () => {
  await handleLogout()
  router.push({ name: "home" })
  window.location.reload()
}

watchEffect(() => {
  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    activeCurrencyId.value = inUseWallet.value[WALLET_TYPE.Enums.Cash].currency_id || 0
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "src/css/button.scss";
@import "../../../assets/css/btn.scss";

.header-container {
  @apply relative flex h-full w-full;

  &::after {
    content: "";
    @apply absolute bottom-[-0.375rem] z-20 flex h-[0.125rem] w-full;
    border-bottom: 0.25rem double rgb(199, 175, 127);
    box-shadow: rgb(97, 68, 36) 0rem 0.0625rem 0.125rem 0.0625rem;

    @include pad-width {
      background-color: #2196f3;
      height: 0.0625rem;
      bottom: 0;
      border-bottom: none;
    }
  }
}

.header-user-section {
  @apply flex h-full items-center justify-start gap-3 pl-2;
}

.header-actions-section {
  @apply flex h-full w-full justify-end gap-3;
}

.user-operation {
  @apply grid gap-2;
}

.user-name {
  text-transform: none;
}

.balance-container {
  @apply flex w-[14vw] cursor-pointer  justify-start gap-1 md:justify-between p-[0.5vw] text-white;
  background-color: #081c4c;
  border: 0.0625rem solid #6237f0;
  border-radius: 0.8vw;
  filter: drop-shadow(rgb(0, 0, 0) 0rem 0.375rem 0.25rem);
  font-size: 1.2vw;

  .refresh-icon {
    @apply ml-1 text-[#007bff];
    &.active {
      animation: 0.3s linear 0s 1 normal forwards running reFreshAni;
    }
  }

  @include phone-width {
    @apply flex-col gap-0;
    .amount {
      @apply flex items-center;
      span {
        max-width: 3rem;
      }
    }
  }

  @include pad-width {
    @apply w-[20vw] ml-[.3125rem];
    font-size: 2.2vw;
  }
}

.balance-amount {
  @apply flex items-center gap-1;
}

.balance-amount i {
  @apply text-[#007bff];
}

.basic-image {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  filter: drop-shadow(rgb(0, 0, 0) 0rem 0.375rem 0.25rem);
}

.deposit-wrapper {
  @apply flex h-[8vw] w-[17vw] justify-between;
  @apply translate-y-[.5vw];
  background-image: url(../../../assets/images/header/deposit_btn.png);
}

.deposit-container {
  @apply flex w-full pl-[2.3vw];
}

.deposit-image {
  @apply h-[7vw] w-[7vw] cursor-pointer flex-1;
  background-image: url(../../../assets/images/header/pig.png);
}

.text-container {
  @apply flex flex-1 flex-col items-center justify-center;
}

.deposit-text,
.withdraw-text {
  @apply cursor-pointer;
  font-size: 1.1vw;
  text-transform: uppercase;
}

.yellow-line {
  @apply flex h-[0.13vw] w-full;
  background-color: rgb(249 250 41);
}

.inbox-wrapper {
  @apply flex h-full items-center;
}

.inbox-image {
  @apply h-[5vw] w-[5vw] cursor-pointer;
  background-image: url(../../../assets/images/header/icon-inbox.png);

  @include pad-width {
    @apply h-[7vw] w-[7vw];
  }
}

.side-menu {
  @apply flex h-full items-center;
}

.side-menu-image {
  @apply h-[5vw] w-[5vw] cursor-pointer;
  background-image: url(../../../assets/images/header/icon-menu.png);

  @include pad-width {
    @apply h-[8vw] w-[8vw];
  }
}

.mobile-not-display {
  // PC 和 手機版橫式採用同一設計，不顯示 mobileHeaderNav
  // 手機直式時則使用顯示 mobileHeaderNav 樣式
  @media (orientation: portrait) {
    @include pad-width {
      display: none;
    }
  }
}

@media (orientation: landscape) {
  // 手機橫式
  @include pad-width {
    .header-container {
      @apply relative flex h-full w-full;

      &::after {
        background-color: inherit;
        height: 0.125rem;
        bottom: -0.5vw;
        border-bottom: 0.25rem double rgb(199, 175, 127);
      }
    }

    .header-user-section {
      ::v-deep(.q-avatar) {
        width: 7vw;
        height: 7vw;
      }
      .balance-container {
        @apply w-[14vw];
        font-size: 1.2vw;
      }

      .operation-btn {
        font-size: 0.6rem;
        height: auto;
        white-space: nowrap;
      }
    }

    .header-actions-section {
      gap: 0.5rem;

      .side-menu-image {
        @apply h-[5vw] w-[5vw];
      }

      .inbox-image {
        @apply h-[5vw] w-[5vw];
      }
    }
  }
}
</style>
