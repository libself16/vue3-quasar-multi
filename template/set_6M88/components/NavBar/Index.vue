<template>
  <div class="menu-btm">
    <div class="menu-wrapper">
      <!-- <q-btn class="px-0" type="a" :to="{ name: item.name === 'ContactUs' ? '' : item.name }" v-for="item in baseNavList" :key="item.name" unelevated
        @click="handleItemClick(item)">
        <q-img width="1.75rem" :src="item.icon" />
        <span class="w-full leading-normal whitespace-nowrap mt-1">{{ $t(item.label) }}</span>
      </q-btn> -->
      <!-- 串接 CMS -->
      <q-btn
        type="a"
        v-for="cmsItem in h5BottomMenuList"
        :key="cmsItem.id"
        unelevated
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
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set_6M88/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useScroll } from "src/common/hooks/useScroll"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { MENU } from "../../utils/constants"

import { useQuasar } from "quasar"
import { useCms } from "src/common/composables/useCms"
import accountIcon from "../../assets/images/footer/ftr-acc.png"
import liveChatIcon from "../../assets/images/footer/ftr-chat.png"
import homeIcon from "../../assets/images/footer/ftr-home.png"
import profileIcon from "../../assets/images/footer/ftr-profile.png"
import promotionIcon from "../../assets/images/footer/ftr-promo.png"

const { nowLang } = useLanguage()
const router = useRouter()
const route = useRoute()
const { isLogin, handleLogout } = useAuth()
const { scrollToTopAnimated } = useScroll()
const { h5BottomMenuList, handleCmsList } = useCms()
const $q = useQuasar()
const { handleEntranceClick } = useEntranceHandler()

const limitWordLength = (word: string) => {
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}
const baseNavList = computed(() => {
  return [
    {
      label: "menu.home",
      name: "Home",
      icon: homeIcon
    },
    {
      label: "menu.promos",
      name: "Promotions",
      icon: promotionIcon
    },
    {
      label: "menu.account",
      name: "Account",
      icon: accountIcon
    },
    {
      label: "menu.liveChat",
      name: "ContactUs",
      link: "https://chat.6m88.info",
      icon: profileIcon
    },
    isLogin.value
      ? {
          label: "menu.logout",
          icon: liveChatIcon,
          isLogout: true
        }
      : {
          label: "menu.login",
          name: "Login",
          icon: liveChatIcon
        }
  ]
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

onMounted(async () => {
  $q.loading.show()
  await handleCmsList(4)
  $q.loading.hide()
})

const handleItemClick = (item: any) => {
  const { isLogout, link } = item
  console.log(item)
  if (link) {
    window.open(link, "_blank")
    return
  }

  if (isLogout) {
    handleLogout()
    router.push({ name: "Home" })
    return
  }
}
</script>

<style lang="scss" scoped></style>
