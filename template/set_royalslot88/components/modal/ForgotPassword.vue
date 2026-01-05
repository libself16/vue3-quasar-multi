<template>
  <ModalBase v-model="modalShow" modal-class="modal_share_custom">
    <PhoneForgotPasswordForm v-if="isPhoneRegisterMode" />
    <AccountForgotPasswordForm v-else />
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

import ModalBase from "./modalBase.vue"
import PhoneForgotPasswordForm from "../Form/PhoneForgotPassword.vue"
import AccountForgotPasswordForm from "../Form/AccountForgotPassword.vue"

const { isPhoneRegisterMode } = useEnv()

const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)

onMounted(() => {
  eventbus.on("openForgotPassword", (show: boolean) => {
    modalShow.value = show
  })
})
</script>

<style scoped lang="scss"></style>
