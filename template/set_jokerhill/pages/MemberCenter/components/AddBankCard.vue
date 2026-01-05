<template>
  <div class="add-bank-card">{{ $t("member.bank.addAccount") }} +</div>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped>
.add-bank-card
  @apply flex justify-center items-center text-xl font-bold cursor-pointer
  border: .1rem dashed #A2B3D6
  min-height: 13.2119rem
  border-radius: .625rem
  color: #6288D2
</style>
