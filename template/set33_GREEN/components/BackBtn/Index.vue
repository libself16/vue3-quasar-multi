<template>
  <div class="back-btn" @click="emit('back')">
    <q-icon name="fas fa-long-arrow-alt-left"></q-icon>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter()
const emit = defineEmits(["back"])

</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.back-btn
  cursor: pointer
  display: flex
  width: 5rem
  height: 40px
  padding: 8px 16px
  justify-content: center
  align-items: center
  gap: 4px
  flex-shrink: 0
  border-radius: 999px
  background: #03764D
  margin: 1rem 0
</style>
