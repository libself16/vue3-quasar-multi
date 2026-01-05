<template>
  <div :class="['game-item', { mobile: isLargeTablet, desktop: !isLargeTablet }]">
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
import { useEntranceHandler } from "app/template/set_r022/composables/useCms"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { CMS_ENTRANCE_TYPE } from "src/common/utils/constants"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import type * as Response from "src/api/response.type"

const { setDefaultGameImg } = useCommonImg()
const { hotTagImg, newTagImg } = useSiteImg()
const { handleEntranceClick } = useEntranceHandler()
const { isLargeTablet } = useMediaQuery()

defineProps<{
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
@import "app/template/set_r022/assets/css/_variable.scss";

.game-item {
  @apply flex relative cursor-pointer;

  .tag-icon {
    @apply absolute left-[-0.8vw] top-[5%] w-[4.4375rem] h-[3.125rem] z-10;

    @include pad-large-width {
      left: -12px;
    }
  }

  @include pad-large-width {
    margin: 0rem;
  }

  .game-img {
    @apply rounded-[1rem];

    @include pad-large-width {
      @apply rounded-lg w-full;
    }
  }

  .play-btn-container {
    @apply absolute w-full h-full rounded-[1rem] transition-all duration-300;
    @include setFlex;

    .btn-play {
      display: none;
      transition: display 0.3s ease-in-out;
      background: var(--primary-01);
      color: var(--text-01);
    }
  }

  &.desktop {
    &:hover {
      .play-btn-container {
        background: rgba(var(--black-01-rgb), 0.5);

        .btn-play {
          @apply block;
        }
      }
    }
  }
}
</style>
