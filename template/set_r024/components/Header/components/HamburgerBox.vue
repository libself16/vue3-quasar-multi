<template>
  <div class="hamburger-box" v-if="props.show ? true : isMobile">
    <div class="menu-icon" @click="$emit('close')">
      <img :src="svgIcon('hamburger')" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useWindowSize } from "@vueuse/core"
import { useSiteImg } from "app/template/set_r024/hooks/useSiteImg"

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
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
    if (newWidth >= 769) isMobile.value = false
    else isMobile.value = true
  },
  { immediate: true }
)
</script>

<style lang="scss">
@import "src/common/css/_variable.sass";

//按鈕
.menu-icon {
  @apply flex justify-center items-center cursor-pointer w-[3.125rem];
  margin: 0 16px;
  z-index: 1;
  @include iphone-width {
    margin: 0 5px;
  }
  img {
    @apply w-[1.5625rem];
  }
}
</style>
