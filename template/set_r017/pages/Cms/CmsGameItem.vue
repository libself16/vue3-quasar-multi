<template>
  <div :class="['game-item', { h5: $q.platform.is.mobile, pc: !$q.platform.is.mobile }]">
    <img class="game-img" @click="handleMobileClick(entrance)" :src="entrance.img_path" @error="setDefaultGameImg" />
    <div class="tag-icon" v-if="entrance.type === 1 && !$q.platform.is.mobile">
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
    <template v-if="!$q.platform.is.mobile">
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
import { useEntranceHandler } from "app/template/set_r017/composables/useCms"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { CMS_ENTRANCE_TYPE } from "src/common/utils/constants"

const $q = useQuasar()
const { setDefaultGameImg } = useCommonImg()
const { hotTagImg, newTagImg } = useSiteImg()
const { handleEntranceClick } = useEntranceHandler()

const props = defineProps<{
  entrance: Response.CmsEntranceItem
}>()

const handleMobileClick = (entrance: Response.CmsEntranceItem) => {
  if ($q.platform.is.mobile) {
    handleEntranceClick({
      entrance: entrance
    })
  }
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/button.scss";
// @import "app/template/set_r017/assets/css/_variable.scss"

.game-item {
  @apply mr-3 relative cursor-pointer;
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
    border-radius: 8px;

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
    border-radius: 0.5rem;
    transition: background-color 0.1s ease-in-out;
    @include setFlex;

    .btn-play {
      transition: display 0.1s ease-in-out;
      background: $gradient01;
      padding: 0.25rem 1rem;
      box-shadow: $shadoe02;
      border-radius: 0.25rem;
      font-family: NotoSans;
      font-weight: 700;
      font-size: 0.875rem;
      line-height: 1.1875rem;
      min-height: auto;
      color: $neutral01;
      display: none;
    }
  }

  &.pc {
    &:hover {
      .play-btn-container {
        background-color: #00000099;

        .btn-play {
          display: block;
        }
      }
    }
  }
}
</style>
