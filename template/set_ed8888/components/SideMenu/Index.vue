<template>
  <div class="left-menu-container-wrap min-h-full bg-[#400001] p-4">
    <div class="left-menu-container mb-4">
      <div class="left-menu-container-inner">
        <div class="flex column p-2 bg-[#531a1b] rounded-lg">
          <div
            v-for="item in fliterDisplayDeviceAndLogin"
            :key="item.id"
            class="menu-item flex items-center hover:!text-[#fd857b] text-white w-full p-2 cursor-pointer"
            @click="handleEntranceClick({ entrance: item.Entrance[0] })"
          >
            <div class="imgWrapper mr-2 w-[36px] h-[36px] flex items-center justify-center rounded-lg">
              <img class="default-icon" :src="item.Setting.icon_path" width="24px" height="24px" />
              <img class="selected-icon" :src="item.Setting.selected_icon_path" width="24px" height="24px" />
            </div>
            <span class="text-sm leading-6 font-bold">{{ returnLabel(item.Setting.lang) }}</span>
          </div>
        </div>
      </div>
    </div>
    <LangOption />
    <!-- 暫時不需要實作的功能，先做隱藏 -->
    <!-- <div class="flex items-center p-4 cursor-pointer border-y border-[#fd857b] my-3" @click="handleOpenLiveChat">
      <img :src="live_chat" class="relative z-10">
      <span class="text-white px-4 py-1 ml-[-10px] bg-[#531a1b] rounded-lg flex-1">{{ t("common.live_support") }}</span>
    </div>
    <div class="flex column p-4 cursor-pointer border-b border-[#fd857b] my-3 pb-8">
      <span class="text-white mb-6">{{ t("common.social_media") }}</span>
      <div class="flex justify-between">
        <img :src="tg">
        <img :src="fb">
        <img :src="tw">
        <img :src="ig">
        <img :src="msg">
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, computed } from "vue"
import { useI18n } from "vue-i18n"
import LangOption from "./LangOption.vue"

import { useEntranceHandler } from "app/template/set_ed8888/composables/useCms"
import { useCms } from "src/common/composables/useCms"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { CMS_TYPE } from "src/common/utils/constants"

type SupportedLanguage = "en" | "th" | "id" | "vi" | "zh-cn" | "zh-tw" | "jp" | "ko"

const { locale, t } = useI18n()
const lang = computed<SupportedLanguage>(() => locale.value as SupportedLanguage)

const { handleEntranceClick } = useEntranceHandler()
const { menuList, fliterDisplayDeviceAndLogin, handleCmsList } = useCms()
const { handleOpenLiveChat } = useLiveChat()

const returnLabel = (langObj: Partial<Record<SupportedLanguage, string>>): string => {
  return langObj[lang.value] || langObj["en"] || ""
}

onMounted(() => {
  handleCmsList(CMS_TYPE.Enums.MENU)

  nextTick(() => {
    console.log("Menu list loaded:", menuList.value)
  })
})
</script>

<style lang="scss" scoped>
@import "app/template/set_ed8888/assets/css/_variable.scss";
.menu-item {
  .selected-icon {
    display: none;
  }
  .default-icon {
    display: block;
  }
  &:hover {
    .imgWrapper {
      background-color: #270d32b8;
      box-shadow: 0px 0px 12px 1px #fd857b;
      border-radius: 10px;
      .selected-icon {
        display: block;
      }
      .default-icon {
        display: none;
      }
    }
  }
}
</style>
