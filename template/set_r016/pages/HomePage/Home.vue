<template>
  <CarouselBanner :showAll="false" :bannerPosition="BANNER_POSITION.Enums.Home" />
  <!-- <MarqueeList /> -->
  <div class="home-layout">
    <div class="nav-layout">
      <div class="login-btn">
        <q-btn v-if="!isLogin" class="loginBtn" color="primary" @click="handleOpenModal">
          {{ `${$t("menu.login")} / ${$t("menu.register")}` }}
        </q-btn>
        <WalletDropdown v-else />
      </div>
      <ul class="main-nav">
        <li v-for="(cmsItem, cmsIndex) in cmsNavList" :key="cmsIndex" class="nav-item">
          <div class="navlink" @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })">
            <img
              v-if="cmsItem.Setting.icon_path"
              class="btn-icon"
              :src="
                isActive(cmsItem.Entrance[0], cmsIndex) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path
              "
            />
            <span class="btn-title">{{
              limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)
            }}</span>
          </div>
        </li>
        <!-- <li class="nav-item" :class="{ active: route.path === '/Vip' }">
          <router-link class="navlink" to="/Vip">
            <span>VIP</span>
          </router-link>
        </li> -->
      </ul>
    </div>
    <div class="home-content">
      <GameList :initial-game-type="Number($route.query.gameType || $route.params.gameType)" />
      <!-- 串接 CMS 首頁入口列表 -->
      <!-- <div v-if="cmsListState[CMS_TYPE.Enums.HOME].length" class="home-content-cms">
        <div v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.HOME]" :key="cmsIndex" class="game-show-area">
          <div v-if="shouldDisplayDevice(cmsItem)" class="home-cms-item">
            <div class="game-title">
              <q-img
                v-if="cmsItem.Setting.icon_path"
                :src="cmsItem.Setting.icon_path"
                class="home-title-icon"
                @error="setDefaultProductImg"
                contain
              />
              <p class="title-label">
                {{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
              </p>
            </div>
            <ul class="game-list long slide-game-list">
              <template v-if="isCarousel(cmsItem)">
                <Carousel
                  :breakpoints="getBreakpoints(cmsItem)"
                  :wrapAround="false"
                  :transition="500"
                  snapAlign="start"
                >
                  <Slide v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex">
                    <CmsGameItem :entrance="entrance" />
                  </Slide>
                  <template #addons>
                    <Navigation />
                  </template>
                </Carousel>
              </template>
              <template v-else>
                <div class="game-grid" :style="getGridStyle(cmsItem)">
                  <div v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex">
                    <CmsGameItem :entrance="entrance" />
                  </div>
                </div>
              </template>
            </ul>
          </div>
        </div>
      </div> -->
      <!-- 串接 CMS 網頁形象圖 -->
      <!-- <template v-if="cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE].length">
        <div class="game-show-area">
          <ul class="game-list join">
            <li
              v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE].slice(0, 3)"
              :key="cmsIndex"
            >
              <q-img
                @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
                :src="cmsItem.Setting.img_lang[nowLang as LANGUAGE_TYPE.Enums]"
                class="cursor-pointer"
                contain
              />
            </li>
          </ul>
        </div>
        <div
          v-if="
            cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE].length > 3 &&
            cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE][3]?.Setting
          "
          class="game-show-area"
        >
          <img
            @click="
              handleEntranceClick({ entrance: cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE][3].Entrance[0] })
            "
            :src="cmsListState[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE][3].Setting.img_lang[nowLang as LANGUAGE_TYPE.Enums]"
            class="px-[4.5vw]"
          />
        </div>
      </template> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set_r016/composables/useCms"
import GameList from "app/template/set_r016/pages/HomePage/GameList.vue"
import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"
import CarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import { useBanner } from "src/common/composables/useBanner"
import { useCms } from "src/common/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { BANNER_POSITION, CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useBank } from "src/common/composables/useBank"
import { useUserInfo } from "src/common/composables/useUserInfo"
import WalletDropdown from "../../components/WalletDropdown.vue"
import { MENU } from "../../utils/constants"

const $q = useQuasar()
const { navigationBarList, handleCmsList } = useCms()
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const route = useRoute()
const router = useRouter()
const eventbus = injectStrict(EventBusKey)
const { isLogin } = useAuth()
const { activeWalletCurrencyId } = useUserInfo()
const { getFirstDepositPromotion, firstDepositPromotionInfo } = useBank()

const activeIndex = ref(0)

const isCarousel = computed(() => (cmsItem: Response.CmsItem) => {
  return cmsItem.Setting.payload.arrangement === 0
})

const { getAllGames } = useGame()
const { handleBannerList } = useBanner()

const limitWordLength = (word: string) => {
  if (!word) return ""
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

const cmsNavList = computed(() => {
  if ($q.platform.is.mobile) {
    return navigationBarList.value.slice(0, 3)
  }
  return navigationBarList.value
})

const isActive = (entrance: any, index: number) => {
  let active = route.name === getRouterInfo(entrance.payload.did)

  if (entrance.payload.game_type) {
    active = route.params.gameType == entrance.payload.game_type

    if (active) {
      activeIndex.value = index
    }
  }

  return active
}

const getRouterInfo = (did: string) => {
  return MENU.RouterNameMapping[did]
}

const handleOpenModal = () => {
  if (isLogin.value) {
    router.push({ name: "memberProfile" })
  } else {
    router.push({ name: "Login" })
  }
}

onMounted(async () => {
  await handleBannerList(BANNER_POSITION.Enums.All)
  await getAllGames()
  await handleCmsList(CMS_TYPE.Enums.HOME)
  await handleCmsList(CMS_TYPE.Enums.NAVIGATION_BAR)
  await handleCmsList(CMS_TYPE.Enums.HOME_INFORMATION_IMAGE)
  if (isLogin.value) {
    await getFirstDepositPromotion(activeWalletCurrencyId.value)
    console.log("firstDepositPromotionInfo :>> ", firstDepositPromotionInfo.value)
    if (firstDepositPromotionInfo.value) {
      eventbus.emit("openFirstDepositDialog" as any, true, firstDepositPromotionInfo.value)
    }
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "../../assets/css/game.sass"
@import 'app/template/set_r016/assets/css/_variable.scss'

.home-layout
  // background-color: red
  width: 100%
  height: 70%
  padding-top: 2rem
  +phone-width
    padding-top: 1.25rem
.nav-layout
  +setFlex
  border-radius: 10px
  background: var(--neutral-03, #F6F6F6)
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.30), 0px 0px 10px 0px rgba(0, 0, 0, 0.20)
  margin-bottom: 1.5rem
  +phone-width
    flex-direction: column
    min-height: 8.75rem
    padding: 0.625rem
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2), 0px 4px 4px 0px rgba(0, 0, 0, 0.3)
  .login-btn
    width: 40%
    height: 100%
    margin: 0 2rem
    ::v-deep(.q-btn)
      border-radius: 10px
      background: linear-gradient(180deg, #CF0808 0%, #A80707 100%) !important
      +phone-width
        width: 100%
        margin: 0.6875rem 0
    +phone-width
      width: 100%
      margin: 0
  .main-nav
    display: flex
    width: 60%
    padding: 30px 40px
    align-items: center
    justify-content: flex-start
    gap: 30px
    overflow-x: auto
    +phone-width
      justify-content: center
      padding: 0
      width: 100%
      margin-top: .625rem
    .nav-item
      +setFlex
      width: 65px
      height: 65px
      border-radius: 0.5rem

      &.active
        @apply my-2
        background: linear-gradient(0deg, #000000 0%, #2a2a2a 100%)
        border: 1px solid rgba(255, 247, 233, 1)
        opacity: 1
        span
          font-weight: 700

      .navlink
        cursor: pointer
        +setFlex
        flex-direction: column

        .btn-icon
          width: 2.8125rem
          margin-bottom: 0.5rem
          +phone-width
            width: 1.6875rem

      .btn-title
        +fontStyle(1rem, 400)
        width: 100%
        white-space: nowrap
        text-align: center
        +phone-width
          +fontStyle(0.875rem, 400)


.game-list
  .carousel
    @apply w-full
    .carousel__viewport
      li
        @apply justify-start
  ::v-deep(.carousel__prev)
    width: 20px
    height: 20px
    color: rgba(255,255,255,0.7)
    border: 1px solid #b70606
    border-radius: 50%
    background: rgba(255,255,255,0.2)
    position: absolute !important
    top: -2vw !important
    right: 40px
    left: unset
    +phone-width
      right: 2rem !important
    +iphone-width
      top: -4vw !important
  ::v-deep(.carousel__next)
    width: 20px
    height: 20px
    color: rgba(255,255,255,0.7)
    border: 1px solid #b70606
    border-radius: 50%
    background: rgba(255,255,255,0.2)
    position: absolute !important
    top: -2vw !important
    +iphone-width
      top: -4vw !important
// layout style
.home-content
  +setFlex
  flex-direction: column
  position: relative
  .game-show-area
    +setFlex
    flex-direction: column
    padding: 1vw
    width: 100%
    &.provider
      padding-left: 0
      padding-right: 0
    .game-title
      width: 100%
      display: flex
      justify-content: flex-start
      align-items: center
      padding: 0 5vw
      +pad-width
        height: 40px
      +iphone-width
        height: 8vw
        padding: 0 1.75rem
      .title-icon
        width: 0.5vw
        height: 1.5vw
        background: $yellow-active
        margin-right: 0.5rem
        +pad-width
          width: 5px
          height: 15px
        +iphone-width
          width: 1.2vw
          height: 3.4vw

      p.title-label
        color: #FFF
        font-weight: 700
        font-size: 1.5rem
        +iphone-width
          font-size: 1rem
    .game-list
      +setFlex
      @apply justify-start
      list-style: none
      margin-top: 1.75rem
      margin-bottom: 2.75rem
      padding: 0 5vw
      width: 100%
      +iphone-width
        display: inline-block
        padding: 0 3.5vw
        margin-top: .875rem
        margin-bottom: 2.5rem
      &.slide-game-list
        +iphone-width
          padding: 0 28px
      &.product
        @apply w-full grid grid-cols-2 gap-2
        +iphone-width
          @apply grid-cols-1
        li
          width: 96%
          .game-box
            position: relative
            display: inline-block
            margin: 0 1% 1% 0
            padding: 0
            width: 100%
            cursor: pointer
            +iphone-width
              margin: 0
              width: 91vw
            .play-now
              position: absolute
              top: 8vw
              left: 2vw
              +iphone-width
                top: 24vw
                left: 6vw
            :deep(.q-focus-helper)
              opacity: 0 !important
      &.long
        li
          // margin-right: 1vw
        img
          // width: 90%
          // border-radius: .75rem
      &.join
          @apply grid grid-cols-3 gap-3
          li
            margin-right: 1vw
            img
              border-radius: .625rem
            &:last-child
              margin-right: 0
          +iphone-width
            width: 98vw
      img
        // margin-right: 1vw
        width: 35vw
        height: 100%
        +pad-width
          width: 100%
        +iphone-width
          width: 100vw
        // max-width: 200px
    .provider-list
      @apply w-full bg-black text-white flex  overflow-auto gap-3
      padding-left: 4.5vw
      padding-right: 4.5vw
      padding-top: .75rem
      padding-bottom: .75rem
      max-width: 100vw
      scrollbar-width: none
      -ms-overflow-style: none
      .provider-img
        width: 8.5rem
        height: 3rem
        max-width: 8.5rem
// custom cms style
.home-content-cms
  @apply flex flex-col w-full
  +phone-width
    @apply pt-4 !important
  @apply py-[1vw]
  .game-show-area
    @apply px-[0.5vw]
  .image-container
    @apply flex w-full px-[4.5vw]
  .home-cms-item
    @apply flex flex-col w-full
    .game-list
      .game-item
        @apply mx-1 md:mr-3
    +phone-width
      @apply relative
      .game-title
        @apply absolute -top-[1.5rem] left-0
      ::v-deep(.carousel__prev)
        @apply -top-[1.5rem] !important
      ::v-deep(.carousel__next)
        @apply -top-[1.5rem] !important
    .home-title-icon
      @apply w-[3vw] h-[3vw] mr-[0.5rem]
  .game-grid
    @apply grid gap-3
    grid-template-columns: repeat(var(--grid-columns), 1fr)
  +phone-width
    @apply pt-[3.75rem]
</style>
