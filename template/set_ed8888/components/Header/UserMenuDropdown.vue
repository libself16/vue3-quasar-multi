<template>
  <q-btn-dropdown class="user-menu-dropdown" dense unelevated>
    <template #label>
      <span v-if="!isLargeTablet" class="user-name">{{ username }}</span>
      <img v-else :src="headerMobileUser" class="user-icon" />
    </template>
    <q-list>
      <q-item v-if="isLargeTablet" class="dropdown-list user-name">{{ username }}</q-item>
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
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useSiteImg } from "../../hooks/useSiteImg"

const { headerMobileUser } = useSiteImg()
const { isLargeTablet } = useMediaQuery()

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
@import "app/template/set_ed8888/assets/css/_variable.scss";

.user-menu-dropdown {
  @apply text-white p-[.625rem] rounded-[.625rem];
  background: $primary-color;

  @include pad-large-width() {
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    background: transparent;

    :deep(.q-icon) {
      @apply hidden;
    }

    .user-icon {
      width: 1.125rem;
      height: 1.1875rem;
    }
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
    @apply bg-white;
    color: $primary-color;
  }

  &.user-name {
    border-bottom: 1px solid #7c0000;
    font-size: 0.75rem;
    font-weight: 700;

    &:hover {
      color: white;
      background: transparent;
    }
  }

  .dropdown-item-icon {
    @apply mr-2 w-[1.25rem] h-[.75rem];
  }
}
</style>
