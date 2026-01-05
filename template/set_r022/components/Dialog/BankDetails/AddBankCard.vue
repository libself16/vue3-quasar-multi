<template>
  <div class="add-bank-card">{{ $t("member.bank.addAccount") }} +</div>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_r022/assets/css/_variable.scss"

.add-bank-card
  @apply flex justify-center items-center text-xl font-bold cursor-pointer
  font-family: "Noto Sans TC"
  min-height: 13.2119rem
  color: var(--neutral-05)
  text-align: center
  font-size: 20px
  font-style: normal
  font-weight: 700
  border-radius: 10px
  border: 1px dashed var(--neutral-08, rgba(0, 0, 0, 0.24))
</style>
