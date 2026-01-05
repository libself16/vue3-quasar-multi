<template>
  <div class="hamburger-box" v-if="isMobile">
    <div class="menu-icon" @click="$emit('close')">
      <img :src="svgIcon('hamburger')" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set49/hooks/useSiteImg"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const emits = defineEmits(["close"])
const { isMobile } = useMediaQuery()
const { svgIcon } = useSiteImg()
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
    margin: 0 5px;
  }
  img {
    width: 35px;
  }
}
</style>
