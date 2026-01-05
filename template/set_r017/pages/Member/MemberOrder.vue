<template>
  <MemberOrder id="member-order" class="w-full padXl:!max-w-[44.5rem] pad:!max-w-[31.5rem] phone:!max-w-full" />
</template>

<script lang="ts" setup>
import MemberOrder from "src/common/components/MemberOrder/Index.vue"
</script>

<style lang="scss" scoped>
#member-order {
  max-width: calc(100% - 12.625rem);
  // --neutral-02: green;
}
</style>
