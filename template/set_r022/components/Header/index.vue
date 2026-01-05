<template>
  <q-header>
    <div class="header-area">
      <div class="header-area-left">
        <img :src="resultImages('header/menu.png')" class="menu-btn" @click="toggleDrawer" />
        <img v-if="getWideLogo()" class="logo" :src="getWideLogo()" @click="$router.push('/')" />
      </div>

      <div class="header-area-center">
        <div v-if="!isLargeTablet" class="center-left-area">
          <div
            v-for="(cmsItem, cmsIndex) in navigationBarList"
            :key="cmsIndex"
            class="nav-item"
            :class="{
              active: isActive(cmsItem.Entrance[0])
            }"
            @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
          >
            {{ limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string) }}
          </div>
        </div>
        <div class="center-right-area">
          <template v-if="isLogin">
            <WalletDropdown />

            <div v-if="isCash" @click="goToPage('deposit')" class="deposit-btn">
              <span>{{ $t("common.btn.deposit") }}</span>
            </div>
          </template>
          <template v-else>
            <q-btn class="login-btn" color="primary" @click="showLoginOrRegister(0, isLargeTablet ? true : false)">
              {{ $t("common.btn.login") }}
            </q-btn>
            <q-btn
              v-if="isCash"
              class="register-btn"
              color="primary"
              @click="showLoginOrRegister(1, isLargeTablet ? true : false)"
            >
              {{ $t("common.btn.register") }}
            </q-btn>
          </template>
        </div>
      </div>

      <div v-if="!isLargeTablet" class="header-area-right">
        <img
          :src="resultImages(`header/inbox${isLogin ? '-active' : ''}.png`)"
          class="inbox-img"
          @click="handlerClickUser('inbox')"
        />

        <div class="user-info">
          <img
            :src="resultImages(`header/profile${isLogin ? '-active' : ''}.png`)"
            class="user-info-img"
            @click="handlerClickUser()"
          />
          <div v-if="isLogin" class="user-info-modal">
            <template v-for="(item, index) in userInfoModalList" :key="index">
              <div
                v-if="item.isShow"
                class="user-info-modal-item"
                :class="{ logout: index + 1 === userInfoModalList.length }"
                @click="item.handlerEvent"
              >
                <img v-if="!!item.imgUrl" :src="resultImages(`header/${item.imgUrl}`)" />
                {{ item.label }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </q-header>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { EventBusKey } from "src/symbols"
import { MENU } from "../../utils/constants"
import { onMounted, computed } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { useRoute, useRouter } from "vue-router"
import WalletDropdown from "./WalletDropdown.vue"
import { useAuth } from "src/common/hooks/useAuth"
import { useCms } from "src/common/composables/useCms"
import { useLogo } from "src/common/composables/useLogo"
import { injectStrict } from "src/common/utils/injectTyped"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useLanguage } from "src/common/composables/useLanguage"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useEntranceHandler } from "app/template/set_r022/composables/useCms"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { isCash } = useEnv()
const { getWideLogo } = useLogo()
const { nowLang } = useLanguage()
const { isLargeTablet } = useMediaQuery()
const { isLogin, handleLogout } = useAuth()
const { resultImages } = useSiteImg()
const { handleEntranceClick } = useEntranceHandler()
const { navigationBarList, handleCmsList } = useCms()
const { isTelegramMiniApp, closeMiniApp } = useTelegram()

const eventbus = injectStrict(EventBusKey)

const emits = defineEmits(["update:modelValue", "toggle-drawer"])

const toggleDrawer = () => {
  emits("toggle-drawer")
}

const userInfoModalList = computed(() => {
  return [
    {
      label: t("menu.profile"),
      imgUrl: "modal-profile.png",
      handlerEvent: () => router.push({ name: "memberProfile" }),
      isShow: true
    },
    {
      label: t("common.btn.wallet"),
      imgUrl: "modal-wallet.png",
      handlerEvent: () => handlerOpenDepositDialog(),
      isShow: isCash.value
    },
    {
      label: t("menu.history"),
      imgUrl: "modal-history.png",
      handlerEvent: () => router.push({ name: "history" }),
      isShow: true
    },
    {
      label: t("menu.logout2"),
      imgUrl: "",
      handlerEvent: () => handlerLogout(),
      isShow: true
    }
  ]
})

const showLoginOrRegister = (type: number, forcePasswordLogin = false) => {
  if (!type) {
    eventbus.emit("openLogin", true, forcePasswordLogin)
  } else {
    eventbus.emit("openRegister", true)
  }
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

const limitWordLength = (word: string) => {
  if (!word || word.length === 0) return
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

const handlerOpenDepositDialog = () => {
  eventbus.emit("openDepositWithWithdrawal", true, "deposit")
}

const handlerLogout = async () => {
  await handleLogout()
  router.push({ name: "home" })

  if (isTelegramMiniApp.value) closeMiniApp()
}

const goToPage = (name: string) => {
  eventbus.emit("openDepositWithWithdrawal", true, name)
}

const handlerClickUser = (type?: string) => {
  if (!isLogin.value) {
    eventbus.emit("openLogin", true, isLargeTablet.value ? true : false)
    return
  }

  if (type) {
    router.push({ name: "memberInbox" })
  }
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.NAVIGATION_BAR)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.q-header {
  @apply fixed;
}

.header-area {
  width: 100%;
  height: 3.125rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-headerbottom);
  border-bottom: 1px solid var(--neutral-07);
  padding-right: 3.125rem;

  @include pad-large-width {
    padding-right: 0.75rem;
  }

  .header-area-left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-width: 15.25rem;
    padding-left: 3.125rem;
    flex: 1;

    @include pad-large-width {
      padding-left: 0.75rem;
      min-width: auto;
    }

    .menu-btn {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.5rem;
      cursor: pointer;
    }

    .logo {
      height: 2rem;
      cursor: pointer;
    }
  }

  .header-area-center {
    max-width: 87.5rem;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @include pad-large-width {
      max-width: unset;
      width: fit-content;
    }

    .center-left-area {
      height: 100%;
      display: flex;
      justify-content: end;
      align-items: center;

      .nav-item {
        display: flex;
        height: 100%;
        cursor: pointer;
        position: relative;
        margin-right: 1.625rem;
        font-weight: 400;
        font-size: 1rem;
        white-space: nowrap;
        color: var(--primary-02);
        display: flex;
        align-items: center;
        justify-content: center;

        &.active {
          color: var(--primary-01);

          &::before {
            position: absolute;
            background: var(--primary-01);
            bottom: 0;
            content: "";
            height: 0.125rem;
            width: 100%;
          }
        }
      }
    }

    .center-right-area {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 3rem;

      @include pad-large-width {
        width: 100%;
        padding-right: 0;
        justify-content: flex-end;
      }

      .login-btn {
        border: 1px solid var(--primary-01);
        border-radius: 1.5rem;
        padding: 0.25rem 0.75rem;
        background: var(--primary-04) !important;
        color: var(--primary-01) !important;
        margin-right: 0.5rem;
        cursor: pointer;

        &::before {
          box-shadow: none !important;
        }
      }

      .register-btn,
      .deposit-btn {
        border-radius: 1.5rem;
        padding: 0.25rem 0.75rem;
        background: var(--primary-01) !important;
        color: var(--text-01);
        cursor: pointer;

        &::before {
          box-shadow: none !important;
        }
      }
    }
  }

  .header-area-right {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      cursor: pointer;
      width: 1.76rem;
      height: 1.76rem;
      max-width: unset;
    }

    .user-info {
      position: relative;
      margin-left: 1.5rem;

      &:hover {
        .user-info-modal {
          display: block;
        }
      }

      .user-info-modal {
        display: none;
        position: absolute;
        right: -2.9rem;
        background: var(--primary-07);
        padding: 1.0625rem;
        border-radius: 0.5rem;
        border: 1px solid var(--neutral-03);
        z-index: 100;

        .user-info-modal-item {
          width: 11.715625rem;
          background: var(--neutral-02);
          padding: 0.625rem;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
          cursor: pointer;
          color: var(--secondary-01);
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;

          &.logout {
            margin-bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--neutral-03);
            color: var(--emotional-danger-01);
          }

          img {
            width: 1.25rem;
            height: 1.25rem;
            margin-right: 0.625rem;
          }
        }
      }
    }
  }
}
</style>
