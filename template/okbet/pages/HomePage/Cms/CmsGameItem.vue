<template>
  <div :class="['game-item', { h5: isMobile, pc: !isMobile }]">
    <img class="game-img" @click="handleMobileClick(entrance)" :src="entrance.img_path" @error="setDefaultGameImg" />
    <div class="tag-icon" v-if="entrance.type === 1 && !isMobile">
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
    <template v-if="!isMobile">
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
import { toRef } from "vue"
import { useEntranceHandler } from "app/template/okbet/composables/useCms"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import { CMS_ENTRANCE_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "padXl")

const { setDefaultGameImg } = useCommonImg()
const { hotTagImg, newTagImg } = useSiteImg()
const { handleEntranceClick } = useEntranceHandler()

const props = defineProps<{
  entrance: Response.CmsEntranceItem
}>()

const handleMobileClick = (entrance: Response.CmsEntranceItem) => {
  if (isMobile.value) {
    handleEntranceClick({
      entrance: entrance
    })
  }
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/button.scss";

.game-item {
  @apply mx-1 relative cursor-pointer;
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
    margin: 0 0.25rem;
  }

  .game-img {
    border-radius: 1rem;

    @include phone-width {
      @apply rounded-lg;
      width: 100%;
    }
  }

  // .hot-tag {
  //   position: absolute;
  //   left: -7%;
  //   top: 5%;
  //   width: 4.4375rem;
  //   height: 3.125rem;
  //   z-index: 1;
  // }

  .play-btn-container {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 1rem;
    transition: background-color 0.3s ease-in-out;
    @include setFlex;

    .btn-play {
      transition: display 0.3s ease-in-out;
      display: none;
    }
  }

  &.pc {
    &:hover {
      .play-btn-container {
        background: rgba($background-dark-color, 0.5);

        .btn-play {
          display: block;
        }
      }
    }
  }
}
</style>
