<template>
  <!-- flex flex-col gap-[.625rem] -->
  <section id="cms-custom-page-wrapper" class="slider-theme w-full grid grid-cols-1 gap-[.625rem]">
    <div v-for="(entrance, index) in entranceList" :key="`entrance-${index}`" class="entrance-item flex-none w-full">
      <component
        :is="getEntranceComponent(entrance.type as number)"
        :entrance="entrance"
        :handleEntranceClick="handleEntranceClick"
        :siteKey="(entrance.type as number) === 104 && envInfo.siteKey"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from "vue"
import { useQuasar } from "quasar"
import { useRoute, useRouter } from "vue-router"
import { useCms } from "src/common/composables/useCms"
import { useEntranceHandler } from "app/template/okbet/composables/useCms"
import { useEnvInfoStore } from "src/stores/envStore"
import { useGlobalStore } from "src/stores/globalStore"
import CustomSlider from "src/common/components/CmsCustomComponents/CustomSlider.vue"
import CustomText from "src/common/components/CmsCustomComponents/CustomText.vue"
import CustomImage from "src/common/components/CmsCustomComponents/CustomImage.vue"
import CustomGameEntrance from "src/common/components/CmsCustomComponents/CustomGameEntrance.vue"

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { cmsDetail, handleCmsDetail } = useCms()
const { handleEntranceClick } = useEntranceHandler()
const { envInfo } = useEnvInfoStore()
const globalStore = useGlobalStore()

const cmsCustomPageId = computed(() => Number(route.params.cmsCustomPageId))
const entranceList = computed(() => cmsDetail.value?.Entrance ?? [])

const componentTypeMap = {
  101: CustomSlider, // Custom Slider
  102: CustomText, // Custom Text
  103: CustomImage, // Custom Image
  104: CustomGameEntrance // Custom Game Entrance
} as const

const getEntranceComponent = (type: number) => {
  return componentTypeMap[type as keyof typeof componentTypeMap] || null
}

const getCmsDetail = async () => {
  $q.loading.show()
  await handleCmsDetail(cmsCustomPageId.value)
  $q.loading.hide()

  if (cmsDetail.value === undefined) {
    if (globalStore.globalState.backRouteName) {
      router.push({ name: globalStore.globalState.backRouteName })
      return
    }

    router.push({ path: "/" })
  }
}

watch(
  () => cmsCustomPageId.value,
  (newVal) => {
    getCmsDetail()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss"></style>
