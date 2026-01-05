<template>
  <div class="cms-navigator" :class="{ h5: width < 1000 }">
    <div class="h5-navigator-menu" v-if="width < 1000" @click="h5NavigationActive = !h5NavigationActive">
      <img class="icon" :src="getActiveEntrance()?.Setting.icon_path" />
      <div class="title">
        {{ getActiveEntrance()?.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
      </div>
      <q-icon
        :name="h5NavigationActive ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        size="sm"
        color="grey"
        class="icon-last"
      ></q-icon>
    </div>
    <ul v-if="width >= 1000 || (width < 1000 && h5NavigationActive)">
      <li
        v-for="(cmsItem, cmsIndex) in navigationBarList"
        :key="cmsIndex"
        class="nav-item"
        :class="{
          active: isActive(cmsItem.Entrance[0])
        }"
      >
        <div class="nav-link" @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })">
          <img class="nav-icon" :src="cmsItem.Setting.icon_path" />
          <span class="nav-title">{{
            limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)
          }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/_variable.scss";

.cms-navigator {
  @apply flex items-center justify-end;
  @apply mb-12 mt-4;

  ul {
    @apply flex rounded-full;
    @apply border;
    border-color: $primary-color;
    background-color: $primary-color;
    .nav-item {
      @apply text-white p-[10px] rounded-full cursor-pointer;
      .nav-link {
        @apply flex;
        .nav-icon {
          @apply w-6 mr-[8px];
        }
        .nav-title {
        }
      }
      &.active {
        background: $navigation-active-bg;
      }
      &:hover {
        background: $navigation-active-bg;
      }
    }
  }

  // h5
  &.h5 {
    @apply flex-col justify-center items-center;
    .h5-navigator-menu {
      @apply w-full text-white cursor-pointer;
      @apply flex items-center gap-[20px] rounded-[10px];
      padding: 14px 18px;
      background: $primary-color;

      .icon {
        @apply w-8;
      }
      .title {
      }
      .icon-last {
        @apply justify-end grow;
      }
    }

    ul {
      @apply flex-col w-full rounded-[25px];
      .nav-item {
        .nav-link {
          .nav-icon {
          }
          .nav-title {
          }
        }
        &.active {
        }
      }
    }
  }
}
</style>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { useEntranceHandler } from "app/template/set_ed8888/composables/useCms"
import { MENU } from "app/template/set_ed8888/utils/constants"
import { useWindowSize } from "@vueuse/core"

const { handleEntranceClick } = useEntranceHandler()
const { nowLang } = useLanguage()
const { navigationBarList, handleCmsList } = useCms()
const route = useRoute()
const emit = defineEmits(["update:modelValue"])
const { width } = useWindowSize()
const h5NavigationActive = ref(false)

const limitWordLength = (word: string) => {
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

const getRouterInfo = (did: string) => {
  return MENU.RouterNameMapping[did]
}

const isActive = (entrance: any) => {
  try {
    if (entrance.payload.game_type) {
      return route.params.gameType == entrance.payload.game_type
    }

    return route.name?.toString().toLocaleLowerCase() === getRouterInfo(entrance.payload.did).toLocaleLowerCase()
  } catch (error) {
    console.log(error)
    return false
  }
}

const getActiveEntrance = () => {
  return navigationBarList.value.find((item: any) => isActive(item.Entrance[0]))
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.NAVIGATION_BAR)
})
</script>
