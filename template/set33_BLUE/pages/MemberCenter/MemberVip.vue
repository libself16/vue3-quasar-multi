<template>
  <div class="pc-vip-container">
    <div class="vip-content">
      <div class="header">
        <!-- <div class="title">{{ $t("vip.vipRewards") }}</div> -->
        <q-btn-dropdown
          :label="vipCurrencyCode"
          class="currency-select"
          color="primary"
          dropdown-icon="expand_more"
          content-class="currency-menu"
        >
          <q-list>
            <q-item
              v-for="curr in currencyDropdown"
              :key="curr.value"
              clickable
              v-close-popup
              @click="vipCurrencyId = curr.value"
              class="flex justify-center items-center flex-nowrap"
            >
              <q-icon
                :name="vipCurrencyId === curr.value ? 'check_circle' : 'radio_button_unchecked'"
                class="mr-5"
                color="primary"
              ></q-icon>
              <span class="w-10">
                {{ curr.label }}
              </span>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="main-content">
        <div class="vip-wrap">
          <div class="user_vip_inner">
            <div v-if="currentVip.length > 0" class="h5-benefits-content w-full">
              <div class="user_vip_left">
                <div class="vip_inner">
                  <div class="user_vip_body">
                    <div class="user_vip_head">
                      <h2>{{ $t("vip.title") }} {{ currentVip[0].title }}</h2>
                    </div>
                    <div class="user_level_head">
                      <div class="user_level_bg">
                        <div class="user_level_light"></div>
                        <div class="user_level_pic">
                          <q-img :src="currentVip[0].img" />
                        </div>
                      </div>
                    </div>
                    <div class="user_vip_score_body">
                      <div class="score_title">{{ $t("vip.deposit") }}</div>
                      <div class="score_value">
                        <span>
                          {{
                            `${moneyFormat(userStatistics?.total_deposit)} / ${moneyFormat(
                              currentVip[0].condition?.deposit_amount
                            )}`
                          }}
                        </span>
                      </div>
                      <div class="score_process">
                        <div
                          class="ant-progress ant-progress-line ant-progress-status-active ant-progress-show-info ant-progress-default"
                        >
                          <div class="ant-progress-outer">
                            <div class="ant-progress-inner">
                              <div
                                class="ant-progress-bg"
                                style="height: 10px; background: #fbe106"
                                :style="`width: ${calculatePercentage(
                                  Number(userStatistics?.total_deposit),
                                  Number(currentVip[0].condition?.deposit_amount)
                                )}%;`"
                              ></div>
                            </div>
                          </div>
                          <!-- <span class="ant-progress-text" title="0%">0%</span> -->
                        </div>
                      </div>
                    </div>
                    <div class="user_vip_score_body">
                      <div class="score_title">{{ $t("vip.bet") }}</div>
                      <div class="score_value">
                        <span>
                          {{
                            `${moneyFormat(userStatistics?.total_valid_bet_amount)} / ${moneyFormat(
                              currentVip[0].condition?.valid_bet_amount
                            )}`
                          }}
                        </span>
                      </div>
                      <div class="score_process">
                        <div
                          class="ant-progress ant-progress-line ant-progress-status-active ant-progress-show-info ant-progress-default"
                        >
                          <div class="ant-progress-outer">
                            <div class="ant-progress-inner">
                              <div
                                class="ant-progress-bg"
                                style="height: 10px; background: #fbe106"
                                :style="`width: ${calculatePercentage(
                                  Number(userStatistics?.total_valid_bet_amount),
                                  Number(currentVip[0].condition?.valid_bet_amount)
                                )}%;`"
                              ></div>
                            </div>
                          </div>
                          <!-- <span class="ant-progress-text" title="0%">0%</span> -->
                        </div>
                      </div>
                    </div>
                    <div class="user_vip_next_txt">
                      <!-- Upgrading <span class="yellow">VIP 1</span> also requires -->
                    </div>
                    <div class="usr_vip_score_inner">
                      <div class="usr_vip_score_box">
                        <div class="usr_vip_score_box_item">
                          <h5>{{ $t("vip.deposit") }}</h5>
                          <h3>
                            $ <span>{{ moneyFormat(userStatistics?.total_deposit) }}</span>
                          </h3>
                        </div>
                        <div class="usr_vip_score_box_item">
                          <h5>{{ $t("vip.bet") }}</h5>
                          <h3>
                            $ <span>{{ moneyFormat(userStatistics?.total_valid_bet_amount) }}</span>
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <swiper
              :modules="[SwiperNavigation]"
              slides-per-view="auto"
              :space-between="36"
              :navigation="true"
              :centered-slides="true"
              class="vip-swiper"
              @swiper="onSwiperInit"
              @slideChange="onSlideChange"
            >
              <swiper-slide
                v-for="(vip, index) in vipList.filter((item) => item.id !== userInfo.member_level)"
                :key="index"
              >
                <VipCard
                  :vip-data="vip"
                  :user-statistics="userStatistics"
                  :is-active="userInfo.member_level === vip.level"
                />
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue"
import { useQuasar } from "quasar"
import { useVip } from "src/common/composables/useVip"
import { useCommon } from "src/common/hooks/useCommon"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation as SwiperNavigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import type { Swiper as SwiperType } from "swiper"
import VipCard from "./components/VipCard.vue"

const $q = useQuasar()
const { initVipSingleCurrency, currencyDropdown, vipCurrencyId, vipCurrencyCode, userStatistics, vipList, userInfo } =
  useVip()
const { moneyFormat, calculatePercentage } = useCommon()

const swiperInstance = ref<SwiperType | null>(null)
const currentVipIndex = ref(0)
const currentVip = computed(() => vipList.value.filter((item) => item.level === userInfo.value.member_level))

const onSwiperInit = (swiper: SwiperType) => {
  swiperInstance.value = swiper
  currentVipIndex.value = swiper.activeIndex
}

const onSlideChange = () => {
  if (swiperInstance.value) {
    currentVipIndex.value = swiperInstance.value.activeIndex
  }
}

onMounted(async () => {
  await initVipSingleCurrency()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.pc-vip-container {
  .vip-content {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    padding: 2.5rem 3.125rem;
    .header {
      @apply flex items-end justify-between;
      margin-bottom: 1.1875rem;
      .title {
        font-family: OpenSans;
        font-size: 2.5rem;
        font-weight: 800;
        line-height: 3.4044rem;
        text-align: left;
        color: #47b83d;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .currency-select {
        width: 148px;
        height: 40px;
        border-radius: 1.5rem;

        :deep(.q-btn__content) {
          position: relative;
          .q-icon {
            position: absolute;
            right: 0;
          }
        }
      }
    }
  }

  .main-content {
    .vip-swiper {
      padding: 10px 0;

      .swiper-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        // width: 41.25rem;
        // height: 21.25rem;
      }

      :deep(.swiper-button-next),
      :deep(.swiper-button-prev) {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: 1px solid #47b83d;
        background-color: rgba(241, 246, 255, 0.9);
        box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
        color: #47b83d;

        &::after {
          font-weight: 600;
          align-items: center;
          justify-content: center;
          text-align: center;
          background-color: transparent;
          border: none;
          cursor: pointer;
          padding: 12px;
          color: #000;
          background: linear-gradient(to bottom, rgba(240, 228, 127, 1) 0%, rgba(200, 166, 68, 1) 100%);
          border-radius: 50px;
          height: 45px;
          width: 45px;
          font-size: 20px;
          opacity: 1;
        }
      }

      :deep(.swiper-button-next) {
        right: 1.125rem;
      }

      :deep(.swiper-button-prev) {
        left: 1.125rem;
      }

      :deep(.swiper-button-disabled) {
        color: #818181;
        border: 1px solid #e8edfe;
        background-color: #ebebec;
      }
    }
  }

  .benefits-content {
    .benefits-title {
      margin-top: 3.9375rem;
      margin-bottom: 2.125rem;
      font-family: OpenSans;
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 2.3831rem;
      color: #2f3c55;
    }
    .benefits {
      font-family: OpenSans;
      box-sizing: border-box;
      gap: 1rem;
      display: flex;
      flex-flow: wrap;
      .benefit-card {
        width: 13.75rem;
        height: 9.125rem;
        border: 1px solid #efefef;
        background-color: #fbfcfd;
        border-radius: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        .icon {
          width: 3.375rem;
          height: 3.375rem;
          margin-top: 1.125rem;
        }
        .title {
          font-family: OpenSans;
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 19.07px;
          color: #aab5ce;
          margin-top: 0.5625rem;
        }
        .text {
          margin-top: 0.5625rem;
          font-family: OpenSans;
          font-size: 20px;
          font-weight: 700;
          line-height: 27.24px;
          color: #2f3c55;
        }
      }
    }
  }
}

.h5-vip-container {
  .h5-header {
    position: relative;
    border-radius: 3rem 0px 0px;
    background-color: #f9fafd;
    padding-top: 2rem;
    overflow: hidden;

    .h5-currency-select {
      @apply mr-16;
      width: 11rem;
      height: 2.875rem;
      border-radius: 1.5rem;

      :deep(.q-btn__content) {
        position: relative;
        font-size: 1.25rem;
        .q-icon {
          position: absolute;
          right: 0;
        }
      }
    }

    .h5-main-content {
      width: 62rem;
      padding-left: 3.5rem;
      padding-right: 3.5rem;
      .h5-vip-swiper {
        padding: 1.875rem 0;
        .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 41.25rem;
          height: 21.25rem;
        }
      }
    }

    @include pad-width {
      .h5-main-content {
        width: auto;
      }
    }

    @include iphone-width {
      border-radius: 1.5rem 0px 0px;
      padding-top: 1rem;

      .h5-currency-select {
        @apply mr-8 p-0;
        width: 5.5rem;
        height: 1.4375rem;
        min-height: 1.5rem;

        :deep(.q-btn__content) {
          font-size: 0.75rem;
          .q-icon {
            right: 8px;
            font-size: 0.875rem;
          }
        }
      }

      .h5-main-content {
        padding-left: 1.75rem;
        padding-right: 0;
        .h5-vip-swiper {
          padding: 0.9375rem 0;
          .swiper-slide {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 20.375rem;
            height: 10.5rem;
          }
        }
      }
    }
  }

  .h5-benefits-content {
    padding: 50.375rem 3.5rem 3.5rem;
    .h5-benefits-title {
      margin-top: 0.625rem;
      margin-bottom: 1rem;
      font-family: OpenSans;
      font-size: 2rem;
      font-weight: 700;
      line-height: 2.75rem;
      color: #2f3c55;
    }
    .h5-benefits {
      font-family: OpenSans;
      box-sizing: border-box;
      gap: 1.25rem;
      display: flex;
      flex-flow: wrap;
      .h5-benefit-card {
        width: 12.5rem;
        height: 12.5rem;
        background-color: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .h5-icon {
          width: 4.5rem;
          height: 4.5rem;
        }
        .h5-title {
          font-family: OpenSans;
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.6875rem;
          color: #aab5ce;
          margin-top: 0.375rem;
        }
        .h5-text {
          margin-top: 0.375rem;
          font-family: OpenSans;
          font-size: 2rem;
          font-weight: 700;
          line-height: 2.75rem;
          color: #2f3c55;
        }
      }
    }

    @include iphone-width {
      padding: 25.1875rem 1.75rem 1.75rem;
      .h5-benefits-title {
        margin-top: 0.3125rem;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        line-height: 1.375rem;
      }
      .h5-benefits {
        gap: 0.625rem;
        .h5-benefit-card {
          width: 6.25rem;
          height: 6.25rem;

          .h5-icon {
            width: 2.25rem;
            height: 2.25rem;
          }
          .h5-title {
            font-size: 0.625rem;
            line-height: 0.8512rem;
            margin-top: 0.1875rem;
          }
          .h5-text {
            margin-top: 0.1875rem;
            font-size: 1rem;
            line-height: 1.375rem;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import "src/common/css/_variable.sass";

.currency-menu {
  border-radius: 1.5rem;
}

.h5-currency-menu {
  width: 11rem;
  border-radius: 1.5rem;
  .q-item {
    font-size: 1.25rem;
    .q-icon {
      margin-right: 1.25rem;
    }
  }

  @include iphone-width {
    width: 5.5rem;
    .q-item {
      font-size: 0.75rem;
      .q-icon {
        margin-right: 0.625rem;
      }
    }
  }
}

/*VIP*/
/* vip page */
.vip-wrap {
  padding: 20px;
  padding-top: 70px;
}

.user_vip_inner {
  grid-gap: 20px;
  color: #fff;
  display: flex;
  margin: 0 auto;
  padding: 0;
  position: relative;
  width: 100%;
  flex-wrap: wrap;
}

.user_vip_inner .user_vip_left {
  background: #082f1a;
  border-radius: 0.75rem;
  margin: 0 auto;
  padding: 7px;
  width: 100%;
}

.user_vip_inner .vip_inner {
  display: block;
  height: 100%;
  margin: 0 auto;
  width: 100%;
}

.user_vip_inner .user_vip_body {
  display: grid;
  grid-gamingsoft-rows: 40px 1fr 45px 45px 40px 68px;
  margin: 0 auto;
  padding: 10px;
  width: 100%;
}

.user_vip_inner .user_vip_head {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  text-align: center;
}

.user_vip_inner .user_vip_head h2 {
  color: #47b83d;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.4;
  margin: 0 auto;
  padding: 8px;
  text-transform: uppercase;
  width: 100%;
}

.user_vip_inner .user_level_bg {
  background: url(/static/media/vip_mid.a4e399bÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦.svg) 50% no-repeat;
  background-size: 70%;
  margin: 0 auto;
  min-height: 120px;
}

.user_vip_inner .user_level_bg,
.user_vip_inner .user_level_light {
  align-items: center;
  display: flex;
  justify-content: center;
  text-align: center;
}

.user_vip_inner .user_level_light {
  border-radius: 50%;
  box-shadow: 0 0 100px 50px #fed791;
  height: 0;
  position: absolute;
  width: 0;
  z-index: 1;
}

.user_vip_inner .user_level_pic {
  margin: 0 auto;
  z-index: 2;

  width: 140px;
  height: 140px;
}

.user_vip_inner .user_vip_score_body {
  color: var(--text-color);
  display: grid;
  grid-template-columns: 80px 1fr;
  line-height: 1.3;
  margin: 10px auto 0;
  padding: 0;
  width: 100%;
}

.user_vip_inner .score_title {
  padding-left: 5px;
  text-align: left;
}

.user_vip_inner .score_value {
  padding-right: 5px;
  text-align: right;
}

.vip_overview .yellow2 {
  color: #d5f193;
}

.user_vip_inner .score_process {
  grid-column-end: 3;
  grid-column-start: 1;
  grid-row-end: 2;
  grid-row-start: 2;
}

.user_vip_inner .user_vip_next_txt {
  color: var(--text-color);
  font-size: 12px;
  font-weight: 600;
  padding: 10px;
  text-align: center;
}

.user_vip_inner .usr_vip_score_inner {
  margin: 0 auto;
  padding: 0 10px;
  width: 100%;
}

.user_vip_inner .usr_vip_score_box {
  grid-gap: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  margin: 0 auto;
  width: 100%;
}

.user_vip_inner .usr_vip_score_box_item {
  background: #0c330d;
  border-radius: 0.5rem;
  display: block;
  display: flex;
  flex-direction: column;
  /* min-height: 60px; */
  text-align: center;
  justify-content: center;
  padding: 10px;
}

.user_vip_inner .user_vip_righ {
  background: #021524;
  border-radius: 0.75rem;
  display: block;
  margin: 0 auto;
  padding: 15px;
  position: relative;
  width: 100%;
}

.user_vip_inner .vip_inner {
  display: block;
  height: 100%;
  margin: 0 auto;
  width: 100%;
}

.user_vip_inner .user_vip_right_body {
  margin: 0 auto;
  padding: 10px 10px 18px;
  width: 100%;
}

.user_vip_inner .user_vip_head {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  text-align: center;
}

.user_vip_inner .user_level_list,
.user_vip_inner .user_vip_level_process {
  margin: 0 auto;
  padding: 5px 20px;
  width: 100%;
  position: relative;
}

.user_vip_inner .user_level_list_body {
  grid-gap: 20px 10px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin: 10px auto;
  width: 100%;
}

.user_vip_inner .level_box_item {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  text-align: center;
  width: 100%;
}

.user_vip_inner .levle_box_body {
  background: #323838;
  border-radius: 0.5rem;
  color: #adb6c4;
  cursor: pointer;
  font-family: Montserrat-Bold;
  font-size: 12px;
  height: 100px;
  min-width: 36px;
  position: relative;
  z-index: 1;
}

.user_vip_inner .levle_box_pic {
  align-items: center;
  background: url(../image/vip/giftbox.png) 50% no-repeat;
  display: flex;
  height: 60px;
  justify-content: center;
  margin: 0 auto;
  text-align: center;
}

.user_vip_inner .levle_box_title {
  background: #0069bc;
  border-radius: 0 0 0.5rem 0.5rem;
  color: #333;
  padding: 3px 0 0;
  text-transform: uppercase;
  z-index: 11;
}

.user_vip_inner .levle_box_body:after {
  background: #0069bc;
  bottom: -7px;
  content: "";
  height: 12px;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  width: 12px;
  z-index: -1;
}

.user_vip_inner .usr_vip_score_box_item h5 {
  color: #47b83d;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.user_vip_inner .big_score_box .usr_vip_score_box_item h3 {
  font-size: 18px;
  margin: 10px auto;
  font-weight: 600;
  line-height: 1;
}

.ant-progress-line {
  font-size: 14px;
  position: relative;
  width: 100%;
}

.ant-progress-bg,
.ant-progress-success-bg {
  background-color: #177ddc;
  border-radius: 100px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0s;
}

.ant-progress-outer {
  display: inline-block;
  margin-right: 0;
  padding-right: 0;
  width: 100%;
}

.ant-progress-show-info .ant-progress-outer {
  margin-right: calc(-2em - 8px);
  padding-right: calc(2em + 8px);
}

.ant-progress-inner {
  background-color: hsla(0, 0%, 100%, 0.08);
  border-radius: 100px;
  display: inline-block;
  overflow: hidden;
  position: relative;
  vertical-align: middle;
  width: 100%;
}

.ant-progress-text {
  color: hsla(0, 0%, 100%, 0.85);
  display: inline-block;
  font-size: 1em;
  line-height: 1;
  margin-left: 8px;
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;
  width: 2em;
  word-break: normal;
}

.user_vip_inner .usr_vip_score_box_item h3 {
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  margin-top: 16px;
}

.yellow {
  color: #47b83d;
}

.user_vip_inner .user_vip_level_desc {
  color: var(-color-grey7);
  font-size: 14px;
  min-height: 40px;
  padding: 10px 8px;
  text-align: center;
}

.card_overview {
  display: block;
  margin: 30px auto;
  position: relative;
  width: 100%;
  max-width: 446px;
}

@media (min-width: 767px) {
  .card_overview {
    min-width: 365px;
  }
}

.rank_slider_container {
  overflow: hidden;
  /* Add this line to hide overflowing content */
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.rank_slider_wrapper {
  color: #fff;
  display: flex;
  grid-template-columns: repeat(3, 1fr);
  margin: 46px auto 0;
  padding: 0;
  position: relative;
  width: 100%;
}

.rank_slider_slide {
  background: linear-gradient(to bottom, rgba(16, 183, 243, 1) 0%, rgba(12, 112, 170, 1) 33%, rgba(8, 93, 143, 1) 100%);
  margin: 0 auto;
  padding: 20px 12px 30px;
  /* opacity: 0.5; */
}

.rank_slider_slide,
.rank_slider_slide_out {
  border-radius: 0.75rem;
  position: relative;
  width: 100%;
}

.rank_slider_slide_out {
  border: 2px solid transparent;
  /* Optional: Add your inactive slide styles here */
}

.rank_slider_slide_out.swiper-slide {
  background: none;
  box-shadow: none;
}

.swiper-slide-active {
  opacity: 1;
}

.rank_slider_image {
  align-items: center;
  display: flex;
  height: 100px;
  justify-content: center;
  left: 0;
  margin: 0 auto;
  position: absolute;
  right: 0;
  top: -50px;
  width: 100px;
}

.rank_slider_image img {
  align-items: center;
  display: block;
  justify-content: center;
  pointer-events: none;
  text-align: center;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 100%;
}

.rank_slider_slider_body {
  padding: 10px 0 10px;
  position: relative;
  text-align: center;
  top: 20px;
  z-index: 2;
}

.rank_slider_title {
  margin: 10px auto 0;
  text-align: center;
  width: 100%;
}

.rank_slider_slider_body h4 {
  color: #47b83d;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  margin-top: 5px;
  text-align: center;
}

.rank_slider_slider_body h5 {
  color: #adb6c4;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  margin-top: 5px;
  text-align: center;
}

.rank_slider_slider_body h6 {
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  margin-top: 5px;
  text-align: center;
  color: #ffffff;
}

.rank_slider_title h5 {
  color: #ffffff;
}

.rank_slider_rule_1 {
  margin: 5px auto 0;
  padding: 0;
  width: 100%;
}

.rank_slider_rule_box {
  grid-gap: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  margin: 0 auto;
  width: 100%;
}

.rank_slider_rule_box_item {
  background: #021524;
  border-radius: 0.5rem;
  display: block;
  display: flex;
  flex-direction: column;
  min-height: 60px;
  text-align: center;
  border: 1px solid #086eb8;
}

.rank_slider_rule_box_item h5 {
  color: #086eb8;
  font-size: 13px;
  font-weight: 600;
  margin-top: 5px;
}

.rank_slider_rule_box_item h4 {
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  color: #fff;
}

.rank_slider_rule_2,
.rank_slider_rule_3 {
  margin-top: 10px;
  text-align: center;
}

.rank_slider_rule_3 hr {
  margin-top: 10px;
}

.rank_slider_rule_4 {
  margin: 5px auto;
  padding: 0;
  width: 100%;
}

.rank_slider_tr_3 {
  grid-gap: 2px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 0 2px;
}

.rank_slider_tr_2 {
  grid-gap: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 0 40px;
}

.rank_slider_rule_4 div {
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  margin-top: 5px;
  text-align: center;
}

.rank_slider_slide_out.active {
}

.rank_slider_slide_out.active .rank_slider_slide {
  background: linear-gradient(to bottom, rgba(114, 213, 9, 1) 0%, rgba(50, 56, 56, 1) 100%);
  opacity: 1;
}

.rank_slider_slide_out.active .rank_slider_slide.rank_slider_slide:before {
  background: linear-gradient(180deg, #12442b, #85e6a1);
}

.rank_slider_slide_out.active .rank_slider_slide_bottom .btn {
  background: #85e6a1;
  color: #000;
}

.rank_slider_slide_bottom .btn {
  background-color: #0069bc;
  border: none;
  border-radius: 1.2rem;
  color: #000;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 40px;
}

.level_pagediv {
  display: grid;
  grid-template-columns: 30% auto 30%;
  height: 100%;
  margin: 20px auto 0;
  width: 200px;
}

.level_pagediv,
.level_pagediv .level_btn {
  align-items: center;
  justify-content: center;
  text-align: center;
}

.level_pagediv .level_btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #000;
}

.rank_slider_slider_body hr {
  background-color: #47b83d;
  border: none;
  height: 1px;
  margin: 0 auto;
  width: 100%;
  opacity: 1;
}

/* end vip page */

/*12122023*/
.level_pagediv {
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}

.level_pagediv .level_btn {
  background: linear-gradient(to bottom, rgba(240, 228, 127, 1) 0%, rgba(200, 166, 68, 1) 100%);
  border-radius: 50px;
  height: 45px;
  width: 45px;
  font-size: 24px;
  opacity: 1;
}

.left_level_pre {
  z-index: 1;
}

.right_level_next {
  z-index: 1;
}

.dlw-show {
  display: block;
}

.mlw-show {
  display: none;
}
</style>
