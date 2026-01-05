<template>
  <div v-if="gameTypeState.list" class="game-tab-wrapper">
    <div class="game-tab-content">
      <q-btn class="game-tab" :class="{ active: gameTypeId === null }" :to="{ name: 'home' }">{{
        $t("menu.lobby")
      }}</q-btn>
      <q-btn
        v-for="item in gameTypeState.list"
        :key="item.id"
        class="game-tab"
        :class="{ active: gameTypeId === item.id }"
        :to="{ name: 'ProductLobby', params: { gameType: item.id } }"
      >
        {{ $t(`productLobby.${item.frontendKey}`) }}
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGame } from "src/common/composables/useGame"
import { GAME_TYPE } from "src/common/utils/constants"
import { ref, watchEffect } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const { gameTypeState } = useGame()

const gameTypeId = ref<null | GAME_TYPE.Enums>(null)

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

.game-tab-wrapper {
  @apply inline-block;
  // @include scrollbar01;
  border-radius: 3.125rem;
  padding: 0.375rem;
  width: auto;
  background-color: $secondary06;
  // width: calc(100vw - 0.875rem);
  overflow-x: auto;

  // @include phone-width {
  //   margin-left: 0.875rem;
  //   border-radius: 3.125rem 0 0 3.125rem;
  // }

  .game-tab-content {
    @apply flex items-center;
    // max-width: calc(100vw - 0.875rem);
  }

  .game-tab {
    border-radius: 3.125rem;
    padding: 0.9375rem 1.25rem;
    font-family: NotoSans;
    font-weight: 700;
    font-size: 0.9375rem;
    line-height: 1.25rem;
    text-transform: capitalize;
    color: $neutral01;
    white-space: nowrap;

    &.active {
      background: $gradient01;
    }
  }
}
</style>
