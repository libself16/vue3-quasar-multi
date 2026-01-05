<template>
  <q-dialog v-model="withdrawalUploadConfig.dialogOpen">
    <q-card class="min-w-[300px] max-w-[400px] my-custom-bg text-white">
      <template v-if="withdrawalUploadConfig.dialogLoading">
        <div class="w-full flex flex-col gap-2 items-center justify-center py-16">
          <div class="text-h6">{{ $t("tableHeader.uploadDetail") }}</div>
          <q-circular-progress indeterminate size="50px" class="q-ma-md" color="primary" />
        </div>
      </template>
      <template v-else>
        <q-card-section>
          <div class="text-h6">{{ $t("member.withdrawal.remark") }}</div>
          <div>
            <div v-for="(item, index) in withdrawalUploadConfig.uploadRemark?.content" :key="index">
              {{ item.title }} : {{ item.content }}
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-h6">{{ $t("common.btn.withdrawal") }}{{ $t("tableHeader.no") }}</div>
          <div>
            <div>
              {{ withdrawalUploadConfig.transCode }}
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-h6 mb-2">{{ $t("tableHeader.uploadDetail") }}</div>
          <div class="uploaded">
            <div v-if="withdrawalUploadConfig.images.length === 0 && uploadReadOnly" class="item noData-area">
              <div class="warning">
                {{ "無資料" }}
              </div>
            </div>
            <div v-else v-for="(item, index) in withdrawalUploadConfig.images" :key="index">
              <p>{{ dateformat(item.imgData.upload_at, "YYYY-MM-DD HH:mm:ss") }}</p>
              <div class="item">
                <img :src="item.imgData.path ? item.imgData.path : item.imgData.base64" alt="" />
                <q-btn
                  color="red"
                  rounded
                  dense
                  icon="delete"
                  class="delete-btn"
                  size="sm"
                  @click="onDelete(index)"
                  v-if="!uploadReadOnly"
                ></q-btn>
              </div>
            </div>
            <div v-if="!uploadReadOnly" class="item upload-area" @click="openUploader">
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
        <q-btn color="white" flat @click="closeDialog">{{ $t("common.btn.cancel") }}</q-btn>
        <q-btn
          class="submit-btn"
          :disable="uploadReadOnly"
          v-if="!withdrawalUploadConfig.dialogLoading"
          unelevated
          @click="upload"
          :loading="withdrawalUploadConfig.dialogUploading"
          >{{ $t("common.btn.submit") }}</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
interface WithdrawalDetailImage {
  imgData: {
    path: string
    base64: string
    upload_at: string
  }
  status: boolean
}

interface WithdrawalUploadConfig {
  dialogOpen: boolean
  dialogLoading: boolean
  dialogUploading: boolean
  transCode: string
  images: WithdrawalDetailImage[]
  uploadRemark: null | Response.UploadRemark
}

import { useFileDialog } from "@vueuse/core"
import { useQuasar } from "quasar"
import * as bankApi from "src/api/bank"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useLanguage } from "src/common/composables/useLanguage"
import { useApi } from "src/common/hooks/useApi"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useEnvInfoStore } from "src/stores/envStore"
import { reactive, ref } from "vue"

const { envInfo } = useEnvInfoStore()
const $q = useQuasar()
const withdrawalUploadConfig = reactive<WithdrawalUploadConfig>({
  dialogOpen: false,
  dialogLoading: true,
  dialogUploading: false,
  transCode: "",
  images: [],
  uploadRemark: null
})

const { nowLang } = useLanguage()

const uploadReadOnly = ref(false)

const openDialog = async (transCode: string, readOnly: boolean) => {
  try {
    uploadReadOnly.value = readOnly
    withdrawalUploadConfig.transCode = transCode

    withdrawalUploadConfig.dialogOpen = true
    await getWithdrawalRemark(transCode)
    withdrawalUploadConfig.dialogLoading = false
  } catch (error) {
    withdrawalUploadConfig.dialogLoading = false
  }
}

const closeDialog = () => {
  withdrawalUploadConfig.dialogOpen = false
  resetConfig()
}

const resetConfig = () => {
  withdrawalUploadConfig.dialogLoading = true
  withdrawalUploadConfig.images = []
  withdrawalUploadConfig.transCode = ""
}

const getWithdrawalRemark = async (transCode: string) => {
  const { status, data } = await useApi(bankApi.withdrawalRemark, transCode)

  if (status) {
    withdrawalUploadConfig.uploadRemark = data
    withdrawalUploadConfig.images = withdrawalUploadConfig.uploadRemark.images.map((item) => ({
      imgData: {
        path: `${envInfo.baseApi}/${item.path}?v=${item.upload_at}`,
        base64: item.base64,
        upload_at: item.upload_at
      },
      status: true
    }))
  }
}

const upload = async () => {
  const parms: Request.UploadDetailUpload = {
    trans_code: withdrawalUploadConfig.transCode,
    images: withdrawalUploadConfig.images.map((item) => item.imgData.base64)
  }

  withdrawalUploadConfig.dialogUploading = true

  const { status } = await useApi(bankApi.withdrawalDetailUpload, parms)

  if (status) {
    $q.notify({
      type: "positive",
      message: $t("common.alarm.changeSuccess"),
      position: "top"
    })
  }

  withdrawalUploadConfig.dialogUploading = false
  closeDialog()
}

const onDelete = async (index: number) => {
  withdrawalUploadConfig.images.splice(index, 1)
  console.log(withdrawalUploadConfig.images)
}

const { open, reset, onChange } = useFileDialog({
  accept: "image/jpeg, image/png",
  directory: false
})

const openUploader = () => {
  reset()
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
    const img = {
      imgData: {
        base64: reader.result as string,
        path: "",
        upload_at: ""
      },
      status: false
    }

    // max 3 images
    if (withdrawalUploadConfig.images.length >= 5) {
      $q.notify({
        type: "negative",
        message: $t("member.deposit.depositDetailUploadExceedsMax"),
        position: "top"
      })
      return
    }

    // max 1 mb

    withdrawalUploadConfig.images.push(img)

    console.log(withdrawalUploadConfig.images)
  }

  reader.readAsDataURL(files![0])
})

defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>
.my-custom-bg {
  border-radius: 24px;
  background: #015839;
}
.submit-btn {
  border-radius: 50px;
  border: 1px solid #96c61e;
  background: linear-gradient(180deg, #a4cf20 0%, #3b8512 100%);
}
.uploaded {
  @apply flex flex-col gap-4;
  .item {
    @apply relative;
    @apply rounded overflow-hidden;
    border: 1px solid #47b83d;
    img {
      @apply w-full;
    }

    .delete-btn {
      @apply p-2 absolute right-4 bottom-4;
    }
  }
  .upload-area {
    @apply aspect-video rounded;
    @apply flex flex-col gap-2 px-4 items-center justify-center cursor-pointer;
    @apply border-dashed border;
    @apply break-all;
    border-radius: 10px;
    border: 4px dashed #47b83d;
    background: #0a3a20;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
      0px 3px 1px -2px rgba(0, 0, 0, 0.12);
    .warning {
      @apply text-sm;
    }
  }
  .noData-area {
    @apply aspect-video bg-black/5 rounded;
    @apply flex flex-col gap-2 px-4 items-center justify-center;
    @apply border border-black/50;
    @apply break-all;
  }
}
</style>
