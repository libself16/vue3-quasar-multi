<template>
  <div class="promotions-layout">
    <div class="promotions-tab">
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
    <div class="promotions-content">
      <TransitionGroup name="list" tag="div" class="promotions-list">
        <div
          v-for="item in promotionList"
          :key="item.id"
          class="promotions-item"
          @click="promotionDialog.showDialog(item)"
        >
          <img :src="item.details[0]?.image" class="promotions-img" />
          <div class="promotions-title">{{ item.details[0]?.title }}</div>
        </div>
      </TransitionGroup>
    </div>
  </div>
  <!-- Promotion Detail Dialog -->
  <q-dialog v-model="promotionDialog.show">
    <q-card class="q-dark promotion-dialog-wrapper">
      <q-card-section class="promotion-title">
        {{ promotionDialog.detail?.title }}
        <q-btn class="close-btn" icon="close" flat round dense v-close-popup @click="promotionDialog.closeDialog" />
      </q-card-section>
      <q-card-section class="promotion-content">
        <div class="content-wrapper">
          <div v-html="promotionDialog.detail?.content"></div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { usePromotion, type TypeItem } from "src/common/composables/usePromotion"
import { useQuasar } from "quasar"

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
@import "../../assets/css/variable.scss";
@import "src/common/css/_variable.sass";

.promotions-tab {
  @apply flex h-[30px] items-center justify-between sticky top-0 z-10;
  font-size: 0.9375rem;
  background: $dark-bg;
  scrollbar-width: none;

  @include phone-width {
    @apply px-2;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-color: $scroll-color;

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $scroll-color;
      border-radius: 0.1875rem;
    }
  }

  .tab-item {
    @apply text-center;
    @apply h-full flex items-center;

    &:hover,
    &.active {
      span {
        @apply cursor-pointer;
        color: $primary;
        border-bottom: 2px solid $primary;
      }
    }

    @include phone-width {
      @apply mr-4;
      white-space: nowrap;

      &:last-child {
        @apply mr-0;
      }
    }
  }
}

.promotions-content {
  @apply flex flex-col px-2.5 pt-[20px] pb-[80px];
}

.promotions-item {
  @apply mb-2.5 cursor-pointer;

  .promotions-img {
    @apply w-full h-auto max-h-[375px];
    object-fit: contain;
    object-position: center;
  }
  .promotions-title {
    @apply flex w-full text-black font-medium p-[.625rem] text-sm;
    background: $gradient-to-bottom;
  }
}

.promotion-dialog-wrapper {
  @apply w-full flex flex-col;
  border: 1px solid $primary;
}

.promotion-title {
  @apply flex justify-between items-center text-black text-xl p-5;
  background: $gradient-to-bottom;
}

.promotion-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.content-wrapper {
  padding: 0.5rem;

  ::v-deep(*) {
    max-width: 100%;
    height: auto;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  ::v-deep(ul) {
    list-style-type: disc;
  }
}

.list-enter-active {
  animation: zoomIn 0.5s;
}

.list-leave-active {
  animation: zoomOut 0.5s;
  position: absolute;
  width: 100%;
}

.list-move {
  transition: transform 0.5s;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zoomOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.5);
  }
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
