<template>
  <div class="cms-detail-wrapper" :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <div v-if="cmsDetail">
      <div class="detail-title">
        <h3 class="title-label">
          {{ cmsDetail.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
        </h3>
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
            <q-btn
              v-if="gameState.favoriteMap[entrance.payload.game_id as number] && hasFavoriteCount(entrance) && entrance.payload.game_type !== GAME_TYPE.Enums.LIVECASINO && entrance.payload.game_type !== GAME_TYPE.Enums.VIRTUALSPORT"
              class="btn-favorite hide-hover"
              round
              flat
              @click="removefavoriteGame(entrance.payload as Response.GameItem, true)"
            >
              <img :src="svgIcon('heart-btn-active')" />
            </q-btn>
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
              <q-btn
                v-if="!gameState.favoriteMap[entrance.payload.game_id as number] && hasFavoriteCount(entrance) && entrance.payload.game_type !== GAME_TYPE.Enums.LIVECASINO && entrance.payload.game_type !== GAME_TYPE.Enums.VIRTUALSPORT"
                class="btn-favorite hide-hover"
                round
                flat
                @click="addfavoriteGame(entrance.payload as Response.GameItem, true)"
              >
                <img :src="svgIcon('heart-btn')" />
              </q-btn>
            </div>
            <div class="play-btn-container-h5">
              <q-btn
                v-if="!gameState.favoriteMap[entrance.payload.game_id as number] && hasFavoriteCount(entrance) && entrance.payload.game_type !== GAME_TYPE.Enums.LIVECASINO && entrance.payload.game_type !== GAME_TYPE.Enums.VIRTUALSPORT"
                class="btn-favorite hide-hover"
                round
                flat
                @click="addfavoriteGame(entrance.payload as Response.GameItem, true)"
              >
                <img :src="svgIcon('heart-btn')" />
              </q-btn>
            </div>
          </div>
          <div class="title-container">
            <span class="game-name block">{{ entrance.lang[nowLang as LANGUAGE_TYPE.Enums] }}</span>
            <span
              v-if="
                hasFavoriteCount(entrance) &&
                entrance.payload.game_type !== GAME_TYPE.Enums.LIVECASINO &&
                entrance.payload.game_type !== GAME_TYPE.Enums.VIRTUALSPORT
              "
              class="game-favorites"
            >
              <img :src="svgIcon('heart-collet')" alt="" />
              {{ entrance.payload.game_favorite_count }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useQuasar } from "quasar"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE, GAME_TYPE } from "src/common/utils/constants"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/bmm_set_obtd/hooks/useSiteImg"
import { useEntranceHandler } from "app/template/bmm_set_obtd/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import type * as Response from "src/api/response.type"

defineProps<{
  cmsDetail: Response.CmsItem
}>()

const $q = useQuasar()
const { setDefaultProductImg } = useCommonImg()
const { svgIcon } = useSiteImg()
const { handleEntranceClick } = useEntranceHandler()
const { gameState, addfavoriteGame, removefavoriteGame, getFavoriteGames } = useGame()

const { nowLang } = useLanguage()

const hasFavoriteCount = (entrance: Response.CmsEntranceItem) => {
  return "game_favorite_count" in (entrance?.payload ?? {})
}

const handleMobileClick = (entrance: Response.CmsEntranceItem) => {
  if ($q.platform.is.mobile) {
    handleEntranceClick({
      entrance: entrance
    })
  }
}

onMounted(async () => {
  await getFavoriteGames()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/game.scss";
@import "app/template/bmm_set_obtd/assets/css/button.scss";

.cms-detail-wrapper {
  @apply flex flex-col p-[2rem];
  max-width: 1400px;
  margin: 0 auto;
  @include phone-width {
    @apply p-2 pb-20;
  }
}

.detail-title {
  @apply flex items-center;

  .title-label {
    @apply relative mb-5;
    font-family: OpenSans;
    font-style: normal;
    font-size: 1.75rem;
    line-height: 2.0625rem;
    color: $primary-color;
    font-weight: 860;

    @include phone-width {
      display: none;
    }
  }
}

.detail-content {
  @apply grid;
  gap: 3rem;
  grid-template-columns: repeat(auto-fit, minmax(13.375rem, 1fr));

  @include phone-width {
    @apply grid-cols-3 gap-3;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin: 0 0.2rem;
  }
}
.pc {
  .game-item {
    height: auto;
    .img-container {
      height: auto;
      .play-btn-container-h5 {
        display: none;
      }
    }
  }
}
.h5 {
  .game-item {
    width: 100%;
    height: auto;
    .img-container {
      height: auto;
      width: 100%;
      .btn-favorite {
        right: 0.1rem;
      }
      .play-btn-container {
        display: none;
      }
    }
  }
}
</style>
