<template>
  <div class="deposit-qr-code-wrapper">
    <img :src="depositChannelImg(queryChannel)" class="deposit-qr-code-wrapper-logo" />
    <div class="deposit-qr-code-card">
      <div class="deposit-qr-code-card-header">
        {{ $t("member.deposit.ensureSecureTransaction") }}
      </div>
      <div class="deposit-qr-code-card-body">
        <div class="deposit-qr-code-card-body-amount">{{ moneyFormat(queryAmount) }}</div>
        <div class="deposit-qr-code-card-body-currency">
          {{ $t("member.deposit.depositCurrency") }} ({{ queryCurrency }})
        </div>
      </div>
      <div class="deposit-qr-code-card-footer">
        <QRCode v-model="queryContent" :size="260" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useLanguage } from "src/common/composables/useLanguage"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import QRCode from "src/common/components/QRCode/Index.vue"

const route = useRoute()
const { getAgentSetting } = useLanguage()
const { moneyFormat } = useCommon()
const { depositChannelImg } = useCommonImg()

const queryChannel = computed(() => route.query.channel as string)
const queryCurrency = computed(() => route.query.currency as string)
const queryAmount = computed(() => route.query.amount as string)
const queryContent = computed(() => route.query.content as string)

onMounted(async () => {
  await getAgentSetting()
})
</script>

<style scoped lang="scss">
@mixin subText() {
  font-family: NotoSans;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.1875rem;
}

.deposit-qr-code-wrapper {
  @apply w-[100vw] h-[100vh];
  @apply flex flex-col items-center justify-center gap-3;

  .deposit-qr-code-wrapper-logo {
    @apply h-[1.8125rem] w-auto;
  }

  .deposit-qr-code-card {
    @apply max-w-[21.25rem] max-h-[29.375rem];
    @apply p-6 rounded-[1.25rem];
    @apply flex flex-col items-center justify-center gap-[.5625rem];
    box-shadow: 0px 0px 7px 0px #0000001a;

    .deposit-qr-code-card-header {
      @include subText();
    }

    .deposit-qr-code-card-body {
      @apply w-full py-3 rounded-lg;
      @apply flex flex-col items-center justify-center gap-1;

      .deposit-qr-code-card-body-amount {
        font-family: NotoSans;
        font-weight: 700;
        font-size: 20px;
        line-height: 27px;
      }

      .deposit-qr-code-card-body-currency {
        @include subText();
      }
    }

    .deposit-qr-code-card-footer {
      @apply w-full p-4 rounded-lg;
      border: 1px solid;
    }
  }
}
</style>
