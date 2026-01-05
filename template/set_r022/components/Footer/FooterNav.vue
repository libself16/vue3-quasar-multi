<template>
  <div class="footer-nav" :class="{ 'tg-mini-app': isTelegramMiniApp }">
    <section class="menu-position">
      <div class="menu-wrapper">
        <div
          v-for="(cmsItem, cmsIndex) in h5MenuList"
          :key="cmsIndex"
          class="menu-list"
          @click="
            handleEntranceClick({
              entrance: cmsItem.Entrance[0],
              opening_method: cmsItem.Setting.payload.opening_method
            })
          "
        >
          <img
            class="home-title-icon"
            :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
          />
          <p class="menu-text">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router"
import { computed, onMounted } from "vue"
import { MENU } from "../../utils/constants"
import { useAuth } from "src/common/hooks/useAuth"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useEntranceHandler } from "app/template/set_r022/composables/useCms"
import { CMS_DISPLAY_LOGIN, CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"

const route = useRoute()
const { isLogin } = useAuth()
const { nowLang } = useLanguage()
const { isTelegramMiniApp } = useTelegram()
const { cmsListState, handleCmsList } = useCms()
const { handleEntranceClick } = useEntranceHandler()

const h5MenuList = computed(() => {
  if (!isLogin.value) {
    return cmsListState.value[CMS_TYPE.Enums.H5_BOTTOM_MENU].filter((cmsItem) => {
      return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.AFTER_LOGIN
    })
  } else {
    return cmsListState.value[CMS_TYPE.Enums.H5_BOTTOM_MENU].filter((cmsItem) => {
      return cmsItem.Setting.payload.display_login !== CMS_DISPLAY_LOGIN.Enums.BEFORE_LOGIN
    })
  }
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
  await handleCmsList(CMS_TYPE.Enums.H5_BOTTOM_MENU)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.footer-nav {
  display: none;
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 40;

  @include pad-large-width {
    display: block;
  }

  .menu-position {
    position: fixed;
    margin: auto;
    width: 100%;
    height: 4.0625rem;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
  }

  .menu-wrapper {
    @apply flex items-center justify-around w-full relative h-full;
    text-align: center;
    background: var(--neutral-01);
    border: 1px solid var(--neutral-03);
    border-bottom: none;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;

    .menu-list {
      @apply flex flex-col justify-center items-center;
      color: var(--primary-02);
      font-size: 0.625rem;
      font-weight: 600;
      transition: color 0.3s ease;

      &.active {
        color: var(--primary-01);
      }

      .home-title-icon {
        width: 1.5rem;
        height: 1.5rem;
        margin-bottom: 0.25rem;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
    }
  }

  &.tg-mini-app {
    .menu-position {
      height: calc(3.75rem + 1.5rem);
      background-color: var(--text-01);
      padding-bottom: 14px;
    }
  }
}
</style>
