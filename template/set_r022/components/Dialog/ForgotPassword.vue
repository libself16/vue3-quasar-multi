<template>
  <q-dialog
    v-model="modelValue"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="isLargeTablet ? '0' : '300'"
    :maximized="isLargeTablet"
    @hide="closeDialog"
  >
    <q-card :class="`${isLargeTablet ? 'h5' : 'pc'}`" class="forgot-card">
      <!-- 暫時先隱藏廣告圖 -->
      <!-- <q-card-section class="card-left">
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
      </q-card-section> -->
      <q-card-section class="card-right">
        <div class="card-right-header">
          <div>
            <img v-if="getWideLogo()" :src="getWideLogo()" alt="" class="logo" />
          </div>
          <q-btn icon="close" class="hide-hover" flat round dense v-close-popup />
        </div>

        <div class="card-right-form">
          <div v-if="isStep1" class="step-1">
            <q-btn class="btn-password hide-hover" @click="isStep1 = false">
              <img :src="loginImg('password-white.png')" alt="" class="password-img" />
              <span>
                {{
                  isPhoneRegisterMode
                    ? $t("member.forgotPassword.retrievePasswordViaPhone")
                    : $t("member.forgotPassword.retrievePassword")
                }}
              </span>
            </q-btn>

            <q-btn flat class="btn-login hide-hover" @click="goLogin">
              {{ isPhoneRegisterMode ? $t("member.login.useVerifyCode") : $t("common.btn.login") }}
            </q-btn>
          </div>

          <template v-else>
            <PhoneForgotPasswordForm v-if="isPhoneRegisterMode" />
            <AccountForgotPasswordForm v-else />
          </template>

          <!-- <div v-if="isPhoneRegisterMode" class="card-rigth-footer">
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

            <div v-if="isLargeTablet" class="copyright">
              <div class="flex justify-center items-center">
                <img :src="loginImg('pagcor.png')" alt="pagcor" />
                <img :src="loginImg('game-responsibly.png')" alt="game-responsibly" class="ml-3" />
              </div>
              <div class="mt-1">Copyright© 2024 {{ companyName }} ALL RIGHTS RESERVED</div>
            </div>
          </div> -->
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { EventBusKey } from "src/symbols"
import { nextTick, onMounted, ref } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { useLogo } from "src/common/composables/useLogo"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { injectStrict } from "src/common/utils/injectTyped"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import PhoneForgotPasswordForm from "../Form/PhoneForgotPassword.vue"
import AccountForgotPasswordForm from "../Form/AccountForgotPassword.vue"

const { getWideLogo } = useLogo()
const { isLargeTablet } = useMediaQuery()
// const { handleOpenLiveChat } = useLiveChat()
const { isPhoneRegisterMode, companyName } = useEnv()
const { loginCarousel, svgIcon, loginImg } = useSiteImg()

const eventbus = injectStrict(EventBusKey)
const modelValue = ref(false)
const isStep1 = ref(true)
const slide = ref(1)

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
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/button.scss";

.forgot-card {
  @include hideScrollBar;
  background: var(--neutral-01);
  width: 30rem;
  height: 41.25rem;
  border-radius: 1.25rem;
  background: var(--neutral-01);
  box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @include pad-large-width {
    min-width: unset;
    height: 100%;
    background: var(--bg-main-bg);
  }

  // .card-left {
  //   padding: 0;
  //   width: 30rem;
  //   height: 41.25rem;
  //   :deep(.q-carousel) {
  //     width: 100%;
  //     height: 41.25rem;
  //     .q-carousel__slide {
  //       padding: 0;
  //       background-size: contain;
  //     }
  //     .q-carousel__control {
  //       bottom: 0.9375rem;
  //       .q-btn {
  //         padding: 0;
  //         margin: 0 0.25rem;
  //         opacity: 0.2;
  //         color: black;
  //         min-width: 0;
  //         min-height: 0;
  //         &.q-carousel__navigation-icon--active {
  //           opacity: 1;
  //           color: #0085FF;
  //         }
  //         .q-icon {
  //           font-size: 0.5rem;
  //           width: 0.5rem;
  //           min-width: 0.5rem;
  //         }
  //       }
  //     }
  //   }
  // }

  .card-right {
    width: 100%;
    padding: 2rem 2.5rem 0.8125rem;

    @include pad-large-width {
      padding: 4.375rem 0.75rem;
    }

    .close-btn-container {
      overflow: hidden;
      display: inline-block;

      .q-btn {
        padding: 0;
      }
    }

    .card-right-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5625rem;

      @include pad-large-width {
        margin-bottom: 3.43375rem;
      }

      .logo {
        max-width: 13.285625rem;
        max-height: 5rem;

        @include pad-large-width {
          width: 17.5rem;
        }
      }
    }

    .card-right-form {
      .step-1 {
        @include pad-large-width {
          border: 1px solid var(--neutral-03);
          border-radius: 0.5rem;
          padding: 1.1875rem 0.875rem;
          background: var(--neutral-01);
        }
      }

      .btn-password {
        width: 100%;
        font-weight: 510;
        padding: 1rem;
        color: var(--text-01);
        border-radius: 0.5rem;
        background: var(--primary-01);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        font-size: 0.984375rem;
        font-weight: 600;

        .password-img {
          width: 2rem;
          height: 2rem;
          margin-right: 0.625rem;
        }
      }

      .btn-login {
        width: 100%;
        height: 2.25rem;
        font-weight: 400;
        font-size: 0.875rem;
        overflow-wrap: break-word;
        color: var(--primary-01);
        margin-top: 1rem;
        padding: 0;
      }

      // .card-rigth-footer {
      //   position: absolute;
      //   right: 0;
      //   bottom: 0.625rem;
      //   left: 0;

      //   .help-container {
      //     display: flex;
      //     flex-direction: column;
      //     align-items: center;
      //     justify-content: center;

      //     .help-row {
      //       color: var(--secondary-01);
      //       font-size: 0.875rem;
      //       font-weight: 600;
      //       overflow-wrap: break-word;
      //       margin: 0.75rem 0;
      //       display: flex;
      //       align-items: center;

      //       .contact-us {
      //         height: 1.5rem;
      //         display: flex;
      //         align-items: center;
      //         font-weight: 410;
      //         color: var(--primary-01);
      //         cursor: pointer;

      //         .contact-icon {
      //           margin: 0 0.625rem;
      //           img {
      //             width: 1rem;
      //             height: 1rem;
      //           }
      //         }
      //       }
      //     }
      //     .game-responsibly {
      //       width: 4.6875rem;
      //       height: 1.5625rem;
      //     }
      //   }
      // }
    }
  }
}
</style>
