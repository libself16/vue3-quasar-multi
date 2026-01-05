<template>
  <q-card class="add-bank-card"> {{ $t("member.bank.addAccount") }} + </q-card>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped>
.add-bank-card
  @apply flex justify-center items-center text-xl font-bold cursor-pointer
  border: .3125rem dashed #0c9bd5
  min-height: 13.2119rem
  border-radius: .625rem
  background: #08192b
</style>
