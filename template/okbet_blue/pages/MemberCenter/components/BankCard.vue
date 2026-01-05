<template>
  <div
    v-if="
      props.card.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoWallet ||
      props.card.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoPayment
    "
    class="card"
    :class="{ active: props.activeId === props.card.id }"
  >
    <div class="card-title">
      <div class="title-text">{{ props.card.name }}</div>
      <div class="more-container">
        <q-icon
          name="more_vert"
          class="more-icon"
          @click="handleOpen"
          v-if="envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN">
        </q-icon>
        <div class="more-content" :class="{ active: isOpen }">
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
      <div class="content-title">{{ $t("member.deposit.currencyBrand") }}</div>
      <div class="content-value">{{ props.card.currency_brand }}</div>
    </div>
    <div class="card-content">
      <div class="content-title">{{ $t("member.deposit.chain") }}</div>
      <div class="content-value">
        {{
          props.card.chain === ""
            ? bankList.filter((bank) => bank.value === props.card.bank_id)[0]?.label
            : props.card.chain
        }}
      </div>
    </div>
    <div class="card-content">
      <div class="content-title">{{ $t("member.deposit.walletAddress") }}</div>
      <div class="content-value">
        {{
          props.card.wallet_address.length > 10
            ? props.card.wallet_address.substring(0, 10) + "..."
            : props.card.wallet_address
        }}
      </div>
    </div>
    <div class="card-content" v-if="Number(props.card.crypto_rate) !== 0">
      <div class="content-title">{{ $t("member.deposit.rate") }}</div>
      <div class="content-value">{{ props.card.crypto_rate }}</div>
    </div>
    <div class="card-content" v-show="props.card.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoPayment && props.card.payment_gateway_id">
      <div class="content-title">{{ $t("member.bank.withdrawalChannel") }}</div>
      <div class="content-value">
        {{
          props.card.payment_gateway_id
            ? gatewayFilterList.filter((item: any) => item.value === props.card.payment_gateway_id)[0]?.label
            : ""
        }}
      </div>
    </div>
  </div>
  <div v-else class="card" :class="{ active: props.activeId === props.card.id }">
    <div class="card-title">
      <div class="title-text">{{ props.card.name }}</div>
      <div class="more-container">
        <q-icon
          name="more_vert"
          class="more-icon"
          @click="handleOpen"
          v-if="envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN">
        </q-icon>
        <div class="more-content" :class="{ active: isOpen }">
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
      <div class="content-value">{{ formatterCurrency(props.card.currency_code) }}</div>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useBank } from "src/common/composables/useBank"
import { FUND_METHOD_TYPE, MEMBER_BANK_EDIT } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"
import { useEnvInfoStore } from "src/stores/envStore"

// const props = defineProps(["card", "activeId"])
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
const { envInfo } = useEnvInfoStore()
const $q = useQuasar()
const { handleBankCardDelete, formatterCurrency } = useBank()

const isOpen = ref(false)

const handleOpen = () => {
  isOpen.value = !isOpen.value
}

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
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import "app/template/okbet_blue/assets/css/_variable.sass"

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
    @apply w-full flex flex-col justify-between
    +setFlex
    padding-bottom: 1.125rem
    border-radius: 8px
    border: 2px solid $border-dark
    &.active
      transition: transform .3s ease
      border: 2px solid $border-dark
      box-shadow: 0 0 1rem $box-shadow-color-light, 0 0 0.5rem 0.1rem $box-shadow-color-dark
    +iphone-width
      width: 100%
      margin: 1rem auto 0
      padding-bottom: 0.5rem
    .card-title
      +setFlex(space-between)
      width: 100%
      padding-left: 1rem
      background: $bg-secondary
      border-top-left-radius: 6px
      border-top-right-radius: 6px
      +iphone-width
        padding-left: 1rem
      .title-text
        @apply font-bold text-base relative
        padding: 1rem
        color: $text-light-secondary
        +iphone-width
          font-size: 1rem
      .more-container
        position: relative
        padding: 1rem
        +iphone-width
          padding: 1rem
        .more-icon
          font-size: 1.25rem
          color: #fff
        .more-content
          background-color: #f2f2f2
          border-radius: 4px
          color: #828282
          display: none
          flex-direction: column
          padding: .75rem
          gap: 1.0625rem
          font-size: 1.25rem
          position: absolute
          left: 0%
          top: 100%
          display: none
          cursor: pointer
          &.active
            display: flex
          +iphone-width
            font-size: 1.25rem
            left: 0
            top: 100%
    .card-content
      +setFlex()
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
</style>
