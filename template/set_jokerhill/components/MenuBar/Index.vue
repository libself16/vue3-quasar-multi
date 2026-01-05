<template>
  <div class="menu-bar">
    <ul class="menu-layout">
      <q-btn flat fab-mini class="menu-item" align="left" :to="{ name: 'home' }">
        <img :src="svgIcon('home')" alt="home-icon" />
        <span class="menu-btn">{{ $t(`menu.home`) }}</span>
      </q-btn>
      <q-btn
        flat
        fab-mini
        v-for="(cmsItem, cmsIndex) in navigationBarList"
        :key="cmsIndex"
        class="menu-item"
        :class="{
          'menu-item-active': isActive(cmsItem.Entrance[0], cmsIndex)
        }"
        @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
      >
        <img
          :src="
            isActive(cmsItem.Entrance[0], cmsIndex) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path
          "
        />
        <span class="menu-btn">{{
          limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)
        }}</span>
      </q-btn>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEntranceHandler } from "app/template/set_jokerhill/composables/useCms"
import { MENU } from "app/template/set_jokerhill/utils/constants"

const { svgIcon } = useSiteImg()
const { nowLang } = useLanguage()
const { navigationBarList, handleCmsList } = useCms()
const { handleEntranceClick } = useEntranceHandler()

const emit = defineEmits(["changeLogin", "changeRegister", "update:modelValue"])
const route = useRoute()
const activeIndex = ref(0)

const limitWordLength = (word: string) => {
  if (!word) return ""
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

const getRouterInfo = (did: string) => {
  return MENU.RouterNameMapping[did]
}

const isActive = (entrance: any, index: number) => {
  let active = route.name === getRouterInfo(entrance.payload.did)

  if (entrance.payload.game_type) {
    active = route.params.gameType == entrance.payload.game_type

    if (active) {
      activeIndex.value = index
    }
  }

  return active
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.NAVIGATION_BAR)
  await handleCmsList(CMS_TYPE.Enums.MENU)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "../../assets/css/menu.sass"

.menu-bar
  display: flex
  justify-content: center
  align-items: center
  background: #fff
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.10)
  width: 99.6vw
  margin: 0 auto
  height: 5rem
  overflow-x: auto
  +pc-width
    justify-content: flex-start
  .menu-layout
    width: auto
    min-width: 810px
    height: 100%
    overflow-x: auto
    display: flex
    justify-content: center
    align-items: center
    flex-direction: row
    +iphone-width
      justify-content: flex-start
    .menu-item
      width: 100px
      :deep(.q-btn__content)
        +setFlex
        flex-direction: column
        img
          width: 2rem
          height: 2rem
      +iphone-width
        width: 18vw
    .menu-item-active
      background: rgba(0, 0, 0, 0.10)
</style>
