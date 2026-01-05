<template>
  <div class="home-layout">
    <div class="home-content">
      <CarouselItems v-if="slides.length" :itemToShow="5" :slides="slides" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useGame } from "src/common/composables/useGame"
import CarouselItems from "app/template/set_royalslot88/components/CarouselItems.vue"

const { gameTypeState, getGameTypeImage } = useGame()
const router = useRouter()
const slides = computed(() => {
  return gameTypeState.list.map((item) => {
    return {
      img: getGameTypeImage({
        ...item,
        siteKey: "set_royalslot88",
        imgType: "gif"
      }),
      onSlideClick: () => {
        router.push({
          name: "ProductLobby",
          params: { gameType: item.id }
        })
      }
    }
  })
})
</script>

<style lang="scss" scoped>
.home-layout {
  @apply w-full h-[100dvh];
  @apply flex flex-col items-center justify-center;
  .home-content {
    @apply w-full;
  }
}
</style>
