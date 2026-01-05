<template>
  <div v-if="isDown.pc" :class="cx('w-full', 'my-5', { 'px-6 phone:px-4': isNeedPaddingX })">
    <q-tabs
      v-model="activeIndex"
      class="nav-tabs"
      :mobile-arrows="false"
      :outside-arrows="false"
      align="left"
      :shrink="false"
      no-caps
      indicator-color="transparent"
    >
      <q-tab
        v-for="(cmsItem, cmsIndex) in navigationBarList"
        :key="cmsIndex"
        :name="cmsIndex"
        class="nav-tab-item"
        @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
      >
        <div class="tab-content">
          <img
            v-if="cmsItem.Setting.icon_path"
            class="btn-icon"
            :src="
              isActive(cmsItem.Entrance[0], cmsIndex, cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path
            "
          />

          <div
            v-else
            class="btn-icon"
            :class="{'customActiveClass': isActive(cmsItem.Entrance[0], cmsIndex, cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)}"
          ></div>

          <span class="btn-title">{{
            limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)
          }}</span>
        </div>
      </q-tab>
    </q-tabs>
  </div>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/okbet_blackGold/composables/useCms"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { MENU } from "../utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { ref, onMounted, nextTick, watch } from "vue"
import { useRoute } from "vue-router"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { cx } from "src/common/utils/cx"

const { isDown } = useMediaQuery()

const eventbus = injectStrict(EventBusKey)

const { handleEntranceClick } = useEntranceHandler()
const { nowLang } = useLanguage()
const { navigationBarList, handleCmsList } = useCms()
const route = useRoute()

const activeIndex = ref(0)

const prop = defineProps({
  modelValue: {},
  isNeedPaddingX: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(["update:modelValue"])

const limitWordLength = (word: string) => {
  if (!word || word.length === 0) return
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

const getRouterInfo = (did: string) => {
  return MENU.RouterNameMapping[did]
}

const isActive = (entrance: any, index: number, text: string) => {
  let active = route.name === getRouterInfo(entrance.payload.did)

  if (entrance.payload.game_type) {
    active = route.params.gameType == entrance.payload.game_type
  }

  if (active) {
    activeIndex.value = index
  }

  return active
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.NAVIGATION_BAR)
  // await nextTick()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/_variable.sass";

:deep(.nav-tabs) {
  .q-tabs__content {
    gap: 1rem;
  }

  .q-tab {
    @apply rounded-lg min-w-[auto] p-0 shrink-0 opacity-60;
    @apply w-[6.25rem] h-[6.25rem]; // 100px
    @apply iphone:w-[4.6875rem] iphone:h-[4.6875rem]; // 75px
    min-width: auto;
    padding: 0;
    background-color: #2b2b2b;

    &.q-tab--active {
      background: linear-gradient(0deg, #000000 0%, #2a2a2a 100%);
      border: 1px solid rgba(255, 247, 233, 1);
      box-shadow: $border-shadow-md;

      .btn-title {
        // color: $text-light-color;
        @apply font-bold;
      }
    }
  }
}

.tab-content {
  @apply w-full gap-2 flex-col;
  @include setFlex;
  flex-direction: column;

  .btn-icon {
    @apply w-[2.5rem] h-[2.5rem]; // 40px
    @apply iphone:w-[1.875rem] iphone:h-[1.875rem]; // 30px
  }
}

.btn-title {
  @apply w-full overflow-hidden;
  @apply px-1;
  @apply text-sm iphone:text-xs;
  @apply capitalize text-ellipsis whitespace-nowrap text-center not-italic font-normal;

  color: $primary-white-color;
  font-family: Helvetica;
}
</style>
