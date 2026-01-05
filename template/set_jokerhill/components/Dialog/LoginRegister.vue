<template>
  <q-dialog
    class="login-modal"
    v-model="modelValue"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="$q.platform.is.mobile ? '0' : '300'"
    :maximized="$q.platform.is.mobile"
    @hide="closeDialog"
  >
    <q-card :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`" class="login-card">
      <!-- <q-card-section v-if="!$q.platform.is.mobile" class="card-left">
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
      <q-card-section class="card-center">
        <div class="close-btn-container">
          <q-btn icon="close" class="hide-hover" flat round dense v-close-popup />
        </div>
        <div class="card-right-header">
          <!-- <img v-if="getWideLogo()" :src="getWideLogo()" alt="" /> -->
          <div v-if="!$q.platform.is.mobile" class="card-title">
            <p>WELCOME</p>
            <p>BACK</p>
          </div>
        </div>
        <div class="card-right-form">
          <PhoneLoginRegisterForm v-if="isPhoneRegisterMode" />
          <AccountLoginRegister v-else />
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
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, ref } from "vue"
import AccountLoginRegister from "../Form/AccountLoginRegister.vue"
import PhoneLoginRegisterForm from "../Form/PhoneLoginRegister.vue"

const $q = useQuasar()
const { loginCarousel } = useSiteImg()
const { getWideLogo, handleLogoList } = useLogo()
const { isPhoneRegisterMode } = useEnv()
const eventbus = injectStrict(EventBusKey)

const modelValue = ref(false)
const slide = ref(1)

function closeDialog() {
  eventbus.emit("openLogin", false)
}

onMounted(async () => {
  await handleLogoList()

  eventbus.on("openLogin", (show: boolean) => {
    modelValue.value = show
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/button.scss";

.login-modal {
  color: red !important;
  background-color: red !important;
  :deep(.q-dialog) {
    margin-top: 3rem;
  }
}

.login-card {
  @include hideScrollBar;
  &.pc {
    border-radius: 1.25rem;
    width: 30rem;
    height: auto;
    position: relative;
    display: flex;
    flex-direction: row;
    -webkit-box-pack: justify;
    justify-content: space-between;
    overflow: hidden;
    // background-image: url("app/template/okbet/assets/images/login/bg-pc.png");
    // background-size: contain;
    // background-repeat: no-repeat;
    background-color: rgb(255, 255, 255);
    color: rgba(0, 0, 0, 0.87);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    margin: 1.875rem;
    max-height: calc(100% - 64px);
    max-width: 37.5rem;
    :deep(.q-card__section--vert) {
      padding: 0 !important;
    }
    .card-center {
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
        padding: 2rem;
        color: rgba($color: #000000, $alpha: 0.87);
      }
    }
  }
  &.h5 {
    background: #f5f5f5;
    width: 100%;
    height: 100%;
    // background-image: url("app/template/set_jokerhill/assets/images/login/bg-h5.jpg");
    // background-size: cover;
    // background-position: center top;
    overflow-x: hidden;
    .card-center {
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
        .card-title {
          height: 100%;
          line-height: 100%;
          padding: 0 2rem;
          p {
            text-align: center;
            margin: 0 1rem;
            color: rgba(20, 20, 20, 0.4);
            font-family: "NotoSansTC";
            font-size: 2rem;
            font-style: normal;
            font-weight: 900;
            line-height: 36px;
            width: 6.5rem;
          }
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
          width: 100%;
          .card-title {
            height: 100%;
            line-height: 100%;
            padding: 0 2rem;
            p {
              text-align: center;
              margin: 0 auto;
              width: 100%;
            }
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
