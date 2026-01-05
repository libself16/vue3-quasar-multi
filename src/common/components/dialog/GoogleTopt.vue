<template>
  <q-dialog
    v-model="modelValue"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="$q.platform.is.mobile ? '0' : '300'"
    :maximized="$q.platform.is.mobile"
    persistent
  >
    <q-card :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`" class="login-card">
      <q-form @submit="handleSubmit" class="w-full">
        <q-card-section class="card-right">
          <div class="close-btn-container">
            <img v-if="getWideLogo()" :src="getWideLogo()" alt="" />
            <!-- <q-btn icon="close" class="hide-hover" flat dense @click="closeDialog" /> -->
          </div>

          <div v-if="isToptEnabled" class="card-right-form">
            <div class="topt-verify-container">
              <q-input
                v-model="passcode"
                dense
                outlined
                hide-bottom-space
                no-error-icon
                maxlength="6"
                :placeholder="$t('topt.please_enter_the_google_authenticator_code')"
                :error="isTotpError"
                :error-message="$t('topt.incorrect_verification_code')"
                @update:model-value="clearError"
              ></q-input>
              <q-btn type="submit">{{ $t("common.btn.submit") }}</q-btn>
            </div>
          </div>
          <div v-else class="card-right-form">
            <div class="topt-enable-container">
              <div class="topt-enable-container-title">{{ $t("topt.please_use_google_authenticator_scan") }}</div>
              <QRCode v-if="toptQrcodeUrl" v-model="toptQrcodeUrl" :size="150" />
              <q-input
                v-model="passcode"
                dense
                outlined
                hide-bottom-space
                no-error-icon
                maxlength="6"
                :placeholder="$t('topt.verification_code')"
                :error="isTotpError"
                :error-message="$t('topt.incorrect_verification_code')"
                @update:model-value="clearError"
              ></q-input>
              <q-btn type="submit">{{ $t("topt.verify_and_enable") }}</q-btn>
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLogo } from "src/common/composables/useLogo"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useEnv } from "src/common/hooks/useEnv"
import QRCode from "src/common/components/QRCode/Index.vue"

const $q = useQuasar()
const {
  isLogin,
  isToptEnabled,
  isToptVerified,
  toptQrcodeUrl,
  isOnBoarding,
  handleGetTotpGenerate,
  handlePostTotpEnable,
  handlePostTotpVerify,
  handleLogout
} = useAuth()
const { kycStatus, userKyc, getUserKycStatus, getUserKyc } = useUserInfo()
const { getWideLogo } = useLogo()
const { eventOn, eventEmit } = useEventBus()
const { isAuthRequired } = useEnv()

const modelValue = ref(false)
const isTotpError = ref(false)
const passcode = ref("")

async function closeDialog() {
  await handleLogout()
  eventEmit("openGoogleToptDialog", false)
  passcode.value = ""
  eventEmit("openLogin", true)
}

async function submitSuccess() {
  eventEmit("openGoogleToptDialog", false)
  passcode.value = ""

  if (isAuthRequired.value && isOnBoarding.value) {
    await getUserKycStatus()
    await getUserKyc()

    if (!userKyc.value.length) {
      eventEmit("openKycUploadDialog", true)
      return
    }

    eventEmit("openKycResultDialog", true, kycStatus.value)
  }
}

async function handleSubmit() {
  if (!/^\d{6}$/.test(passcode.value)) {
    isTotpError.value = true
    return
  }
  if (isToptEnabled.value) {
    const { status } = await handlePostTotpVerify(passcode.value)

    if (status) {
      submitSuccess()
    } else {
      isTotpError.value = true
    }
    return
  }

  const { status } = await handlePostTotpEnable(passcode.value)
  if (status) {
    submitSuccess()
  } else {
    isTotpError.value = true
  }
}

function clearError() {
  isTotpError.value = false
}

onMounted(async () => {
  if (isLogin.value && !isToptVerified.value) {
    setTimeout(() => {
      modelValue.value = true
    }, 1000)
  }
  eventOn("openGoogleToptDialog", async (show: boolean) => {
    if (show && isToptVerified.value) {
      submitSuccess()
      return
    }
    if (show && !isToptEnabled.value) {
      await handleGetTotpGenerate()
    }
    modelValue.value = show
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.hide-hover {
  :deep(.q-focus-helper) {
    opacity: 0 !important;
    background-color: transparent !important;
  }
}

.login-card {
  @include hideScrollBar;
  &.pc {
    border-radius: 1.25rem;
    min-width: 30rem;
    width: auto;
    position: relative;
    display: flex;
    flex-direction: row;
    -webkit-box-pack: justify;
    justify-content: space-between;
    overflow: hidden;
    background-size: contain;
    background-repeat: no-repeat;
    background-color: #fff;
    color: rgba(#000, 0.87);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    margin: 1.875rem;
    max-height: calc(100% - 20px);
    max-width: 37.5rem;

    .card-right {
      width: 100%;
      padding: 0rem 2.5rem 2.5rem;
      overflow: hidden scroll;
      position: relative;
      .close-btn-container {
        position: sticky;
        width: 100%;
        background-color: #fff;
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
          color: rgba(#000, 0.87);
        }
      }

      .card-right-form {
        .topt-enable-container {
          @apply mt-7 flex flex-col gap-7 justify-center items-center;

          .topt-enable-container-title {
            font-family: NotoSansTC;
            font-weight: 350;
            font-size: 14px;
            line-height: 1.0625rem;
            letter-spacing: 0.13px;
            color: #000;
          }

          .q-input {
            @apply w-full rounded;

            :deep(.q-field__control) {
              &.text-negative {
                color: #d50000 !important;
              }
            }

            :deep(.q-field__bottom) {
              @apply px-0 pt-2;
              font-family: NotoSansTC;
              font-weight: 350;
              font-size: 14px;
              line-height: 17px;
              letter-spacing: 0.13px;
              color: #d50000;
            }
          }

          .q-btn {
            @apply w-full py-[.375rem] rounded-lg;
            background-color: #025be8;
            :deep(.q-btn__content) {
              font-family: NotoSansTC;
              font-weight: 350;
              font-size: 16px;
              line-height: 28px;
              text-align: center;
              vertical-align: middle;
              text-transform: capitalize;
              color: #fff;
            }
          }
        }
        .topt-verify-container {
          @apply mt-[10.7312rem] flex flex-col gap-[10.7312rem] justify-center items-center;

          .q-input {
            @apply w-full rounded;

            :deep(.q-field__control) {
              @apply px-6;
              &.text-negative {
                color: #d50000 !important;
              }
            }

            :deep(.q-field__bottom) {
              @apply px-0 pt-2;
              font-family: NotoSansTC;
              font-weight: 350;
              font-size: 14px;
              line-height: 17px;
              letter-spacing: 0.13px;
              color: #d50000;
            }
          }

          .q-btn {
            @apply w-full py-[.375rem] rounded-lg;
            background-color: #025be8;
            :deep(.q-btn__content) {
              font-family: NotoSansTC;
              font-weight: 350;
              font-size: 16px;
              line-height: 28px;
              text-align: center;
              vertical-align: middle;
              text-transform: capitalize;
              color: #fff;
            }
          }
        }
      }
    }
  }

  &.h5 {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    background-color: #f6f7f8;

    .card-right {
      @apply h-full w-full px-3 py-7 pb-0 mx-auto flex justify-start items-center flex-col;

      .close-btn-container {
        @apply w-full flex justify-between items-center;

        .q-btn {
          color: rgba(#000, 0.87);
          padding: 0;
        }

        img {
          height: 3.25rem;
          width: auto;
        }
      }

      .card-right-form {
        width: 100%;

        .topt-enable-container {
          @apply mt-7 flex flex-col gap-7 justify-center items-center;

          .topt-enable-container-title {
            font-family: NotoSansTC;
            font-weight: 350;
            font-size: 14px;
            line-height: 1.0625rem;
            letter-spacing: 0.13px;
            color: #000;
            max-width: 18.5625rem;
          }

          .q-input {
            @apply w-full rounded;

            :deep(.q-field__control) {
              &.text-negative {
                color: #d50000 !important;
              }
            }

            :deep(.q-field__bottom) {
              @apply px-0 pt-2;
              font-family: NotoSansTC;
              font-weight: 350;
              font-size: 14px;
              line-height: 17px;
              letter-spacing: 0.13px;
              color: #d50000;
            }
          }

          .q-btn {
            @apply w-full py-[.375rem] rounded-lg;
            background-color: #025be8;
            :deep(.q-btn__content) {
              font-family: NotoSansTC;
              font-weight: 350;
              font-size: 16px;
              line-height: 28px;
              text-align: center;
              vertical-align: middle;
              text-transform: capitalize;
              color: #fff;
            }
          }
        }

        .topt-verify-container {
          @apply mt-[4.25rem] flex flex-col gap-[3rem] justify-center items-center;

          .q-input {
            @apply w-full rounded;

            :deep(.q-field__control) {
              @apply px-6;
              &.text-negative {
                color: #d50000 !important;
              }
            }

            :deep(.q-field__bottom) {
              @apply px-0 pt-2;
              font-family: NotoSansTC;
              font-weight: 350;
              font-size: 14px;
              line-height: 17px;
              letter-spacing: 0.13px;
              color: #d50000;
            }
          }

          .q-btn {
            @apply w-full py-[.375rem] rounded-lg;
            background-color: #025be8;
            :deep(.q-btn__content) {
              font-family: NotoSansTC;
              font-weight: 350;
              font-size: 16px;
              line-height: 28px;
              text-align: center;
              vertical-align: middle;
              text-transform: capitalize;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
