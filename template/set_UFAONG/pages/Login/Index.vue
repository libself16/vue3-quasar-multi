<template>
  <div class="login-page">
    <div class="login-container column">
      <div class="login-logo">
        <img :src="logoSrc" alt="logo" />
      </div>

      <LoginRegisterNavBar />

      <div class="login-form w-full">
        <LoginForm />
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
import LoginForm from "./LoginForm.vue"
import { useRouter } from "vue-router"

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
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";
@import "../../assets/css/main.scss";

.login-page {
  @apply flex w-full h-full min-h-screen justify-center pb-[10px];
  font-family: "Poppins", sans-serif;
  background-color: $dark-bg;
  padding-top: 15%;

  .login-container {
    @apply w-full max-w-[991px] items-center px-[20px];
  }

  .login-logo {
    @apply mb-[20px];

    img {
      @apply w-full h-auto max-w-[200px] max-h-[40px];
      object-fit: contain;
      object-position: center;
    }
  }

  .login-form {
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
