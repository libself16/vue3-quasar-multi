<template>
  <div class="aside-menu">
    <div class="cover" v-show="isMobile && modelValue" @click="$emit('update:modelValue', false)"></div>
    <div class="side-menu" :class="{ 'is-mobile': modelValue }">
      <div class="logo" @click="router.push({ path: '/' })">
        <img class="payment-method" :src="logoImg" alt="" />
      </div>
      <div class="button-area" :class="{ 'mobile-area': isMobile }">
        <div
          class="btn-common"
          :class="{ 'normal-btn': !isMobile, 'mobile-btn': isMobile }"
          v-for="(aside, key) in MenuState.pc.top"
          :key="key"
          @click="goRouter(aside.routerName)"
        >
          <img :src="menuIcon(aside.cssSuffix)" alt="" />
          <span class="btn-title">{{ $t(aside.label) }}</span>
        </div>
        <div
          class="btn-common"
          :class="{ 'normal-btn': !isMobile, 'mobile-btn': isMobile }"
          v-for="(aside, key) in MenuState.pc.middle"
          :key="key"
        >
          <router-link
            class="navlink"
            :to="{
              name: 'GameLobby',
              params: { gameTypeId: aside.gameTypeId }
            }"
          >
            <img v-if="aside.cssSuffix === 'slots'" :src="gifIcon(aside.cssSuffix)" alt="" />
            <img v-else :src="menuIcon(aside.cssSuffix)" alt="" />
            <span class="btn-title">{{ $t(aside.label) }}</span>
          </router-link>
        </div>
        <div
          class="btn-common"
          :class="{ 'normal-btn': !isMobile, 'mobile-btn': isMobile }"
          v-for="(aside, key) in MenuState.pc.bottom"
          :key="key"
          @click="goRouter(aside.routerName)"
        >
          <img :src="menuIcon(aside.cssSuffix)" alt="" />
          <span class="btn-title">{{ $t(aside.label) }}</span>
        </div>
        <q-btn
          v-if="isLogin"
          rounded
          class="block w-full mt-3 logout-btn"
          color="main-color"
          :loading="isLoading"
          @click="logout"
          >logout</q-btn
        >
      </div>
    </div>
    <q-dialog v-model="loginStatus">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet
          porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro
          labore.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { useWindowSize } from "@vueuse/core"
import { useQuasar } from "quasar"
import { useGame } from "src/common/composables/useGame"
import { useAuth } from "src/common/hooks/useAuth"
import { useSiteImg } from "app/template/epicwin/hooks/useSiteImg"
import { defineComponent, ref, Ref, watch } from "vue"
import { useRouter } from "vue-router"
import { useMenu } from "../composables/useMenu"

export default defineComponent({
  name: "AsideMenu",
  components: {},
  props: ["modelValue"],
  emits: ["changeLogin", "changeRegister", "update:modelValue"],
  setup(props, { emit }) {
    const { gameTypeState } = useGame()
    const { MenuState } = useMenu()
    const { isLogin, isLoading, handleLogout } = useAuth()
    const $q = useQuasar()
    const { gifIcon, menuIcon, logoImg } = useSiteImg()
    const router = useRouter()
    const { width } = useWindowSize()
    let isMobile = ref(false)

    let topList: Ref<string[]> = ref(["promotion", "deposit"])

    let bottomList: Ref<string[]> = ref(["follow"])

    const goRouter = (aside: string) => {
      switch (aside) {
        case "sports":
          location.href = "https://uat0011.com/desktop"
          break
        case "sabong":
          location.href = "https://www.ds88sabong.xyz/"
          break

        default:
          router.push({ path: `/${aside}` })
          if (isMobile.value) emit("update:modelValue", false)
          break
      }
    }

    let loginStatus = ref(false)

    const getLogin = () => {
      emit("changeLogin", true)
    }

    const getRegister = () => {
      emit("changeRegister", true)
    }

    watch(
      width,
      (newWidth) => {
        if (newWidth >= 576) {
          isMobile.value = false
        } else {
          isMobile.value = true
        }
      },
      { immediate: true }
    )

    async function logout() {
      const { status } = await handleLogout()

      if (!status) {
        return
      }

      $q.notify({
        type: "positive",
        message: "logout success",
        position: "top",
        timeout: 1000
      })
    }

    return {
      MenuState,
      gameTypeState,
      goRouter,
      // 圖片類
      gifIcon,
      menuIcon,
      logoImg,
      //-----------
      router,
      isMobile,
      loginStatus,
      getRegister,
      getLogin,
      topList,
      bottomList,
      isLogin,
      isLoading,
      logout
    }
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

// ::-webkit-scrollbar
//   display: none
// common style
.logout-btn
  color: #ffffff !important
  background: linear-gradient(180deg, #c102fd 0%, #8901ff 100%)
  border-color: #b46ffd
  border-radius: 30px
.btn-common
  margin: 0vw
  img
    width: 2rem
    +pc-width
      width: 2vw
    +iphone-width
      width: 4vw
.btn-title
  @apply text-white
  font-family: "Century Gothic"
  // font-size: 1.2vw
  font-style: normal
  font-size: 0.9rem
  font-weight: 700
  line-height: normal
  text-transform: uppercase
  +pc-width
    font-size: 1.5vw
  +iphone-width
    font-size: 3vw
    text-align: center
.btn-content
  color: rgba(255, 255, 255, 0.70)
  font-family: "Century Gothic"
  font-size: 0.8vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
  +iphone-width
    font-size: 3vw
  &.yellow
    color: $yellow-active
// layout style
.aside-menu
  max-width: 300px
  width: 20vw
  height: 100vh
  overflow-y: scroll
  +iphone-width
    width: 0%
.cover
  width: 100%
  height: 100%
  position: fixed
  +setFlex
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  background-color: rgba(0, 0, 0, 0.5)
  z-index: 10
.side-menu
  background: black
  flex-shrink: 0
  width: 20%
  height: 100vh
  max-width: 300px
  vertical-align: top
  // height: 100%
  display: table-cell
  // padding-bottom: 20vw
  overflow-y: auto
  .go-back-mobile
    display: none
  // +pad-width
  //   width: 35%
  +iphone-width
    position: fixed
    right: 0
    z-index: 10
    height: 100vh
    width: 70%
    .go-back-mobile
      display: flex
      justify-content: space-between
      align-items: center
      padding: 15px 30px
      .back
        cursor: pointer
        img
          transform: rotate(180deg)
      .aside-svg
        +setFlex
        flex-direction: row
        img
          padding-left: 5px
          cursor: pointer
  .logo
    // @apply py-6
    +setFlex
    width: 15vw
    margin: 0 auto
    padding: 2rem 0
    cursor: pointer
    +iphone-width
      width: 100%
      padding: 0
      background: #260748
  .rectangle
    width: 90%
    margin: 1vw auto
  .button-area
    width: 90%
    margin: 0 auto
    height: auto
    +setFlex
    flex-direction: column
    .q-btn
      margin: 1rem
    &.mobile-area
      // width: 76%
      justify-content: flex-start
      flex-direction: row
      flex-wrap: wrap
    +iphone-width
      padding: 2vw 0
    .mobile-btn
      @apply p-4
      +setFlex
      border: 1px solid #888
      border-radius: 10px
      width: calc(50% - 0.8rem)
      height: 25vw
      margin: 0.4rem
      cursor: pointer
      box-shadow: 1px 3px 3px 0px #be66e9
      -webkit-box-shadow: 1px 3px 3px 0px #be66e9
      -moz-box-shadow: 1px 3px 3px 0px #be66e9
      flex-direction: column
      a
        +setFlex
        flex-direction: column
      img
        width: 3rem
      span
        @apply p-1
    .normal-btn
      @apply h-4
      cursor: pointer
      display: flex
      justify-content: flex-start
      align-items: center
      width: 100%
      height: 2.2rem
      margin: 0.5vw 2%
      // height: 4vw
      border-radius: 0.4vw
      padding: 0 1rem
      // padding: 1.2vw 2vw
      // background: #1d3677
      +phone-width
        padding: 1.5vw 2vw
      +iphone-width
        height: 7vw
        padding: 1vw 5vw
      &:hover
        background: rgb(0 0 0 / 50%)
        filter: drop-shadow(2px 2px 1px #c003fd)
        border-radius: 50px
        .btn-title
          color: #FFF !important
      .navlink
        width: 100%
        display: flex
        justify-content: flex-start
        align-items: center
      span
        margin: 0 1vw
        +iphone-width
          margin: 0 3vw
  .flex-layout
    width: 100%
    margin: 5% 0
    +setFlex
    &.hover-style
      cursor: pointer
    .layout-image
      width: 100%
      padding: 0 0.2vw
</style>
