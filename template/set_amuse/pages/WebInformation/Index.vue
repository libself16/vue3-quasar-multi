<template>
  <div class="container">
    <div class="about-sec-in">
      <div class="about-left">
        <div class="info-menu-wrapper">
          <a
            v-for="(menu, key) in menuList"
            :key="key"
            :class="{ active: menu.id === currentTab }"
            @click="changeTab(menu.id, menu.link)"
          >
            {{ $t(`Info.${menu.title}`) }}
          </a>
        </div>
      </div>
      <div class="about-right">
        <AboutUs v-if="currentTab === 1" />
        <TermCondition v-if="currentTab === 2" />
        <PrivacyPolicy v-if="currentTab === 3" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, watch } from "vue"

import { useRouter } from "vue-router"
import AboutUs from "./component/AboutUs.vue"
import TermCondition from "./component/TermCondition.vue"
import PrivacyPolicy from "./component/PrivacyPolicy.vue"

const currentTab = ref(1)
const menuList = ref([
  {
    id: 1,
    title: "about_us",
    link: "AboutUs"
  },
  {
    id: 2,
    title: "term_condition",
    link: "TermAndCondition"
  },
  {
    id: 3,
    title: "privacy_policy",
    link: "PrivacyPolicy"
  }
])
const router = useRouter()

onBeforeMount(() => {
  handleRouterChange()
})
const changeTab = (id: number, link: string) => {
  currentTab.value = id
  router.push({ name: "WebInformation", params: { id: link } })
}
const handleRouterChange = () => {
  const tabs = menuList.value.map((item) => item.link)
  const currentRoute = router.currentRoute.value.path

  tabs.forEach((tab, index) => {
    const path = `/webInformationCms/${tab}`

    if (currentRoute === path) {
      currentTab.value = index + 1
    }
  })
}

watch(
  () => router.currentRoute.value,
  () => {
    handleRouterChange()
  }
)
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.container
  max-width: 1366px
  padding: 0
  margin: 0 auto
  .about-sec-in
    display: flex
    padding-top: 20px
    +iphone-width
      padding-top: 0
      flex-direction: column
    .about-left
      flex: 0 0 auto
      width: 16%
      .info-menu-wrapper
        background: rgba(0, 0, 0, .5019607843)
        border: 1px solid #707070
        overflow: hidden
        border-radius: 7px
        line-height: 1.2
        a
          color: #fff
          text-shadow: 1px 1px 1px #000
          display: block
          text-transform: uppercase
          font-size: 16px
          font-weight: 600
          padding: 12px 15px
          border-bottom: 1px solid rgba(#fff, .5)
          cursor: pointer
        .active
          background: #ED772E
      +iphone-width
        width: 100%
        max-width: 100%
        .info-menu-wrapper
          display: flex
          width: 100%
          flex-wrap: wrap
          flex-direction: row
          justify-content: center
          margin-bottom: 15px
          border-radius: 0
    .about-right
      flex: 0 0 auto
      width: 83%
      +iphone-width
        width: 100%
        max-width: 100%
</style>
