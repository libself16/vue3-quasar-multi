<template>
  <div :class="['game-item', { h5: isLargeTablet, pc: !isLargeTablet }]">
    <img class="game-img" @click="handleMobileClick(entrance)" :src="entrance.img_path" @error="setDefaultGameImg" />
    <div class="tag-icon" v-if="entrance.type === 1 && !isLargeTablet">
      <img
        v-if="
          (entrance.payload.game_hot === 1 && entrance.payload.game_newly === 1) ||
          (entrance.payload.game_hot === 1 && entrance.payload.game_newly === 0)
        "
        :src="hotTagImg"
        class="hot-tag"
      />
      <img
        v-else-if="entrance.payload.game_hot === 0 && entrance.payload.game_newly === 1"
        :src="newTagImg"
        class="hot-tag"
      />
    </div>
    <template v-if="!isLargeTablet">
      <div class="play-btn-container">
        <q-btn
          class="btn-play hide-hover"
          @click="
            handleEntranceClick({
              entrance: entrance
            })
          "
        >
          <span v-if="entrance.type === CMS_ENTRANCE_TYPE.Enums.GAME_LINK">{{ $t("game.play_now") }}</span>
          <span v-else>GO</span>
        </q-btn>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar"
import { useEntranceHandler } from "app/template/set_ed8888/composables/useCms"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/set_ed8888/hooks/useSiteImg"
import { CMS_ENTRANCE_TYPE } from "src/common/utils/constants"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import type * as Response from "src/api/response.type"

const $q = useQuasar()
const { setDefaultGameImg } = useCommonImg()
const { hotTagImg, newTagImg } = useSiteImg()
const { handleEntranceClick } = useEntranceHandler()
const { isLargeTablet } = useMediaQuery()

const props = defineProps<{
  entrance: Response.CmsEntranceItem
}>()

const handleMobileClick = (entrance: Response.CmsEntranceItem) => {
  if (isLargeTablet.value) {
    handleEntranceClick({
      entrance: entrance
    })
  }
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/_variable.scss";
@import "app/template/set_ed8888/assets/css/button.scss";

.game-item {
  @apply mx-0 relative cursor-pointer;
  @include setFlex;

  .tag-icon {
    position: absolute;
    left: -0.8vw;
    top: 5%;
    width: 4.4375rem;
    height: 3.125rem;
    z-index: 1;

    @include phone-width {
      left: -12px;
    }
  }

  @include phone-width {
    margin: 0rem;
  }

  .game-img {
    border-radius: 1rem;

    @include phone-width {
      @apply rounded-lg;
      width: 100%;
    }
  }

  .play-btn-container {
    @apply w-full h-full absolute;
    @apply rounded-xl;
    @include setFlex;

    .btn-play {
      transition: display 0.3s ease-in-out;
      display: none;
    }
  }

  &.pc {
    &:hover {
      .play-btn-container {
        background-color: rgba(0, 0, 0, 0.5);

        .btn-play {
          display: block;
        }
      }
    }
  }
}
</style>
