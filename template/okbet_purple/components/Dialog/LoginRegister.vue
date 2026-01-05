<template>
  <q-dialog
    v-model="modelValue"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="$q.platform.is.mobile ? '0' : '300'"
    :maximized="$q.platform.is.mobile"
    @hide="closeDialog"
  >
    <q-card :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`" class="login-card">
      <q-card-section v-if="!$q.platform.is.mobile" class="card-left">
        <q-carousel
          v-model="slide"
          swipeable
          animated
          navigation
          infinite
          transition-prev="slide-right"
          transition-next="slide-left"
          :autoplay="3000"
        >
          <q-carousel-slide :name="2" :img-src="loginCarousel(2)" />
        </q-carousel>
      </q-card-section>
      <q-card-section class="card-right">
        <div class="close-btn-container">
          <q-btn icon="close" class="hide-hover" flat round dense v-close-popup />
        </div>
        <div class="card-right-header">
          <img v-if="getWideLogo()" :src="getWideLogo()" alt="" />
        </div>
        <div class="card-right-form">
          <PhoneLoginRegisterForm :is-password-login-mode="isPasswordLoginMode" v-if="isPhoneRegisterMode" />
          <AccountLoginRegister v-else />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useQuasar } from "quasar"
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import { useLogo } from "src/common/composables/useLogo"
import { useEnv } from "src/common/hooks/useEnv"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import PhoneLoginRegisterForm from "../Form/PhoneLoginRegister.vue"
import AccountLoginRegister from "../Form/AccountLoginRegister.vue"

const $q = useQuasar()
const { loginCarousel } = useSiteImg()
const { getWideLogo, handleLogoList } = useLogo()
const { isPhoneRegisterMode } = useEnv()
const eventbus = injectStrict(EventBusKey)

const isPasswordLoginMode = ref(false)
const modelValue = ref(false)
const slide = ref(1)

function closeDialog() {
  eventbus.emit("openLogin", false)
}

onMounted(async () => {
  await handleLogoList()

  eventbus.on("openLogin", (show: boolean, isPasswordLogin?: boolean) => {
    modelValue.value = show

    if (isPasswordLogin != null) isPasswordLoginMode.value = isPasswordLogin
  })

  eventbus.on("openRegister", (show: boolean) => {
    modelValue.value = show

    eventbus.once("registerFormReady", () => {
      eventbus.emit("changeRegisterForm")
    })
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/button.scss";
@import "app/template/okbet_purple/assets/css/_variable.sass";

.login-card {
  @include hideScrollBar;
  &.pc {
    @apply flex relative min-w-[60rem] max-w-[37.5rem] h-[41.25rem];
    border-radius: 1.25rem;
    flex-direction: row;
    -webkit-box-pack: justify;
    justify-content: space-between;
    overflow: hidden;
    background-color: $bg-dark-secondary;
    color: $text-light-secondary;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    margin: 1.875rem;
    max-height: calc(100% - 64px);
    .card-left {
      padding: 0;
      width: 30rem;
      height: 41.25rem;
      :deep(.q-carousel) {
        width: 100%;
        height: 41.25rem;
        background: $bg-dark-secondary;
        .q-carousel__slide {
          padding: 0;
          background-size: contain;
        }
        .q-carousel__control {
          bottom: 0.9375rem;
          .q-btn {
            padding: 0;
            margin: 0 0.25rem;
            opacity: 0.2;
            color: $text-light-primary;
            min-width: 0;
            min-height: 0;
            &.q-carousel__navigation-icon--active {
              opacity: 1;
              color: $bg-secondary;
            }
            .q-icon {
              font-size: 0.5rem;
              width: 0.5rem;
              min-width: 0.5rem;
            }
          }
        }
      }
    }
    .card-right {
      width: 50%;
      padding: 1.25rem 2.5rem 0.8125rem;
      overflow: hidden scroll;
      .close-btn-container {
        position: absolute;
        right: 1.25rem;
        top: 1.25rem;
        vertical-align: -0.15em;
        fill: currentcolor;
        overflow: hidden;
        display: inline-block;
        pointer-events: auto;
        .q-btn {
          padding: 0;
        }
      }
      .card-right-header {
        margin: 1.25rem 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          width: 5.625rem;
          aspect-ratio: auto 90 / 36;
        }
      }
      .card-right-form {
        color: $text-light-secondary;
      }
    }
  }
  &.h5 {
    @apply w-full h-full;
    background-color: $bg-dark-secondary;
    color: $text-light-secondary;
    overflow-x: hidden;
    .card-right {
      @apply h-full w-full p-6 pb-0 mx-auto flex justify-start items-center flex-col;
      .close-btn-container {
        @apply w-full flex justify-end items-center p-0;
        margin-top: 1.875rem;
        .q-btn {
          background: #fff;
          color: #6d7693;
        }
      }
      .card-right-header {
        margin-top: 2rem;
        margin-bottom: 4rem;
        img {
          width: auto;
          height: 8.5rem;
        }
      }
      .card-right-form {
        width: 90%;
      }
      @include phone-width {
        @apply p-3;
        .close-btn-container {
          margin-top: 1rem;
        }
        .card-right-header {
          margin-top: 1rem;
          margin-bottom: 2.125rem;
          img {
            height: 4.375rem;
          }
        }
        .card-right-form {
          width: 100%;
        }
      }
    }
  }
}
</style>
