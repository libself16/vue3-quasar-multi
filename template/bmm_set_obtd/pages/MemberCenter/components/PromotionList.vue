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
          <p>{{ props.item.title }}</p>
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
        <div
          class="triangle"
          :class="{
            triangle_act: props.activeId === props.item.id
          }"
        >
          <i class="fas fa-check inner-icon"></i>
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
@import "src/common/css/_variable.sass"
@import "app/template/bmm_set_obtd/assets/css/_variable.sass"

.promotion-container
  height: auto
  width: 45%
  position: relative
  max-width: 45%
  cursor: pointer
  .p_select_inner
    @apply flex items-center
    color: $text-dark-color
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
      border-right: 1px solid $border-soft-yellow-color
      padding-left: 0px
      text-align: left
      padding-right: 20px
      min-height: 110px
      width: 65%
      white-space: normal !important
      +phone-width
        border-right: none
        border-bottom: 1px solid $border-soft-yellow-color
        width: 100%
      ul
        list-style: disc
        padding-left: 16px
        margin: 0px
  .promotion-container-in
    border: 2px solid $border-pale-gray-color
    border-radius: 8px
    width: 100%
    background: $background-light-color
  .active
    border: 2px solid $primary-color
    color: $primary-color
  .triangle
    width: 0
    height: 0
    border-top: 0px solid transparent
    border-right: 0px solid transparent
    border-bottom: 25px solid $border-medium-bright-blue-color
    border-left: 25px solid transparent
    position: absolute
    display: none
    right: 0
    bottom: 0
    i
      position: absolute
      right: 2px
      bottom: -25px
      color: $text-light-color
      font-size: 0.8rem
  .triangle_act
    display: block
</style>
