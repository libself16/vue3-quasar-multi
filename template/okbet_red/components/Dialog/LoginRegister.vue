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
      <q-card-section class="card-right">
        <div class="close-btn-container">
          <img v-if="getWideLogo()" :src="getWideLogo()" alt="" />
          <q-btn icon="close" class="hide-hover" flat round dense v-close-popup />
        </div>
        <!-- <div class="card-right-header">
          <img v-if="getWideLogo()" :src="getWideLogo()" alt="" />
        </div> -->
        <div class="card-right-form">
          <!-- <PhoneLoginRegisterForm :is-password-login-mode="isPasswordLoginMode" v-if="isPhoneRegisterMode" />
          <AccountLoginRegister v-else /> -->
          <ModeLoginRegister />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/okbet_red/hooks/useSiteImg"
import { useQuasar } from "quasar"
import { useLogo } from "src/common/composables/useLogo"
import { useEnv } from "src/common/hooks/useEnv"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, ref } from "vue"
import ModeLoginRegister from "../Form/ModeLoginRegister.vue"

const $q = useQuasar()
const { loginCarousel } = useSiteImg()
const { getWideLogo } = useLogo()
const { isPhoneRegisterMode } = useEnv()
const eventbus = injectStrict(EventBusKey)

const isPasswordLoginMode = ref(false)
const modelValue = ref(false)
const slide = ref(1)

function closeDialog() {
  eventbus.emit("openLogin", false)
}

onMounted(async () => {
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
@import "app/template/okbet_red/assets/css/_variable.sass";
@import "app/template/okbet_red/assets/css/button.scss";

.login-card {
  @include hideScrollBar;
  &.pc {
    border-radius: 1.25rem;
    min-width: 30rem;
    width: auto;
    height: 42rem;
    position: relative;
    display: flex;
    flex-direction: row;
    -webkit-box-pack: justify;
    justify-content: space-between;
    overflow: hidden;
    background-size: contain;
    background-repeat: no-repeat;
    background-color: $background-light-color;
    color: rgba($text-dark-color, 0.87);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    margin: 1.875rem;
    max-height: calc(100% - 20px);
    max-width: 37.5rem;
    .card-left {
      padding: 0;
      width: 30rem;
      height: 41.25rem;
      :deep(.q-carousel) {
        width: 100%;
        height: 41.25rem;
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
            color: $text-dark-color;
            min-width: 0;
            min-height: 0;
            &.q-carousel__navigation-icon--active {
              opacity: 1;
              color: $text-vibrant-blue-color;
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
      width: 100%;
      padding: 0rem 2.5rem 0.8125rem;
      overflow: hidden scroll;
      position: relative;
      .close-btn-container {
        position: sticky;
        width: 100%;
        background-color: $background-light-color;
        z-index: 2;
        padding-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        padding-top: 1rem;
        top: 0rem;
        vertical-align: -0.15em;
        fill: currentcolor;
        overflow: hidden;
        pointer-events: auto;
        img {
          height: 5rem;
          padding: 0.625rem;
        }
        .q-btn {
          padding: 0;
          color: #fafafa;
        }
      }
      .card-right-header {
        margin: 1.25rem 0;
        position: sticky;
        top: 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          width: 5.625rem;
          aspect-ratio: auto 90 / 36;
        }
      }
      .card-right-form {
        color: rgba($text-dark-color, 0.87);
        margin-top: 20px;
      }
    }
  }
  &.h5 {
    width: 100%;
    height: 100%;
    background-image: url("app/template/okbet_red/assets/images/login/bg-h5.jpg");
    background-size: cover;
    background-position: center top;
    overflow-x: hidden;
    .card-right {
      @apply h-full w-full p-6 pb-0 mx-auto flex justify-start items-center flex-col;
      .close-btn-container {
        @apply w-full flex justify-between items-center;
        margin-top: 1.875rem;
        .q-btn {
          background: #f8d7d7;
          color: #732626;
        }
        img {
          padding: 0 0.625rem;
          max-width: calc(100% - 2.125rem);
          max-height: 4.625rem;
          height: 100% !important;
          width: auto;
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
