<template>
  <q-file ref="imgFileRef" v-model="imgFile" class="hidden" @update:model-value="handleImgUpload" />
  <div class="relative cursor-pointer" @click="selectFile">
    <q-avatar>
      <img :src="getUserAvatar(headerImg('profile_imgtemp1'))" class="avatar-image" />
    </q-avatar>
  </div>
  <q-dialog v-if="$q.platform.is.mobile" v-model="showDialog" class="avatar-dialog-h5">
    <q-card>
      <q-card-section class="card-header">
        <span class="title">{{ $t("member.profile.avatarUploaded") }}</span>
      </q-card-section>
      <q-card-section class="card-body">
        <div v-if="imgBase64" class="img-cropper">
          <VueCropper ref="cropper" :img="imgBase64" :autoCrop="true" :centerBox="true" />
        </div>
      </q-card-section>
      <q-card-section class="card-footer">
        <q-btn flat class="btn-cancel hide-hover" v-close-popup>{{ $t("common.btn.cancel") }}</q-btn>
        <q-btn flat class="btn-confirm" @click="uploadAvatar">{{ $t("common.btn.confirm") }}</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-else v-model="showDialog" class="avatar-dialog-pc">
    <q-card>
      <q-card-section class="card-header">
        <span class="title">{{ $t("member.profile.avatarUploaded") }}</span>
        <q-btn icon="close" class="hide-hover" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="card-body">
        <div v-if="imgBase64" class="img-cropper">
          <VueCropper ref="cropper" :img="imgBase64" :autoCrop="true" :centerBox="true" />
        </div>
        <div class="slider-container">
          <q-btn flat icon="remove" class="hide-hover" size="sm" @click="handlSubdScale"></q-btn>
          <q-slider v-model="cropperScale" :step="0.1" :min="1" :max="3" />
          <q-btn flat icon="add" class="hide-hover" size="sm" @click="handleAddScale"></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="card-footer">
        <q-btn class="btn-cancel hide-hover" v-close-popup>{{ $t("common.btn.cancel") }}</q-btn>
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
import { useSiteImg } from "app/template/set_royalslot88/hooks/useSiteImg"
import { useEnvInfoStore } from "src/stores/envStore"

import { VueCropper } from "vue-cropper"
import "vue-cropper/dist/index.css"

const $q = useQuasar()
const { convertToBase64 } = useCommon()
const { userInfo, userInfoForm, setUserAvatar, resetUserInfoForm, getUserAvatar } = useUserInfo()
const { headerImg } = useSiteImg()
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
    resetUserInfoForm()
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

.q-avatar {
  @apply h-[7vw] w-[7vw] cursor-pointer;

  @include pad-width {
    @apply w-[12vw] h-[12vw];
  }

  .avatar-image {
    @apply p-[0.8vw];

    @include pad-width {
      @apply p-[1.3vw];
    }
  }
}

.avatar-dialog-pc {
  .q-card {
    @apply w-[520px] text-[14px] p-[20px_24px] bg-[#3b0f94];
    list-style: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    .card-header {
      @apply flex items-center justify-between p-0 mb-2;
      .title {
        @apply text-white font-semibold text-base;
      }
      .q-btn {
        :deep(.q-icon) {
          @apply text-[20px] font-normal text-white;
        }
      }
    }
    .card-body {
      padding: 0;
      .img-cropper {
        width: 100%;
        height: 27.5rem;
        :deep(.vue-cropper) {
          background: #0e0e0e;
        }
      }
      .q-btn {
        @apply p-0 mx-4;
      }
      .slider-container {
        @apply flex items-center justify-center gap-2 my-4;
        .q-slider {
          @apply w-1/2;
        }
        :deep(.q-slider__selection) {
          background: #874cfc;
        }
        :deep(.q-slider__thumb) {
          color: #874cfc;
        }
      }
    }
    .card-footer {
      @apply p-0 mt-3 flex justify-end items-center gap-2;
      .q-btn {
        @apply font-bold h-[32px] text-[14px] rounded-[6px] px-[15px] py-[4px];
        text-transform: none;
        box-shadow: 0 0.125rem 0 rgba(0, 0, 0, 0.02);
        &.btn-confirm {
          @apply text-white;
          background: #874cfc;
        }
        &.btn-cancel {
          @apply text-black;
          background: #c68de0;
        }
      }
    }
  }
}

.avatar-dialog-h5 {
  .q-card {
    @apply max-w-[620px] w-[90vw] text-white rounded-[10px] bg-[#3b0f94];
    box-shadow: rgba(0, 0, 0, 0.2) 0rem 0.6875rem 0.9375rem -0.4375rem,
      rgba(0, 0, 0, 0.14) 0rem 1.5rem 2.375rem 0.1875rem, rgba(0, 0, 0, 0.12) 0rem 0.5625rem 2.875rem 0.5rem;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
    .card-header {
      font-family: Roboto, Helvetica, Arial, sans-serif;
      letter-spacing: 0.0075em;
      padding: 1.25rem 1.5rem 1rem;
      flex: 0 0 auto;
      font-size: 2.25rem;
      font-weight: 500;
      text-align: center;
    }
    .card-body {
      @apply p-6 pt-0 flex justify-center items-center;
      .img-cropper {
        @apply w-full h-[320px];
        :deep(.vue-cropper) {
          background: #0e0e0e;
        }
      }
    }
    .card-footer {
      @apply flex items-center justify-center p-[8px] h-[100px];
      flex: 0 0 auto;
      border-top: 1px solid #c3a5fd;
      box-shadow: rgb(238, 238, 238) 0rem 0.0313rem 0rem inset;
      .q-btn {
        @apply w-full text-[36px] font-normal;
        letter-spacing: 0.02857em;
        text-transform: none;
        font-family: inherit;
        text-decoration: none;
        padding: 0.375rem 0.5rem;
        border-radius: 0.25rem;
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1),
          border-color 250ms cubic-bezier(0.4, 0, 0.2, 1), color 250ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .btn-confirm {
        @apply text-white;
      }
      .btn-cancel {
        @apply text-[#C3A5FD];
      }
    }
  }
  @include phone-width {
    .q-card {
      .card-header {
        font-size: 1.125rem;
        line-height: 1.625rem;
      }
      .card-footer {
        height: 3.4375rem;
        .q-btn {
          font-size: 1.125rem;
        }
      }
    }
  }
}
</style>
