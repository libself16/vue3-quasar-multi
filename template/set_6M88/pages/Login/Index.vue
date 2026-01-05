<template>
  <div class="login-wrap">
    <div class="login-logo">
      <q-img :src="logoSrc" />
    </div>
    <div class="login-tab">
      <a @click="changeTabStatus" :class="{ active: isLogin }">{{ $t("common.btn.login") }}</a>
      <a @click="changeTabStatus" :class="{ active: !isLogin }">{{ $t("common.btn.register") }}</a>
    </div>
    <div class="login-content">
      <LoginForm v-if="isLogin" />
      <RegisterForm v-else />
    </div>
    <div class="login-media">
      <q-btn flat @click="contactUs">
        <q-icon size=".875rem" name="fa-solid fa-headset" class="mr-2"></q-icon>
        <div>{{ $t("home.contact_us") }}</div>
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue"
import { useLogo } from "src/common/composables/useLogo"
import LoginForm from "./LoginForm.vue"
import RegisterForm from "./RegisterForm.vue"
import { useRouter, useRoute } from "vue-router"
import { useLanguage } from "src/common/composables/useLanguage"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"

const { getWideLogo, handleLogoList } = useLogo()
const router = useRouter()
const route = useRoute()
const isLogin = ref(true)
const { getAgentSetting } = useLanguage()
const { handleGetPixelCodes } = usePixelCodes()

watch(
  () => route.query.type,
  (newType) => {
    if (newType === "register") {
      isLogin.value = false
    } else {
      isLogin.value = true
    }
  },
  { immediate: true }
)

const logoSrc = computed(() => {
  const wideLogo = getWideLogo()
  return wideLogo || ""
})

const changeTabStatus = () => {
  isLogin.value = !isLogin.value
}

const redirectionContact = () => {
  router.push({ name: "ContactUs" })
}

const contactUs = () => {
  const link = "https://chat.6m88.info"
  window.open(link, "_blank")
}

onMounted(async () => {
  await getAgentSetting()
  await handleLogoList()
  await handleGetPixelCodes()
})
</script>

<style lang="scss">
@import "../../assets/css/style.css";

.login-wrap {
  @apply h-[100dvh] bg-[#f8fafc];
}
</style>
