<template>
  <div class="kyc-container">
    <h2>{{ $t("member.kyc.title") }}</h2>
    <h4>{{ $t("member.kyc.subtitle") }}</h4>
    <KycForm class="kyc-form" />
  </div>
  <router-view></router-view>
</template>

<script lang="ts">
export default {
  name: "KycLayout"
}
</script>

<script setup lang="ts">
import KycForm from "app/template/set_sjpn2/pages/MemberCenter/components/Kyc/KycForm.vue"

// 1. import KycForm.vue
// 2. 複製kyc.scss到版型assets/css，改樣式參數，import
</script>

<style lang="scss">
@import "src/common/css/_variable.sass";

.kyc-container {
  @apply bg-black rounded-xl p-8;
  h2 {
    @apply text-xl font-extrabold mb-6 md:mb-10;
  }
  h4 {
    @apply text-[1rem] md:text-xl;
  }
  .kyc-form {
    @apply mt-4;
  }
}
</style>
