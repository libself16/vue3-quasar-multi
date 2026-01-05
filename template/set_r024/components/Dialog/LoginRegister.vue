<template>
  <q-dialog
    v-model="modelValue"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="$q.platform.is.mobile ? '0' : '300'"
    :maximized="$q.platform.is.mobile"
  >
    <q-card :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`" class="login-card">
      <q-card-section class="card-right">
        <div class="close-btn-container">
          <img v-if="getWideLogo()" :src="getWideLogo()" alt="" />
          <q-btn icon="close" class="hide-hover" flat round dense @click="closeDialog" />
        </div>
        <div class="card-right-form">
          <ModeLoginRegister ref="formRef" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import { useLogo } from "src/common/composables/useLogo"
import { useEventBus } from "src/common/hooks/useEventBus"
import { usePromotionRegister } from "src/common/composables/usePromotionRegister"
import { onMounted, ref } from "vue"
import ModeLoginRegister from "../Form/ModeLoginRegister.vue"

const $q = useQuasar()
const { getWideLogo } = useLogo()
const { eventOn, eventEmit, eventOnce } = useEventBus()
const { promotionState, firstRegisterPromotion } = usePromotionRegister()

const formRef = ref<InstanceType<typeof ModeLoginRegister> | null>(null)
const isPasswordLoginMode = ref(false)
const modelValue = ref(false)

function closeDialog() {
  if (
    promotionState.value.isFinishSpinRegisterRoulette &&
    firstRegisterPromotion &&
    formRef.value?.isLoginMode === false
  ) {
    eventEmit("openRegisterPronotionTip", true)
    return
  }

  eventEmit("openLogin", false)
}

onMounted(async () => {
  eventOn("openLogin", (show: boolean, isPasswordLogin?: boolean) => {
    modelValue.value = show

    if (isPasswordLogin != null) isPasswordLoginMode.value = isPasswordLogin
  })

  eventOn("openRegister", (show: boolean) => {
    modelValue.value = show

    eventOnce("registerFormReady", () => {
      eventEmit("changeRegisterForm")
    })
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r024/assets/css/_variable.sass";
@import "app/template/set_r024/assets/css/button.scss";

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
    background: $secondary-card-secondary;
    color: $primary-01;
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
          color: $neutral-01;
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
        color: $functional-btn-text-secondary;
        margin-top: 1.25rem;

        :deep(.q-field__native),
        :deep(.q-field__input) {
          color: $functional-btn-text-secondary !important;
        }
      }
    }
  }
  &.h5 {
    width: 100%;
    height: 100%;
    background-image: url("app/template/set_r024/assets/images/login/mobile-login-bg.jpg");
    background-size: cover;
    background-position: center top;
    overflow-x: hidden;
    .card-right {
      @apply h-full w-full p-6 pb-0 mx-auto flex justify-start items-center flex-col;
      .close-btn-container {
        @apply w-full flex justify-between items-center;
        margin-top: 1.875rem;
        .q-btn {
          color: $neutral-01;
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

        :deep(.q-field__native),
        :deep(.q-field__input) {
          color: $functional-btn-text-secondary !important;
        }
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

          :deep(.q-field__native),
          :deep(.q-field__input) {
            color: $functional-btn-text-secondary !important;
          }
        }
      }
    }
  }
}
</style>
