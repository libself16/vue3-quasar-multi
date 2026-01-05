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
          v-if="props.showMore && envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN"
        >
        </q-icon>
        <div class="more-content" :class="{ active: isOpen }">
          <q-btn icon="border_color" flat size="sm" class="px-0" @click="emits('edit')"></q-btn>
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
          v-if="props.showMore && envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN"
        >
        </q-icon>
        <div class="more-content" :class="{ active: isOpen }">
          <q-btn icon="border_color" flat size="sm" class="px-0" @click="emits('edit')"></q-btn>
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
import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"
import { useBank } from "src/common/composables/useBank"
import { FUND_METHOD_TYPE, MEMBER_BANK_EDIT } from "src/common/utils/constants"
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useEnvInfoStore } from "src/stores/envStore"

// const props = defineProps(["card", "activeId"])

interface Props {
  card: Response.BankCard
  activeId: number
  showMore: boolean
  gatewayFilterList: {
    value: number | string
    label: string
  }[]
  bankList: {
    value: number | string
    label: string
  }[]
}

const props = withDefaults(defineProps<Props>(), {
  showMore: true
})

const emits = defineEmits(["updateList", "edit"])

const { t } = useI18n()
const { envInfo } = useEnvInfoStore()
const $q = useQuasar()
const { bankCardState, getBankCardList, handleBankCardDelete, formatterCurrency } = useBank()

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

onMounted(() => {
  // getBankCardList()
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "src/css/form.sass"
@import "app/template/set_r023/assets/css/_variable.scss"

.card-container
  @apply grid grid-cols-3 gap-5
  +pc-width
    @apply grid-cols-2 gap-1
  +pad-large-width
    @apply grid-cols-1
    width: 19.25rem
    height: 43.125rem
    margin: 1rem auto
    background: red
    padding: .75rem 0
    overflow: auto
    +hideScrollBar
  .card
    width: 100%
    padding-bottom: 1.125rem
    border-radius: 8px
    border: 0.951px solid var(--neutral-07)

    &.active
      transition: transform .3s ease
      border: 2px solid var(--primary-01)
      // box-shadow: 0 4px 10px rgba($box-shadow-primary-color, 0.4), 0 0 0.3125rem 0.0625rem rgba($box-shadow-primary-color, 0.6)
    +pad-large-width
      width: 100%
      margin: 1rem auto 0
      padding-bottom: 0.5rem
    .card-title
      +setFlex(space-between)
      width: 100%
      padding-left: 1rem
      max-height: 40px
      color: #fff
      background-color: var(--primary-01)
      border-top-left-radius: 6px
      border-top-right-radius: 6px
      +pad-large-width
        padding-left: 1rem
      .title-text
        color: #fff
        font-size: 1rem
        padding: 1rem
        font-weight: 700
        position: relative
        +pad-large-width
          font-size: 1rem
      .more-container
        position: relative
        padding: 1rem
        +pad-large-width
          padding: 1rem
        .more-icon
          font-size: 1.25rem
          color: #fff
        .more-content
          border-radius: 0px 0px 0px 10px
          background: var(--neutral-05)
          color: var(--neutral-01)
          display: none
          flex-direction: column
          padding: .75rem
          gap: 1.0625rem
          font-size: 1.25rem
          position: absolute
          left: 20%
          top: 100%
          display: none
          cursor: pointer
          &.active
            display: flex
          +pad-large-width
            font-size: 1.25rem
            left: 20%
            top: 100%
    .card-content
      +setFlex()
      gap: 1.75rem
      margin-top: .75rem
      width: 100%
      font-size: .875rem
      +pad-large-width
        margin-top: .75rem
        gap: 1.6875rem
        font-size: .875rem
      .content-title
        width: 50%
        text-align: right
      .content-value
        width: 50%
        min-height: 1rem
        display: inline-block
        max-width: 14em
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        word-wrap: break-word !important
        overflow-wrap: break-word !important
        word-break: break-all !important
</style>
