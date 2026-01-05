<template>
  <q-file ref="imgFileRef" v-model="imgFile" class="hidden" @update:model-value="handleImgUpload" />
  <div class="relative cursor-pointer" @click="selectFile">
    <q-avatar>
      <img v-if="accountInfo.avatar_path" :src="`${envInfo.baseApi}/${accountInfo.avatar_path}`" />
      <img v-else :src="memberCenterImage('avatar-default')" class="default-avatar" />
    </q-avatar>
  </div>
  <q-dialog v-if="isMobile" v-model="showDialog" class="avatar-dialog-h5">
    <q-card>
      <q-card-section class="header">
        <span class="title">{{ $t("member.profile.uploadImage") }}</span>
      </q-card-section>
      <q-card-section class="body">
        <div v-if="imgBase64" class="img-cropper">
          <VueCropper ref="cropper" :img="imgBase64" :autoCrop="true" :centerBox="true" />
        </div>
      </q-card-section>
      <q-card-section class="footer">
        <q-btn flat class="btn-cancel hide-hover" v-close-popup>{{ $t("common.btn.cancel") }}</q-btn>
        <q-btn flat class="btn-confirm" @click="uploadAvatar">{{ $t("common.btn.confirm") }}</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-else v-model="showDialog" class="avatar-dialog-pc">
    <q-card>
      <q-card-section class="header">
        <span class="title">{{ $t("member.profile.avatarUploaded") }}</span>
        <q-btn icon="close" class="hide-hover" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="body">
        <div v-if="imgBase64" class="img-cropper">
          <VueCropper ref="cropper" :img="imgBase64" :autoCrop="true" :centerBox="true" />
        </div>
        <div class="slider-container">
          <q-btn flat icon="remove" class="hide-hover" size="sm" @click="handlSubdScale"></q-btn>
          <q-slider v-model="cropperScale" :step="0.1" :min="1" :max="3" />
          <q-btn flat icon="add" class="hide-hover" size="sm" @click="handleAddScale"></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="footer">
        <q-btn flat class="btn-cancel hide-hover" v-close-popup>{{ $t("common.btn.cancel") }}</q-btn>
        <q-btn class="btn-confirm" @click="uploadAvatar">{{ $t("common.btn.confirm") }}</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from "vue"
import { QFile, useQuasar } from "quasar"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useEnvInfoStore } from "src/stores/envStore"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

import { VueCropper } from "vue-cropper"
import "vue-cropper/dist/index.css"

const $q = useQuasar()
const { convertToBase64 } = useCommon()
const { accountInfo, setUserAvatar } = useUserInfo()
const { memberCenterImage } = useSiteImg()
const { envInfo } = useEnvInfoStore()
const { isMobile } = useMediaQuery()

const imgFileRef = ref() as Ref<QFile>
const imgFile = ref<File>()
const cropper = ref()
const imgBase64 = ref("")
const showDialog = ref(false)
const cropperScale = ref(1)

const selectFile = () => {
  imgFileRef.value.pickFiles()
}

const handleImgUpload = async () => {
  if (imgFile.value) {
    const { status, data, msg } = await convertToBase64(imgFile.value)
    if (!status) {
      $q.notify({
        type: "negative",
        position: "top",
        message: msg,
        icon: "warning",
        timeout: 1000
      })
      return
    }
    if (data) {
      imgFile.value = undefined
      imgBase64.value = data
      showDialog.value = true
    }
  }
}

const handleAddScale = () => {
  if (cropperScale.value >= 3) return
  cropperScale.value += 0.1
}

const handlSubdScale = () => {
  if (cropperScale.value <= 1) return
  cropperScale.value -= 0.1
}

const uploadAvatar = async () => {
  if (cropper.value) {
    cropper.value.getCropData(async (data: string) => {
      const { status } = await setUserAvatar(data)
      if (status) {
        imgFile.value = undefined
        imgBase64.value = ""
        showDialog.value = false
      }
    })
  }
}

watch(cropperScale, (newValue, oldValue) => {
  if (cropper.value) {
    if (newValue > oldValue) {
      cropper.value.changeScale(1)
      return
    }
    cropper.value.changeScale(-1)
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

$black: #000;
.q-avatar {
  width: 3.75rem;
  height: 3.75rem;
  box-shadow: $shadow01;

  .default-avatar {
    height: 2.25rem !important;
    width: auto !important;
    border-radius: initial !important;
  }
}

.avatar-dialog-pc {
  .q-card {
    @include fontStyle();
    max-width: calc(100vw - 32px);
    width: 520px;
    box-sizing: border-box;
    color: $primary04;
    padding: 20px 24px;

    .header {
      @apply flex items-center justify-between p-0 mb-2;
      .title {
        margin: 0;
        color: $primary04;
        font-weight: 600;
        font-size: 16px;
        line-height: 1.5;
        word-wrap: break-word;
      }
      .q-btn {
        min-width: auto;
        min-height: auto;

        :deep(.q-icon) {
          font-size: 20px;
          font-weight: 400;
        }
      }
    }
    .body {
      padding: 0;
      .img-cropper {
        width: 100%;
        height: 27.5rem;
        :deep(.vue-cropper) {
          background: rgba($black, 0.1);
          .crop-point {
            background-color: $primary04;
          }
        }
      }
      .q-btn {
        @apply p-0 mx-4;
      }
      .slider-container {
        @apply flex items-center justify-center gap-2 my-4;
        .q-slider {
          @apply w-1/2;

          :deep(.q-slider__thumb) {
            color: $primary04;
          }

          :deep(.q-slider__selection) {
            background: $primary04;
          }
        }
      }
    }
    .footer {
      @apply p-0 mt-3 flex justify-end items-center gap-2;
      .q-btn {
        @include fontStyle();
        border-radius: 0.625rem;
        min-height: auto;
        padding: 0.6875rem 1rem;

        &.btn-confirm {
          background: $gradient01;
          color: $neutral01;
        }
      }
    }
  }
}
.avatar-dialog-h5 {
  .q-card {
    max-width: 38.75rem;
    width: 90vw;
    max-height: calc(100% - 64px);
    border-radius: 0.625rem;
    color: $primary04;
    box-shadow: rgba($black, 0.2) 0px 11px 15px -7px, rgba($black, 0.14) 0px 24px 38px 3px,
      rgba($black, 0.12) 0px 9px 46px 8px;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);

    .header {
      @include fontStyle(2.25rem);
      margin: 0px;
      letter-spacing: 0.0075em;
      padding: 20px 24px 16px;
      flex: 0 0 auto;
      text-align: center;
    }
    .body {
      @apply p-6 pt-0 flex justify-center items-center;
      .img-cropper {
        width: 100%;
        height: 31.25rem;
        :deep(.vue-cropper) {
          background: rgba($black, 0.1);
          .crop-point {
            background-color: $primary04;
          }
        }
      }
    }
    .footer {
      display: flex;
      align-items: center;
      padding: 8px;
      flex: 0 0 auto;
      justify-content: center;
      border-top: 1px solid #e5ebf2;
      box-shadow: #f0f1f4 0px 0.5px 0px inset;
      height: 100px;

      .q-btn {
        @include fontStyle(2.25rem);
        letter-spacing: 0.02857em;
        min-width: 64px;
        width: 100%;
        text-transform: none;
        color: #414655;
        outline: 0px;
        border-width: 0px;
        margin: 0px;
        text-decoration: none;
        padding: 6px 8px;
        border-radius: 4px;
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1),
          border-color 250ms cubic-bezier(0.4, 0, 0.2, 1), color 250ms cubic-bezier(0.4, 0, 0.2, 1);
        &.btn-confirm {
          color: $primary04;
        }
      }
    }
  }
  @include phone-width {
    .q-card {
      .header {
        font-size: 1.125rem;
        line-height: 1.625rem;
      }
      .body {
        .img-cropper {
          height: 15.625rem;
        }
      }
      .footer {
        height: 3.4375rem;
        .q-btn {
          font-size: 1.125rem;
        }
      }
    }
  }
}
</style>
