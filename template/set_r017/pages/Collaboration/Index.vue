<template>
  <div class="collaboration-wrapper">
    <q-img
      v-if="collaborationState.banner"
      fit="fill"
      :src="collaborationState.banner"
      class="collaboration-banner"
      loading="lazy"
    />
    <div class="collaboration-content">
      <div class="collaboration-header">
        <h2 class="collaboration-title">{{ $t("collaboration.title") }}</h2>
        <q-img :src="svgIcon('question-mark')" class="collaboration-info-btn" loading="lazy" @click="dialog = true">
        </q-img>
      </div>
      <div class="collaboration-currency-search">
        <div class="currency-item">
          <div class="form-title">{{ $t("common.btn.currency") }}</div>
          <q-select
            standout
            v-model="collaborationCurrencyId"
            :options="currencyDropdown"
            map-options
            emit-value
            class="form-input"
            dropdown-icon="expand_more"
            rounded
            outlined
            dense
            borderless
            no-error-icon
            hide-bottom-space
            @update:model-value="handleGetCollaboration"
          />
        </div>
        <div class="collaboration-summary-wrapper">
          <div class="collaboration-summary-content">
            <div class="summary-item">
              <div class="summary-item-title">{{ $t("collaboration.active_members_this_period") }}</div>
              <div class="summary-item-value">
                <span class="value"> {{ collaborationState.active_member_count }} </span>
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-item-title">{{ $t("collaboration.total_valid_bet_amount_this_period") }}</div>
              <div class="summary-item-value">
                <span class="value"> {{ collaborationState.valid_bet_amount }} </span>
              </div>
            </div>
          </div>
          <div class="referral-code-content">
            <p class="referral-code-title">{{ $t("collaboration.exclusive_referral_code") }}</p>
            <div class="referral-code-row">
              <div class="referral-code">{{ collaborationState.referral_code }}</div>
              <div class="referral-code-btn">
                <q-img
                  :src="svgIcon('share')"
                  loading="lazy"
                  @click="copyMessage(inviteCodeUrl({ inviteCode: collaborationState.referral_code }))"
                />
                <q-img :src="svgIcon('copy')" loading="lazy" @click="copyMessage(collaborationState.referral_code)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="collaboration-tabs">
        <q-tabs v-model="activeTab" align="left">
          <q-tab name="invite" :label="$t('collaboration.invitation_details')" />
          <q-tab name="commission" :label="$t('collaboration.commission_details')" />
        </q-tabs>
      </div>

      <q-tab-panels v-model="activeTab" class="collaboration-tab-panels">
        <q-tab-panel :name="invite">
          <Invite :wallet-dropdown="currencyDropdown" />
        </q-tab-panel>
        <q-tab-panel :name="commission">
          <Commission :wallet-dropdown="currencyDropdown" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <BaseDialog v-model="dialog" persistent :title="collaborationState.title" max-width="50rem">
    <div v-html="collaborationState.detail"></div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { useCommon } from "src/common/hooks/useCommon"
import { useCollaboration } from "src/common/composables/useCollaboration"
import { useUserInfo } from "src/common/composables/useUserInfo"
import Invite from "./Components/Invite.vue"
import Commission from "./Components/Commission.vue"
import BaseDialog from "app/template/set_r017/components/Dialog/BaseDialog.vue"

const {
  collaborationCurrencyId,
  currencyDropdown,
  collaborationState,
  handleGetCollaboration,
  initCollaborationCurrency
} = useCollaboration()
const { inviteCodeUrl } = useUserInfo()
const { proxyImg, svgIcon } = useSiteImg()
const { copyMessage, moneyFormat } = useCommon()

const invite = "invite"
const commission = "commission"
const activeTab = ref(invite)
const dialog = ref(false)

onMounted(async () => {
  await initCollaborationCurrency()
  await handleGetCollaboration()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";
@import "app/template/set_r017/assets/css/table.scss";
@import "app/template/set_r017/assets/css/form2.scss";

.collaboration-wrapper {
  max-width: 75rem;
  margin: 0 auto;
  padding: 3.75rem 0;

  @include phone-width {
    width: 100vw;
    margin: 0;
    padding: 0.875rem;
  }

  .collaboration-banner {
    @apply w-full h-auto rounded-xl;
    max-width: 75rem;
  }

  .collaboration-content {
    margin-top: 1.5rem;
    color: $neutral01;

    @include phone-width {
      margin-top: 1.25rem;
    }

    .collaboration-header {
      @apply flex items-center gap-1;

      h2 {
        font-family: NotoSans;
        font-weight: 700;
        font-size: 1.75rem;
        line-height: 2.375rem;
        color: $neutral01;
      }

      .collaboration-info-btn {
        width: 1.5rem;
        height: 1.5rem;
        cursor: pointer;
      }
    }

    .collaboration-currency-search {
      @apply mt-6;

      @include phone-width {
        @apply mt-5;
      }

      .currency-item {
        @apply flex items-center gap-3;
        white-space: nowrap;

        @include phone-width {
          .form-input {
            width: 100%;
          }
        }
      }
    }

    .collaboration-summary-wrapper {
      @apply mt-5 flex flex-nowrap gap-10;

      @include phone-width {
        @apply flex-col;
        gap: 0.625rem;
        margin-top: 0.625rem;
      }

      .collaboration-summary-content {
        @apply flex flex-col;
        gap: 0.625rem;
        width: 50%;

        @include phone-width {
          width: 100%;
        }

        .summary-item {
          @apply flex flex-col items-center;
          padding: 0.75rem 0 0.625rem;
          border-radius: 0.625rem;
          background-color: $secondary01;
          border: 1px solid $neutral04;

          @include phone-width {
            padding: 0.75rem;
          }

          .summary-item-title {
            color: $neutral02;
            font-family: NotoSans;
            font-weight: 700;
            font-size: 1rem;
            line-height: 1.375rem;

            @include phone-width {
              font-size: 0.875rem;
              line-height: 1.1875rem;
            }
          }

          .summary-item-value {
            color: $neutral01;
            font-family: NotoSans;
            font-weight: 700;
            font-size: 2rem;
            line-height: 2.75rem;

            @include phone-width {
              font-size: 1.25rem;
              line-height: 1.6875rem;
            }
          }
        }
      }

      .referral-code-content {
        @apply flex flex-col items-center justify-center;
        gap: 1.125rem;
        width: 50%;
        border-radius: 0.625rem;
        border: 1px solid $neutral04;
        background-color: $secondary02;
        padding: 1.25rem 1.9375rem;

        @include phone-width {
          width: 100%;
        }

        .referral-code-title {
          font-family: NotoSans;
          font-weight: 700;
          font-size: 1.25rem;
          line-height: 1.6875rem;
          color: $neutral01;

          @include phone-width {
            font-size: 0.875rem;
            line-height: 1.1875rem;
          }
        }

        .referral-code-row {
          @apply flex flex-none justify-between items-center;
          width: 100%;
          max-width: 18.75rem;
          padding: 0.75rem;
          border-radius: 0.25rem;
          background-color: $secondary06;
          border: 1px solid $neutral04;

          @include phone-width {
            max-width: none;
          }

          .referral-code {
            font-family: NotoSans;
            font-weight: 700;
            font-size: 1rem;
            line-height: 1.375rem;
            color: $neutral01;
          }

          .referral-code-btn {
            @apply flex items-center;
            gap: 0.625rem;

            .q-img {
              width: 1.25rem;
              height: 1.25rem;
              cursor: pointer;
            }
          }
        }
      }
    }

    .collaboration-tabs {
      @apply mt-6 inline-block;
      border-radius: 3.125rem;
      padding: 0.375rem;
      background-color: $secondary06;

      @include phone-width {
        margin-top: 1.25rem;
      }

      .q-tab {
        border-radius: 3.125rem;
        padding: 0.9375rem 1.25rem;
        font-family: NotoSans;
        font-weight: 700;
        text-transform: capitalize;
        color: $neutral01;

        &--active {
          background: $gradient01;
          color: #fff;

          :deep(.q-tab__indicator) {
            @apply h-0;
          }

          :deep(.q-tab__label) {
            @apply font-bold leading-none;
            font-size: 0.9375rem;
          }
        }
      }
    }

    .collaboration-tab-panels {
      @apply mt-4 p-1 flex flex-col gap-10 bg-transparent;

      @include phone-width {
        gap: 1rem;
        padding: 0;

        .q-tab-panel {
          padding: 0;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
