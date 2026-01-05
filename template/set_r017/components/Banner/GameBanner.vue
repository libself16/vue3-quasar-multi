<template>
  <div class="game-banner-wrapper">
    <div class="game-banner-content">
      <div class="game-banner-title">{{ $t(`productLobby.${gameTypeFrontendKey}`) }}</div>
      <q-img :src="productLobbyImg(gameTypeFrontendKey)" loading="lazy"></q-img>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchEffect, ref, computed } from "vue"
import { useRoute } from "vue-router"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { GAME_TYPE } from "src/common/utils/constants"

const route = useRoute()
const { productLobbyImg } = useSiteImg()

const gameTypeId = ref<null | GAME_TYPE.Enums>(null)
const gameTypeFrontendKey = computed(() => {
  if (gameTypeId.value) {
    return GAME_TYPE.FrontendKey[gameTypeId.value]
  }
  return ""
})

watchEffect(() => {
  const gameType = route.params.gameType as string

  if (gameType) {
    gameTypeId.value = Number(gameType)
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";

.game-banner-wrapper {
  background: #ffffff14;

  .game-banner-content {
    @apply flex items-center justify-between mx-auto;
    max-width: 75rem;
    height: 7.1875rem;

    @include phone-width {
      padding: 0 0.875rem;
      height: 5.125rem;
    }

    .game-banner-title {
      font-family: NotoSans;
      font-weight: 700;
      font-size: 2.25rem;
      line-height: 3.0625rem;
      color: $neutral01;

      @include phone-width {
        font-size: 1.5rem;
        line-height: 2.0625rem;
      }
    }

    .q-img {
      width: 14.75rem;
      height: 7.1875rem;

      @include phone-width {
        width: 10.125rem;
        height: 4.9337rem;
      }
    }
  }
}
</style>
