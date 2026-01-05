<template>
  <div v-if="$q.platform.is.mobile" class="member-layout h5">
    <router-view></router-view>
  </div>
  <div v-else class="member-layout pc">
    <div class="member-container">
      <div class="member-left">
        <div class="member-info">
          <Avatar />
          <div class="account">{{ $t("member.register.username") }}: {{ userInfo2.account }}</div>
          <div class="info-row">
            <span class="info-row-left">
              <q-icon name="fa-regular fa-user" size="sm" color="white-2" class="p-1"></q-icon>
              <span class="label">{{ userInfo2.nickname || userInfo2.fullname }}</span>
            </span>
          </div>
          <div class="info-row">
            <span class="info-row-left">
              <q-icon name="las la-wallet" size="md" color="white-2"></q-icon>

              <div v-if="inUseWallet" class="label money">
                <span class="mr-1">{{ activeWalletLabel }}</span>
                <span>{{ formatWalletBalance(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0") }}</span>
              </div>
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
        <q-separator />
        <div class="w-full mt-5">
          <router-link
            v-for="item in menuList"
            :key="item.goRouterName"
            :to="{ name: item.goRouterName }"
            class="menu-item"
            :class="{ active: item.activeRoutes.includes(String(route.name)) }"
          >
            <img v-if="item.img" :src="item.img" alt="" class="w-7 h-7" />
            <q-icon v-if="item.icon" :name="item.icon"></q-icon>
            <p class="text">{{ $t(item.title) }}</p>
          </router-link>
        </div>
      </div>
      <div class="member-right">
        <router-view></router-view>
      </div>
    </div>
  </div>
  <FooterArea v-if="!$q.platform.is.mobile" />
</template>

<script lang="ts">
export default {
  name: "MemberIndex"
}
</script>

<script setup lang="ts">
import FooterArea from "app/template/okbet_red/components/Footer/Index.vue"
import { computed } from "vue"
import { useQuasar } from "quasar"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useSiteImg } from "app/template/okbet_red/hooks/useSiteImg"
import { useRoute } from "vue-router"
import { WALLET_TYPE } from "src/common/utils/constants"
import Avatar from "./components/Avatar.vue"
import { useEnvInfoStore } from "src/stores/envStore"
import { useSiteWallet } from "app/template/okbet_red/hooks/useSiteWallet"

const $q = useQuasar()
const route = useRoute()
const { moneyFormat } = useCommon()
const { userInfo2, inUseWallet, getUserWalletList, isLoading, activeWalletLabel } = useUserInfo()
const { vipImg } = useSiteImg()
const { isVipRewardsOpen } = useEnvInfoStore()
const { formatWalletBalance } = useSiteWallet()

const menuList = computed(() => {
  return [
    {
      title: "menu.profile",
      icon: "fa-regular fa-circle-user",
      goRouterName: "memberProfile",
      activeRoutes: ["memberProfile", "memberProfileDetail", "memberChangePassword"],
      isOpen: true
    },
    {
      title: "vip.vipRewards",
      img: vipImg("icon-route.png"),
      goRouterName: "MemberVip",
      activeRoutes: ["MemberVip"],
      isOpen: isVipRewardsOpen
    },
    {
      title: "menu.deposit",
      icon: "fa-solid fa-money-bills",
      goRouterName: "MemberDeposit",
      activeRoutes: ["MemberDeposit"],
      isOpen: true
    },
    {
      title: "menu.withdrawal",
      icon: "fa-solid fa-wallet",
      goRouterName: "MemberWithdrawal",
      activeRoutes: ["MemberWithdrawal"],
      isOpen: true
    },
    {
      title: "menu.history",
      icon: "fa-solid fa-calendar",
      goRouterName: "history",
      activeRoutes: ["history"],
      isOpen: true
    },
    {
      title: "menu.order",
      icon: "paid",
      goRouterName: "orders",
      activeRoutes: ["orders"],
      isOpen: true
    }
  ].filter((item) => item.isOpen)
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_red/assets/css/_variable.sass";
@import "app/template/okbet_red/assets/css/button.scss";

.member-layout {
  &.pc {
    @apply h-full overflow-y-auto mx-auto pt-5 pb-8;
    max-width: 81.25rem;
    min-height: 63rem; // 暫時新增避免會員中心下方空白
    color: $text-smoke-gray-color;
    .member-container {
      @apply flex items-stretch mt-5 mx-auto;
      width: 100%;
      border-radius: 1.25rem;
      .member-left {
        @apply h-full flex flex-col items-center mx-2;
        width: 18.75rem;
        border-radius: 1.25rem;
        background-color: $background-light-color;
        padding: 0.375rem 0px;
        .member-info {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: column;
          padding: 40px 25px 20px;
          .account {
            font-family: OpenSans;
            margin-top: 15px;
            font-weight: 510;
            font-size: 18px;
            line-height: 1.2;
            color: #fff4f4;
            align-self: flex-start;
            padding-left: 8px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: row;
            width: 100%;
            margin-top: 20px;
            .info-row-left {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              flex-direction: row;
              .label {
                font-family: OpenSans;
                font-weight: 510;
                margin-left: 5px;
                font-weight: 510;
                font-size: 18px;
                line-height: 1.2;
                color: $text-charcoal-gray-color;
                overflow-wrap: break-word;
                min-width: 150px;
                &.money {
                  color: $text-mint-green-color;
                }
              }
            }
            .btn-refresh {
              padding: 0;
              color: #ffffffa6;
              &.active {
                animation: 0.3s linear 0s 1 normal forwards running reFreshAni;
              }
              :deep(.q-icon) {
                font-size: 1.25rem;
              }
            }
          }
        }
        .q-separator {
          height: 1px;
          width: calc(100% - 50px);
          border-top: 1px solid $border-pale-gray-color;
        }
        .menu-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 60px;
          padding-left: 29px;
          cursor: pointer;

          .q-icon {
            font-size: 28px;
            color: #ffffffa6;
          }
          .text {
            font-family: OpenSans;
            font-weight: 590;
            color: #fff4f4;
            margin-left: 15px;
            font-size: 18px !important;
            text-transform: capitalize;
            transition: text-indent 0.5s;
          }
          &.active {
            color: $secondary-color;
            font-weight: 590;
            border-left: 4px solid;
            padding-left: 25px;
            .q-icon {
              color: $secondary-color;
            }
            .text {
              color: $secondary-color;
            }
          }
          &:hover {
            // background: $background-light-color;
            // border-right: 1px solid $border-light-color;
            border-radius: 0px 50px 50px 0px;
            .text {
              text-indent: 15px;
            }
          }
        }
      }
      .member-right {
        @apply items-stretch relative;
        flex: 1 1 0%;
        border-radius: 1.25rem;
        background-color: $background-light-color;
        overflow-y: overlay;
      }
    }
  }
  &.h5 {
    @apply fixed top-0 right-0 bottom-0 left-0 overflow-auto;
    z-index: 1000;
    height: 100%;
    background: url("app/template/okbet_red/assets/images/member/h5-bg.jpg") center / contain no-repeat
      $background-pale-silver-color;
    background-position-y: -5rem;
    padding: 0px 1.75rem;
    @include phone-width {
      background-position-y: -2.5rem;
      padding: 0px 0.875rem;
    }
  }
}
</style>
