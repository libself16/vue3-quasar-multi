<template>
  <div class="profile-layout">
    <div class="profile-box">
      <q-form @submit="setUserInfo">
        <!-- user name -->
        <div class="profile-row">
          <q-input
            v-model="userInfoForm.username"
            bg-color="white"
            outlined
            :label="$t('member.profile.username')"
            disable
          />
        </div>
        <!-- real name -->
        <div class="profile-row">
          <q-input
            v-model="userInfoForm.real_name"
            bg-color="white"
            outlined
            :label="$t('member.profile.fullName')"
            lazy-rules
            :rules="[Rules.required()]"
            :disable="disabled"
          />
        </div>
        <!-- email -->
        <div class="profile-row">
          <q-input v-model="userInfoForm.email" bg-color="white" outlined :label="$t('member.profile.email')" disable />
        </div>
        <!-- phone -->
        <div class="profile-row">
          <q-input v-model="userInfoForm.phone" bg-color="white" outlined :label="$t('member.profile.phone')" disable />
        </div>
        <!-- gender genderDropdown -->
        <div class="profile-row">
          <q-select
            v-model="userInfoForm.gender"
            :options="genderDropdown"
            emit-value
            map-options
            bg-color="white"
            outlined
            :label="$t('member.profile.gender')"
            :disable="disabled"
            lazy-rules
            :rules="[Rules.requiredGender]"
          />
        </div>
        <div class="profile-row position-relative">
          <div>
            <q-input
              v-model="userInfoForm.date_of_birth"
              bg-color="white"
              outlined
              :label="$t('member.profile.birthday')"
              :disable="disabled"
              readonly
              @click="isDatePickerShow = true"
              lazy-rules
              :rules="[Rules.required()]"
            />
            <div v-if="isDatePickerShow" class="mask" @click.self="isDatePickerShow = false">
              <q-date
                v-model="userInfoForm.date_of_birth"
                mask="YYYY-MM-DD"
                minimal
                class="bg-black"
                color="purple-10"
              />
            </div>
          </div>
        </div>
        <div class="profile-row">
          <q-input
            v-model="userInfoForm.nickname"
            bg-color="white"
            outlined
            :label="$t('member.profile.nickName')"
            lazy-rules
            :rules="[Rules.required()]"
            :disable="disabled"
          />
        </div>
        <div class="profile-row">
          <q-input
            v-model="userInfoForm.contact.contact1"
            bg-color="white"
            outlined
            :label="$t('member.profile.contact1')"
            lazy-rules
            :rules="[Rules.required()]"
            :disable="disabled"
          />
        </div>
        <div class="profile-row">
          <q-input
            v-model="userInfoForm.contact.contact2"
            bg-color="white"
            outlined
            :label="$t('member.profile.contact2')"
            lazy-rules
            :rules="[Rules.required()]"
            :disable="disabled"
          />
        </div>
        <div v-if="disabled" class="profile-row flex justify-center">
          <button class="btn" @click="disabled = !disabled">{{ $t("common.btn.edit") }}</button>
        </div>
        <div v-else class="profile-row flex justify-evenly">
          <button class="btn" type="submit">{{ $t("common.btn.update") }}</button>
          <button class="btn" @click="handelCancelBtn">{{ $t("common.btn.cancel") }}</button>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { GENDER } from "src/common/utils/constants"
import { useUserInfoStore } from "src/stores/userInfoStore"
import { computed, ref, watchEffect } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

const { t } = useI18n()
const Rules = useRule()
const route = useRoute()
const { userInfo } = useUserInfoStore()
const { userInfoForm, resetUserInfoForm, setUserInfo, getUserInfo } = useUserInfo()

const genderDropdown = computed(() => {
  const genderList = Object.values(GENDER.Enums).filter((v) => !isNaN(Number(v)))
  return genderList.map((e) => {
    const value = e
    const label = t(GENDER.I18nKeys[e as GENDER.Enums])
    return {
      label,
      value
    }
  })
})

const disabled = ref(true)
const isDatePickerShow = ref(false)

function handelCancelBtn() {
  disabled.value = !disabled.value
  resetUserInfoForm()
}

watchEffect(async () => {
  if (userInfo.contact) resetUserInfoForm()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/epicwin/css/_variable.sass'
@import 'app/template/epicwin/css/button.sass'
@import 'app/template/epicwin/css/form.sass'
@import 'src/css/modal.sass'


.profile-layout
  @apply p-5 mx-auto rounded-lg w-full
  +phone-width
    @apply p-4
  .profile-box
    @apply p-5 pt-2.5
    background-color: $member-nav-bg-color
    +phone-width
      @apply p-4 pt-2.5
    .profile-row
      @apply mt-6
</style>
