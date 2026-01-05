<template>
  <div class="desktop-collaboration-wrapper">
    <div class="collaboration-banner">
      <q-img v-if="collaborationState.banner" fit="fill" :src="collaborationState.banner" />
      <!-- <q-img v-else fit="fill" :src="proxyImg('banner.png')" /> -->
    </div>
    <div class="collaboration-main">
      <div class="content-title">
        <div class="agent-details">
          <span class="agent">{{ $t("menu.jointVenture") }}</span>
          <span class="details">{{ $t("menu.plan") }}</span>
          <q-btn round color="primary" icon="question_mark" size="xs" class="ml-1 hide-hover" @click="dialog = true" />
        </div>
      </div>
      <!-- Currency select -->
      <div class="currency-select">
        <span class="currency-select-title">{{ $t("common.btn.currency") }}</span>
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
        <p class="referral-code-title">{{ $t("menu.referralCode") }}</p>
        <div class="referral-code-button" @click="copyMessage(collaborationState.referral_code)">
          <span>{{ collaborationState.referral_code }}</span>
          <i class="fa-solid fa-copy"></i>
        </div>
      </div>
      <!-- Search content -->
      <q-tab-panels v-model="activeTab" class="proxy-tab-panels mt-[3.125rem]">
        <q-tab-panel name="invite">
          <DesktopInviteSearchContent :wallet-dropdown="currencyDropdown" />
        </q-tab-panel>
        <q-tab-panel name="commission">
          <DesktopCommissionSearchContent :wallet-dropdown="currencyDropdown" />
        </q-tab-panel>
      </q-tab-panels>
      <!--  Tabs -->
      <div class="proxy-tabs">
        <q-tabs v-model="activeTab" align="left">
          <q-tab name="invite" :label="$t('collaboration.invitation_details')" />
          <q-tab name="commission" :label="$t('collaboration.commission_details')" />
        </q-tabs>
      </div>
      <!-- Tables -->
      <q-tab-panels v-model="activeTab" class="proxy-tab-panels mt-10">
        <q-tab-panel name="invite">
          <DesktopInviteTable />
        </q-tab-panel>
        <q-tab-panel name="commission">
          <DesktopCommissionTable />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <q-dialog v-model="dialog" persistent>
    <q-card class="desktop-collaboration-dialog">
      <q-card-section class="flex items-center p-0">
        <p class="pl-[.625rem] pt-[.125rem] text-2xl font-bold">{{ collaborationState.title }}</p>
        <q-space />
        <q-btn class="text-lg hide-hover" icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="pt-0 mt-7 px-[1.625rem] h-4/5 overflow-y-auto">
        <div v-html="collaborationState.detail"></div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useSiteImg } from "app/template/bmm_set_obtd/hooks/useSiteImg"
import { useCommon } from "src/common/hooks/useCommon"
import { useCollaboration } from "src/common/composables/useCollaboration"
import DesktopInviteTable from "./Components/DesktopInviteTable.vue"
import DesktopInviteSearchContent from "./Components/DesktopInviteSearchContent.vue"
import DesktopCommissionTable from "./Components/DesktopCommissionTable.vue"
import DesktopCommissionSearchContent from "./Components/DesktopCommissionSearchContent.vue"

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
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/button.scss";

.desktop-collaboration-wrapper {
  @apply block w-[71.4375rem];
  margin: 1.25rem auto 2.5rem auto;

  @include phone-width {
    display: none;
  }

  .collaboration-banner {
    @apply flex justify-center items-center w-full pt-[3.75rem];
    .q-img {
      @apply rounded-[1.25rem];
    }
  }

  .collaboration-main {
    @apply mt-[7.1875rem];

    .content-title {
      @apply font-extrabold;
    }

    .agent-details {
      @apply text-[1.75rem] flex items-center;
      color: $primary-color;
    }

    .details {
      @apply font-semibold ml-1;
      color: $text-dark-color;
    }
  }

  .currency-select {
    @apply flex flex-col mt-[2.0625rem];

    .currency-select-title {
      @apply text-xl font-semibold;
    }

    :deep(.q-btn-dropdown) {
      @apply w-[12.5rem] h-[3.125rem] mt-3;
      background: $background-pale-silver-color;
    }
  }

  .collaboration-summary {
    @apply flex justify-between mt-10;

    .summary-item {
      @apply flex flex-col items-center justify-center gap-3 w-[35rem] h-[6.25rem];
      background: $primary-color;
      border-radius: 6.25rem;
      color: $text-light-color;

      .summary-item-title {
        @apply font-bold;
        color: rgba($text-light-color, 0.7);
      }
      .summary-item-value {
        @apply flex items-center gap-2;
        .value {
          font-size: 2rem;
          line-height: 2.7237rem;
          font-weight: 700;
        }
        .q-badge {
          @apply px-[.625rem] py-1 rounded-[62.4375rem] font-bold text-sm;
          &.bg-red-achieve {
            background: $background-danger-color-quaternary;
          }
          &.bg-green-achieve {
            background: $background-success-color-tertiary;
          }
        }
      }
    }
  }

  .referral-code-wrapper {
    @apply flex flex-col mt-[3.125rem];

    .referral-code-title {
      @apply text-[1.25rem] font-semibold;
    }

    .referral-code-button {
      @apply flex w-[18.75rem] h-[3rem] items-center justify-between rounded-[.625rem] mt-[1.125rem];
      @apply px-[1.25rem] cursor-pointer;
      background: $secondary-color;
      color: $text-light-color;
    }
  }

  .proxy-tabs {
    @apply flex justify-between mt-[5rem];

    :deep(.q-tab) {
      @apply rounded-[1.5rem] mr-[1.25rem];
      @apply w-auto h-[3.125rem] px-[3.75rem] capitalize;
      border: 1px solid $border-gray-color;
      background: $background-pale-silver-color;
    }

    :deep(.q-tab--active) {
      color: $text-light-color;
      background: $primary-color;
    }

    :deep(.q-tab__indicator) {
      display: none;
    }

    :deep(.q-tab__label) {
      @apply text-xl;
    }
  }

  .proxy-tab-panels {
    @apply bg-transparent;

    :deep(.q-tab-panel) {
      @apply p-0;
    }
  }
}

.desktop-collaboration-dialog {
  width: 100%;
  max-width: 37.5rem;
  height: 35.625rem;
  padding: 1.875rem;
  border-radius: 1.5rem;
  background: $background-light-color;
}
</style>
