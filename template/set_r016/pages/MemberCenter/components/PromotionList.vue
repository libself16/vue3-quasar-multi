<template>
  <div
    class="promotion-container"
    :class="{
      active: props.activeId === props.item.id
    }"
  >
    <div class="item-left">
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

    <div class="item-right">
      {{ $t("member.deposit.rewardTitle") }}
      <div class="amount">
        {{ props.item.reward.reward_amount }}
      </div>
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

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.promotion-container {
  @apply flex items-center justify-center;
  cursor: pointer;
  border: 1px solid #ffffff80;
  border-radius: 0.625rem;
  width: 100%;
  max-width: 25rem;
  min-height: 10.5625rem;
  padding: 1.25rem;
  color: #ffffffb2;

  @include phone-width {
    flex-direction: column;
    padding-left: 0.625rem;
    padding-right: 0.625rem;
    max-width: unset;
    min-height: 15.5rem;
    min-width: 9.375rem;
    margin-right: 0.625rem;
  }

  &.active {
    border: 1px solid transparent;
    background: rgba(255, 255, 255, 0.3);
    position: relative;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-width: 2px;
      border-style: solid;
      border-color: transparent;
      border-radius: 0.6rem;
      background-image: linear-gradient(0deg, #ff7a00 1.47%, #ffc002 79.41%);
      background-origin: border-box;
      mask-image: linear-gradient(white, white), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: exclude, add;
    }
  }

  .item-left {
    @include fontStyle();
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-right: 0.0625rem solid #ffffff80;
    width: 50%;
    height: 100%;

    @include phone-width {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 0.0625rem solid #ffffff80;
      margin-bottom: 0.625rem;
      padding-bottom: 0.625rem;
    }

    .deposit-promotion-title {
      @include fontStyle(1rem);
      margin-bottom: 0.625rem;
      color: $secondary03;
    }

    ul {
      width: 100%;
      list-style: disc;
      text-align: left;
      padding-left: 1.25rem;
    }
  }

  .item-right {
    @include fontStyle(1rem);
    @apply flex flex-col items-center;
    width: 50%;
    text-align: center;

    @include phone-width {
      width: 100%;
      height: auto;
    }

    .amount {
      color: #05e900;
      margin-top: 0.625rem;
    }
  }
}
</style>
