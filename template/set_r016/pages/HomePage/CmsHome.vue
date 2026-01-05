<template>
  <div class="cms-header">
    <BackBtn />
  </div>
  <template v-if="cmsDetail">
    <CmsHomeDetail :cms-detail="cmsDetail" />
  </template>
</template>

<script setup lang="ts">
import BackBtn from "app/template/set_r016/components/Button/Back.vue"
import { useQuasar } from "quasar"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import CmsHomeDetail from "./Cms/CmsHomeDetail.vue"

const route = useRoute()
const { cmsDetail, handleCmsDetail } = useCms()
const $q = useQuasar()
const router = useRouter()
const { isLogin } = useAuth()
const { nowLang } = useLanguage()

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

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.cms-header {
  @apply flex justify-between items-center text-white px-5 pt-[1rem];

  @include phone-width {
    @apply pt-[1.25rem];
  }
}
</style>
