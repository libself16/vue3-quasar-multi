<template>
  <div class="cms-detail-wrapper">
    <!-- <div class="detail-title">
      <h2 class="title-label">
        {{ cmsDetail.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
      </h2>
    </div> -->
    <ul v-if="cmsDetail.Entrance.length > 0" class="detail-content">
      <li class="game-item" v-for="(entrance, entranceIndex) in cmsDetail.Entrance" :key="entranceIndex">
        <q-img
          @click="handleEntranceClick({ entrance: entrance })"
          :src="entrance.img_path"
          class="game-img"
          @error="setDefaultProductImg"
          loading="lazy"
          contain
        />
        <q-btn class="btn-play">{{ $t("game.play_now") }} ></q-btn>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useEntranceHandler } from "app/template/set_r016/composables/useCms"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import type * as Response from "src/api/response.type"
import { useLanguage } from "src/common/composables/useLanguage"

defineProps<{
  cmsDetail: Response.CmsItem
}>()

const { setDefaultProductImg } = useSiteImg()
const { handleEntranceClick } = useEntranceHandler()
const { nowLang } = useLanguage()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.cms-detail-wrapper {
  @apply flex flex-col p-5 mx-auto box-border;
  max-width: 85.375rem;

  .title-label {
    @apply text-2xl font-bold text-white;
  }

  .detail-content {
    @apply grid gap-4 mt-4 grid-cols-4;

    @include pad-width {
      @apply grid-cols-3;
    }

    @include iphone-width {
      @apply grid-cols-2;
    }

    .game-item {
      @apply relative;

      .btn-play {
        @apply absolute text-white font-bold;
        bottom: 1rem;
        left: 1rem;
        padding: 0.3125rem 1.25rem;
        border-radius: 0.9375rem;
        background: linear-gradient(90deg, #540000 0%, #820000 100%);
        font-size: 0.75rem;
        transition: all 0.6s ease-in-out;
        -webkit-transition: all 0.6s ease-in-out;
        letter-spacing: 0.04rem;

        @include iphone-width {
          bottom: 0.5rem;
          left: 0.5rem;
          padding: 0.3125rem 0.9rem;
          font-size: 0.7rem;
        }
      }
    }

    .game-img {
      @apply w-[100%] h-auto cursor-pointer;
      transition: all 0.6s ease-in-out;
      border-radius: 0.9375rem;
    }
  }
}
</style>
