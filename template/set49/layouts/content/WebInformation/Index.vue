<template>
  <div class="web-information-content">
    <div class="type-show-area">
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
    <div class="information-show-area">
      <div class="information-content">
        <div class="information-title">{{ webInformationTitle }}</div>
        <div class="information-detail" v-html="webInformationContent"></div>
      </div>
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

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/set49/assets/css/_variable.scss'

.web-information-content
    @apply pt-12
    +setFlex
    flex-direction: column
    max-width: 62.5rem
    margin: 0 auto
    .type-show-area
        @apply w-full
        display: flex
        gap: 24px
        padding: 2vw
        +pad-width
            gap: 0px
            align-items: center
            text-align: center
        +iphone-width
            background: #333
            white-space: nowrap
            padding: 15px 10px
            max-width: 100vw
            overflow-x: auto
        .menu-item
            @apply cursor-pointer hover:bg-white/20
            color: rgba(255, 255, 255, 0.70)
            font-family: "Century Gothic"
            font-size: 16px
            font-style: normal
            font-weight: 700
            line-height: normal
            text-transform: uppercase
            padding: 8px
            border-radius: 8px
            +phone-width
              font-size: 0.75rem
              padding: 0.25rem 0.75rem
        .active
            background: #FFC002
            color: #24262B
    .information-show-area
        background: $primary-modal-bg
        border-radius: 12px
        min-height: 30vh
        width: 100%
        +iphone-width
          @apply mt-4
          width: 90vw
          padding: 1.5rem 2rem
        .information-content
            padding: 2rem 2.5rem
            +phone-width
              padding: 0
            .information-title
                color: #FFF
                font-family: "Century Gothic"
                font-size: 24px
                font-style: normal
                font-weight: 700
                line-height: normal
                text-transform: uppercase
                margin-bottom: 20px
            .information-detail > :deep(div)
              background: transparent !important
    .type-show-area::-webkit-scrollbar
        display: none

    +iphone-width
      @apply pt-0
      .type-show-area
        margin-top: 0
        width: 100vw
        gap: 8px
        padding: 3vw 7vw
        background: #333
</style>
