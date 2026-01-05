<template>
  <HeaderTitleBack variant="setR022" :titleI18n="'common.btn.eventDetails'">
    <section class="mobile-detail-container">
      <q-img :src="promotionDetail.image" class="mobile-detail-image" />
      <p class="mobile-detail-title">{{ promotionDetail.title }}</p>
      <p class="mobile-detail-content" v-html="promotionDetail.content"></p>
    </section>
  </HeaderTitleBack>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { usePromotion } from "src/common/composables/usePromotion"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import type * as Response from "src/api/response.type"

const route = useRoute()
const { promotionList, handlePromotionList } = usePromotion()

const promotionDetail = ref<Response.PromotionDetail>({
  promotion_id: 0,
  lang: "",
  title: "",
  content: "",
  image: ""
})

onMounted(async () => {
  await handlePromotionList()
  const promotion = promotionList.value.find((item) =>
    item.details.some((detail) => detail.promotion_id.toString() === route.params.id)
  )
  if (promotion) {
    const detail = promotion.details.find((d) => d.promotion_id.toString() === route.params.id)
    if (detail) {
      promotionDetail.value = detail
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.mobile-detail-container {
  @apply flex flex-col py-[.5rem] px-[.75rem];

  .mobile-detail-image {
    @apply w-full rounded-[.5rem] mb-[.625rem];
  }

  .mobile-detail-title {
    @apply text-[1.125rem] mb-[2.125rem];
    color: var(--secondary-01);
  }

  .mobile-detail-content {
    @apply text-base;
    font-family: "Trebuchet MS";
    font-style: italic !important;
    color: var(--primary-02) !important;
  }
}
</style>
