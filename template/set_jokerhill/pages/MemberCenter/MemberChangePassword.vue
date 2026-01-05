<template>
  <BannerMember />
  <div class="change-password-layout">
    <div class="change-password-content">
      <MemberNav />
      <div class="form-title-content">
        <img :src="svgIcon('member-title-icon')" />
        <div class="title">{{ $t("member.forgotPassword.updatePasswordDetails") }}</div>
      </div>
      <div class="change-password-form column">
        <q-form class="form-content" @submit="setUserPassword">
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
                :placeholder="$t('placeholder.passwordValidationShort')"
                rounded
                outlined
                dense
                borderless
                lazy-rules
                :rules="[Rules.password, (val) => Rules.newPassword(passwordForm.old_password, val)]"
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
                :rules="[(val) => Rules.confirmPassword(passwordForm.new_password, val)]"
              />
            </div>
          </div>
          <!-- <div class="form-item">
            <div class="tip">Incorrect confirmation input</div>
          </div> -->
          <div class="action-btns row justify-center">
            <q-btn text-color="white" label="SUBMIT" class="submit-btn" type="submit" />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BannerMember from "app/template/set_jokerhill/components/BannerMember.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import MemberNav from "../../components/MemberNav.vue"

const { passwordForm, setUserPassword } = useUserInfo()
const { svgIcon } = useSiteImg()
const Rules = useRule()
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import "../../assets/css/form.sass"

.change-password-layout
  padding-top: 6rem
  +iphone-width
    padding-top: 0
  .change-password-content
    color: rgba(20, 20, 20, 0.60)
    overflow: hidden
    max-width: 62.5rem
    margin: 0 auto
    +iphone-width
      padding: 0
    .change-password-form
      // width: 100%
      border-radius: 8px
      background: #fff
      padding: 3rem
      +iphone-width
        // width: 100vw
        margin-top: 0
        padding: 0
        background: #fff
      .form-content
        +iphone-width
          width: 80%
          margin: 0rem auto
          padding: 0rem 1.5rem
          background: #fff
          border-radius: .5rem
        .form-item
          &:first-child
            // margin-top: 4rem
            +iphone-width
              margin-top: 2rem
          .tip
            color: #6FCF97
            font-family: "NotoSansTC"
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
        +iphone-width
          margin-top: 1.8rem
          margin-bottom: 2.5rem
</style>
