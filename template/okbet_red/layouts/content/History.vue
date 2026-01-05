<template>
  <div class="history-content">
    <CashFlowNav />
    <div class="history-table">
      <div class="title-content">
        <div class="color-label"></div>
        <div class="title">history</div>
        <div class="custom-date-time-picker"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from "vue"
import dayjs from "dayjs"
import CashFlowNav from "src/common/components/CashFlowNav.vue"
import "vue3-carousel/dist/carousel.css"
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/table.sass'
@import 'app/template/okbet_red/assets/css/_variable.sass'

// layout style
.history-content
  color: $text-light-color
  padding: 5vw 0 5vw 12.865vw
  +iphone-width
    padding: 0
  .history-table
    margin-top: 2.083vw
    width: 52.083vw
    border-radius: 8px
    background: $background-eclipse-gray-color
    padding: 1.667vw 2.24vw
    +iphone-width
      width: 100vw
      margin-top: 0
      padding: 0
      background: $background-midnight-gray-color
    .title-content
      +setFlex(flex-start)
      gap: 0.833vw
      +iphone-width
        margin-top: 5.641vw
        margin-left: 7.179vw
      .color-label
        width: 0.417vw
        height: 1.25vw
        background: $yellow-active
        +iphone-width
          width: 2.051vw
          height: 6.154vw
      .title
        color: $text-light-color
        font-size: 1.25vw
        font-style: normal
        font-weight: 700
        line-height: normal
        text-transform: uppercase
        +iphone-width
          font-size: 4.103vw
</style>
