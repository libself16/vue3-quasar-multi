<template>
  <div v-if="cmsDetail" class="cms-detail-wrapper">
    <ul v-if="cmsDetail.Entrance.length > 0" class="detail-content">
      <li
        class="detail-item"
        v-for="(entrance, entranceIndex) in cmsDetail.Entrance"
        :key="entranceIndex"
        @click="handleEntranceClick(entrance)"
      >
        <div class="img-container">
          <q-img class="game-img" :src="entrance.img_path" :error-src="gameDefaultImg" loading="lazy" />
          <q-btn class="btn-play">{{ $t("game.play_now") }}</q-btn>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue"
import { useQuasar } from "quasar"
import { useRoute } from "vue-router"
import { useCms } from "src/common/composables/useCms"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useEntranceHandler } from "app/template/set33_RED/composables/useCms"

const route = useRoute()
const { cmsDetail, handleCmsDetail } = useCms()
const { gameDefaultImg } = useCommonImg()
const { handleEntranceClick } = useEntranceHandler()
const $q = useQuasar()

const cmsId = computed(() => Number(route.params.cmsId))

onMounted(async () => {
  $q.loading.show()
  await handleCmsDetail(cmsId.value)
  $q.loading.hide()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.cms-detail-wrapper {
  @apply flex flex-col pb-[1.25rem];
  margin: 0 auto;
  max-width: 85.375rem;
}

.detail-content {
  @apply grid gap-4 mt-4;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @include iphone-width {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.img-container {
  @apply relative;

  .game-img {
    @apply w-full h-auto cursor-pointer;
    transition: all 0.6s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }

  .btn-play {
    @apply absolute font-bold;
    bottom: 13%;
    left: 10%;
    background: linear-gradient(180deg, #f5e386 0%, #9c7c24 100%);

    padding: 0.3125rem 1.25rem;
    border-radius: 0.9375rem;
    text-transform: uppercase;
    transition: all 0.6s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }

    @include iphone-width {
      font-size: 0.5rem;
    }
  }
}
</style>
