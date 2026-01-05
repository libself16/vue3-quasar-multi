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
          <img v-if="getWideLogo()" :src="getWideLogo()" />
          <q-btn icon="close" class="hide-hover" flat round dense v-close-popup />
        </div>
        <div class="card-right-form">
          <ModeLoginRegister />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useQuasar } from "quasar"
import { useLogo } from "src/common/composables/useLogo"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import ModeLoginRegister from "../Form/ModeLoginRegister.vue"

const $q = useQuasar()
const { getWideLogo, handleLogoList } = useLogo()
const eventbus = injectStrict(EventBusKey)

const isPasswordLoginMode = ref(false)
const modelValue = ref(false)

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
@import "app/template/okbet_blue/assets/css/button.scss";
@import "app/template/okbet_blue/assets/css/_variable.sass";

.login-card {
  @include hideScrollBar;
  &.pc {
    @apply flex relative min-w-[30rem] max-w-[30rem] h-[41.25rem];
    border-radius: 1.25rem;
    flex-direction: row;
    -webkit-box-pack: justify;
    justify-content: space-between;
    overflow: hidden;
    background-color: $bg-dark-secondary;
    color: $text-tertiary;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    margin: 1.875rem;
    max-height: calc(100% - 64px);
    .card-right {
      @apply w-full relative;
      padding: 0 2.5rem 0.8125rem;
      overflow: hidden scroll;
      .close-btn-container {
        @apply sticky w-full z-[2] top-0;
        padding-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        padding-top: 1rem;
        vertical-align: -0.15em;
        fill: currentcolor;
        overflow: hidden;
        pointer-events: auto;
        background-color: $primary-bg-light-blue;
        img {
          height: 5rem;
          padding: 0.625rem;
        }
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
        color: $text-tertiary;
      }
    }
  }
  &.h5 {
    @apply w-full h-full;
    background-color: $bg-dark-secondary;
    background-image: url("app/template/okbet_blue/assets/images/login/bg-h5.jpg");
    color: $text-tertiary;
    overflow-x: hidden;
    ::v-deep(.q-field__native) {
      @apply text-white;
    }
    .card-right {
      @apply h-full w-full p-6 pb-0 mx-auto flex justify-start items-center flex-col;
      .close-btn-container {
        @apply w-full flex justify-between items-center;
        margin-top: 1.875rem;

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
          @apply justify-between;
          margin-top: 1rem;
        }
        .card-right-header {
          margin-top: 1rem;
          margin-bottom: 2.125rem;
        }
        img {
          height: 4.375rem;
        }
        .card-right-form {
          width: 100%;
        }
      }
    }
  }
}
</style>
