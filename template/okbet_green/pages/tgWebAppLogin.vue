<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center">
    <q-spinner color="primary" size="3em" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"

const { handleMiniAppLogin } = useTelegram()
onMounted(handleMiniAppLogin)
</script>
