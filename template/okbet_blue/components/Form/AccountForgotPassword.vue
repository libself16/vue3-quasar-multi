<template>
  <div :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`" class="account-forgot-password-wrapper">
    <!-- account -->
    <q-form @submit="showVerifyModal([forgetPassword])" autocomplete="new-password">
      <div class="form-container">
        <q-input
          v-model="formAccount.account"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('member.forgotPassword.registeredAccount')"
          lazy-rules
          :rules="[Rules.required()]"
          autocomplete="new-password"
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
          :rules="[Rules.required()]"
          autocomplete="new-password"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('mail')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
      </div>

      <q-btn class="btn-submit mt-5 hide-hover" type="submit" :loading="isLoading">
        {{ $t("common.btn.submit") }}
      </q-btn>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useRule } from "src/common/hooks/useRule"
import { useAuth } from "src/common/hooks/useAuth"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import { useSiteImg } from "app/template/okbet_blue/hooks/useSiteImg"
import * as Request from "src/api/request.type"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
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
}

onMounted(() => {
  eventbus.on("openForgotPassword", (show: boolean) => {
    initForm()
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blue/assets/css/_variable.sass";
@import "app/template/okbet_blue/assets/css/form.scss";
@import "app/template/okbet_blue/assets/css/button.scss";

.account-forgot-password-wrapper {
  .form-input {
    ::v-deep(.q-field__inner) {
      @apply text-white;
      height: fit-content;
      border: 1px solid $border-dark-secondary;
      border-radius: 0.25rem;
    }
    ::v-deep(.q-field__native) {
      @apply text-white;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 30px $primary-bg-light-blue inset !important;
        -webkit-text-fill-color: #fff !important;
        box-shadow: 0 0 0 30px $primary-bg-light-blue inset !important;
        color: #fff !important;
        border-radius: 0 !important;
      }
    }
  }
}

.pc {
  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    border-radius: 0.5rem;
    color: $bg-dark-secondary;
    background: $bg-light;
    height: 2.5rem;
    width: 100%;
    position: relative;
  }
}
.h5 {
  .form-container {
    margin: 0.6875rem auto;
    background: $bg-dark-tertiary;
    border: 1px solid $border-dark;
    border-radius: 0.5rem;
  }
  .btn-submit {
    height: 3.0625rem;
    width: 100%;
    font-family: inherit;
    font-size: 1.1026rem;
    margin-top: 0.6875rem;
    background: $bg-light;
    color: $bg-dark-secondary;
    border-radius: 0.5rem;
    text-align: center;
    border: none;
    text-transform: capitalize;
    &.disabled {
      opacity: 0.5 !important;
    }
  }
}
.form-container {
  :deep(.q-field__native) {
    color: $text-tertiary;
  }
}
</style>
