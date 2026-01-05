<template>
  <q-dialog v-model="depositUploadConfig.dialogOpen" no-backdrop-dismiss>
    <q-card class="min-w-[300px] max-w-[400px] bg-[#700E0E] text-white">
      <template v-if="depositUploadConfig.dialogLoading">
        <div class="w-full flex flex-col gap-2 items-center justify-center py-16">
          <div class="text-h6">{{ $t("tableHeader.uploadDetail") }}</div>
          <q-circular-progress indeterminate size="50px" class="q-ma-md" color="primary" />
        </div>
      </template>
      <template v-else>
        <q-card-section>
          <div class="text-h6">{{ $t("member.deposit.remark") }}</div>
          <div>
            <div v-for="(item, index) in depositUploadConfig.depositRemark?.content" :key="index">
              {{ item.title }} : {{ item.content }}
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-h6 mb-2">{{ $t("tableHeader.uploadDetail") }}</div>
          <div class="uploaded">
            <div class="item" v-for="(item, index) in depositUploadConfig.images" :key="index">
              <img :src="item.image" alt="" />
              <q-btn
                color="red"
                rounded
                dense
                icon="delete"
                class="delete-btn"
                size="sm"
                @click="onDelete(index)"
              ></q-btn>
            </div>
            <div class="item upload-area" @click="openUploader">
              <q-icon name="add" size="32px"></q-icon>
              <div class="warning">
                {{ $t("member.deposit.depositDetailUploadWarning", { mb: maxSizeInMb }) }}
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />
      </template>
      <q-card-actions align="right">
        <q-btn color="grey" flat @click="closeDialog">{{ $t("common.btn.cancel") }}</q-btn>
        <q-btn
          v-if="!depositUploadConfig.dialogLoading"
          unelevated
          @click="upload"
          :loading="depositUploadConfig.dialogUploading"
          class="bg-[#F00] text-white rounded-[3.125rem]"
          >{{ $t("common.btn.submit") }}</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
interface DepositDetailImage {
  image: string
  status: boolean
}

interface DepositUploadConfig {
  dialogOpen: boolean
  dialogLoading: boolean
  dialogUploading: boolean
  transCode: string
  images: DepositDetailImage[]
  depositRemark: null | Response.DepositRemark
  depositPaymentDetailExtraRemark: null | Response.ExtraRemark[]
}

import { useQuasar } from "quasar"
import { ref, reactive } from "vue"
import { useFileDialog } from "@vueuse/core"
import { useApi } from "src/common/hooks/useApi"
import { useLanguage } from "src/common/composables/useLanguage"
import * as bankApi from "src/api/bank"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"

const $q = useQuasar()
const depositUploadConfig = reactive<DepositUploadConfig>({
  dialogOpen: false,
  dialogLoading: true,
  dialogUploading: false,
  transCode: "",
  images: [],
  depositRemark: null,
  depositPaymentDetailExtraRemark: null
})

const { nowLang } = useLanguage()

const openDialog = async (transCode: string) => {
  try {
    depositUploadConfig.transCode = transCode

    depositUploadConfig.dialogOpen = true
    await getDepositRemark(transCode)
    depositUploadConfig.dialogLoading = false
  } catch (error) {
    depositUploadConfig.dialogLoading = false
  }
}

const closeDialog = () => {
  depositUploadConfig.dialogOpen = false
  resetConfig()
}

const resetConfig = () => {
  depositUploadConfig.dialogLoading = true
  depositUploadConfig.images = []
  depositUploadConfig.transCode = ""
}

const getDepositRemark = async (transCode: string) => {
  const { status, data } = await useApi(bankApi.depositRemark, transCode)

  if (status) {
    depositUploadConfig.depositRemark = data
    depositUploadConfig.images = depositUploadConfig.depositRemark.images.map((item) => ({
      image: item,
      status: true
    }))
  }
}

const upload = async () => {
  const parms: Request.DepositDetailUpload = {
    trans_code: depositUploadConfig.transCode,
    images: depositUploadConfig.images.map((item) => item.image)
  }

  depositUploadConfig.dialogUploading = true

  const { status } = await useApi(bankApi.depositDetailUpload, parms)

  if (status) {
    $q.notify({
      type: "positive",
      message: $t("common.alarm.changeSuccess"),
      position: "top"
    })
  }

  depositUploadConfig.dialogUploading = false
  closeDialog()
}

const onDelete = async (index: number) => {
  depositUploadConfig.images.splice(index, 1)
}

const { open, onChange } = useFileDialog({
  accept: "image/jpeg, image/png",
  directory: false
})

const openUploader = () => {
  open()
}

const maxSizeInMb = 5
onChange((files) => {
  if (files?.length === 0) return
  const reader = new FileReader()

  // 檢查檔案大小是否超過 5MB
  const maxSizeInBytes = maxSizeInMb * 1024 * 1024
  if (files![0].size > maxSizeInBytes) {
    $q.notify({
      type: "negative",
      message: $t("member.deposit.depositDetailUploadWarning", {
        mb: maxSizeInMb
      }),
      position: "top"
    })
    return
  }

  reader.onload = () => {
    const img: DepositDetailImage = {
      image: reader.result as string,
      status: false
    }

    // max 3 images
    if (depositUploadConfig.images.length >= 3) {
      $q.notify({
        type: "negative",
        message: $t("member.deposit.depositDetailUploadExceedsMax"),
        position: "top"
      })
      return
    }

    // max 1 mb

    depositUploadConfig.images.push(img)
  }

  reader.readAsDataURL(files![0])
})

defineExpose({
  openDialog
})
</script>

<style lang="scss">
@import "app/template/okbet_redBlack/assets/css/_variable.sass";

.uploaded {
  @apply flex flex-col gap-4;
  .item {
    @apply relative;
    @apply border border-black/20 rounded overflow-hidden;
    img {
      @apply w-full;
    }

    .delete-btn {
      @apply p-2 absolute right-4 bottom-4;
    }
  }
  .upload-area {
    @apply aspect-video bg-black/5 rounded;
    @apply flex flex-col gap-2 px-4 items-center justify-center cursor-pointer;
    @apply hover:bg-black/15 border-dashed border border-white/50;
    @apply break-all;
    .warning {
      @apply text-sm;
    }
  }
}
</style>
