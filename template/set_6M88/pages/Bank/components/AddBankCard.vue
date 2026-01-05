<template>
  <q-card flat class="add-bank-card">{{ $t("member.bank.addAccount") }} +</q-card>
</template>

<style lang="scss" scoped>
@import "../../../assets/css/variable.scss";

.add-bank-card {
  @apply flex justify-center items-center font-bold cursor-pointer;
  border: 0.3125rem solid #005f79;
  border-style: dashed;
  font-size: 1.25rem;
  padding: 0.625rem;
  border-radius: 0.625rem;
  animation: fadeIn 0.5s;
  transition: transform 0.3s ease-out;
}
</style>
