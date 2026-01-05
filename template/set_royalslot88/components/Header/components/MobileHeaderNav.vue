<template>
  <nav class="mobile-header-nav">
    <div class="mobile-action-section">
      <div v-if="isLogin" class="avatar mobile-avatar">
        <Avatar />
      </div>
      <div class="mobile-user-info">
        <template v-if="!isLogin">
          <q-btn class="operation-btn login-btn" @click="openDialog('openLogin')">
            {{ $t("common.btn.login") }}
          </q-btn>
          <q-btn class="operation-btn register-btn" @click="openDialog('openRegister', false)">
            {{ $t("common.btn.register") }}
          </q-btn>
        </template>
        <template v-else>
          <p class="user-name">{{ userInfo.username }}</p>
          <q-btn class="operation-btn login-btn" @click="Logout()">
            {{ $t("common.btn.logout") }}
          </q-btn>
        </template>
      </div>
    </div>
    <div class="mobile-user-section">
      <q-btn class="operation-btn login-btn" @click="openDialog('openDeposit', true)">
        {{ $t("common.btn.deposit") }}
      </q-btn>
      <q-btn class="operation-btn login-btn" @click="openDialog('openWithdraw', true)">
        {{ $t("common.btn.withdraw") }}
      </q-btn>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { Events } from "src/boot/eventbus/types"
import { useRouter } from "vue-router"
import Avatar from "./Avatar.vue"

const { isLogin, handleLogout } = useAuth()
const { userInfo } = useUserInfo()

const eventbus = injectStrict(EventBusKey)
const router = useRouter()

const openDialog = (dialogName: keyof Events, requireLogin = true) => {
  if (requireLogin && !isLogin.value) {
    return eventbus.emit("openLogin", true)
  }

  eventbus.emit(dialogName, true)
}

const Logout = async () => {
  await handleLogout()
  router.push({ name: "home" })
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "../../../assets/css/btn.scss";

.mobile-header-nav {
  display: none;

  @include pad-width {
    @apply flex items-center justify-between border-b-[0.0625rem] border-solid border-[#2196f3] p-[0.375rem_0.375rem] absolute w-full z-[10];
    background-color: rgb(34 5 83);
    top: 16vw;
  }

  // .mobile-action-section {
  // }

  .mobile-action-section,
  .mobile-user-section {
    @apply flex;
  }

  .mobile-avatar-image {
    @apply w-[12vw] h-[12vw];
  }

  .mobile-user-info {
    @apply flex items-center justify-center gap-[.625rem];

    .user-name {
      @apply flex items-center justify-center w-full font-bold text-xl;
      padding: 0rem 2vw;
      font-size: clamp(0.4rem, 3vw, 1rem);
    }
  }

  .mobile-user-section {
    @apply gap-[.625rem];
  }
}

@media (orientation: landscape) {
  @include pad-width {
    .mobile-header-nav {
      @apply hidden;
    }
  }
}
</style>
