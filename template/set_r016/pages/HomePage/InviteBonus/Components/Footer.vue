<template>
  <div class="invite-bonus-footer">
    <div class="bonus-claim" v-if="!$q.platform.is.mobile">
      <q-img class="chest-img" :src="resultImages('invite-bonus/chest-claim.png')" loading="lazy"></q-img>
      <q-btn
        :disabled="!props.claimable"
        class="chest-btn"
        @click="props.onOpenClaim()"
        :label="$t('invite_bonus.claim')"
      ></q-btn>
    </div>
    <div class="bonus-quest-list" v-if="props.rewards">
      <swiper @swiper="onSwiper" :slides-per-view="'auto'" :space-between="10" :centered-slides="isMobile">
        <swiper-slide v-for="(reward, i) in props.rewards" :key="i">
          <QuestCard :reward="reward" :isFirst="i === 0" :isLast="i === props.rewards.length - 1" />
        </swiper-slide>
      </swiper>
      <div class="navigation" v-if="isMobile && swierRef">
        <q-btn
          dense
          rounded
          flat
          :disable="swierRef.isBeginning"
          class="prev"
          @click="swierRef.slidePrev()"
          :icon="`img:${resultImages('invite-bonus/swiper-arrow.png')}`"
        >
        </q-btn>
        <q-btn
          dense
          rounded
          flat
          class="next"
          :disable="swierRef.isEnd"
          @click="swierRef.slideNext()"
          :icon="`img:${resultImages('invite-bonus/swiper-arrow.png')}`"
        >
        </q-btn>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

.invite-bonus-footer {
  @apply flex items-center gap-[1.75rem];

  @include phone-width {
    @apply flex-col;
  }

  .bonus-claim {
    @apply flex flex-col items-center;
    .chest-img {
      width: 200px;
    }
    .chest-btn {
      background: $gradient01;
      color: #fff;
    }
  }
  .bonus-quest-list {
    @apply relative;
    @apply flex-1 h-72 w-full;
    @apply flex items-start gap-[0.75rem];
    @apply overflow-hidden;
    @apply rounded-[10px];

    .swiper {
      @apply pt-24 w-full;
      .swiper-slide {
        width: auto !important;
      }

      @include phone-width {
        @apply pt-8;
      }
    }

    @include phone-width {
      @apply w-screen;
      .navigation {
        @apply absolute z-10 flex items-center justify-between w-full;
        @apply top-1/2 -translate-y-1/2 pt-5 pointer-events-none;

        :deep(.q-icon) {
          width: 2.25rem;
          height: 2.25rem;
        }

        .q-btn {
          @apply pointer-events-auto;
        }

        .q-btn.disabled {
          opacity: 0.1 !important;
        }

        .prev {
          @apply -rotate-180;
        }
      }
    }
  }
}
</style>
<script setup lang="ts">
import QuestCard from "./QuestCard.vue"

import { ref } from "vue"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import type * as Response from "src/api/response.type"

import { Swiper, SwiperSlide } from "swiper/vue"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"

const swierRef = ref<SwiperType>()
const { isMobile } = useMediaQuery()
const { resultImages } = useSiteImg()
const onSwiper = (swiper: SwiperType) => {
  swierRef.value = swiper
}

const props = defineProps({
  rewards: {
    type: Array as () => Response.ReferralSignupOverviewRewards[],
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
</script>
