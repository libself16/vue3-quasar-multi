<template>
  <div :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <!-- account -->
    <q-form @submit="showVerifyModal([forgetPassword])">
      <div class="form-container">
        <h2 class="form-title" v-if="!$q.platform.is.mobile">{{ $t("member.forgotPassword.forgotPassword") }}</h2>
        <div class="form-tip pt-4 md:py-0 md:mb-4">
          <h3>{{ $t("member.forgotPassword.resetPassword") }}</h3>
          <p>{{ $t("common.tip.forgotPasswordTitle") }}</p>
        </div>
        <q-input
          v-model="formAccount.account"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('member.forgotPassword.registeredAccount')"
          lazy-rules
          :rules="[(val) => Rules.account(val)]"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('people')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
        <q-input
          v-model="formAccount.email"
          class="form-input"
          dense
          borderless
          :placeholder="$t('member.forgotPassword.registeredEmail')"
          lazy-rules
          :rules="[Rules.email]"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('mail')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>

        <div class="form-tip pb-4 md:py-0">
          <p>{{ $t("common.tip.forgotPasswordTip2") }}</p>
        </div>
      </div>

      <q-btn color="blue" class="btn-submit mt-5 hide-hover" type="submit" :loading="isLoading">
        {{ $t("common.btn.submit") }}
      </q-btn>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, reactive } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const router = useRouter()
const { isLoading, handleForgetPassword } = useAuth()
const { svgIcon } = useSiteImg()
const { showVerifyModal } = useSlideVerify()
const eventbus = injectStrict(EventBusKey)

const formAccount = reactive<Request.forgetPassword>({
  account: "",
  email: ""
})

function initForm() {
  formAccount.account = ""
  formAccount.email = ""
}

async function forgetPassword() {
  const { status } = await handleForgetPassword(formAccount)
  if (!status) {
    return
  }
  $q.notify({
    type: "positive",
    message: t("common.validate.LetterHasBeenSent"),
    position: "top",
    timeout: 1000
  })

  eventbus.emit("openLogin", false)
  eventbus.emit("openForgotPassword", false)
}

onMounted(() => {
  eventbus.on("openForgotPassword", (show: boolean) => {
    initForm()
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_jokerhill/assets/css/_variable.sass";
@import "app/template/set_jokerhill/assets/css/form.sass";
@import "app/template/set_jokerhill/assets/css/button.sass";

.pc {
  .form-container {
    .form-title {
      @apply uppercase text-center font-bold;
      color: rgba(#141414, 0.4);
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }
    .form-tip {
      color: rgba(#141414, 0.6);
      h3 {
        @apply leading-6;
        font-size: 1rem;
      }
      p {
        @apply leading-6;
        font-size: 0.75rem;
      }
    }
  }
  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    border-radius: 0.5rem;
    color: $color-white-text;
    height: 2.5rem;
    width: 100%;
    position: relative;
  }
}
.h5 {
  .form-container {
    margin: 0.6875rem auto;
    background: rgb(255, 255, 255);
    box-shadow: rgba(0, 24, 30, 0.06) 0px 0.4375rem 0.6875rem;
    border-radius: 0.5rem;
    border: 1px solid rgb(221, 232, 255);
    .form-tip {
      @apply px-4;
      color: rgba(#141414, 0.6);
      h3 {
        @apply leading-6;
        font-size: 1rem;
      }
      p {
        @apply leading-6;
        font-size: 0.75rem;
      }
    }
  }
  .btn-submit {
    height: 3.0625rem;
    width: 100%;
    font-family: inherit;
    font-size: 1.1026rem;
    margin-top: 0.6875rem;
    border-radius: 0.5rem;
    text-align: center;
    border: none;
    text-transform: capitalize;
    &.disabled {
      opacity: 0.5 !important;
    }
  }
}
</style>
