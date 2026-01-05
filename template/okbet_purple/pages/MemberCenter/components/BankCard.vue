<template>
  <div class="card" :class="{ active: props.activeId === props.card.id }">
    <div class="card-title">
      <div class="title-text">{{ props.card.name }}</div>
      <div class="more-container">
        <q-icon name="more_vert" class="more-icon" @click="handleOpen"></q-icon>
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
      <div class="content-value">{{ props.card.currency_code }}</div>
    </div>
    <div class="card-content">
      <div class="content-title">{{ $t("member.bank.bankName") }}</div>
      <div class="content-value">{{ props.card.bank_name }}</div>
    </div>
    <div class="card-content">
      <div class="content-title">{{ $t("member.bank.accountName") }}</div>
      <div class="content-value">{{ props.card.account_name }}</div>
    </div>
    <div class="card-content">
      <div class="content-title">{{ $t("member.bank.accountNumber") }}</div>
      <div class="content-value">{{ props.card.account_number }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useQuasar } from "quasar"
import { useBank } from "src/common/composables/useBank"
import { useI18n } from "vue-i18n"

const props = defineProps(["card", "activeId"])
const emits = defineEmits(["updateList"])

const { t } = useI18n()
const $q = useQuasar()
const { bankCardState, getBankCardList, handleBankCardDelete } = useBank()

const isOpen = ref(false)

const handleOpen = () => {
  isOpen.value = !isOpen.value
}

const removeBankCard = (bankCardId: number) => {
  $q.dialog({
    title: t("member.bank.deleteMessage"),
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
@import "app/template/okbet_purple/assets/css/_variable.sass"

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
