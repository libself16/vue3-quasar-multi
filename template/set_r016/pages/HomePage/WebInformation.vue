<template>
  <div class="web-information-layout">
    <ContentWebInformation></ContentWebInformation>
  </div>
</template>

<script setup lang="ts">
import ContentWebInformation from "app/template/set_r016/layouts/content/WebInformation/Index.vue"
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.web-information-layout {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    margin: 0;
    padding: 0.625rem 1rem 1.875rem;
  }
}
</style>
