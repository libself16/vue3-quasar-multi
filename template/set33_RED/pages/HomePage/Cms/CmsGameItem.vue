<template>
  <div class="game-container" @click="handleEntranceClick(entrance)">
    <img class="game-img" :src="entrance.img_path" @error="setDefaultGameImg" />
    <template v-if="!$q.platform.is.mobile">
      <div v-if="entrance.type === 1">
        <img v-if="entrance.payload.game_hot === 1" :src="hotTagImg" class="game-tag" />
        <img v-if="entrance.payload.game_newly === 1" :src="newTagImg" class="game-tag" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/set33_RED/hooks/useSiteImg"
import { useEntranceHandler } from "app/template/set33_RED/composables/useCms"
import type * as Response from "src/api/response.type"

const $q = useQuasar()
const { setDefaultGameImg } = useCommonImg()
const { hotTagImg, newTagImg } = useSiteImg()
const { handleEntranceClick } = useEntranceHandler()

defineProps<{
  entrance: Response.CmsEntranceItem
}>()
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set33_RED/assets/css/button.sass";

.game-container {
  @apply relative cursor-pointer overflow-hidden;

  .game-tag {
    @apply absolute w-[4.5rem] h-[3.125rem] z-10 left-0;
    top: 50%;
    transform: translateY(-50%);

    @include pad-width() {
      display: none;
    }
  }
}
</style>
