<template>
  <div class="btn-back">
    <q-icon size="md" name="west" @click="router.back()" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()
</script>

<style lang="sass" scoped>
.btn-back
  width: 4.5rem
  height: 2.4375rem
  display: flex
  justify-content: center
  align-items: center
  background: #03764D
  border-radius: 999px
  cursor: pointer
</style>
