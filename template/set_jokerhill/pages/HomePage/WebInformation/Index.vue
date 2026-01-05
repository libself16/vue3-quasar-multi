<template>
  <section class="web-information-wrapper">
    <BannerWelcome />
    <div class="web-information-container">
      <div class="tab-container">
        <div
          class="tab-item"
          v-for="item in webInformationMenuList"
          :class="{ active: currentTab === item.id }"
          :key="item.id"
          @click="changeTab(item.id)"
        >
          {{ item.title }}
        </div>
      </div>
      <div class="content-container">
        <div class="content-item">
          <div class="content-item-title">
            <img :src="svgIcon('member-title-icon')" />
            <h3>{{ webInformationTitle }}</h3>
          </div>
          <div class="content-item-detail" v-html="webInformationContent"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import BannerWelcome from "app/template/set_jokerhill/components/BannerWelcome.vue"

const currentTab = ref(1)
const router = useRouter()
const route = useRoute()
const { handleCmsList, webInformationData, webInformationMenuList, webInformationTitle, webInformationContent } =
  useCms()
const { svgIcon } = useSiteImg()

const changeTab = (id: number) => {
  currentTab.value = id
  router.push({ name: "WebInformationCms", params: { id: id.toString() } })
}

const handleRouterChange = () => {
  if (!webInformationData.value && webInformationMenuList.value.length > 0) {
    changeTab(webInformationMenuList.value[0].id)
  } else {
    currentTab.value = Number(route.params.id)
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

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.web-information-container {
  @apply flex flex-col w-full max-w-[62.5rem] mx-auto;
}

.tab-container {
  @apply flex flex-wrap justify-center gap-4 p-4;
}

.tab-item {
  @apply cursor-pointer px-4 py-2 rounded-lg text-[#141414] opacity-40 transition-all duration-300;
  @apply uppercase font-bold whitespace-nowrap;

  &.active {
    background-color: #6288d2;
    color: #fff;
    opacity: 1;
  }
}

.content-container {
  @apply px-8;

  @include iphone-width {
    @apply mb-4;
  }
}

.content-item-title {
  @apply flex items-center gap-2 text-[1.5rem] font-bold uppercase;
  color: #14141466;
}

.content-item-detail {
  @apply flex flex-col justify-center w-full p-8 rounded-2xl;
  background: #ffffff;
}
</style>
