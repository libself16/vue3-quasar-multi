<template>
  <div class="af-bnk-box" :class="{ active: props.activeId === props.card.id }">
    <div class="af-bnk-ttl">{{ props.card.name }}</div>
    <div class="af-bnk-dtl">
      <div class="af-bnk-wp">
        <div class="af-bnk-l">
          <span class="af-bnk-icon"> <i class="fas fa-money-bill"></i> </span>
          <label class="af-bnk-info"> {{ props.card.currency_code }}</label>
        </div>
        <div class="af-bnk-r">
          <span class="af-bnk-icon af-txt-red" @click="removeBankCard(props.card.id)">
            <i class="fas fa-trash"></i>
          </span>
          <span class="af-bnk-icon af-txt-grn" @click="eventbus.emit('openAddBankCard', true, props.card.id)">
            <i class="fas fa-pen"></i>
          </span>
        </div>
      </div>
      <div class="af-bnk-wp">
        <div class="af-bnk-l">
          <span class="af-bnk-icon"> <i class="fas fa-university"></i></span>
          <label class="af-bnk-info">{{
            props.card.bank_id === 0
              ? props.card.bank_name
              : bankList.filter((bank) => bank.value === props.card.bank_id)[0]?.label
          }}</label>
        </div>
      </div>
      <div class="af-bnk-wp">
        <div class="af-bnk-l">
          <span class="af-bnk-icon"> <i class="fas fa-key"></i></span>
          <label class="af-bnk-info">{{ props.card.account_number }}</label>
        </div>
      </div>
      <div class="af-bnk-wp">
        <div class="af-bnk-l">
          <span class="af-bnk-icon"> <i class="fas fa-user-alt"></i> </span>
          <label class="af-bnk-info">{{ props.card.account_name }}</label>
        </div>
      </div>
      <div class="af-bnk-wp" v-show="props.card?.payment_gateway_id">
        <div class="af-bnk-l">
          <span class="af-bnk-icon"><i class="fas fa-exchange icon"></i></span>
          <label class="af-bnk-info">          {{
            props.card?.payment_gateway_id
              ? gatewayFilterList.filter((item: any) => item.value === props.card.payment_gateway_id)[0]?.label
              : ""
          }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"
import { useBank } from "src/common/composables/useBank"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useI18n } from "vue-i18n"

const props = defineProps<{
  card: Response.BankCard
  activeId: number
  gatewayFilterList: {
    value: number | string
    label: string
  }[]
  bankList: {
    value: number | string
    label: string
  }[]
}>()
const emits = defineEmits(["updateList"])

const { t } = useI18n()
const $q = useQuasar()
const { handleBankCardDelete } = useBank()
const eventbus = injectStrict(EventBusKey)

const removeBankCard = (bankCardId: number) => {
  $q.dialog({
    title: t("member.bank.deleteMessage"),
    // message: t("member.bank.deleteMessage"),
    cancel: true,
    persistent: true,
    dark: true,
    class: "remove-dialog",
    color: "white"
  }).onOk(async () => {
    await handleBankCardDelete(bankCardId)
    emits("updateList")
  })
}
</script>

<style scoped lang="scss">
@import "app/template/set_royalslot88/assets/css/withdrawal.css";
</style>
