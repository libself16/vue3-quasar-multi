<template>
  <div class="register-wrapper">
    <RegisterFormPhone v-if="isPhoneRegisterMode" />
    <RegisterFormAccount v-else />
  </div>
</template>

<script lang="ts" setup>
import { useEnv } from "src/common/hooks/useEnv"
import RegisterFormPhone from "./RegisterFormPhone.vue"
import RegisterFormAccount from "./RegisterFormAccount.vue"

const { isPhoneRegisterMode } = useEnv()
</script>
