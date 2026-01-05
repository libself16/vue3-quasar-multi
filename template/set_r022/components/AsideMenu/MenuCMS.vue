<template>
  <section class="menu-cms-container">
    <div
      class="cms-item"
      :class="{
        active: isActive(item.Entrance[0])
      }"
      v-for="item in fliterDisplayDeviceAndLogin"
      :key="item.id"
      @click="handleEntranceClick({ entrance: item.Entrance[0] })"
    >
      <div class="item-icon-wrapper">
        <q-img
          :src="item.Setting.icon_path"
          class="default-icon"
          v-if="currentRoute.name !== item.Entrance[0].payload.did"
        />
        <q-img
          :src="item.Setting.selected_icon_path"
          class="selected-icon"
          v-if="currentRoute.name === item.Entrance[0].payload.did"
        />
      </div>
      <div class="item-text">{{ limitWordLength(item.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string) }}</div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEntranceHandler } from "app/template/set_r022/composables/useCms"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { MENU } from "app/template/set_r022/utils/constants"

const currentRoute = useRoute()
const route = useRoute()
const { handleEntranceClick } = useEntranceHandler()
const { fliterDisplayDeviceAndLogin, handleCmsList } = useCms()
const { nowLang } = useLanguage()

const limitWordLength = (word: string) => {
  if (!word || word.length === 0) return
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

const getRouterInfo = (did: string) => {
  return MENU.RouterNameMapping[did]
}

const isActive = (entrance: any) => {
  if (entrance.payload.game_type) {
    return route.params.gameType == entrance.payload.game_type
  }

  return route.name === getRouterInfo(entrance.payload.did)
}

onMounted(async () => {
  handleCmsList(CMS_TYPE.Enums.MENU)
})
</script>

<style lang="scss" scoped>
.menu-cms-container {
  @apply flex flex-col gap-[.5rem] mt-4;
  border-top: 1px solid var(--neutral-03);

  .cms-item {
    @apply flex items-center gap-[.5rem] cursor-pointer rounded-[.5rem];
    padding: 0.5rem 0 0.5rem 0.75rem;
    color: var(--primary-02);
    transition: all 0.3s ease;

    &:hover {
      background: var(--neutral-04);
    }

    &.active {
      background: var(--primary-01);
      color: var(--text-01);
    }

    .default-icon,
    .selected-icon {
      @apply w-[1.25rem] h-[1.25rem];
    }
  }
}
</style>
