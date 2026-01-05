<template>
  <div class="roulette-game-wrapper">
    <div class="roulette-game-header">
      <div class="header-top">
        <div class="bonus-content">
          <q-img :src="svgIcon('wallet')" loading="lazy" class="svg-wallet"></q-img>
          <div>
            <div class="bonus-title">{{ $t("common.btn.bonus") }}</div>
            <div class="bonus-value">¥ {{ moneyFormat(bonusValue) }}</div>
          </div>
        </div>

        <q-btn class="header-btn hide-hover" :to="{ name: 'MemberWithdrawal' }">
          <q-img :src="svgIcon('withdraw')" loading="lazy" class="svg-wallet"></q-img>
          <div class="header-btn-text">{{ $t("common.btn.withdrawal2") }}</div>
        </q-btn>
      </div>
      <div class="header-bottom">
        <q-slider
          v-model="bonusValue"
          :min="0"
          :max="100"
          thumb-size="18px"
          track-size="12px"
          label
          label-always
          :label-value="bonusValue + '%'"
          class="roulette-game-progess"
          readonly
        />

        <div class="header-bottom-tip">
          {{ $t("rouletteGame.you_just_need_extra") }}¥{{ moneyFormat(withdrawalDiff)
          }}{{ $t("rouletteGame.then_you_can_withdraw") }}
        </div>
      </div>
    </div>
    <div class="roulette-game-body">
      <div class="body-left">
        <!-- <div class="body-left-top">
          <div v-if="isActivityEnd" class="body-left-top-box">{{ $t("rouletteGame.the_event_has_ended") }}</div>
          <div v-else class="body-left-top-box">
            {{ $t("rouletteGame.event_deadline") }}：
            {{ `${ActivityDeadlineCountdown}` }}
          </div>
          <div class="body-left-top-box">
            {{ $t("rouletteGame.lottery_ticket") }}：{{ spinTicket }} {{ $t("rouletteGame.pieces") }}
          </div>
        </div> -->
        <div class="body-left-bottom">
          <div class="bottom-roulette-content">
            <RouletteGameFortuneGodComp />
            <div v-if="isActivityEnd" class="bottom-time-text">{{ $t("rouletteGame.the_event_has_ended") }}</div>
            <div v-else class="bottom-time-text">
              {{ $t("rouletteGame.event_deadline") }}：
              {{ `${ActivityDeadlineCountdown}` }}
            </div>
          </div>
          <div class="bottom-share-btn" @click="getUrl">
            <p>{{ $t("rouletteGame.invite_friends") }}</p>
            <q-img :src="svgIcon('share-white')" loading="lazy" />
          </div>
        </div>
      </div>
      <div class="body-right">
        <AwardListComp />
        <!-- 分享區塊(移除) -->
        <!-- <div class="referral-code-content">
          <p class="referral-code-title">{{ $t("rouletteGame.share_this_referral_link_with_your_friends") }}</p>
          <div class="referral-code-row">
            <div class="referral-code">{{ inviteUrl }}</div>
            <div class="referral-code-btn">
              <q-img :src="svgIcon('share')" loading="lazy" @click="getUrl" />
              <q-img :src="svgIcon('copy')" loading="lazy" @click="copyMessage(accountInfo.invite_code)" />
            </div>
          </div>
        </div> -->
        <div class="rule-wrapper">
          <div class="rule-title">{{ $t("rouletteGame.rules") }}</div>
          <ol class="rule-content">
            <li v-for="item in rules" :key="item.id" class="rule-row">
              {{ item.props ? $t(item.textI18n, item.props) : $t(item.textI18n) }}
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useReferralWheel } from "src/common/composables/useReferralWheel"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import RouletteGameFortuneGodComp from "src/common/components/rouletteGame/FortuneGod.vue"
import AwardListComp from "./components/AwardList.vue"

const router = useRouter()
const { accountInfo, inviteCodeUrl } = useUserInfo()
const { copyMessage, moneyFormat } = useCommon()
const {
  referralWheelState,
  ActivityDeadlineCountdown,
  isActivityEnd,
  spinTicket,
  bonusValue,
  withdrawalDiff,
  handleReferralWheelMemberInfo,
  syncReferralWheelSpinInfo,
  handleReferralWheelCurrent,
  startCountdown
} = useReferralWheel()
const { svgIcon } = useSiteImg()

const rules = [
  { id: 1, textI18n: "rouletteGame.rule1" },
  { id: 2, textI18n: "rouletteGame.rule2", props: { host: location.hostname } },
  { id: 3, textI18n: "rouletteGame.rule3" },
  { id: 4, textI18n: "rouletteGame.rule4" }
]

const inviteUrl = computed(() =>
  inviteCodeUrl({
    inviteCode: accountInfo.value.invite_code
  })
)

function getUrl() {
  const url = inviteCodeUrl({
    inviteCode: accountInfo.value.invite_code
  })
  copyMessage(url)
}

onMounted(async () => {
  if (!referralWheelState.value.status) {
    router.back()
    return
  }

  await handleReferralWheelCurrent()
  startCountdown()
  await handleReferralWheelMemberInfo()
  syncReferralWheelSpinInfo()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

.roulette-game-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    margin: 0 0.375rem;
  }

  .roulette-game-header {
    @apply p-10;
    border-radius: 0.625rem;
    background: $gradient02;

    @include phone-width {
      @apply px-5 py-[.625rem];
    }

    .header-top {
      @apply w-full flex items-center justify-between;

      .bonus-content {
        @apply flex items-center gap-5;

        @include phone-width {
          gap: 0.625rem;
        }

        .svg-wallet {
          width: 3.75rem;
          height: 3.75rem;

          @include phone-width {
            width: 1.5625rem;
            height: 1.5625rem;
          }
        }

        .bonus-title {
          @include fontStyle(1rem);
          line-height: 1.125rem;
          font-weight: 400;
          color: $neutral01;

          @include phone-width {
            display: none;
          }
        }

        .bonus-value {
          @include fontStyle(1.5rem, 700, 1.75rem);
          color: $neutral01;
        }
      }

      .header-btn {
        @include gradientBtn();
        width: 9.8125rem;
        height: 6.5rem;
        padding: 0.625rem;
        border-radius: 0.625rem;
        min-height: auto;

        @include phone-width {
          width: auto;
          height: auto;
          padding: 0.375rem 0.6875rem;
        }

        :deep(.q-btn__content) {
          flex-direction: column;
          gap: 0.375rem;

          @include phone-width {
            flex-direction: row;
          }

          .q-img {
            width: 3.75rem;
            height: 3.75rem;

            @include phone-width {
              width: 1rem;
              height: 1rem;
            }
          }

          .header-btn-text {
            @include fontStyle(1rem);
            text-transform: none;

            @include phone-width {
              @include fontStyle(0.75rem, 700, 0.875rem);
            }
          }
        }
      }
    }

    .header-bottom {
      @apply mt-9 flex flex-col justify-center items-center gap-5;

      @include phone-width {
        margin-top: 9px;
        gap: 6px;
      }

      .roulette-game-progess {
        :deep(.q-slider__track) {
          height: 0.625rem !important;
          border-radius: 6.25rem;
          background: $neutral05;

          @include phone-width {
            height: 0.4375rem !important;
          }

          .q-slider__selection {
            background: linear-gradient(90deg, #ffb689 0%, #e85a86 100%);
            border: 3px solid #fff;

            @include phone-width {
              border-width: 0px;
            }
          }

          .q-slider__thumb {
            .q-slider__thumb-shape {
              visibility: hidden;
            }

            .q-slider__pin {
              &::before {
                border: 0;
                width: 7.58px;
                height: 17.39px;
                background: linear-gradient(to bottom, #f99, #f6a);
                clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 60% 100%, 40% 100%, 0% 75%);

                @include phone-width {
                  bottom: 0;
                  height: 0.7137rem;
                }
              }

              .q-slider__label {
                top: 2.5669rem;

                @include phone-width {
                  top: 2rem;
                }

                .q-slider__text-container {
                  transform: none !important;
                  background-color: transparent;

                  .q-slider__text {
                    @include fontStyle(1rem, 400);
                    color: #ffffff;

                    @include phone-width {
                      @include fontStyle(0.625rem, 400, 0.8125rem);
                    }
                  }
                }
              }
            }
          }
        }
      }

      .header-bottom-tip {
        @include fontStyle(1.25rem, 400, 1.625rem);
        color: $neutral01;

        @include phone-width {
          @include fontStyle(0.75rem, 400, 1rem);
        }
      }
    }
  }

  .roulette-game-body {
    @apply flex gap-5 mt-5;

    @include phone-width {
      @apply flex-col gap-[.625rem];
    }

    .body-left {
      width: 51.167%;

      @include phone-width {
        width: 100%;
      }

      .body-left-top {
        @apply flex justify-between items-center;

        @include phone-width {
          @apply flex-col items-start gap-[.625rem];
        }

        .body-left-top-box {
          padding: 0.625rem;
          border-radius: 0.625rem;
          background-color: $primary04;
          font-family: DMS ans;
          font-weight: 600;
          font-size: 16px;
          line-height: 1.3125rem;
          color: $neutral01;
        }
      }

      .body-left-bottom {
        .bottom-roulette-content {
          position: relative;
          .bottom-time-text {
            @apply absolute left-0 whitespace-nowrap;
            @include fontStyle(1rem, 600, 1.3125rem);
            color: $neutral01;
            bottom: 1.0625rem;
            left: 50%;
            transform: translateX(-50%);

            @include phone-width {
              bottom: 0.625rem;
            }
          }
        }

        .bottom-share-btn {
          @apply flex justify-center items-center gap-[.625rem];
          @apply mt-[.625rem] rounded-[.625rem] py-[.7188rem] cursor-pointer;
          background: linear-gradient(0deg, $primary04, $primary04),
            linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%);
          box-shadow: 0px 4px 4px 0px #00000040;

          p {
            @include fontStyle(1rem, 600, 1.3125rem);
            color: #ffffff;
          }

          .q-img {
            width: 1.5762rem;
            height: 1.5625rem;
          }
        }
      }
    }

    .body-right {
      @apply flex flex-col gap-5;
      width: 47.167%;

      @include phone-width {
        width: 100%;
      }

      .referral-code-content {
        @apply w-full flex flex-col items-center justify-center;
        gap: 0.625rem;
        padding: 1.25rem 1.3438rem;
        border-radius: 0.5rem;
        border: 1px solid $primary06;
        background-color: $primary01;

        .referral-code-title {
          @include fontStyle(1rem, 700, 1.125rem);
          color: $neutral10;
        }

        .referral-code-row {
          @apply w-full flex flex-none justify-between items-center;
          max-width: 18.75rem;
          padding: 0.625rem 1rem;
          border-radius: 0.625rem;
          background-color: $neutral01;
          box-shadow: $shadow02;

          @include phone-width {
            max-width: none;
          }

          .referral-code {
            @include fontStyle(0.875rem, 400, 1rem);
            color: $neutral06;
            max-width: 13rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .referral-code-btn {
            @apply flex items-center;
            gap: 0.625rem;

            .q-img {
              width: 1.25rem;
              height: 1.25rem;
              cursor: pointer;
            }
          }
        }
      }

      .rule-wrapper {
        @apply w-full flex flex-col;
        border-radius: 0.625rem;
        padding: 1.875rem;
        gap: 0.1875rem;
        background: $gradient06;
        color: $neutral01;

        @include phone-width {
          padding: 1.25rem;
        }

        .rule-title {
          @include fontStyle(1.5rem, 700, 1.75rem);
        }

        .rule-content {
          @include fontStyle();
          line-height: 1rem;
          list-style-type: decimal;
          padding-left: 1rem;
        }
      }
    }
  }
}
</style>
