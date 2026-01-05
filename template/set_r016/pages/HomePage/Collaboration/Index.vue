<template>
  <div class="collaboration-wrapper">
    <q-img
      v-if="collaborationState.banner"
      fit="fill"
      :src="collaborationState.banner"
      class="collaboration-banner"
      loading="lazy"
    />
    <BackBtn />
    <div class="collaboration-content">
      <div class="collaboration-header">
        <h2 class="collaboration-title">{{ $t("collaboration.title") }}</h2>
        <q-img :src="svgIcon('question-mark')" class="collaboration-info-btn" loading="lazy" @click="dialog = true">
        </q-img>
      </div>
      <div class="collaboration-currency-search">
        <div class="currency-item">
          <div class="form-title required">{{ $t("common.btn.currency") }}</div>
          <q-select
            standout
            v-model="collaborationCurrencyId"
            :options="currencyDropdown"
            map-options
            emit-value
            class="form-input"
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
                <span class="value"> {{ moneyFormat(collaborationState.active_member_count) }} </span>
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-item-title">{{ $t("collaboration.total_valid_bet_amount_this_period") }}</div>
              <div class="summary-item-value">
                <span class="value"> {{ moneyFormat(collaborationState.valid_bet_amount) }} </span>
              </div>
            </div>
          </div>
          <div class="referral-code-content">
            <p class="referral-code-title">{{ $t("menu.referralCode") }}</p>
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
        <q-btn class="hide-hover" :class="{ active: activeTab === invite }" @click="activeTab = invite">
          {{ $t("collaboration.invitation_details") }}
        </q-btn>
        <q-btn class="hide-hover" :class="{ active: activeTab === commission }" @click="activeTab = commission">
          {{ $t("collaboration.commission_details") }}
        </q-btn>
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
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useCommon } from "src/common/hooks/useCommon"
import { useCollaboration } from "src/common/composables/useCollaboration"
import { useUserInfo } from "src/common/composables/useUserInfo"
import Invite from "./Components/Invite.vue"
import Commission from "./Components/Commission.vue"
import BackBtn from "app/template/set_r016/components/Button/Back.vue"
import BaseDialog from "app/template/set_r016/components/Dialog/BaseDialog.vue"

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
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/table.scss";
@import "app/template/set_r016/assets/css/form.scss";
@import "app/template/set_r016/assets/css/button.scss";

.collaboration-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    margin: 0;
    padding: 0.625rem 0.375rem;
  }

  .collaboration-banner {
    @apply w-full h-auto mb-5 rounded-xl;
    max-width: 75rem;

    @include phone-width {
      margin-bottom: 0.625rem;
    }
  }

  .collaboration-content {
    margin-top: 1.25rem;
    padding: 3.75rem;
    background-color: $primary07;
    color: $neutral01;
    border-radius: 0.625rem;

    @include phone-width {
      margin-top: 0.625rem;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .collaboration-header {
      @apply flex items-center;
      gap: 0.625rem;
      @include fontStyle(1.625rem);
      color: $secondary03;

      .collaboration-info-btn {
        width: 1.25rem;
        height: 1.25rem;
        cursor: pointer;
      }
    }

    .collaboration-currency-search {
      @apply mt-10;

      @include phone-width {
        @apply mt-5;
      }

      .currency-item {
        max-width: 18.75rem;

        @include phone-width {
          max-width: none;
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
          gap: 0.375rem;
          padding: 0.625rem;
          border-radius: 0.625rem;
          background-color: $primary06;
          .summary-item-title {
            @include fontStyle();
            line-height: 1rem;
            color: $primary02;
          }
          .summary-item-value {
            @include fontStyle(2rem);
            line-height: 2.3125rem;
            color: $neutral01;
          }
        }
      }

      .referral-code-content {
        @apply flex flex-col items-center justify-center;
        gap: 0.625rem;
        width: 50%;
        padding: 1.25rem;
        border-radius: 0.5rem;
        border: 1px solid $primary06;
        background-color: $secondary02;

        @include phone-width {
          width: 100%;
        }

        .referral-code-title {
          @include fontStyle();
          line-height: 1rem;
          color: $neutral01;
        }

        .referral-code-row {
          @apply flex flex-none justify-between items-center;
          width: 100%;
          max-width: 18.75rem;
          padding: 0.625rem 1rem;
          border-radius: 0.625rem;
          background-color: $neutral01;
          box-shadow: $shadow02;

          @include phone-width {
            max-width: none;
          }

          .referral-code {
            @include fontStyle(0.875rem, 400);
            color: $neutral06;
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
      @apply mt-10 flex flex-nowrap items-center;
      gap: 0.625rem;

      @include phone-width {
        margin-top: 1.25rem;
      }

      .q-btn {
        @include fontStyle();
        border-radius: 0.625rem;
        padding: 0.625rem;
        background-color: $secondary02;
        color: $neutral01;
        min-width: 5rem;

        &.active {
          background-color: $neutral01;
          color: $primary04;
        }
      }
    }

    .collaboration-tab-panels {
      @apply mt-5 p-5 flex flex-col gap-10;
      border-radius: 0.625rem;
      background-color: $secondary02;

      @include phone-width {
        margin-top: 0.625rem;
        padding: 0.625rem;
        gap: 1.25rem;
      }

      .q-tab-panel {
        padding: 0;
      }
    }
  }
}
</style>
