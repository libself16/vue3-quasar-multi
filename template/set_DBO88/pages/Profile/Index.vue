<template>
  <div class="profile-wrapper">
    <div class="page-title">{{ $t("menu.profile") }}</div>
    <q-form class="profile-form column" @submit="handleSubmit">
      <!-- User Name -->
      <div class="form-label">{{ $t("member.profile.username") }} :</div>
      <q-input
        standout
        v-model="userInfoForm.username"
        disable
        outlined
        dense
        bg-color="white"
        class="pb-5"
        color="black"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-user" class="form-icon" />
        </template>
      </q-input>
      <!-- Full Name -->
      <div class="form-label">{{ $t("member.profile.fullName") }} :</div>
      <q-input
        standout
        v-model="userInfoForm.real_name"
        outlined
        dense
        bg-color="white"
        color="black"
        :rules="[Rules.required()]"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-id-card" class="form-icon" />
        </template>
      </q-input>
      <!-- Email -->
      <div class="form-label">{{ $t("member.profile.email") }} :</div>
      <q-input standout v-model="userInfoForm.email" disable outlined dense class="pb-5" bg-color="white" color="black">
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-envelope" class="form-icon" />
        </template>
      </q-input>
      <!-- Phone -->
      <div class="form-label">{{ $t("member.profile.phone") }} :</div>
      <q-input standout v-model="userInfoForm.phone" disable outlined dense class="pb-5" bg-color="white" color="black">
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-phone" class="form-icon" />
        </template>
      </q-input>
      <!-- Gender -->
      <div class="form-label">{{ $t("member.profile.gender") }} :</div>
      <q-select
        v-model="userInfoForm.gender"
        class="pb-5"
        :options="genderDropdown"
        dense
        emit-value
        map-options
        bg-color="white"
        color="black"
        outlined
        lazy-rules
        :rules="[Rules.requiredGender]"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-venus-mars" class="form-icon cursor-pointer mr-2" />
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label class="text-white">{{ scope.opt.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <!-- Birthday -->
      <div class="form-label">{{ $t("member.profile.birthday") }} :</div>
      <q-input
        v-model="userInfoForm.date_of_birth"
        outlined
        readonly
        dense
        bg-color="white"
        @click="showBirthdayPicker"
        lazy-rules
        :rules="[Rules.noRule]"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-birthday-cake" class="form-icon cursor-pointer" @click="showBirthdayPicker" />
        </template>
      </q-input>
      <q-dialog v-model="isShowBirthdayPicker" position="standard">
        <q-card class="q-pa-none">
          <q-date v-model="userInfoForm.date_of_birth" class="calendar-content w-full" mask="YYYY-MM-DD">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" flat />
            </div>
          </q-date>
        </q-card>
      </q-dialog>
      <!-- Submit -->
      <div class="form-btn-wrapper">
        <q-btn class="form-btn-submit" type="submit" :loading="isLoading">
          {{ $t("common.btn.submit") }}
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"
import { useI18n } from "vue-i18n"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { GENDER } from "src/common/utils/constants"
import { useAuth } from "src/common/hooks/useAuth"

const { t } = useI18n()
const Rules = useRule()
const { userInfo, userInfoForm, resetUserInfoForm, setUserInfo } = useUserInfo()
const isShowBirthdayPicker = ref(false)
const { isLoading } = useAuth()

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

const showBirthdayPicker = () => {
  isShowBirthdayPicker.value = true
}

watchEffect(async () => {
  if (userInfo.value.contact) resetUserInfoForm()
})

const handleSubmit = async () => {
  await setUserInfo()
}
</script>

<style scoped lang="scss">
@import "app/template/set_DBO88/assets/css/_variable.scss";
@import "app/template/set_DBO88/assets/css/form.scss";
@import "app/template/set_DBO88/assets/css/text.scss";
.profile-wrapper {
  @apply flex flex-col w-full max-w-[65rem] mx-auto;
  @apply pt-4 px-[.625rem] pb-4;

  :deep(.form-label) {
    @apply uppercase text-base font-bold;
  }

  .form-icon {
    color: $primary-color;
  }

  .form-label {
    @apply text-base font-bold;
    color: $text-white;
  }

  .profile-form {
    @apply p-[2.25rem] mb-4;
    background-color: #24262b;
    border-radius: 1.5rem;
  }
}
</style>
