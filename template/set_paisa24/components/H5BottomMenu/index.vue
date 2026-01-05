<template>
  <nav class="h5-bottom-menu">
    <button
      v-for="(item, index) in h5BottomMenuList"
      :key="index"
      class="flex-1 flex flex-col items-center bottom-menu-item"
      @click="handleEntranceClick({ entrance: item.Entrance[0] })"
    >
      <img :src="item.Setting.icon_path" :alt="returnLabel(item.Setting.lang)" />
      <span class="text-center text-xs">{{ returnLabel(item.Setting.lang) }}</span>
    </button>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useEntranceHandler } from "app/template/set_paisa24/composables/useCms"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"

const { handleEntranceClick } = useEntranceHandler()
const { handleCmsList, h5BottomMenuList } = useCms()
const { locale } = useI18n()

type SupportedLocale = "en" | "th" | "id" | "vi" | "zh-cn" | "zh-tw" | "jp" | "ko"
const lang = computed(() => locale.value as SupportedLocale)

const returnLabel = (obj: Record<string, string>): string => obj[lang.value]

// 初始化底部選單
handleCmsList(CMS_TYPE.Enums.H5_BOTTOM_MENU)
</script>

<style lang="scss" scoped>
@import "app/template/set_paisa24/assets/css/_variable.scss";

.h5-bottom-menu {
  @apply flex z-10 py-2 fixed bottom-0 left-0 right-0;
  background: $primary-color;
  color: $input-text-color;
}
.bottom-menu-item {
  transition: opacity 0.2s ease;
  img {
    @apply max-w-[35px];
  }

  &:hover {
    opacity: 0.8;
  }
}
</style>
