<template>
  <q-dialog v-model="withdrawalUploadConfig.dialogOpen">
    <q-card class="withdrawal-dialog">
      <template v-if="withdrawalUploadConfig.dialogLoading">
        <div class="w-full flex flex-col gap-2 items-center justify-center py-16">
          <div>{{ $t("tableHeader.uploadDetail") }}</div>
          <q-circular-progress indeterminate size="50px" class="q-ma-md" color="primary" />
        </div>
      </template>
      <template v-else>
        <q-card-section class="flex items-center justify-start !mb-0">
          <div class="mr-3">{{ $t("common.btn.withdrawal") }}{{ $t("tableHeader.no") }}</div>
          <div class="trans-code">
            {{ withdrawalUploadConfig.transCode }}
          </div>
        </q-card-section>

        <q-card-section>
          <!-- <div class="mb-2">{{ $t("tableHeader.uploadDetail") }}</div> -->
          <div class="uploaded">
            <div v-if="withdrawalUploadConfig.images.length === 0 && uploadReadOnly" class="item noData-area">
              <div class="warning">
                {{ $t("tableHeader.no_data") }}
              </div>
            </div>
            <div v-else class="mt-10">
              <div v-for="(item, index) in withdrawalUploadConfig.images" :key="index" class="mt-6">
                <p v-if="item.imgData.upload_at" class="text-center mb-2">
                  {{ dateformat(item.imgData.upload_at, "YYYY-MM-DD HH:mm:ss") }}
                </p>
                <div class="item">
                  <img :src="item.imgData.path ? item.imgData.path : item.imgData.base64" alt="" />
                  <q-btn
                    v-if="!uploadReadOnly"
                    color="red"
                    rounded
                    dense
                    icon="delete"
                    class="delete-btn"
                    size="sm"
                    @click="onDelete(index)"
                  />
                </div>
              </div>
            </div>
            <div v-if="!uploadReadOnly" class="item upload-area" @click="openUploader">
              <img :src="resultImages('icon/upload.png')" class="!w-[3.25rem] h-[3.25rem]" />
              <div class="mt-1 mb-3">{{ $t("member.deposit.uploadFile") }}</div>
              <div class="warning">
                {{ $t("member.deposit.depositDetailUploadWarning", { mb: maxSizeInMb }) }}
              </div>
            </div>
          </div>
        </q-card-section>
      </template>
      <q-card-actions v-if="!uploadReadOnly" align="right">
        <q-btn flat class="cancel-btn" @click="closeDialog">{{ $t("common.btn.cancel") }}</q-btn>
        <q-btn
          v-if="!withdrawalUploadConfig.dialogLoading"
          :disable="uploadReadOnly"
          :loading="withdrawalUploadConfig.dialogUploading"
          class="submit-btn"
          @click="upload"
          unelevated
          >{{ $t("common.btn.submit") }}</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import { reactive, ref } from "vue"
import * as bankApi from "src/api/bank"
import { useFileDialog } from "@vueuse/core"
import { useApi } from "src/common/hooks/useApi"
import type * as Request from "src/api/request.type"
import { useEnvInfoStore } from "src/stores/envStore"
import type * as Response from "src/api/response.type"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"

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

const $q = useQuasar()
const { resultImages } = useSiteImg()
const { envInfo } = useEnvInfoStore()

const withdrawalUploadConfig = reactive<WithdrawalUploadConfig>({
  dialogOpen: false,
  dialogLoading: true,
  dialogUploading: false,
  transCode: "",
  images: [],
  uploadRemark: null
})

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
.withdrawal-dialog {
  width: 30.125rem;
  color: var(--neutral-10);
  font-size: 1rem;
  padding: 2rem 1.5rem;
  background: var(--neutral-01);

  :deep(.q-card__section) {
    padding: 0;
    margin-bottom: 1rem;
  }

  .trans-code {
    color: var(--text-link);
  }

  .cancel-btn {
    background: var(--primary-04);
    border: 1px solid var(--primary-01);
    color: var(--primary-01);
    border-radius: 0.5rem;
  }

  .submit-btn {
    background: var(--primary-01);
    color: var(--text-01);
    border-radius: 0.5rem;
  }
}

.uploaded {
  @apply flex flex-col gap-6;
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
    @apply flex flex-col px-4 items-center justify-center cursor-pointer;
    @apply hover:bg-black/15 border-dashed border border-black/50;
    @apply break-all;
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
