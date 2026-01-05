<template>
  <div class="card">
    <div class="card-header">{{ props.card.name }}</div>
    <div class="card-row">
      <i class="fa-solid fa-money-bill icon"></i>
      <span>{{ props.card.currency_code }}</span>
    </div>
    <div class="card-row">
      <i class="fa-solid fa-building-columns icon"></i>
      <span>{{ props.card.branch }}</span>
    </div>
    <div class="card-row">
      <i class="fas fa-key icon"></i>
      <span>{{ props.card.account_number }}</span>
    </div>
    <div class="card-row">
      <i class="fas fa-user-alt icon"></i>
      <span>{{ props.card.account_name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type * as Response from "src/api/response.type"

const props = defineProps<{
  card: Response.BankCard
}>()
</script>

<style lang="sass" scoped>
@import 'app/template/epicwin/css/_variable.sass'
@import 'app/template/epicwin/css/form.sass'
</style>
