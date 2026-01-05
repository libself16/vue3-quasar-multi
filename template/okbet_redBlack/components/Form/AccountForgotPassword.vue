<template>
  <div :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <!-- account -->
    <q-form @submit="showVerifyModal([forgetPassword])">
      <div class="form-container">
        <q-input
          v-model="formAccount.account"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('member.forgotPassword.registeredAccount')"
          lazy-rules
          :rules="[Rules.required()]"
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

      <q-btn color="primary" class="btn-submit mt-5 hide-hover" type="submit" :loading="isLoading">
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
import { useRouter } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import { useSiteImg } from "app/template/okbet_redBlack/hooks/useSiteImg"
import * as Request from "src/api/request.type"
import { FORGOT_PASS_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

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
}

onMounted(() => {
  eventbus.on("openForgotPassword", (show: boolean) => {
    initForm()
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_redBlack/assets/css/_variable.sass";
@import "app/template/okbet_redBlack/assets/css/form.scss";
@import "app/template/okbet_redBlack/assets/css/button.scss";

.pc {
  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    border-radius: 0.5rem;
    color: $text-light-color;
    height: 2.5rem;
    width: 100%;
    position: relative;
  }
}
.h5 {
  .form-container {
    margin: 0.6875rem auto;
    border-radius: 0.5rem;
    border: 1px solid $border-misty-blue-color;
    background: $white-color;
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
