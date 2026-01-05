<template>
  <q-card class="form-container">
    <!-- title -->
    <q-card-section class="p-0 mb-8">
      <h4 class="text-2xl font-bold">{{ $t("member.profile.title") }}</h4>
    </q-card-section>
    <!-- form -->
    <q-card-section class="p-0">
      <q-form @submit="setUserInfo2" v-if="memberNoFilterColumnList">
        <!-- user name -->
        <template v-for="item in memberNoFilterColumnList" :key="item.column_name">
          <div
            class="form-row"
            v-if="
              needCountryCodePhone &&
              (item.column_name === COLUMN_NAME.Enums.COUNTRY || item.column_name === COLUMN_NAME.Enums.PHONE)
            "
          >
            <label class="form-label" v-if="needCountryCodePhone && item.column_name === COLUMN_NAME.Enums.PHONE">{{
              phoneLabel
            }}</label>
            <div
              v-if="item.column_name === COLUMN_NAME.Enums.PHONE"
              class="form-input input-container flex flex-nowrap gap-2"
            >
              <q-select
                v-if="columnCountryCode"
                v-model="userInfoForm2[columnCountryCode.column_name]"
                class="w-2/6"
                :class="{ 'select-placeholder': !userInfoForm2[columnCountryCode.column_name] }"
                :options="columnCountryCode.values"
                emit-value
                map-options
                bg-color="white"
                outlined
                dense
                :display-value="
                  userInfoForm2[columnCountryCode.column_name]
                    ? undefined
                    : $t(memberColumnPlaceholderI18n[columnCountryCode.column_name] || '')
                "
                :disable="!columnCountryCode.edit"
                :rules="columnCountryCode.required ? [Rules.required()] : []"
              >
              </q-select>
              <q-input
                v-model="userInfoForm2[item.column_name]"
                class="w-4/6"
                :class="{ 'mb-3': item.required, 'mb-8': !item.required }"
                bg-color="white"
                dense
                outlined
                :placeholder="$t(memberColumnPlaceholderI18n[item.column_name] || '')"
                :disable="!item.edit"
                :rules="item.required ? [Rules.required()] : []"
              >
              </q-input>
            </div>
          </div>
          <div class="form-row" v-else-if="item.type === INPUT_TYPE.Enums.INPUT">
            <label class="form-label">
              {{
                $t(item?.lang?.[nowLang as LANGUAGE_TYPE.Enums] || memberColumnPlaceholderI18n[item.column_name] || "")
              }}
            </label>
            <ExtraInput :field="item" :class="'form-input'" v-model="userInfoForm2[item.column_name]"></ExtraInput>
          </div>
          <!-- 下拉選單類型 -->
          <div class="form-row" v-else-if="item.type === INPUT_TYPE.Enums.SELECT">
            <label class="form-label">
              {{
                $t(item?.lang?.[nowLang as LANGUAGE_TYPE.Enums] || memberColumnPlaceholderI18n[item.column_name] || "")
              }}
            </label>
            <ExtraSelect v-model="userInfoForm2[item.column_name]" :field="item" :class="'form-input'"></ExtraSelect>
          </div>
          <div class="form-row" v-else-if="item.type === INPUT_TYPE.Enums.DATE">
            <label class="form-label">
              {{
                $t(item?.lang?.[nowLang as LANGUAGE_TYPE.Enums] || memberColumnPlaceholderI18n[item.column_name] || "")
              }}
            </label>
            <DateInput :field="item" :class="'form-input'" v-model="userInfoForm2[item.column_name]"></DateInput>
          </div>

          <!-- <div class="form-row">
            <label class="form-label">{{ $t(memberColumnPlaceholderI18n[item.column_name]) }}</label>
            <q-input
              v-model="userInfoForm2[item.column_name]"
              dense
              class="form-input opacity-60"
              bg-color="white"
              :placeholder="$t(memberColumnPlaceholderI18n[item.column_name])"
              :disable="!item.edit"
              :rules="item.required ? [Rules.required()] : []"
            >
            </q-input>
          </div> -->
        </template>
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
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { COLUMN_NAME, GENDER, INPUT_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import DateInput from "../../../../components/ExtraInput/Date.vue"
import ExtraInput from "../../../../components/ExtraInput/Index.vue"
import ExtraSelect from "../../../../components/ExtraInput/Select.vue"

const { t } = useI18n()
const Rules = useRule()
const { nowLang } = useLanguage()
// const { userInfo, userInfoForm, resetUserInfoForm, setUserInfo } = useUserInfo()

const {
  userInfoForm2,
  memberColumnList,
  memberNoFilterColumnList,
  getMemberColumn,
  memberColumnPlaceholderI18n,
  memberColumnIconName,
  getSelectColumnValue,
  resetUserInfoForm2,
  setUserInfo2,
  setSingleUserInfo,
  needCountryCodePhone,
  columnCountryCode
} = useUserInfo()

// 排除特殊墜欄位
const excludeColumn = (columnName: string) => {
  switch (columnName) {
    case "phone":
    case "country":
      return false

    default:
      return true
  }
}

const phoneLabel = computed(() => {
  const countryItem: any = memberNoFilterColumnList.value.filter((field) => field.column_name === "country")[0]
  const phoneItem: any = memberNoFilterColumnList.value.filter((field) => field.column_name === "phone")[0]
  if (phoneItem)
    return phoneItem?.lang[nowLang.value]
      ? phoneItem?.lang[nowLang.value]
      : t(`member.register.${phoneItem.column_name}`)

  return countryItem?.lang[nowLang.value]
    ? countryItem?.lang[nowLang.value]
    : t(`member.register.${countryItem.column_name}`)
})

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

// watchEffect(async () => {
//   if (userInfo.value.contact) resetUserInfoForm()
// })

onMounted(async () => {
  await getMemberColumn()
  resetUserInfoForm2()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/modal.sass'
@import "app/template/set33_BLUE/assets/css/_variable.sass"
@import "app/template/set33_BLUE/assets/css/button.sass"

.form-container
  @apply bg-transparent shadow-none mt-2 p-6 rounded-lg
  background: #021524
  border: 1px solid #086eb8
  .form-row
    @apply flex items-start flex-wrap
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
        +iphone-width
          height: 2.375rem
          min-height: auto
          .q-field__native
            min-height: auto
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
