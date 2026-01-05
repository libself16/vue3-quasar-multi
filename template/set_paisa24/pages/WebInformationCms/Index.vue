<template>
  <div class="container">
    <div class="container-fluid">
      <div class="col-12">
        <div class="page-ttl mb-[3rem]">
          <div class="page-nm">Privacy Policy</div>
        </div>
      </div>
    </div>
    <div class="about-sec-in">
      <div class="about-left">
        <div class="info-menu-wrapper">
          <a
            v-for="menu in webInformationMenuList"
            :key="menu.id"
            :class="{ active: menu.id === currentTab }"
            @click="changeTab(menu.id)"
          >
            {{ menu.title }}
          </a>
        </div>
      </div>
      <div class="about-right">
        <section class="info-wrapper">
          <!-- <h3>{{ webInformationTitle }}</h3> -->
          <div class="detail" v-html="webInformationContent"></div>
          <!-- <h3>Contact Us</h3> -->
          <!-- <ContactUs /> -->
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"
import { onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import ContactUs from "./component/ContactUs.vue"

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
@import "app/template/set_paisa24/assets/css/_variable.scss"

.container-fluid
  width: 90%
  .page-ttl
    display: inline-flex
    background: $primary-color
    padding: 8px 20px
    border-radius: 0px 20px 20px 0px
    align-items: center
    text-transform: uppercase
    color: $game-label-title-color
    font-size: 17px
  +iphone-width
    @apply hidden

.container
  font-family: "Montserrat", sans-serif
  padding: 0 30px
  padding-top: 3rem
  margin: 0
  width: 100%
  max-width: 100%
  +iphone-width
    margin: 0rem
  .about-sec-in
    display: flex
    +iphone-width
      padding-top: 0
      justify-content: center
      flex-direction: column
      margin: 0 auto
    .about-left
      @apply flex-1
      max-width: 16.666667%
      .info-menu-wrapper
        overflow: hidden
        line-height: 1.2
        padding-left: 0
        margin-bottom: 0
        background: $primary-color
        border-radius: 5px
        +iphone-width
          background: transparent
        a
          color: #fff
          text-shadow: .0625rem .0625rem .0625rem #000
          display: block
          text-transform: uppercase
          font-size: 0.8rem
          font-weight: 600
          padding: .75rem .9375rem
          cursor: pointer
          +iphone-width
            height: 50px
            align-items: center
            display: flex
            border-radius: 5px
            padding: 10px 15px
            margin: 0.5rem 0rem
            margin-right: 1rem
            text-transform: uppercase
            font-size: 13px
            font-weight: 700
            background: $primary-color
        .active
          color: $game-label-title-color
      +iphone-width
        width: 100%
        max-width: 100%
        .info-menu-wrapper
          display: flex
          width: 100%
          flex-wrap: wrap
          flex-direction: row
          justify-content: flex-start
          margin-bottom: .9375rem
          border-radius: 0
    .about-right
      @apply flex-1
      max-width: 83.333333%
      +iphone-width
        width: 100%
        max-width: 100%
      .info-wrapper
        margin-left: 1vw
        padding: 1.5625rem 1.875rem
        margin-bottom: 1.875rem
        min-height: 31.25rem
        font-size: .9375rem
        background: $primary-color-light
        border-radius: 10px
        min-height: 700px
        border: 1px solid $primary-color
        +iphone-width
          margin-left: 0
        h3
          color: #fff
          text-transform: uppercase
          position: relative
          font-size: 30px
          font-weight: 700
        .detail
          font-size: 1rem
          color: #62677d
</style>
