<template>
  <div class="register-page">
    <div class="register-container column">
      <div class="register-logo">
        <img :src="logoSrc" alt="logo" />
      </div>

      <LoginRegisterNavBar />

      <div class="register-form w-full">
        <RegisterForm />
      </div>

      <div class="contact-us" @click="redirectionContact">
        <i class="fa-solid fa-headset"></i>
        <span>{{ $t("home.contact_us") }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue"

import { useLogo } from "src/common/composables/useLogo"
import LoginRegisterNavBar from "../../components/LoginRegisterNavBar/index.vue"
import RegisterForm from "./RegisterForm.vue"
import { useRouter } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

const { getWideLogo, handleLogoList } = useLogo()
const router = useRouter()

const logoSrc = computed(() => {
  const wideLogo = getWideLogo()
  return wideLogo || ""
})

const redirectionContact = () => {
  router.push({ name: "ContactUs" })
}

onMounted(async () => {
  await handleLogoList()

  const { usePixelCodes } = await import("src/common/hooks/usePixelCodes")
  const { handleGetPixelCodes, handleTriggerPixelCode } = usePixelCodes()
  await handleGetPixelCodes()
  handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_REGISTER)
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";
@import "../../assets/css/main.scss";

.register-page {
  @apply flex w-full h-full min-h-screen justify-center pb-[10px];
  font-family: "Poppins", sans-serif;
  background-color: $dark-bg;
  padding-top: 15%;

  .register-container {
    @apply w-full max-w-[991px] items-center px-[20px];
  }

  .register-logo {
    @apply mb-[20px];

    img {
      @apply w-full h-auto max-w-[200px] max-h-[40px];
      object-fit: contain;
      object-position: center;
    }
  }

  .register-form {
    background: #2b2b2b;
    box-shadow: #f0e47f 0.125rem 0.125rem 0.5rem -0.25rem;
    border-radius: 0px 0px 0.625rem 0.625rem;
    padding: 1.25rem;
  }
}

.contact-us {
  @apply flex justify-center items-center cursor-pointer mt-4;
  color: $primary;

  i {
    @apply mr-[4px];
  }

  &:hover {
    @apply text-white;
  }
}
</style>
