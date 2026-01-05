<template>
  <q-card class="form-container">
    <!-- title -->
    <q-card-section class="p-0 mb-8">
      <h4 class="text-2xl font-bold">{{ $t("member.forgotPassword.updatePasswordDetails") }}</h4>
    </q-card-section>
    <!-- form -->
    <q-card-section class="p-0">
      <q-form @submit="handleSubmit" ref="passwordFromRef">
        <!-- old_password -->
        <div v-if="!userInfo2.empty_password" class="form-row">
          <label class="form-label">{{ $t("member.forgotPassword.currentPassword") }}</label>
          <q-input
            v-model="passwordForm.old_password"
            type="password"
            class="form-input"
            bg-color="white"
            outlined
            lazy-rules
            :rules="[(val) => Rules.password(val)]"
            :placeholder="$t('placeholder.currenctPassword')"
          />
        </div>
        <!-- new_password -->
        <div class="form-row">
          <label class="form-label">{{ $t("member.forgotPassword.newPassword") }}</label>
          <q-input
            v-model="passwordForm.new_password"
            type="password"
            class="form-input"
            bg-color="white"
            outlined
            lazy-rules
            :rules="[(val) => Rules.password(val), (val) => Rules.newPassword(passwordForm.old_password, val)]"
            :placeholder="$t('placeholder.characters8-20')"
          />
        </div>
        <!-- confirm_password -->
        <div class="form-row">
          <label class="form-label">{{ $t("member.forgotPassword.confirmPassword") }}</label>
          <q-input
            v-model="passwordForm.confirm_password"
            type="password"
            class="form-input"
            bg-color="white"
            outlined
            lazy-rules
            :rules="[(val) => Rules.confirmPassword(passwordForm.new_password, val)]"
            :placeholder="$t('placeholder.characters8-20')"
          />
        </div>

        <!-- submit btn -->
        <div class="form-row-submit">
          <q-btn rounded color="submit" push :label="$t('common.btn.submit')" type="submit" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
export default {
  name: "ProfilePassword"
}
</script>

<script lang="ts" setup>
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { ref } from "vue"

const { userInfo2, passwordForm, setUserPassword, resetPasswordForm } = useUserInfo()
const Rules = useRule()
const passwordFromRef = ref()

async function handleSubmit() {
  const { status } = await setUserPassword()
  if (!status) return
  resetPasswordForm()
  passwordFromRef.value.resetValidation()
}
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/modal.sass'
@import "app/template/set33_GREEN/assets/css/_variable.sass"
@import "app/template/set33_GREEN/assets/css/button.sass"

.form-container
  @apply bg-transparent shadow-none mt-2 p-6 rounded-lg
  background: rgba(8, 47, 26, 1)
  border: 1px solid rgba(71, 184, 61, 1)
  .form-row
    @apply mb-5 flex items-center flex-wrap
    +iphone-width
      @apply mb-0
    .form-label
      @apply text-base w-1/5 flex justify-between items-center
      +iphone-width
        @apply w-full mt-5 mb-2
    .form-input
      @apply w-4/5
      +iphone-width
        @apply w-full
      :deep(.q-field__control)
        +iphone-width
          height: 2.375rem
          min-height: auto
          .q-field__native
            min-height: auto
          .q-field__append
            height: 2.375rem
  .form-row-submit
    @apply flex justify-end
    +pad-width
      @apply w-1/5 block
    +iphone-width
      @apply w-full
    .bg-submit
      margin-left: 25%
      +iphone-width
        @apply w-full ml-0
</style>
