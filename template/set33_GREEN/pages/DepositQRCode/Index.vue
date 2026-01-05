<template>
  <DepositQRCode v-if="isCommonTemplate" class="set_334" />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { DEPOSIT_REDIRECT_TYPE, DEPOSIT_REDIRECT_CHANNEL } from "src/common/utils/constants"
import DepositQRCode from "src/common/components/Deposit/QRCode.vue"

const route = useRoute()
const queryType = computed(() => parseInt(route.query.type as string))
const queryChannel = computed(() => route.query.channel as string)

const commonTemplates: string[] = [
  DEPOSIT_REDIRECT_CHANNEL.Enums.GCASH,
  DEPOSIT_REDIRECT_CHANNEL.Enums.MAYA,
  DEPOSIT_REDIRECT_CHANNEL.Enums.QRPH
]
const isCommonTemplate = computed(
  () =>
    queryType.value === DEPOSIT_REDIRECT_TYPE.Enums.OpenQRCode &&
    commonTemplates.includes(queryChannel.value.toLocaleLowerCase())
)
</script>

<style scoped lang="scss">
.set_334 {
  &.deposit-qr-code-wrapper {
    @apply bg-[#f3f8f4];

    :deep(.deposit-qr-code-card) {
      @apply bg-white;

      .deposit-qr-code-card-header {
        color: #848484;
      }

      .deposit-qr-code-card-body {
        @apply bg-[#e7f8e9];

        .deposit-qr-code-card-body-amount {
          color: #000000cc;
        }

        .deposit-qr-code-card-body-currency {
          color: #848484;
        }
      }

      .deposit-qr-code-card-footer {
        border-color: #d3d3d3;
      }
    }
  }
}
</style>
