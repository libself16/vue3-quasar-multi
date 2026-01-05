<template>
  <q-form @submit="setUserInfo">
    <!-- User Name -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.profile.username") }}</label>
      <q-input v-model="userInfoForm.username" class="form-control" disable dense borderless lazy-rules> </q-input>
    </div>
    <!-- Full Name -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.profile.fullName") }}</label>
      <q-input
        v-model="userInfoForm.real_name"
        class="form-control"
        standout
        dense
        borderless
        :rules="[Rules.required()]"
      >
      </q-input>
    </div>
    <!-- Email -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.profile.email") }}</label>
      <q-input v-model="userInfoForm.email" class="form-control" standout dense borderless> </q-input>
    </div>
    <!-- Phone -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.profile.phone") }}</label>
      <q-input v-model="userInfoForm.phone" class="form-control" standout disable outlined dense borderless> </q-input>
    </div>
    <!-- Gender -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.profile.gender") }}</label>
      <q-select
        v-model="userInfoForm.gender"
        class="form-control gender-select"
        :options="genderDropdown"
        dense
        emit-value
        map-options
        outlined
        lazy-rules
        :rules="[Rules.requiredGender]"
        popup-content-style="background: #aa1e74 !important"
        options-selected-class="bg-blue-500 text-white"
      >
      </q-select>
    </div>
    <!-- Birthday -->
    <div class="form-wrapper">
      <label class="form-label">{{ $t("member.profile.birthday") }}</label>
      <q-input
        v-model="userInfoForm.date_of_birth"
        class="form-control"
        outlined
        readonly
        dense
        @click="showBirthdayPicker"
        lazy-rules
        :rules="[Rules.noRule]"
      >
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
    </div>
    <q-btn class="btn-modal-sub" no-caps type="submit" :loading="isLoading">
      <span> {{ $t("common.btn.update") }} {{ $t("menu.profile") }} </span>
    </q-btn>
  </q-form>
</template>

<script lang="ts" setup>
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
@import "src/common/css/_variable.sass";
@import "../../assets/css/btn.scss";
@import "app/template/set_royalslot88/assets/css/form.scss";

.calendar-content {
  ::v-deep(.q-date__header) {
    background: #aa1e74;
  }

  ::v-deep(.bg-primary) {
    background: #aa1e74 !important;
  }

  ::v-deep(.q-date__main) {
    background: #081c4c !important;
  }
}
</style>
