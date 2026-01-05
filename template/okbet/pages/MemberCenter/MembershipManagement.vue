<template>
  <div class="management-area">
    <div class="page-title">
      <span class="page-title-blue">{{ $t("member.membershipManagement.subMember") }}</span>
      <span>{{ $t("member.membershipManagement.management") }}</span>
    </div>

    <!-- 新增下級畫面 -->
    <AddSubordinateMember v-if="memberManagementStore.showAddSubordinateStatus" />

    <template v-else>
      <div class="top-item">
        <q-tabs
          v-model="memberManagementStore.activeTab"
          class="tabs-area"
          indicator-color="transparent"
          align="left"
          dense
          @update:model-value="memberManagementStore.handlerChangeActiveTab"
        >
          <template v-for="tab in memberManagementStore.tabOptions" :key="tab.value">
            <q-tab :label="tab.label" :name="tab.value" class="tab-item" />
          </template>
        </q-tabs>

        <div v-if="memberManagementStore.activeTab === 'manage'" class="manage-top-area">
          <div class="left-area">
            <div v-if="isCredit" class="amount-text">
              {{ `${$t("collaboration.remaining_agent_amount")}：` }}
              <span>
                {{ `${moneyFormat(memberManagementStore.remainQuotaAmount)}` }}
              </span>
            </div>

            <q-btn
              v-if="!memberManagementStore.showSubordinateMemberAccount?.account"
              :label="$t('common.btn.addSubordinate')"
              text-color="white"
              unelevated
              class="add-subordinate-btn"
              @click="memberManagementStore.showAddSubordinateStatus = true"
            />
          </div>

          <div
            v-if="memberManagementStore.showSubordinateMemberAccount?.account"
            class="back-btn"
            @click="memberManagementStore.handlerBackSubordinateMember()"
          >
            <img :src="backBtnImg" alt="back-btn" class="back-btn-img" />
            <div class="back-btn-text">{{ $t("common.btn.back") }}</div>
          </div>
        </div>
      </div>

      <q-tab-panels v-model="memberManagementStore.activeTab" class="bg-transparent">
        <q-tab-panel name="manage" class="manage-panel">
          <ManagePanel />
        </q-tab-panel>

        <q-tab-panel name="detail" class="detail-panel">
          <DetailPanel />
        </q-tab-panel>

        <q-tab-panel name="betReport" class="bet-report-panel">
          <BetReportPanel />
        </q-tab-panel>

        <q-tab-panel name="betRecordQuery" class="bet-record-query-panel">
          <BetRecordQueryPanel />
        </q-tab-panel>

        <q-tab-panel name="agentReport" class="agent-report-panel">
          <AgentReportPanel />
        </q-tab-panel>
      </q-tab-panels>

      <!-- 加減款彈窗 -->
      <MemberAddMinusDialog v-if="memberManagementStore.showDialog" v-model="memberManagementStore.showDialog" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import ManagePanel from "./components/MembershipManagement/ManagePanel.vue"
import DetailPanel from "./components/MembershipManagement/DetailPanel.vue"
import BetReportPanel from "./components/MembershipManagement/BetReportPanel.vue"
import BetRecordQueryPanel from "./components/MembershipManagement/BetRecordQueryPanel.vue"
import AgentReportPanel from "./components/MembershipManagement/AgentReport.vue"
import MemberAddMinusDialog from "./components/MembershipManagement/MemberAddMinusDialog.vue"
import AddSubordinateMember from "./components/MembershipManagement/AddSubordinateMember.vue"

const router = useRouter()
const { isCredit } = useEnv()
const { userInfo2 } = useUserInfo()
const { moneyFormat } = useCommon()
const { backBtnImg } = useSiteImg()
const memberManagementStore = useMemberManagement()

onMounted(async () => {
  if (!userInfo2.value.is_member_agent) {
    return router.push({ name: "home" })
  }

  memberManagementStore.memberAgentAccount = userInfo2.value.account

  await memberManagementStore.handlerGetMemberAgentQuotaAmount()
  await memberManagementStore.handlerGetMemberAgentQuotaBalance()
})

onBeforeUnmount(() => {
  memberManagementStore.activeTab = "manage"
  memberManagementStore.resetPage()
})
</script>

<style lang="scss" scoped>
@import "app/template/okbet/assets/css/membershipManagement.scss";

.management-area {
  width: 100%;
  max-width: 71.875rem;
  margin: auto;
  padding-bottom: 10dvh;

  @include phone-width {
    padding: 1rem 1rem 20vh;
  }

  .page-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.75rem;
    font-weight: 800;
    margin-top: 3.75rem;
    margin-bottom: 2.5rem;
    color: black;

    @include phone-width {
      margin-top: 0;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
      color: #2f3c55;
      font-size: 1rem;
    }

    .page-title-blue {
      color: #025be8;

      @include phone-width {
        color: #2f3c55;
      }
    }
  }

  .top-item {
    width: 100%;
    border-radius: 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 1.25rem;

    @include phone-width {
      margin-bottom: 1.25rem;
    }

    .tabs-area {
      width: 100%;

      :deep(.q-tabs__content) {
        gap: 1.25rem;
      }

      .tab-item {
        border-radius: 6.25rem;
        background-color: $background-pale-silver-color;
        padding: 0.625rem 1.25rem;
        font-weight: 500;
        font-size: 1rem;
        white-space: pre-wrap;
        color: rgba(0, 0, 0, 0.5);

        @include phone-width {
          padding: 0.625rem 1.25rem;
          flex: none;
          font-size: 0.75rem;
        }

        :deep(.q-tab__content) {
          @include phone-width {
            padding: 0;
          }

          .q-tab__label {
            line-height: normal;
          }
        }

        &.left {
          margin-right: 1.25rem;

          @include phone-width {
            margin-right: 0.75rem;
          }
        }

        &.q-tab--active {
          background: $primary-color;
          color: $text-light-color;
        }
      }
    }

    .manage-top-area {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.25rem;

      @include phone-width {
        gap: 1.25rem;
      }

      .left-area {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        @include phone-width {
          flex-direction: column;
          align-items: flex-start;
          gap: 1.25rem;
        }

        .amount-text {
          font-size: 1.25rem;
          font-weight: 600;

          @include phone-width {
            font-size: 1rem;
          }

          span {
            color: #025be8;
          }
        }

        .add-subordinate-btn {
          background: #025be8;
          border-radius: 0.5rem;
          padding: 0.625rem 1.25rem;
        }
      }

      .back-btn {
        width: 12.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.625rem;
        cursor: pointer;
        border: 1px solid #025be8;
        border-radius: 6.25rem;
        padding: 0.71875rem 0;

        .back-btn-img {
          width: 1.5rem;
        }

        .back-btn-text {
          font-size: 1.25rem;
          font-weight: 400;
          color: black;
        }
      }
    }
  }
}
</style>
