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
          {{ props.item.title }}
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
@import "app/template/set_6M88/assets/css/_variable.scss"

.promotion-container
  height: auto
  width: 45%
  position: relative
  max-width: 45%
  cursor: pointer
  .p_select_inner
    @apply flex items-center
    color: black
    text-align: center
    padding: 10px
    gap: 20px
    +phone-width
      flex-direction: column
      gap: 7px
      padding-left: 10px
      padding-right: 10px
    .p_select
      padding: 8px
      margin-left: 0
      border-right: 1px solid $border-blue
      padding-left: 0px
      text-align: left
      padding-right: 20px
      min-height: 110px
      width: 65%
      +phone-width
        border-right: none
        border-bottom: 1px solid $border-blue
        width: 100%
      ul
        list-style: disc
        padding-left: 16px
        margin: 0px
  .promotion-container-in
    border: 1px solid transparent
    border-radius: 8px
    width: 100%
    background: $light
  .active
    border: 1px solid $border-blue
    &::after
      position: absolute
      right: .0625rem
      bottom: .0625rem
      height: 1.5625rem
      width: 1.5625rem
      content: ""
      background: url("../../../assets/images/svg/checked.svg")
      background-repeat: no-repeat
      background-size: contain
</style>
