<template>
  <div class="password-layout">
    <div class="password-box">
      <q-form @submit="setUserPassword">
        <div class="password-row">
          <q-input
            v-model="passwordForm.old_password"
            type="password"
            bg-color="white"
            outlined
            :label="$t('member.forgotPassword.currentPassword')"
            lazy-rules
            :rules="[(val) => Rules.password(val)]"
          />
        </div>
        <div class="password-row">
          <q-input
            v-model="passwordForm.new_password"
            type="password"
            bg-color="white"
            outlined
            :label="$t('member.forgotPassword.newPassword')"
            lazy-rules
            :rules="[Rules.password, (val) => Rules.newPassword(passwordForm.old_password, val)]"
          />
        </div>
        <div class="password-row">
          <q-input
            v-model="passwordForm.confirm_password"
            type="password"
            bg-color="white"
            outlined
            :label="$t('member.forgotPassword.confirmPassword')"
            lazy-rules
            :rules="[(val) => Rules.confirmPassword(passwordForm.new_password, val)]"
          />
        </div>

        <div class="password-row flex justify-center">
          <button class="btn" type="submit">{{ $t("common.btn.update") }}</button>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"

const { passwordForm, setUserPassword } = useUserInfo()
const Rules = useRule()
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/epicwin/css/_variable.sass'
@import 'app/template/epicwin/css/button.sass'
@import 'app/template/epicwin/css/form.sass'


.password-layout
  @apply p-5 mx-auto rounded-lg w-full
  +phone-width
    @apply p-4
  .password-box
    @apply p-5 pt-2.5
    background-color: $member-nav-bg-color
    +phone-width
      @apply p-4 pt-2.5
    .password-row
      @apply mt-6
</style>
