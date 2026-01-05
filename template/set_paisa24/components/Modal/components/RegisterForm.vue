<template>
  <div class="register-wrapper">
    <RegisterFormPhone v-if="isPhoneRegisterMode" />
    <RegisterFormAccount v-else />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"
import { useEnv } from "src/common/hooks/useEnv"
import RegisterFormPhone from "./RegisterFormPhone.vue"
import RegisterFormAccount from "./RegisterFormAccount.vue"

const { isPhoneRegisterMode } = useEnv()
const { handleTriggerPixelCode } = usePixelCodes()

onMounted(() => {
  handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_REGISTER)
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_paisa24/assets/css/_variable.scss";
@import "app/template/set_paisa24/assets/css/form.scss";
</style>
