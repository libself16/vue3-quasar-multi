<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center bg-[#140433]">
    <q-spinner color="white" size="3em" />
  </div>
</template>

<script setup lang="ts">
import { useMayaMiniApp } from "src/common/composables/useMayaMiniApp"
import { onMounted } from "vue"

const { loginBySessionID } = useMayaMiniApp()
onMounted(loginBySessionID)
</script>
