<template>
  <BannerMember />
  <div class="profile-layout">
    <div class="profile-content">
      <MemberNav />
      <div class="form-title-content">
        <img :src="svgIcon('member-title-icon')" />
        <div class="title">{{ $t("member.profile.title") }}</div>
      </div>
      <q-form @submit="updateProfile">
        <div class="profile-form column">
          <div class="form-content">
            <div class="form-item row">
              <!-- username -->
              <div class="row col-12 col-sm-4 mr-16">
                <div class="label col-12">{{ $t("member.profile.username") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="userInfoForm.username"
                    rounded
                    outlined
                    dense
                    disable
                    borderless
                    :rules="[Rules.noRule]"
                    lazy-rules
                    :placeholder="$t('placeholder.pleaseEnterUsername')"
                  />
                </div>
              </div>
              <!-- fullName -->
              <div class="row col-12 col-sm-4">
                <div class="label col-12">{{ $t("member.profile.fullName") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="userInfoForm.real_name"
                    rounded
                    outlined
                    dense
                    borderless
                    :rules="[Rules.required()]"
                    lazy-rules
                    :placeholder="$t('placeholder.pleaseEnterFullname')"
                  />
                </div>
              </div>
            </div>
            <!-- email -->
            <div class="form-item row">
              <div class="label col-12">{{ $t("member.profile.email") }}</div>
              <div class="input-content col-12 col-sm-9">
                <q-input
                  standout
                  v-model="userInfoForm.email"
                  rounded
                  outlined
                  dense
                  borderless
                  disable
                  :rules="[Rules.noRule]"
                  lazy-rules
                  :placeholder="$t('placeholder.pleaseEnterEmail')"
                />
              </div>
            </div>
            <!-- phone -->
            <div class="form-item row">
              <div class="label col-12">{{ $t("member.profile.phone") }}</div>
              <div class="input-content col-12 col-sm-9">
                <q-input
                  standout
                  v-model="userInfoForm.phone"
                  rounded
                  outlined
                  dense
                  borderless
                  disable
                  :rules="[Rules.noRule]"
                  lazy-rules
                  :placeholder="$t('placeholder.pleaseEnterContactNo')"
                />
              </div>
            </div>
            <!-- gender -->
            <div class="form-item row mb-5">
              <div class="label col-12">{{ $t("member.profile.gender") }}</div>
              <div class="radio-content col-12 col-sm-10">
                <q-radio
                  v-for="item in genderDropdown"
                  :key="item.value"
                  dense
                  v-model="userInfoForm.gender"
                  :val="item.value"
                  :label="$t(item.label as string)"
                  checked-icon="circle"
                />
              </div>
            </div>
            <!-- birth -->
            <div class="form-item row birth-content">
              <div class="row col-12 col-sm-3 year-content mb-5">
                <div class="label col-12">{{ $t("member.profile.birthday") }}</div>
                <div class="input-content col-12">
                  <q-select
                    rounded
                    outlined
                    dense
                    v-model="birthForm.year"
                    :options="years"
                    @update:model-value="initDate"
                    :rules="[Rules.noRule]"
                    lazy-rules
                  >
                    <template #default>
                      <div v-if="!birthForm.year" class="select-placeholder">
                        {{ $t("placeholder.pleaseSelectYear") }}
                      </div>
                    </template>
                  </q-select>
                </div>
              </div>
              <div class="row col-12 col-sm-6 month-day-content mb-5">
                <div class="row col-12 col-sm-6 month-content">
                  <div class="label col-12">{{ $t("member.profile.month") }}</div>
                  <div class="input-content col-12">
                    <q-select
                      rounded
                      outlined
                      dense
                      v-model="birthForm.month"
                      :options="months"
                      @update:model-value="initDate"
                      :rules="[Rules.noRule]"
                      lazy-rules
                    >
                      <template #default>
                        <div v-if="!birthForm.month" class="select-placeholder">
                          {{ $t("placeholder.pleaseSelectMonth") }}
                        </div>
                      </template>
                    </q-select>
                  </div>
                </div>
                <div class="row col-12 col-sm-6 date-content">
                  <div class="label col-12">{{ $t("member.profile.date") }}</div>
                  <div class="input-content col-12">
                    <q-select
                      rounded
                      outlined
                      dense
                      v-model="birthForm.date"
                      :options="daysInMonth"
                      :rules="[Rules.noRule]"
                      lazy-rules
                    >
                      <template #default>
                        <div v-if="!birthForm.date" class="select-placeholder">
                          {{ $t("placeholder.pleaseSelectDate") }}
                        </div>
                      </template>
                    </q-select>
                  </div>
                </div>
              </div>
            </div>
            <!-- nick name -->
            <div class="form-item row">
              <div class="row col-12 col-sm-4 mr-16">
                <div class="label col-12">{{ $t("member.profile.nickName") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="userInfoForm.nickname"
                    rounded
                    outlined
                    dense
                    borderless
                    :rules="[Rules.noRule]"
                    lazy-rules
                    :placeholder="$t('placeholder.pleaseEnterNickName')"
                  />
                </div>
              </div>
            </div>
            <!-- contact -->
            <div class="form-item row">
              <!-- contact1 -->
              <div class="row col-12 col-sm-4 mr-16">
                <div class="label col-12">{{ $t("member.profile.contact1") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="userInfoForm.contact.contact1"
                    rounded
                    outlined
                    dense
                    borderless
                    :rules="[Rules.noRule]"
                    lazy-rules
                    :placeholder="$t('placeholder.pleaseEnterContactNo')"
                  />
                </div>
              </div>
              <!-- contact2 -->
              <div class="row col-12 col-sm-4">
                <div class="label col-12">{{ $t("member.profile.contact2") }}</div>
                <div class="input-content col-12">
                  <q-input
                    standout
                    v-model="userInfoForm.contact.contact2"
                    rounded
                    outlined
                    dense
                    borderless
                    :rules="[Rules.noRule]"
                    lazy-rules
                    :placeholder="$t('placeholder.pleaseEnterContactNo')"
                  />
                </div>
              </div>
            </div>
            <div class="action-btns row justify-center">
              <q-btn text-color="white" label="SUBMIT" class="submit-btn" type="submit" />
            </div>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BannerMember from "app/template/set_jokerhill/components/BannerMember.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import dayjs from "dayjs"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useRule } from "src/common/hooks/useRule"
import { GENDER } from "src/common/utils/constants"
import { computed, reactive, watchEffect } from "vue"
import MemberNav from "../../components/MemberNav.vue"

const Rules = useRule()
const { genEnumToDropdown } = useCommon()
const { userInfo, userInfoForm, resetUserInfoForm, setUserInfo } = useUserInfo()

const birthForm = reactive<{
  year: string | number
  month: string | number
  date: string | number
}>({
  year: "",
  month: "",
  date: ""
})

const { svgIcon } = useSiteImg()
const genderDropdown = computed(() => genEnumToDropdown(GENDER.Enums, GENDER.I18nKeys))

const years = computed(() => {
  const currentYear = dayjs().year()
  return Array.from({ length: 100 }, (_, i) => currentYear - i)
})

const months = computed(() => {
  const result = []
  for (let i = 1; i <= 12; i++) {
    result.push(`${i}`)
  }
  return result
})

const daysInMonth = computed(() => {
  if (!birthForm.year || !birthForm.month) return []
  const maxDate = dayjs(`${birthForm.year}-${birthForm.month}-01`).daysInMonth()
  const result = []
  for (let i = 1; i <= maxDate; i++) {
    result.push(`${i}`)
  }
  return result
})

const initDate = () => {
  birthForm.date = ""
}

const updateProfile = async () => {
  userInfoForm.avatar_path = ""
  userInfoForm.date_of_birth = dayjs(`${birthForm.year}-${birthForm.month}-${birthForm.date}`).format("YYYY-MM-DD")
  setUserInfo()
}

watchEffect(() => {
  if (userInfo.value.contact) resetUserInfoForm()
})

watchEffect(() => {
  const birth = dayjs(userInfo.value.date_of_birth)
  if (birth.isValid()) {
    birthForm.year = birth.year()
    birthForm.month = birth.month() + 1
    birthForm.date = birth.date()
  }
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import "../../assets/css/form.sass"

.profile-layout
  .profile-content
    color: rgba(20, 20, 20, 0.60)
    max-width: 62.5rem
    margin: 0 auto
    // padding: 6vw 0
    overflow: hidden
    +iphone-width
      padding: 0
    .profile-form
      width: 100%
      border-radius: 8px
      background: #fff
      padding: 2rem 2.6875rem
      +iphone-width
        // width: 100%
        margin-top: 0
        padding: 0
        // background: #24262B
      .form-content
        +iphone-width
          width: 100%
          margin: 1rem auto
          padding: 1rem 1.5rem
          background: #fff
          border-radius: .5rem
        .form-item
          display: flex
          justify-content: flex-start
          &:first-child
            margin-top: 1rem
          .input-content
            margin-top: .5rem
            padding: 0
            :deep(.q-field--disabled)
              .q-field__control
                background-color: gray
                div
                  opacity: 1 !important
          .radio-content
            +setFlex(flex-start)
            padding-top: 1.75rem
            padding-left: .75rem
            gap: 1.563vw
            +iphone-width
              flex-wrap: wrap
              padding-top: 1.125rem
              padding-left: .625rem
              gap: 1.25rem
          &.birth-content
            gap: 1.25rem
            +iphone-width
              gap: 0
              justify-content: space-between
            .month-day-content
              flex-wrap: nowrap
              gap: 1.25rem
              +iphone-width
                @apply grid grid-cols-2
</style>
