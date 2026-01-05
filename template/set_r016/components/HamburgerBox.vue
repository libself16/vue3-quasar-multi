<template>
  <div class="hamburger-box" v-if="isMobile">
    <!-- <div class="menu-icon" :class="{ open: isOpen }" id="icon1">
      <div class="menu-icon_hamburger"></div>
    </div> -->
    <div class="menu-icon" @click="$emit('close')">
      <img :src="svgIcon('hamburger')" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { ref, watch } from "vue"

const emits = defineEmits(["close"])

const { width } = useWindowSize()
let isMobile = ref(false)
const { svgIcon } = useSiteImg()

const isOpen = ref(false)
const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const getIcon = (icon: string) => {
  return new URL(`src/common/assets/image/icon/${icon}.png`, import.meta.url).href
}

watch(
  width,
  (newWidth) => {
    if (newWidth >= 768) isMobile.value = false
    else isMobile.value = true
  },
  { immediate: true }
)
</script>

<style lang="scss">
@import "src/common/css/_variable.sass";

//按鈕
.menu-icon {
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 16px;
  z-index: 1;
  @include iphone-width {
    width: 1.875rem;
    height: 1.875rem;
    margin-left: 0;
    margin-right: 0.90625rem;
  }
  img {
    width: 35px;
    @include iphone-width {
      width: 1.3125rem;
    }
  }
}
</style>
