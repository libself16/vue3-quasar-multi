<template>
  <ModalBase v-model="modalShow" max-width="56.25rem" height="calc(100vh - 100px)">
    <section class="info-wrapper">
      <ul class="tab-wrapper">
        <li
          v-for="tab in tabList"
          :key="tab.id"
          class="nav-link"
          :class="{ active: activeUrlId === tab.id }"
          @click="changeTab(tab.id)"
        >
          <span class="nav-text">{{ tab.title }}</span>
        </li>
      </ul>
      <transition name="fade" mode="out-in">
        <div :key="activeUrlId" class="content-wrapper">
          <h5 class="info-title">{{ webInformationTitle }}</h5>
          <div class="detail" v-html="webInformationContent"></div>
        </div>
      </transition>
    </section>
  </ModalBase>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"
import { useLanguage } from "src/common/composables/useLanguage"
import ModalBase from "../modalBase.vue"

const { cmsListState, handleCmsList, webInformationTitle, webInformationContent, setSelectedWebInformationId } =
  useCms()
const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)
const activeUrlId = ref<number>(0)
const { nowLang } = useLanguage()

const tabList = computed(() => {
  const websiteInformation = cmsListState.value[CMS_TYPE.Enums.WEBSITE_INFORMATION] || []
  if (!websiteInformation.length) return []

  return websiteInformation.map((info) => ({
    id: info.id,
    title: info.Page.find((page) => page.lang === nowLang.value)?.title || ""
  }))
})

const changeTab = (tabId: number) => {
  activeUrlId.value = tabId
  setSelectedWebInformationId(tabId)
}

const getWebInformation = async () => {
  await handleCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)

  const firstItem = cmsListState.value[CMS_TYPE.Enums.WEBSITE_INFORMATION]?.[0]
  if (firstItem) {
    activeUrlId.value = firstItem.id
    setSelectedWebInformationId(firstItem.id)
  }
}

onMounted(async () => {
  eventbus.on("openWebInformation", (show: boolean) => {
    modalShow.value = show
  })
  await getWebInformation()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "../../../assets/css/webInfo.scss";
@import "../../../assets/css/btn.scss";

.info-wrapper {
  @apply grid gap-[1.25rem] h-full overflow-hidden;
  grid-template-columns: 22% auto;

  @include pad-portrait {
    grid-template-columns: auto;
  }
}

.tab-wrapper {
  @apply flex flex-col gap-[.625rem];
  padding-left: 0 !important;

  @include pad-portrait {
    @apply grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

.content-wrapper {
  overflow-y: auto;
  max-height: 100%;
}
</style>
