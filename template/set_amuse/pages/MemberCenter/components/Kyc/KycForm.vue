<template>
  <div class="kyc-form-container">
    <template v-if="isLoading">
      <div class="flex items-center justify-center">
        <q-spinner color="white" size="3em" />
      </div>
    </template>
    <template v-else>
      <div class="kyc-inner-form">
        <template v-for="setting in kycSetting" :key="setting">
          <KycCard :setting="setting" :dragging="dragging" :handleWindowDragDrop="handleWindowDragDrop" />
        </template>
      </div>
      <div class="kyc-submit-container">
        <q-btn class="kyc-send" @click="handleSubmit">{{ $t("common.btn.send") }}</q-btn>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: "KycForm"
}
</script>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue"
import { useKyc } from "src/common/hooks/useKyc"

import KycCard from "app/template/set_amuse/pages/MemberCenter/components/Kyc/components/KycCard.vue"

const {
  handleSubmit,
  kycSetting,
  getKycItem,
  getKycSetting,
  isLoading,
  dragging,
  handleWindowDragEnter,
  handleWindowDragLeave,
  handleWindowDragDrop
} = useKyc()

onMounted(async () => {
  await getKycItem()
  await getKycSetting()
  window.addEventListener("dragenter", handleWindowDragEnter)
  window.addEventListener("dragleave", handleWindowDragLeave)
})

onBeforeUnmount(() => {
  window.removeEventListener("dragenter", handleWindowDragEnter)
  window.removeEventListener("dragleave", handleWindowDragLeave)
})
</script>

<style lang="scss">
@import "app/template/set_amuse/assets/css/kyc.scss";
@import "src/common/css/_variable.sass";

.kyc-submit-container {
  @apply flex justify-end;
  @apply sticky bottom-4;
  @apply pointer-events-none;

  @include phone-width {
    @apply bottom-[96px];
  }

  .kyc-send {
    @apply pointer-events-auto;
  }
}
</style>
