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
              <q-icon name="fa-regular fa-user" size="sm" class="p-1"></q-icon>
              <span class="label">{{ userInfo2.nickname || userInfo2.fullname }}</span>
            </span>
          </div>
          <div class="info-row">
            <span class="info-row-left">
              <q-icon name="las la-wallet" size="md"></q-icon>
              <div v-if="inUseWallet" class="label money">
                <span class="mr-1">{{ activeWalletLabel }}</span>
                <span>{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0", 2) }}</span>
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
            <q-icon v-if="item.icon" :name="item.icon"></q-icon>
            <q-img v-if="item.img" :src="item.img" class="w-7 h-7"></q-img>
            <p
              class="text text-effect-shadow"
              :class="{ 'text-effect-shadow-active': item.activeRoutes.includes(String(route.name)) }"
            >
              {{ $t(item.title) }}
            </p>
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
import FooterArea from "app/template/okbet_blackGold/components/Footer/Index.vue"
import { computed } from "vue"
import { useQuasar } from "quasar"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useRoute } from "vue-router"
import { WALLET_TYPE } from "src/common/utils/constants"
import Avatar from "./components/Avatar.vue"
import { useSiteImg } from "app/template/okbet_blackGold/hooks/useSiteImg"
import { useEnvInfoStore } from "src/stores/envStore"

const { vipImg } = useSiteImg()
const $q = useQuasar()
const route = useRoute()
const { moneyFormat } = useCommon()
const { userInfo2, inUseWallet, getUserWalletList, isLoading, activeWalletLabel } = useUserInfo()
const { isVipRewardsOpen } = useEnvInfoStore()

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
@import "app/template/okbet_blackGold/assets/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/button.scss";
@import "app/template/okbet_blackGold/assets/css/text.scss";

.member-layout {
  &.pc {
    @apply h-full overflow-y-auto mx-auto pt-5 pb-8;
    max-width: 81.25rem;
    min-height: 63rem; // 暫時新增避免會員中心下方空白
    color: $primary-white-color;
    .member-container {
      @apply flex items-stretch mt-5 mx-auto;
      width: 100%;
      border-radius: 1.25rem;
      .member-left {
        @apply h-full flex flex-col items-center mx-2;
        width: 18.75rem;
        border-radius: 1.25rem;
        background-color: $primary-black-color;
        padding: 0.375rem 0px;
        .member-info {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: column;
          padding: 40px 25px 20px;
          .account {
            margin-top: 15px;
            font-weight: 510;
            font-size: 18px;
            line-height: 1.2;
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
                overflow-wrap: break-word;
                min-width: 150px;
                &.money {
                  color: $tertiary-gold-color;
                }
              }
            }
            .btn-refresh {
              padding: 0;
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
          border-top: 1px solid $secondary-gray-color;
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
            color: $primary-white-color;
          }
          .text {
            font-family: OpenSans;
            font-weight: 590;
            color: $primary-white-color;
            margin-left: 15px;
            font-size: 18px !important;
            text-transform: capitalize;
            transition: text-indent 0.5s;
          }
          &.active {
            color: $secondary-gold-color;
            border-left: 0.125rem solid;
            padding-left: 25px;
          }
          &:hover {
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
        background-color: $primary-black-color;
        overflow-y: overlay;
      }
    }
  }
  &.h5 {
    @apply fixed top-0 right-0 bottom-0 left-0 overflow-auto;
    z-index: 1000;
    height: 100%;
    background: url("app/template/okbet_blackGold/assets/images/member/h5-bg.png") center / contain no-repeat
      $primary-text-black;
    background-position-y: -5rem;
    padding: 0px 1.75rem;
    @include phone-width {
      background-position-y: -2.5rem;
      padding: 0px 0.875rem;
    }
  }
}
</style>
