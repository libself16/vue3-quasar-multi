<template>
  <q-dialog :model-value="showDialog">
    <q-card class="amount-dialog">
      <q-card-section class="amount-dialog-header">
        <div>
          {{
            memberManagementStore.dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
              ? $t("member.membershipManagement.agentAddition")
              : $t("member.membershipManagement.agentDeduction")
          }}
        </div>
        <q-btn icon="close" flat round dense @click="updateShowDialog(false)" size="md" />
      </q-card-section>

      <q-card-section class="amount-dialog-content">
        <div class="account">
          <span class="mr-2.5">{{ $t("menu.userAccount") }}</span>
          <span class="text-[#2773EC] text-base font-normal">
            {{ memberManagementStore.targetAccount }}
          </span>
        </div>

        <div class="mb-1">
          {{
            memberManagementStore.dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
              ? $t("member.membershipManagement.addAmount")
              : $t("member.membershipManagement.minusAmount")
          }}
        </div>
        <q-select
          v-model="memberManagementStore.dialogIncreaseItem"
          class="amount increase-item mb-5"
          outlined
          dense
          emit-value
          map-options
          :options="memberManagementStore.dialogIncreaseItemOptions"
        />

        <div class="mb-1">
          {{
            memberManagementStore.dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
              ? $t("member.membershipManagement.addAmount")
              : $t("member.membershipManagement.minusAmount")
          }}
        </div>
        <q-input
          :model-value="memberManagementStore.dialogAmount"
          @update:model-value="memberManagementStore.onInputChange($event)"
          :placeholder="$t('ai.enter_amount')"
          outlined
          dense
          class="amount"
        />

        <div class="flex items-center justify-start my-[0.90625rem]">
          <div class="mr-2.5">
            {{
              memberManagementStore.dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
                ? $t("member.membershipManagement.agentAddRemainingAmount")
                : $t("member.membershipManagement.agentMinusRemainingAmount")
            }}
          </div>

          <span class="text-[#2773EC] text-lg font-semibold">{{
            moneyFormat(memberManagementStore.remainQuotaAmount)
          }}</span>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="amount-dialog-actions">
        <q-btn
          :label="$t('common.btn.submit')"
          class="confirm-btn"
          @click="memberManagementStore.handlerClickSubmit()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { MEMBER_AGENT_QUOTA_BALANCE_TYPE } from "src/common/utils/constants"
import { useMemberManagement } from "src/stores/useMemberManagement"

const emit = defineEmits(["update:modelValue"])
const props = defineProps({
  modelValue: Boolean
})

const { moneyFormat } = useCommon()
const memberManagementStore = useMemberManagement()

const showDialog = ref(props.modelValue)

// 更新對話框顯示狀態
const updateShowDialog = (value: boolean) => {
  memberManagementStore.showDialog = value
}

watch(
  () => props.modelValue,
  (val) => {
    memberManagementStore.showDialog = val
  }
)
watch(showDialog, (val) => {
  emit("update:modelValue", val)
})
</script>
<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.amount-dialog {
  min-width: 37.5rem;
  max-width: none;
  padding: 1.875rem;
  background-color: white;
  color: black;
  border-radius: 0.75rem;

  @include phone-width {
    width: 100%;
    min-width: unset;
    padding: 1rem;
  }

  .amount-dialog-header {
    width: 100%;
    font-size: 1rem;
    font-weight: 700;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.34375rem;

    :deep(.q-btn) {
      width: 1.25rem;
      height: 1.25rem;

      .q-btn__content {
        height: 1.25rem;
      }
    }
  }

  .amount-dialog-content {
    font-size: 0.875rem;
    font-weight: 400;
    padding: 0;

    .account {
      margin-bottom: 0.625rem;
    }

    .amount {
      color: #ededed;
      border-radius: 0.625rem;
      background-color: #f0f1f4;
      border-color: transparent;

      :deep(.q-field__control) {
        &::before {
          border: none;
        }
      }

      :deep(.q-field__native) {
        color: black;
        &::placeholder {
          color: #797979;
        }
      }
    }
  }

  .amount-dialog-actions {
    padding: 0;

    .confirm-btn {
      width: 100%;
      padding: 0.625rem 0;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      background: #025be8;
      color: white;

      :deep(.q-btn__content) {
        line-height: normal;
      }
    }
  }
}
</style>
