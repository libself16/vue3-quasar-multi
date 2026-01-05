<template>
  <div v-if="languageList.length > 1">
    <q-btn :size="btnSize" :round="!iconRight" unelevated rounded :icon-right="iconRight">
      <q-avatar :size="imgSize">
        <img :src="getFlagImg(currentLanguage)" :alt="currentLanguage" />
      </q-avatar>

      <q-menu light :offset="[0, 10]">
        <q-list>
          <q-item v-for="(language, index) in languageList" :key="index" clickable v-close-popup>
            <q-item-section @click="changeLanguage(language)">
              <img :style="{ width: imgSize }" :src="getFlagImg(language)" :alt="language" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script lang="ts" setup>
import { useLanguage } from "src/common/composables/useLanguage"
import { computed, defineProps, PropType } from "vue"

const { availableLanguages, getLanguage, getFlagImg, setLanguage } = useLanguage()

const languageList = computed(() => availableLanguages)
const currentLanguage = computed(() => getLanguage())

const props = defineProps({
  /** 按鈕尺寸 */
  btnSize: {
    type: [String] as PropType<"xs" | "sm" | "md" | "lg" | "xl">,
    required: false,
    default: () => "md"
  },

  /** 圖片尺寸 */
  imgSize: {
    type: [String],
    required: false,
    default: () => "28px"
  },

  /** 右側圖邊 */
  iconRight: {
    type: [String],
    required: false,
    default: () => ""
  }
})

function changeLanguage(language: string) {
  setLanguage(language)
}
</script>

<style lang="scss" setup></style>
