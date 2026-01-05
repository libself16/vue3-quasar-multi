<template>
  <template v-if="$q.platform.is.mobile">
    <HeaderTitleBack variant="red" title-i18n="menu.memberCenter" qCardClass="!overflow-y-hidden">
      <div class="member-layout-h5">
        <div class="profile-h5">
          <div class="info-header">
            <q-btn flat @click="handleOpenLiveChat">
              <q-img :src="svgIcon('service-white')" loading="lazy" class="icon-service"></q-img>
            </q-btn>
            <q-btn flat :to="{ name: 'memberInbox' }">
              <q-img :src="svgIcon('mail-white')" loading="lazy" class="icon-mail"></q-img>
            </q-btn>
          </div>
          <div class="info-container">
            <div class="flex items-center">
              <Avatar />
              <div class="flex flex-col">
                <div v-if="isKycEnabled">
                  <q-btn class="mobile-kyc-btn" rounded flat :to="{ name: 'MemberKyc' }">
                    <template v-if="userInfo2.approval_status">
                      <img :src="commonResult('kyc/v2_approved.png')" />
                      KYC {{ $t("member.kyc.status_success") }}
                    </template>
                    <template v-else>
                      <img :src="commonResult('kyc/v2_rejected.png')" />
                      KYC {{ $t("member.kyc.status_unverified") }}
                    </template>
                  </q-btn>
                </div>
                <div class="info-content" @click="router.push({ name: 'memberProfileDetail' })">
                  <h3>{{ userInfo2.nickname || userInfo2.fullname }}</h3>
                  <p>{{ $t("member.register.username") }}: {{ userInfo2.account }}</p>
                </div>
              </div>
            </div>
            <q-btn
              flat
              icon="arrow_forward_ios"
              :to="{ name: 'memberProfileDetail' }"
              class="btn-profile-detail"
            ></q-btn>
          </div>
          <div class="wallet-header">
            <div class="wallet-content">
              <q-img :src="svgIcon('wallet')" loading="lazy" class="icon-wallet"></q-img>
              <span class="text">{{ $t("member.profile.totalBalances") }}</span>
            </div>
            <div class="wallet-content">
              <span class="currency mr-2">{{ activeWalletLabel }}</span>
              <span v-if="inUseWallet" class="balance">
                {{ formatWalletBalance(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0") }}
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
              <q-img :src="svgIcon('deposit')" loading="lazy" class="icon-deposit"></q-img>
              <p class="title">{{ $t("common.btn.cash_in") }}</p>
            </router-link>
            <div class="divider"></div>
            <router-link :to="{ name: 'MemberWithdrawal' }" class="wallet-body-content">
              <q-img :src="svgIcon('withdraw')" loading="lazy" class="icon-withdrawal"></q-img>
              <p class="title">{{ $t("menu.withdrawal") }}</p>
            </router-link>
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
            <q-btn
              class="menu-item"
              flat
              :to="{ name: 'memberChangeWithdrawalPassword' }"
              v-if="showWithdrawalPassword"
            >
              <q-icon name="las la-lock" class="icon-first"></q-icon>
              <div class="menu-content">
                <div>{{ $t("member.profile.withdrawalPassword") }}</div>
              </div>
              <q-icon name="navigate_next" class="icon-last"></q-icon>
            </q-btn>
            <q-separator v-if="showWithdrawalPassword" />
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
                <!-- <i class="icon-gift"></i> -->
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
                  {{ $t("member.profile.responsible") }} | {{ $t("member.profile.TC") }} |
                  {{ $t("member.profile.privacy") }}
                </div>
              </div>
              <q-icon name="navigate_next" class="icon-last"></q-icon>
            </q-btn>
            <q-separator />
          </div>
          <FooterNav />
        </div>
      </div>
    </HeaderTitleBack>
  </template>

  <div v-else class="profile-pc">
    <div class="profile-header">
      <h2 class="profile-header-title">{{ $t("menu.profile") }}</h2>
      <div>
        <q-btn rounded flat icon="mail" class="top-btn" :to="{ name: 'memberInbox' }"></q-btn>
        <q-btn v-if="isKycEnabled" rounded flat class="top-btn btn-kyc" :to="{ name: 'MemberKyc' }">
          <template v-if="userInfo2.approval_status">
            <img :src="commonResult('kyc/v2_approved.png')" />
            KYC {{ $t("member.kyc.status_success") }}
          </template>
          <template v-else>
            <img :src="commonResult('kyc/v2_rejected.png')" />
            KYC {{ $t("member.kyc.status_unverified") }}
          </template>
        </q-btn>
      </div>
    </div>

    <q-card class="profile-body">
      <!-- profile detail -->
      <q-card-section class="section">
        <div class="title">
          <q-icon name="fa-regular fa-circle-user" />
          <span>{{ $t("member.profile.personalInformation") }}</span>
        </div>
        <div class="content">
          <q-btn rounded flat :to="{ name: 'memberProfileDetail' }" class="btn-setup">Set up</q-btn>
        </div>
      </q-card-section>
      <template v-if="!isTelegramMiniApp">
        <!-- change login password -->
        <q-card-section class="section">
          <div class="title">
            <q-icon name="key" />
            <span>{{ $t("member.profile.loginPassword") }}</span>
          </div>
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
        <div class="content">
          <q-btn
            rounded
            flat
            class="btn-setup"
            color="primary"
            text-color="black"
            :to="{ name: 'memberChangeWithdrawalPassword' }"
            >{{ $t("common.btn.setUp") }}</q-btn
          >
        </div>
      </q-card-section>
    </q-card>
  </div>
  <!-- 給修改密碼用 -->
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/okbet_red/hooks/useSiteImg"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useBank } from "src/common/composables/useBank"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { useRouter } from "vue-router"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useEnv } from "src/common/hooks/useEnv"
import { useEnvInfoStore } from "src/stores/envStore"
import Avatar from "./components/Avatar.vue"
import FooterNav from "../../components/Footer/FooterNav.vue"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useSiteWallet } from "app/template/okbet_red/hooks/useSiteWallet"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"

const router = useRouter()
const { moneyFormat } = useCommon()
const { userInfo2, inUseWallet, getUserWalletList, isLoading, isKycEnabled, activeWalletLabel } = useUserInfo()
const { commonResult } = useCommonImg()
const { memberImg, svgIcon } = useSiteImg()
const { handleOpenLiveChat } = useLiveChat()
const { isTelegramMiniApp } = useTelegram()
const { showWithdrawalPassword, isCash } = useEnv()
const { formatWalletBalance } = useSiteWallet()
const { isVipRewardsOpen } = useEnvInfoStore()
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_red/assets/css/_variable.sass";
@import "app/template/okbet_red/assets/css/button.scss";
@import "app/template/okbet_red/assets/css/member.scss";

.profile-pc {
  max-width: 61.25rem;
  height: 100%;
  padding: 4.375rem 3.125rem 1.875rem;
  .profile-header {
    @apply w-full flex justify-between items-center;

    .profile-header-title {
      font-family: NotoSansTC;
      font-weight: 800;
      font-size: 3.125rem;
      line-height: 100%;
      color: #fff4f4;
    }

    .top-btn {
      background: #d45d5d;
      color: #ffffff;
      min-width: 5.375rem;
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
      border: 2px solid #d45d5d;
      line-height: 0;
    }
  }
  .profile-body {
    @apply w-full flex justify-between items-center flex-wrap  gap-10 bg-transparent;
    margin-top: 1.5625rem;
    box-shadow: none;

    .section {
      @apply flex justify-between items-start flex-col;
      width: 26.25rem;
      min-height: 8rem;
      border: 2px solid $border-pale-gray-color;
      border-radius: 0.875rem;
      padding: 1.5625rem;
      .title {
        @apply w-full flex justify-start items-center;
        color: #ffffffa6;
        font-family: OpenSans;
        .q-icon {
          font-size: 32px;
        }
        span {
          margin-left: 0.5625rem;
          font-size: 1.5rem;
          line-height: 1.2;
          font-weight: 860;
        }
      }
      .content {
        @apply w-full flex justify-end;
        .btn-setup {
          @include btn-common;
        }
      }
    }
  }
}

.member-layout-h5 {
  @apply fixed top-[5.625rem] right-0 bottom-0 left-0 overflow-auto;
  z-index: 1000;
  height: 100%;
  background: url("app/template/okbet_red/assets/images/member/h5-bg.jpg") center / cover no-repeat $black-color;
  background-position-y: -5rem;
  padding: 0px 1.75rem;
  padding-bottom: 10dvh;
  @include phone-width {
    background-position-y: -2.5rem;
    padding: 0px 0.875rem;
    padding-bottom: 18dvh;
  }

  @include iphone-width {
    @apply top-[2.875rem];
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
        color: #fff4f4;
        display: inline-block;
        width: 48px;
        // height: 44px;
        margin: 0px;
        @include phone-width {
          width: 26.4554px;
          height: 24.25px;
        }
      }
      .icon-mail {
        display: inline-block;
        width: 48px;
        height: 44px;
        margin: 0px;
        @include phone-width {
          width: 26.4554px;
          height: 24.25px;
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

    .btn-profile-detail {
      :deep(.q-icon) {
        color: #fff4f4;
      }
    }

    .mobile-kyc-btn {
      @apply py-[.25rem] ml-[1rem] mb-[.25rem] text-base;
      background: none !important;
      border: 1px solid #fff4f4;
      line-height: 0;
      min-height: auto;
      color: #fff4f4;
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
    @apply flex items-center justify-between flex-nowrap flex-row;
    @apply h-20;
    @apply mt-[3.125rem] mb-0 mx-[1.625rem] px-7 py-0;
    @apply rounded-t-[0.625rem];

    color: $text-warm-gold-color;
    background-image: url("app/template/okbet_red/assets/images/member/wallet-bar.png");
    background-repeat: no-repeat;
    background-size: cover;

    .wallet-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-flow: row;
      .icon-wallet {
        width: 2.5rem;
        height: 2.5rem;
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
        color: #fff4f4;
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
    padding: 0px 3.875rem;
    height: 10rem;
    background: $background-light-color;
    border-radius: 12px;
    .wallet-body-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-flow: row;
      gap: 1.3125rem;
      .icon-deposit {
        width: 5.5rem;
        height: 5.5rem;
      }
      .icon-withdrawal {
        width: 5.5rem;
        height: 5.5rem;
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
      padding: 0px 1.9375rem;
      height: 5rem;
      .wallet-body-content {
        .icon-deposit {
          width: 2.75rem;
          height: 2.75rem;
        }
        .icon-withdrawal {
          width: 2.75rem;
          height: 2.75rem;
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
  .menu-list {
    margin-top: 1.25rem;
    list-style: none;
    background: $background-light-color;
    border-radius: 12px;
    .menu-item {
      width: 100%;
      padding: 1.625rem 0px 1.625rem 1.5rem;
      :deep(.q-btn__content) {
        justify-content: space-between;

        .icon-first {
          font-size: 2.5rem;
          color: #fff4f4;
        }
        .menu-content {
          display: flex;
          flex-flow: wrap;
          justify-content: space-between;
          flex: 1 1 0%;
          font-size: 1.75rem;
          line-height: 2.5rem;
          color: #fff4f4;
          padding-left: 1.25rem;
          text-transform: capitalize;
          font-weight: 400;
          .sub-text {
            font-size: 1.5rem;
            color: #fff4f4;
          }
          .icon-gift {
            @include useProfileIcon;
            width: 2.5rem;
            height: 2.5rem;
            background-position-x: -61.0462px;
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
          color: #fff4f4;
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
