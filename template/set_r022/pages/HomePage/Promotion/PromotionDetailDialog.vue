<template>
  <q-dialog v-model="isDialogOpen">
    <q-card class="detail-card" v-if="promotionDetailContent">
      <div class="detail-header">
        <div class="header-title">{{ $t("common.btn.eventDetails") }}</div>
        <q-btn icon="close" flat round dense v-close-popup />
      </div>
      <q-img :src="promotionDetailContent.image" class="detail-image" />
      <div class="detail-title">
        {{ promotionDetailContent.title }}
      </div>
      <div v-html="promotionDetailContent.content" class="detail-content"></div>
      <q-btn class="confirm-btn" v-close-popup no-caps> {{ $t("common.btn.confirm") }} </q-btn>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed } from "vue"
import { useI18n } from "vue-i18n"
import type { Promotion, PromotionDetail } from "src/api/response.type"

const props = defineProps<{
  isOpenDetailDialog: boolean
  promotionDetail: Promotion | null
}>()

const emit = defineEmits(["update:isOpenDetailDialog"])
const { locale } = useI18n({ useScope: "global" })

const isDialogOpen = computed({
  get() {
    return props.isOpenDetailDialog
  },
  set(value) {
    emit("update:isOpenDetailDialog", value)
  }
})

const promotionDetailContent = computed(() => {
  if (!props.promotionDetail) {
    return null
  }
  const detail = props.promotionDetail.details.find((d: PromotionDetail) => d.lang === locale.value)
  return detail || props.promotionDetail.details[0]
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.detail-card {
  @apply py-[2rem] px-[1.5rem] min-w-[46.75rem];

  .detail-header {
    @apply relative text-center mb-[1.75rem];

    .header-title {
      @apply text-[1.5rem];
      color: var(--secondary-01);
    }

    .q-btn {
      @apply absolute top-1/2 right-0 w-[1.25rem] h-[1.25rem];
      transform: translateY(-50%);
      color: var(--primary-08);
    }
  }

  .detail-image {
    @apply rounded-[.5rem] mb-[.625rem];
  }

  .detail-title {
    @apply text-[1.125rem] mb-[2.25rem];
    color: var(--secondary-01);
  }

  .detail-content {
    @apply text-base;
    font-family: "Trebuchet MS";
    font-style: italic !important;
    color: var(--primary-02) !important;
  }

  .confirm-btn {
    @apply h-[2.75rem] rounded-lg w-full mt-[1.75rem] text-base;
    background: var(--primary-01);
    color: var(--text-01);
  }
}
</style>
