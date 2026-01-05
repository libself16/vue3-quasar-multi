<template>
  <section class="personal-center-container">
    <template v-for="item in menuList" :key="item.routeName">
      <div
        v-if="item.isShow"
        class="menu-item"
        :class="{ active: currentRoute.name === item.routeName }"
        @click="goTo(item.routeName)"
      >
        <div class="item-icon-wrapper">
          <q-img :src="svgIcon(item.icon)" class="item-icon" />
        </div>
        <div class="item-text">{{ t(item.label) }}</div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { useEnv } from "src/common/hooks/useEnv"

const { svgIcon } = useSiteImg()
const { t } = useI18n({ useScope: "global" })
const router = useRouter()
const currentRoute = useRoute()
const { isCash } = useEnv()

const menuList = ref([
  {
    label: "menu.memberCenter",
    routeName: "memberProfile",
    icon: "profile",
    isShow: true
  },
  {
    label: "menu.history",
    routeName: "history",
    icon: "history",
    isShow: true
  },
  {
    label: "menu.order",
    routeName: "orders",
    icon: "order",
    isShow: isCash.value
  },
  {
    label: "menu.inbox",
    routeName: "memberInbox",
    icon: "inbox",
    isShow: true
  }
])

const goTo = (routeName: string) => {
  router.push({ name: routeName })
}
</script>

<style lang="scss" scoped>
.personal-center-container {
  @apply flex flex-col gap-[.5rem] mt-[.75rem];
  border-top: 1px solid var(--neutral-03);

  .menu-item {
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

    .item-icon-wrapper {
      @apply w-[1.25rem] h-[1.25rem] flex items-center justify-center;

      .item-icon {
        @apply w-[1.25rem] h-[1.25rem];
      }
    }

    .item-text {
      font-size: 1rem;
      line-height: 1.5rem;
    }
  }
}
</style>
