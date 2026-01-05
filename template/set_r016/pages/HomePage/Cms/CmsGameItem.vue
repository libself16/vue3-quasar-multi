<template>
  <div class="game-item" :class="{ 'has-tag': hasGameTag }">
    <img :src="entrance.img_path" class="game-img" @error="setDefaultGameImg" />
    <q-btn class="btn-play" @click="handleEntranceClick({ entrance: entrance })">
      <img :src="playBtnImg" alt="click to play" />
    </q-btn>
    <template v-if="!$q.platform.is.mobile">
      <div v-if="entrance.type === 1">
        <img v-if="entrance.payload.game_hot === 1" src="src/common/assets/images/tags/hottag.png" class="game-tag" />
        <img v-if="entrance.payload.game_newly === 1" src="src/common/assets/images/tags/newtag.png" class="game-tag" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useQuasar } from "quasar"
import { useEntranceHandler } from "app/template/set_r016/composables/useCms"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import type * as Response from "src/api/response.type"

const $q = useQuasar()
const { handleEntranceClick } = useEntranceHandler()
const { setDefaultGameImg, playBtnImg } = useSiteImg()

const props = defineProps<{
  entrance: Response.CmsEntranceItem
}>()

const hasGameTag = computed(() => {
  return props.entrance.type === 1 && (props.entrance.payload.game_hot === 1 || props.entrance.payload.game_newly === 1)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "../../../assets/css/game.sass";

.game-item {
  @apply relative mr-3 w-full h-full;
  aspect-ratio: auto !important;
  justify-content: flex-start !important;
  margin-right: 1.5rem;

  &.has-tag {
    @apply pl-3;
  }

  .game-tag {
    @apply absolute w-[4.5rem] h-[3.125rem] z-10;
    top: 20%;
    left: 0;
    transform: translateY(-20%);

    @include pad-width() {
      display: none;
    }
  }

  .game-img {
    @apply object-contain object-center w-auto h-full;
  }

  @include phone-width {
    @apply w-full;
    .game-img {
      @apply w-full;
    }
  }
}
</style>
