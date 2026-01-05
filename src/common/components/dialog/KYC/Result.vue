<template>
  <q-dialog
    v-model="modelValue"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="$q.platform.is.mobile ? '0' : '300'"
    :maximized="$q.platform.is.mobile"
    persistent
  >
    <q-card :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`" class="hint-card">
      <q-card-section class="card-header">
        <img v-if="getWideLogo()" :src="getWideLogo()" alt="" />
        <!-- <q-btn icon="close" class="hide-hover" flat dense @click="closeDialog" /> -->
      </q-card-section>
      <q-card-section class="card-body">
        <q-img :src="commonResult('kyc/hint.svg')" loading="lazy" class="body-img"></q-img>
        <div class="tip">{{ $t(tip) }}</div>
      </q-card-section>
      <q-card-section class="card-footer">
        <q-btn class="btn-submit hide-hover" :class="`custom-${props.color}`" flat @click="closeDialog">
          {{ $t("common.btn.end") }}
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useLogo } from "src/common/composables/useLogo"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { KYC_VERIFIED } from "src/common/utils/constants"

const router = useRouter()
const $q = useQuasar()
const { getWideLogo } = useLogo()
const { eventOn, eventEmit } = useEventBus()
const { commonResult } = useCommonImg()

const props = defineProps<{
  color?: string
  customSuccessMsg?: string
  customFailedMsg?: string
}>()

const modelValue = ref(false)
const kycStatus = ref(KYC_VERIFIED.Enums.VERIFICATION_STATUS_PENDING)
const kycStatusI18n = [
  props.customSuccessMsg || "member.kyc.thank_you_for_verifying_with_us",
  "",
  props.customFailedMsg || "member.kyc.verification_failed",
  ""
]
const tip = computed(() => kycStatusI18n[kycStatus.value] || "")

function closeDialog() {
  eventEmit("openKycResultDialog", false, KYC_VERIFIED.Enums.VERIFICATION_STATUS_PENDING)

  if (kycStatus.value === KYC_VERIFIED.Enums.VERIFICATION_STATUS_REJECTED) {
    router.push("/")
  }
}

onMounted(async () => {
  eventOn("openKycResultDialog", async (show, status) => {
    modelValue.value = show

    if (show) {
      kycStatus.value = status
    }
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.hide-hover {
  :deep(.q-focus-helper) {
    opacity: 0 !important;
    background-color: transparent !important;
  }
}

.hint-card {
  @include hideScrollBar;
  @apply p-10 pt-0 relative;
  border-radius: 1.25rem;
  background-color: #fff;
  width: 30rem;
  max-height: calc(100% - 20px);

  @include phone-width {
    @apply w-full h-full max-w-full max-h-full min-w-0 py-7 px-3;
    background-color: #f6f7f8;
  }

  .card-header {
    @apply py-4 px-0 flex justify-between items-center;

    @include phone-width {
      @apply p-0;
    }

    img {
      height: 5rem;
      padding: 0.625rem;

      @include phone-width {
        height: 3.25rem;
        padding: 0;
      }
    }

    .q-btn {
      padding: 0;
      color: rgba(#000, 0.87);
    }
  }

  .card-body {
    @apply my-[5.3081rem] flex flex-col justify-center items-center gap-9 p-0;

    @include phone-width {
      @apply mt-8 mb-12;
    }

    .body-img {
      width: 8.75rem;
      height: 9.0625rem;
    }

    .tip {
      font-family: NotoSansTC;
      font-weight: 350;
      font-size: 14px;
      line-height: 1.0625rem;
      letter-spacing: 0.13px;
    }
  }

  .card-footer {
    @apply p-0;

    .btn-submit {
      @apply w-full py-[.375rem] rounded-lg;
      background-color: #025be8;

      &.custom-green {
        background-color: #1fab3d;
      }

      @include phone-width {
        @apply py-2;
      }

      :deep(.q-btn__content) {
        font-family: NotoSansTC;
        font-weight: 350;
        font-size: 16px;
        line-height: 28px;
        text-align: center;
        vertical-align: middle;
        text-transform: capitalize;
        color: #ffffff;
      }
    }
  }
}
</style>
