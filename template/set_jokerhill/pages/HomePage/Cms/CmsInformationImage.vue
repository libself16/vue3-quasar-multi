<template>
  <img v-if="imageUrl && entranceData" :src="imageUrl" @click="onClick" :alt="altText" />
</template>

<script setup lang="ts">
import { computed } from "vue"
import type * as Response from "src/api/response.type"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEntranceHandler } from "app/template/set_jokerhill/composables/useCms"
import { LANGUAGE_TYPE } from "src/common/utils/constants"

interface Props {
  item: Response.CmsItem
}

const props = defineProps<Props>()

const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()

const imageUrl = computed<string | undefined>(() => {
  return props.item?.Setting?.img_lang?.[nowLang.value as LANGUAGE_TYPE.Enums]
})

const entranceData = computed<Response.CmsEntranceItem | undefined>(() => {
  return props.item?.Entrance?.[0]
})

const altText = computed<string | undefined>(() => {
  return props.item?.Setting?.lang?.[nowLang.value as LANGUAGE_TYPE.Enums]
})

const onClick = () => {
  if (entranceData.value) {
    handleEntranceClick({ entrance: entranceData.value })
  }
}
</script>
