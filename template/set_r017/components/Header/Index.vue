<template>
  <div class="header" :class="{ fixed: !props.modelValue }">
    <div class="header-left">
      <div class="menu-toggle" :class="{ 'is-close': props.modelValue }">
        <img :src="svgIcon('menu-arrow')" alt="menu-arrow" @click="emit('update:modelValue', !props.modelValue)" />
      </div>
      <img v-if="getSquareLogo()" class="logo-img" :src="getSquareLogo()" @click="$router.push('/')" />
    </div>

    <div v-if="isUp.phone" class="header-center">
      <ul class="nav-bar" ref="navBarRef" @wheel="onWheelScroll">
        <li
          v-for="(cmsItem, cmsIndex) in navigationBarList"
          :key="cmsIndex"
          class="nav-item menuimg"
          :class="{
            active: isActive(cmsItem.Entrance[0])
          }"
        >
          <div class="navlink" @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })">
            {{ limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string) }}
          </div>
        </li>
      </ul>
    </div>

    <div class="header-right">
      <WalletDropdown v-if="isLogin" />

      <div v-if="!isLogin" class="gap-2 flex items-center justify-center flex-nowrap">
        <q-btn class="login-btn" color="primary" @click="showLoginOrRegister(0, $q.platform.is.mobile ? true : false)">
          {{ $t("common.btn.login") }}
        </q-btn>

        <q-btn
          class="register-btn"
          color="primary"
          @click="showLoginOrRegister(1, $q.platform.is.mobile ? true : false)"
        >
          {{ $t("common.btn.register") }}
        </q-btn>
      </div>

      <div v-if="isUp.phone && isLogin" class="gap-4 flex items-center justify-center">
        <q-btn flat fab-mini class="menuft">
          <img :src="svgIcon('user')" />
          <q-menu v-model="menuShow" class="!bg-transparent" :offset="[50, 10]">
            <q-list style="min-width: 200px" class="header-menu-list">
              <q-item clickable v-close-popup @click="router.push({ name: 'memberSummary' })">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('account')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.memberCenter") }}</p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="router.push({ name: 'MemberVip' })">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('vip')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.vip") }}</p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="router.push({ name: 'MemberDeposit' })">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('deposit')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.deposit") }}</p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="router.push({ name: 'MemberWithdraw' })">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('withdrawal')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.withdrawal") }}</p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="router.push({ name: 'history' })">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('history')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.history") }}</p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="router.push({ name: 'MemberOrder' })">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('order')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.order") }}</p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('logout')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.logout") }}</p>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn flat fab-mini class="menuft" @click="$router.push({ name: 'history' })">
          <img :src="svgIcon('history')" />
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { EventBusKey } from "src/symbols"
import { MENU } from "../../utils/constants"
import { useRouter, useRoute } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import { useCms } from "src/common/composables/useCms"
import { useCommon } from "src/common/hooks/useCommon"
import { useLogo } from "src/common/composables/useLogo"
import { injectStrict } from "src/common/utils/injectTyped"
import WalletDropdown from "./components/WalletDropdown.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useLanguage } from "src/common/composables/useLanguage"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { useEntranceHandler } from "app/template/set_r017/composables/useCms"

const props = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue", "changeLogin"])
const eventbus = injectStrict(EventBusKey)

const route = useRoute()
const router = useRouter()
const { isUp } = useMediaQuery()
const { svgIcon } = useSiteImg()
const { nowLang } = useLanguage()
const { getSquareLogo } = useLogo()
const { handleWheelScroll } = useCommon()
const { isLogin, handleLogout } = useAuth()
const { handleEntranceClick } = useEntranceHandler()
const { navigationBarList, handleCmsList } = useCms()

const menuShow = ref(false)
const navBarRef = ref<HTMLElement>()

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })
}

const showLoginOrRegister = (type: number, forcePasswordLogin = false) => {
  if (!type) {
    eventbus.emit("openLogin", true, forcePasswordLogin)
  } else {
    eventbus.emit("openRegister", true)
  }
}

const onWheelScroll = (event: WheelEvent) => {
  if (navBarRef.value) {
    handleWheelScroll(event, navBarRef.value)
  }
}

const limitWordLength = (word: string) => {
  if (!word || word.length === 0) return
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

const getRouterInfo = (did: string) => {
  return MENU.RouterNameMapping[did]
}

const isActive = (entrance: any) => {
  if (entrance.payload.game_type) {
    return route.params.gameType == entrance.payload.game_type
  }

  return route.name === getRouterInfo(entrance.payload.did)
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.NAVIGATION_BAR)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";

.header {
  z-index: 1;
  width: 100%;
  height: 4.25rem;
  position: relative;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $secondary05;
  flex-direction: row;
  padding: 1rem;

  @include phone-width {
    height: 3.6875rem;
    padding: 0.625rem 0.875rem;
  }

  @include pad-width {
    position: relative;
    width: 100%;
    background: #0d0000;
  }

  &.fixed {
    @include phone-width {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
  }

  .header-left {
    min-width: 11.5rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    @include phone-width {
      min-width: unset;
    }

    .menu-toggle {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      justify-content: flex-start;
      transition: left 0.2s ease 0s;
      margin-right: 0.75rem;
      z-index: 999;

      img {
        transform: rotate(0deg);
        transition: transform 0.2s ease 0s;
        cursor: pointer;
      }

      &.is-close {
        img {
          transform: rotate(180deg);
        }
      }
    }

    .logo-img {
      height: 100%;
      cursor: pointer;

      @include phone-width {
        max-width: 8.25rem;
        height: auto;
        max-height: 100%;
      }

      :deep(.q-btn__content) {
        justify-content: flex-start;
      }
    }
  }

  .header-center {
    height: 100%;
    flex: 1;
    overflow: hidden;
    min-width: 0;
    margin: 0 1rem;

    .nav-bar {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow-x: auto;

      li {
        height: 100%;
        cursor: pointer;
        position: relative;
        margin: 0 1.375rem;
        font-weight: 400;
        font-size: 1rem;
        user-select: none;
        color: $neutral01;
        white-space: nowrap;
        display: flex;
        align-items: center;
        &.active {
          color: $primany01;
          font-weight: 500;
          &::before {
            position: absolute;
            background: $primany01;
            bottom: 0;
            content: "";
            height: 0.1875rem;
            width: 100%;
          }
        }
        .navlink {
          display: flex;
          align-items: center;
          height: 100%;
        }
      }
      // nav-bar滾動條樣式
      &::-webkit-scrollbar {
        height: 0.25rem;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 0.125rem;
        &:hover {
          background: transparent;
        }
      }
    }
  }

  .header-right {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-end;
    color: $neutral01;
    gap: 1.5rem;
    margin-right: 1rem;

    @include phone-width {
      gap: 0;
      margin-right: 0;
    }

    .login-btn {
      border-radius: 4px;
      border: 2px solid $primany01;
      color: $primany01 !important;
      background: transparent !important;
    }

    .register-btn {
      border-radius: 4px;
      color: $neutral01 !important;
      background: $gradient01 !important;
    }
  }
}

.header-menu-list {
  @apply uppercase text-sm;
  color: $neutral01;
  border-radius: 4px;
  background: $secondary01;
  padding: 0.5rem 0;

  :deep(.q-item) {
    // padding: 8px 32px;

    .q-item__section {
      display: flex;
      justify-content: flex-start;
      flex-direction: row;

      .home-title-icon {
        width: 1.2rem;
      }

      p {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
