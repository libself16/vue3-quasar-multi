<template>
  <div class="web-information-content">
    <div class="type-content">
      <div
        v-for="menu in webInformationMenuList"
        :key="menu.id"
        class="menu-item"
        :class="{ active: menu.id === currentTab || menu.id2 === currentTab }"
        @click="changeTab(menu.id)"
      >
        {{ menu.title }}
      </div>
    </div>

    <div class="info-box">
      <div class="info-title">{{ webInformationTitle }}</div>
      <div class="info-detail" v-html="webInformationContent"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"

const currentTab = ref(1)
const router = useRouter()
const route = useRoute()
const { handleCmsList, webInformationData, webInformationMenuList, webInformationTitle, webInformationContent } =
  useCms()

const changeTab = (id: number) => {
  currentTab.value = id
  router.push({ name: "webInformation", params: { id: id.toString() } })
}

const handleRouterChange = () => {
  if (!webInformationData.value && webInformationMenuList.value.length > 0) {
    changeTab(webInformationMenuList.value[0].id)
    return
  }

  const routeId = Number(route.params.id)
  if (routeId) {
    currentTab.value = routeId
  }
}

watch(() => route.params.id, handleRouterChange)

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)
  if (!route.params.id) {
    handleRouterChange()
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.web-information-content {
  @apply flex gap-5;

  .type-content {
    @apply flex flex-col;
    gap: 0.625rem;
    width: 13.75rem;
    height: fit-content;
    padding: 0.375rem;
    border-radius: 0.625rem;
    background-color: $primary06;

    @include phone-width {
      display: none;
    }

    .menu-item {
      @include fontStyle;
      padding: 0.625rem;
      cursor: pointer;
      color: $neutral01;

      &.active {
        background-color: $secondary02;
        border-radius: 0.625rem;
      }
    }
  }

  .info-box {
    width: 60rem;
    min-height: 25rem;
    padding: 3.75rem;
    border-radius: 0.625rem;
    background-color: $primary07;

    @include phone-width {
      width: 100%;
      padding: 1.25rem;
    }

    .info-title {
      @include fontStyle(1.625rem);
      color: $secondary03;
    }

    .info-detail {
      @include fontStyle;
      margin-top: 2.5rem;
      color: $neutral01;
    }
  }
}
</style>
