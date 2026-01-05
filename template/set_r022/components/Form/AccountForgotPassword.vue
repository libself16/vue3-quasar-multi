<template>
  <div :class="`${isLargeTablet ? 'h5' : 'pc'}`">
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
              <img :src="loginImg(`account${$q.dark.isActive ? '-dark' : ''}.png`)" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>
        <q-input
          v-model="formAccount.email"
          class="form-input border-bottom"
          dense
          borderless
          :placeholder="$t('member.forgotPassword.registeredEmail')"
          lazy-rules
          :rules="[Rules.required()]"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="loginImg(`mail${$q.dark.isActive ? '-dark' : ''}.png`)" alt="phone-number" />
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
import { reactive, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { EventBusKey } from "src/symbols"
import * as Request from "src/api/request.type"
import { useRule } from "src/common/hooks/useRule"
import { useAuth } from "src/common/hooks/useAuth"
import { injectStrict } from "src/common/utils/injectTyped"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { loginImg } = useSiteImg()
const { isLargeTablet } = useMediaQuery()
const { showVerifyModal } = useSlideVerify()
const { isLoading, handleForgetPassword } = useAuth()

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
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/form.scss";
@import "app/template/set_r022/assets/css/button.scss";

.form-container {
  @include pad-large-width {
    border: 1px solid var(--neutral-03);
    border-radius: 0.5rem;
    background: var(--neutral-01);
    padding-bottom: 0.545rem;
  }
}

.btn-submit {
  border: none;
  font-size: 1rem;
  font-weight: 400;
  border-radius: 0.5rem;
  background: var(--primary-01);
  color: var(--text-01);
  height: 2.571875rem;
  width: 100%;

  @include pad-large-width {
    margin-top: 2.538125rem;
  }
}
</style>
