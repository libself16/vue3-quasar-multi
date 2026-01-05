<template>
  <div class="promotion-detail-area" v-if="!isMobile">
    <div class="detailMainContent">
      <div class="fast-navigate">
        <svg class="arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <a class="home" @click="router.push({ name: 'home' })">Home</a>
        <a @click="router.push({ name: 'promotion' })">Promotions</a>
        <span>Detail</span>
      </div>
      <div class="divide"></div>
      <div class="title ellipsis">{{ promotionDetail.title }}</div>
      <div class="mainPic">
        <q-img :src="promotionDetail.image" />
      </div>
      <div class="mainContent" v-html="promotionDetail.content"></div>
    </div>
  </div>
  <HeaderTitleBack titleI18n="menu.promotionDetails" v-else>
    <div class="promotion-detail-area-mobile">
      <q-img class="detailImg" fit="fill" :src="promotionDetail.image" />
      <div class="detailTitle">{{ promotionDetail.title }}</div>
      <div class="detailText" v-html="promotionDetail.content"></div>
    </div>
  </HeaderTitleBack>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from "vue"
import { useRoute } from "vue-router"
import { useRouter } from "vue-router"
import { usePromotion } from "src/common/composables/usePromotion"
import type * as Response from "src/api/response.type"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"

const { promotionList, handlePromotionList } = usePromotion()
const router = useRouter()
const route = useRoute()
const isMobile = ref(window.innerWidth <= 768)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}
const promotionDetail = ref<Response.PromotionDetail>({
  promotion_id: 0,
  lang: "",
  title: "",
  content: "",
  image: ""
})

onMounted(async () => {
  window.addEventListener("resize", updateIsMobile)
  await handlePromotionList()
  const promotion = promotionList.value.find((item) =>
    item.details.some((detail) => detail.promotion_id.toString() === route.params.id)
  )
  if (promotion) {
    const detail = promotion.details.find((d) => d.promotion_id.toString() === route.params.id)
    if (detail) {
      promotionDetail.value = detail
    }
  }
})

onUnmounted(() => {
  window.removeEventListener("resize", updateIsMobile)
})
</script>

<style lang="sass">
@import "src/common/css/_variable.sass"
@import "app/template/bmm_set_obtd/assets/css/_variable.sass"

.promotion-detail-area
  width: 980px
  margin: 20px auto
  background: $background-light-color
  border-radius: 24px
  table
    width: 100% !important
    th, td
      border: 1px solid
  .detailMainContent
    padding: 40px 48px
    .fast-navigate
      color: $text-sky-gray-color
      font-family: OpenSans
      font-style: normal
      font-weight: 400
      font-size: 16px
      line-height: 19px
      position: relative
      display: flex
      -webkit-box-align: center
      align-items: center
      .arrow
        height: 20px
        width: 20px
        cursor: pointer
      a
        color: $text-sky-gray-color
        cursor: pointer
        position: relative
        text-decoration: none
        &::after
          content: "/"
          margin: 0px 8px
      span
        color: $primary-color
    .divide
      width: 100%
      height: 1px
      background: $background-pale-silver-color
      margin-top: 20px
    .ellipsis
      display: -webkit-box
      -webkit-line-clamp: 2
      -webkit-box-orient: vertical
      overflow: hidden
      text-overflow: ellipsis
    .title
      width: 100%
      overflow-wrap: break-word
      font-family: OpenSans
      font-weight: 590
      font-size: 40px
      -webkit-box-align: center
      align-items: center
      letter-spacing: 0.8px
      text-transform: capitalize
      color: $text-charcoal-gray-color
      margin-top: 40px
    .expireTime
      margin-top: 24px
      font-style: normal
      font-weight: 400
      font-size: 20px
      color: $text-steel-blue-color
    .mainPic
      width: 100%
      background-blend-mode: soft-light
      mix-blend-mode: normal
      border-radius: 24px
      margin-top: 40px
    .mainContent
      margin-top: 40px
      width: 100%
      font-style: normal
      font-weight: 400
      font-size: 20px
      line-height: 27px
      color: $text-slate-blue-color
      word-wrap: break-word


.promotion-detail-area-mobile
  width: 100%
  padding: 12px
  font-family: Helvetica
  table
    width: 100% !important
    th, td
      border: 1px solid
  .detailImg
    @apply w-full h-full rounded-[.625rem] mb-3
  .detailTitle
    width: 100%
    color: $text-night-sky-color
    font-size: 16px
    font-weight: 700
    text-transform: capitalize
    line-height: 22px
    min-height: 22px
    padding-bottom: 8px
  .detailSubText
    width: 100%
    color: $text-steel-blue-color
    font-size: 12px
    font-weight: 400
    line-height: 20px
    text-transform: capitalize
    min-height: 20px
    padding-bottom: 7px
  .detailText
    width: 100%
    margin-top: 12px
    padding: 12px 9px
    border-radius: 12px
    background-color: $background-light-color
    color: $text-ocean-blue-dark-color
    font-family: Helvetica
    font-size: 14px
    font-weight: 400
    line-height: 16px
    word-wrap: break-word
</style>
