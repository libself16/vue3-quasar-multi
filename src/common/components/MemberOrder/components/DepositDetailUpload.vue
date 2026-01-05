<template>
  <q-dialog v-model="depositUploadConfig.dialogOpen">
    <q-card class="detail-dialog">
      <div class="header-area">
        <div class="title">{{ $t("tableHeader.uploadDetail") }}</div>
        <q-btn icon="close" class="close-img-btn" flat round dense v-close-popup size="md" />
      </div>

      <div v-if="depositUploadConfig.dialogLoading" class="flex justify-center items-center">
        <q-circular-progress indeterminate size="50px" color="primary" />
      </div>

      <template v-else>
        <div v-if="depositUploadConfig.depositRemark?.content?.length" class="data-area">
          <div class="data-area-label">{{ $t("member.deposit.remark") }}</div>
          <div class="data-area-content">
            <div v-for="(item, index) in depositUploadConfig.depositRemark?.content" :key="index">
              {{ item.title }} : {{ item.content }}
            </div>
          </div>
        </div>

        <div class="data-area">
          <div class="data-area-label">{{ $t("common.btn.deposit") }}{{ $t("tableHeader.no") }}</div>
          <div class="data-area-content">
            {{ depositUploadConfig.transCode }}
          </div>
        </div>

        <div class="data-area">
          <div class="data-area-label">{{ $t("tableHeader.uploadDetail") }}</div>
          <div class="data-area-content uploaded">
            <div v-if="uploadReadOnly && !depositUploadConfig.images?.length" class="no-data">
              {{ $t("tableHeader.noData") }}
            </div>

            <div v-else v-for="(item, index) in depositUploadConfig.images" :key="index">
              <div class="image-area">
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

            <div v-if="!uploadReadOnly" class="upload-area" @click="openUploader">
              <img :src="orderImg('upload-icon.svg')" alt="upload" />
              <div class="text-area">
                {{ $t("member.deposit.depositDetailUploadWarning", { mb: maxSizeInMb }) }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <div class="footer-area">
        <q-btn class="cancel-btn" flat @click="closeDialog">{{ $t("common.btn.cancel") }}</q-btn>
        <q-btn
          v-if="!depositUploadConfig.dialogLoading"
          class="submit-btn"
          :disable="uploadReadOnly"
          unelevated
          :loading="depositUploadConfig.dialogUploading"
          @click="upload"
        >
          {{ $t("common.btn.submit") }}
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useFileDialog } from "@vueuse/core"
import { useQuasar } from "quasar"
import * as bankApi from "src/api/bank"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useApi } from "src/common/hooks/useApi"
import { useEnvInfoStore } from "src/stores/envStore"
import { reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useSiteImg } from "src/common/hooks/useSiteImg"

interface DepositDetailImage {
  imgData: {
    path: string
    base64: string
    upload_at: string
  }
  status: boolean
}

interface DepositUploadConfig {
  dialogOpen: boolean
  dialogLoading: boolean
  dialogUploading: boolean
  transCode: string
  images: DepositDetailImage[]
  depositRemark: null | Response.UploadRemark
}

const { t } = useI18n()
const { envInfo } = useEnvInfoStore()
const $q = useQuasar()
const { orderImg } = useSiteImg()
const depositUploadConfig = reactive<DepositUploadConfig>({
  dialogOpen: false,
  dialogLoading: true,
  dialogUploading: false,
  transCode: "",
  images: [],
  depositRemark: null
})

const uploadReadOnly = ref(false)

const openDialog = async (transCode: string, readOnly: boolean) => {
  try {
    uploadReadOnly.value = readOnly
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
    trans_code: depositUploadConfig.transCode,
    images: depositUploadConfig.images.map((item) => item.imgData.base64)
  }

  depositUploadConfig.dialogUploading = true

  const { status } = await useApi(bankApi.depositDetailUpload, parms)

  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.changeSuccess"),
      position: "top"
    })
  }

  depositUploadConfig.dialogUploading = false
  closeDialog()
}

const onDelete = async (index: number) => {
  depositUploadConfig.images.splice(index, 1)
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
      message: t("member.deposit.depositDetailUploadWarning", {
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
    if (depositUploadConfig.images.length >= 5) {
      $q.notify({
        type: "negative",
        message: t("member.deposit.depositDetailUploadExceedsMax"),
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

<style lang="scss" scoped>
.detail-dialog {
  width: 34.375rem;
  max-height: auto;
  background: var(--dialog-bg);
  padding: 1rem 1.25rem;

  .header-area {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-bottom: 1rem;

    .title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--dialog-text-01);
    }

    .close-img-btn {
      position: absolute;
      right: 0;
      top: 0;
      width: 1.5rem;
      height: 1.5rem;
      cursor: pointer;
      color: var(--text-03);
    }
  }

  .data-area {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-bottom: 0.625rem;

    .data-area-label {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-03);
    }

    .data-area-content {
      font-size: 0.875rem;
      font-weight: 400;
      color: var(--text-01);
    }
  }

  .uploaded {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;

    .no-data {
      height: 6.25rem;
      border: 2px solid var(--bg-line-03);
      background: var(--bg-17);
      color: var(--text-03);
      border-radius: 0.75rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .image-area {
      height: 6.25rem;
      border: 2px solid var(--bg-line-03);
      background: var(--bg-17);
      color: var(--text-03);
      border-radius: 0.75rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;

      img {
        height: 100%;
      }

      .delete-btn {
        position: absolute;
        right: 0.5rem;
        bottom: 0.5rem;
        z-index: 1;
      }
    }

    .upload-area {
      height: 5.1875rem;
      border: 2px dashed var(--bg-line-03);
      color: var(--text-03);
      border-radius: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      gap: 0.625rem;

      .text-area {
        width: 10.5rem;
        font-size: 0.75rem;
        font-weight: 400;
        color: var(--text-03);
      }
    }
  }

  .footer-area {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.625rem;
    margin-top: 2rem;

    .cancel-btn {
      width: 50%;
      color: var(--btn-text-04);
      border: 1px solid var(--btn-border-02);
      border-radius: 0.25rem;
    }

    .submit-btn {
      width: 50%;
      background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%);
      color: var(--btn-text-01);
    }
  }
}
</style>
