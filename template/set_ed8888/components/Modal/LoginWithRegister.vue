<template>
  <ModalBase
    v-model="modalShow"
    template-type="secondary"
    use-title
    :title="$t('common.btn.login')"
    max-width="56.25rem"
    modal-class="secondary-modal"
    border-radius="1.0625rem"
  >
    <section class="login-register-modal">
      <div class="image-wrapper">
        <q-img :src="headerLoginBg" class="login-bg" lazy-load />
      </div>
      <div class="form-wrapper">
        <div class="close-btn" @click="modalShow = false">
          <i class="fas fa-times text-lg"></i>
        </div>
        <template v-if="currentView === 'login'">
          <div class="tabs-wrapper">
            <button
              v-for="tabItem in tabs"
              :key="tabItem.name"
              class="tab-btn"
              :class="{ active: tab === tabItem.name }"
              @click="tab = tabItem.name"
            >
              {{ tabItem.label }}
            </button>
          </div>
          <LoginForm v-if="tab === 'login'" @switch-view="handleViewSwitch" />
          <RegisterForm v-else />
        </template>
        <ForgotPassword v-else @back="currentView = 'login'" />
      </div>
    </section>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useSiteImg } from "app/template/set_ed8888/hooks/useSiteImg"
import { useI18n } from "vue-i18n"
import ModalBase from "./ModalBase.vue"
import LoginForm from "./components/LoginForm.vue"
import RegisterForm from "./components/RegisterForm.vue"
import ForgotPassword from "./components/ForgotPassword.vue"

const { headerLoginBg } = useSiteImg()
const { t } = useI18n()
const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)
const tab = ref("")
const currentView = ref("login")

const tabs = computed(() => [
  { name: "login", label: t("common.btn.login") },
  { name: "register", label: t("home.signUp") }
])

const handleViewSwitch = (view: string) => {
  currentView.value = view
}

watch(
  () => modalShow.value,
  (newValue) => {
    if (!newValue) {
      currentView.value = "login"
      tab.value = "login"
    }
  }
)

onMounted(() => {
  eventbus.on("openLoginWithRegister", (show: boolean, type?: string) => {
    modalShow.value = show
    tab.value = type || "login"
  })
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/_variable.scss";

.login-register-modal {
  @apply w-[43.75rem] flex;

  .image-wrapper,
  .form-wrapper {
    @apply w-1/2;
  }

  @include pad-large-width() {
    @apply w-full;

    .image-wrapper {
      @apply hidden;
    }

    .form-wrapper {
      @apply w-full;
    }
  }

  .login-bg {
    @apply w-full h-full object-cover;
  }

  .form-wrapper {
    @apply p-[2rem] relative;

    .close-btn {
      @apply absolute top-4 right-4 cursor-pointer;

      i {
        color: $primary-color;
      }
    }
  }

  .tabs-wrapper {
    @apply flex mb-[1.5rem] gap-[.625rem];

    .tab-btn {
      @apply text-[.75rem] font-semibold;
      padding: 0.3125rem 0.625rem;
      border-radius: 3rem;
      background: transparent;
      color: $header-text-gray;

      &.active {
        @apply text-white;
        background: $header-bg-color;
      }
    }
  }
}
</style>
