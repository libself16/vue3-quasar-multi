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
        <div class="info-content" @click="router.push({ name: 'memberProfileDetail' })">
          <h3>{{ userInfo.nickname || userInfo.real_name }}</h3>
          <p>{{ $t("member.register.username") }}: {{ userInfo.username }}</p>
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
        <span class="currency mr-1">₱</span>
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
      <div @click="handleRedirectDeposit" class="wallet-body-content">
        <img :src="memberImg('deposit-icon.png')" />
        <div>
          <p class="title">{{ $t("menu.deposit") }}</p>
        </div>
      </div>
      <div class="divider"></div>
      <div @click="handleRedirectWithdrawal" class="wallet-body-content">
        <img :src="memberImg('withdraw-icon.png')" />
        <div>
          <p class="title">{{ $t("menu.withdrawal") }}</p>
        </div>
      </div>
    </div>
    <div class="menu-list">
      <!-- password -->
      <q-btn class="menu-item" flat :to="{ name: 'memberChangePassword' }" v-if="!isMayaLogin">
        <q-icon name="las la-lock" class="icon-first"></q-icon>
        <div class="menu-content">
          <div>{{ $t("member.profile.loginPassword") }}</div>
        </div>
        <q-icon name="navigate_next" class="icon-last"></q-icon>
      </q-btn>
      <q-separator />
      <!-- withdrawal password -->
      <q-btn class="menu-item" flat :to="{ name: 'memberChangeWithdrawalPassword' }" v-if="needWithdrawalPassword">
        <q-icon name="las la-lock" class="icon-first"></q-icon>
        <div class="menu-content">
          <div>{{ $t("member.profile.withdrawalPassword") }}</div>
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
      <!-- information -->
      <q-btn class="menu-item" flat :to="{ name: 'infoCenter' }">
        <q-icon name="las la-info-circle" class="icon-first"></q-icon>
        <div class="menu-content">
          <div>{{ $t("menu.about_us") }}</div>
          <div class="sub-text">
            {{ $t("member.profile.responsible") }} | {{ $t("member.profile.TC") }} | {{ $t("member.profile.privacy") }}
          </div>
        </div>
        <q-icon name="navigate_next" class="icon-last"></q-icon>
      </q-btn>
    </div>
    <FooterNav />
  </div>
  <div v-else class="profile-pc">
    <div class="profile-header">
      <p class="profile-header-title">{{ $t("menu.profile") }}</p>
      <div>
        <q-btn rounded flat icon="mail" class="top-btn" :to="{ name: 'memberInbox' }"></q-btn>
        <q-btn v-if="isMayaLogin == false" rounded flat class="top-btn btn-kyc" :to="{ name: 'MemberKyc' }">
          <img :src="svgIcon('icon_kyc')" />
          {{ $t("member.kyc.kyc_status") }}
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
      <!-- change withdraw password -->
      <q-card-section class="section" v-if="needWithdrawalPassword">
        <div class="title">
          <q-icon name="key" />
          <span>{{ $t("member.profile.withdrawalPassword") }}</span>
        </div>
        <div class="content">
          <q-btn rounded flat class="btn-setup" :to="{ name: 'memberChangeWithdrawalPassword' }">{{
            $t("common.btn.setUp")
          }}</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
  <!-- 給修改密碼用 -->
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useBank } from "src/common/composables/useBank"
import { useCommon } from "src/common/hooks/useCommon"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import { useSiteRedirect } from "app/template/okbet_purple/composables/useSiteRedirect"
import Avatar from "./components/Avatar.vue"
import FooterNav from "../../components/Footer/FooterNav.vue"

const router = useRouter()
const { moneyFormat } = useCommon()
const { userInfo, inUseWallet, getUserWalletList, isLoading } = useUserInfo()
const { memberImg, svgIcon } = useSiteImg()
const { handleOpenLiveChat } = useLiveChat()
const { handleRedirectDeposit, handleRedirectWithdrawal } = useSiteRedirect()
const { isMayaLogin } = useAuth()
const { needWithdrawalPassword } = useBank()
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/button.scss";
@import "app/template/okbet_purple/assets/css/member.scss";

.profile-pc {
  max-width: 61.25rem;
  height: 100%;
  padding: 4.375rem 3.125rem 1.875rem;
  .profile-header {
    @apply w-full flex justify-between items-center;

    .profile-header-title {
      @apply font-extrabold text-[3.125rem];
      color: $text-light-secondary;
    }
    .title-img {
      width: 10.5625rem;
      height: auto;
    }
    .top-btn {
      @include btn-mail-purple;
      .q-icon {
        @apply mr-[.3125rem] text-[1.25rem];
      }
      img {
        @apply w-[1.25rem] h-[1.25rem] mr-[.3125rem];
      }
    }
    .btn-kyc {
      margin-left: 10px;
      background: none !important;
      border: 2px solid;
      line-height: 0;
    }
  }
  .profile-body {
    @apply w-full flex justify-between items-center flex-wrap  gap-10;
    margin-top: 1.5625rem;
    box-shadow: none;
    background-color: $bg-dark-secondary;

    .section {
      @apply flex justify-between items-start flex-col;
      width: 26.25rem;
      min-height: 8rem;
      border: 2px solid $border-dark;
      border-radius: 0.875rem;
      padding: 1.5625rem;
      .title {
        @apply w-full flex justify-start items-center;
        color: $text-light-secondary;
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
          @include btn-common-purple;
        }
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
        @apply w-[3rem] h-[3rem];
        @include useProfileIcon;
        display: inline-block;
        margin: 0px;
        background-position-x: -11.25rem;
        @include phone-width {
          @apply w-[1.625rem] h-[1.5rem];
          background-position-x: -6.25rem;
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
        color: rgb(83, 93, 118);
        padding-bottom: 0.625rem;
        display: inline;
      }
      p {
        font-size: 1.5rem;
        line-height: 2rem;
        color: rgb(167, 178, 196);
        display: flex;
        align-items: center;
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
          color: $text-light-secondary;
        }
        p {
          font-size: 0.875rem;
          line-height: 1rem;
          color: $text-light-secondary;
        }
      }
      .btn-profile-detail {
        :deep(.q-icon) {
          font-size: 1rem;
          font-weight: bold;
          color: $text-light-secondary;
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
    color: rgb(236, 205, 134);
    margin: 3.125rem 1.625rem 0;
    padding: 0px 1.75rem;
    background-image: url("app/template/okbet_purple/assets/images/member/wallet-bar.png");
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
        color: rgb(217, 217, 217);
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
          font-size: 1.5rem;
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
    background: rgb(255, 255, 255);
    border: 0.5px solid rgb(255, 255, 255);
    box-shadow: rgba(148, 161, 200, 0.12) 0px 4px 10px, rgba(255, 255, 255, 0.8) 0px 2px 2px inset;
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
        color: rgb(83, 93, 118);
        padding-bottom: 0.5rem;
      }
      .sub-title {
        font-family: "DIN Alternate";
        font-weight: 700;
        font-size: 1.25rem;
        line-height: 1.5rem;
        color: rgb(167, 178, 196);
        text-transform: uppercase;
      }
    }
    .divider {
      width: 1px;
      height: 5rem;
      background-color: rgb(227, 232, 238);
    }
    @include phone-width {
      padding: 0px 2rem 0px 1rem;
      height: 5rem;
      background: $bg-dark-secondary;
      border: none;
      box-shadow: none;
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
        img {
          margin-right: 1.0625rem;
        }
        .title {
          font-size: 1.0625rem;
          line-height: 1.375rem;
          padding-bottom: 0.25rem;
          color: $text-light-secondary;
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
    background: linear-gradient(153.51deg, rgb(255, 255, 255) 11.31%, rgb(250, 252, 255) 81.44%);
    border: 0.5px solid rgb(255, 255, 255);
    box-shadow: rgba(148, 161, 200, 0.12) 0px 4px 10px, rgba(255, 255, 255, 0.8) 0px 2px 2px inset;
    border-radius: 10px;
    @include phone-width {
      border: none;
      box-shadow: none;
    }
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
          color: rgb(108, 123, 168);
          padding-left: 1.25rem;
          text-transform: capitalize;
          font-weight: 400;
          .sub-text {
            font-size: 1.5rem;
            color: rgb(167, 178, 196);
          }
          .icon-gift {
            @include useProfileIcon;
            width: 2.5rem;
            height: 2.5rem;
            background-position-x: -61.0462px;
          }
        }
        .icon-last {
          margin-right: 0.75rem;
          font-size: 2.5rem;
          color: rgb(167, 178, 196);
          font-weight: 600;
        }
      }
    }
    .q-separator {
      margin-left: 5.75rem;
      margin-right: 1.75rem;
      height: 2px;
      background-color: rgb(227, 232, 238);
    }
    @include phone-width {
      margin-top: 1.25rem;
      background: $bg-dark-secondary !important;
      .menu-item {
        padding: 0.8125rem 0px 0.8125rem 0.75rem;
        :deep(.q-btn__content) {
          i {
            color: $text-light-secondary !important;
          }
          .icon-first {
            font-size: 1.25rem;
          }
          .menu-content {
            font-size: 0.875rem;
            line-height: 1.25rem;
            padding-left: 0.625rem;
            color: $text-light-secondary;
            .sub-text {
              font-size: 0.75rem;
              color: $text-light-secondary !important;
            }
            .icon-gift {
              @include useProfileIcon;
              width: 1.25rem;
              height: 1.25rem;
              background-position-x: -34.1795px;
            }
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
        background-color: $border-dark;
      }
    }
  }
}
</style>
