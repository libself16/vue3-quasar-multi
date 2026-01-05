<template>
  <q-file ref="imgFileRef" v-model="imgFile" class="hidden" @update:model-value="handleImgUpload" />
  <div class="relative cursor-pointer" @click="selectFile">
    <q-avatar>
      <img :src="getUserAvatar(svgIcon('name'))" />
      <img :src="resultImages('member/edit-img.png')" class="edit-img" />
    </q-avatar>
  </div>
  <q-dialog v-if="isLargeTablet" v-model="showDialog" class="avatar-dialog-h5">
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
        <q-btn flat text-color="primary" class="btn-confirm" @click="uploadAvatar">{{
          $t("common.btn.confirm")
        }}</q-btn>
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
        <q-btn outline class="btn-cancel hide-hover" v-close-popup>{{ $t("common.btn.cancel") }}</q-btn>
        <q-btn color="primary" class="btn-confirm" @click="uploadAvatar">{{ $t("common.btn.confirm") }}</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import "vue-cropper/dist/index.css"
import { ref, Ref, watch } from "vue"
import { VueCropper } from "vue-cropper"
import { QFile, useQuasar } from "quasar"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"

const $q = useQuasar()
const { convertToBase64 } = useCommon()
const { isLargeTablet } = useMediaQuery()
const { setUserAvatar, getUserAvatar } = useUserInfo()
const { svgIcon, resultImages } = useSiteImg()

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
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/member.scss";
@import "app/template/set_r022/assets/css/button.scss";

.q-avatar {
  width: 3.75rem;
  height: 3.75rem;
  cursor: pointer;

  @include pad-large-width {
    width: 4.3125rem;
    height: 4.375rem;
  }
}

.edit-img {
  width: 1.75rem !important;
  height: 1.75rem !important;
  position: absolute;
  right: -0.5rem;
  bottom: -0.75rem;

  @include pad-large-width {
    right: -0.3rem;
    bottom: -0.45rem;
  }
}

.avatar-dialog-pc {
  .q-card {
    max-width: calc(100vw - 32px);
    width: 520px;
    box-sizing: border-box;
    color: var(---neutral-10);
    font-size: 14px;
    line-height: 1.5714285714285714;
    list-style: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    padding: 20px 24px;
    background: var(--neutral-01);
    .header {
      @apply flex items-center justify-between p-0 mb-2;
      .title {
        margin: 0;
        color: var(---neutral-10);
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
          background: rgba(0, 0, 0, 0.1);
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
        &.btn-cancel {
          &:before {
            border: 1px solid var(--primary-01);
          }
          :deep(.q-btn__content) {
            color: var(--primary-01);
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
    background-color: var(--neutral-01);
    color: var(--neutral-10);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
    .header {
      margin: 0px;
      font-family: Roboto, Helvetica, Arial, sans-serif;
      letter-spacing: 0.0075em;
      padding: 20px 24px 16px;
      flex: 0 0 auto;
      color: var(--neutral-10);
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
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }
    .footer {
      display: flex;
      align-items: center;
      padding: 8px;
      flex: 0 0 auto;
      justify-content: center;
      // border-top: 1px solid $border-pale-gray-color;
      // box-shadow: $box-shadow-pale-silver-color 0px 0.5px 0px inset;
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
        // color: $text-charcoal-gray-color;
        outline: 0px;
        border-width: 0px;
        margin: 0px;
        text-decoration: none;
        padding: 6px 8px;
        border-radius: 4px;
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1),
          border-color 250ms cubic-bezier(0.4, 0, 0.2, 1), color 250ms cubic-bezier(0.4, 0, 0.2, 1);
      }
    }
  }
  @include pad-large-width {
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
