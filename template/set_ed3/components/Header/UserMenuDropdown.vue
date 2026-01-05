<template>
  <q-btn-dropdown
    ref="dropdownRef"
    :class="['user-menu-dropdown', { 'dropdown-open': isDropdownOpen }]"
    dense
    unelevated
    @show="isDropdownOpen = true"
    @hide="isDropdownOpen = false"
  >
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
import { PropType, ref } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"

const { userInfo } = useUserInfo()

// 追蹤下拉框開關狀態
const isDropdownOpen = ref(false)
const dropdownRef = ref()

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

const emit = defineEmits(["selectItem"])

const onSelectItem = (value: string) => {
  emit("selectItem", value)
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed3/assets/css/_variable.scss";

.user-menu-dropdown {
  @apply text-white p-[.625rem] rounded-[.625rem];
  background: $green03;
  transition: background-color 0.2s ease;

  &.dropdown-open {
    background: $green04;
  }

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
  background: $green04;

  &:hover {
    background: $green03;
  }

  .dropdown-item-icon {
    @apply mr-2 w-[1.25rem] h-[.75rem];
  }
}
</style>
