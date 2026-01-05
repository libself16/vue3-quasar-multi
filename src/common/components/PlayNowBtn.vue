<template>
  <div class="play-now" :class="{ disabled: props.disable }">
    <span>{{ $t("game.play_now") }}</span>
    <span>></span>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue"

const props = defineProps({
  disable: Boolean
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
.play-now
  cursor: pointer
  display: inline-flex
  padding: 0.5vw
  justify-content: center
  align-items: center
  gap: 0.5vw
  border-radius: 2vw
  background: $yellow-active
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25)
  &.disabled
    background: rgba(28, 30, 34, 0.70)
    pointer-events: none
    p, span
      color: rgba(255, 255, 255, 0.70)
  p, span
    color: rgba(28, 30, 34, 0.70)
    font-family: Arial
    font-size: 1vw
    font-style: normal
    font-weight: 700
    line-height: normal
    text-transform: capitalize
  &:hover
    background: linear-gradient(0deg, #FF7A00 1.47%, #FFC002 79.41%)
  +iphone-width
    padding: 4.455px
    gap: 4.455px
    border-radius: 13.364px
    p, span
      font-size: 11.137px
</style>
