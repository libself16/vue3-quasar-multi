<template>
  <div class="container">
    <div class="container-fluid pt-5">
      <div class="col-12">
        <div class="page-ttl mb-5">
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
          <h3>{{ webInformationTitle }}</h3>
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

.container-fluid
  width: 90%
  .page-ttl
    display: inline-flex
    background: #400001
    padding: 8px 20px
    border-radius: 0px 20px 20px 0px
    align-items: center
    text-transform: uppercase
    color: #fd857b
    font-size: 17px
  +iphone-width
    margin: 0 auto

.container
  max-width: 85.375rem
  font-family: "Montserrat", sans-serif
  padding: 0
  margin: 2rem
  +iphone-width
    margin: 0rem
  .about-sec-in
    width: 90%
    display: flex
    padding-top: 1.25rem
    +iphone-width
      padding-top: 0
      justify-content: center
      flex-direction: column
      margin: 0 auto
    .about-left
      flex: 0 0 auto
      width: 14%
      .info-menu-wrapper
        overflow: hidden
        line-height: 1.2
        padding-left: 0
        margin-bottom: 0
        background: #400001
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
            background: #400001
        .active
          color: #fd857b
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
      flex: 0 0 auto
      width: 79%
      +iphone-width
        width: 100%
        max-width: 100%
      .info-wrapper
        margin-left: 1vw
        padding: 1.5625rem 1.875rem
        margin-bottom: 1.875rem
        min-height: 31.25rem
        font-size: .9375rem
        background: #ffffff
        border-radius: 10px
        min-height: 700px
        border: 1px solid #400001
        +iphone-width
          margin-left: 0
        h3
          color: #400001
          text-transform: uppercase
          position: relative
          font-size: 2.5rem
          font-weight: 700
        .detail
          font-size: 1rem
          color: #62677d
</style>
