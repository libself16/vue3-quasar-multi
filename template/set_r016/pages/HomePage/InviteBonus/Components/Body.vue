<template>
  <div class="bonus-claim" v-if="$q.platform.is.mobile">
    <q-img class="chest-img" :src="resultImages('invite-bonus/chest-claim.png')" loading="lazy"></q-img>
    <q-btn
      class="chest-btn"
      :disabled="!props.claimable"
      @click="props.onOpenClaim()"
      :label="$t('invite_bonus.claim')"
    ></q-btn>
  </div>
  <div class="invite-bonus-body">
    <div class="title">{{ $t("invite_bonus.meet_following") }}</div>
    <div class="stats">
      <div class="stats-item">
        <div class="stats-item-label">{{ $t("invite_bonus.member_accumulated_deposit") }}</div>
        <div class="stats-item-value">{{ moneyFormat(metrics?.deposit) }}</div>
      </div>
      <div class="stats-item">
        <div class="stats-item-label">{{ $t("invite_bonus.member_valid_bet_amount") }}</div>
        <div class="stats-item-value">
          {{ moneyFormat(metrics?.valid_bet) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

.bonus-claim {
  @apply rounded-[10px] p-[0.75rem];
  @apply flex items-center gap-[1.5rem];
  background-color: $primary01;
  .chest-img {
    width: 150px;
  }
  .chest-btn {
    @apply w-full rounded-md;
    background: $gradient01;
    color: #fff;
  }
}

.invite-bonus-body {
  @apply rounded-[10px] p-[1.25rem];
  @apply flex flex-col gap-[1.25rem];
  background-color: $primary01;
  .title {
    @apply text-[1rem] text-center;
  }
  .stats {
    @apply flex gap-[0.75rem] text-center;

    @include phone-width {
      @apply flex-col;
    }

    .stats-item {
      @apply rounded-[10px] bg-white flex-1 p-[0.5rem];
      @apply leading-none;
      .stats-item-label {
        @apply text-[0.875rem];
        color: $primary04;
      }
      .stats-item-value {
        @apply text-[2rem] mt-[0.875rem];
        color: $primary06;
      }
    }
  }
}
</style>

<script setup lang="ts">
import { computed } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useUserInfo } from "src/common/composables/useUserInfo"
import type * as Response from "src/api/response.type"

const { moneyFormat } = useCommon()
const { resultImages } = useSiteImg()
const { activeWalletCurrencyId } = useUserInfo()

const props = defineProps({
  metrics: {
    type: Array as () => Response.ReferralSignupOverviewMetrics[],
    required: true
  },
  claimable: {
    type: Boolean,
    required: true
  },
  onOpenClaim: {
    type: Function,
    required: true
  }
})

const metrics = computed(() => {
  return props.metrics.find((metric) => metric.currency_id === activeWalletCurrencyId.value)
})
</script>
