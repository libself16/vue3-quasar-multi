<template>
  <section v-if="navigationBarList.length > 0" class="nav-cms-wrapper">
    <Swiper :breakpoints="breakpoints(navigationBarList.length)" :transition="500" @swiper="onSwiper">
      <SwiperSlide v-for="(cmsItem, cmsIndex) in navigationBarList" :key="cmsIndex">
        <div
          class="nav-item"
          :class="{
            active: isActive(cmsItem.Entrance[0], cmsIndex)
          }"
        >
          <div class="nav-link" @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })">
            <img
              v-if="cmsItem.Setting.icon_path"
              class="btn-icon"
              :src="
                isActive(cmsItem.Entrance[0], cmsIndex) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path
              "
            />
            <div v-else class="btn-icon"></div>
            <span class="btn-title">{{
              limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)
            }}</span>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useEntranceHandler } from "app/template/set_r022/composables/useCms"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { MENU } from "app/template/set_r022/utils/constants"
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"

const route = useRoute()
const { handleEntranceClick } = useEntranceHandler()
const { nowLang } = useLanguage()
const { navigationBarList, handleCmsList } = useCms()

const swiperInstance = ref<any>(null)
const activeIndex = ref(0)

const prop = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue"])

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper
}

const breakpoints = (maxLength: number) => {
  return {
    300: {
      slidesPerView: maxLength > 4 ? 4 : maxLength,
      spaceBetween: 10
    },
    400: {
      slidesPerView: maxLength > 5 ? 5 : maxLength,
      spaceBetween: 10
    },
    700: {
      slidesPerView: maxLength > 5 ? 5 : maxLength,
      spaceBetween: 10
    }
  }
}

const limitWordLength = (word: string) => {
  if (!word || word.length === 0) return
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

const getRouterInfo = (did: string) => {
  return MENU.RouterNameMapping[did]
}

const isActive = (entrance: any, index: number) => {
  let active = route.name === getRouterInfo(entrance.payload.did)

  if (entrance.payload.game_type) {
    active = route.params.gameType == entrance.payload.game_type

    if (active) {
      activeIndex.value = index
    }
  }

  return active
}

const scrollToActive = () => {
  if (swiperInstance.value) {
    swiperInstance.value.slideTo(activeIndex.value)
  }
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.NAVIGATION_BAR)
  scrollToActive()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.nav-cms-wrapper {
  @apply w-full h-full flex justify-center items-center;

  .nav-item {
    @apply flex justify-center items-center w-[4.6875rem] rounded-lg;

    &.active {
      span {
        color: var(--primary-01);
      }
    }

    .nav-link {
      @apply flex justify-center items-center flex-col;

      .btn-icon {
        @apply w-7 h-7;
      }
    }

    .btn-title {
      @apply text-sm w-full;
      color: var(--primary-02);
      text-transform: capitalize;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
  }
}
</style>
