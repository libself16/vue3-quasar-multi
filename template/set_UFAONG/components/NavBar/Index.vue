<template>
  <nav class="nav-wrapper">
    <div class="nav-content">
      <div
        class="nav-item"
        v-for="cmsItem in h5BottomMenuList"
        :key="cmsItem.id"
        @click="handleEntranceClick(cmsItem.Entrance[0])"
      >
        <q-img
          v-if="cmsItem.Setting.icon_path"
          width="1.75rem"
          :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
        />
        <span class="w-full leading-normal whitespace-nowrap mt-1">{{
          limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)
        }}</span>
        <!-- <div v-if="item.routeName === 'Home'" class="nav-list home-list">
          <img :src="item.iconSrc" :alt="item.routeName" />
        </div>
        <div v-else class="nav-list">
          <img :src="item.iconSrc" :alt="item.routeName" />
          <span>{{ $t(item.label).toUpperCase() }}</span>
        </div> -->
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue"
import { useQuasar } from "quasar"
import { useRoute, useRouter } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import { useScroll } from "src/common/hooks/useScroll"
import accountIcon from "../../assets/images/NavBar/account.png"
import homeIcon from "../../assets/images/NavBar/home.png"
import liveChatIcon from "../../assets/images/NavBar/liveChat.png"
import promotionIcon from "../../assets/images/common/promotion.png"
import loginIcon from "../../assets/images/common/login.png"
import logoutIcon from "../../assets/images/common/logout.png"
import { useCms } from "src/common/composables/useCms"
import { useEntranceHandler } from "app/template/set_UFAONG/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { MENU } from "../../utils/constants"

const router = useRouter()
const route = useRoute()
const { isLogin, handleLogout } = useAuth()
const { scrollToTopAnimated } = useScroll()
const { h5BottomMenuList, handleCmsList } = useCms()
const { handleEntranceClick } = useEntranceHandler()
const { nowLang } = useLanguage()
const $q = useQuasar()

const baseNavList = [
  {
    label: "menu.promotion",
    routeName: "Promotions",
    iconSrc: promotionIcon
  },
  {
    label: "menu.account",
    routeName: "Account",
    iconSrc: accountIcon
  },
  {
    label: "menu.home",
    routeName: "Home",
    iconSrc: homeIcon
  },
  {
    label: "Live Chat",
    routeName: "ContactUs",
    iconSrc: liveChatIcon
  }
]

const navList = computed(() => {
  const loginLogoutItem = isLogin.value
    ? {
        label: "common.btn.logout",
        routeName: "Logout",
        iconSrc: logoutIcon
      }
    : {
        label: "common.btn.login",
        routeName: "Login",
        iconSrc: loginIcon
      }

  return [...baseNavList, loginLogoutItem]
})

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
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

onMounted(async () => {
  $q.loading.show()
  await handleCmsList(4)
  $q.loading.hide()
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";
@import "src/common/css/_variable.sass";

.nav-wrapper {
  @apply h-[65px] absolute bottom-0 left-0 right-0 z-10;
  @apply flex w-full items-center;
  background: #343434;
  filter: drop-shadow(0 0 0.0625rem $primary);
  box-shadow: $primary 0.125rem 0.125rem 0.5rem -0.25rem;
  padding: 0 0.625rem;

  @include phone-width {
    filter: none;
  }
}

.nav-content {
  @apply grid w-full relative text-center;
  grid-template-columns: repeat(5, 1fr);
  max-height: 3.4375rem;
}

.nav-item {
  @apply flex flex-col items-center justify-center h-[55px] cursor-pointer;

  img {
    @apply w-[30px] h-[27px];
  }
}

.nav-list {
  @apply flex flex-col items-center justify-center;
}

.home-list {
  @apply w-[65px] h-[65px] relative bottom-5 p-[10px];
  margin: 0 auto;
  filter: none;
  background: $gradient-to-bottom;
  border-radius: 50%;
  border: 1px solid #343434;
  img {
    @apply w-[43px] h-[43px];
  }
}
</style>
