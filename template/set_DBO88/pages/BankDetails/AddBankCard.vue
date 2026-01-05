<template>
  <q-card class="add-bank-card">{{ $t("member.bank.addAccount") }} +</q-card>
</template>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";

.add-bank-card {
  @apply flex justify-center items-center font-bold cursor-pointer;
  background: $dark-blue-bg;
  color: $text-white;
  border: 0.3125rem solid $primary-color;
  border-style: dashed;
  font-size: 1.25rem;
  padding: 0.625rem;
  border-radius: 0.625rem;
  animation: fadeIn 0.5s;
  transition: transform 0.3s ease-out;
}
</style>
