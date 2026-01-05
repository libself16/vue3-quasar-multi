<template>
  <q-file ref="imgFileRef" v-model="imgFile" class="hidden" @update:model-value="handleImgUpload" />
  <div class="relative cursor-pointer" @click="selectFile">
    <q-avatar>
      <img :src="getUserAvatar(svgIcon('name'))" />
    </q-avatar>
    <span v-if="$q.platform.is.mobile" class="icon-edit"></span>
  </div>
  <q-dialog v-if="$q.platform.is.mobile" v-model="showDialog" class="avatar-dialog-h5">
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
          <q-slider v-model="cropperScale" :step="0.1" :min="1" :max="3" color="avatar-slider" />
          <q-btn flat icon="add" class="hide-hover" size="sm" @click="handleAddScale"></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="footer">
        <q-btn outline class="btn-cancel hide-hover" v-close-popup>{{ $t("common.btn.cancel") }}</q-btn>
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
import { useSiteImg } from "app/template/okbet_blackGold/hooks/useSiteImg"
import { useEnvInfoStore } from "src/stores/envStore"

import { VueCropper } from "vue-cropper"
import "vue-cropper/dist/index.css"

const $q = useQuasar()
const { convertToBase64 } = useCommon()
const { userInfo2, setUserAvatar, getUserAvatar } = useUserInfo()
const { svgIcon, logoImg } = useSiteImg()
const { envInfo } = useEnvInfoStore()

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
@import "app/template/okbet_blackGold/assets/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/member.scss";
@import "app/template/okbet_blackGold/assets/css/button.scss";

.q-avatar {
  width: 6.75rem;
  height: 6.75rem;

  @include pad-width {
    width: 7.375rem;
    height: 7.375rem;
  }

  @include phone-width {
    width: 5.125rem;
    height: 5.125rem;
  }
}
.icon-edit {
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 2.5rem;
  height: 2.5rem;
  background-image: url("app/template/okbet_blackGold/assets/images/svg/avatar-edit.svg");
  background-size: contain;
  @include phone-width {
    width: 1.25rem;
    height: 1.25rem;
    right: 0;
    bottom: 0;
  }
}

.avatar-dialog-pc {
  .q-card {
    max-width: calc(100vw - 32px);
    width: 520px;
    box-sizing: border-box;
    background-color: #1e1e1e;
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    line-height: 1.5714285714285714;
    list-style: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    padding: 20px 24px;
    .header {
      @apply flex items-center justify-between p-0 mb-2;
      .title {
        margin: 0;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 600;
        font-size: 16px;
        line-height: 1.5;
        word-wrap: break-word;
      }
      .q-btn {
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
          background: rgba($color: #fff, $alpha: 0.4);
          .cropper-view-box {
            outline-color: $secondary-gold-color;
          }
          .crop-point {
            background-color: $primary-gold-color;
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
          :deep(.text-avatar-slider) {
            color: $primary-gold-color;
          }
        }
      }
    }
    .footer {
      @apply p-0 mt-3 flex justify-end items-center gap-2;
      .q-btn {
        font-size: 14px;
        line-height: 1.5714285714285714;
        height: 32px;
        padding: 4px 15px;
        border-radius: 6px;
        text-transform: none;
        font-weight: 400;
        &.btn-confirm {
          background: $primary-gradient-color;
          color: #1e1e1e;
        }
        &.btn-cancel {
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
          &:before {
            border-color: $secondary-gold-color;
          }
          :deep(.q-btn__content) {
            color: $secondary-gold-color;
          }
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
    background-color: #1e1e1e;
    color: rgba(255, 255, 255, 0.9);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 11px 15px -7px, rgba(0, 0, 0, 0.14) 0px 24px 38px 3px,
      rgba(0, 0, 0, 0.12) 0px 9px 46px 8px;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
    .header {
      margin: 0px;
      font-family: Roboto, Helvetica, Arial, sans-serif;
      letter-spacing: 0.0075em;
      padding: 20px 24px 16px;
      flex: 0 0 auto;
      color: rgba(255, 255, 255, 0.9);
      font-size: 2.25rem;
      font-weight: 500;
      line-height: 3.25rem;
      text-align: center;
    }
    .body {
      @apply p-6 pt-0 flex justify-center items-center;
      .img-cropper {
        width: 100%;
        height: 31.25rem;
        :deep(.vue-cropper) {
          background: rgba($color: #fff, $alpha: 0.4);
          .cropper-view-box {
            outline-color: $secondary-gold-color;
          }
          .crop-point {
            background-color: $primary-gold-color;
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
      border-top: 1px solid #c0c0c0;
      box-shadow: rgb(238, 238, 238) 0px 0.5px 0px inset;
      height: 100px;
      .q-btn {
        line-height: 1.75;
        letter-spacing: 0.02857em;
        min-width: 64px;
        width: 100%;
        text-transform: none;
        font-family: inherit;
        font-weight: 400;
        font-size: 2.25rem;
        color: rgb(65, 70, 85);
        outline: 0px;
        border-width: 0px;
        margin: 0px;
        text-decoration: none;
        padding: 6px 8px;
        border-radius: 4px;
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1),
          border-color 250ms cubic-bezier(0.4, 0, 0.2, 1), color 250ms cubic-bezier(0.4, 0, 0.2, 1);

        &.btn-confirm {
          color: $secondary-gold-color;
        }
        &.btn-cancel {
          color: #c0c0c0;
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
