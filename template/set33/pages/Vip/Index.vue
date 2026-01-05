<template>
  <q-card class="vip-layout">
    <!-- 用戶當前VIP等級 -->
    <q-card-section v-if="isLogin" class="user-vip-container">
      <h2 class="user-vip-title">{{ $t("vip.title") }} LV1</h2>
      <div class="badge-container">
        <div class="badge-shadow"></div>
        <img :src="vipBadge('1')" alt="vip level" class="z-20" />
      </div>
      <!-- 存款額度 -->
      <div class="mt-3 mx-auto leading-snug">
        <div class="flex justify-between px-1">
          <div>{{ $t("vip.deposit") }}</div>
          <div>$ 0 / $ 100</div>
        </div>
        <div class="py-1 pr-9">
          <q-linear-progress size=".75rem" :value="0.35" color="yellow" track-color="progress" rounded>
          </q-linear-progress>
        </div>
      </div>
      <!-- 投注額度 -->
      <div class="mt-3 mx-auto leading-snug">
        <div class="flex justify-between px-1">
          <div>{{ $t("vip.bet") }}</div>
          <div>$ 0 / $ 500</div>
        </div>
        <div class="py-1 pr-9">
          <q-linear-progress size=".75rem" :value="0.35" color="yellow" track-color="progress" rounded>
          </q-linear-progress>
        </div>
      </div>
      <!-- 升級title -->
      <div class="user-vip-next-txt">{{ $t("vip.upgrading") }}<span>VIP 1</span> {{ $t("vip.requires") }}</div>
      <!-- 升級需求 -->
      <div class="mx-auto px-3 w-full grid grid-cols-2 gap-3">
        <div class="user-vip-next-score">
          <h5 class="score-title">{{ $t("vip.deposit") }}</h5>
          <h3 class="score-value">$ 100</h3>
        </div>
        <div class="user-vip-next-score">
          <h5 class="score-title">{{ $t("vip.bet") }}</h5>
          <h3 class="score-value">$ 100</h3>
        </div>
      </div>
    </q-card-section>
    <!-- 全站VIP等級列表 -->
    <q-card-section class="vip-list-container" :class="{ guest: !isLogin }">
      <div class="w-full relative block mx-auto overflow-hidden">
        <carousel :wrapAround="true" :items-to-show="3" :breakpoints="breakpoints">
          <slide v-for="slide in 10" :key="slide">
            <div class="rank-slide-container">
              <div class="rank-slide-image">
                <img loading="lazy" :src="vipBadge(`${slide}`)" alt="vip badge" class="w-full h-auto pt-3 pb-8" />
              </div>
              <div class="rank-slide-info">
                <div class="mt-3 mx-auto text-center w-full">
                  <h4 class="level-text">{{ `LV-${slide}` }}</h4>
                  <h5 class="text-white text-base text-center font-semibold mt-1">Condições de atualização</h5>
                </div>
                <div class="mt-1 mx-auto w-full grid grid-cols-2 gap-3">
                  <div class="rank-slide-rule-box">
                    <h5>{{ $t("vip.totalDeposits") }}</h5>
                    <h4 class="yellow">$0</h4>
                  </div>
                  <div class="rank-slide-rule-box">
                    <h5>{{ $t("vip.totalBets") }}</h5>
                    <h4 class="yellow">$0</h4>
                  </div>
                </div>
                <h4 class="level-text mb-2">{{ $t("vip.levelPrivilege") }}</h4>
                <h6 class="info-text">{{ $t("vip.levelPrivilege") }}{{ $t("vip.rewardTip") }}</h6>
                <hr />
                <h4 class="level-text mb-2">{{ $t("vip.withdrawalPrivileges") }}</h4>
                <h6 class="info-text">{{ $t("vip.updateConditions") }}</h6>
                <h6 class="info-text">{{ $t("vip.withdrawalsTimes") }}</h6>
                <h6 class="info-text">{{ $t("vip.maximumPrice") }}</h6>
                <h6 class="info-text">{{ $t("vip.withdrawalFee") }}</h6>
                <h6 class="info-text">{{ $t("vip.freeWithdrawalTime") }}</h6>
              </div>
            </div>
          </slide>
          <template #addons>
            <Navigation />
          </template>
        </carousel>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { useAuth } from "src/common/hooks/useAuth"
import { useSiteImg } from "app/template/set33/hooks/useSiteImg"
import { Carousel, Navigation, Slide } from "vue3-carousel"
import "vue3-carousel/dist/carousel.css"

const { isLogin } = useAuth()
const { vipBadge } = useSiteImg()

const breakpoints = {
  // 320px and up
  320: {
    itemsToShow: 1,
    snapAlign: "center"
  },
  480: {
    itemsToShow: 1.5,
    snapAlign: "center"
  },
  // 768 and up
  768: {
    itemsToShow: 3,
    snapAlign: "center"
  }
}
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set33/assets/css/progress.sass"

$bg-container: #08192b
$text-blue: #0069bc

.vip-layout
  @apply w-full shadow-none bg-transparent mx-auto p-5 text-white flex gap-5
  max-width: 85.375rem
  +pad-width
    @apply flex-wrap
  .user-vip-container
    background: $bg-container
    border-radius: 0.75rem
    margin: 0 auto
    padding: 1.6875rem
    width: 30%
    +pad-width
      width: 100%
    .user-vip-title
      @apply mx-auto p-2 uppercase w-full text-center
      color: $text-blue
      font-size: 1rem
      font-weight: 700
      line-height: 1.4
    .badge-container
      @apply relative flex justify-center items-center
      margin: 0 auto
      width: 8.75rem
      min-height: 7.5rem
      .badge-shadow
        @apply w-0 h-0 absolute z-10
        border-radius: 50%
        box-shadow: 0 0 100px 50px #fed791
    .user-vip-next-txt
      font-size: .75rem
      font-weight: 600
      padding: .625rem
      text-align: center
      span
        color: $text-blue
    .user-vip-next-score
      @apply rounded-lg flex flex-col justify-center text-center
      background: #008ff7
      padding: 10px
      .score-title
        @apply text-black text-sm font-semibold m-0
      .score-value
        @apply text-base font-semibold mt-4

  .vip-list-container
    background: $bg-container
    border-radius: 0.75rem
    margin: 0 auto
    padding: .9375rem
    width: 70%
    +pad-width
      width:100%
    &.guest
      width:100%
    :deep(.carousel)
      @apply w-full overflow-x-auto cursor-pointer
      background: #050720
      .carousel__prev, .carousel__next
        background: linear-gradient(to bottom, rgb(169, 211, 32) 0%, rgb(56, 131, 18) 100%) !important
        border-radius: 3.125rem
        height: 2.8125rem
        width: 2.8125rem
        font-size: 1.5rem
        opacity: .8
        .carousel__icon
          color: #fff
      .carousel__slide
        padding: 4rem .625rem 0
        .rank-slide-container
          @apply w-full relative text-center rounded-xl
          color: #021524
          background: linear-gradient(to bottom,#0290f6 0%,#033b5c 100%)
          padding: 1.25rem .75rem 1.875rem
          .rank-slide-image
            @apply flex justify-center items-center mx-auto absolute
            left: 0
            right: 0
            top: -3.125rem
            width: 6.25rem
            height: 6.25rem
          .rank-slide-info
            @apply py-3 relative text-center top-5 z-10
            .level-text
              color: #071546
              font-size: 1.125rem
              font-weight: 700
              line-height: 1.5rem
              margin-top: .3125rem
              text-align: center
            .info-text
              @apply  text-xs font-medium mb-2 text-white
            hr
              background: #0069bc
              border: none
              height: 1px
              margin: 0 auto
              width: 100%
          .rank-slide-rule-box
            @apply flex flex-col rounded-lg text-center
            background: #071546
            min-height: 3.75rem
            border: 1px solid #0069bc
            h5
              color: #0069bc
              font-size: .8125rem
              font-weight: 600
              margin-top: .3125rem
              margin-bottom: .5rem
              line-height: 1.25rem
              text-align: center
            h4
              font-size: 1.125rem
              font-weight: 700
              line-height: 1
              color: #fff
              margin-top: .3125rem
              margin-bottom: .5rem
              text-align: center
</style>
