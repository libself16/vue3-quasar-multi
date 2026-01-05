<template>
  <div class="nav-bar">
    <Carousel :breakpoints="breakpoints(navigationBarList.length)" :transition="500" ref="CarouselRef">
      <Slide v-for="(cmsItem, cmsIndex) in navigationBarList" :key="cmsIndex" :name="cmsIndex">
        <div
          class="nav-item"
          :class="{
            active: isActive(cmsItem.Entrance[0], cmsIndex)
          }"
        >
          <div class="navlink" @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })">
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
      </Slide>
    </Carousel>
  </div>
</template>
<script lang="ts" setup>
import { useEntranceHandler } from "app/template/okbet_purple/composables/useCms"
import { useQuasar } from "quasar"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { MENU } from "../utils/constants"
// import SelectBox from 'src/common/components/SelectBox.vue';
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { Carousel, Slide } from "vue3-carousel"

const eventbus = injectStrict(EventBusKey)

const { handleEntranceClick } = useEntranceHandler()
const { nowLang } = useLanguage()
const { navigationBarList, handleCmsList } = useCms()
const route = useRoute()
const $q = useQuasar()

const CarouselRef = ref<any>(null)
const activeIndex = ref(0)

const prop = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue"])

const breakpoints = (maxLength: number) => {
  return {
    300: {
      itemsToShow: maxLength > 4 ? 4 : maxLength,
      snapAlign: "start"
    },
    400: {
      itemsToShow: maxLength > 5 ? 5 : maxLength,
      snapAlign: "start"
    },
    700: {
      itemsToShow: maxLength > 5 ? 5 : maxLength,
      snapAlign: "start"
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
  if (CarouselRef.value) {
    CarouselRef.value.slideTo(activeIndex.value)
  }
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.NAVIGATION_BAR)
  scrollToActive()
})
</script>
<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/_variable.sass";

.nav-bar {
  width: 100vw;
  padding: 0 0.5rem;
  margin: 0 auto 0;
}

.nav-item {
  width: 75px;
  height: 75px;
  border-radius: 0.5rem;
  background: $bg-dark-secondary;
  @include setFlex;

  &.active {
    background: $bg-nav-gradient-secondary;
    border: 1px solid $text-light-primary;
    box-shadow: 0px 0px 6px 0px $border-light;

    span {
      color: $text-light-secondary;
    }
  }

  .navlink {
    @include setFlex;
    flex-direction: column;

    .btn-icon {
      width: 30px;
      height: 30px;
    }
  }

  .btn-title {
    font-size: 0.7rem;
    color: $text-light-secondary;
    font-family: Helvetica;
    font-style: normal;
    font-weight: 400;
    text-transform: capitalize;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
}
</style>
