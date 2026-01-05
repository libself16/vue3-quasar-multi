<template>
  <q-card class="card" :class="{ active: props.activeId === props.card.id }">
    <q-card-section class="card-header">
      {{ props.card.name }}
      <slot></slot>
    </q-card-section>
    <q-card-section class="card-row">
      <i class="fa-solid fa-money-bill icon"></i>
      <span>{{ props.card.currency_code }}</span>
    </q-card-section>
    <q-card-section class="card-row">
      <i class="fa-solid fa-building-columns icon"></i>
      <span>{{
        props.card.bank_id === 0
          ? props.card.bank_name
          : bankList.filter((bank) => bank.value === props.card.bank_id)[0]?.label
      }}</span>
    </q-card-section>
    <q-card-section class="card-row">
      <i class="fas fa-key icon"></i>
      <span>{{ props.card.account_number }}</span>
    </q-card-section>
    <q-card-section class="card-row">
      <i class="fas fa-user-alt icon"></i>
      <span>{{ props.card.account_name }}</span>
    </q-card-section>
    <q-card-section class="card-row">
      <i class="fas fa-exchange icon"></i>
      <span>{{
        props.card?.payment_gateway_id
          ? gatewayFilterList.filter((item: any) => item.value === props.card.payment_gateway_id)[0]?.label
          : ""
      }}</span>
    </q-card-section>
    <!-- <span class="bank-name">{{
      props.card?.payment_gateway_id
        ? gatewayFilterList.filter((item: any) => item.value === props.card.payment_gateway_id)[0]?.label
        : ""
    }}</span> -->
  </q-card>
</template>

<script setup lang="ts">
import type * as Response from "src/api/response.type"

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
</script>

<style lang="sass" scoped>

$border-color: #0c9bd5
$bg-color: #08192b

.card
  @apply w-full cursor-pointer pb-4
  border: 1px solid $border-color
  border-radius: .625rem
  background: $bg-color
  position: relative
  &.active
    transform: scale(1.05)
    transition: transform .3s ease
    border: 2px solid #ffe400
    box-shadow: 0 0 .3125rem .0625rem #ffffff80
  .bank-name
    position: absolute
    right: 1rem
    bottom: 0.5rem
  .card-header
    @apply py-3 px-6 text-lg font-bold
    background: linear-gradient(to bottom, rgb(16, 183, 243) 0%, rgb(12, 112, 170) 33%, rgb(8, 93, 143) 100%)
    border-radius: .5rem .5rem 0 0
    position: relative
  .card-row
    @apply mt-4 px-6 py-0
    i
      color: $border-color
    span
      @apply ml-5
</style>
