<template>
  <HeaderTitleBack titleI18n="menu.jointVentureAgent" variant="redBlack">
    <div class="mobile-collaboration-wrapper">
      <div class="collaboration-banner">
        <q-img v-if="collaborationState.banner" fit="fill" :src="collaborationState.banner" />
        <!-- <q-img v-else fit="fill" :src="proxyImg('banner.png')" /> -->
      </div>
      <div class="collaboration-main">
        <div class="content-title">
          <div class="agent-details">
            <span class="agent">{{ $t("menu.jointVenture") }}</span>
            <span class="details">{{ $t("menu.plan") }}</span>
            <q-btn
              round
              color="primary"
              icon="question_mark"
              size="xs"
              class="ml-1 hide-hover !text-[#980300]"
              @click="dialog = true"
            />
          </div>
        </div>
        <!-- Currency select -->
        <div class="currency-select">
          <span class="statistics">{{ $t("common.btn.currency") }}</span>
          <q-btn-dropdown
            rounded
            :label="collaborationCurrencyCode"
            menu-anchor="bottom middle"
            menu-self="bottom middle"
            :loading="isLoading"
          >
            <q-list>
              <q-item
                v-for="item in currencyDropdown"
                :key="item.value"
                clickable
                v-close-popup
                @click="changeCurrency(item)"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <!-- Summary -->
        <div class="collaboration-summary-wrapper">
          <div class="collaboration-summary">
            <div class="summary-item">
              <div class="summary-item-title">{{ $t("collaboration.active_members_this_period") }}</div>
              <div class="summary-item-value">
                <span class="value"> {{ moneyFormat(collaborationState.active_member_count) }} </span>
                <!-- <q-badge color="red-achieve"> 未達成 </q-badge> -->
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-item-title">{{ $t("collaboration.total_valid_bet_amount_this_period") }}</div>
              <div class="summary-item-value">
                <span class="value"> {{ moneyFormat(collaborationState.valid_bet_amount) }} </span>
                <!-- <q-badge color="green-achieve"> 達成 </q-badge> -->
              </div>
            </div>
          </div>
        </div>
        <!-- Referral Code -->
        <div class="referral-code-wrapper">
          <span class="referral-code-title">{{ $t("menu.referralCode") }}</span>
          <div class="referral-code-button" @click="copyMessage(collaborationState.referral_code)">
            <span>{{ collaborationState.referral_code }}</span>
            <i class="fa-solid fa-copy"></i>
          </div>
        </div>
        <!-- Search content -->
        <q-tab-panels v-model="activeTab" class="collaboration-tab-panels mt-5">
          <q-tab-panel name="invite">
            <MobileInviteSearchContent :wallet-dropdown="currencyDropdown" />
          </q-tab-panel>
          <q-tab-panel name="commission">
            <MobileCommissionSearchContent :wallet-dropdown="currencyDropdown" />
          </q-tab-panel>
        </q-tab-panels>
        <!-- Tabs -->
        <div class="collaboration-tabs">
          <q-tabs v-model="activeTab" align="left">
            <q-tab name="invite" :label="$t('collaboration.invitation_details')" />
            <q-tab name="commission" :label="$t('collaboration.commission_details')" />
          </q-tabs>
        </div>
        <!-- Tables -->
        <q-tab-panels v-model="activeTab" class="collaboration-tab-panels mt-4">
          <q-tab-panel name="invite">
            <MobileInviteList />
          </q-tab-panel>
          <q-tab-panel name="commission">
            <MobileCommissionList />
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <FooterNav />
    </div>
  </HeaderTitleBack>

  <q-dialog v-model="dialog" persistent>
    <q-card class="mobile-collaboration-dialog">
      <q-card-section class="flex items-center p-0">
        <p class="pl-5 pt-3 text-base font-bold">{{ collaborationState.title }}</p>
        <q-space />
        <q-btn class="text-xs hide-hover" icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="pt-0 mt-[.625rem] px-6 h-[90%] overflow-y-auto text-[#FFFFFFCC]">
        <div v-html="collaborationState.detail"></div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useSiteImg } from "app/template/okbet_redBlack/hooks/useSiteImg"
import { useCommon } from "src/common/hooks/useCommon"
import { useCollaboration } from "src/common/composables/useCollaboration"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import FooterNav from "app/template/okbet_redBlack/components/Footer/FooterNav.vue"
import MobileInviteList from "./Components/MobileInviteList.vue"
import MobileInviteSearchContent from "./Components/MobileInviteSearchContent.vue"
import MobileCommissionList from "./Components/MobileCommissionList.vue"
import MobileCommissionSearchContent from "./Components/MobileCommissionSearchContent.vue"

const {
  isLoading,
  currencyDropdown,
  collaborationCurrencyCode,
  changeCurrency,
  collaborationState,
  handleGetCollaboration,
  initCollaborationCurrency
} = useCollaboration()
const { proxyImg } = useSiteImg()
const { copyMessage, moneyFormat } = useCommon()

const activeTab = ref("invite")
const dialog = ref(false)

onMounted(async () => {
  await initCollaborationCurrency()
  await handleGetCollaboration()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_redBlack/assets/css/_variable.sass";
@import "app/template/okbet_redBlack/assets/css/button.scss";

.mobile-collaboration-wrapper {
  @apply px-[.75rem];

  .collaboration-banner {
    @apply mt-3;
    .q-img {
      @apply rounded-[.4rem];
    }
  }

  .collaboration-main {
    @apply mt-[1.375rem];
  }

  .agent-details {
    @apply flex text-base font-bold;
    color: $text-night-sky-color;
    .details {
      @apply ml-1;
    }
  }

  .currency-select {
    @apply flex flex-col gap-2 mt-[.625rem];

    .statistics {
      @apply text-xs font-semibold;
      color: #fff4f4;
    }

    :deep(.q-btn-dropdown) {
      @apply w-[7.9375rem] h-[2rem] mt-[.5rem];
      background: #ffffff;
      color: black;
    }
  }

  .collaboration-summary {
    @apply flex flex-nowrap  gap-2 px-[.375rem] mt-[.875rem];

    .summary-item {
      @apply flex flex-col gap-1 items-center justify-center;
      @apply w-1/2 h-[3.375rem] pt-[.625rem] pb-[.4375rem] rounded-[3.125rem];
      background: $primary-red02;
      color: $white-color;

      @include iphone-width {
        @apply h-auto;
      }

      .summary-item-title {
        @apply font-bold text-xs;
        @include iphone-width {
          max-width: 8.75rem;
          white-space: normal;
          word-wrap: break-word;
        }
      }

      .summary-item-value {
        @apply flex items-center gap-2;
        .value {
          font-size: 0.875rem;
          line-height: 1.0731rem;
          font-weight: 700;
        }
        .q-badge {
          @apply px-[.3125rem] py-[.125rem] rounded-[31.25rem] font-bold;
          font-size: 0.625rem;
          line-height: 0.8512rem;
          &.bg-red-achieve {
            background: $background-danger-color-quaternary;
          }
          &.bg-green-achieve {
            background: $background-success-color-tertiary;
          }
        }
        @include iphone-width {
          max-width: 8.75rem;
          white-space: normal;
          word-wrap: break-word;
        }
      }
    }
  }

  .referral-code-wrapper {
    @apply flex flex-col items-center mt-[2rem];

    .referral-code-title {
      @apply flex text-[1rem] font-semibold;
      color: #fafafa;
    }

    .referral-code-button {
      @apply flex w-[18.75rem] h-[3rem] items-center justify-between rounded-[.625rem] mt-[0.5rem];
      @apply px-[1.25rem] cursor-pointer;
      background: $white-color;
      color: $black-color;
      i {
        color: $primary-red02;
      }
    }
  }

  .collaboration-tabs {
    @apply flex items-center gap-6 mt-[1.7813rem] px-[.375rem];

    :deep(.q-tab) {
      @apply w-auto h-[2.375rem] min-h-[2.375rem] px-[1.5rem] capitalize rounded-[3.125rem] mr-6;
      background: $primary-red01;
      color: $white-color;

      @include iphone-width {
        @apply max-w-[12.5rem] flex-wrap h-auto;
        white-space: normal;
        word-wrap: break-word;
        line-height: 1.2;
      }
    }

    :deep(.q-tab--active) {
      background: $primary-red02;
      color: $white-color;
    }

    :deep(.q-tab__indicator) {
      display: none;
    }

    :deep(.q-tab__content) {
      min-height: 2.375rem;
    }

    :deep(.q-tab__label) {
      @apply text-base;
      font-weight: 700;
    }
  }

  .collaboration-tab-panels {
    @apply bg-transparent px-[.375rem];

    :deep(.q-panel) {
      @apply overflow-visible;
    }

    :deep(.q-tab-panel) {
      @apply p-0;
    }
  }
}

.mobile-collaboration-dialog {
  width: 100%;
  height: 80vh;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: $primary-red01;
  color: $white-color;
}
</style>
