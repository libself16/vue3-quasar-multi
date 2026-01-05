<template>
  <q-card class="card" :class="{ active: props.activeId === props.card.id }">
    <div class="card-header text-black">
      {{ props.card.name }}
    </div>
    <q-card-section class="flex flex-col py-5 px-6 gap-[14px]">
      <div class="flex justify-between items-center">
        <div class="title-row">
          <i class="fa-solid fa-money-bill"></i>
          <span>{{ props.card.currency_code }}</span>
        </div>
        <div>
          <slot></slot>
        </div>
      </div>
      <div class="title-row">
        <i class="fa-solid fa-building-columns"></i>
        <span>{{
          props.card.bank_id === 0
            ? props.card.bank_name
            : bankList.filter((bank) => bank.value === props.card.bank_id)[0]?.label
        }}</span>
      </div>
      <div class="title-row">
        <i class="fas fa-key"></i>
        <span>{{ props.card.account_number }}</span>
      </div>
      <div class="title-row">
          <i class="fas fa-user-alt"></i>
          <span>{{ props.card.account_name }}</span>
        </div>
      <div class="title-row">
        <i class="fas fa-exchange icon"></i>
        <span>{{
          props.card?.payment_gateway_id
            ? gatewayFilterList.filter((item: any) => item.value === props.card.payment_gateway_id)[0]?.label
            : ""
        }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import type * as Response from "src/api/response.type";

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

<style lang="scss" scoped>
@import "../../../assets/css/variable.scss";

@keyframes glowing-border {
  0% {
    box-shadow: 0 0 0 0 rgba(221, 199, 100, 0.7);
  }
  50% {
    box-shadow: 0 0 10px 3px rgba(221, 199, 100, 0.7);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(221, 199, 100, 0.7);
  }
}

.card {
  border: 1px solid #ddc764;
  border-radius: 0.625rem;
  background: #2b2b2b;
  animation: fadeIn 0.5s;
  transition: transform 0.3s ease-out;
  cursor: pointer;

  &:hover,
  &:focus {
    transform: scale(1.02);
    box-shadow: 1px 1px 10px 1px #ddc764;
  }

  &.active {
    border-color: #ffd700;
    animation: glowing-border 1.5s infinite;
    transform: scale(1.02);
  }

  .card-header {
    @apply py-[10px] px-6 font-bold;
    background: $gradient-to-bottom;
    font-size: 1.125rem;
  }

  .title-row {
    @apply flex items-center gap-[15px] text-base;

    i {
      @apply flex items-center w-[18px] h-4;
      color: $primary;
    }

    span {
      @apply font-bold;
    }
  }

  .bank-name {
    @apply text-xl font-bold;
    color: $primary;
  }
}
</style>
