<template>
  <span class="clock">
    {{ nowTime }}
  </span>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, onMounted, onUnmounted } from "vue"
import dayjs from "dayjs"

const props = defineProps({
  /** 時間格式 */
  timeFormat: {
    type: [String],
    required: false,
    default: () => "YYYY/MM/DD HH:mm:ss"
  },
  /** 後綴文字 */
  appendText: {
    type: [String],
    required: false,
    default: () => ""
  }
})

const nowTime = ref("")
const nowTimeTimer = ref<NodeJS.Timeout>()

onMounted(() => {
  nowTimeTimer.value = setInterval(() => {
    nowTime.value = dayjs().format(props.timeFormat) + props.appendText
  }, 1000)
})

onUnmounted(() => {
  clearInterval(nowTimeTimer.value)
})
</script>

<style lang="scss" setup></style>
