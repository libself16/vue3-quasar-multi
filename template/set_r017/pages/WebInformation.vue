<template>
  <div class="web-information-layout">
    <WebInformation />
  </div>
</template>

<script lang="ts" setup>
import WebInformation from "src/common/components/WebInformation/Index.vue"
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.web-information-layout {
  max-width: 75rem;
  margin: 0 auto;
  padding-bottom: 3.25rem;
  width: 100%;

  @include phone-width {
    padding-bottom: 1.25rem;
  }
}
</style>
