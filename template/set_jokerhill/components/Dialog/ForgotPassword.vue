<template>
  <q-dialog
    v-model="modelValue"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="$q.platform.is.mobile ? '0' : '300'"
    :maximized="$q.platform.is.mobile"
    @hide="closeDialog"
  >
    <q-card :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`" class="forgot-card">
      <q-card-section class="card-right">
        <div v-if="$q.platform.is.mobile" class="close-btn-container">
          <q-btn
            icon="arrow_back_ios"
            class="hide-hover text-black/40"
            size="md"
            flat
            round
            dense
            @click="handleBackBtn"
          />
          <h2 class="uppercase">{{ $t("member.forgotPassword.forgotPassword") }}</h2>
          <div class="w-8 h-8 invisible"></div>
        </div>
        <div v-else class="close-btn-container">
          <q-btn icon="close" class="hide-hover" flat round dense v-close-popup />
        </div>
        <div class="card-right-header" v-if="!$q.platform.is.mobile">
          <!-- <img v-if="getWideLogo()" :src="getWideLogo()" alt="" /> -->
          <div class="card-title">
            <p>WELCOME</p>
            <p>BACK</p>
          </div>
        </div>
        <div class="card-right-form">
          <div class="form-body">
            <PhoneForgotPasswordForm v-if="isPhoneRegisterMode" />
            <AccountForgotPasswordForm v-else />

            <q-btn flat text-color="blue" class="btn-login hide-hover" @click="goLogin">
              {{ $t("common.btn.back") }}
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useQuasar } from "quasar"
import { useLogo } from "src/common/composables/useLogo"
import { useEnv } from "src/common/hooks/useEnv"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { nextTick, onMounted, ref } from "vue"
import AccountForgotPasswordForm from "../Form/AccountForgotPassword.vue"
import PhoneForgotPasswordForm from "../Form/PhoneForgotPassword.vue"

const $q = useQuasar()
const { loginCarousel, svgIcon, loginImg } = useSiteImg()
const { getWideLogo, handleLogoList } = useLogo()
const { handleOpenLiveChat } = useLiveChat()
const { isPhoneRegisterMode, companyName } = useEnv()
const eventbus = injectStrict(EventBusKey)

const modelValue = ref(false)
const isStep1 = ref(true)
const slide = ref(1)

function handleBackBtn() {
  if (isStep1.value) {
    goLogin()
    return
  }

  eventbus.emit("openForgotPassword", true)
}

function closeDialog() {
  console.log("closeDialog")
  eventbus.emit("openForgotPassword", false)
}

async function goLogin() {
  eventbus.emit("openLogin", true)
  await nextTick()
  eventbus.emit("openForgotPassword", false)
}

onMounted(async () => {
  await handleLogoList()

  eventbus.on("openForgotPassword", (show: boolean) => {
    modelValue.value = show
    isStep1.value = true
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/button.scss";

.forgot-card {
  @include hideScrollBar;
  &.pc {
    border-radius: 1.25rem;
    min-width: 30rem;
    height: auto;
    position: relative;
    display: flex;
    flex-direction: row;
    -webkit-box-pack: justify;
    justify-content: space-between;
    overflow: hidden;
    background-color: rgb(255, 255, 255);
    color: rgba(0, 0, 0, 0.87);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    margin: 1.875rem;
    max-height: calc(100% - 64px);
    max-width: 37.5rem;
    :deep(.q-card__section--vert) {
      padding: 0 !important;
    }
    .card-right {
      width: 100%;
      // padding: 1.25rem 2.5rem 0.8125rem;
      overflow: hidden scroll;
      .close-btn-container {
        position: absolute;
        right: 1.25rem;
        top: 1.25rem;
        vertical-align: -0.15em;
        background: #fff;
        border-radius: 40px;
        fill: currentcolor;
        overflow: hidden;
        display: inline-block;
        pointer-events: auto;
        .q-btn {
          padding: 0;
        }
      }
      .card-right-header {
        background: linear-gradient(270deg, #38a4b1 0%, #8c82e9 100%);
        padding: 1.25rem 0;
        height: 130px;
        // margin: 1.25rem 0;
        // display: flex;
        // justify-content: flex-start;
        // align-items: center;
        .card-title {
          height: 100%;
          line-height: 100%;
          padding: 0 2rem;
          p {
            color: #fff;
            font-family: "NotoSansTC";
            font-size: 2rem;
            font-style: normal;
            font-weight: 900;
            line-height: 36px;
            width: 6.5rem;
            aspect-ratio: auto 90 / 36;
          }
        }
      }
      .card-right-form {
        color: rgba($color: #000000, $alpha: 0.87);
        margin: 1.5rem 2rem;

        .form-title {
          @apply uppercase text-center font-bold;
          color: rgba(#141414, 0.4);
          font-size: 2rem;
          margin-bottom: 2.5rem;
        }

        .form-body {
          @apply flex flex-col gap-4;
        }

        .btn-password {
          @apply mb-4 h-16 w-full rounded-lg text-base capitalize;
          padding: 0.875rem 1rem;
          font-weight: 510;
          :deep(.q-btn__content) {
            @apply justify-start flex-nowrap;
            img {
              @apply w-8 h-8;
            }
            span {
              @apply text-left break-words whitespace-nowrap text-base w-full;
              margin-left: 0.625rem;
            }
          }
        }
        .btn-login {
          width: 100%;
          font-weight: 400;
          font-size: 0.875rem;
          overflow-wrap: break-word;
          text-transform: capitalize;
        }
        .card-rigth-footer {
          position: absolute;
          right: 0;
          bottom: 0.625rem;
          left: 0;
          .help-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .help-row {
              color: rgb(48, 60, 85);
              font-size: 0.875rem;
              font-weight: 600;
              overflow-wrap: break-word;
              margin: 0.75rem 0;
              display: flex;
              align-items: center;
              .contact-us {
                height: 1.5rem;
                display: flex;
                align-items: center;
                font-weight: 410;
                color: rgb(2, 91, 232);
                cursor: pointer;
                .contact-icon {
                  margin: 0 0.625rem;
                  img {
                    width: 1rem;
                    height: 1rem;
                  }
                }
              }
            }
            .game-responsibly {
              width: 4.6875rem;
              height: 1.5625rem;
            }
          }
        }
      }
    }
  }
  &.h5 {
    width: 100%;
    height: 100%;
    // background-image: url("app/template/okbet/assets/images/login/bg-h5.jpg");
    // background-size: cover;
    // background-position: center top;
    background-color: #f5f5f5;
    overflow-x: hidden;
    h2 {
      @apply font-bold text-black/40;
    }
    .card-right {
      @apply h-full w-full p-6 pb-0 mx-auto flex justify-start items-center flex-col;
      .card-right-form {
        width: 95%;

        .form-body {
          @apply flex flex-col gap-4;
        }
      }
      .close-btn-container {
        @apply w-full flex justify-between items-center;
        margin-top: 1.875rem;
        font-size: 2.25rem;
        .q-btn {
          font-size: 1.25rem !important;
        }
      }
      .card-right-header {
        margin-top: 6.25rem;
        margin-bottom: 4rem;
        img {
          width: auto;
          height: 8.5rem;
        }
      }
      .password-btn-container {
        @apply mx-auto p-4 bg-white rounded-lg flex flex-col justify-start items-center;
        margin-top: 7.5rem;
        width: 45rem;
        box-shadow: rgba(0, 24, 30, 0.06) 0px 6rem 10rem;
        .btn-password {
          @apply text-sm mt-2 mb-6 capitalize w-full;
          height: 6.25rem;
          color: rgb(255, 255, 255);
          border-radius: 0.625rem;
          background-color: rgb(2, 91, 232);
          font-size: 1.75rem;
          :deep(.q-btn__content) {
            img {
              @apply w-6 h-6 ml-3 mr-6;
            }
          }
        }
        .btn-login {
          width: 100%;
          font-weight: 400;
          font-size: 1.75rem;
          overflow-wrap: break-word;
          text-transform: capitalize;
        }
      }
      .card-rigth-footer {
        @apply w-full flex items-center justify-start flex-col;
        width: 100%;
        .help-container {
          @apply my-8;
          display: flex;
          flex-direction: column;
          align-items: center;
          .help-row {
            display: flex;
            align-items: center;
            margin-top: 1rem;
            color: rgb(83, 93, 118);
            line-height: 2.25rem;
            letter-spacing: -0.02em;
            font-size: 1.625rem;
            .contact-us {
              display: flex;
              align-items: center;
              font-weight: 410;
              color: rgb(2, 91, 232);
              cursor: pointer;
              .contact-icon {
                margin: 0 8px;
                img {
                  width: 1.5rem;
                  height: 1.5rem;
                }
              }
            }
          }
          .game-responsibly {
            display: none;
          }
        }
      }
      .copyright {
        margin-top: 2.5rem;
        color: rgb(109, 118, 147);
        text-align: center;
        font-family: Helvetica;
        font-size: 1.625rem;
        font-weight: 400;
        line-height: 2.25rem;
        text-transform: capitalize;
        padding: 0px 0px 2.625rem;
        letter-spacing: 0px;
        img {
          @apply w-48 h-14;
        }
      }

      @include phone-width {
        @apply p-3;
        .card-right-form {
          width: 100%;
        }
        .close-btn-container {
          margin-top: 1rem;
          font-size: 1.25rem;
          .q-btn {
            font-size: 0.875rem !important;
          }
        }
        .card-right-header {
          margin-top: 3.125rem;
          margin-bottom: 2.125rem;
          img {
            height: 4.375rem;
          }
        }
        .password-btn-container {
          margin-top: 0rem;
          height: auto;
          width: 100%;
          .btn-password {
            @apply text-sm mt-1 mb-3;
            height: 3.125rem;
            border-radius: 0.625rem;
            :deep(.q-btn__content) {
              justify-content: flex-start;
              img {
                @apply w-6 h-6 ml-1 mr-3;
              }
            }
          }
          .btn-login {
            font-size: 0.875rem;
          }
        }
        .card-rigth-footer {
          @apply w-full flex items-center justify-start flex-col;
          width: 100%;
          .help-container {
            @apply my-4;
            display: flex;
            flex-direction: column;
            align-items: center;
            .help-row {
              display: flex;
              align-items: center;
              margin-top: 0.5rem;
              color: rgb(83, 93, 118);
              line-height: 1.125rem;
              letter-spacing: -0.02em;
              font-size: 0.8125rem;
              .contact-us {
                display: flex;
                align-items: center;
                font-weight: 410;
                color: rgb(2, 91, 232);
                cursor: pointer;
                .contact-icon {
                  margin: 0 4px;
                  img {
                    width: 1.5rem;
                    height: 1.5rem;
                  }
                }
              }
            }
            .game-responsibly {
              display: none;
            }
          }
        }
        .copyright {
          margin-top: 1.25rem;
          color: rgb(109, 118, 147);
          text-align: center;
          font-family: Helvetica;
          font-size: 0.8125rem;
          font-weight: 400;
          line-height: 1.0625rem;
          text-transform: capitalize;
          padding: 0px 0px 1.3125rem;
          letter-spacing: 0px;
          img {
            @apply w-24 h-7;
          }
        }
      }
    }
  }
}
</style>
