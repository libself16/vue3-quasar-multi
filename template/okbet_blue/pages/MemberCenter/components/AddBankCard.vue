<template>
  <div class="add-bank-card">{{ $t("member.bank.addAccount") }} +</div>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.add-bank-card
  @apply flex justify-center items-center text-xl font-bold cursor-pointer
  font-family: OpenSans
  border: 2px dashed rgb(231, 234, 241)
  min-height: 13.2119rem
  border-radius: .625rem
  color: #828282
  +iphone-width
    font-family: Helvetica
</style>
