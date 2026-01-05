<template>
  <div class="marquee-tag">
    <div class="Marquee">
      <div class="Marquee-content">
        <div class="Marquee-tag" v-for="n in 10" :key="n">
          <div class="rttbox">
            <div class="rimg"><img :src="marqueeUserIcon" /></div>
            <div class="rcon">
              <div>
                <span>*******4460</span>
                <span class="time">4 minutes ago</span>
              </div>
              <div>
                <span>deposited</span>
                <span class="amo">MYR 888.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommonImg } from "src/common/hooks/useCommonImg"

const { marqueeUserIcon } = useCommonImg()
</script>

<style lang="sass" scoped>

@import "src/common/css/_variable.sass"
.rttbox
  +setFlex
  flex-direction: row
  .rcon
      display: flex
      flex-direction: column
      color: #ffffff
      font-size:14px
      line-height: normal
      justify-content: center
      span
        padding-left:5px
        &.time
          color: #8264ac
          font-size: 10px
        &.amo
          color:#00ff97
          font-weight: bold
          font-size: 12px

.Marquee
  background: #240251
  width: 66vw
  box-sizing: border-box
  padding: 1em
  color: white
  font-weight: 200
  display: flex
  align-items: center
  overflow: hidden
  +iphone-width
    width: 90vw
    padding: 0.5em

  .Marquee-content
    display: flex
    animation: marquee 40s linear infinite running
    &:hover
      animation-play-state: paused

  .Marquee-tag
    width: 250px
    margin: 0 .5em
    padding: .5em
    background: rgba(255, 255, 255, .1)
    display: inline-flex
    align-items: center
    justify-content: center
    transition: all 10s ease
    +iphone-width
      // width: 30vw
      margin: 0 .2em
      padding: .2em
    &:hover
      background: rgba(255, 255, 255, .5)
      transform: scale(1.1)
      cursor: pointer

@keyframes marquee
  0%
    transform: translateX(0)
  100%
    transform: translate(-50%)
</style>
