<template>
  <q-card class="card" :class="{ active: props.activeId === props.card.id }">
    <div class="card-header">
      {{ props.card.name }}
    </div>
    <q-card-section v-if="props.card.payment_type_id=== FUND_METHOD_TYPE.Enums.CryptoWallet || props.card.payment_type_id=== FUND_METHOD_TYPE.Enums.CryptoPayment" class="flex flex-col py-5 px-6 gap-[14px]">
      <div class="flex justify-between items-center">
        <div class="title-row">
          <i class="fa-solid fa-money-bill"></i>
          <div class="content-value">{{ props.card.currency_brand }}</div>
        </div>
        <div>
          <slot></slot>
        </div>
      </div>
      <div class="title-row">
        <i class="fa-solid fa-building-columns"></i>
        <span>{{
          props.card.chain === '' ? bankList.filter((bank) => bank.value === props.card.bank_id)[0]?.label : props.card.chain
        }}</span>
      </div>
      <div class="title-row">
        <i class="fas fa-key"></i>
        <span>{{ props.card.wallet_address.length > 10 ? props.card.wallet_address.substring(0, 10) + '...' :  props.card.wallet_address }}</span>
      </div>
      <div class="title-row" v-if="Number(props.card.crypto_rate) !== 0">
        <i class="fas fa-user-alt"></i>
        <span>{{ props.card.crypto_rate }}</span>
      </div>
      <div class="title-row" v-show="props.card.payment_type_id=== FUND_METHOD_TYPE.Enums.CryptoPayment">
        <i class="fas fa-exchange icon"></i>
        <span>{{
        props.card.payment_gateway_id
          ? gatewayFilterList.filter((item: any) => item.value === props.card.payment_gateway_id)[0]?.label
          : ""
        }}</span>
      </div>
    </q-card-section>
    <q-card-section v-else class="flex flex-col py-5 px-6 gap-[14px]">
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
      <div class="title-row" v-show="props.card.payment_type_id=== FUND_METHOD_TYPE.Enums.EWallet">
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
import { FUND_METHOD_TYPE } from "src/common/utils/constants";

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
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/_variable.scss";

@keyframes glowing-border {
  0% {
    box-shadow: 0 0 0 0 $pink-shadow-color;
  }
  50% {
    box-shadow: 0 0 10px 3px $pink-shadow-color;
  }
  100% {
    box-shadow: 0 0 0 0 $pink-shadow-color;
  }
}

.card {
  border: 1px solid $primary-color-light;
  border-radius: 0.625rem;
  animation: fadeIn 0.5s;
  transition: transform 0.3s ease-out;
  cursor: pointer;

  &:hover,
  &:focus {
    transform: scale(1.02);
    box-shadow: 1px 1px 10px 1px $primary-color-light;
  }

  &.active {
    border-color: $primary-color-light;
    animation: glowing-border 1.5s infinite;
    transform: scale(1.02);
  }

  .card-header {
    @apply py-[.625rem] px-6 font-bold text-white;
    background: $primary-color-light;
    font-size: 1.125rem;
  }

  .title-row {
    @apply flex items-center gap-[.9375rem] text-base;

    i {
      @apply flex items-center w-[1.125rem] h-4;
    }

    span {
      @apply font-bold;
    }
  }

  .bank-name {
    @apply text-xl font-bold;
  }
}
</style>
