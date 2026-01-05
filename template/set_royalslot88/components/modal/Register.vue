<template>
  <ModalBase v-model="modalShow" modal-class="modal_share_custom" use-title :title="$t('common.btn.register')">
    <PhoneRegisterForm v-if="isPhoneRegisterMode" />
    <AccountRegisterForm v-else />
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

import ModalBase from "./modalBase.vue"
import PhoneRegisterForm from "../Form/PhoneRegister.vue"
import AccountRegisterForm from "../Form/AccountRegister.vue"

const { isPhoneRegisterMode } = useEnv()

const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)
const { handleTriggerPixelCode } = usePixelCodes()

onMounted(() => {
  eventbus.on("openRegister", (show: boolean) => {
    modalShow.value = show

    if (show) {
      handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_REGISTER)
    }
  })
})
</script>

<style scoped lang="scss"></style>
