<template>
  <div class="card" :class="{ active: props.activeId === props.card.id }">
    <div class="card-title">
      <div class="title-text">{{ props.card.name }}</div>
      <div class="more-container">
        <q-icon name="more_vert" class="more-icon"> </q-icon>
        <div class="more-content">
          <q-btn
            icon="border_color"
            flat
            size="sm"
            class="px-0"
            :to="{ name: 'memberBankAdd', params: { id: props.card.id } }"
          ></q-btn>
          <q-btn icon="delete" flat size="sm" class="px-0" @click="removeBankCard(props.card.id)"></q-btn>
        </div>
      </div>
    </div>
    <div class="card-content">
      <div class="content-title">{{ $t("tableHeader.currency") }}</div>
      <div class="content-value">{{ props.card.currency_code }}</div>
    </div>
    <div class="card-content">
      <div class="content-title">{{ $t("member.bank.bankName") }}</div>
      <div class="content-value">
        {{
          props.card.bank_id === 0
            ? props.card.bank_name
            : bankList.filter((bank) => bank.value === props.card.bank_id)[0]?.label
        }}
      </div>
    </div>
    <div class="card-content">
      <div class="content-title">{{ $t("member.bank.accountName") }}</div>
      <div class="content-value">{{ props.card.account_name }}</div>
    </div>
    <div class="card-content">
      <div class="content-title">{{ $t("member.bank.accountNumber") }}</div>
      <div class="content-value">{{ props.card.account_number }}</div>
    </div>
    <div class="card-content" v-if="props.card.payment_gateway_id">
      <div class="content-title">{{ $t("member.bank.withdrawalChannel") }}</div>
      <div class="content-value">
        {{
          props.card.payment_gateway_id
            ? gatewayFilterList.filter((item: any) => item.value === props.card.payment_gateway_id)[0]?.label
            : ""
        }}
      </div>
    </div>
    <!-- <span class="gateway-name">{{
      props.card.payment_gateway_id
        ? gatewayFilterList.filter((item: any) => item.value === props.card.payment_gateway_id)[0]?.label
        : ""
    }}</span> -->
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"
import { useBank } from "src/common/composables/useBank"
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"

const emits = defineEmits(["updateList"])
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

const { t } = useI18n()
const $q = useQuasar()
const { bankCardState, getBankCardList, handleBankCardDelete, getBankList } = useBank()

const removeBankCard = (bankCardId: number) => {
  $q.dialog({
    title: t("member.bank.deleteMessage"),
    // message: t("member.bank.deleteMessage"),
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await handleBankCardDelete(bankCardId)
    emits("updateList")
  })
}

onMounted(() => {
  // getBankCardList()
  // getBankList()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'

.card-container
  @apply grid grid-cols-3 gap-5
  +pc-width
    @apply grid-cols-2 gap-1
  +phone-width
    @apply grid-cols-1
    width: 19.25rem
    height: 43.125rem
    margin: 1rem auto
    background-color: #1C1E22
    padding: .75rem 0
    overflow: auto
    +hideScrollBar
  .card
    width: 100%
    +setFlex
    flex-direction: column
    justify-content: space-between
    padding-bottom: 1.125rem
    position: relative
    border-radius: 8px
    border: 2px solid #A2B3D6
    &.active
      transition: transform .3s ease
      border: 2px solid #ffe400
      box-shadow: 0 0 .3125rem .0625rem #ffffff80
    +iphone-width
      width: 100%
      margin: 1rem auto 0
      padding-bottom: 0.5rem
    .card-title
      +setFlex(space-between)
      width: 100%
      padding-left: 1rem
      background: #A2B3D6
      +iphone-width
        padding-left: 1rem
      .title-text
        color: $white-7
        font-family: "NotoSansTC"
        font-size: 1rem
        font-weight: 700
        position: relative
        +iphone-width
          font-size: 1rem
      .more-container
        position: relative
        padding: 1rem
        +iphone-width
          padding: 1rem
        &:hover
          .more-content
            display: flex
        .more-icon
          font-size: 1.25rem
        .more-content
          background-color: #f2f2f2
          border-radius: 4px
          color: #828282
          display: flex
          flex-direction: column
          padding: .75rem
          gap: 1.0625rem
          font-size: 1.25rem
          position: absolute
          left: -1%
          top: 2.2%
          display: none
          cursor: pointer
          +iphone-width
            font-size: 1.25rem
            left: 0
            top: 9%
    .card-content
      +setFlex()
      color: #6288D2
      gap: 1.75rem
      margin-top: .75rem
      width: 100%
      font-size: .875rem
      +iphone-width
        margin-top: .75rem
        gap: 1.6875rem
        font-size: .875rem
      .content-title
        width: 50%
        text-align: right
      .content-value
        width: 50%
        word-wrap: break-word
        overflow-wrap: break-word
    .gateway-name
      padding: 10px
      position: absolute
      right: 0
      bottom: 0
</style>
