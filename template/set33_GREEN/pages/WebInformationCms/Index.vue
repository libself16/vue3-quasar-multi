<template>
  <div class="container">
    <div class="about-sec-in">
      <div class="about-left">
        <div class="info-menu-wrapper">
          <a
            v-for="menu in webInformationMenuList"
            :key="menu.id"
            :class="{ active: menu.id === currentTab || menu.id2 === currentTab }"
            @click="changeTab(menu.id)"
          >
            {{ menu.title }}
          </a>
        </div>
      </div>
      <div class="about-right">
        <section class="info-wrapper">
          <h3>{{ webInformationTitle }}</h3>
          <div class="detail" v-html="webInformationContent"></div>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue"
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

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.container
  max-width: 85.375rem
  padding: 0
  margin: 0 auto
  .about-sec-in
    display: flex
    padding-top: 1.25rem
    +iphone-width
      padding-top: 0
      flex-direction: column
    .about-left
      flex: 0 0 auto
      width: 16%
      .info-menu-wrapper
        background: rgba(0, 0, 0, .5019607843)
        border: .0625rem solid #47B83D
        overflow: hidden
        border-radius: .4375rem
        line-height: 1.2
        a
          color: #fff
          text-shadow: .0625rem .0625rem .0625rem #000
          display: block
          text-transform: uppercase
          font-size: 1rem
          font-weight: 600
          padding: .75rem .9375rem
          border-bottom: .0625rem solid #47B83D
          cursor: pointer
        .active
          background: linear-gradient(to bottom, rgb(169, 211, 32) 0%, rgb(56, 131, 18) 100%)
      +iphone-width
        width: 100%
        max-width: 100%
        .info-menu-wrapper
          display: flex
          width: 100%
          flex-wrap: wrap
          flex-direction: row
          justify-content: center
          margin-bottom: .9375rem
          border-radius: 0
    .about-right
      flex: 0 0 auto
      width: 83%
      +iphone-width
        width: 100%
        max-width: 100%
      .info-wrapper
        margin-left: 1vw
        background: rgba(0, 0, 0, 0.5)
        border-radius: 7px
        padding: 1.5625rem 1.875rem
        margin-bottom: 1.875rem
        min-height: 31.25rem
        font-size: .9375rem
        h3
          font-size: calc(1.3125rem + .6vw)
        .detail > :deep(div)
          background: transparent !important
</style>
