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
      <q-card-section v-show="step === STEP_TYPE.step1" class="card-step-1">
        <q-img :src="commonResult('kyc/hint.svg')" loading="lazy" class="body-img"></q-img>
        <ul class="tips">
          <li class="tip">Step 1 {{ $t("member.kyc.select_a_valid_id_document") }}</li>
          <li class="tip">Step 2 {{ $t("member.kyc.upload_id_photo") }}</li>
          <li class="tip">Step 3 {{ $t("member.kyc.waiting_for_review") }}</li>
        </ul>
        <q-btn class="btn-step-1 hide-hover" :class="`custom-${props.color}`" flat @click="goStep2">
          {{ $t("member.kyc.go_to_verification") }}
        </q-btn>
      </q-card-section>
      <q-card-section v-show="step === STEP_TYPE.step2" class="card-step-2">
        <div class="kyc-cards">
          <template v-for="setting in kycSetting" :key="setting">
            <KycCard
              :setting="setting"
              :dragging="dragging"
              :handleWindowDragDrop="handleWindowDragDrop"
              :color="props.color"
            />
          </template>
        </div>
        <ul class="upload-tips">
          <li>{{ $t("member.kyc.reminder") }}：</li>
          <li>{{ $t("member.kyc.one_photo_is_required") }}</li>
          <li>{{ $t("member.kyc.only_jpg_and_png_files_allowed_size_2mb") }}</li>
        </ul>
        <q-btn class="btn-step-2 hide-hover" :class="`custom-${props.color}`" flat @click="handleStep2Submit">
          {{ $t("member.kyc.go_to_verification") }}
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useQuasar } from "quasar"
import { useLogo } from "src/common/composables/useLogo"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useKyc } from "src/common/hooks/useKyc"
import KycCard from "src/common/components/Kyc/Card2.vue"

enum STEP_TYPE {
  step1 = "1",
  step2 = "2"
}
const $q = useQuasar()
const { getWideLogo } = useLogo()
const { eventOn, eventEmit } = useEventBus()
const { commonResult } = useCommonImg()
const { handleSubmit, kycSetting, getKycItem, getKycSetting, dragging, handleWindowDragDrop } = useKyc()

const props = defineProps<{
  color?: string
}>()

const modelValue = ref(false)
const step = ref(STEP_TYPE.step1)

async function goStep2() {
  step.value = STEP_TYPE.step2

  await getKycItem()
  await getKycSetting()
}

async function handleStep2Submit() {
  const status = await handleSubmit()

  if (status) {
    closeDialog()
    eventEmit("openKycResultDialog", true, 0)
    // 發送 KYC 完成事件（成功）
    eventEmit("kycUploadCompleted", true)
  } else {
    // 發送 KYC 完成事件（失敗）
    eventEmit("kycUploadCompleted", false)
  }
}

function closeDialog() {
  eventEmit("openKycUploadDialog", false)
}

onMounted(async () => {
  eventOn("openKycUploadDialog", async (show: boolean) => {
    modelValue.value = show
    if (show) {
      step.value = STEP_TYPE.step1
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

  .card-step-1 {
    @apply mt-[3.5269rem] flex flex-col justify-center items-center gap-9 p-0;

    @include phone-width {
      @apply mt-8;
    }

    .body-img {
      width: 8.75rem;
      height: 9.0625rem;
    }

    .tips {
      @apply w-full flex flex-col gap-5;

      .tip {
        font-family: NotoSansTC;
        font-weight: 350;
        font-size: 14px;
        line-height: 1.0625rem;
        letter-spacing: 0.13px;
      }
    }

    .btn-step-1 {
      @apply mt-[1.6462rem] w-full py-[.375rem] rounded-lg;
      background-color: #025be8;

      @include phone-width {
        @apply mt-3 py-2;
      }

      &.custom-green {
        background-color: #1fab3d;
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

  .card-step-2 {
    @apply p-0 mt-[1.3388rem];

    &.custom-green {
      background-color: #1fab3d;
    }

    .kyc-cards {
      @apply flex flex-col justify-center items-center gap-5 min-h-[13.8125rem];
    }

    .upload-tips {
      @apply mt-8;

      li {
        font-family: NotoSansTC;
        font-weight: 350;
        font-size: 14px;
        line-height: 1.0625rem;
        vertical-align: middle;
      }
    }

    .btn-step-2 {
      @apply mt-[1.3388rem] w-full py-[.375rem] rounded-lg;
      background-color: #025be8;

      &.custom-green {
        background-color: #1fab3d;
      }

      @include phone-width {
        @apply mt-12 py-2;
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
