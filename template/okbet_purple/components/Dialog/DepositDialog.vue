<template>
  <q-dialog v-model="dialogShow" persistent class="dialog-base" position="bottom" @hide="handleClose">
    <q-card>
      <q-card-section>
        <div class="dialog-title-wrapper">
          <div class="dialog-title-text">
            <div>{{ $t("menu.deposit") }}</div>
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

        <div class="form-promotion-wrapper">
          <div class="form-title">{{ $t("member.deposit.depositReward") }}</div>
          <div class="form-promotion-list">
            <PromotionList
              v-for="item in mayaDepositWithdrawalState.promotion_list"
              :key="item.id"
              :item="item"
              :activeId="mayaDepositWithdrawalState.form.promotion_id"
              @click="handleMayaDepositPromotionClick(item.id)"
            />
          </div>
        </div>

        <div class="amount-wrapper">
          <div class="amount-title">{{ $t("member.deposit.depositAmount") }}</div>
          <q-input
            v-model="amount"
            :rules="[
              Rules.required(),
              (val: string) => Rules.depositAmount({ min: '100', max: '100000', val })
            ]"
            inputmode="numeric"
            pattern="[0-9]*"
            lazy-rules
            :placeholder="$t('common.deposit_range') + ' 100-100,000'"
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
import { useRule } from "src/common/hooks/useRule"
import { useSiteImg } from "../../hooks/useSiteImg"
import PromotionList from "app/template/okbet_purple/pages/MemberCenter/components/PromotionList.vue"

const emit = defineEmits<{
  close: []
}>()

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { closeIcon } = useSiteImg()
const eventbus = injectStrict(EventBusKey)
const { getUserWalletList } = useUserInfo()
const {
  mayaDepositWithdrawalState,
  getDepositPaymentList,
  handleMayaDepositPromotionClick,
  handleMayaDepositQuickBtnClick,
  handleMayaDepositSubmit
} = useBank()
const dialogShow = ref(false)
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
    const { status } = await handleMayaDepositSubmit()

    if (status) {
      await getUserWalletList()
      handleClose()
      $q.notify({
        type: "positive",
        message: t("common.alarm.depositSuccess"),
        position: "top"
      })
    }
  } catch (error) {
    console.log("error", error)
  }
}

onMounted(() => {
  eventbus.on("openDepositDialog", (show: boolean) => {
    getUserWalletList()
    getDepositPaymentList()
    dialogShow.value = show
  })
})
</script>

<style lang="scss" scoped>
@import "app/template/okbet_purple/assets/css/dialog.scss";

.form-promotion-wrapper {
  .form-title {
    @apply text-base font-semibold my-5;
  }
  .form-promotion-list {
    @apply grid grid-cols-2 gap-4 text-[.8125rem];

    .promotion-container {
      @apply w-full max-w-full !important;
    }
  }
}
</style>

<style lang="scss">
@import "app/template/okbet_purple/assets/css/_variable.sass";

// quasar 的 dialog 樣式綁在 body 層，所以需要移除 scoped，且等於 withdrawal dialog 也能吃到
.dialog-base {
  .q-dialog__inner {
    color: $text-light-secondary !important;

    .q-card {
      background: $bg-dark-secondary !important;
    }
  }
}
</style>
