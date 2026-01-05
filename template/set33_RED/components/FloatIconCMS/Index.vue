<template>
  <div v-if="floatingIconList?.length > 0" class="float-wrapper custom-float-wrapper01">
    <!-- 切換收合 icon -->
    <div @click="toggleShow" class="icon-container">
      <q-img
        v-if="!isLoading"
        :src="isShow ? floatCmsCloseIconRed : floatIconPath"
        class="float-cms-icon"
        alt="float-cms-icon"
      />
    </div>
    <!-- 當點擊展開時，顯示所有項目 -->
    <transition name="slide-down">
      <ul v-if="isShow" class="float-cms-content">
        <li
          v-for="(cmsItem, index) in floatingIconList"
          class="float-cms-item"
          :key="index"
          :style="{ animationDelay: `${index * 0.3}s` }"
        >
          <div
            v-if="shouldDisplayDevice(cmsItem)"
            @click="handleEntranceClick(cmsItem.Entrance[0])"
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { useLanguage } from "src/common/composables/useLanguage"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { useEntranceHandler } from "app/template/set33_RED/composables/useCms"

const { floatingIconList, handleCmsList, shouldDisplayDevice, floatIcon, isLoading } = useCms()
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const { floatCmsOpenIconRed, floatCmsCloseIconRed } = useSiteImg()

const isShow = ref(false)

const toggleShow = () => {
  isShow.value = !isShow.value
}

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
