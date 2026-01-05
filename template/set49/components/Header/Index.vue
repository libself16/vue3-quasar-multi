<template>
  <div class="header">
    <div class="header-left">
      <HamburgerBox @click="emit('update:modelValue', true)"></HamburgerBox>
      <q-btn flat fab-mini class="h5_logo" @click="$router.push('/')" v-if="isMobile">
        <img class="h5_logo" :src="getSquareLogo()" />
      </q-btn>
    </div>
    <div class="header-center" v-if="isLogin"><WalletDropdown /></div>
    <div class="nav header-right">
      <ul>
        <!--無功能+API 暫時隱藏
         <li v-if="!isMobile">
          <FilterInput></FilterInput>
        </li>-->
        <li>
          <q-btn flat fab-mini color="white" class="menuft" @click="handleOpenModal">
            <img :src="commonSvgIcon('header-icon1')" />
          </q-btn>
        </li>
        <li v-if="!isMobile && isLogin">
          <q-btn flat fab-mini color="white" class="menuft" @click="$router.push({ name: 'memberInbox' })">
            <img :src="commonSvgIcon('header-icon2')" />
          </q-btn>
        </li>
        <li v-if="!isMobile">
          <LanguageDropdown class="language-bar" btnSize="md" />
        </li>

        <!-- <li>
          <SelectBox></SelectBox>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { useRouter } from "vue-router"
import { useSiteImg } from "app/template/set49/hooks/useSiteImg"
import { useLogo } from "src/common/composables/useLogo"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useEnvInfoStore } from "src/stores/envStore"
import HamburgerBox from "../HamburgerBox.vue"
// import SelectBox from 'src/common/components/SelectBox.vue';
import { useWindowSize } from "@vueuse/core"
import LanguageDropdown from "src/common/components/LanguageDropdown.vue"
import WalletDropdown from "./components/WalletDropdown.vue"

const { envInfo } = useEnvInfoStore()
const { commonSvgIcon } = useCommonImg()
const { logoImg } = useSiteImg()
const prop = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue", "changeLogin"])
const { isLogin } = useAuth()
const { getSquareLogo } = useLogo()
const router = useRouter()
const { width } = useWindowSize()
let isMobile = ref(false)

const handleOpenModal = () => {
  if (isLogin.value) {
    router.push({ name: "memberProfile" })
  } else {
    emit("changeLogin", true)
  }
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
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
.header
  z-index: 1
  width: 100%
  height: 20vw
  position: absolute
  top: 0
  display: flex
  align-items: center
  justify-content: space-between
  flex-direction: row
  height: 75px
  .header-left
    flex: 1
    display: flex
    justify-content: flex-start
    align-items: center
    .h5_logo
      width: 50px
      padding: 0
      :deep(.q-btn__content)
        justify-content: flex-start
  .header-center
    flex: 1
    display: flex
    justify-content: center
  .header-right
    flex: 1
    display: flex
    justify-content: flex-end
    margin-right: 1.25rem
    +iphone-width
      margin-right: 0

  // background: rgba(225, 234, 247, 0.8)
  +pad-width
    position: relative
    height: 15vw
    max-height: 65px
    width: 100%
    background: #0D0000
  .menu-icon
    margin: 0 1vw
    width: 3vw
    cursor: pointer
  .logo
    display: flex
    cursor: pointer
    img
      width: 6vw
      +iphone-width
        width: 15vw
  .nav
    color: #fff
    display: flex
    justify-content: flex-end
    align-items: center
    // padding: 0 3vw
    width: 97%
    height: 100%

    ul
      +setFlex
      padding: 0
      margin: 0
      li
        font-size: 18px
        cursor: pointer
        margin: 0 0.5vw
        list-style: none
        +setFlex
</style>
