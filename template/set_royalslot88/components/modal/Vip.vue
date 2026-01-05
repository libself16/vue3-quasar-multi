<template>
  <ModalBase
    v-model="modalShow"
    modal-class="modal_share_custom"
    use-title
    :title="$t('menu.vip')"
    title-class="modal_title_top"
    max-width="1280px"
  >
    <div class="vip-wrap">
      <div class="user_vip_inner">
        <div class="user_vip_left">
          <div class="vip_inner">
            <div class="user_vip_body">
              <div class="user_vip_head">
                <h2>YOUR VIP LEVEL IS LV1</h2>
              </div>
              <div class="user_level_head">
                <div class="user_level_bg">
                  <div class="user_level_light"></div>
                  <div class="user_level_pic">
                    <q-img :src="vipIcon(1)"></q-img>
                  </div>
                </div>
              </div>
              <div class="user_vip_score_body">
                <div class="score_title">Deposit</div>
                <div class="score_value"><span>$ 0</span>/ <span class="yellow2">$ 100</span></div>
                <div class="score_process">
                  <div
                    class="ant-progress ant-progress-line ant-progress-status-active ant-progress-show-info ant-progress-default"
                  >
                    <div class="ant-progress-outer">
                      <div class="ant-progress-inner">
                        <div class="ant-progress-bg" style="width: 10%; height: 10px; background: #fbe106"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="user_vip_score_body">
                <div class="score_title">Bet</div>
                <div class="score_value"><span> $ 0</span>/ <span class="blue">$ 500</span></div>
                <div class="score_process">
                  <div
                    class="ant-progress ant-progress-line ant-progress-status-active ant-progress-show-info ant-progress-default"
                  >
                    <div class="ant-progress-outer">
                      <div class="ant-progress-inner">
                        <div
                          class="ant-progress-bg"
                          style="width: 0%; height: 10px; background: rgb(31, 150, 230)"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="user_vip_next_txt">Upgrading <span class="yellow">VIP 1</span> also requires</div>
              <div class="usr_vip_score_inner">
                <div class="usr_vip_score_box">
                  <div class="usr_vip_score_box_item">
                    <h5>Deposit</h5>
                    <h3>$ <span>100</span></h3>
                  </div>
                  <div class="usr_vip_score_box_item">
                    <h5>Bets</h5>
                    <h3>$ <span>100</span></h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="user_vip_righ">
          <div class="card_overview">
            <Carousel :items-to-show="3" ref="carouselRef" :breakpoints="breakpoints">
              <Slide v-for="(level, i) in VipLevels" :key="i">
                <div class="rank_slider_slide">
                  <div class="rank_slider_image">
                    <q-img :src="vipIcon(i + 1)"></q-img>
                  </div>
                  <div class="rank_slider_slider_body">
                    <div class="rank_slider_title">
                      <h4>LV-{{ i + 1 }}</h4>
                      <h5>{{ level.levelLabel }}</h5>
                    </div>
                    <div class="rank_slider_rule_1">
                      <div class="rank_slider_rule_box">
                        <div class="rank_slider_rule_box_item">
                          <h5>Total deposits</h5>
                          <h4 class="yellow">${{ level.totalDeposit }}</h4>
                        </div>
                        <div class="rank_slider_rule_box_item">
                          <h5>Total bets</h5>
                          <h4 class="yellow">$0</h4>
                        </div>
                      </div>
                    </div>
                    <div class="rank_slider_rule_2">
                      <h4>LEVEL PRIVILEGE</h4>
                      <h6>
                        Get {{ level.levelPrivilegePercentage + "%" }} of the previous day's bet amount in cash every
                        day
                      </h6>
                      <hr />
                    </div>
                    <div class="rank_slider_rule_3">
                      <h4>WITHDRAWAL PRIVILEGES</h4>
                      <h6>update conditions</h6>
                      <h6>Number of withdrawals:{{ level.withdrawalPrivilege.numberOfWithdrawals }} times/day</h6>
                      <h6>Maximum unit price:$ 20,000</h6>
                      <h6>Withdrawal fee:1%</h6>
                      <h6>Free withdrawal:1/month</h6>
                    </div>
                  </div>
                </div>
              </Slide>
            </Carousel>
          </div>
          <div class="level_pagediv">
            <div class="left_level_pre">
              <q-btn
                round
                size="sm"
                @click="carouselRef.prev()"
                type="button"
                class="level_btn"
                icon="fas fa-chevron-left"
              >
              </q-btn>
            </div>
            <div class="right_level_next">
              <q-btn
                round
                size="sm"
                @click="carouselRef.next()"
                type="button"
                class="level_btn"
                icon="fas fa-chevron-right"
              >
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import ModalBase from "./modalBase.vue"
import { ref, onMounted, computed } from "vue"
import { useSiteImg } from "app/template/set_royalslot88/hooks/useSiteImg"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const { vipIcon } = useSiteImg()
const eventbus = injectStrict(EventBusKey)

//carousel
import { Carousel, Slide } from "vue3-carousel"
import "vue3-carousel/dist/carousel.css"

const modalShow = ref(false)

const carouselRef = ref()
const breakpoints = {
  300: {
    itemsToShow: 1
  },
  700: {
    itemsToShow: 2,
    itemsToScroll: 2
  },
  1024: {
    itemsToScroll: 3
  }
}

//  先用假資料
const VipLevels = computed(() => {
  return Array(10).fill(levels.value[0])
})

const levels = ref([
  {
    level: 1,
    levelLabel: "Condições de atualização",
    totalDeposit: 0,
    totalBet: 0,
    levelPrivilegePercentage: 6,
    withdrawalPrivilege: {
      numberOfWithdrawals: 5,
      maximumUnitPrice: 20000,
      withdrawalFee: 1,
      freeWithdrawal: 1
    }
  }
])

const openModal = () => {
  modalShow.value = true
}

defineExpose({
  openModal
})

onMounted(() => {
  eventbus.on("openVip", (show: boolean) => {
    if (show) {
      openModal()
    }
  })
})
</script>

<style scoped lang="scss">
@import "app/template/set_royalslot88/assets/css/vip.css";

.vip-wrap {
  h5 {
    @apply leading-none;
  }

  .user_level_pic {
    @apply w-full;
  }

  .card_overview {
    .carousel {
      .rank_slider_slide {
        @apply mt-[46px];
      }
      ::v-deep(.carousel__slide) {
        @apply px-[.75rem];

        h6 {
          @apply mb-[0.5rem];
        }
      }
    }
  }

  .level_pagediv {
    @apply pointer-events-none;
    button {
      @apply pointer-events-auto;
    }
  }
}
</style>
