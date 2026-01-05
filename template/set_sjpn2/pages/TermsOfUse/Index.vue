<template>
  <div class="container">
    <p class="title">{{ termsTitle }}</p>
    <div class="term-in">
      <div class="term-left">
        <div class="info-menu-wrapper">
          <q-btn
            :class="{ active: isActive('GeneralTerms') }"
            @click="
              $router.push({
                name: 'GeneralTerms'
              })
            "
            >{{ $t("common.btn.generalTerms") }}</q-btn
          >
          <q-btn
            :class="{ active: isActive('CampaignTerms') }"
            @click="
              $router.push({
                name: 'CampaignTerms'
              })
            "
            >{{ $t("common.btn.campaignTerms") }}</q-btn
          >
        </div>
      </div>
      <div class="term-right"><router-view name="layout" /><router-view /></div>
    </div>
    <div class="top_btn" @click="scrollToTop">
      <q-img :src="iconPng('top')" class="arrow" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"

import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import { useSiteImg } from "app/template/set_sjpn2/hooks/useSiteImg"

const { t } = useI18n()
const termsTitle = ref(t("common.btn.generalTerms"))
const { iconPng } = useSiteImg()

const route = useRoute()
function isActive(name: string) {
  return route.name === name
}
function scrollToTop() {
  const scrollContainer = document.querySelector(".scroll")
  if (scrollContainer) {
    scrollContainer.scrollTo({
      top: 0,
      behavior: "smooth" // 平滑滚动
    })
  }
}
watch(
  () => route.name,
  (newRoute) => {
    if (newRoute === "GeneralTerms") {
      termsTitle.value = t("common.btn.generalTerms")
    } else {
      termsTitle.value = t("common.btn.campaignTerms")
    }
  },
  { immediate: true }
)
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.container
  max-width: 1366px
  padding: 0
  margin: 0 auto
  .top_btn
    width: 48px
    height: 48px
    background-color: #000000
    border-radius: 50%
    display: flex
    justify-content: center
    align-items: center
    position: fixed
    right: 2vw
    bottom: 3vw
    cursor: pointer
    +iphone-width
      bottom: 18vw
      bottom: 1vw


  +iphone-width
    padding: 0 6vw
  .title
    width: 100%
    text-align: center
    border-bottom: 1px solid #707070
    padding-bottom: 0.6vw
    margin-bottom: 2vw
    text-transform: uppercase
    font-size: 55px
    font-weight: 400
    +iphone-width
      padding-top: 13vw
      padding-bottom: 3vw
      font-size: 24px
      margin-bottom: 5vw

  .term-in
    display: flex
    padding-top: 20px
    +iphone-width
      padding-top: 0
      flex-direction: column
    .term-left
      flex: 0 0 auto
      width: 16%
      .info-menu-wrapper
        :deep(.q-btn)
          width: 100%
          background: rgba(0, 0, 0, .8)
          padding-bottom: 18px
          padding-top: 18px
          border-radius: 12px
          gap: 4px
          margin-bottom: 20px
          +iphone-width
            width: 48%
            padding-bottom: 14px
            padding-top: 14px
        .active
          background: #131313
          border: 1px solid #ffffff

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
          +iphone-width
            justify-content: space-between

    .term-right
      flex: 0 0 auto
      width: 83%
      +iphone-width
        width: 100%
        max-width: 100%
</style>
