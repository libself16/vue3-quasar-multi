<template>
  <div
    class="invite-bonus-quest-card"
    :class="{ wide: props.reward.currency_rewards.length >= 2, single: props.reward.currency_rewards.length === 1 }"
  >
    <q-img class="coin" :src="resultImages('invite-bonus/quest-card-coin.png')"></q-img>
    <div class="content">
      <div class="title">{{ $t("invite_bonus.active_members") }}</div>
      <div class="active-members">
        <span>{{ props.reward.active_member_count }}</span> / {{ $t("invite_bonus.people") }}
      </div>
      <div class="currency-amount">
        <div class="item" v-for="(reward, index) in props.reward.currency_rewards" :key="index">
          <div class="label">{{ currencyIdMap![reward.currency_id].code }}</div>
          <div class="value">{{ moneyFormat(reward.reward_amount) }}</div>
        </div>
      </div>
    </div>
    <q-img v-if="props.reward.is_reached" class="pass" :src="resultImages('invite-bonus/quest-card-pass.png')"></q-img>
    <div class="progress-dot"></div>
    <div class="before" v-if="!isLast"></div>
    <div class="after" v-if="!isFirst"></div>
  </div>
</template>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

.invite-bonus-quest-card {
  @apply relative min-w-[132px] h-auto rounded-[0.75rem];
  background: radial-gradient(105.26% 62.65% at 50% 37.35%, $primary04 0%, $primary07 100%);
  border: 1px solid $primary04;

  @include phone-width {
    @apply min-w-[172px];
  }

  &.wide {
    @apply min-w-[254px];

    @include phone-width {
      width: calc(100vw - 1.25rem);
    }
  }

  &.single {
    // .progress-dot {
    //   @apply hidden;
    // }
    .content {
      .currency-amount {
        @apply justify-center;
      }
    }
  }

  .content {
    @apply text-white font-bold text-[0.75rem];
    @apply drop-shadow-[0_0_4px_rgba(0,0,0,0.8)];
    @apply flex flex-col items-center justify-center;
    @apply pt-[3rem] z-[3] relative;
    .title {
    }
    .active-members {
      @apply mt-1;
      span {
        @apply text-[1rem];
      }
    }
    .currency-amount {
      @apply w-full grid;
      @apply p-[1rem];
      grid-template-columns: auto auto;
      row-gap: 0.5rem;
      column-gap: 0.5rem;
      .item {
        @apply flex items-center gap-2;
        .label {
          @apply text-[0.625rem];
          color: $secondary03;
        }
        .value {
          @apply text-[1rem];
        }
      }

      @include phone-width {
        @apply px-[30px];
      }
    }
  }

  .coin {
    @apply absolute w-[80px] aspect-square z-[2];
    @apply left-1/2 -translate-x-1/2 -translate-y-1/2;
  }

  .pass {
    @apply absolute w-[140px] aspect-square z-[0];
    @apply right-0 top-0;

    @include phone-width {
      @apply w-[140px];
    }
  }

  .progress-dot {
    @apply absolute left-1/2 -translate-x-1/2 top-0 -translate-y-[4rem];
    @apply rounded-full;
    width: 0.5rem;
    height: 0.5rem;
    background-color: $primary05;

    @include phone-width {
      @apply hidden;
    }
  }

  .after {
    @apply absolute right-1/2 top-[3px] -translate-y-[4rem];
    @apply w-[55%];
    height: 1px;
    background-color: $primary05;

    @include phone-width {
      @apply hidden;
    }
  }

  .before {
    @apply absolute left-1/2 top-[3px] -translate-y-[4rem];
    @apply w-[56.5%];
    height: 1px;
    background-color: $primary05;

    @include phone-width {
      @apply hidden;
    }
  }

  &:first-child {
    &.after {
      @apply hidden;
    }
  }

  &:last-child {
    &.before {
      @apply hidden;
    }
  }
}
</style>
<script setup lang="ts">
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useCommon } from "src/common/hooks/useCommon"
import { useBank } from "src/common/composables/useBank"
import type * as Response from "src/api/response.type"

const { moneyFormat } = useCommon()
const { resultImages } = useSiteImg()
const { currencyIdMap } = useBank()

const props = defineProps({
  reward: {
    type: Object as () => Response.ReferralSignupOverviewRewards,
    required: true
  },
  isFirst: {
    type: Boolean,
    required: true
  },
  isLast: {
    type: Boolean,
    required: true
  }
})
</script>
