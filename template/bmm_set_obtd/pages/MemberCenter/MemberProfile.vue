<template>
  <div v-if="$q.platform.is.mobile" class="profile-h5">
    <div class="info-header">
      <q-btn flat @click="handleOpenLiveChat">
        <i class="icon-service"></i>
      </q-btn>
      <q-btn flat :to="{ name: 'memberInbox' }">
        <i class="icon-mail"></i>
      </q-btn>
    </div>
    <div class="info-container">
      <div class="flex items-center">
        <Avatar />
        <div class="flex flex-col">
          <div v-if="isKycEnabled">
            <q-btn v-if="isKycVerified" class="mobile-kyc-btn" rounded flat>
              <img :src="commonResult('kyc/v2_approved.png')" />
              KYC {{ $t("member.kyc.status_success") }}
            </q-btn>
            <q-btn v-else class="mobile-kyc-btn" rounded flat :to="{ name: 'MemberKyc' }">
              <img :src="commonResult('kyc/v2_rejected.png')" />
              KYC {{ $t("member.kyc.status_unverified") }}
            </q-btn>
          </div>
          <div class="info-content" @click="router.push({ name: 'memberProfileDetail' })">
            <h3>{{ userInfo2.nickname || userInfo2.fullname }}</h3>
            <p>{{ $t("member.register.username") }}: {{ userInfo2.account }}</p>
          </div>
        </div>
      </div>
      <q-btn flat icon="arrow_forward_ios" :to="{ name: 'memberProfileDetail' }" class="btn-profile-detail"></q-btn>
    </div>
    <div class="wallet-header">
      <div class="wallet-content">
        <i class="icon-wallet"></i>
        <span class="text">{{ $t("member.profile.totalBalances") }}</span>
      </div>
      <div class="wallet-content">
        <span class="currency mr-1">{{ activeWalletLabel }}</span>
        <span v-if="inUseWallet" class="balance">
          {{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0", 2) }}
        </span>
        <q-btn
          icon="fa-solid fa-arrows-rotate"
          class="btn-refresh hide-hover"
          :class="{ active: isLoading }"
          flat
          @click="getUserWalletList"
        ></q-btn>
      </div>
    </div>
    <div class="wallet-body">
      <router-link :to="{ name: 'MemberDeposit' }" class="wallet-body-content">
        <i class="icon-deposit"></i>
        <div>
          <p class="title">{{ $t("menu.deposit") }}</p>
          <p class="sub-title">{{ $t("menu.deposit") }}</p>
        </div>
      </router-link>
      <div class="divider"></div>
      <router-link :to="{ name: 'MemberWithdrawal' }" class="wallet-body-content">
        <i class="icon-withdrawal"></i>
        <div>
          <p class="title">{{ $t("menu.withdrawal") }}</p>
          <p class="sub-title">{{ $t("menu.withdrawal") }}</p>
        </div>
      </router-link>
    </div>
    <div class="infos-body">
      <div class="infos-wrapper">
        <q-icon name="error" size="26px" color="red-14" class="mt-2 mr-2" />
        <div class="infos-data">
          <div class="online-time">
            <label>{{ $t("common.online_time") }}：</label>
            <span class="text-primary font-bold">{{ onlineTime }}</span>
          </div>
          <div class="win-lose-list-wrapper">
            <label>{{ $t("menu.winLoss") }}：</label>
            <div class="win-lose-list">
              <q-badge
                v-for="(item, key) in genWinLoseList"
                :key="key"
                :color="item.isPositive ? 'light-green-3' : 'red-2'"
                :text-color="item.isPositive ? 'green-9' : 'red-8'"
                class="px-2 py-2 font-[500] text-[16px] mr-2 mt-2 justify-end"
                align="middle"
              >
                {{ moneyFormat(item.win_loss_amount) }} {{ item.currency_code }}
              </q-badge>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showMoreBtn" class="more-wrapper">
        <q-btn rounded flat class="btn-more" @click="getMore">
          {{ $t("social_media.more") }}
        </q-btn>
      </div>
    </div>
    <div class="menu-list">
      <template v-if="!isTelegramMiniApp">
        <!-- password -->
        <q-btn class="menu-item" flat :to="{ name: 'memberChangePassword' }">
          <q-icon name="las la-lock" class="icon-first"></q-icon>
          <div class="menu-content">
            <div>{{ $t("member.profile.loginPassword") }}</div>
          </div>
          <q-icon name="navigate_next" class="icon-last"></q-icon>
        </q-btn>
        <q-separator />
      </template>
      <!-- withdrawal password -->
      <q-btn class="menu-item" flat :to="{ name: 'memberChangeWithdrawalPassword' }" v-if="showWithdrawalPassword">
        <q-icon name="las la-lock" class="icon-first"></q-icon>
        <div class="menu-content">
          <div>{{ $t("member.profile.withdrawalPassword") }}</div>
        </div>
        <q-icon name="navigate_next" class="icon-last"></q-icon>
      </q-btn>
      <q-separator v-if="showWithdrawalPassword" />
      <template v-if="betLimitEnabled">
        <q-btn class="menu-item" flat :to="{ name: 'memberBetLimitList' }">
          <q-icon name="do_disturb_alt" class="icon-first"></q-icon>
          <div class="menu-content">
            <div>
              {{ $t("member.profile.selfRestriction") }} - {{ $t("member.profile.bettingLimit") }}
              <div v-if="isBetLimit" class="menu-content-value">
                {{ $t("member.profile.CumulativeBettingAmountReachedMaximum") }}
              </div>
            </div>
          </div>
          <q-icon name="navigate_next" class="icon-last"></q-icon>
        </q-btn>
        <q-separator />
      </template>

      <q-btn class="menu-item" flat :to="{ name: 'memberBettingRestriction' }">
        <q-icon name="do_disturb_alt" class="icon-first"></q-icon>
        <div class="menu-content">
          <div>
            {{ $t("member.profile.selfRestriction") }} - {{ $t("member.profile.bettingRestriction") }}
            <div v-if="betRestrictionDatetimeSetted" class="menu-content-value">
              {{ $t("member.profile.exclusionPeriodCannotPlayGame") }}
            </div>
          </div>
        </div>
        <q-icon name="navigate_next" class="icon-last"></q-icon>
      </q-btn>
      <q-separator />
      <!-- funds -->
      <q-btn class="menu-item" flat :to="{ name: 'MemberFunds' }">
        <q-icon name="las la-wallet" class="icon-first"></q-icon>
        <div class="menu-content">
          <div>{{ $t("menu.fundsDetails") }}</div>
          <div class="sub-text">{{ $t("menu.transactionHistoryDetails") }}</div>
        </div>
        <q-icon name="navigate_next" class="icon-last"></q-icon>
      </q-btn>
      <!-- vip -->
      <template v-if="isVipRewardsOpen && isCash">
        <q-separator />
        <q-btn class="menu-item" flat :to="{ name: 'MemberVip' }">
          <q-icon class="icon-first icon-vip"></q-icon>
          <div class="menu-content">
            <div>{{ $t("vip.vipRewards") }}</div>
          </div>
          <q-icon name="navigate_next" class="icon-last"></q-icon>
        </q-btn>
      </template>
      <q-separator />
      <!-- promotion -->
      <q-btn class="menu-item" flat :to="{ name: 'promotion' }">
        <q-icon name="las la-gift" class="icon-first"></q-icon>
        <div class="menu-content">
          <div>{{ $t("menu.promotions") }}</div>
          <i class="icon-gift"></i>
        </div>
        <q-icon name="navigate_next" class="icon-last"></q-icon>
      </q-btn>
      <q-separator />
      <!-- infomation  -->
      <q-btn class="menu-item" flat :to="{ name: 'infoCenter' }">
        <q-icon name="las la-info-circle" class="icon-first"></q-icon>
        <div class="menu-content">
          <div>{{ $t("menu.about_us") }}</div>
          <!-- $t('member.profile.totalBalances') -->
          <div class="sub-text">
            {{ $t("member.profile.responsible") }} | {{ $t("member.profile.TC") }} | {{ $t("member.profile.privacy") }}
          </div>
        </div>
        <q-icon name="navigate_next" class="icon-last"></q-icon>
      </q-btn>
      <q-separator />
      <q-btn v-if="showAIAgent" class="menu-item" flat :to="{ name: 'AIAgent' }">
        <q-icon name="las la-robot" class="icon-first"></q-icon>
        <div class="menu-content">
          <div>{{ $t("ai.agent") }}</div>
        </div>
        <q-icon name="navigate_next" class="icon-last"></q-icon>
      </q-btn>
    </div>
    <FooterNav />
  </div>
  <div v-else class="profile-pc">
    <div class="profile-header">
      <img :src="memberImg('profile.png')" alt="profile" class="title-img" />
      <div>
        <q-btn rounded flat icon="mail" class="top-btn" :to="{ name: 'memberInbox' }"></q-btn>
        <template v-if="isKycEnabled">
          <q-btn v-if="isKycVerified" rounded flat class="top-btn btn-kyc cursor-default">
            <img :src="commonResult('kyc/v2_approved.png')" />
            KYC {{ $t("member.kyc.status_success") }}
          </q-btn>
          <q-btn v-else rounded flat class="top-btn btn-kyc" :to="{ name: 'MemberKyc' }">
            <img :src="commonResult('kyc/v2_rejected.png')" />
            KYC {{ $t("member.kyc.status_unverified") }}
          </q-btn>
        </template>
      </div>
    </div>

    <q-card class="profile-body">
      <!-- profile detail -->
      <q-card-section class="profile-infos">
        <div class="infos-wrapper">
          <q-icon name="error" size="26px" color="red-14" />
          <div class="infos-box">
            <div class="online-time">
              <label>{{ $t("common.online_time") }}：</label>
              <span class="text-primary font-bold">{{ onlineTime }}</span>
            </div>
            <div class="win-lose-list-wrapper">
              <label>{{ $t("menu.winLoss") }}：</label>
              <div class="win-lose-list">
                <q-badge
                  v-for="(item, key) in genWinLoseList"
                  :key="key"
                  :color="item.isPositive ? 'light-green-3' : 'red-2'"
                  :text-color="item.isPositive ? 'green-9' : 'red-8'"
                  class="px-2 py-2 font-[500] text-[16px] mr-2 mt-2"
                  align="middle"
                >
                  {{ moneyFormat(item.win_loss_amount) }} {{ item.currency_code }}
                </q-badge>
              </div>

              <div v-if="showMoreBtn" class="more-wrapper">
                <q-btn rounded flat class="btn-more" @click="getMore">
                  {{ $t("social_media.more") }}
                </q-btn>
              </div>
            </div>
          </div>
        </div>
        <q-btn color="primary" class="btn-logout" @click="logout">
          {{ $t("common.btn.logout") }}
        </q-btn>
      </q-card-section>
      <!-- profile detail -->
      <q-card-section class="section">
        <div class="title">
          <q-icon name="fa-regular fa-circle-user" />
          <span>{{ $t("member.profile.personalInformation") }}</span>
        </div>
        <div class="title-tip"></div>
        <div class="content">
          <q-btn rounded flat :to="{ name: 'memberProfileDetail' }" class="btn-setup">{{
            $t("common.btn.setUp")
          }}</q-btn>
        </div>
      </q-card-section>
      <template v-if="!isTelegramMiniApp">
        <!-- change login password -->
        <q-card-section class="section">
          <div class="title">
            <q-icon name="key" />
            <span>{{ $t("member.profile.loginPassword") }}</span>
          </div>
          <div class="title-tip"></div>
          <div class="content">
            <q-btn rounded flat class="btn-setup" :to="{ name: 'memberChangePassword' }">{{
              $t("common.btn.setUp")
            }}</q-btn>
          </div>
        </q-card-section>
      </template>
      <!-- change withdraw password -->
      <q-card-section class="section" v-if="showWithdrawalPassword">
        <div class="title">
          <q-icon name="key" />
          <span>{{ $t("member.profile.withdrawalPassword") }}</span>
        </div>
        <div class="title-tip"></div>
        <div class="content">
          <q-btn rounded flat class="btn-setup" :to="{ name: 'memberChangeWithdrawalPassword' }">{{
            $t("common.btn.setUp")
          }}</q-btn>
        </div>
      </q-card-section>
      <q-card-section v-if="betLimitEnabled" class="section">
        <div class="title">
          <q-icon name="do_disturb_alt" />
          <span>{{ $t("member.profile.selfRestriction") }} - {{ $t("member.profile.bettingLimit") }}</span>
        </div>
        <div class="title-tip">
          {{ isBetLimit ? $t("member.profile.CumulativeBettingAmountReachedMaximum") : "" }}
        </div>
        <div class="content">
          <q-btn rounded flat class="btn-setup" :to="{ name: 'memberBetLimitList' }">{{
            $t("common.btn.setUp")
          }}</q-btn>
        </div>
      </q-card-section>
      <q-card-section class="section">
        <div class="title">
          <q-icon name="do_disturb_alt" />
          <span>{{ $t("member.profile.selfRestriction") }} - {{ $t("member.profile.bettingRestriction") }}</span>
        </div>
        <div class="title-tip">
          {{ betRestrictionDatetimeSetted ? $t("member.profile.exclusionPeriodCannotPlayGame") : "" }}
        </div>
        <div class="content">
          <q-btn rounded flat class="btn-setup" :to="{ name: 'memberBettingRestriction' }">{{
            $t("common.btn.setUp")
          }}</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
  <!-- 給修改密碼用 -->
  <router-view></router-view>

  <!-- 會員輸贏彈窗 -->
  <MemberWinLoseDialog />
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useNow } from "@vueuse/core"
import dayjs from "dayjs"
import { useSiteImg } from "app/template/bmm_set_obtd/hooks/useSiteImg"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useOnlineTime } from "src/common/composables/useOnlineTime"
import { useCommon } from "src/common/hooks/useCommon"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useRouter } from "vue-router"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useEnv } from "src/common/hooks/useEnv"
import { useEnvInfoStore } from "src/stores/envStore"
import Avatar from "./components/Avatar.vue"
import FooterNav from "app/template/bmm_set_obtd/components/Footer/FooterNav.vue"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useUserPreferences } from "src/common/composables/useUserPreferences"
import { useAuth } from "src/common/hooks/useAuth"
import * as Response from "src/api/response.type"
import MemberWinLoseDialog from "../../components/Dialog/MemberWinLoseDialog.vue"

const $q = useQuasar()
const { t } = useI18n()
const router = useRouter()
const { moneyFormat } = useCommon()
const { betRestrictionDatetimeSetted, handleGetPreferencesExclusion, isBetLimit, handleGetBetLimitStatus } =
  useUserPreferences()
const {
  userInfo2,
  inUseWallet,
  getUserWalletList,
  isLoading,
  isKycEnabled,
  activeWalletCurrencyId,
  isKycVerified,
  getUserKycStatus,
  getUserBetHistoryTotal,
  lastLoginTime,
  winLoseList,
  activeWalletLabel
} = useUserInfo()
const { commonResult } = useCommonImg()
const { memberImg } = useSiteImg()
const { handleOpenLiveChat } = useLiveChat()
const { isTelegramMiniApp, closeMiniApp } = useTelegram()
const { showWithdrawalPassword, isCash, betLimitEnabled } = useEnv()
const { envInfo, isVipRewardsOpen } = useEnvInfoStore()
const { handleLogout } = useAuth()

const showAIAgent = computed(() => envInfo.ai_agent)

watch(
  activeWalletCurrencyId,
  (newVal, oldVal) => {
    handleGetBetLimitStatus(newVal)
  },
  { immediate: true }
)

const showMoreBtn = computed(() => winLoseList.value && winLoseList.value.length > 5)
const genWinLoseList = computed<Response.UserBetHistoryTotalItem[]>(() =>
  winLoseList.value
    .map((item) => ({
      ...item,
      isPositive: item.win_loss_amount && !item.win_loss_amount.startsWith("-")
    }))
    .slice(0, 5)
)
const { onlineTime } = useOnlineTime(lastLoginTime)

onMounted(async () => {
  getUserKycStatus()
  getUserBetHistoryTotal()
  if (!betRestrictionDatetimeSetted.value) {
    await handleGetPreferencesExclusion()
  }
})

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })

  if (isTelegramMiniApp.value) closeMiniApp()

  $q.notify({
    type: "positive",
    message: t("common.alarm.logoutSuccess"),
    position: "top",
    timeout: 1000
  })
}

const eventbus = injectStrict(EventBusKey)
function getMore() {
  console.log("more")
  eventbus.emit("openWinLoseDialog", true)
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/button.scss";
@import "app/template/bmm_set_obtd/assets/css/member.scss";

.profile-pc {
  width: 61.25rem;
  height: 100%;
  padding: 4.375rem 3.125rem 1.875rem;
  .profile-header {
    @apply w-full flex justify-between items-center;
    .title-img {
      width: 10.5625rem;
      height: auto;
    }
    .top-btn {
      @include btn-common;
      .q-icon {
        margin-right: 5px;
        font-size: 1.25rem;
      }
      img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
    }
    .btn-kyc {
      margin-left: 10px;
      background: none !important;
      border: 2px solid #747a8c;
      line-height: 0;
      color: #747a8c !important;
    }
  }
  .profile-body {
    @apply w-full flex justify-between items-center flex-wrap  gap-10;
    margin-top: 1.5625rem;
    background: transparent;
    box-shadow: none;
    .section {
      @apply flex justify-between items-start flex-col;
      width: 26.25rem;
      min-height: 8rem;
      border: 0.125rem solid $border-pale-gray-color;
      border-radius: 0.875rem;
      padding: 1.5625rem;

      .title {
        @apply w-full flex justify-start items-center;
        color: $primary-color;
        font-family: OpenSans;
        .q-icon {
          font-size: 2rem;
        }
        span {
          margin-left: 0.5625rem;
          font-size: 1.5rem;
          line-height: 1.2;
          font-weight: 860;
        }
      }
      .title-tip {
        padding-left: 2.5625rem;
        font-family: PingFangTC;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        vertical-align: middle;
        color: #e02916;
        height: 22px;
      }
      .content {
        @apply w-full flex justify-end mt-[.625rem];
        .btn-setup {
          @include btn-common;
        }
      }
    }

    .profile-infos {
      @apply flex justify-between items-center flex-row;
      width: 100%;
      min-height: 4.625rem;
      padding: 0;

      .infos-wrapper {
        @apply flex flex-row items-center flex-1;
        border: 0.125rem solid $border-pale-gray-color;
        border-radius: 0.875rem;
        padding: 0.625rem;
        overflow: hidden;

        .infos-box {
          @apply flex flex-col ml-3;
          flex: 1;

          label {
            @apply mr-1;
            word-break: keep-all;
          }

          .win-lose-list-wrapper {
            @apply flex flex-row;

            .win-lose-list {
              @apply flex;
              flex: 1;
              flex-wrap: wrap;
              margin-top: -0.625rem;
            }

            .more-wrapper {
              .btn-more {
                @include btn-common;
                width: auto;
                min-width: auto;
              }
            }
          }
        }
      }

      .btn-logout {
        @apply ml-4 font-light;
        border-radius: 0.5rem;
        font-size: 0.875rem;
      }
    }
  }
}

.profile-h5 {
  .info-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-flow: row;
    padding: 0.5rem 0px;
    @include phone-width {
      padding: 0.25rem 0px;
    }
    .q-btn {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      .icon-service {
        @include useProfileIcon;
        display: inline-block;
        width: 48px;
        height: 44px;
        margin: 0px;
        background-position-x: -179.2px;
        @include phone-width {
          width: 26.4554px;
          height: 24.25px;
          background-position-x: -100.333px;
        }
      }
      .icon-mail {
        @include useProfileIcon;
        display: inline-block;
        width: 48px;
        height: 44px;
        margin: 0px;
        background-position-x: -246.154px;
        @include phone-width {
          width: 26.4554px;
          height: 24.25px;
          background-position-x: -137.821px;
        }
      }
    }
  }
  .info-container {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .info-content {
      padding-left: 2rem;
      h3 {
        font-size: 2.5rem;
        line-height: 3.5rem;
        color: $text-charcoal-gray-color-light;
        padding-bottom: 0.625rem;
        display: inline;
      }
      p {
        font-size: 1.5rem;
        line-height: 2rem;
        color: $text-sky-gray-color;
        display: flex;
        align-items: center;
      }
    }

    .mobile-kyc-btn {
      @apply py-[.25rem] ml-[1rem] mb-[.25rem];
      background: none !important;
      border: 1px solid #747a8c;
      line-height: 0;
      min-height: auto;
      font-size: 11px;
      color: #747a8c;
      img {
        width: 1rem;
        margin-right: 0.25rem;
      }
    }

    @include phone-width {
      margin-top: 0.875rem;
      .info-content {
        padding-left: 1rem;
        h3 {
          font-size: 1.25rem;
          line-height: 1.75rem;
          padding-bottom: 0.3125rem;
        }
        p {
          font-size: 0.875rem;
          line-height: 1rem;
        }
      }
      .btn-profile-detail {
        :deep(.q-icon) {
          font-size: 1rem;
          font-weight: bold;
        }
      }
    }
  }
  .wallet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    flex-direction: row;
    height: 5rem;
    color: $text-warm-gold-color;
    margin: 3.125rem 1.625rem 0;
    padding: 0px 1.75rem;
    background-image: url("app/template/bmm_set_obtd/assets/images/member/wallet-bar.webp");
    background-repeat: no-repeat;
    background-size: cover;
    .wallet-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-flow: row;
      .icon-wallet {
        @include useProfileIcon;
        width: 2.5rem;
        height: 2.5rem;
        background-position-x: -120.123px;
      }
      .text {
        font-size: 1.75rem;
        padding: 0px 0.75rem;
        text-transform: capitalize;
      }
      .currency {
        font-size: 2rem;
      }
      .balance {
        font-weight: 700;
        font-size: 2.5rem;
        padding-right: 0.75rem;
      }
      .btn-refresh {
        padding: 4px;
        color: $text-gray-color;
        :deep(.q-icon) {
          font-size: 1.75rem;
        }
        &.active {
          animation: 0.3s linear 0s 1 normal forwards running reFreshAni;
        }
      }
    }
    @include phone-width {
      height: 40px;
      margin: 1.75rem 0.875rem 0;
      padding: 0.9375rem;
      .wallet-content {
        .icon-wallet {
          width: 20px;
          height: 20px;
          background-position-x: -67.2564px;
        }
        .text {
          font-size: 0.875rem;
          padding: 0px 0.375rem;
        }
        .currency {
          font-size: 1rem;
        }
        .balance {
          font-size: 1.25rem;
          padding-right: 0.375rem;
        }
        .btn-refresh {
          :deep(.q-icon) {
            font-size: 0.875rem;
          }
        }
      }
    }
  }
  .wallet-body {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-flow: row;
    padding: 0px 4.25rem 0px 3.375rem;
    height: 10rem;
    background: $background-light-color;
    border: 0.5px solid $border-light-color;
    box-shadow: rgba($box-shadow-soft-blue-gray-color, 0.12) 0px 4px 10px,
      rgba($box-shadow-light-color, 0.8) 0px 2px 2px inset;
    border-radius: 10px;
    .wallet-body-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-flow: row;
      .icon-deposit {
        @include useProfileIcon;
        width: 8.375rem;
        height: 8.375rem;
        background-position-x: -391.877px;
      }
      .icon-withdrawal {
        @include useProfileIcon;
        width: 8.375rem;
        height: 8.375rem;
        background-position-x: -545.477px;
      }
      .title {
        font-weight: 500;
        font-size: 2rem;
        line-height: 2.75rem;
        color: $text-charcoal-gray-color-light;
        padding-bottom: 0.5rem;
      }
      .sub-title {
        font-family: "DIN Alternate";
        font-weight: 700;
        font-size: 1.25rem;
        line-height: 1.5rem;
        color: $text-sky-gray-color;
        text-transform: uppercase;
      }
    }
    .divider {
      width: 1px;
      height: 5rem;
      background-color: $background-pale-gray-color;
    }
    @include phone-width {
      padding: 0px 2rem 0px 1rem;
      height: 5rem;
      .wallet-body-content {
        .icon-deposit {
          width: 4.25rem;
          height: 4.25rem;
          background-position-x: -219.41px;
        }
        .icon-withdrawal {
          width: 4.25rem;
          height: 4.25rem;
          background-position-x: -305.41px;
        }
        .title {
          font-size: 1.0625rem;
          line-height: 1.375rem;
          padding-bottom: 0.25rem;
        }
        .sub-title {
          font-size: 0.6875rem;
          line-height: 0.75rem;
        }
      }
      .divider {
        height: 2.5rem;
      }
    }
  }
  .infos-body {
    padding: 0px 4.25rem 0px 3.375rem;
    background: $background-light-color;
    border: 0.5px solid $border-light-color;
    box-shadow: rgba($box-shadow-soft-blue-gray-color, 0.12) 0px 4px 10px,
      rgba($box-shadow-light-color, 0.8) 0px 2px 2px inset;
    border-radius: 10px;
    margin-top: 1.25rem;
    padding: 0.625rem;

    .infos-wrapper {
      @apply flex flex-row flex-nowrap;
      align-items: flex-start;

      .win-lose-list-wrapper {
        @apply flex flex-row flex-nowrap;

        .win-lose-list {
          @apply flex flex-row flex-wrap;
          flex: 1;
          margin-top: -0.5rem;
        }
      }
    }

    .more-wrapper {
      margin-top: 0.625rem;
      width: 100%;

      .btn-more {
        @include btn-common;
        width: 100%;
        min-width: 100%;
      }
    }
  }
  .menu-list {
    margin-top: 1.25rem;
    list-style: none;
    background: $background-light-color;
    border: 0.5px solid $border-light-color;
    box-shadow: rgba($box-shadow-soft-blue-gray-color, 0.12) 0px 4px 10px,
      rgba($box-shadow-light-color, 0.8) 0px 2px 2px inset;
    border-radius: 10px;
    .menu-item {
      width: 100%;
      padding: 1.625rem 0px 1.625rem 1.5rem;
      :deep(.q-btn__content) {
        justify-content: space-between;
        .icon-first {
          font-size: 2.5rem;
        }
        .menu-content {
          display: flex;
          flex-flow: wrap;
          justify-content: space-between;
          flex: 1 1 0%;
          font-size: 1.75rem;
          line-height: 2.5rem;
          color: $text-steel-blue-color;
          padding-left: 1.25rem;
          text-transform: capitalize;
          font-weight: 400;
          text-align: left;
          .sub-text {
            font-size: 1.5rem;
            color: $text-sky-gray-color;
          }
          .icon-gift {
            @include useProfileIcon;
            width: 2.5rem;
            height: 2.5rem;
            background-position-x: -61.0462px;
          }

          .menu-content-value {
            text-align: left;
            font-family: PingFang TC;
            font-weight: 400;
            font-size: 12px;
            line-height: 17px;
            line-height: 100%;
            vertical-align: middle;
            text-transform: capitalize;
            color: #e02916;
          }
        }
        .icon-vip {
          @include useVipIcon;
          width: 2.5rem;
          height: 2.5rem;
        }
        .icon-last {
          margin-right: 0.75rem;
          font-size: 2.5rem;
          color: $text-sky-gray-color;
          font-weight: 600;
        }
      }
    }
    .q-separator {
      margin-left: 5.75rem;
      margin-right: 1.75rem;
      height: 2px;
      background-color: $background-pale-gray-color;
    }
    @include phone-width {
      margin-top: 1.25rem;
      .menu-item {
        padding: 0.8125rem 0px 0.8125rem 0.75rem;
        :deep(.q-btn__content) {
          .icon-first {
            font-size: 1.25rem;
          }
          .menu-content {
            font-size: 0.875rem;
            line-height: 1.25rem;
            padding-left: 0.625rem;
            .sub-text {
              font-size: 0.75rem;
            }
            .icon-gift {
              @include useProfileIcon;
              width: 1.25rem;
              height: 1.25rem;
              background-position-x: -34.1795px;
            }
          }
          .icon-vip {
            @include useVipIcon;
            width: 1.25rem;
            height: 1.25rem;
          }
          .icon-last {
            margin-right: 0.375rem;
            font-size: 1.25rem;
          }
        }
      }
      .q-separator {
        margin-left: 2.875rem;
        margin-right: 0.875rem;
        height: 1px;
      }
    }
  }
}
</style>
