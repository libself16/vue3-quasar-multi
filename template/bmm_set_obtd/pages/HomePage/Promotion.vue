<template>
  <div class="promotion-area" v-if="!isMobile">
    <div class="banner-area">
      <img class="banner-image" src="../../assets/promotions/PromotionBanner.webp" alt="" />
    </div>
    <div class="content-area">
      <div class="title">
        <div class="more">More</div>
        <div class="bestDeals">
          <span>Best</span>
          <span>Deals</span>
        </div>
      </div>
      <div class="promo-tab-wrap">
        <div
          v-for="item in typeList"
          :key="item.value"
          :class="['tab', item.value === activeType ? 'active' : '']"
          @click="changeTab(item)"
        >
          {{ $t(item.name) }}
        </div>
      </div>
      <div class="promo-content-wrap">
        <div class="promo-detail-wrap">
          <div class="detailWrap" v-for="item in promotionList" :key="item.id">
            <div class="contentWrap">
              <q-img class="titleImage" :src="item.details[0].image" />
              <div class="title ellipsis">{{ item.details[0].title }}</div>
              <div class="shortCut ellipsis" v-html="item.details[0].content"></div>
              <div class="bottomWrap">
                <button type="button" class="detailBtn" @click="handleBannerDetail(item.details[0].promotion_id)">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <HeaderTitleBack titleI18n="menu.promotions" v-else>
    <div class="promotion-area-mobile">
      <div class="promotion-tab-area">
        <div class="promotion-tabs-header">
          <div class="header-mask header-mask-left"></div>
          <div class="header-mask header-mask-right"></div>
          <div class="promotion-tabs-list">
            <div class="promotion-tab-line" />
            <div class="promotion-tab">
              <div
                v-for="item in typeList"
                :key="item.value"
                :class="['tab', item.value === activeType ? 'active' : '']"
                @click="changeTab(item)"
              >
                {{ $t(item.name) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="contentView">
        <div class="content" v-for="item in promotionList" :key="item.id">
          <div class="bannerImg">
            <q-img class="bannerImg-content" fit="fill" :src="item.details[0].image" />
          </div>
          <div class="bannerTitle">
            <p>{{ item.details[0].title }}</p>
            <button type="button" @click="handleBannerDetail(item.details[0].promotion_id)">Details</button>
          </div>
        </div>
      </div>
    </div>
    <FooterNav />
  </HeaderTitleBack>
</template>

<script lang="ts" setup>
import { usePromotion, type TypeItem } from "src/common/composables/usePromotion"
import { computed, onMounted, onUnmounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { AI_HELPER_EVENT_ROUTES } from "src/common/utils/constants"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import FooterNav from "../../components/Footer/FooterNav.vue"

const router = useRouter()
const { activeType, updateActiveType, typeList, promotionList, handlePromotionList } = usePromotion()
const { handleAIHelperRouteEvent } = useAIHelperEvent()
const isMobile = ref(window.innerWidth <= 768)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const aosEffect = ref("fadeIn")
const enterActiveClass = computed(() => `animated ${aosEffect.value}`)
const changeTab = (current: TypeItem) => {
  aosEffect.value = current.value > activeType.value ? "fadeInRight" : "fadeInLeft"
  updateActiveType(current)
}

const handleBannerDetail = (id: any) => {
  router.push({ name: "PromotionDetail", params: { id } })
}

onMounted(async () => {
  handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.PROMOTION)
  await handlePromotionList()
  window.addEventListener("resize", updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener("resize", updateIsMobile)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/bmm_set_obtd/assets/css/_variable.sass"

.promotion-area
  margin: 20px auto 40px auto
  width: 980px
  .banner-area
    +setFlex
    width: 100%
    padding: 60px 0
    +iphone-width
      display: none
  .content-area
    margin: 40px 0
    .title
      height: 50px
      margin-bottom: 20px
      .more
        font-weight: 860
        font-size: 14px
        line-height: 17px
        opacity: 0.5
        font-style: normal
        color: $primary-color
        font-family: OpenSans
      .bestDeals
        font-weight: 600
        font-size: 28px
        font-family: OpenSans
        span
          &:nth-of-type(1)
            color: $primary-color
            font-weight: 860
          &:nth-of-type(2)
            margin-left: 8px
            color: $text-charcoal-gray-color
    .promo-tab-wrap
      display: flex
      -webkit-box-pack: start
      justify-content: flex-start
      -webkit-box-align: center
      align-items: center
      gap: 10px
      .tab
        padding: 10px 20px
        border-radius: 100px
        background: $background-pale-silver-color
        color: $text-steel-blue-color
        font-size: 16px
        font-family: OpenSans
        font-weight: 400
        text-align: center
        cursor: pointer
        &.active
          background: $primary-color
          color: $text-light-color
          font-weight: 510
          transition: 0.3s
    .promo-content-wrap
      margin-top: 20px
      width: 100%
      .promo-detail-wrap
        display: grid
        gap: 16px
        grid-template-columns: repeat(var(--grid-cols), minmax(0, 1fr))
        --grid-cols: 4
        --grid-size: 233px
        --box-height: 304px
        --item-height: 304px
        .detailWrap
          text-align: center
          background: $background-light-color
          border-radius: 24px
          position: relative
          .contentWrap
            margin: 24px
            .titleImage
              @apply rounded-[1rem]
            .title
              font-style: normal
              font-weight: 590
              font-size: 16px
              height: 30px
              line-height: 16px
              margin-top: 20px
              text-align: left
              color: $text-charcoal-gray-color
              margin-bottom: 20px
              font-family: OpenSans
            .shortCut
              font-style: normal
              font-weight: 400
              font-size: 14px
              display: flex
              -webkit-box-align: center
              align-items: center
              color: $text-charcoal-gray-color
              min-height: 38px
              margin-top: 12px
              text-align: left
            .ellipsis
              display: -webkit-box
              -webkit-line-clamp: 2
              -webkit-box-orient: vertical
              overflow: hidden
              text-overflow: ellipsis
            .bottomWrap
              .expireTime
                margin: 12px 0px
                height: 18px
                color: $text-steel-blue-color
                font-size: 12px
                font-weight: 400
                overflow-wrap: break-word
              .detailBtn
                width: 100%
                height: 28px
                border-radius: 100px
                background: $primary-color
                color: $text-light-color
                font-size: 12px
                margin-top: 12px
                overflow: hidden
                border-width: 0px
                cursor: pointer
                font-family: Arial

.promotion-area-mobile
  width: 100%
  padding-bottom: 6rem
  .promotion-tab-area
    direction: ltr
    --active-line-color: none
    --active-line-height: 0
    --title-font-size: 17px
    --content-padding: 12px
    --active-line-border-radius: 0
    --active-title-color: $text-vivid-blue-color
    min-width: 0
    position: relative
    background-color: $background-light-color

    .promotion-tabs-header
      border-bottom: 1px solid $border-pale-silver-color
      position: relative
      padding: 6px 0px
      .promotion-tabs-list
        display: flex
        -webkit-box-pack: start
        justify-content: flex-start
        -webkit-box-align: center
        align-items: center
        flex-wrap: nowrap
        overflow-x: scroll
        overflow-y: hidden
        position: relative
        scrollbar-width: none
        width: 100vw
        .promotion-tab-line
          background: none
          border-radius: 0
          bottom: 0
          height: 0
          position: absolute
          width: 75px
          transform: translate3d(12px, 0px, 0px)
        .promotion-tab
          +setFlex
          flex: 0 0 auto
          padding: 0 12px
          .tab
            min-width: 68px
            height: 35px
            padding: 0px 12px
            display: flex
            -webkit-box-pack: center
            justify-content: center
            -webkit-box-align: center
            align-items: center
            border-radius: 44px
            color: $text-steel-blue-color
            font-family: Helvetica
            font-size: 12px
            font-weight: 400
            line-height: 19px
            text-transform: capitalize
            cursor: pointer
            margin: 0 0
            position: relative
            white-space: nowrap
            width: min-content
            &.active
              background-color: $primary-color
              color: $text-light-color
      .header-mask
        display: none
        bottom: 0
        height: 100%
        pointer-events: none
        position: absolute
        top: 0
        width: 30px
        z-index: 1
      .header-mask-left
        background: linear-gradient(to right, $background-light-color)
        left: 0
        opacity: 0
      .header-mask-right
        background: linear-gradiend(to left, $border-light-color, #fff0)
        right: 0
        opacity: 1
  .contentView
    @apply px-[.625rem]
    flex: 1 1 0%
    width: 100%
    height: 100%
    overflow: hidden auto
    .content
      width: 100%
      min-height: 150px
      border-radius: 12px
      overflow: hidden
      display: flex
      flex-direction: column
      margin: 1rem 0
      .bannerImg-content
        @apply w-full h-full rounded-[.625rem]
      .bannerTitle
        width: 100%
        height: 42px
        display: flex
        -webkit-box-pack: justify
        justify-content: space-between
        -webkit-box-align: center
        align-items: center
        padding: 0px 10px
        background-color: $background-light-color
        border-bottom-left-radius: inherit
        border-bottom-right-radius: inherit
        p
          flex: 1 1 0%
          width: 100%
          color: $text-ocean-blue-dark-color
          font-family: "Open Sans"
          font-size: 14px
          font-weight: 700
          line-height: 42px
          text-transform: capitalize
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        button
          margin-left: 10px
          flex-shrink: 0
          min-width: 68px
          height: 32px
          padding: 0px 8px
          border-radius: 19px
          border: 1px solid $primary-color
          background-color: transparent
          color: $primary-color
          font-family: "Open Sans"
          font-size: 12px
          font-weight: 600
          line-height: 22px
</style>
