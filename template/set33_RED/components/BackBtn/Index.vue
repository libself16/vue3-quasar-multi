<template>
  <div class="back-btn" @click="emit('back')">
    <q-img :src="backIcon" class="back-btn-icon" fit="contain" />
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set33_RED/hooks/useSiteImg"

const { backIcon } = useSiteImg()

const emit = defineEmits(["back"])
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set33_RED/assets/css/_variable.sass";

.back-btn {
  @apply flex cursor-pointer justify-center items-center gap-1;
  @apply w-[5rem] h-[2.5rem] p-[.5rem_1rem] flex-shrink-0;
  border-radius: 3.125rem;
  background: $bg-gradient-green01;
  margin: 1rem 0;

  .back-btn-icon {
    @apply w-[2.25rem] h-[4.5rem];
  }
}
</style>
