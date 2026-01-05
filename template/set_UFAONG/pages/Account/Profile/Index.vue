<template>
  <div class="profile-wrapper pt-4 px-[10px] pb-[90px]">
    <h3 class="font-bold text-xl mb-2">{{ $t("member.profile.title") }}</h3>
    <q-form class="profile-form column" @submit="setUserInfo">
      <!-- User Name -->
      <div class="form-label">{{ $t("member.profile.username") }} :</div>
      <q-input standout v-model="userInfoForm.username" disable outlined dense bg-color="white" color="black">
        <template v-slot:prepend>
          <q-icon name="fas fa-user" class="text-black" />
        </template>
      </q-input>
      <!-- Full Name -->
      <div class="field-input">
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
            <q-icon name="fas fa-id-card" class="text-black" />
          </template>
        </q-input>
      </div>
      <!-- Email -->
      <div class="form-label">{{ $t("member.profile.email") }} :</div>
      <q-input
        standout
        v-model="userInfoForm.email"
        disable
        outlined
        dense
        class="form-input"
        bg-color="white"
        color="black"
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-envelope" class="text-black" />
        </template>
      </q-input>
      <!-- Phone -->
      <div class="form-label">{{ $t("member.profile.phone") }} :</div>
      <q-input
        standout
        v-model="userInfoForm.phone"
        disable
        outlined
        dense
        class="form-input"
        bg-color="white"
        color="black"
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-phone" class="text-black" />
        </template>
      </q-input>
      <!-- Gender -->
      <div class="form-label">{{ $t("member.profile.gender") }} :</div>
      <q-select
        v-model="userInfoForm.gender"
        class="form-input"
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
          <q-icon name="fas fa-venus-mars" class="text-black cursor-pointer mr-2" />
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
          <q-icon name="fas fa-birthday-cake" class="text-black cursor-pointer" @click="showBirthdayPicker" />
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
      <!-- Nick Name -->
      <div class="form-label">{{ $t("member.profile.nickName") }} :</div>
      <q-input
        standout
        v-model="userInfoForm.nickname"
        outlined
        dense
        bg-color="white"
        color="black"
        :rules="[Rules.noRule]"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-user-tag" class="text-black" />
        </template>
      </q-input>
      <!-- Contact 1 -->
      <div class="form-label">{{ $t("member.profile.contact1") }} :</div>
      <q-input
        standout
        v-model="userInfoForm.contact.contact1"
        outlined
        dense
        bg-color="white"
        color="black"
        :rules="[Rules.noRule]"
      >
        <template v-slot:prepend>
          <q-icon name="fab fa-skype" class="text-black" />
        </template>
      </q-input>
      <!-- Contact 2 -->
      <div class="form-label">{{ $t("member.profile.contact2") }} :</div>
      <q-input
        standout
        v-model="userInfoForm.contact.contact2"
        outlined
        dense
        bg-color="white"
        color="black"
        class="mb-5"
        :rules="[Rules.noRule]"
      >
        <template v-slot:prepend>
          <q-icon name="fab fa-line" class="text-black" />
        </template>
      </q-input>
      <!-- Submit -->
      <q-btn class="btn-submit" type="submit" :loading="isLoading">
        {{ $t("common.btn.submit") }}
      </q-btn>
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
</script>

<style lang="scss" scoped>
@import "../../../assets/css/variable";
@import "../../../assets/css/main.scss";

.profile-wrapper {
  color: $primary;

  .form-label {
    @apply text-base font-semibold py-[10px];
  }

  .profile-form {
    ::v-deep(.q-field--disabled) {
      opacity: 0.6;
    }

    ::v-deep(.q-field--with-bottom) {
      padding-bottom: 0;
    }
  }
}
</style>
