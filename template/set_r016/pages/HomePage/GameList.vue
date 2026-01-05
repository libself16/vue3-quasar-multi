<template>
  <div class="menu-tab">
    <div class="menu-list">
      <div
        v-for="item in gameTypeState.list"
        :key="item.id"
        :class="{ active: item.id === gameTypeId }"
        class="menu-list-item"
        @click="changeTab(item.id)"
      >
        <img class="link-img" :src="menuTabImg(item.frontendKey, item.id === gameTypeId ? true : false)" alt="" />
        <span class="text">{{ item.label ? gameListName(item.label) : "" }}</span>
      </div>
    </div>
    <div class="game-list">
      <CarouselBanner :showAll="false" :bannerPosition="BANNER_POSITION.Enums.ProductLobby" :gameType="gameTypeId" />

      <div class="menu-content">
        <a
          v-for="product in productState.list"
          :key="product.product_name"
          class="menu-prod"
          @click="handleProductClick(product.integration_id, product.product_code)"
        >
          <img
            :src="getProductSquareImage({ ...product, siteKey: 'set_r016' })"
            :alt="product.product_name"
            @error="setDefaultProductImg"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import { useGame } from "src/common/composables/useGame"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { BANNER_POSITION } from "src/common/utils/constants"
import { onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useSiteImg } from "../../hooks/useSiteImg"

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { gameTypeState, getProducts, productState, handleProductClick, getProductSquareImage } = useGame()
const { menuTabImg, getSiteProductImg } = useSiteImg()
const { setDefaultProductImg } = useCommonImg()

const gameTypeId = ref(0)
const hasInitialized = ref(false)

interface Props {
  initialGameType?: number
}

const props = defineProps<Props>()

const changeTab = (id: number) => {
  if (gameTypeId.value !== id) {
    gameTypeId.value = id
    getProducts(id)
    router.replace({ name: "home", params: { gameType: id }, query: {} })
  }
}

const gameListName = (label: string) => {
  /// https://www.notion.so/wowgaming/deab66cbc9df439abca3031becdd1308?pvs=4
  /// 根據以上 issue 修正，需求只需要去除mobile上 live 字樣，故此處用判斷去除
  let translated = t(label)

  if (translated.toLowerCase().includes("casino")) {
    translated = translated.replace("Live ", "")
  }

  return translated
}

watch(
  () => [gameTypeState.list, props.initialGameType] as const,
  ([list, initialGameType], oldValues) => {
    if (list.length === 0) {
      return
    }

    const oldList = oldValues?.[0] ?? []
    const listJustLoaded = list.length > 0 && oldList.length === 0

    // 只在第一次加載時或尚未初始化時執行
    if (listJustLoaded && !hasInitialized.value) {
      const targetId =
        initialGameType !== undefined && !isNaN(initialGameType) && list.some((item) => item.id === initialGameType)
          ? initialGameType
          : list[0].id

      if (gameTypeId.value !== targetId) {
        gameTypeId.value = targetId
        getProducts(targetId)
      }

      hasInitialized.value = true
    }
  },
  { deep: true, immediate: true }
)
</script>
<style lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.menu-tab {
  width: 100%;
  margin: 0.625rem 0px 5rem;
  display: flex;
}

.menu-list {
  .menu-list-item {
    width: 9.8125rem;
    min-height: 6.5rem;
    cursor: pointer;
    padding: 0.8125rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #2c2c2c;
    margin-bottom: 2.5rem;
    border-radius: 0.625rem;
    background: radial-gradient(
      99.57% 99.57% at 50% 0.43%,
      var(--neutral-03, #f6f6f6) 0%,
      var(--neutral-04, #e5e5e5) 100%
    );
    box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.25) inset, 0px 4px 4px 0px rgba(255, 255, 255, 0.25) inset,
      0px 4px 4px 0px rgba(0, 0, 0, 0.4);

    @include phone-width {
      width: 3.75rem;
      min-height: 3.875rem;
      padding: 0.46875rem 0;
      margin-bottom: 0.625rem;
    }

    &.active {
      color: #fff;
      background: radial-gradient(
        99.57% 99.57% at 50% 0.43%,
        var(--primary-03, #ff4242) 40.38%,
        var(--primary-06, #820000) 100%
      );
      box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.25) inset, 0px 4px 4px 0px rgba(255, 255, 255, 0.25) inset,
        0px 4px 4px 0px rgba(0, 0, 0, 0.4);
    }

    .link-img {
      max-width: 3.375rem;
      margin-bottom: 0.8125rem;
      @include phone-width {
        width: 1.6875rem;
        margin: 0px auto;
      }
    }

    .text {
      @include fontStyle(1rem);
      text-align: center;

      @include phone-width {
        @include fontStyle(0.75rem);
      }
    }
  }
}

.game-list {
  padding-left: 1.25rem;
  @include phone-width {
    padding-left: 0.625rem;
  }

  .menu-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: min-content;
    gap: 10px;

    .menu-prod {
      position: relative;

      img {
        width: 100%;
        height: auto;
        border-radius: 10px;
      }
    }
  }
}
</style>
