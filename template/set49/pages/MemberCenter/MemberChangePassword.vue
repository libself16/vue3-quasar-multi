<template>
  <BannerMember />
  <div class="change-password-layout">
    <div class="change-password-content">
      <MemberNav />
      <div class="change-password-form column">
        <div class="form-title-content">
          <div class="color-label"></div>
          <div class="title">{{ $t("member.forgotPassword.updatePasswordDetails") }}</div>
        </div>
        <q-form class="form-content" ref="formRef" @submit="setUserPassword">
          <div class="form-item row">
            <div class="label col-12">{{ $t("member.forgotPassword.currentPassword") }}</div>
            <div class="input-content col-12 col-sm-9">
              <q-input
                standout
                v-model="passwordForm.old_password"
                :placeholder="$t('placeholder.currenctPassword')"
                type="password"
                rounded
                outlined
                dense
                borderless
                lazy-rules
                :rules="[(val) => Rules.password(val)]"
              />
            </div>
          </div>
          <div class="form-item row">
            <div class="label col-12">{{ $t("member.forgotPassword.newPassword") }}</div>
            <div class="input-content col-12 col-sm-9">
              <q-input
                standout
                v-model="passwordForm.new_password"
                type="password"
                :placeholder="$t('placeholder.pleaseEnterPassword')"
                rounded
                outlined
                dense
                borderless
                lazy-rules
                :rules="[
                  (val) => Rules.password(val, $t('placeholder.passwordValidationShort')),
                  (val) => Rules.newPassword(passwordForm.old_password, val)
                ]"
              />
            </div>
          </div>
          <div class="form-item row">
            <div class="label col-12">{{ $t("member.forgotPassword.confirmPassword") }}</div>
            <div class="input-content col-12 col-sm-9">
              <q-input
                standout
                v-model="passwordForm.confirm_password"
                type="password"
                rounded
                outlined
                dense
                borderless
                lazy-rules
                :placeholder="$t('placeholder.pleaseEnterConfirmPassword')"
                :rules="[(val) => Rules.confirmPassword(passwordForm.new_password, val)]"
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

const { passwordForm, setUserPassword } = useUserInfo()
const Rules = useRule()
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import 'app/template/set49/assets/css/style.sass'
@import 'app/template/set49/assets/css/_variable.scss'

.change-password-layout
  @apply pt-12
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
      border-radius: 8px
      background: $primary-modal-bg
      padding: 3rem
      +iphone-width
        margin-top: 0
        padding: 0
        background: $primary-bg
        .form-title-content
          .title
            @apply whitespace-nowrap text-[1rem]
      .form-content
        +iphone-width
          width: calc( 100% - 2.5rem )
          margin: 1rem auto
          margin-bottom: 2.5rem
          padding: 1rem 1.5rem
          background: $primary-modal-bg
          border-radius: .5rem
        .form-item
          &:first-child
            margin-top: 4rem
            +phone-width
              @apply mt-0
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
        +phone-width
          @apply my-8 w-32 mx-auto

:deep(.nav-content)
  +iphone-width
    background: $primary-btn-bg!important
</style>
