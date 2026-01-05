<template>
  <q-btn v-bind="$attrs" outline class="base-primary-outline-btn">
    <slot></slot>
  </q-btn>
</template>

<script setup>
// 在 <script setup> 中，推薦加入這個來禁用
// 預設的 "fallthrough" 行為，讓 $attrs 能更可控地
// 只綁定在內層的 <q-btn> 上。
defineOptions({
  inheritAttrs: false
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blue/assets/css/form.scss";

.base-primary-outline-btn {
  color: $text-light-primary !important;
  // background-color: $bg-light-text !important;

  &::before {
    border-color: $text-light-primary !important;
  }
}
</style>
