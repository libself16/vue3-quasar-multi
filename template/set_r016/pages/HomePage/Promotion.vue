<template>
  <div class="promotion-wrapper">
    <h2 class="promotion-wrapper-title">{{ $t("menu.promotions") }}</h2>
    <div class="type-content">
      <div
        v-for="item in typeList"
        :key="item.value"
        :class="['menu-item', item.value === activeType ? 'active' : '']"
        @click="changeTab(item)"
      >
        {{ $t(item.name) }}
      </div>
    </div>
    <div class="promotion-content">
      <div v-for="item in promotionList" :key="item.id" class="promotion-item">
        <q-img
          @click="promotionDialog.showDialog(item)"
          :src="item.details[0]?.image"
          loading="lazy"
          class="promotion-image"
        />
      </div>
    </div>
    <BaseDialog
      v-model="promotionDialog.show"
      :title="promotionDialog.detail?.title"
      max-width="50rem"
      @close-dialog="promotionDialog.closeDialog"
    >
      <div v-html="promotionDialog.detail?.content" />
    </BaseDialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"
import { usePromotion, type TypeItem } from "src/common/composables/usePromotion"
import BaseDialog from "app/template/set_r016/components/Dialog/BaseDialog.vue"

const { activeType, updateActiveType, typeList, promotionList, handlePromotionList, promotionDialog } = usePromotion()

const aosEffect = ref("fadeIn")
const enterActiveClass = computed(() => `animated ${aosEffect.value}`)
const changeTab = (current: TypeItem) => {
  aosEffect.value = current.value > activeType.value ? "fadeInRight" : "fadeInLeft"
  updateActiveType(current)
}
onMounted(async () => {
  await handlePromotionList()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "template/set_r016/assets/css/_variable.scss";

.promotion-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    margin: 0;
    padding: 0.625rem 1rem 1.875rem;
  }

  .promotion-wrapper-title {
    @include fontStyle(1.625rem);
    color: $primary05;
  }

  .type-content {
    @apply flex items-center;
    margin-top: 1.25rem;
    gap: 0.625rem;

    @include phone-width {
      margin-top: 0.625rem;
      overflow-x: scroll;
    }

    .menu-item {
      @include fontStyle;
      min-width: 5rem;
      text-align: center;
      padding: 0.6875rem;
      border-radius: 0.625rem;
      color: $primary04;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;

      &.active {
        background: $gradient01;
        color: $neutral01;
      }
    }
  }

  .promotion-content {
    @apply flex flex-wrap items-center gap-5;
    margin-top: 1.25rem;

    @include phone-width {
      margin-top: 0.625rem;
    }

    .promotion-item {
      width: calc(50% - 10px);
      aspect-ratio: 590 / 246;
      overflow: hidden;
      cursor: pointer;
      border-radius: 0.625rem;

      @include phone-width {
        width: 100%;
      }
    }
  }
}
</style>
