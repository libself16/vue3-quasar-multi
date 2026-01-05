<template>
  <q-btn-dropdown class="user-menu-dropdown" dense unelevated>
    <template #label>
      <span class="user-name">{{ userInfo.username }}</span>
    </template>
    <q-list>
      <q-item
        v-for="(item, index) in userMenuItems"
        :key="index"
        class="dropdown-list"
        clickable
        v-close-popup
        @click="onSelectItem(item.value)"
      >
        <i :class="item.icon" class="dropdown-item-icon"></i>
        <span class="dropdown-item-label">{{ item.label }}</span>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useMenuConfig } from "app/template/set_DBO88/composables/useMenuConfig"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const { userInfo } = useUserInfo()
const router = useRouter()
const eventbus = injectStrict(EventBusKey)
const { routeConfigs } = useMenuConfig()
const { handleLogout } = useAuth()

defineProps({
  username: {
    type: String,
    default: ""
  },
  userMenuItems: {
    type: Array as PropType<
      Array<{
        label: string
        value: string
        icon: string
      }>
    >,
    default: () => []
  }
})

const onSelectItem = (value: string) => {
  const routeConfig = routeConfigs[value]
  if (routeConfig) {
    if (routeConfig.isModal) {
      eventbus.emit("openAddBankCard", true)
    } else if (routeConfig.isAction) {
      handleLogout()
      router.push({ name: "Home" })
    } else {
      router.push(routeConfig)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";

.user-menu-dropdown {
  @apply text-white p-[.625rem] rounded-[.625rem];
  background: $dark-navy-bg;

  @include pad-large-width() {
    @apply py-[.5rem] px-[.3125rem];
  }

  .avatar-icon {
    @apply w-[1.5625rem] h-[1.625rem] rounded-full mr-2;

    @include pad-large-width() {
      @apply hidden;
    }
  }
}

.dropdown-list {
  @apply flex items-center text-white text-[.8125rem] font-semibold;

  &:hover {
    background: $medium-slate-bg;
  }

  .dropdown-item-icon {
    @apply mr-2 w-[1.25rem] h-[.75rem];
  }
}
</style>
