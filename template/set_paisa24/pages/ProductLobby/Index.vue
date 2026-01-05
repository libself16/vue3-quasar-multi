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
            :src="getProductSquareImage({ ...product, siteKey: 'set_paisa24' })"
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
import ProviderList from "../Home/components/ProviderList.vue"
import { useSiteImg } from "app/template/set_paisa24/hooks/useSiteImg"
import { useQuasar } from "quasar"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"
import { computed, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"

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
@import "app/template/set_paisa24/assets/css/_variable.scss";

.product-lobby {
  @apply px-[15px] py-[40px];
  @include phone-width {
    @apply py-[20px];
  }
  .product-lobby-title {
    @apply inline-block;
    background-color: $primary-color;
    padding: 8px 20px;
    border-radius: 0px 20px 20px 0px;
    align-items: center;
    text-transform: uppercase;
    color: $game-label-title-color;
    font-size: 17px;
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
      .img-container {
        .product-img {
        }
      }
    }
  }
  .provider-title {
    @apply px-[10px] pb-[10px] text-[15px] font-semibold uppercase;
    color: $pink-color;
    @include phone-width {
      @apply text-[12px];
    }
  }
  .product-list {
  }
}
</style>
