<template>
  <div class="af-bnk-box add-bnk cursor-pointer" @click="eventbus.emit('openAddBankCard', true)">
    <div class="af-bnk-add">{{ $t("member.bank.addAccount") }} +</div>
  </div>
</template>

<script setup lang="ts">
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const eventbus = injectStrict(EventBusKey)
</script>

<style scoped lang="scss"></style>
