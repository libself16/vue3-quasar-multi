<template>
  <div class="promotion-wrapper">
    <div class="promotion-title-wrapper">
      <div class="promotion-title-button">
        <q-img :src="promotionIcon" alt="promotion-title" class="promotion-title-icon" lazy-load />
        <span class="promotion-title-text">{{ $t("common.btn.promotion") }}</span>
      </div>
    </div>
    <div class="promotion-content-wrapper">
      <div class="promotion-tab">
        <div
          v-for="item in typeList"
          :key="item.value"
          class="tab-item"
          :class="{ active: activeType === item.value }"
          @click="changeTab(item)"
        >
          <span>{{ $t(item.name).toUpperCase() }}</span>
        </div>
      </div>
      <div class="promotion-content">
        <TransitionGroup name="list" tag="div" class="content-list">
          <div
            v-for="item in promotionList"
            :key="item.id"
            class="content-item"
            @click="promotionDialog.showDialog(item)"
          >
            <q-img :src="item.details[0]?.image" class="content-image" lazy-load />
            <div class="content-text">
              <p class="content-title">{{ item.details[0]?.title }}</p>
              <p class="content-details" v-html="item.details[0].content"></p>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
  <!-- Promotion Detail Dialog -->
  <q-dialog v-model="promotionDialog.show">
    <q-card class="promotion-dialog-wrapper">
      <q-card-section class="dialog-title">
        <p class="title-text">{{ promotionDialog.detail?.title }}</p>
        <q-btn class="close-btn" icon="close" flat round dense v-close-popup @click="promotionDialog.closeDialog" />
      </q-card-section>
      <q-card-section class="dialog-content">
        <div class="content-wrapper">
          <div v-html="promotionDialog.detail?.content"></div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useQuasar } from "quasar"
import { useSiteImg } from "app/template/set_paisa24/hooks/useSiteImg"
import { usePromotion, type TypeItem } from "src/common/composables/usePromotion"

const { promotionIcon } = useSiteImg()
const { activeType, updateActiveType, typeList, promotionList, handlePromotionList, promotionDialog } = usePromotion()
const $q = useQuasar()

const changeTab = (type: TypeItem) => {
  updateActiveType(type)
}

const initPromotionList = async () => {
  $q.loading.show()
  await handlePromotionList()
  $q.loading.hide()
}

onMounted(() => {
  initPromotionList()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_paisa24/assets/css/_variable.scss";

.promotion-wrapper {
  @apply px-[.9375rem];

  .promotion-title-wrapper {
    @apply my-[3rem];

    @include pad-large-width {
      @apply hidden;
    }
  }

  .promotion-title-button {
    @apply inline-flex items-center justify-start py-[.5rem] px-[1.25rem] uppercase text-[1.0625rem];
    @apply max-w-[12.5rem];
    border-top-right-radius: 1.25rem;
    border-bottom-right-radius: 1.25rem;
    color: $game-label-title-color;
    background-color: $primary-color;

    .promotion-title-icon {
      @apply w-[1.9375rem] h-[1.9375rem] mr-[.625rem];
    }
  }

  .promotion-tab {
    @apply flex flex-wrap text-white rounded-[1.5625rem] p-[.5rem] gap-4;
    background: $primary-color;

    .tab-item {
      @apply text-[.75rem] py-[.375rem] px-[1.25rem] cursor-pointer;

      &.active {
        color: $pink-shadow-color;
      }

      &:hover {
        color: $pink-shadow-color;
      }

      @include iphone-width {
        @apply px-[0.75rem];
      }
    }

    @include pad-large-width {
      @apply mt-[.625rem];
    }
  }

  .promotion-content {
    @apply my-[1.875rem] cursor-pointer;

    .content-list {
      @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
    }

    .content-item {
      @apply rounded-[0.75rem];
      border: 0.0625rem solid $primary-color;
      background: $primary-color-light;
    }

    .content-image {
      border-top-left-radius: 0.625rem;
      border-top-right-radius: 0.625rem;
    }

    .content-text {
      @apply p-[.625rem];
    }

    .content-title {
      @apply font-extrabold text-[1.3125rem] mb-[.3125rem];
      color: $input-text-color;
      line-height: 1.5;
    }

    .content-details {
      @apply text-[.8125rem] overflow-hidden;
      color: $input-text-color;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

.promotion-dialog-wrapper {
  @apply rounded-[1.25rem];
  border: 0.0625rem solid $primary-color;
  max-width: 50rem !important;
  background-color: $modal-bg-color;

  @include pad-large-width {
    @apply w-full;
  }

  .dialog-title {
    @apply flex justify-between items-center;
    @apply text-base font-bold py-[.9375rem] px-[1.25rem];
    background: $modal-header-bg-color;
    color: $modal-heder-text-color;
  }
  .dialog-content {
    color: $modal-text-color;
    ::v-deep(table) {
      @apply mx-auto;
      border-collapse: collapse !important;

      td, th ,tr {
        border: 1px solid;
      }
    }
  }
}
</style>
