<template>
  <div class="left-menu-container-wrap min-h-full p-4">
    <div class="left-menu-container mb-4">
      <div class="left-menu-container-inner">
        <div class="flex column p-2 rounded-lg">
          <div
            v-for="item in fliterDisplayDeviceAndLogin"
            :key="item.id"
            class="menu-item flex items-center w-full p-2 cursor-pointer"
            @click="handleEntranceClick({ entrance: item.Entrance[0] })"
            :class="{
              active: isActive(item.Entrance[0])
            }"
          >
            <div class="image-wrapper mr-2 w-[36px] h-[36px] flex items-center justify-center rounded-lg">
              <img class="default-icon" :src="item.Setting.icon_path" width="24px" height="24px" />
              <img class="selected-icon" :src="item.Setting.selected_icon_path" width="24px" height="24px" />
            </div>
            <span class="text-sm leading-6 font-bold">{{ returnLabel(item.Setting.lang) }}</span>
          </div>
        </div>
      </div>
    </div>
    <LangOption />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import { useEntranceHandler } from "app/template/set_DBO88/composables/useCms"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"
import { MENU } from "app/template/set_DBO88/utils/constants"
import LangOption from "./LangOption.vue"

type SupportedLanguage = "en" | "th" | "id" | "vi" | "zh-cn" | "zh-tw" | "jp" | "ko"

const { locale } = useI18n()
const route = useRoute()
const lang = computed<SupportedLanguage>(() => locale.value as SupportedLanguage)

const { handleEntranceClick } = useEntranceHandler()
const { fliterDisplayDeviceAndLogin, handleCmsList } = useCms()

const returnLabel = (langObj: Partial<Record<SupportedLanguage, string>>): string => {
  return langObj[lang.value] || langObj["en"] || ""
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

onMounted(() => {
  handleCmsList(CMS_TYPE.Enums.MENU)
})
</script>

<style lang="scss" scoped>
@import "app/template/set_DBO88/assets/css/_variable.scss";

.menu-item {
  .image-wrapper {
    .default-icon {
      display: block;
    }
    .selected-icon {
      display: none;
    }
  }

  &:hover,
  &.active {
    .image-wrapper {
      box-shadow: 0rem 0rem 0.75rem 0.0625rem $shadow-color;
      border-radius: 0.625rem;
      .default-icon {
        display: none;
      }
      .selected-icon {
        display: block;
      }
    }
  }
}

.left-menu-container-wrap {
  background: $deep-navy-bg;

  .menu-item {
    color: $text-sky-blue;
    border-bottom: 1px solid $sky-blue-border;

    &:hover,
    &.active {
      color: $text-white;
    }
  }
}
</style>
