<template>
  <q-dialog v-model="model" v-bind="attrs" @show="initDialog">
    <q-card class="varification-code-wrapper">
      <q-card-section class="row items-center q-pb-none">
        <q-btn icon="close" flat round dense class="invisible" />
        <q-space />
        <div class="text-h6">Verification Code</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="varification-code-row">
        <template v-for="(_, index) in 4" :key="index">
          <q-input
            v-model="verificationCode[index]"
            dense
            outlined
            class="input-verification-code"
            :ref="(el) => (inputRefs[index] = el)"
            maxlength="1"
            @update:model-value="(val) => handleInput(val as string, index)"
            @keydown="handleKeydown($event, index)"
            inputmode="numeric"
          >
          </q-input>
        </template>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, defineModel, useAttrs, defineEmits } from "vue"

const model = defineModel<boolean | undefined>()
const attrs = useAttrs()
const emit = defineEmits(["complete-input"])

const verificationCode = ref(["", "", "", ""])
const inputRefs = ref<any[]>([])

const handleInput = (val: string, index: number) => {
  verificationCode.value[index] = val.replace(/[^0-9]/g, "")

  if (verificationCode.value[index] && index < 3) {
    inputRefs.value[index + 1].focus()
  }

  if (verificationCode.value.findIndex((e) => e === "") === -1) {
    emit("complete-input", verificationCode.value.join(""))
  }
}

const handleKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === "Backspace" && !verificationCode.value[index] && index > 0) {
    verificationCode.value[index - 1] = ""
    inputRefs.value[index - 1].focus()
  }
}

const initDialog = () => {
  verificationCode.value = ["", "", "", ""]
  inputRefs.value[0].focus()
}
</script>

<style lang="scss" scoped>
.varification-code-wrapper {
  width: 18.75rem;

  .varification-code-row {
    @apply flex flex-nowrap justify-center gap-7;

    .input-verification-code {
      @apply w-1/4;

      :deep(.q-field__control) {
        padding: 0;
        height: 5.25rem;
        border-radius: 0.625rem;

        .q-field__native {
          font-size: 2.25rem;
          line-height: 2.25rem;
          text-align: center;
        }
      }
    }
  }
}
</style>
