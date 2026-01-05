<template>
  <section class="promotion-wrapper">
    <div class="promotion-container">
      <p class="promotion-title">{{ $t("menu.promotion") }}</p>
      <div class="promotion-content">
        <div class="promotion-tabs">
          <div
            class="tab"
            v-for="item in typeList"
            :key="item.value"
            :class="['tab', item.value === activeType ? 'active' : '']"
            @click="updateActiveType(item)"
          >
            {{ $t(item.name) }}
          </div>
        </div>
        <div class="promotion-list">
          <div class="promotion-item" v-for="item in promotionList" :key="item.id">
            <q-img :src="item.details[0].image" class="promotion-item-image" />
            <div class="promotion-item-text">
              <div class="text-wrapper">
                <div class="text-title">{{ item.details[0].title }}</div>
              </div>
              <q-btn class="text-btn" no-wrap @click="handleBannerDetail(item)">
                <span class="text-read-more">
                  {{ $t("common.btn.readMore") }}
                </span>
                <q-icon name="fas fa-chevron-right" />
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <PromotionDetailDialog v-model:isOpenDetailDialog="isOpenDetailDialog" :promotionDetail="promotionDetail" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { usePromotion } from "src/common/composables/usePromotion"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import PromotionDetailDialog from "app/template/set_r022/pages/HomePage/Promotion/PromotionDetailDialog.vue"
import type { Promotion } from "src/api/response.type"

const router = useRouter()
const { isLargeTablet } = useMediaQuery()
const { activeType, updateActiveType, typeList, promotionList, handlePromotionList } = usePromotion()
const isOpenDetailDialog = ref(false)
const promotionDetail = ref<Promotion | null>(null)

const handleBannerDetail = (promotion: Promotion) => {
  if (isLargeTablet.value) {
    router.push({ name: "PromotionDetail", params: { id: promotion.id } })
  } else {
    isOpenDetailDialog.value = true
    promotionDetail.value = promotion
  }
}

onMounted(async () => {
  await handlePromotionList()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.promotion-wrapper {
  @apply flex justify-center py-[2rem] px-[.625rem];

  @include pad-large-width {
    padding-top: 0.6875rem;
  }

  .promotion-container {
    @apply flex flex-col max-w-[87.5rem] w-full gap-[2rem];

    @include pad-large-width {
      gap: 0.625rem;
    }
  }

  .promotion-title {
    @apply py-[.875rem] px-[1.5rem] rounded-[.5rem] text-[1.75rem];
    background: var(--neutral-01);
    color: var(--secondary-01);

    @include pad-large-width {
      @apply text-[1.25rem];
    }
  }

  .promotion-content {
    @apply flex flex-col rounded-[.5rem];
    background: var(--neutral-01);

    .promotion-tabs {
      @apply flex overflow-x-auto px-[1.6875rem] gap-[1.5rem];

      .tab {
        @apply flex items-center justify-center cursor-pointer whitespace-nowrap;
        @apply py-4 relative;
        color: var(--secondary-01);
        transition: color 0.3s ease;

        &::after {
          @apply absolute left-0 bottom-0 w-full h-[.125rem];
          content: "";
          background: var(--primary-01);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease-in-out;
        }

        &.active {
          color: var(--primary-01);

          &::after {
            transform: scaleX(1);
          }
        }
      }
    }

    .promotion-list {
      @apply mt-2 grid grid-cols-2 gap-[.9375rem] py-4;

      @include pad-large-width {
        @apply grid-cols-1;
      }

      .promotion-item {
        @apply flex flex-col rounded-[.5rem];
        border: 1px solid var(--neutral-03);
        background: var(--neutral-01);

        .promotion-item-image {
          @apply rounded-t-[.5rem];
        }

        .promotion-item-text {
          @apply flex items-center justify-between py-[1.0625rem] px-[.75rem];

          .text-wrapper {
            @apply min-w-0 mr-2;
            .text-title {
              @apply text-[.875rem] truncate;
              color: var(--secondary-01);
            }
          }

          .text-btn {
            @apply min-w-[7.75rem] min-h-[2.75rem] rounded-[.5rem] text-base;
            background: var(--primary-01);
            color: var(--text-01);

            :deep(.q-icon) {
              @apply text-[.875rem] ml-[.25rem];
            }
          }
        }
      }
    }
  }
}
</style>
