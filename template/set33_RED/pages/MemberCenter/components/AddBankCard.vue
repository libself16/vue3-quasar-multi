<template>
  <q-card class="add-bank-card"> {{ $t("member.bank.addAccount") }} + </q-card>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped>
.add-bank-card
  @apply flex justify-center items-center text-xl font-bold cursor-pointer
  border: 2px dashed rgba(255, 113, 113, 1)
  min-height: 13.2119rem
  border-radius: .625rem
  background: rgba(121, 15, 15, 1)
</style>
