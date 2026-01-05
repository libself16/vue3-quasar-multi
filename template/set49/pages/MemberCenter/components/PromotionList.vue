<template>
  <div class="promotion-container">
    <div
      class="promotion-container-in"
      :class="{
        active: props.activeId === props.item.id
      }"
    >
      <div class="p_select_inner">
        <div class="p_select">
          <p class="deposit-promotion-title">{{ props.item.title }}</p>
          <ul>
            <li>
              {{
                $t(`member.deposit.depositOver`, {
                  amount: props.item.reward.condition
                })
              }}
            </li>
            <li v-if="props.item.reward.type === 0">
              {{
                $t(`member.deposit.depositreward`, {
                  rewardPercent: props.item.reward.amount
                })
              }}
            </li>
            <li v-else>
              {{
                $t(`member.deposit.rewardPercent`, {
                  rewardPercent: props.item.reward.amount
                })
              }}
            </li>
          </ul>
        </div>
        <div class="af-txt-wrap">
          {{ $t("member.deposit.rewardTitle") }}
          <div class="txt-lg">
            {{ props.item.reward.reward_amount }}
          </div>
        </div>
      </div>

      <!--p_select_inner end-->
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  activeId: number
  item: {
    id: number | string
    title: string
    reward: {
      type: number
      amount: number | string
      reward_amount: number | string
      condition: number | string
    }
  }
}>()
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/set49/assets/css/_variable.scss'

.promotion-container
  height: auto
  width: 45%
  position: relative
  max-width: 45%
  cursor: pointer
  .p_select_inner
    @apply flex items-center
    color: #ffffff
    text-align: center
    min-height: 8rem
    height: auto
    // padding: .625rem
    gap: 1.25rem
    +phone-width
      flex-direction: column
      gap: .4375rem
      padding-left: .625rem
      padding-right: .625rem
    .af-txt-wrap
      width: 35%
      @apply flex flex-col items-center
      color: #ffffff
      text-align: center
      font-size: 0.9rem
      .txt-lg
        @apply font-bold text-[1.25rem]
        color: #05E900
        +iphone-width
          font-size: 1rem
      +phone-width
        width: 100%
        margin-top: .625rem
      +iphone-width
        font-size: 0.7rem
    .p_select
      display: flex
      flex-direction: column
      justify-content: flex-start
      margin-left: 0
      border-right: .0625rem solid #FFFFFF80
      padding-left: 0rem
      text-align: left
      font-size: 0.9rem
      // padding-right: 1.25rem
      min-height: 6.875rem
      width: 65%
      +phone-width
        border-right: none
        border-bottom: .0625rem solid #FFC002
        width: 100%
        +iphone-width
          font-size: 0.7rem
      ul
        list-style: disc
        padding-left: 1rem
        margin: 0rem
  .promotion-container-in
    border: 1px solid #FFFFFF80
    border-radius: .6rem
    width: 100%
    max-width: 400px
    padding: 0.6rem 1.2rem
    +iphone-width
      padding: 0.5rem 0rem
  .active
    border: 1px solid transparent
    background: rgba(255, 255, 255, 0.30)
    position: relative
    &::before
      content: ""
      position: absolute
      inset: 0
      border-width: 2px
      border-style: solid
      border-color: transparent
      border-radius: 0.6rem
      background-image: linear-gradient(0deg, #FF7A00 1.47%, #FFC002 79.41%)
      background-origin: border-box
      mask-image: linear-gradient(white, white), linear-gradient(white, white)
      mask-clip: padding-box, border-box
      mask-composite: exclude, add


  .deposit-promotion-title
    @apply font-bold text-[.9rem] mb-2
    text-align: center
    color: $primary-color
</style>
