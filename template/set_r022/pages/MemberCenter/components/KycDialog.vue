<template>
  <q-dialog
    v-model="showDialog"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="isLargeTablet ? '0' : '300'"
    :maximized="isLargeTablet"
  >
    <q-card class="kyc-dialog">
      <div v-if="isLargeTablet" class="mobile-header">
        <q-btn icon="arrow_back_ios" class="hide-hover" flat round dense @click="handlerClickBack()" />
        <div class="header-text">{{ $t("member.kyc.kyc_verify") }}</div>
      </div>

      <div v-if="step === 1" class="step-1">
        <div class="header-area">
          <div class="header-text">{{ $t("member.kyc.kyc_status") }}</div>
          <q-btn v-if="!isLargeTablet" icon="close" class="hide-hover" flat round dense @click="showDialog = false" />
        </div>

        <div class="step-area">
          <div v-for="(item, index) in stepList" :key="index" class="step-item" :class="{ 'mt-3': index }">
            <div class="step">Step {{ index + 1 }}</div>
            <div class="label">{{ item.label }}</div>
            <div class="content-area">
              <div class="content-area-left">
                <div>{{ item.text }}</div>
                <ul v-if="item.itemList.length" class="item-list">
                  <li v-for="(e, idx) in item.itemList" :key="idx">
                    {{ e }}
                  </li>
                </ul>
              </div>
              <div class="content-area-right">
                <img :src="item.imgUrl" alt="" class="step-img" />
              </div>
            </div>
          </div>

          <q-btn flat class="btn-style hide-hover mt-[3.25rem]" @click="changeStep(2)">
            {{ $t("common.btn.startNow") }}
          </q-btn>
        </div>
      </div>

      <div v-else-if="step === 2" class="step-2">
        <div class="header-area two">
          <div v-if="!isLargeTablet" class="back">
            <q-btn icon="arrow_back_ios" class="hide-hover" size="sm" flat round dense @click="changeStep(1)" />
          </div>
          <div class="header-text">{{ $t("member.kyc.uploadID") }}</div>
          <q-btn v-if="!isLargeTablet" icon="close" class="hide-hover" flat round dense @click="showDialog = false" />
        </div>

        <div class="upload-area">
          <div class="upload-img" v-for="(imgitem, index) in formData.imgs" :key="index">
            <div class="upload-wrap" v-if="formData.imgs[index].imgs === ''">
              <PreviewImage
                :parentImage="formData.imgs[index].imgs"
                :aspectRatio="'212/120'"
                :max-file-size="2097152"
                @update:modelValue="updateListImgUrl($event, index)"
                imageToBase64
              />
            </div>

            <div class="upload-wrap" v-else>
              <div class="photo-wrap">
                <img :src="formData.imgs[index].imgs" class="identity-photo" />
                <svg
                  class="id-delete css-5oc719"
                  style="height: 20px; width: 20px; cursor: pointer"
                  viewBox="0 0 24 24"
                  @click="removePic(index)"
                >
                  <circle cx="12" cy="12" r="10" fill="#F23C3B"></circle>
                  <circle cx="12" cy="12" r="7.714" fill="#fff"></circle>
                  <path
                    d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2.983 14.46l-1.395-1.387 3.051-3.07-3.07-3.05 1.395-1.396 3.07 3.051 3.05-3.07 1.396 1.388-3.05 3.069 3.069 3.05-1.387 1.396-3.07-3.05-3.05 3.069z"
                    fill="#F23C3B"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <q-btn flat class="btn-style hide-hover mt-8" :disable="disableStep2Btn" @click="handleSubmit()">
            {{ $t("common.btn.submit") }}
          </q-btn>
        </div>
      </div>

      <div v-else-if="step === 3" class="step-3">
        <div class="header-area three">
          <div class="header-text wating">{{ $t("member.kyc.kyc_status") }}</div>
          <q-btn v-if="!isLargeTablet" icon="close" class="hide-hover" flat round dense @click="showDialog = false" />
        </div>

        <div class="step-area">
          <div class="flex flex-col items-center justify-center">
            <img
              :src="resultImages(`member/icon-waiting${$q.dark.isActive ? '-dark' : ''}.png`)"
              class="w-[3.6875rem] h-[3.6875rem]"
            />
            <div class="result-text wating">
              {{ $t("member.kyc.result") }}
            </div>
          </div>

          <q-btn flat class="btn-style hide-hover mt-8" @click="showDialog = false">
            {{ $t("common.btn.close") }}
          </q-btn>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import PreviewImage from "./PreviewImage.vue"
import { onMounted, ref, reactive, computed, watch } from "vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"

export type ImageItem = {
  id: number
  member_id: number
  imgs: string
}

const emit = defineEmits(["update:modelValue"])
const props = defineProps({
  modelValue: Boolean
})

const $q = useQuasar()
const { t } = useI18n()
const { resultImages } = useSiteImg()
const { setUserKyc } = useUserInfo()
const { isLargeTablet } = useMediaQuery()

const step = ref(1)
const showDialog = ref(props.modelValue)
const stepList = ref([
  {
    label: "Choose a VALID ID TYPE",
    text: "Choose Recommend IDs for Quick Verification within 3 minutes; Other IDs may take up to 24 hours",
    itemList: [],
    imgUrl:
      "data:image/png;base64,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"
  },
  {
    label: "Upload ID Photo",
    text: "Take a picture of your ID or select from your album. Make sure it clearly shows your:",
    itemList: ["Full Name", "ID Photo", "Date of Birth"],
    imgUrl:
      "data:image/png;base64,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"
  },
  {
    label: "Confirm Information",
    text: "Double-check all scanned details from your ID.",
    itemList: [],
    imgUrl:
      "data:image/png;base64,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"
  }
])
const formData = reactive({
  imgs: [] as ImageItem[]
})

const disableStep2Btn = computed(() => {
  const imgList = formData.imgs.filter((entry) => entry.imgs.startsWith("data:image")).map((entry) => entry.imgs)
  return imgList.length < 1
})

const changeStep = (num: number) => {
  step.value = num
}

const handlerClickBack = () => {
  switch (step.value) {
    case 2:
      changeStep(1)
      break
    default:
      showDialog.value = false
      break
  }
}

const delImgId: number[] = []
const updateListImgUrl = (value: string, index: number) => {
  const imgData = formData.imgs[index]
  imgData.imgs = value
  //只要是更換圖
  if (value.includes("base64,")) {
    if (imgData.id !== -1) {
      delImgId.push(imgData.id)
    }
  }
  //如果是最後一張圖上傳再開啟下一個
  if (formData.imgs.length < 5 && imgData.id == -1 && value.includes("base64,")) {
    imgData.id = 0
    formData.imgs.push({
      id: -1,
      member_id: 0,
      imgs: ""
    })
  }
}

const removePic = (index: number) => {
  if (
    index >= 0 &&
    index < formData.imgs.length &&
    formData.imgs[index].imgs !== "" &&
    formData.imgs[index].id !== -1
  ) {
    delImgId.push(formData.imgs[index].id)
    formData.imgs.splice(index, 1)
  }
}

const handleSubmit = async () => {
  const base64Imgs = formData.imgs.filter((entry) => entry.imgs.startsWith("data:image")).map((entry) => entry.imgs)
  if (base64Imgs.length < 1) {
    $q.notify({
      type: "negative",
      message: t("error_message.pleaseUploadImg"),
      position: "top",
      timeout: 1000
    })
    return
  }
  const sendData = {
    imgs: base64Imgs
  }
  const { status } = await setUserKyc(sendData)
  if (status) {
    changeStep(3)
  }
}

watch(
  () => props.modelValue,
  (val) => {
    showDialog.value = val
  }
)
watch(showDialog, (val) => {
  emit("update:modelValue", val)
})

onMounted(() => {
  if (formData.imgs.length < 5) {
    formData.imgs.push({
      id: -1,
      member_id: 0,
      imgs: ""
    })
  }
})
</script>
<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/button.scss";

.kyc-dialog {
  width: 31.4375rem;
  background: var(--neutral-01);
  box-shadow: none;
  border-radius: 0.5rem;

  .mobile-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--secondary-01);
    font-size: 1.125rem;
    padding: 0.5625rem 0.5rem;
    background: var(--bg-headerbottom);
    border-bottom: 0.045625rem solid var(--primary-07);

    .header-text {
      width: 100%;
      text-align: center;
    }
  }

  .header-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--neutral-10);
    font-size: 1.5rem;
    margin-bottom: 3rem;
    padding: 2rem 1.5rem 0;

    @include pad-large-width {
      padding: 0.75rem;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      border-bottom: 0.045625rem solid var(--neutral-07);
      color: var(--secondary-01);
    }

    &.two {
      margin-bottom: 2.3125rem;

      @include pad-large-width {
        margin-bottom: 1.25rem;
      }
    }

    &.three {
      margin-bottom: 1.5rem;
    }

    .back {
      border: 0.0425rem solid var(--primary-01);
      color: var(--primary-01);
      padding: 0.42625rem 1.23875rem;
      border-radius: 0.340625rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      :deep(.q-btn) {
        min-width: unset;
        min-height: unset;
      }
    }

    .header-text {
      width: 100%;
      text-align: center;

      &.wating {
        text-align: left;
      }

      @include pad-large-width {
        text-align: left;
      }
    }
  }

  .btn-style {
    width: 100%;
    height: 2.75rem;
    background: var(--primary-01);
    color: var(--text-01);
    border-radius: 0.5rem;

    &.disabled {
      background: var(--primary-09) !important;
      opacity: 1 !important;
    }
  }

  .step-1,
  .step-3 {
    width: 100%;

    .step-area {
      padding: 0 1.5rem 2rem;

      @include pad-large-width {
        padding: 0 0.75rem 30vh;
      }

      .step-item {
        width: 100%;

        .step {
          color: var(--primary-01);
          font-size: 0.875rem;
        }

        .label {
          color: var(--secondary-01);
          font-size: 1rem;
          margin: 0.25rem 0 0.5rem;
        }

        .content-area {
          color: var(--primary-02);
          font-size: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          background: var(--primary-07);
          display: flex;
          align-items: center;
          justify-content: center;

          .content-area-left {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .item-list {
              margin-top: 0.5rem;
              margin-left: 1rem;

              li {
                list-style: disc;
                margin-top: 0.25rem;
                color: var(--secondary-01);

                &::marker {
                  color: var(--primary-01);
                }

                &:first-child {
                  margin-top: 0;
                }
              }
            }
          }

          .content-area-right {
            .step-img {
              width: 7rem;
              height: 4.375rem;
            }
          }
        }
      }

      .result-text {
        color: var(--secondary-01);

        &.wating {
          margin-top: 1.5rem;
        }
      }
    }
  }

  .step-2 {
    .upload-area {
      padding: 0 1.5rem 2rem;

      @include pad-large-width {
        padding: 0 0.75rem;
      }

      .upload-img {
        width: 100%;
        height: 15.25rem;
        border: 1px solid var(--neutral-03);
        border-radius: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin-top: 1.6875rem;

        &:first-child {
          margin-top: 0;
        }

        .upload-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          position: relative;

          .photo-wrap {
            position: relative;

            .identity-photo {
              width: 203px;
              height: 122px;
              border-radius: 8px;
              position: relative;
              z-index: 1;
            }

            .id-delete {
              height: 20px;
              width: 20px;
              cursor: pointer;
              position: absolute;
              right: -10px;
              top: -10px;
              z-index: 2;
            }
          }
        }
      }
    }
  }
}
</style>
