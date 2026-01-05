<template>
  <div class="menu-tab">
    <div class="menu-list">
      <a
        v-for="item in gameTypeState.list"
        :key="item.id"
        :class="{ active: item.id === gameTypeId }"
        @click="changeTab(item.id)"
      >
        <img class="link-img" :src="menuTabImg(item.frontendKey, item.id === gameTypeId ? true : false)" alt="" />
        <span>{{ item.label ? gameListName(item.label) : "" }}</span>
      </a>
    </div>
    <div class="menu-content">
      <a
        v-for="product in productState.list"
        :key="product.product_name"
        class="menu-prod"
        @click="handleProductClick(product.integration_id, product.product_code)"
      >
        <img
          :src="getProductSquareImage({ ...product, siteKey: 'set_6M88' })"
          :alt="product.product_name"
          @error="setDefaultProductImg"
        />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { useSiteImg } from "app/template/set_6M88/hooks/useSiteImg"
import { useGame } from "src/common/composables/useGame"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const { gameTypeState, getProducts, productState, handleProductClick, getProductSquareImage } = useGame()
const { setDefaultProductImg } = useCommonImg()
const { menuTabImg } = useSiteImg()
const route = useRoute()
const router = useRouter()

const gameTypeId = ref(0)
const hasInitialized = ref(false)

interface Props {
  initialGameType?: number
}

const props = defineProps<Props>()

const { result } = useSiteImg()

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

watch(
  () => [gameTypeState.list, props.initialGameType] as const,
  ([list, initialGameType], oldValues) => {
    if (list.length === 0) {
      return
    }

    const oldList = oldValues?.[0] ?? []
    const listJustLoaded = list.length > 0 && oldList.length === 0

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
