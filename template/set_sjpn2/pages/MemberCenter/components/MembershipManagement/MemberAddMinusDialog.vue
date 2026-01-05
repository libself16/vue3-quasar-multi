<template>
  <q-dialog :model-value="showDialog" persistent :maximized="isMobile">
    <q-card class="amount-dialog">
      <q-card-section class="amount-dialog-header">
        <q-btn
          v-if="isMobile"
          icon="chevron_left"
          flat
          round
          dense
          class="mobile-icon"
          @click="updateShowDialog(false)"
          size="md"
        />
        <div>
          {{
            memberManagementStore.dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
              ? $t("member.membershipManagement.agentAddition")
              : $t("member.membershipManagement.agentDeduction")
          }}
        </div>
        <q-btn v-if="!isMobile" icon="close" flat round dense @click="updateShowDialog(false)" size="md" />
      </q-card-section>

      <q-separator class="amount-dialog-line" />

      <q-card-section class="amount-dialog-content">
        <div class="account">
          <span class="mr-2.5">{{ $t("menu.userAccount") }}</span>
          <span class="text-[#EDEDED] text-base font-normal">
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
          class="amount increase-item mb-5"
          outlined
          dense
          v-model="memberManagementStore.dialogIncreaseItem"
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
          v-model="memberManagementStore.dialogAmount"
          :placeholder="$t('ai.enter_amount')"
          outlined
          dense
          class="amount"
          @update:model-value="memberManagementStore.onInputChange"
        />

        <div class="flex items-center justify-start mt-1">
          <div class="mr-2.5">
            {{
              memberManagementStore.dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
                ? $t("member.membershipManagement.agentAddRemainingAmount")
                : $t("member.membershipManagement.agentMinusRemainingAmount")
            }}
          </div>

          <span class="text-[#FFEB3B] text-lg font-semibold">{{
            moneyFormat(memberManagementStore.remainQuotaAmount)
          }}</span>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="amount-dialog-actions">
        <q-btn
          :label="$t('common.btn.confirm2')"
          color="black"
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
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const emit = defineEmits(["update:modelValue"])
const props = defineProps({
  modelValue: Boolean
})

const { moneyFormat } = useCommon()
const { isMobile } = useMediaQuery()
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
  min-width: 22.5rem;
  max-width: none;
  padding: 1.25rem;
  background-color: #202020;
  color: #ededed;

  @include phone-width {
    width: 100%;
    min-width: unset;
    padding: 1rem;
  }

  .amount-dialog-header {
    width: 100%;
    font-size: 1rem;
    font-weight: 700;
    padding: 0 0 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    @include phone-width {
      justify-content: center;
    }

    :deep(.q-btn) {
      width: 1.25rem;
      height: 1.25rem;

      .q-btn__content {
        height: 1.25rem;
      }
    }

    .mobile-icon {
      position: absolute;
      left: 0;
    }
  }

  .amount-dialog-line {
    background: #333333;
    margin-bottom: 1.25rem;
  }

  .amount-dialog-content {
    font-size: 0.75rem;
    font-weight: 400;
    padding: 0;

    .account {
      margin-bottom: 1.25rem;
    }

    .amount {
      color: #ededed;
      border-radius: 0.5rem;
      background-color: rgba(96, 96, 96, 0.24);
      border: 1px solid rgba(90, 90, 90, 0.6);

      :deep(.q-field__native) {
        color: #ededed;
        &::placeholder {
          color: rgba(243, 243, 243, 0.6);
        }
      }
    }
  }

  .amount-dialog-actions {
    margin-top: 1.25rem;
    padding: 0;

    .confirm-btn {
      padding: 0.65625rem 1.75rem;
      border: 1px solid #ec7d38;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;

      @include phone-width {
        width: 100%;
      }

      :deep(.q-btn__content) {
        line-height: normal;
      }
    }
  }
}

.increase-item {
  :deep(.q-field__label) {
    color: rgba(243, 243, 243, 0.6);
  }
}
</style>
