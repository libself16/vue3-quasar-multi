<template>
  <div class="user_vip_righ vip-card">
    <div class="card_overview">
      <div class="rank_slider_container vip-swiper">
        <div class="rank_slider_wrapper swiper-wrapper">
          <div class="rank_slider_slide_out swiper-slide">
            <div class="rank_slider_slide">
              <div class="rank_slider_image">
                <q-img :src="vipData.img" />
              </div>

              <div class="rank_slider_slider_body">
                <div class="rank_slider_title">
                  <h4 class="vip-card-title">{{ vipData.title }}</h4>
                  <h5>{{ vipData.remark }}</h5>
                </div>
                <div class="rank_slider_rule_1">
                  <div class="rank_slider_rule_box">
                    <div class="rank_slider_rule_box_item">
                      <h5>{{ $t("vip.deposit") }}</h5>
                      <h4 class="yellow">${{ moneyFormat(userStatistics?.total_deposit) }}</h4>
                    </div>
                    <div class="rank_slider_rule_box_item">
                      <h5>{{ $t("vip.bet") }}</h5>
                      <h4 class="yellow">${{ moneyFormat(userStatistics?.total_valid_bet_amount) }}</h4>
                    </div>
                  </div>
                </div>
                <!-- <div class="rank_slider_rule_2">
                  <h4>LEVEL PRIVILEGE</h4>
                  <h6>Get 06% of the previous day's bet amount in cash every day</h6>
                  <hr />
                </div>
                <div class="rank_slider_rule_3">
                  <h4>WITHDRAWAL PRIVILEGES</h4>
                  <h6>update conditions</h6>
                  <h6>Number of withdrawals:5 times/day</h6>
                  <h6>Maximum unit price:$ 20,000</h6>
                  <h6>Withdrawal fee:1%</h6>
                  <h6>Free withdrawal:1/month</h6>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { VipItem, UserStatistics } from "src/api/response.type"

const { moneyFormat, calculatePercentage } = useCommon()

const props = defineProps<{
  vipData: VipItem
  userStatistics?: UserStatistics
  isActive: boolean
}>()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.vip-card {
  width: 41.25rem;
  background-repeat: no-repeat;
  background-size: 41.25rem 21.25rem;
  padding: 2rem 3.625rem;
  position: relative;
  overflow: hidden;

  .current-tag {
    position: absolute;
    top: 14px;
    left: -74px;
    width: 197.29px;
    height: 29.47px;
    background: red;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
    line-height: 17.7px;
    transform: rotate(-45deg);
    z-index: 1;
  }
}

.progress-wrapper {
  position: relative;
  width: 20rem;
  margin-top: 1.875rem;
  .q-slider {
    :deep(.q-slider__track-container--h) {
      padding: 0;

      .q-slider__track {
        height: 0.5rem !important;
      }

      .q-slider__thumb {
        width: 0.875rem !important;
        height: 0.875rem !important;
      }

      .q-slider__pin {
        .q-slider__label--h-standard {
          bottom: 0.125rem;
        }

        .q-slider__text-container {
          width: 2.2656rem;
          height: 1.8125rem;
          background-image: url("app/template/okbet/assets/images/vip/bg-badge.png");
          background-repeat: no-repeat;
          background-size: contain;
          transform: translateX(0) !important;
          display: flex;
          justify-content: center;
          font-weight: 700;
          font-size: 0.75rem;
        }
      }
      .bg-track {
        background: rgb(255, 249, 244) !important;
      }
      .text-selection {
        background: #c0c0c0;
      }
      .text-thumb {
        color: #3f4c71;
      }
      .text-label {
        color: #ff0000;
      }
    }
  }

  .progress-info {
    @apply flex justify-between mt-1;
    .text-percent {
      padding: 0.25rem 0.625rem;
      border-radius: 1.25rem;
      background: #f3f3f3;
      color: #8593af;
      font-family: OpenSans;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.3619rem;
    }
    .text-type {
      color: #3f4c71;
      font-family: OpenSans;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.3619rem;
    }
  }

  @include iphone-width {
    width: 10rem;
    margin-top: 0.125rem;
    height: 2.375rem;

    .q-slider {
      :deep(.q-slider__track-container--h) {
        padding: 0;

        .q-slider__track {
          height: 0.25rem !important;
        }

        .q-slider__thumb {
          width: 0.4375rem !important;
          height: 0.4375rem !important;
        }

        .q-slider__pin {
          .q-slider__label--h-standard {
            bottom: 0;
          }
          .q-slider__text-container {
            width: 1.125rem;
            height: 0.9375rem;
            min-height: 0.9375rem;
            .q-slider__text {
              font-size: 0.375rem;
            }
          }
        }
      }
    }
    .progress-info {
      .text-percent {
        padding: 0.125rem 0.3125rem;
        font-size: 0.5rem;
        line-height: 0.6731rem;
      }
      .text-type {
        font-size: 0.5rem;
        line-height: 0.6731rem;
      }
    }
  }
}

.vip-icon {
  position: absolute;
  width: 13.25rem;
  height: 11.68rem;
  top: 2.6875rem;
  right: 1.375rem;
  @include iphone-width {
    width: 6.5469rem;
    height: 5.7713rem;
    top: 1.3281rem;
    right: 0.6794rem;
  }
}
</style>
