<template>
  <q-dialog v-model="internalModelValue" persistent class="cover">
    <div class="modal">
      <img @click="closeDialog" class="close" :src="commonSvgIcon('close')" />
      <div class="logo-area">
        <slot name="title"></slot>
        <!-- <img class="logo" src="src/common/assets/images/modal/modal-logo.png" /> -->
        <!-- <img class="title" src="src/common/assets/images/modal/modal-title.png" /> -->
      </div>
      <div class="modal-form" style="max-width: 380px">
        <slot name="form"></slot>
        <slot name="copyright"></slot>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(["update:modelValue"])

const { commonSvgIcon } = useCommonImg()

const internalModelValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    internalModelValue.value = newValue
  }
)

const closeDialog = () => {
  internalModelValue.value = false
  emit("update:modelValue", false)
}

watch(internalModelValue, (newValue) => {
  emit("update:modelValue", newValue)
})
</script>

<style lang="sass" scoped>
@import "src/css/modal.sass"
</style>
