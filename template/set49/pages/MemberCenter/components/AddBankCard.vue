<template>
  <div class="add-bank-card">{{ $t("member.bank.addAccount") }} +</div>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped>
.add-bank-card
  @apply flex justify-center items-center text-xl font-bold cursor-pointer
  border: .1rem dashed #4F4F4F
  min-height: 13rem
  max-height: 15rem
  border-radius: .625rem
</style>
