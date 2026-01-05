<template>
  <div class="aside-menu" :class="{ open: drawerOpen }">
    <div class="menu-content">
      <div class="menu-header" @click="closeMenu">
        <i class="fa-solid fa-arrow-left"></i>
      </div>
      <nav class="menu-nav">
        <div
          v-for="(cmsItem, cmsIndex) in fliterDisplayDeviceAndLogin"
          :key="cmsIndex"
          class="menu-item"
          @click="handleEntranceClick(cmsItem.Entrance[0])"
        >
          <img :src="cmsItem.Setting.icon_path" />
          <span>{{ limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string) }}</span>
        </div>
        <div v-if="isLogin" class="menu-item logout-btn" @click="logout()" :loading="isLoading">
          <img :src="logoutIcon" alt="Logout" />
          <span>{{ $t("common.btn.logout") }}</span>
        </div>
        <div v-if="!isLogin" class="login-btn" @click="redirectionLoginRegisterPage('Login')">
          {{ $t("common.btn.login") }}
        </div>
        <div v-if="!isLogin" class="join-btn" @click="redirectionLoginRegisterPage('Register')">
          {{ $t("common.btn.join") }}
        </div>
      </nav>
    </div>
    <div class="menu-overlay" @click="closeMenu"></div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import homeIcon from "../../assets/images/AsideMenu/home.png"
import inboxIcon from "../../assets/images/AsideMenu/inbox.png"
import profileIcon from "../../assets/images/AsideMenu/profile.png"
import downloadIcon from "../../assets/images/AsideMenu/download.png"
import promotionIcon from "../../assets/images/common/promotion.png"
import termsIcon from "../../assets/images/AsideMenu/terms.png"
import contactIcon from "../../assets/images/AsideMenu/contact.png"
import aboutIcon from "../../assets/images/AsideMenu/about.png"
import logoutIcon from "../../assets/images/common/logout.png"
import privacyIcon from "../../assets/images/AsideMenu/privacy.png"
import responsibleGameIcon from "../../assets/images/AsideMenu/game.png"
import referralIcon from "../../assets/images/AsideMenu/referral.png"
import vipIcon from "../../assets/images/AsideMenu/vip.png"
import { useLanguage } from "src/common/composables/useLanguage"
import { useCms } from "src/common/composables/useCms"
import { useEntranceHandler } from "app/template/set_UFAONG/composables/useCms"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"

const drawerOpen = inject("drawerOpen") as import("vue").Ref<boolean>
const router = useRouter()
const { isLogin, handleLogout, isLoading } = useAuth()
const { navigationBarList, handleCmsList, fliterDisplayDeviceAndLogin } = useCms()
const { handleEntranceClick } = useEntranceHandler()
const { nowLang } = useLanguage()

const baseMenuItems = [
  { name: "menu.home", icon: homeIcon, route: "Home" },
  // { name: "menu.download", icon: downloadIcon, route: "Download" },
  { name: "menu.promotion", icon: promotionIcon, route: "Promotions" },
  { name: "common.tip.terms_conditions", icon: termsIcon, route: "TermsConditions" },
  { name: "home.contact_us", icon: contactIcon, route: "ContactUs" },
  { name: "menu.about_us", icon: aboutIcon, route: "AboutUs" },
  { name: "home.privacy_policy", icon: privacyIcon, route: "PrivacyPolicy" },
  { name: "home.responsible_gaming", icon: responsibleGameIcon, route: "ResponsibleGaming" }
]

const loggedInMenuItems = [
  { name: "menu.inbox", icon: inboxIcon, route: "Inbox" },
  { name: "menu.profile", icon: profileIcon, route: "Profile" }
  // TODO: 尚未開放的功能(無 API)
  // { name: "menu.referral", icon: referralIcon, route: "Referral" },
  // { name: "menu.vip", icon: vipIcon, route: "VIP" }
]

const menuItems = computed(() => {
  if (isLogin.value) {
    return [baseMenuItems[0], ...loggedInMenuItems, ...baseMenuItems.slice(1)]
  }
  return baseMenuItems
})

const closeMenu = () => {
  if (typeof drawerOpen.value !== "undefined") {
    drawerOpen.value = false
  }
}

const logout = async () => {
  await handleLogout()
  router.push({ name: "Login" })
}
const redirectionLoginRegisterPage = (type: string) => {
  router.push({ name: type })
}

const limitWordLength = (word: string) => {
  if (!word) return ""
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.MENU)
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";

.aside-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  pointer-events: none;
  z-index: 20;
}

.menu-content {
  @apply w-full max-w-[250px] h-full overflow-y-auto pointer-events-auto p-[10px];
  background-color: $dark-bg;
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
}

.menu-header {
  @apply flex justify-end items-center cursor-pointer;
  i {
    color: $primary;
    font-size: 1.25rem;
  }
}

.menu-overlay {
  flex-grow: 1;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease-out;
}

.aside-menu.open .menu-content {
  transform: translateX(0);
}

.aside-menu.open .menu-overlay {
  opacity: 1;
  pointer-events: auto;
}

.menu-nav {
  padding: 20px 0;
}

.menu-item {
  @apply flex items-center cursor-pointer;
  transition: background-color 0.2s;
  padding: 0.5rem 0.625rem;
  border-bottom: 0.0625rem solid #343434;

  img {
    @apply w-[37px] h-[29px];
    object-fit: contain;
    object-position: center;
  }
  span {
    color: #aaa;
    margin-left: 0.3125rem;
  }

  &:hover {
    background-color: #333;
    span {
      color: #fff;
    }
  }
}

.logout-btn {
  border-bottom: none;
}

.login-btn {
  @apply text-white text-center cursor-pointer;
  text-shadow: 0 0.0625rem 0.0625rem #767676;
  display: block;
  padding: 0.625rem 0.3125rem;
  border-radius: 1.5625rem;
  margin-bottom: 0.625rem;
  border: 0.0625rem solid $primary;
}

.join-btn {
  @apply text-black text-center cursor-pointer;
  background: $gradient-to-right;
  display: block;
  padding: 0.625rem 0.3125rem;
  border-radius: 1.5625rem;
  box-shadow: $primary 0.125rem 0.125rem 0.1875rem -0.125rem;
  border: 0.0625rem solid transparent;

  &:hover {
    @apply text-white;
  }
}
</style>
