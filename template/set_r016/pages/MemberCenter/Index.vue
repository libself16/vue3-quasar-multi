<template>
  <div class="member-center-wrapper">
    <div class="member-center-header">
      <div class="header-top">
        <div class="wallet-content">
          <q-img :src="svgIcon('wallet')" loading="lazy" class="svg-wallet"></q-img>
          <div>
            <div class="wallet-title">{{ $t("member.cash-Wallet") }}</div>
            <div v-if="inUseWallet" class="wallet-value">
              ¥{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance) }}
            </div>
          </div>
        </div>
        <div class="header-btns">
          <q-btn class="header-btn hide-hover" :to="{ name: 'MemberDeposit' }">
            <q-img :src="svgIcon('deposit')" loading="lazy" class="svg-wallet"></q-img>
            <div class="header-btn-text">{{ $t("menu.deposit") }}</div>
          </q-btn>
          <q-btn class="header-btn hide-hover" :to="{ name: 'MemberWithdrawal' }">
            <q-img :src="svgIcon('withdraw')" loading="lazy" class="svg-wallet"></q-img>
            <div class="header-btn-text">{{ $t("menu.withdrawal") }}</div>
          </q-btn>
        </div>
      </div>
      <div class="header-bottom">
        <div class="bottom-box">
          <div class="bottom-box-title">{{ $t("member.referralRebate.latestTotalValidBetAmount") }}</div>
          <div class="bottom-box-value">{{ moneyFormat(shareholderLatest.downline_valid_bet) }}</div>
        </div>
        <div class="bottom-box">
          <div class="bottom-box-title">{{ $t("member.referralRebate.latestTotalRevenueAmount") }}</div>
          <div class="bottom-box-value">{{ moneyFormat(shareholderLatest.commission) }}</div>
        </div>
        <div class="bottom-box bonus-wallet">
          <div class="bottom-box-title">
            <q-img :src="svgIcon('gift-code')" loading="lazy"></q-img>
            {{ $t("member.referralRebate.giftCodeAmount") }}
          </div>
          <div v-if="inUseWallet && inUseWallet[WALLET_TYPE.Enums.Bonus]" class="bottom-box-value">
            <div>
              {{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Bonus].balance) }}
            </div>
            <q-btn class="receive-btn" @click="openBonusDialog"> {{ $t("common.btn.claim") }}</q-btn>
          </div>
        </div>
      </div>
    </div>
    <q-list class="member-center-body">
      <q-expansion-item
        dense
        dense-toggle
        class="function-content hide-hover"
        header-class="function-content-header"
        default-opened
      >
        <template #header>
          <div class="function-content-header-left">
            <q-img :src="svgIcon('my-function')" loading="lazy"></q-img>
            <span class="title">{{ $t("member.my-features") }}</span>
          </div>
        </template>
        <template #default>
          <q-card>
            <q-card-section>
              <template v-for="item in funcBtns" :key="item.routerName">
                <q-btn v-if="item.show" :to="{ name: item.routerName }" class="function-btn hide-hover">
                  <q-img :src="memberCenterIconImage(item.imgFile)" loading="lazy"></q-img>
                  <div class="function-btn-text">{{ $t(item.i18nTitle) }}</div>
                </q-btn>
              </template>
              <template v-for="(cmsItem, cmsIndex) in filterMobileDisplayAndLogin" :key="cmsIndex">
                <q-btn
                  v-if="isWebInformation(cmsItem.Entrance[0].payload.did ?? '')"
                  @click="
                    handleEntranceClick({
                      entrance: cmsItem.Entrance[0]
                    })
                  "
                  class="function-btn hide-hover"
                >
                  <q-img
                    v-if="cmsItem.Setting.icon_path"
                    :src="
                      isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path
                    "
                    loading="lazy"
                  />
                  <span class="function-btn-text">
                    {{ limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string) }}
                  </span>
                </q-btn>
              </template>
            </q-card-section>
          </q-card>
        </template>
      </q-expansion-item>

      <q-item class="member-center-row" clickable @click="handleOpenLiveChat">
        <q-img :src="svgIcon('live-chat')" loading="lazy"></q-img>
        <span class="row-title">{{ $t("member.feedback") }}</span>
      </q-item>
      <!-- Desktop 專用，採用直接點擊跳轉 -->
      <q-item v-if="!isMobile" class="member-center-row" :to="{ name: 'webInformation' }">
        <q-img :src="svgIcon('info')" loading="lazy"></q-img>
        <span class="row-title"> {{ $t("home.about_company", { company: companyName }) }} </span>
      </q-item>
      <!-- Mobile 專用，採用下拉選單邏輯 -->
      <q-list v-if="isMobile" class="member-center-body">
        <q-expansion-item dense dense-toggle class="function-content hide-hover" header-class="function-content-header">
          <template #header>
            <div class="function-content-header-left">
              <q-img :src="svgIcon('info')" loading="lazy" style="width: 1.25rem; height: 1.25rem"></q-img>
              <span class="title"> {{ $t("home.about_company", { company: companyName }) }} </span>
            </div>
          </template>
          <template #default>
            <q-card>
              <ul class="p-2">
                <li v-for="item in webInformationMenuList" :key="item.id">
                  <q-btn
                    align="left"
                    class="w-full"
                    flat
                    @click="router.push({ name: 'webInformation', params: { id: item.id.toString() } })"
                  >
                    {{ item.title }}
                  </q-btn>
                </li>
              </ul>
            </q-card>
          </template>
        </q-expansion-item>
      </q-list>
      <div class="flex items-center justify-center">
        <q-btn class="btn-logout hide-hover" @click="handleLogoutClcik">{{ $t("common.btn.logout") }}</q-btn>
      </div>
    </q-list>
  </div>
  <BaseDialog v-model="dialog" persistent :title="$t('shareholder_platform.redeem_gift_code')" class="bonus-dialog">
    <q-form @submit="bonusTransferFormSubmit" class="bonus-transfer-form">
      <div v-if="inUseWallet && inUseWallet[WALLET_TYPE.Enums.Bonus]" class="bonus-transfer-form-subtitle">
        {{ $t("member.referralRebate.giftCodeAmount") }}：
        {{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Bonus].balance) }}
      </div>
      <q-input
        v-model="bonusAmount"
        :placeholder="$t('shareholder_platform.please_enter_amount')"
        class="form-input w-full"
        rounded
        outlined
        dense
        borderless
        no-error-icon
        hide-bottom-space
      ></q-input>
      <div class="bonus-transfer-form-tip">
        *{{ $t("shareholder_platform.after_redeeming_1x_turnover_will_be_added") }}
      </div>
      <q-btn class="bonus-transfer-form-submit-btn" type="submit" :disable="isLoading">
        <q-img :src="svgIcon('btn-receive')" loading="lazy"></q-img>
        {{ $t("common.btn.claimNow") }}
      </q-btn>
    </q-form>
  </BaseDialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useApi } from "src/common/hooks/useApi"
import { useEnv } from "src/common/hooks/useEnv"
import { useCommon } from "src/common/hooks/useCommon"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useBank } from "src/common/composables/useBank"
import { useReferralWheel } from "src/common/composables/useReferralWheel"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { proxyDisplay } from "src/api/site"
import { useShareholder } from "src/common/composables/useShareholder"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE, LANGUAGE_TYPE, WALLET_TYPE } from "src/common/utils/constants"
import { MENU } from "app/template/set_r016/utils/constants"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEntranceHandler } from "app/template/set_r016/composables/useCms"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import BaseDialog from "app/template/set_r016/components/Dialog/BaseDialog.vue"

const router = useRouter()
const route = useRoute()
const { companyName } = useEnv()
const { moneyFormat } = useCommon()
const { handleOpenLiveChat } = useLiveChat()
const { inUseWallet, accountInfo, activeWalletCurrencyId, isLoading, handleTransferBonusWallet } = useUserInfo()
const { handleLogout } = useAuth()
const { needWithdrawalPassword } = useBank()
const { referralWheelState } = useReferralWheel()
const { svgIcon, memberCenterIconImage } = useSiteImg()
const { fetchLatest, shareholderLatest } = useShareholder()
const { handleCmsList, webInformationMenuList, filterMobileDisplayAndLogin } = useCms()
const { handleEntranceClick } = useEntranceHandler()
const { nowLang } = useLanguage()
const { isMobile } = useMediaQuery()
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"

const funcBtns = computed(() => [
  {
    routerName: "memberProfile",
    imgFile: "profile",
    i18nTitle: "member.profile.personalInformation",
    show: true
  },
  {
    routerName: "memberChangePassword",
    imgFile: "password",
    i18nTitle: "menu.password",
    show: true
  },
  {
    routerName: "memberChangeWithdrawalPassword",
    imgFile: "password",
    i18nTitle: "menu.withdrawalPassword",
    show: needWithdrawalPassword.value
  },
  {
    routerName: "memberInbox",
    imgFile: "inbox",
    i18nTitle: "menu.inbox",
    show: true
  },
  {
    routerName: "memberVip",
    imgFile: "vip",
    i18nTitle: "menu.vip",
    show: true
  },
  {
    routerName: "history",
    imgFile: "history",
    i18nTitle: "menu.history",
    show: true
  },
  {
    routerName: "orders",
    imgFile: "order",
    i18nTitle: "menu.order",
    show: true
  },
  {
    routerName: "promotion",
    imgFile: "promotion",
    i18nTitle: "menu.promotion",
    show: true
  },
  {
    routerName: "ShareholderPlatform",
    imgFile: "shareholder",
    i18nTitle: "menu.shareholder",
    show: proxyDisplayConfig.value?.shareholder_detail
  },
  {
    routerName: "InviteBonus",
    imgFile: "bonus",
    i18nTitle: "menu.invitation_bonus",
    show: true
  },
  {
    routerName: "RouletteGame",
    imgFile: "wheel_reward",
    i18nTitle: "menu.wheel_reward",
    show: referralWheelState.value.status
  }
])

const proxyDisplayConfig = ref<Response.ProxyDisplayConfig>()
const dialog = ref(false)
const bonusAmount = ref("")

const openBonusDialog = () => {
  dialog.value = true
}

const bonusTransferFormSubmit = async () => {
  const amount = Number(bonusAmount.value)

  const payload: Request.PostTransferBonusWallet = {
    amount
  }

  const { status } = await handleTransferBonusWallet(payload)
  if (status) {
    dialog.value = false
    bonusAmount.value = ""
  }
}

const getProxyDisplay = async () => {
  try {
    const { status, data } = await useApi(proxyDisplay)
    if (status && data) {
      proxyDisplayConfig.value = data
    }
  } catch (error) {}
}

const isWebInformation = (type: string) => {
  return MENU.RouterNameMapping[type] !== MENU.RouterNameMapping.website_information
}

const getRouterInfo = (did: string) => {
  return MENU.RouterNameMapping[did]
}

const isActive = (entrance: any) => {
  if (entrance.payload.game_type) {
    return route.params.gameType == entrance.payload.game_type
  }

  return route.name === getRouterInfo(entrance.payload.did)
}

const limitWordLength = (word: string) => {
  if (!word) {
    return ""
  }
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

async function handleLogoutClcik() {
  const { status } = await handleLogout()

  if (status) {
    router.push({ name: "HomePage" })
  }
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.MENU)
  getProxyDisplay()
  fetchLatest(activeWalletCurrencyId.value)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";
@import "app/template/set_r016/assets/css/form.scss";

.member-center-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    @apply px-[.375rem] pb-[.625rem];
    margin: 0;
    margin-bottom: 1.25rem;
  }

  .member-center-header {
    @apply p-10 pb-5 mt-5;
    border-radius: 0.625rem;
    background: $gradient02;

    @include phone-width {
      @apply p-5;
      margin-top: 0.625rem;
    }

    .header-top {
      @apply w-full flex items-center justify-between;

      @include phone-width {
        @apply flex-col items-start;
        gap: 0.625rem;
      }

      .wallet-content {
        @apply flex items-center gap-5;

        .svg-wallet {
          width: 3.75rem;
          height: 3.75rem;
        }

        .wallet-title {
          @include fontStyle(1rem);
          font-weight: 400;
          color: $neutral01;
        }

        .wallet-value {
          @include fontStyle(1.5rem);
          color: $neutral01;
        }
      }

      .header-btns {
        @apply flex justify-center items-center;
        gap: 0.625rem;

        @include phone-width {
          @apply w-full;
        }

        .header-btn {
          @include gradientBtn();
          width: 9.8125rem;
          height: 6.5rem;
          padding: 0.625rem;
          border-radius: 0.625rem;

          @include phone-width {
            width: 100%;
            height: 3.875rem;
            padding: 0.375rem;
          }

          :deep(.q-btn__content) {
            flex-direction: column;
            gap: 0.375rem;

            .q-img {
              width: 3.75rem;
              height: 3.75rem;

              @include phone-width {
                width: 1.875rem;
                height: 1.875rem;
              }
            }

            .header-btn-text {
              @include fontStyle(1rem);
              text-transform: none;

              @include phone-width {
                font-size: 0.75rem;
              }
            }
          }
        }
      }
    }

    .header-bottom {
      @apply flex items-center mt-5 pt-5;
      border-top: 2px solid $primary04;

      @include phone-width {
        @apply justify-center;
        gap: 0.25rem;
      }

      .bottom-box {
        @apply w-1/3 flex flex-col justify-center items-center py-[.625rem] gap-[.375rem];
        border-left: 1px solid $primary04;

        @include phone-width {
          @apply px-1 justify-start;
          width: 30.53vw;
          height: 4.8125rem;

          &:last-of-type {
            width: 25.06vw;
          }
        }

        &:first-of-type {
          border-left: none;
        }

        .bottom-box-title {
          @apply w-full flex items-center justify-center gap-1;
          @include fontStyle(0.875rem);
          color: $primary02;
          white-space: nowrap;

          .q-img {
            width: 1.25rem;
            height: 1.25rem;

            @include phone-width {
              width: 0.75rem;
              height: 0.75rem;
            }
          }

          @include phone-width {
            @include fontStyle(0.625rem, 700, 0.75rem);
            margin-bottom: 0.625rem;
          }
        }

        .bottom-box-value {
          @include fontStyle(2rem);
          color: $neutral01;

          @include phone-width {
            @include fontStyle(0.875rem);
          }
        }

        &.bonus-wallet {
          .bottom-box-title {
            margin-bottom: 0;
          }
          .bottom-box-value {
            @apply flex items-center gap-[.375rem];

            .receive-btn {
              padding: 0.625rem;
              min-height: auto;
              background: $neutral01;
              box-shadow: 0px 0px 10px 0px #00000033;
              border-radius: 0.625rem;

              :deep(.q-btn__content) {
                @include fontStyle(0.875rem, 700, 1rem);
                color: $primary04;
                text-transform: none;
              }
            }

            @include phone-width {
              @apply flex-col;

              .receive-btn {
                padding: 0.25rem 0.9375rem;
                border-radius: 0.25rem;

                :deep(.q-btn__content) {
                  @include fontStyle(0.625rem, 700, 0.6875rem);
                }
              }
            }
          }
        }
      }
    }
  }

  .member-center-body {
    @apply flex flex-col gap-5 mt-5;

    @include phone-width {
      margin-top: 0.625rem;
      gap: 0.625rem;
    }

    .function-content {
      :deep(.function-content-header) {
        @apply justify-between items-center;
        padding: 1.0625rem;
        padding-left: 1.25rem;
        background-color: $primary04;
        border-radius: 0.625rem;
        transition: all 0.5s ease;

        .q-focus-helper {
          display: none;
        }

        .function-content-header-left {
          @apply flex items-center;
          gap: 0.625rem;

          .q-img {
            width: 1.25rem;
            height: 1.25rem;
          }

          .title {
            @include fontStyle(1rem);
            color: $neutral01;
          }
        }

        .q-item__section--side {
          padding: 0;
          .q-expansion-item__toggle-icon {
            color: $neutral01;
            font-weight: 500;
            font-size: 1.625rem;
          }
        }
      }

      :deep(.q-expansion-item__content) {
        .q-card {
          background: transparent;
          border: 1px solid $primary04;
          border-top: none;
          border-radius: 0 0 0.625rem 0.625rem;

          .q-card__section--vert {
            @apply p-5 flex flex-wrap gap-5;

            @include phone-width {
              @apply grid grid-cols-4 gap-[0.75rem] p-[1rem];
            }

            .function-btn {
              @include gradientBtn();
              width: 11rem;
              height: 6.5rem;
              padding: 0.625rem;
              border-radius: 0.625rem;

              @include phone-width {
                width: 100%;
                height: 3.875rem;
                padding: 0.375rem;
              }

              .q-btn__content {
                flex-direction: column;
                gap: 0.375rem;

                .q-img {
                  width: 3.75rem;
                  height: 3.75rem;

                  @include phone-width {
                    width: 1.875rem;
                    height: 1.875rem;
                  }
                }

                .function-btn-text {
                  @include fontStyle(1rem);
                  width: 100%;
                  text-transform: none;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;

                  @include phone-width {
                    font-size: 0.75rem;
                  }
                }
              }
            }
          }
        }
      }

      &.q-expansion-item--expanded {
        :deep(.function-content-header) {
          border-radius: 0.625rem 0.625rem 0 0;
          transition: all 0.1s ease;
        }
      }
    }

    .member-center-row {
      @apply flex items-center p-5;
      gap: 0.625rem;
      background-color: $primary04;
      border-radius: 0.625rem;

      :deep(.q-focus-helper) {
        display: none;
      }

      .q-img {
        width: 1.25rem;
        height: 1.25rem;
      }

      .row-title {
        @include fontStyle(1rem);
        color: $neutral01;
      }
    }

    .btn-logout {
      @include fontStyle();
      width: 18.75rem;
      height: 2.25rem;
      border-radius: 0.625rem;
      box-shadow: $shadow01;
      background-color: $neutral01;
      color: $primary04;

      @include phone-width {
        width: 100%;
      }
    }
  }
}

.bonus-transfer-form {
  @apply flex flex-col gap-[.375rem];

  .bonus-transfer-form-subtitle {
    @include fontStyle(0.875rem, 400, 1rem);
    color: $neutral10;
  }

  .bonus-transfer-form-tip {
    @include fontStyle(0.75rem, 400, 0.875rem);
    color: $primary04;
  }

  .bonus-transfer-form-submit-btn {
    @apply min-h-0 p-[.625rem] rounded-[.625rem] mt-[.875rem];
    background: $gradient01;

    :deep(.q-btn__content) {
      @apply flex-nowrap gap-[.625rem];
      @include fontStyle(0.875rem, 700, 1rem);
      color: $neutral01;
      text-transform: none;

      .q-img {
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  }
}
</style>
