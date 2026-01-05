<template>
  <ModalBase
    v-model="modalShow"
    :templateType="'primary'"
    use-title
    :title="dialogType === 'deposit' ? t('menu.deposit') : t('menu.withdrawal')"
    max-width="50rem"
    modal-class="primary-modal"
  >
    <div class="deposit-withdrawal-wrapper">
      <div class="tab-wrapper">
        <div class="tab-item" :class="{ active: dialogType === 'deposit' }" @click="changeDialogType('deposit')">
          {{ t("menu.deposit") }}
        </div>
        <div class="tab-item" :class="{ active: dialogType === 'withdrawal' }" @click="changeDialogType('withdrawal')">
          {{ t("menu.withdrawal") }}
        </div>
      </div>
      <div class="content-wrapper">
        <DepositForm v-if="dialogType === 'deposit'" />
        <WithdrawalForm v-if="dialogType === 'withdrawal'" />
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import ModalBase from "../ModalBase.vue"
import DepositForm from "./DepositForm.vue"
import WithdrawalForm from "./WithdrawalForm.vue"

const { t } = useI18n()
const $q = useQuasar()
const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)
const dialogType = ref("")

const changeDialogType = (type: string) => {
  dialogType.value = type
}

onMounted(() => {
  eventbus.on("openDepositWithWithdrawal", (show: boolean, type?: string) => {
    modalShow.value = show
    dialogType.value = type || "deposit"
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_paisa24/assets/css/_variable.scss";

.deposit-withdrawal-wrapper {
  .tab-wrapper {
    @apply grid justify-between gap-[.625rem];
    grid-template-columns: repeat(2, 1fr);

    .tab-item {
      @apply flex justify-center items-center text-lg font-bold cursor-pointer;
      @apply text-white rounded-[.625rem] py-[.625rem] px-[.25rem];
      background: $primary-color;

      &:hover {
        background: $pink-shadow-color;
      }

      &.active {
        background: $pink-shadow-color;
      }
    }
  }
}
</style>
