<template>
  <div class="relative w-fit cursor-pointer" @click="open(true)" v-if="show">
    <q-img class="w-[60px] lg:w-[120px] rounded-full" :src="commonResult('floatingIcon/round.png')" loading="lazy" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useFloatingIcon } from "src/common/hooks/useFloatingIcon"

const { allowAgentCodes } = useAgentCode()
const { commonResult } = useCommonImg()
const { open, allowAgentCode } = useFloatingIcon()

const show = computed(() => {
  return allowAgentCodes(allowAgentCode)
})
</script>
