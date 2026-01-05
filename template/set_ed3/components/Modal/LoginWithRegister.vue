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
import { ref, onMounted, computed, watch, nextTick } from "vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useSiteImg } from "app/template/set_ed3/hooks/useSiteImg"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import ModalBase from "./ModalBase.vue"
import LoginForm from "./components/LoginForm.vue"
import RegisterForm from "./components/RegisterForm.vue"
import ForgotPassword from "./components/ForgotPassword.vue"

const { headerLoginBg } = useSiteImg()
const { t } = useI18n()
const route = useRoute()
const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)
const tab = ref("login")
const currentView = ref("login")
const isFromUrlParams = ref(false)

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
      isFromUrlParams.value = false
    }
  }
)

// 监听 tab 变化，当切换到注册页面时发送邀请码
watch([() => tab.value, () => modalShow.value], async ([newTab, newModalShow]) => {
  if (newModalShow && newTab === "register" && isFromUrlParams.value) {
    // 等待组件渲染完成，使用 setTimeout 确保事件监听器已注册
    await nextTick()
    setTimeout(() => {
      const inviteCode = route.query.inviteCode as string
      if (inviteCode) {
        console.log("发送邀请码事件:", inviteCode)
        eventbus.emit("setInviteCode", inviteCode)
      }
    }, 100)
  }
})

onMounted(async () => {
  // 检查 URL 参数，如果包含 inviteCode 和 redirect=register，自动打开注册页面
  const inviteCode = route.query.inviteCode as string
  const redirect = route.query.redirect as string

  if (inviteCode && redirect === "register") {
    isFromUrlParams.value = true
    // 打开模态框并切换到注册标签
    tab.value = "register"
    modalShow.value = true
  }

  // 注册 eventbus 监听器
  eventbus.on("openLoginWithRegister", (show: boolean, type?: string) => {
    // 如果是从 URL 参数打开的，忽略这个事件
    if (isFromUrlParams.value && show) {
      return
    }

    modalShow.value = show
    if (show) {
      tab.value = type || "login"
    }
  })
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed3/assets/css/_variable.scss";

.login-register-modal {
  @apply w-[43.75rem] flex;

  .image-wrapper,
  .form-wrapper {
    @apply w-1/2;
    background-color: $modal-bg-color;
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
        color: $white01;
      }
    }
  }

  .tabs-wrapper {
    @apply flex mb-[1.5rem] gap-[.625rem];

    .tab-btn {
      @apply text-[.75rem] font-semibold;
      padding: 0.3125rem 0.625rem;
      border-radius: 3rem;
      color: $white01;

      &.active {
        @apply text-white;
        background: $gradient02;
      }
    }
  }
}
</style>
