<template>
  <BannerMember />
  <div class="change-password-layout">
    <div class="change-password-content">
      <MemberNav />
      <div class="change-password-form column">
        <div class="form-title-content">
          <div class="color-label"></div>
          <div class="title">{{ $t("member.changePassword.setWithdrawalPassword") }}</div>
        </div>
        <q-form class="form-content" @submit="handleSubmit">
          <!-- old password -->
          <div v-if="userInfo.has_withdrawal_password" class="form-item row">
            <div class="label col-12">{{ $t("member.forgotPassword.currentPassword") }}</div>
            <div class="input-content col-12 col-sm-9">
              <q-input
                standout
                v-model="withdrawalPasswordForm.old_password"
                :placeholder="$t('placeholder.currenctPassword')"
                type="password"
                rounded
                outlined
                dense
                borderless
                lazy-rules
                :rules="[(val) => Rules.password(val, $t('placeholder.passwordValidationShort'))]"
              />
            </div>
          </div>
          <!-- new password -->
          <div class="form-item row">
            <div class="label col-12">{{ $t("member.forgotPassword.newPassword") }}</div>
            <div class="input-content col-12 col-sm-9">
              <q-input
                standout
                v-model="withdrawalPasswordForm.new_password"
                type="password"
                :placeholder="$t('placeholder.pleaseEnterPassword')"
                rounded
                outlined
                dense
                borderless
                lazy-rules
                :rules="[
                  (val) => Rules.password(val, $t('placeholder.passwordValidationShort')),
                  (val) => Rules.newPassword(withdrawalPasswordForm.old_password, val)
                ]"
              />
            </div>
          </div>
          <!-- confirm password -->
          <div class="form-item row">
            <div class="label col-12">{{ $t("member.forgotPassword.confirmPassword") }}</div>
            <div class="input-content col-12 col-sm-9">
              <q-input
                standout
                v-model="withdrawalPasswordForm.confirm_password"
                type="password"
                rounded
                outlined
                dense
                borderless
                lazy-rules
                :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
                :rules="[(val) => Rules.confirmPassword(withdrawalPasswordForm.new_password, val)]"
              />
            </div>
          </div>
          <!-- <div class="form-item">
            <div class="tip">Incorrect confirmation input</div>
          </div> -->
          <div class="action-btns row justify-center">
            <q-btn text-color="black" label="SUBMIT" class="submit-btn" type="submit" />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BannerMember from "app/template/set49/components/BannerMember.vue"
import MemberNav from "src/common/components/MemberNav.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"

const { userInfo, getUserInfo, withdrawalPasswordForm, resetWithdrawalPasswordForm, setUserWithdrawalPassword } =
  useUserInfo()
const Rules = useRule()

async function handleSubmit() {
  const { status } = await setUserWithdrawalPassword()
  if (status) {
    resetWithdrawalPasswordForm()
    await getUserInfo()
  }
}
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import 'app/template/set49/assets/css/menu.sass'
@import 'app/template/set49/assets/css/style.sass'
@import 'app/template/set49/assets/css/_variable.scss'

.change-password-layout
  padding-top: 6rem
  +iphone-width
    padding-top: 0
  .change-password-content
    color: white
    overflow: hidden
    max-width: 62.5rem
    margin: 0 auto
    +iphone-width
      padding: 0
    .change-password-form
      margin-top: 2.5rem
      // width: 100%
      border-radius: 8px
      background: #1C1E22
      padding: 3rem
      +iphone-width
        // width: 100vw
        margin-top: 0
        padding: 0
        background: #24262B
      .form-content
        +iphone-width
          width: 80%
          margin: 1rem auto
          padding: 1rem 1.5rem
          background: #1C1E22
          border-radius: .5rem
        .form-item
          &:first-child
            margin-top: 4rem
          .tip
            color: #6FCF97
            font-family: "Century Gothic"
            font-size: 1rem
            font-weight: 700
            text-transform: capitalize
            +iphone-width
              margin-top: 1rem
              font-size: 1rem
          .input-content
            margin-top: .5rem
            padding: 0
      .action-btns
        margin-top: 5rem
        margin-bottom: 4rem

:deep(.nav-content)
  +iphone-width
    background: $primary-btn-bg!important
</style>
