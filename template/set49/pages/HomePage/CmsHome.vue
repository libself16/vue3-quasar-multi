<template>
  <CarouselBanner />
  <div class="cms-header">
    <div class="text-lg cursor-pointer" @click="router.push({ name: 'home' })">
      <q-icon name="chevron_left" />
      {{ $t("menu.home") }}
    </div>
    <div v-if="isLogin">
      <WalletDropdown />
    </div>
  </div>
  <template v-if="cmsDetail">
    <CmsHomeDetail :cms-detail="cmsDetail" />
  </template>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from "vue"
import { useQuasar } from "quasar"
import { useRoute, useRouter } from "vue-router"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import CmsHomeDetail from "./Cms/CmsHomeDetail.vue"
import { useAuth } from "src/common/hooks/useAuth"
import CarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import WalletDropdown from "app/template/set49/components/WalletDropdown.vue"

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
  @apply flex justify-between items-center text-white p-5 pt-[6rem];

  @include phone-width {
    @apply pt-[1.25rem];
  }
}
</style>
