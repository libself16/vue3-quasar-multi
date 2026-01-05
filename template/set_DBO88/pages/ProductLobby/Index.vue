<template>
  <div class="product-lobby">
    <div class="product-lobby-title" v-if="!$q.platform.is.mobile">
      <div class="title-icon"></div>
      <div class="title-label">{{ $t(GAME_TYPE.I18nKeys[gameTypeId as GAME_TYPE.Enums]) }}</div>
    </div>
    <ul class="product-row">
      <li
        v-for="product in productState.list"
        :key="product.product_name"
        class="product-item"
        @click="handleProductClick(product.integration_id, product.product_code)"
      >
        <div class="img-container">
          <img
            :src="getProductSquareImage({ ...product, siteKey: 'set_DBO88' })"
            :alt="product.product_name"
            class="product-img"
            @error="setDefaultProductImg"
          />
        </div>
      </li>
    </ul>
    <div class="provider-title">{{ $t("home.providers") }}</div>
    <ProviderList class="provider-list" />
  </div>
</template>
<script lang="ts">
export default {
  name: "ProductLobby"
}
</script>
<script lang="ts" setup>
import { computed, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useSiteImg } from "app/template/set_DBO88/hooks/useSiteImg"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"
import ProviderList from "../Home/components/ProviderList.vue"

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const { handleBannerList } = useBanner()
const { gameTypeState, getProducts, productState, handleProductClick, getProductSquareImage } = useGame()
const { setDefaultProductImg } = useSiteImg()

let gameTypeId = computed(() => {
  return Number(route.params.gameType)
})

async function getBanner() {
  await handleBannerList(BANNER_POSITION.Enums.ProductLobby, gameTypeId.value)
}

watchEffect(() => {
  if (gameTypeState.list.length && gameTypeId.value) {
    getProducts(gameTypeId.value)
    getBanner()
  }
})

watchEffect(() => {
  console.log("mounted", gameTypeId.value)
  if (GAME_TYPE.Category[gameTypeId.value as GAME_TYPE.Enums] === GAME_TYPE.CategoryEnums.GameOpen) {
    router.push({ name: "GameLobby", params: { gameType: gameTypeId.value } })
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";

.product-lobby {
  @apply px-[15px] py-[40px];
  @include phone-width {
    @apply py-[20px];
  }
  .product-lobby-title {
    @apply inline-block text-[1.125rem];
    align-items: center;
    text-transform: uppercase;
    color: $text-sky-blue;
  }
  .product-row {
    @apply grid grid-cols-7 gap-[15px] my-4;
    @include pad-width {
      @apply grid-cols-4;
    }
    @include phone-width {
      @apply grid-cols-3;
    }
    .product-item {
      @apply cursor-pointer;
    }
  }
  .provider-title {
    @apply text-[1.125rem] uppercase;
    color: $text-sky-blue;
    @include phone-width {
      @apply text-[12px];
    }
  }
}
</style>
