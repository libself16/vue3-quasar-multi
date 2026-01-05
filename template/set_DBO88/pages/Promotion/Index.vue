<template>
  <div class="promotion-wrapper">
    <div class="promotion-title-wrapper">
      <div class="promotion-title-button">
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
import { usePromotion, type TypeItem } from "src/common/composables/usePromotion"

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
@import "app/template/set_DBO88/assets/css/_variable.scss";

.promotion-wrapper {
  @apply flex flex-col w-full max-w-[65rem] mx-auto;

  @include pad-large-width {
    @apply px-4;
  }

  .promotion-title-wrapper {
    @apply my-4;

    @include pad-large-width {
      @apply hidden;
    }
  }

  .promotion-title-button {
    @apply flex items-center py-[.5rem] uppercase text-[1.0625rem];
    @apply max-w-[12.5rem] text-[2.125rem] font-bold uppercase;
    color: $text-white;
  }

  .promotion-tab {
    @apply flex flex-wrap text-white rounded-[.625rem] p-[.5rem] gap-4;
    background: $midnight-blue-bg;

    .tab-item {
      @apply text-[.75rem] py-[.375rem] px-[1.25rem] cursor-pointer;

      &.active {
        background: $primary-color;
        border-radius: 0.125rem;
      }

      &:hover {
        background: $primary-color;
        transition: background 0.3s ease;
        border-radius: 0.125rem;
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
      background: $medium-navy-bg;
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
      color: $text-white;
      line-height: 1.5;
    }

    .content-details {
      @apply text-[.8125rem] overflow-hidden;
      color: $text-sky-blue;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

.promotion-dialog-wrapper {
  @apply rounded-[1.25rem];
  background: transparent !important;
  max-width: 50rem !important;

  @include pad-large-width {
    @apply w-full;
  }

  .dialog-title {
    @apply flex justify-between items-center text-white;
    @apply text-base font-bold py-[.9375rem] px-[1.25rem];
    background: #ed1d49;
  }

  .dialog-content {
    background: #191b1e;
    color: $text-white;
  }
}
</style>
