<template>
  <span class="ant-upload">
    <q-file
      ref="imgFileRef"
      v-model="imgFile"
      style="display: none"
      :max-file-size="maxFileSize"
      @update:model-value="handleImgUpload"
      accept=".jpg, image/*"
      @rejected="onRejected"
    />
    <span class="uploadBtn" @click="selectFile">+ Upload</span></span
  >
  <div
    ref="previewImage"
    class="preview-image"
    :class="`${className} ${isDragIn ? 'drag-in' : ''} ${disabled ? 'disabled' : ''}`"
    :style="{ 'aspect-ratio': aspectRatio, 'max-width': maxWidth }"
    @click="selectFile"
  ></div>
</template>

<script lang="ts" setup>
import { Ref, ref, watch, toRefs, defineEmits, computed, onMounted, onBeforeUnmount } from "vue"
import { QFile, useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
const $q = useQuasar()
const { t } = useI18n()
const props = defineProps({
  parentImage: {
    type: String,
    required: false,
    default: ""
  },
  defaultImage: {
    type: String,
    required: false,
    default: ""
  },
  imageToBase64: {
    type: Boolean,
    required: false,
    default: false
  },
  aspectRatio: {
    type: String,
    required: false,
    default: "100/100"
  },
  className: {
    type: String,
    required: false,
    default: ""
  },
  maxFileSize: {
    type: Number,
    required: false,
    default: undefined
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  detail: {
    type: Object,
    default: () => ({ tipOneSize: "", tipTwoSize: "" })
  },
  maxWidth: {
    type: String,
    required: false,
    default: ""
  }
})
const { parentImage, defaultImage, imageToBase64, aspectRatio, className, maxFileSize, disabled, maxWidth } =
  toRefs(props)
const defaultImageUrl = computed(() => defaultImage.value)
const previewImage = ref()
const isDragIn = ref(false)
const imgFileRef = ref() as Ref<QFile>
const imgFile = ref<File>()
const imgUrl = ref("")
const selectFile = () => {
  !disabled.value && imgFileRef.value.pickFiles()
}

const handleImgUpload = () => {
  if (imgFile.value) {
    if (imageToBase64.value) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target?.result as string
        imgUrl.value = base64String
      }
      reader.readAsDataURL(imgFile.value)
    } else {
      imgUrl.value = URL.createObjectURL(imgFile.value)
    }
  }
}
const emit = defineEmits(["update:modelValue", "update:imgFile", "img-uploaded"])
watch(parentImage, (newValue) => {
  imgUrl.value = newValue
  if (!newValue) {
    imgFile.value = undefined
  }
})
watch(imgUrl, (newValue) => {
  emit("update:modelValue", newValue)
})
watch(imgFile, (newValue) => {
  emit("update:imgFile", newValue)
})

function preventDefaults(e: Event) {
  e.preventDefault()
  e.stopPropagation()
}
function handleDragIn() {
  isDragIn.value = true
}
function handleDragOut() {
  isDragIn.value = false
}
function handleDrop(e: DragEvent) {
  const dt = e.dataTransfer
  const files = dt?.files as FileList
  if (files?.length > 0) {
    const file = files[0]
    const fileSizeInBytes = file.size
    if (maxFileSize?.value) {
      if (fileSizeInBytes > maxFileSize.value) {
        onRejected()
        return
      }
    }
    imgFile.value = files[0]
    handleImgUpload()
  }
}
function onRejected() {
  $q.notify({
    type: "negative",
    message: t("error_msg.file_size_exceeds_limit"),
    position: "top",
    timeout: 1000
  })
}
onMounted(() => {
  imgUrl.value = parentImage.value
  // 防止默认事件和冒泡
  ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    previewImage.value.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)
  })
  // 拖入和拖出时的样式变化
  ;["dragenter", "dragover"].forEach((eventName) => {
    previewImage.value.addEventListener(eventName, handleDragIn, false)
  })
  ;["dragleave", "drop"].forEach((eventName) => {
    previewImage.value.addEventListener(eventName, handleDragOut, false)
  })
  // 处理拖放事件
  previewImage.value.addEventListener("drop", handleDrop, false)
})
onBeforeUnmount(() => {
  // 防止默认事件和冒泡
  ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    previewImage.value.removeEventListener(eventName, preventDefaults, false)
    document.body.removeEventListener(eventName, preventDefaults, false)
  })
  // 拖入和拖出时的样式变化
  ;["dragenter", "dragover"].forEach((eventName) => {
    previewImage.value.removeEventListener(eventName, handleDragIn, false)
  })
  ;["dragleave", "drop"].forEach((eventName) => {
    previewImage.value.removeEventListener(eventName, handleDragOut, false)
  })
  // 处理拖放事件
  previewImage.value.removeEventListener("drop", handleDrop, false)
})
</script>

<style lang="scss" scoped>
@import "app/template/okbet_redBlack/assets/css/_variable.sass";

.preview-image {
  overflow: auto;
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  img {
    width: 100%;
    height: auto;
  }
  &.drag-in {
    opacity: 0.5;
  }
}
.preview-image-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding-left: 10px;
  .preview-image-icon {
    display: flex;
    flex-direction: column;
  }
  .uploader-language-detail {
    display: flex;
    flex-direction: column;
    color: red;
    text-align: left;
  }
}
.none-preview-image-icon {
  justify-content: flex-start;
}
.uploadBtn {
  display: inline-block;
  min-width: 118px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 6px;
  color: $white-color;
  background: $primary-red02;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
</style>
