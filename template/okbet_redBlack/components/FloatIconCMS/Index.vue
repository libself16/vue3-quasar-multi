<template>
  <div v-if="floatingIconList?.length > 0" class="float-wrapper w-fit">
    <!-- 切換收合 icon -->
    <div @click="toggleShow" class="icon-container">
      <q-img
        v-if="!isLoading && !isShow"
        :src="floatIconPath"
        :class="`float-cms-icon ${floatIconSizeStyle}`"
        alt="float-cms-icon-open"
      />

      <div v-if="isShow">
        <q-img
          :src="floatCmsCloseIconRed"
          :class="`
              float-cms-icon
              ${floatIconSizeStyle}
              absolute top-0 left-0
            `"
          alt="float-cms-icon-close"
        />

        <!-- 當點擊展開時，顯示所有項目 -->
        <transition name="slide-down">
          <ul
            v-if="isShow"
            :class="`
                float-cms-content
                absolute ${floatListTopStyle} right-0 z-10
              `"
          >
            <li
              v-for="(cmsItem, index) in floatingIconList"
              class="float-cms-item"
              :key="index"
              :style="{ animationDelay: `${index * 0.3}s` }"
            >
              <div
                v-if="shouldDisplayDevice(cmsItem)"
                @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
                class="cms-item-container"
              >
                <transition name="slide-left">
                  <div v-if="isShow" class="text-container">
                    <p>{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
                  </div>
                </transition>
                <q-img :src="cmsItem.Setting.icon_lang[nowLang as LANGUAGE_TYPE.Enums]" class="float-item-icon" />
              </div>
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { useLanguage } from "src/common/composables/useLanguage"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { useEntranceHandler } from "app/template/okbet_redBlack/composables/useCms"

const { floatingIconList, handleCmsList, shouldDisplayDevice, floatIcon, isLoading } = useCms()
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const { floatCmsOpenIconRed, floatCmsCloseIconRed } = useSiteImg()

const isShow = ref(false)

const toggleShow = () => {
  isShow.value = !isShow.value
}

// Style
const floatIconSizeStyle = "w-[4.0625rem] h-[4.0625rem]"
const floatListTopStyle = "top-[4.5625rem]" // 跟 icon 高度差 0.5rem

const floatIconPath = computed(() => {
  const matched = floatIcon.value.find((item: { language: string }) => item.language === nowLang.value)
  return matched && matched.storage_key ? matched.storage_key : floatCmsOpenIconRed
})

onMounted(() => {
  handleCmsList(CMS_TYPE.Enums.FLOATING_ICON)
})
</script>

<style scoped lang="scss">
@import "src/common/css/FloatIconCMS/floatIcon.scss";
</style>
