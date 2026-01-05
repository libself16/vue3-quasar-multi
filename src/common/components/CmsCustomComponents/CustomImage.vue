<template>
  <div class="custom-image-wrapper">
    <div class="image-grid" :style="{ 'grid-template-columns': `repeat(${rowShow}, 1fr)` }">
      <div v-for="(item, index) in imageItems" :key="index" class="image-item" @click="handleImageClick(item)">
        <q-img :src="item.img_path" :alt="item.alt_tag" class="image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useLanguage } from "src/common/composables/useLanguage"
import { useCmsImage } from "src/common/composables/useCmsImage"
import { useGame } from "src/common/composables/useGame"
import type * as Response from "src/api/response.type"
import type {
  CmsImagePayload,
  CmsImageNestedEntrance,
  CmsImageProcessedItem,
  CmsGamePayload,
  CmsLinkPayload,
  CmsNestedEntrancePayload
} from "src/types/cmsCustomPage"

const { nowLang } = useLanguage()
const { getCmsImageSource } = useCmsImage()
const { getGameImageByCustomPage } = useGame()

const props = defineProps<{
  entrance: Response.CmsEntranceItem
  handleEntranceClick: (item: { entrance: CmsImageProcessedItem; opening_method?: number }) => void
}>()

const payload = computed(() => props.entrance.payload as unknown as CmsImagePayload)

const rowShow = computed(() => payload.value?.row_show || 3)

const getFallbackImage = (item: CmsImageNestedEntrance): string => {
  const gamePayload = item.payload as CmsGamePayload

  if (
    gamePayload?.game_code &&
    gamePayload?.product_code &&
    gamePayload?.product_integration_id &&
    gamePayload?.game_type
  ) {
    return getGameImageByCustomPage({
      game_type: gamePayload.game_type,
      product_integration_id: gamePayload.product_integration_id,
      product_code: gamePayload.product_code,
      game_code: gamePayload.game_code
    })
  }

  return ""
}

const imageItems = computed((): CmsImageProcessedItem[] => {
  if (payload.value?.nested_entrance && Array.isArray(payload.value.nested_entrance)) {
    return payload.value.nested_entrance.map((item: CmsImageNestedEntrance): CmsImageProcessedItem => {
      let imgPath = getCmsImageSource(item)

      if (!imgPath) {
        imgPath = getFallbackImage(item)
      }

      return {
        ...item,
        img_path: imgPath,
        alt_tag: (item.payload as CmsGamePayload)?.alt_tag || "image",
        title: item.lang?.[nowLang.value as keyof typeof item.lang] || Object.values(item.lang || {})[0] || ""
      }
    })
  }
  return []
})

const hasOpeningMethod = (payload: CmsNestedEntrancePayload): payload is CmsLinkPayload => {
  return "opening_method" in payload
}

const handleImageClick = (item: CmsImageProcessedItem) => {
  const openingMethod = hasOpeningMethod(item.payload) ? item.payload.opening_method : undefined

  props.handleEntranceClick({
    entrance: item,
    opening_method: openingMethod
  })
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.image-grid {
  @apply grid gap-4;

  .image-item {
    @apply cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1.5625rem rgba(0, 0, 0, 0.15);
    }

    .image {
      @apply w-full h-auto object-contain;
    }
  }
}
</style>
