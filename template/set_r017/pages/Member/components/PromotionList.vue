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
        <!-- <div
          class="triangle"
          :class="{
            triangle_act: props.activeId === props.item.id
          }"
        >
          <i class="fas fa-check inner-icon"></i>
        </div> -->
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
@import "app/template/set_r017/assets/css/_variable.scss"

.promotion-container
  height: auto
  width: 50%
  position: relative
  max-width: 49%
  cursor: pointer
  .p_select_inner
    @apply flex items-center
    color: $neutral01
    text-align: center
    padding: 10px
    gap: 20px
    +phone-width
      flex-direction: column
      gap: 7px
      padding-left: 10px
      padding-right: 10px
    .af-txt-wrap
      .txt-lg
        color: var(--emotional-02)
    .p_select
      padding: 8px
      margin-left: 0
      border-right: 1px solid $neutral01
      text-align: left
      padding-right: 20px
      min-height: 110px
      width: 65%
      white-space: normal !important
      p
        margin-bottom: 0.5rem
        color: $primany01
        font-family: Helvetica
        font-style: normal
        font-weight: 700
        line-height: normal
      +phone-width
        border-right: none
        border-bottom: 1px solid $primany01
        width: 100%
      ul
        list-style: disc
        padding-left: 16px
        margin: 0px
  .promotion-container-in
    border-radius: 10px
    border: 1px solid var(--neutral-03)
    width: 100%
  .active
    border: 1px solid $primany01
    color: $primany01
  .triangle
    width: 0
    height: 0
    border-top: 0px solid transparent
    border-right: 0px solid transparent
    border-bottom: 25px solid $primany01
    border-left: 25px solid transparent
    position: absolute
    display: none
    right: 0
    bottom: 0
    i
      position: absolute
      right: 2px
      bottom: -25px
      color: $neutral01
      font-size: 0.8rem
  .triangle_act
    display: block
</style>
