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
      <!-- 暫時先隱藏廣告圖 -->
      <q-card-section v-if="false" class="card-left">
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
          <q-carousel-slide :name="1" :img-src="loginCarousel(1)" />
          <q-carousel-slide :name="2" :img-src="loginCarousel(2)" />
        </q-carousel>
      </q-card-section>
      <q-card-section class="card-right">
        <div v-if="$q.platform.is.mobile" class="close-btn-container">
          <q-btn icon="arrow_back_ios" class="hide-hover" size="md" flat round dense @click="handleBackBtn" />
          <!-- <h2>{{ $t("member.forgotPassword.forgotPassword") }}</h2> -->
          <div class="w-8 h-8 invisible"></div>
        </div>
        <div v-else class="close-btn-container">
          <q-btn icon="close" class="hide-hover" flat round dense v-close-popup />
        </div>
        <div class="card-right-header">
          <img v-if="getWideLogo()" :src="getWideLogo()" alt="" />
        </div>
        <div class="card-right-form">
          <template v-if="isStep1">
            <div class="password-btn-container">
              <q-btn color="primary" class="btn-password hide-hover" @click="isStep1 = false">
                <img :src="svgIcon('retrieve-password')" alt="" />
                <span>
                  {{
                    isPhoneRegisterMode
                      ? $t("member.forgotPassword.retrievePasswordViaPhone")
                      : $t("member.forgotPassword.retrievePassword")
                  }}
                </span>
              </q-btn>
              <q-btn flat text-color="primary" class="btn-login hide-hover" @click="goLogin">
                {{ isPhoneRegisterMode ? $t("member.login.useVerifyCode") : $t("common.btn.login") }}
              </q-btn>
            </div>
          </template>
          <template v-else>
            <PhoneForgotPasswordForm v-if="isPhoneRegisterMode" />
            <AccountForgotPasswordForm v-else />
          </template>
          <div v-if="isPhoneRegisterMode" class="card-rigth-footer">
            <div class="help-container">
              <p class="help-row">
                <span>{{ $t("member.login.needHelp") }} ? </span>
                <span class="contact-us" @click="handleOpenLiveChat">
                  <div class="contact-icon">
                    <img :src="svgIcon('service')" alt="phone-number" />
                  </div>
                  {{ $t("home.contact_us") }}
                </span>
              </p>
              <img :src="loginImg('game-responsibly.png')" alt="game-responsibly" class="game-responsibly" />
            </div>
            <div v-if="$q.platform.is.mobile" class="copyright">
              <div class="flex justify-center items-center">
                <img :src="loginImg('pagcor.png')" alt="pagcor" />
                <img :src="loginImg('game-responsibly.png')" alt="game-responsibly" class="ml-3" />
              </div>
              <div class="mt-1">Copyright© 2024 {{ companyName }} ALL RIGHTS RESERVED</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/bmm_set_obtd/hooks/useSiteImg"
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
const { getWideLogo } = useLogo()
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
  eventbus.on("openForgotPassword", (show: boolean) => {
    modelValue.value = show
    isStep1.value = true
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/button.scss";

.forgot-card {
  @include hideScrollBar;
  &.pc {
    border-radius: 1.25rem;
    min-width: 30rem;
    height: 41.25rem;
    position: relative;
    display: flex;
    flex-direction: row;
    -webkit-box-pack: justify;
    justify-content: space-between;
    overflow: hidden;
    background: $background-light-color;
    color: rgba($text-dark-color, 0.87);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    margin: 1.875rem;
    max-height: calc(100% - 64px);
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
          height: 2.25rem;
          width: auto;
        }
      }
      .card-right-form {
        color: rgba($text-dark-color, 0.87);
        margin-top: 2.8125rem;
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
              color: $text-night-sky-color;
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
                color: $primary-color;
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
    background-image: url("app/template/bmm_set_obtd/assets/images/login/bg-h5.jpg");
    background-size: cover;
    background-position: center top;
    overflow-x: hidden;
    .card-right {
      @apply h-full w-full p-6 pb-0 mx-auto flex justify-start items-center flex-col;
      .card-right-form {
        width: 95%;
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
        @apply mx-auto p-4 rounded-lg flex flex-col justify-start items-center;
        background: $background-light-color;
        margin-top: 7.5rem;
        width: 45rem;
        box-shadow: rgba($box-shadow-deep-slate-color, 0.06) 0px 6rem 10rem;
        .btn-password {
          @apply text-sm mt-2 mb-6 capitalize w-full;
          height: 6.25rem;
          color: $text-light-color;
          border-radius: 0.625rem;
          background-color: $primary-color;
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
            color: $text-charcoal-gray-color-light;
            line-height: 2.25rem;
            letter-spacing: -0.02em;
            font-size: 1.625rem;
            .contact-us {
              display: flex;
              align-items: center;
              font-weight: 410;
              color: $primary-color;
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
        color: $text-steel-blue-color;
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
          margin-top: 3.75rem;
          width: 22.875rem;
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
              color: $text-charcoal-gray-color-light;
              line-height: 1.125rem;
              letter-spacing: -0.02em;
              font-size: 0.8125rem;
              .contact-us {
                display: flex;
                align-items: center;
                font-weight: 410;
                color: $primary-color;
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
          color: $text-steel-blue-color;
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
