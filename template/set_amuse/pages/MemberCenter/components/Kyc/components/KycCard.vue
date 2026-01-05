<template>
  <div class="kyc-card" v-if="props.setting.display">
    <div class="header">{{ kycLocaleSetting?.title }}</div>
    <div class="body" :class="{ 'drag-enter': dragEnter == props.setting.id }">
      <div class="kyc-placeholder" v-if="cardKycItem == undefined">
        <q-img class="dropzone-icon" :src="iconPng('kyc-placeholder')"></q-img>
        <p class="dropzone-desc" v-html="kycLocaleSetting?.description.replace(/\n/g, '<br>')"></p>
        <q-btn class="dropzone-btn" @click="triggerFileSelect($event)">{{ $t("member.kyc.dropzone_btn") }}</q-btn>
        <input
          type="file"
          :accept="fileConfig.format.join(',')"
          @change="onFileChange(props.setting.id, $event, props.setting.type)"
          class="hidden"
        />
        <p class="dropzone-limit">{{ $t("member.kyc.dropzone_limit") }}</p>
      </div>
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
            <div class="filename">{{ getFilename(cardKycItem.img!) }}</div>
            <div class="upload-date">{{ getUploadDate(cardKycItem.updated_at) }}</div>
          </div>
          <q-btn class="kyc-operation" v-if="cardKycItem.status == KYC_STATUS_CODE.Enums.PREUPLOAD">
            <q-img
              class="kyc-operation-img"
              @click="onDeleteImage(props.setting.id, props.setting.type)"
              :src="iconPng('delete')"
            ></q-img>
          </q-btn>
          <q-btn class="kyc-operation" v-else-if="cardKycItem.status == KYC_STATUS_CODE.Enums.REJECTED">
            <q-img
              class="kyc-operation-img"
              @click="onDeleteImage(props.setting.id, props.setting.type)"
              :src="iconPng('refresh')"
            ></q-img>
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
import { useSiteImg } from "app/template/set_amuse/hooks/useSiteImg"
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
  pendingImg,
  successImg,
  failedImg,
  onFileChange,
  triggerFileSelect,
  isUploadedStatus,
  uploadStatusToString,
  getUploadDate,
  getFilename,
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

const { iconPng } = useSiteImg()
</script>
