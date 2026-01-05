<template>
  <div class="game-list-wrapper">
    <div class="game-list-tab">
      <div
        v-for="item in gameTypeState.list"
        :key="item.id"
        class="tab-item"
        :class="{ active: item.id === gameTypeId }"
        @click="changeTab(item.id)"
      >
        <img class="tab-icon" :src="menuTabImg(item.frontendKey, item.id === gameTypeId ? 'black' : 'gold')" alt="" />
        {{ item.label ? gameListName(item.label) : "" }}
      </div>
    </div>
    <div class="game-list-content">
      <div
        v-for="product in productState.list"
        :key="product.product_name"
        class="product-item"
        @click="handleProductClick(product.integration_id, product.product_code, true)"
      >
        <q-img
          :src="getProductSquareImage({ ...product, siteKey: 'set_UFAONG' })"
          :alt="product.product_name"
          class="product-img"
          :error-src="productDefaultImg"
          loading="lazy"
          fit="contain"
          position="50% 50%"
        />
        <div class="product-play-btn">{{ $t("game.play_now") }}</div>
      </div>
    </div>
    <GS1MiniGame v-if="isReady" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter, useRoute } from "vue-router"
import { useInit } from "src/common/composables/useInit"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { useGame } from "src/common/composables/useGame"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/set_UFAONG/hooks/useSiteImg"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLogo } from "src/common/composables/useLogo"
import { useEnv } from "src/common/hooks/useEnv"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { initialize, isReady } = useInit()
const { handleGetPixelCodes } = usePixelCodes()
const { gameTypeState, getProducts, productState, handleProductClick, getProductSquareImage, initGameTypeList } =
  useGame()
const { productDefaultImg } = useCommonImg()
const { menuTabImg } = useSiteImg()
const { visitWebsite } = useEnv()
const { getAgentSetting } = useLanguage()
const { getUserInfo, getUserWalletList } = useUserInfo()
const { handleLogoList } = useLogo()

const gameTypeId = ref(0)

interface Props {
  initialGameType?: number
}

const props = defineProps<Props>()

// 設置初始遊戲類型
watch(
  () => [gameTypeState.list, props.initialGameType] as const,
  ([list, initialGameType], oldValues) => {
    if (list.length === 0) {
      return
    }

    const oldList = oldValues?.[0] ?? []
    const oldInitialGameType = oldValues?.[1]

    const listJustLoaded = list.length > 0 && oldList.length === 0
    const initialTypeChanged = initialGameType !== oldInitialGameType

    if (listJustLoaded || initialTypeChanged) {
      const targetId =
        initialGameType !== undefined && !isNaN(initialGameType) && list.some((item) => item.id === initialGameType)
          ? initialGameType
          : list[0].id

      if (gameTypeId.value !== targetId) {
        gameTypeId.value = targetId
        getProducts(targetId)
      }
    }
  },
  { deep: true, immediate: true }
)

const initializeGame = async () => {
  await initialize({
    task: [
      visitWebsite,

      getAgentSetting,
      initGameTypeList,
      getUserInfo,
      getUserWalletList,
      handleLogoList,
      handleGetPixelCodes
    ]
  })
}

const changeTab = (id: number) => {
  if (gameTypeId.value !== id) {
    gameTypeId.value = id
    getProducts(id)

    if (route.query.gameType) {
      const newQuery = { ...route.query }
      delete newQuery.gameType
      router.replace({ query: newQuery })
    }
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

onMounted(() => {
  initializeGame()
})
</script>

<style lang="scss" scoped>
@import "app/template/set_UFAONG/assets/css/_variable.scss";

.game-list-wrapper {
  @apply grid px-[10px] pt-[10px] pb-[40px];
  grid-template-columns: 20% 80%;
}

.game-list-tab {
  @apply flex flex-col;

  .tab-item {
    @apply flex flex-col items-center justify-center;
    @apply text-center text-white font-normal cursor-pointer mb-[5px];
    background: #232323;
    background-size: 100% 100%;
    padding: 0.5rem 0.3125rem;
    border: 0.0625rem solid $primary;
    border-radius: 0.625rem;
    text-transform: uppercase;

    &.active {
      @apply text-black font-bold;
      background: $gradient-to-bottom;
    }

    .tab-icon {
      color: $primary;
    }
  }
}

.game-list-content {
  @apply grid grid-cols-2 w-full pl-[.625rem] self-start;

  .product-item {
    @apply max-h-[30vw] md:max-h-[18.75rem] mb-[.625rem] relative;

    .product-img {
      @apply w-full h-auto;
    }

    .product-play-btn {
      @apply absolute bottom-[1rem] md:bottom-[1rem] right-[1rem] md:right-[2rem] w-[5.125rem] h-[1.4375rem] text-black;
      @apply flex justify-center items-center cursor-pointer;
      background: $gradient-to-right;
      border-radius: 1.25rem;
      box-shadow: $primary 0.125rem 0.125rem 0.5rem -0.25rem;
      padding: 0.25rem 0.625rem;

      &:hover {
        @apply text-white;
      }
    }
  }
}
</style>
