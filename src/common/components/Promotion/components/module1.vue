<template>
  <div class="promotion-area">
    <div class="title-area">
      <div
        class="title-area-content w-full h-full max-w-[75rem] padXl:max-w-[63.6875rem] pad:max-w-[58.25rem] phone:max-w-[100vw]"
      >
        <div>
          {{ $t("menu.promotion") }}
        </div>

        <img :src="promotionImg('promotion-banner.svg')" class="h-full" />
      </div>
    </div>

    <div class="content-area max-w-[75rem] padXl:max-w-[63.6875rem] pad:max-w-[58.25rem] phone:max-w-[100vw]">
      <!-- Customize Bonus 切換組件 -->
      <div v-if="isDown.phone" class="customize-bonus-banner">
        <button class="arrow-btn prev-btn" @click="prevType" :disabled="currentTypeIndex === 0">
          <q-icon name="keyboard_arrow_up" />
        </button>

        <div class="select-title">{{ $t(typeList?.[currentTypeIndex]?.name || "") }}</div>
        <button
          class="arrow-btn next-btn"
          @click="nextType"
          :disabled="currentTypeIndex === typeList.value?.length - 1"
        >
          <q-icon name="keyboard_arrow_down" />
        </button>
      </div>

      <div v-else class="promo-tab-wrap">
        <div
          v-for="item in typeList"
          :key="item.value"
          :class="['tab', item.value === activeType ? 'active' : '']"
          @click="changeTab(item)"
        >
          {{ $t(item.name) }}
        </div>
      </div>

      <div class="promo-detail-wrap">
        <div
          class="detail-wrap"
          v-for="item in promotionList"
          :key="item.id"
          @click="handleBannerDetail(item.details?.[0]?.promotion_id)"
        >
          <q-img class="title-image" :src="item.details?.[0]?.image" />
          <div class="title ellipsis">{{ item.details?.[0]?.title }}</div>
          <div class="short-cut ellipsis" v-html="item.details?.[0]?.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePromotion, type TypeItem } from "src/common/composables/usePromotion"
import { onMounted, ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { AI_HELPER_EVENT_ROUTES } from "src/common/utils/constants"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { isDown } = useMediaQuery()
const router = useRouter()
const { activeType, updateActiveType, typeList, promotionList, handlePromotionList } = usePromotion()
const { handleAIHelperRouteEvent } = useAIHelperEvent()
const { promotionImg } = useSiteImg()

const currentTypeIndex = ref(0)

const prevType = () => {
  if (currentTypeIndex.value > 0) {
    currentTypeIndex.value--
    updateActiveType(typeList.value[currentTypeIndex.value])
  }
}

const nextType = () => {
  if (currentTypeIndex.value < typeList.value.length - 1) {
    currentTypeIndex.value++
    updateActiveType(typeList.value[currentTypeIndex.value])
  }
}

const changeTab = (current: TypeItem) => {
  updateActiveType(current)

  const index = typeList.value.findIndex((item: TypeItem) => item.value === current.value)
  if (index !== -1) {
    currentTypeIndex.value = index
  }
}

const handleBannerDetail = (id: any) => {
  router.push({ name: "PromotionDetail", params: { id } })
}

onMounted(async () => {
  handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.PROMOTION)
  await handlePromotionList()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.promotion-area {
  width: 100%;
  margin: 0 auto;
  padding-bottom: 2.9375rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title-area {
    width: 100%;
    height: 7.1875rem;
    margin-bottom: 1.5rem;
    background: var(--neutral-02);
    display: flex;
    justify-content: center;
    align-items: center;

    @include phone-width {
      height: 4.875rem;
      margin-bottom: 0;
      padding: 0 1rem;
    }

    .title-area-content {
      color: var(--text-03);
      font-size: 2.25rem;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;

      @include phone-width {
        width: 100%;
        font-size: 1.5rem;
      }
    }
  }

  .content-area {
    width: 100%;

    @include phone-width {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .customize-bonus-banner {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1rem;
      gap: 0.75rem;
      background: var(--bg-13);
      margin-bottom: 0.75rem;

      .arrow-btn {
        width: 1.25rem;
        height: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--icon-bg-05);
        border: none;
        color: var(--icon-01);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          background: var(--secondary-09);
          transform: scale(1.05);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .q-icon {
          color: var(--icon-01);
          font-size: 1.5rem;
        }
      }

      .select-title {
        color: var(--tab-text-01);
        font-size: 0.875rem;
        font-weight: 700;
        text-align: center;
        flex: 1;
      }
    }

    .promo-tab-wrap {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 0.625rem;
      width: fit-content;
      height: fit-content;
      padding: 0.375rem;
      margin-bottom: 1.75rem;
      border-radius: 3.125rem;
      background: var(--tab-bg-03);
      color: var(--tab-text-01);
      overflow-x: scroll;
      scrollbar-width: none;
      -ms-overflow-style: none;

      @include phone-width {
        width: calc(100dvw - 0.875rem);
        border-radius: 3.125rem 0 0 3.125rem;
        margin-bottom: 1.25rem;
      }

      .tab {
        padding: 1.0625rem 1.25rem;
        cursor: pointer;
        color: var(--tab-text-01);
        border-radius: 3.125rem;
        white-space: nowrap;

        @include phone-width {
          padding: 0.9375rem 1.25rem;
        }

        &.active {
          background: linear-gradient(90deg, var(--tab-bg-01) 0%, var(--tab-bg-02) 100%);
        }
      }
    }

    .promo-detail-wrap {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.25rem;

      @include phone-width {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 0;
        padding: 0 0.875rem;
      }

      .detail-wrap {
        width: 100%;
        text-align: left;
        cursor: pointer;

        .title-image {
          width: 100%;
          border-radius: 0.25rem;
        }

        .title {
          font-size: 0.75rem;
          font-weight: 400;
          margin: 0.625rem 0 0.25rem;
          color: var(--text-03);
        }

        .short-cut {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-01);
        }

        .ellipsis {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
