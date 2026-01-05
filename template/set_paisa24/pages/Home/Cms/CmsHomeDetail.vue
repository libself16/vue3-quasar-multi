<template>
  <div class="cms-detail-wrapper" :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <div v-if="cmsDetail">
      <div class="cms-home-title" v-if="cmsDetail.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] !== ''">
        <div class="title-label">
          {{ cmsDetail.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
        </div>
      </div>
      <ul v-if="cmsDetail.Entrance.length > 0" class="detail-content">
        <li class="game-item" v-for="(entrance, entranceIndex) in cmsDetail.Entrance" :key="entranceIndex">
          <div class="img-container">
            <q-img
              @click="handleMobileClick(entrance)"
              :src="entrance.img_path"
              class="game-img"
              @error="setDefaultProductImg"
              loading="lazy"
            />
            <div class="play-btn-container">
              <q-btn
                class="btn-play hide-hover"
                @click.stop="
                  handleEntranceClick({
                    entrance: entrance
                  })
                "
              >
                {{ $t("game.play_now") }}
              </q-btn>
            </div>
          </div>
          <div class="title-container" v-if="entrance.lang[nowLang as LANGUAGE_TYPE.Enums]  !== ''">
            <span class="game-name block">{{ entrance.lang[nowLang as LANGUAGE_TYPE.Enums] }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE, GAME_TYPE } from "src/common/utils/constants"
import { useSiteImg } from "app/template/set_paisa24/hooks/useSiteImg"
import { useEntranceHandler } from "app/template/set_paisa24/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import type * as Response from "src/api/response.type"

defineProps<{
  cmsDetail: Response.CmsItem
}>()

const $q = useQuasar()
const { setDefaultProductImg, svgIcon } = useSiteImg()
const { handleEntranceClick } = useEntranceHandler()
const { gameState } = useGame()

const { nowLang } = useLanguage()

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
@import "app/template/set_paisa24/assets/css/_variable.scss";

.cms-detail-wrapper {
  @apply px-[15px] py-[40px];
  @include phone-width {
    @apply py-[20px];
  }

  .cms-home-title {
    @apply inline-block;
    background-color: $primary-color;
    padding: 8px 20px;
    border-radius: 0px 20px 20px 0px;
    align-items: center;
    text-transform: uppercase;
    color: #fd857b;
    font-size: 17px;
  }

  .detail-content {
    @apply grid grid-cols-6 gap-[15px] my-4;
    @include pad-width {
      @apply grid-cols-4;
    }
    @include phone-width {
      @apply grid-cols-1;
    }

    .game-item {
      @apply bg-white rounded-[8px] overflow-hidden;
      .img-container {
        @apply relative;
        .game-img {
        }
        .play-btn-container {
          @apply absolute rounded-[8px] w-full h-full;
          @apply top-0 left-0 cursor-pointer;
          @apply transition-all duration-300 hover:bg-black/50;
          @apply hidden items-center justify-center;

          .btn-play {
            @apply rounded-full font-bold;
            background-color: $secondary-color;
          }
        }
        .tag-img {
          @apply absolute w-16 left-0 top-4;
        }
        &:hover {
          .play-btn-container {
            @apply flex;
          }
        }
      }
      .title-container {
        @apply py-[10px] text-[15px] text-center;
        @include phone-width {
          @apply py-1 text-[12px];
        }
      }
    }
  }
}
</style>
