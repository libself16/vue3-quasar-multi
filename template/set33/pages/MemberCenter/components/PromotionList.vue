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
    padding: .625rem
    gap: 1.25rem
    +phone-width
      flex-direction: column
      gap: .4375rem
      padding-left: .625rem
      padding-right: .625rem
    .p_select
      padding: .5rem
      margin-left: 0
      border-right: .0625rem solid #0c9bd5
      padding-left: 0rem
      text-align: left
      padding-right: 1.25rem
      min-height: 6.875rem
      width: 65%
      +phone-width
        border-right: none
        border-bottom: .0625rem solid #0c9bd5
        width: 100%
      ul
        list-style: disc
        padding-left: 1rem
        margin: 0rem
  .promotion-container-in
    border: .0625rem solid #0c9bd5
    border-radius: .5rem
    width: 100%
    background: #03233a
  .active
    border: .0625rem solid #00e5ff
</style>
