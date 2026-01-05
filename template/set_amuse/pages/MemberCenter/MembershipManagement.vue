<template>
  <div class="management-area">
    <!-- 新增下級畫面 -->
    <AddSubordinateMember v-if="memberManagementStore.showAddSubordinateStatus" />

    <template v-else>
      <div class="top-item">
        <q-tabs
          v-model="memberManagementStore.activeTab"
          class="tabs-area"
          indicator-color="transparent"
          @update:model-value="memberManagementStore.handlerChangeActiveTab"
        >
          <template v-for="tab in memberManagementStore.tabOptions" :key="tab.value">
            <q-tab :label="tab.label" :name="tab.value" class="tab-item" />
          </template>
        </q-tabs>

        <div v-if="memberManagementStore.activeTab === 'manage'" class="agent-amount-area">
          {{ `${$t("collaboration.remaining_agent_amount")}：` }}
          <span class="text-[#FFEB3B] text-2xl font-semibold">
            {{ `${moneyFormat(memberManagementStore.remainQuotaAmount)}` }}
          </span>
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
      </q-tab-panels>

      <!-- 加減款彈窗 -->
      <MemberAddMinusDialog v-if="memberManagementStore.showDialog" v-model="memberManagementStore.showDialog" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useEnv } from "src/common/hooks/useEnv"
import { useRouter } from "vue-router"
import MemberAddMinusDialog from "./components/MembershipManagement/MemberAddMinusDialog.vue"
import ManagePanel from "./components/MembershipManagement/ManagePanel.vue"
import DetailPanel from "./components/MembershipManagement/DetailPanel.vue"
import BetReportPanel from "./components/MembershipManagement/BetReportPanel.vue"
import BetRecordQueryPanel from "./components/MembershipManagement/BetRecordQueryPanel.vue"
import AddSubordinateMember from "./components/MembershipManagement/AddSubordinateMember.vue"

const router = useRouter()
const { isCredit } = useEnv()
const { userInfo } = useUserInfo()
const { moneyFormat } = useCommon()
const memberManagementStore = useMemberManagement()

onMounted(async () => {
  if (!isCredit.value || !userInfo.value.is_member_agent) {
    return router.push({ name: "HomePage" })
  }

  memberManagementStore.memberAgentAccount = userInfo.value.username

  await memberManagementStore.handlerGetMemberAgentQuotaBalance()
  await memberManagementStore.handlerGetMemberAgentQuotaAmount()
})

onBeforeUnmount(() => {
  memberManagementStore.activeTab = "manage"
  memberManagementStore.resetPage()
})
</script>

<style lang="scss" scoped>
@import "app/template/set_amuse/assets/css/membershipManagement.scss";

.management-area {
  width: 100%;

  @include phone-width {
    padding: 1.6875rem 0.75rem 20%;
  }

  .top-item {
    width: 100%;
    background-color: #000000;
    border-radius: 0.75rem;
    padding: 1.5rem 1.4375rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.75rem;

    @include phone-width {
      margin-bottom: 1.25rem;
    }

    .tabs-area {
      :deep(.q-tabs__content) {
        gap: 2rem;

        @include phone-width {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
      }

      @include phone-width {
        width: 100%;

        :deep(.q-tabs__content) {
          justify-content: center;
        }
      }

      .tab-item {
        min-width: 10.75rem;
        border: 1px solid #777777;
        border-radius: 0.25rem;
        background-color: #000000;
        padding: 0.84375rem 0.5rem;
        font-weight: 500;
        font-size: 1rem;
        white-space: pre-wrap;

        @include phone-width {
          min-width: unset;
          padding: 0.78125rem 0;
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

        &.q-tab--active {
          border-color: #ed772e;
          color: #ed772e;
        }
      }
    }

    .agent-amount-area {
      width: 100%;
      border-top: 1px solid #333333;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2rem;
      padding-top: 2rem;

      @include phone-width {
        border: none;
        margin-top: 1.5rem;
        padding: 0;
      }
    }
  }

  .manage-panel,
  .detail-panel,
  .bet-report-panel,
  .bet-record-query-panel {
    width: 100%;
    padding: 0;
  }
}
</style>
