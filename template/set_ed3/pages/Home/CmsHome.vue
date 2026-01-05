<template>
  <div v-if="cmsDetail" class="cms-container">
    <CmsHomeDetail :cms-detail="cmsDetail" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from "vue"
import { useQuasar } from "quasar"
import { useRoute, useRouter } from "vue-router"

import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import CmsHomeDetail from "./Cms/CmsHomeDetail.vue"

const route = useRoute()
const { cmsDetail, handleCmsDetail } = useCms()
const $q = useQuasar()
const router = useRouter()

const cmsId = computed(() => Number(route.params.cmsId))

onMounted(async () => {
  $q.loading.show()
  await handleCmsDetail(cmsId.value)
  $q.loading.hide()

  if (cmsDetail.value === undefined) {
    router.push({ path: "/" }) // 跳轉到首頁
  }
})
watch(cmsId, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    location.reload()
  }
})
</script>
