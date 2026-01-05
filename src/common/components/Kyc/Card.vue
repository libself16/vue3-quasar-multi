<template>
  <div class="kyc-card" v-if="props.setting.display">
    <div class="header">{{ kycLocaleSetting?.title }}</div>
    <div class="body" :class="{ 'drag-enter': dragEnter == props.setting.id }">
      <!-- 上傳新圖片 -->
      <div class="kyc-placeholder" v-if="cardKycItem === undefined">
        <q-img class="dropzone-icon" :src="placeholderImg"></q-img>
        <!-- <p class="dropzone-desc" v-html="kycLocaleSetting?.description.replace(/\n/g, '<br>')"></p> -->
        <q-btn class="dropzone-btn" @click="triggerFileSelect($event)" icon-right="add_circle_outline">{{
          $t("member.kyc.upload_document")
        }}</q-btn>
        <input
          type="file"
          :accept="fileConfig.format.join(',')"
          @change="onFileChange(props.setting.id, $event, props.setting.type)"
          class="hidden"
        />
        <p class="dropzone-limit">{{ $t("member.kyc.dropzone_limit") }}</p>
      </div>
      <!-- 已上傳圖片 -->
      <div class="uploaded" v-else>
        <template v-if="cardKycItem.status == KYC_STATUS_CODE.Enums.PREUPLOAD">
          <q-img
            class="preview"
            :initial-ratio="fileConfig.previewRatio"
            :ratio="fileConfig.previewRatio"
            :src="cardKycItem.img!"
          ></q-img>
        </template>
        <template v-else-if="isUploadedStatus(cardKycItem.status)">
          <div
            class="kyc-status"
            :class="uploadStatusToString(cardKycItem.status)"
            :style="{ aspectRatio: fileConfig.previewRatio }"
          >
            <q-img
              class="kyc-status-img"
              fit="contain"
              :src="pendingImg"
              v-if="cardKycItem.status == KYC_STATUS_CODE.Enums.REVIEWING"
            ></q-img>
            <q-img
              class="kyc-status-img"
              fit="contain"
              :src="successImg"
              v-else-if="cardKycItem.status == KYC_STATUS_CODE.Enums.VERIFIED"
            ></q-img>
            <q-img
              class="kyc-status-img"
              fit="contain"
              :src="failedImg"
              v-else-if="cardKycItem.status == KYC_STATUS_CODE.Enums.REJECTED"
            ></q-img>
            <p>{{ $t(`member.kyc.status_${uploadStatusToString(cardKycItem.status)}`) }}</p>
          </div>
        </template>
        <div class="info">
          <div class="stats">
            <div class="filename">{{ getFilename2(cardKycItem) }}</div>
            <div class="upload-date">{{ getUploadDate(cardKycItem.updated_time) }}</div>
          </div>
          <q-btn
            class="kyc-operation"
            v-if="
              cardKycItem.status === KYC_STATUS_CODE.Enums.PREUPLOAD ||
              cardKycItem.status === KYC_STATUS_CODE.Enums.REJECTED
            "
            @click="onDeleteImage(props.setting.id, props.setting.type)"
            flat
          >
            {{ $t("common.btn.delete") }}
          </q-btn>
        </div>
      </div>
      <div
        v-if="cardKycItem === undefined"
        class="dropzone"
        :class="{ dragging: dragging }"
        @dragenter.prevent="onDragEnter(props.setting.id)"
        @dragleave.prevent="onDragLeave()"
        @drop.prevent="dragDrop(props.setting.id, $event)"
        @dragover.prevent
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "KycCard"
}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { useKyc } from "src/common/hooks/useKyc"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import * as Response from "src/api/response.type"
import { KYC_STATUS_CODE } from "src/common/utils/constants"

const props = defineProps({
  setting: {
    type: Object as () => Response.kycSetting,
    required: true
  },
  dragging: {
    type: Boolean,
    required: true
  },
  handleWindowDragDrop: {
    type: Function,
    required: true
  }
})

const { nowLang } = useLanguage()
const { userKyc } = useUserInfo()
const {
  dragEnter,
  fileConfig,
  placeholderImg,
  pendingImg,
  successImg,
  failedImg,
  onFileChange,
  triggerFileSelect,
  isUploadedStatus,
  uploadStatusToString,
  getUploadDate,
  getFilename2,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDeleteImage
} = useKyc()

const kycLocaleSetting = computed(() => {
  return props.setting.lang.find((item) => item.code == nowLang.value)
})

const cardKycItem = computed<Response.UserKycItem | undefined>(() => {
  return userKyc.value.find((item) => item.correspondence == props.setting.id)
})

const dragDrop = (settingID: number, $event: any) => {
  onDrop(settingID, $event, props.setting.type)
  props.handleWindowDragDrop($event)
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

// 透過外層style 來修改顏色，參考 .dropzone-btn
$kyc-card-text-color: #000;
$kyc-card-color: transparent;
$kyc-card-color-on-dragenter: #555555;
$kyc-card-gap: 0;
$kyc-card-border-radius: 1.5rem;

// .kyc-card body
$kyc-card-body-gap: 0.25rem;
$kyc-card-body-color: #ffffff;
$kyc-card-body-border: 1px solid #d6d6d6;
$kyc-card-body-border-radius: calc($kyc-card-border-radius / 2);

// .dropzone
$dropzone-desc-color: #ededed;
$dropzone-limit-color: #000000;
$dropzone-btn-color: #025be8;
$dropzone-btn-text-color: #fff;
$dropzone-btn-border: #025be8;
$dropzone-btn-border-radius: 0.5rem;

// .uploaded
$uploaded-filename-color: #000000;
$uploaded-date-color: #000000;

// .kyc-status
$kyc-status-success-color: #00c253;
$kyc-status-failed-color: #f73131;
$kyc-status-pending-color: #ff9923;

.kyc-card {
  @apply relative;
  @apply flex flex-col gap-1;
  gap: $kyc-card-body-gap;
  padding: $kyc-card-gap;
  color: $kyc-card-text-color;
  background: $kyc-card-color;
  border-radius: $kyc-card-border-radius;

  .header {
    font-family: Jost;
    font-weight: 600;
    font-size: 16px;
    line-height: 1.4375rem;
  }

  .body {
    @apply relative overflow-hidden flex-1;
    @apply flex items-center justify-center gap-2;
    @apply p-4;

    background-color: $kyc-card-body-color;
    border: $kyc-card-body-border;
    border-radius: $kyc-card-body-border-radius;

    .kyc-placeholder {
      @apply max-w-[16.5625rem] min-h-[9.5rem];
      @apply flex flex-col items-center justify-center;
      @apply pointer-events-none select-none;

      .dropzone-icon {
        @apply w-[6.75rem] h-[4.1875rem] mt-4 mb-4  pointer-events-none;
      }

      .dropzone-btn {
        @apply mb-3 py-[.5938rem] px-[1.4481rem] pointer-events-auto;
        border-radius: $dropzone-btn-border-radius;
        color: $dropzone-btn-text-color;
        min-height: auto;

        :deep(.q-btn__content) {
          font-family: SegoeUI;
          font-weight: 400;
          font-size: 16px;
          line-height: 1.3125rem;
          text-align: center;
          vertical-align: middle;
          text-transform: capitalize;
          gap: 0.5rem;

          .q-icon {
            font-size: 1.25rem;
          }
        }
      }

      .dropzone-limit {
        @apply pointer-events-none;
        font-family: NotoSansTC;
        font-weight: 350;
        font-size: 14px;
        line-height: 1.0625rem;
        text-align: center;
        vertical-align: bottom;
        color: $dropzone-limit-color;
        margin-bottom: 1rem;
      }
    }

    .uploaded {
      @apply flex flex-col gap-2;
      width: 13.75rem;

      .preview {
        @apply rounded-lg;
      }

      .kyc-status {
        @apply flex flex-col items-center justify-center;
        @apply gap-1;
        background-color: #f8f8f8;
        border-radius: $kyc-card-body-border-radius;
        min-height: 8.6875rem;

        .kyc-status-img {
          @apply w-[3.75rem] h-[3.75rem];
        }

        p {
          font-family: NotoSansTC;
          font-weight: 700;
          font-size: 12px;
          line-height: 14px;
          text-align: center;
        }

        &.success {
          color: $kyc-status-success-color;
        }

        &.failed {
          color: $kyc-status-failed-color;
        }

        &.pending {
          color: $kyc-status-pending-color;
        }
      }

      .info {
        @apply max-w-full flex justify-between gap-1 py-[2px];

        .stats {
          font-family: NotoSansTC;
          font-weight: 350;
          font-size: 12px;
          line-height: 14px;
          vertical-align: bottom;
          flex-shrink: 1;
          min-width: 0;

          .filename {
            @apply truncate;
            color: $uploaded-filename-color;
          }

          .upload-date {
            color: $uploaded-date-color;
            margin-top: 0.25rem;
          }
        }

        .kyc-operation {
          @apply py-[.45rem] px-4;
          border: 1px solid #d63434;
          border-radius: 4px;
          min-height: auto;
          flex-shrink: 0;

          :deep(.q-btn__content) {
            font-family: NotoSansTC;
            font-weight: 600;
            font-size: 14px;
            line-height: 20px;
            text-wrap: nowrap;

            color: #f31212;
          }
        }
      }
    }

    .dropzone {
      @apply absolute w-full h-full left-0 top-0;
      @apply pointer-events-none;

      &.dragging {
        @apply pointer-events-auto;
      }
    }

    &.drag-enter {
      background-color: $kyc-card-color-on-dragenter;
    }
  }
}
</style>
