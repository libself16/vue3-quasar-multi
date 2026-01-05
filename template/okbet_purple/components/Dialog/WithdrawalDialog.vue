<template>
  <q-dialog v-model="dialogShow" persistent class="dialog-base" position="bottom" @hide="handleClose">
    <q-card>
      <q-card-section>
        <div class="dialog-title-wrapper">
          <div class="dialog-title-text">
            <div>{{ $t("menu.withdrawal") }}</div>
            <div class="audit-wrapper">
              <p>{{ $t("member.withdrawal.auditTurnover") }}：</p>
              <span>{{ moneyFormat(currentAudit) }}</span>
            </div>
          </div>
          <div class="dialog-title-icon" @click="handleClose">
            <q-img class="close-icon" :src="closeIcon" />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <ul class="btn-wrapper">
          <li
            v-for="item in mayaDepositWithdrawalState.deposit_quick_btns"
            @click="handleMayaDepositQuickBtnClick(item)"
            :key="item"
            class="quick-btn"
            :class="{ 'quick-btn-active': mayaDepositWithdrawalState.selectedQuickBtn === item }"
          >
            {{ item }}
          </li>
        </ul>

        <div class="amount-wrapper">
          <div class="amount-title">{{ $t("member.deposit.withdrawAmount") }}</div>
          <q-input
            v-model="amount"
            :rules="[
              Rules.required(),
              (val: string) => Rules.depositAmount({ min: '100', max: '100000', val })
            ]"
            inputmode="numeric"
            pattern="[0-9]*"
            lazy-rules
            :placeholder="$t('common.withdraw_range') + ' 100-100,000'"
          />
        </div>

        <div class="action-btns">
          <q-btn :label="$t('common.btn.confirm')" class="submit-btn text-capitalize" @click="handleSubmit" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useBank } from "src/common/composables/useBank"
import { useCommon } from "src/common/hooks/useCommon"
import { useRule } from "src/common/hooks/useRule"
import { useSiteImg } from "../../hooks/useSiteImg"

const emit = defineEmits<{
  close: []
}>()

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { closeIcon } = useSiteImg()
const eventbus = injectStrict(EventBusKey)
const { getUserWalletList, userWalletMap } = useUserInfo()
const { moneyFormat } = useCommon()
const { mayaDepositWithdrawalState, handleMayaDepositQuickBtnClick, handleMayaWithdrawalSubmit } = useBank()
const dialogShow = ref(false)
const currentAudit = ref("")
const amount = Rules.usePositiveInteger({
  modelValue: {
    get value() {
      return mayaDepositWithdrawalState.form.amount
    },
    set value(newValue: string) {
      mayaDepositWithdrawalState.form.amount = newValue
    }
  },
  min: 100,
  max: 100000
})

const handleClose = () => {
  dialogShow.value = false
  emit("close")
  initMayaDepositWithdrawalState()
}

const filterCurrency = () => {
  if (userWalletMap.value) {
    // PM要求寫死PHP幣別
    const phpWallet = userWalletMap.value["PHP"]
    const currentWallet = Object.values(phpWallet)[0]
    currentAudit.value = currentWallet.remaining_turnover
  }
}

const initMayaDepositWithdrawalState = () => {
  mayaDepositWithdrawalState.form = {
    amount: "",
    currency: "",
    promotion_id: 0
  }
  mayaDepositWithdrawalState.selectedQuickBtn = ""
}

const handleSubmit = async () => {
  const amount = Number(mayaDepositWithdrawalState.form.amount)

  if (amount < 100 || amount > 100000) {
    $q.notify({
      type: "negative",
      message: t("common.validate.amountExceedLimit"),
      position: "top"
    })
    return
  }

  try {
    const { status } = await handleMayaWithdrawalSubmit()

    if (status) {
      await getUserWalletList()
      handleClose()
      $q.notify({
        type: "positive",
        message: t("common.alarm.withdrawSuccess"),
        position: "top"
      })
    }
  } catch (error) {
    console.log("error", error)
  }
}

onMounted(() => {
  eventbus.on("openWithdrawalDialog", (show: boolean) => {
    getUserWalletList()
    filterCurrency()
    dialogShow.value = show
  })
})
</script>

<style lang="scss" scoped>
@import "app/template/okbet_purple/assets/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/dialog.scss";

.audit-wrapper {
  @apply flex items-center justify-center text-sm;
  color: $text-gray-tertiary;
}
</style>
