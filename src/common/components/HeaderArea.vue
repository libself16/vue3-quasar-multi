<template>
  <div class="header">
    <HamburgerBox @click="emit('update:modelValue', true)"></HamburgerBox>
    <div class="nav">
      <ul>
        <li v-if="!isMobile">
          <FilterInput></FilterInput>
        </li>
        <li v-if="!isMobile">
          <img :src="commonSvgIcon('header-icon1')" />
          <img :src="commonSvgIcon('header-icon2')" />
          <img :src="commonSvgIcon('header-icon3')" />
        </li>
        <li v-else>
          <img :src="commonSvgIcon('header-icon1')" />
        </li>
        <!-- <li>
          <SelectBox></SelectBox>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEnvInfoStore } from "src/stores/envStore"
import FilterInput from "src/common/components/FilterInput.vue"
import HamburgerBox from "src/common/components/HamburgerBox.vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"

// import SelectBox from 'src/common/components/SelectBox.vue';
import { ref, watch } from "vue"
import { useWindowSize } from "@vueuse/core"

const { envInfo } = useEnvInfoStore()
const { commonSvgIcon } = useCommonImg()

const prop = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue"])

const { width } = useWindowSize()
let isMobile = ref(false)

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
  width: 77%
  height: 20vw
  position: absolute
  top: 0
  display: flex
  align-items: center
  justify-content: center
  justify-content: flex-start !important
  flex-direction: row
  height: 5vw
  // background: rgba(225, 234, 247, 0.8)
  +iphone-width
    position: relative
    height: 15vw
    max-height: 65px
    width: 100%
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
        img
          width: 3vw
          padding: 0 0.5vw
          +iphone-width
            width: 8vw
        +pc-width
          margin: 0 0.5vw
          font-size: 1.5vw
        +iphone-width
          margin: 0 2vw
        &:hover
          color: #d43dff
</style>
