<template>
  <q-dialog v-model="modelValue" :maximized="isDown.phone">
    <q-card :class="`${isDown.phone ? 'h5' : 'pc'}`" class="login-card">
      <q-card-section class="card-right">
        <div class="close-btn-container">
          <template v-if="!isDown.phone">
            <div v-if="formRef?.isLoginMode" class="mode-title">{{ $t("menu.login") }}</div>
            <div v-else class="mode-title">{{ $t("menu.createAccount") }}</div>
          </template>

          <img v-if="getWideLogo() && isDown.phone" :src="getWideLogo()" alt="" />

          <q-btn
            v-if="!isDown.phone"
            icon="close"
            class="hide-hover"
            flat
            round
            dense
            v-close-popup
            @click="closeDialog"
          />
          <div v-else class="close-text" @click="closeDialog">
            {{ $t("common.btn.ageExit") }}
          </div>
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
import { useEnv } from "src/common/hooks/useEnv"
import { useEventBus } from "src/common/hooks/useEventBus"
import { usePromotionRegister } from "src/common/composables/usePromotionRegister"
import { onMounted, ref } from "vue"
import ModeLoginRegister from "../Form/ModeLoginRegister.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { MODAL_TYPE } from "src/common/utils/constants"

const $q = useQuasar()
const { getWideLogo } = useLogo()
const { isPhoneRegisterMode } = useEnv()
const { eventOn, eventEmit, eventOnce } = useEventBus()
const { promotionState, firstRegisterPromotion } = usePromotionRegister()
const { isDown } = useMediaQuery()

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
@import "app/template/set_r017/assets/css/button.scss";

.login-card {
  @include hideScrollBar;
  background-color: var(--secondary-08);
  &.pc {
    border-radius: 0.75rem;
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
    background-color: var(--secondary-08);
    color: rgba(var(--neutral-01), 0.87);
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
            color: var(--neutral-01);
            min-width: 0;
            min-height: 0;
            &.q-carousel__navigation-icon--active {
              opacity: 1;
              color: var(--neutral-01);
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
      padding: 0 1.875rem 1rem;
      overflow: hidden scroll;
      position: relative;

      .close-btn-container {
        position: sticky;
        width: 100%;
        background-color: var(--secondary-08);
        z-index: 2;
        display: flex;
        justify-content: space-between;
        align-items: center;
        top: 0;
        fill: currentcolor;
        overflow: hidden;
        pointer-events: auto;

        img {
          height: 5rem;
          padding: 0.625rem;
        }
        .q-btn {
          padding: 0;
          color: var(--neutral-01);
          position: absolute;
          right: 0;
          top: 1rem;
        }

        .mode-title {
          flex: 1;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--neutral-01);
          text-align: center;
          padding: 1rem 0 0;
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
        color: rgba(var(--neutral-01), 0.87);
        margin-top: 0.875rem;
      }
    }
  }
  &.h5 {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    background-size: cover;
    background-position: center top;
    overflow-x: hidden;
    .card-right {
      padding: 0 !important;
      @apply h-full w-full p-6 pb-0 mx-auto flex justify-start items-center flex-col;
      .close-btn-container {
        background: var(--secondary-12);
        @apply w-full flex justify-between items-center;
        margin-top: 1.875rem;
        padding: 0.625rem 1.0625rem;

        img {
          width: 8rem;
        }
        .q-btn {
          background: var(--secondary-12);
          color: var(--neutral-01);
        }
        .close-text {
          color: var(--neutral-01);
          font-size: 0.875rem;
          font-weight: 700;
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
        padding: 1rem 0.75rem;
        width: 90%;
      }
      @include phone-width {
        @apply p-3;
        .close-btn-container {
          margin-top: 0rem;
          height: 70px;
        }
        .card-right-header {
          margin-top: 0rem;
          margin-bottom: 2.125rem;
          img {
            height: 4.375rem;
          }
        }
        .card-right-form {
          @apply pt-0;
          width: 100%;
        }
      }
    }
  }
}
</style>
