<template>
  <section class="custom-page-wrapper slider-theme">
    <div v-for="(entrance, index) in entranceList" :key="`entrance-${index}`" class="entrance-item">
      <component
        :is="getEntranceComponent(entrance.type as number)"
        :entrance="entrance"
        :handleEntranceClick="handleEntranceClick"
        :siteKey="(entrance.type as number) === 104 && envInfo.siteKey"
      />
    </div>
    <FooterNav />
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useEntranceHandler } from "app/template/okbet/composables/useCms"
import { useEnvInfoStore } from "src/stores/envStore"
import FooterNav from "app/template/okbet/components/Footer/FooterNav.vue"
import CustomSlider from "src/common/components/CmsCustomComponents/CustomSlider.vue"
import CustomText from "src/common/components/CmsCustomComponents/CustomText.vue"
import CustomImage from "src/common/components/CmsCustomComponents/CustomImage.vue"
import CustomGameEntrance from "src/common/components/CmsCustomComponents/CustomGameEntrance.vue"
import { useDetailCms } from "src/common/apiHooks/cms/useDetailCms"

const route = useRoute()
const { envInfo } = useEnvInfoStore()

const cmsCustomPageId = computed(() => Number(route.params.cmsCustomPageId))

// 主要打 API 獲取 cms detail
const { cmsDetailData } = useDetailCms({ id: cmsCustomPageId.value })

const entranceList = computed(() => cmsDetailData.value?.Entrance ?? [])

const { handleEntranceClick } = useEntranceHandler()

const componentTypeMap = {
  101: CustomSlider, // Custom Slider
  102: CustomText, // Custom Text
  103: CustomImage, // Custom Image
  104: CustomGameEntrance // Custom Game Entrance
} as const

const getEntranceComponent = (type: number) => {
  return componentTypeMap[type as keyof typeof componentTypeMap] || null
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";

.custom-page-wrapper {
  @apply flex flex-col max-w-[75rem] mx-auto gap-[.625rem] p-4;

  @include phone-width {
    @apply pb-20;
  }
}
</style>
