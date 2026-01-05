<template>
  <q-card class="form-container">
    <!-- title -->
    <q-card-section class="p-0 mb-8">
      <h4 class="text-2xl font-bold">{{ $t("member.profile.title") }}</h4>
    </q-card-section>
    <!-- form -->
    <q-card-section class="p-0">
      <q-form @submit="setUserInfo">
        <!-- user name -->
        <div class="form-row">
          <label class="form-label">{{ $t("member.profile.username") }}</label>
          <q-input v-model="userInfoForm.username" class="form-input opacity-60" bg-color="white" outlined disable />
        </div>
        <!-- real name -->
        <div class="form-row">
          <label class="form-label flex justify-between items-center">
            <span>{{ $t("member.profile.fullName") }}</span>
            <span class="mr-4 text-red-600 text-base">*</span>
          </label>
          <q-input
            v-model="userInfoForm.real_name"
            class="form-input"
            bg-color="white"
            outlined
            :rules="[Rules.required()]"
          />
        </div>
        <!-- email -->
        <div class="form-row">
          <label class="form-label">{{ $t("member.profile.email") }}</label>
          <q-input v-model="userInfoForm.email" class="form-input opacity-60" bg-color="white" outlined disable />
        </div>
        <!-- phone -->
        <div class="form-row">
          <label class="form-label">{{ $t("member.profile.phone") }}</label>
          <q-input v-model="userInfoForm.phone" class="form-input opacity-60" bg-color="white" outlined disable />
        </div>
        <!-- gender -->
        <div class="form-row">
          <label class="form-label">{{ $t("member.profile.gender") }}</label>
          <q-select
            v-model="userInfoForm.gender"
            class="form-input"
            :options="genderDropdown"
            emit-value
            map-options
            bg-color="white"
            outlined
            lazy-rules
            :rules="[Rules.requiredGender]"
          />
        </div>
        <!-- birthday -->
        <div class="form-row relative">
          <label class="form-label">{{ $t("member.profile.birthday") }}</label>
          <q-input
            v-model="userInfoForm.date_of_birth"
            class="form-input"
            bg-color="white"
            outlined
            readonly
            @click="isDatePickerShow = true"
            lazy-rules
            :rules="[Rules.noRule]"
          />
          <div v-if="isDatePickerShow" class="mask" @click.self="isDatePickerShow = false">
            <q-date v-model="userInfoForm.date_of_birth" mask="YYYY-MM-DD" minimal class="bg-black" color="purple-10" />
          </div>
        </div>
        <!-- nick name -->
        <div class="form-row">
          <label class="form-label flex justify-between items-center">
            <span>{{ $t("member.profile.nickName") }}</span>
          </label>
          <q-input
            v-model="userInfoForm.nickname"
            class="form-input"
            bg-color="white"
            outlined
            :rules="[Rules.noRule]"
          />
        </div>
        <!-- contact1 -->
        <div class="form-row">
          <label class="form-label flex justify-between items-center">
            <span>{{ $t("member.profile.contact1") }}</span>
          </label>
          <q-input
            v-model="userInfoForm.contact.contact1"
            class="form-input"
            bg-color="white"
            outlined
            :rules="[Rules.noRule]"
          />
        </div>
        <!-- contact2 -->
        <div class="form-row">
          <label class="form-label flex justify-between items-center">
            <span>{{ $t("member.profile.contact2") }}</span>
          </label>
          <q-input
            v-model="userInfoForm.contact.contact2"
            class="form-input"
            bg-color="white"
            outlined
            :rules="[Rules.noRule]"
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
  name: "ProfileDetail"
}
</script>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"
import { useI18n } from "vue-i18n"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { GENDER } from "src/common/utils/constants"

const { t } = useI18n()
const Rules = useRule()
const { userInfo, userInfoForm, resetUserInfoForm, setUserInfo } = useUserInfo()

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

const isDatePickerShow = ref(false)

watchEffect(async () => {
  if (userInfo.value.contact) resetUserInfoForm()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/modal.sass'
@import "app/template/set33/assets/css/_variable.sass"
@import "app/template/set33/assets/css/button.sass"

.form-container
  @apply bg-transparent shadow-none mt-2 p-6 rounded-lg
  background: #021524
  border: 1px solid #086eb8
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
        height: 2.375rem
        min-height: 2.375rem
        +iphone-width
          min-height: auto
          .q-field__native
            min-height: auto
        .q-field__native
          min-height: 2.375rem
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
