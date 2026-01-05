<template>
  <div class="add-bank-card">{{ $t("member.bank.addAccount") }} +</div>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/okbet/assets/css/_variable.sass"

.add-bank-card
  @apply flex justify-center items-center text-xl font-bold cursor-pointer w-full
  display: flex
  padding: 10px
  justify-content: center
  align-items: center
  gap: 10px
  align-self: stretch
  margin-top: 0.5rem
  border-radius: 10px
  border: 1px dashed var(--bg-line-03)
  color: var(--text-03)
  text-align: center
  font-family: Helvetica
  font-size: 16px
  font-style: normal
  font-weight: 700
  line-height: normal
  +iphone-width
    font-family: Helvetica
</style>
