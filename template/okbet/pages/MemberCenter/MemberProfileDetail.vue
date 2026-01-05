<template>
  <HeaderTitleBack v-if="isMobile" titleI18n="member.profile.myDetails">
    <div class="profile-container h5">
      <div class="avator-container">
        <span class="title">{{ $t("member.profile.profilePhoto") }}</span>
        <div class="flex items-center justify-center">
          <Avatar />
        </div>
      </div>
      <div class="info-container">
        <template v-for="item in memberColumnList" :key="item.column_name">
          <template
            v-if="
              needCountryCodePhone &&
              (item.column_name === COLUMN_NAME.Enums.COUNTRY || item.column_name === COLUMN_NAME.Enums.PHONE)
            "
          >
            <template v-if="item.column_name === COLUMN_NAME.Enums.PHONE">
              <div @click="handleDialogOpen(item)" class="info-row">
                <p class="title">{{ item?.lang?.[nowLang as LANGUAGE_TYPE.Enums] }}</p>
                <p class="content">
                  <span v-if="columnCountryCode" class="mr-1">
                    {{ getSelectColumnValue(columnCountryCode?.column_name) }}
                  </span>
                  <span>
                    {{ userInfoForm2[item.column_name] }}
                  </span>
                  <q-icon v-if="item.edit || columnCountryCode?.edit" name="arrow_forward_ios"></q-icon>
                </p>
              </div>
              <q-separator />
            </template>
          </template>
          <template v-else>
            <div @click="handleDialogOpen(item)" class="info-row">
              <p class="title">{{ item?.lang?.[nowLang as LANGUAGE_TYPE.Enums] }}</p>
              <p class="content">
                <span v-if="item.type === INPUT_TYPE.Enums.SELECT">
                  {{ getSelectColumnValue(item.column_name) }}
                </span>
                <span v-else>
                  {{ userInfoForm2[item.column_name] }}
                </span>
                <q-icon v-if="item.edit" name="arrow_forward_ios"></q-icon>
              </p>
            </div>
            <q-separator />
          </template>
        </template>
        <div class="info-row" @click="handleDialogOpen(selfExclusionColumn)">
          <p class="title">{{ $t("member.profile.disableAccount") }}</p>
          <p class="content">
            <q-icon name="arrow_forward_ios"></q-icon>
          </p>
        </div>
        <template v-if="isKycEnabled">
          <q-separator />
          <div class="info-row" @click="$router.push({ name: 'MemberKyc' })">
            <p class="title">{{ $t("menu.getVerify") }}</p>
            <p class="content">
              <q-icon name="arrow_forward_ios"></q-icon>
            </p>
          </div>
        </template>
      </div>
      <div class="info-container logout">
        <q-btn :loading="isLoading" @click="logout">{{ $t("common.btn.logout") }}</q-btn>
      </div>
    </div>
    <q-dialog v-model="dialog.show" position="bottom" persistent full-width class="edit-dialog" :maximized="true">
      <q-card class="dialog-card">
        <q-form @submit="handleH5Submit" @reset="closeDialog">
          <q-card-section class="dialog-header">
            <q-btn flat class="btn-cancel" type="reset"> {{ $t("common.btn.cancel") }}</q-btn>
            <span class="title">{{ dialog.info?.lang?.[nowLang as LANGUAGE_TYPE.Enums] }}</span>
            <q-btn flat class="btn-confirm" color="primary" type="submit"> {{ $t("common.btn.confirm") }}</q-btn>
          </q-card-section>
          <q-card-section class="dialog-body">
            <template v-if="needCountryCodePhone && dialog.info.column_name === COLUMN_NAME.Enums.PHONE">
              <div class="w-full p-5 flex flex-nowrap gap-2">
                <q-select
                  v-if="columnCountryCode"
                  v-model="userInfoForm2[columnCountryCode.column_name]"
                  class=""
                  :class="{ 'select-placeholder': !userInfoForm2[columnCountryCode.column_name] }"
                  :options="columnCountryCode.values"
                  emit-value
                  map-options
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
                  v-model="userInfoForm2[dialog.info.column_name]"
                  :placeholder="$t(memberColumnPlaceholderI18n[dialog.info.column_name] ?? '')"
                  :name="dialog.info.column_name"
                  dense
                  class="dialog-form-input flex-1"
                  :disable="!dialog.info.edit"
                  :rules="dialog.info.required ? [Rules.required()] : []"
                >
                </q-input>
              </div>
            </template>
            <div v-else-if="dialog.info.type === INPUT_TYPE.Enums.INPUT" class="dialog-form-row">
              <q-input
                v-model="userInfoForm2[dialog.info.column_name]"
                :placeholder="$t(memberColumnPlaceholderI18n[dialog.info.column_name] ?? '')"
                :name="dialog.info.column_name"
                dense
                class="dialog-form-input"
                :rules="dialog.info.required ? [Rules.required()] : []"
              >
              </q-input>
            </div>
            <div v-else-if="dialog.info.type === INPUT_TYPE.Enums.SELECT" class="select-container">
              <div
                v-for="item in dialog.info.values"
                :key="item.value"
                class="select-row"
                :class="{ active: userInfoForm2[dialog.info.column_name] === item.value }"
                @click=";(userInfoForm2[dialog.info.column_name] as string | number) = item.value"
              >
                <span class="label">
                  {{ item.label }}
                </span>
                <img :src="svgIcon('check')" alt="check" class="check-img" />
              </div>
            </div>
            <div v-else-if="dialog.info.type === INPUT_TYPE.Enums.DATE" class="flex items-center justify-center">
              <q-date
                v-if="dialog.info.column_name === COLUMN_NAME.Enums.DOB"
                v-model="userInfoForm2.dob"
                mask="YYYY-MM-DD"
                minimal
                color="primary"
              />
              <q-date
                v-if="dialog.info.column_name === COLUMN_NAME.Enums.SELF_EXCLUSION_AT"
                minimal
                color="primary"
                v-model="userInfoForm2.self_exclusion_at"
                :options="dateOptions"
              />
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </HeaderTitleBack>
  <q-form v-else class="profile-container pc" @submit="setUserInfo2">
    <q-btn class="profile-header hide-hover" flat :to="{ name: 'memberProfile' }">
      <div class="w-full flex justify-start items-center">
        <q-icon name="arrow_back" class=""></q-icon>
        {{ $t("member.profile.personalInformation") }}
      </div>
    </q-btn>
    <!-- <div>{{ needCountryCodePhone }}</div> -->
    <div class="profile-body">
      <!-- PC自訂欄位 -->
      <template v-for="item in memberColumnList" :key="item.column_name">
        <template
          v-if="
            needCountryCodePhone &&
            (item.column_name === COLUMN_NAME.Enums.COUNTRY || item.column_name === COLUMN_NAME.Enums.PHONE)
          "
        >
          <div v-if="item.column_name === COLUMN_NAME.Enums.PHONE" class="input-container flex flex-nowrap gap-2">
            <q-select
              v-if="columnCountryCode"
              v-model="userInfoForm2[columnCountryCode.column_name]"
              class=""
              :class="{ 'select-placeholder': !userInfoForm2[columnCountryCode.column_name] }"
              :options="columnCountryCode.values"
              emit-value
              map-options
              dense
              :display-value="
                userInfoForm2[columnCountryCode.column_name]
                  ? undefined
                  : $t(memberColumnPlaceholderI18n[columnCountryCode.column_name] || '')
              "
              :disable="!columnCountryCode.edit"
              :rules="columnCountryCode.required ? [Rules.required()] : []"
            >
              <template v-slot:before>
                <q-icon v-if="memberColumnIconName[item.column_name]" :name="memberColumnIconName[item.column_name]" />
                <div v-else class="text-base font-bold">
                  {{ item?.lang?.[nowLang as LANGUAGE_TYPE.Enums] }}
                </div>
              </template>
            </q-select>
            <q-input
              v-model="userInfoForm2[item.column_name]"
              class="flex-1"
              dense
              :placeholder="$t(memberColumnPlaceholderI18n?.[item.column_name] ?? '')"
              :disable="!item.edit"
              :rules="item.required ? [Rules.required()] : []"
            >
            </q-input>
          </div>
        </template>

        <div v-else-if="item.type === INPUT_TYPE.Enums.INPUT" class="input-container">
          <q-input
            v-model="userInfoForm2[item.column_name]"
            dense
            :placeholder="$t(memberColumnPlaceholderI18n?.[item.column_name] ?? '')"
            :disable="!item.edit"
            :rules="item.required ? [Rules.required()] : []"
          >
            <template v-slot:before>
              <q-icon v-if="memberColumnIconName[item.column_name]" :name="memberColumnIconName[item.column_name]" />
              <div v-else class="text-base font-bold">
                {{ item?.lang?.[nowLang as LANGUAGE_TYPE.Enums] }}
              </div>
            </template>
          </q-input>
        </div>
        <div v-else-if="item.type === INPUT_TYPE.Enums.SELECT" class="input-container">
          <q-select
            v-model="userInfoForm2[item.column_name]"
            :class="{ 'select-placeholder': !userInfoForm2[item.column_name] }"
            :options="item.values"
            emit-value
            map-options
            dense
            :display-value="
              userInfoForm2[item.column_name] ? undefined : $t(memberColumnPlaceholderI18n[item.column_name] || '')
            "
            :disable="!item.edit"
            :rules="item.required ? [Rules.required()] : []"
          >
            <template v-slot:before>
              <q-icon v-if="memberColumnIconName[item.column_name]" :name="memberColumnIconName[item.column_name]" />
              <div v-else class="text-base font-bold">
                {{ item?.lang?.[nowLang as LANGUAGE_TYPE.Enums] }}
              </div>
            </template>
          </q-select>
        </div>
        <div v-else-if="item.type === INPUT_TYPE.Enums.DATE" class="input-container">
          <q-input
            v-model="userInfoForm2[item.column_name]"
            dense
            :placeholder="$t(memberColumnPlaceholderI18n[item.column_name] ?? '')"
            readonly
            :rules="item.required ? [Rules.required()] : []"
            :disable="!item.edit"
          >
            <template v-slot:before>
              <q-icon v-if="memberColumnIconName[item.column_name]" :name="memberColumnIconName[item.column_name]" />
              <div v-else class="text-base font-bold">
                {{ item?.lang?.[nowLang as LANGUAGE_TYPE.Enums] }}
              </div>
            </template>
            <q-menu>
              <q-date v-model="userInfoForm2[item.column_name]" mask="YYYY-MM-DD" minimal color="primary" />
            </q-menu>
          </q-input>
        </div>
      </template>

      <!-- self exclusion -->
      <div>
        <div class="flex items-start gap-4">
          <q-toggle v-model="disableAccount" :label="$t('member.profile.disableAccount')" :left-label="true" />
          <q-input
            :placeholder="$t('member.profile.disableAccountDate')"
            v-if="disableAccount"
            dense
            filled
            v-model="userInfoForm2.self_exclusion_at"
            mask="date"
            :rules="['date']"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="userInfoForm2.self_exclusion_at" :options="dateOptions">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('common.btn.confirm')" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="btn-submit-container">
        <q-btn unelevated color="primary" type="submit">{{ $t("common.btn.submit") }}</q-btn>
      </div>
    </div>
  </q-form>
</template>
<script lang="ts" setup>
import dayjs from "dayjs"
import { computed, reactive, ref, watch, onMounted, toRef } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import { useLanguage } from "src/common/composables/useLanguage"
import { INPUT_TYPE, LANGUAGE_TYPE, COLUMN_NAME } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import Avatar from "./components/Avatar.vue"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useRule } from "src/common/hooks/useRule"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "phone")

const $q = useQuasar()
const { t } = useI18n()
const router = useRouter()
const { handleLogout, isLoading } = useAuth()
const {
  userInfoForm2,
  memberColumnList,
  getMemberColumn,
  memberColumnPlaceholderI18n,
  memberColumnIconName,
  getSelectColumnValue,
  resetUserInfoForm2,
  setUserInfo2,
  setSingleUserInfo,
  needCountryCodePhone,
  columnCountryCode,
  isKycEnabled
} = useUserInfo()
const { nowLang } = useLanguage()
const { svgIcon } = useSiteImg()
const { isTelegramMiniApp, closeMiniApp } = useTelegram()
const Rules = useRule()

const selfExclusionColumn = computed<Response.MemberColumn>(() => {
  return {
    column_name: COLUMN_NAME.Enums.SELF_EXCLUSION_AT,
    lang: {
      [nowLang.value]: t("member.profile.disableAccountDate")
    },
    required: false,
    edit: true,
    customize: false,
    type: INPUT_TYPE.Enums.DATE,
    values: []
  }
})

const dialog = reactive<{
  show: boolean
  info: Response.MemberColumn
}>({
  show: false,
  info: {
    column_name: COLUMN_NAME.Enums.FULLNAME,
    lang: {},
    required: false,
    edit: false,
    customize: false,
    type: INPUT_TYPE.Enums.INPUT,
    values: []
  }
})

const disableAccount = ref(false)
const dateOptions = (date: string) => {
  return dayjs(date).isAfter(dayjs())
}

function handleDialogOpen(item: Response.MemberColumn) {
  if (needCountryCodePhone.value) {
    if (!item.edit && columnCountryCode.value && !columnCountryCode.value.edit) return
    dialog.show = true
    dialog.info = item
    return
  }
  if (!item.edit) return
  dialog.show = true
  dialog.info = item
}

function closeDialog() {
  dialog.show = false
  resetUserInfoForm2()
}

async function handleH5Submit() {
  if (needCountryCodePhone.value) {
    const countryCodeValue = userInfoForm2[COLUMN_NAME.Enums.COUNTRY]
    const phoneValue = userInfoForm2[dialog.info.column_name]
    if (columnCountryCode.value?.required && !countryCodeValue) {
      $q.notify({
        type: "negative",
        position: "top",
        message: t("common.validate.mustNotBeEmpty"),
        icon: "warning",
        timeout: 1000
      })
      return
    }

    if (dialog.info.required && !phoneValue) {
      $q.notify({
        type: "negative",
        position: "top",
        message: t("common.validate.mustNotBeEmpty"),
        icon: "warning",
        timeout: 1000
      })
      return
    }

    Promise.all([setSingleUserInfo(dialog.info.column_name), setSingleUserInfo(COLUMN_NAME.Enums.COUNTRY)]).then(
      (result) => {
        if (result.every((e) => e.status === true)) {
          dialog.show = false
        }
      }
    )
    return
  }
  const dialogColumnValue = userInfoForm2[dialog.info.column_name]
  if (dialog.info.required && !dialogColumnValue) {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("common.validate.mustNotBeEmpty"),
      icon: "warning",
      timeout: 1000
    })
    return
  }

  const { status } = await setSingleUserInfo(dialog.info.column_name)

  if (status) {
    dialog.show = false
  }
}

async function logout() {
  await handleLogout()
  closeDialog()
  router.push({ name: "home" })
  if (isTelegramMiniApp.value) closeMiniApp()
}

watch(disableAccount, () => {
  userInfoForm2.self_exclusion_at = null
})

onMounted(async () => {
  await getMemberColumn()
  resetUserInfoForm2()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";
@import "app/template/okbet/assets/css/button.scss";

.profile-container.pc {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 70px 45px;

  .profile-header {
    font-family: OpenSans;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: 40px;
    color: $primary-color;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    text-transform: none;
    .q-icon {
      font-size: 36px;
      margin-right: 12px;
    }
  }
  .profile-body {
    width: 100%;
    margin-top: 10px;
    border: 2px solid $border-pale-gray-color;
    border-radius: 14px;
    padding: 20px 30px;
    font-size: 16px;
    position: relative;
    display: flex;
    gap: 0.9375rem;
    flex-wrap: wrap;
    .input-container {
      width: 48%;
      margin-bottom: 24px;
      font-family: "Segoe UI";
      &.long {
        width: 98%;
      }
      :deep(.q-field__before) {
        padding-right: 14px;
      }
      :deep(.q-field--readonly) {
        .q-field__control {
          &:before {
            border-bottom-style: solid;
          }
        }
      }
      .select-placeholder {
        :deep(.q-field__inner) {
          .q-field__control {
            .q-field__native {
              span {
                @apply text-gray-500;
              }
            }
          }
        }
      }
    }
    .btn-submit-container {
      @apply w-full flex justify-center items-center my-3;
      .q-btn {
        width: 454px;
        height: 50px;
        text-transform: none;
        border-radius: 8px;
        background: $primary-color;
        color: $text-light-color;
        font-family: OpenSans;
        font-size: 16px;
        font-weight: 510;
        line-height: 19px;
        letter-spacing: 0em;
      }
    }
  }
}

.profile-container.h5 {
  width: 100%;
  display: inline-grid;
  row-gap: 1rem;
  background: $background-pale-silver-color;
  @include phone-width {
    row-gap: 0.5rem;
  }
  .avator-container {
    width: 100%;
    height: 12.3125rem;
    position: relative;
    display: inline-grid;
    background-color: $background-light-color;
    @include phone-width {
      height: 6.875rem;
    }
    .title {
      position: absolute;
      margin: 1.25rem 1.875rem;
      font-size: 1.75rem;
      color: $text-steel-blue-color;
      @include phone-width {
        margin: 0.6875rem 1rem;
        font-size: 0.875rem;
      }
    }
  }
  .info-container {
    width: 100%;
    list-style: none;
    background: $background-light-color;
    box-shadow: rgba($box-shadow-soft-blue-gray-color, 0.12) 0px 4rem 10rem,
      rgba($box-shadow-light-color, 0.8) 0rem 2rem 2rem inset;
    box-sizing: border-box;
    .info-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-flow: row;
      padding-left: 1.875rem;
      padding-right: 1.25rem;
      height: 6.25rem;
      flex-flow: wrap;
      flex: 1 1 0%;
      font-size: 1.75rem;
      line-height: 2.5rem;
      color: $text-steel-blue-color;
      box-shadow: rgba($box-shadow-soft-blue-gray-color, 0.12) 0px 4rem 10rem,
        rgba($box-shadow-light-color, 0.8) 0rem 2rem 2rem inset;
      @include phone-width {
        padding-left: 1rem;
        padding-right: 0.6875rem;
        height: 3.4375rem;
        font-size: 1rem;
        line-height: 1.375rem;
      }
      .title {
        text-transform: capitalize;
      }
      .content {
        color: $text-sky-gray-color;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 400px;
        display: flex;
        align-items: center;
        .q-icon {
          margin-left: 1.25rem;
          margin-right: 0.625rem;
          @include phone-width {
            margin-left: 0.6875rem;
            margin-right: 0.375rem;
          }
        }
      }
    }
    .q-separator {
      margin-left: 1.75rem;
      margin-right: 1.75rem;
      height: 1px;
      background-color: $background-pale-gray-color;
      @include phone-width {
        margin-left: 14px;
        margin-right: 14px;
      }
    }
    &.logout {
      padding: 1.25rem;
      .q-btn {
        width: 100%;
        height: 5.625rem;
        font-size: 2rem;
        border-radius: 1rem;
        background: $background-danger-color;
        color: $text-light-color;
        line-height: 1.75;
        letter-spacing: 0.02857em;
        font-weight: 500;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        @include phone-width {
          height: 3.125rem;
          font-size: 1rem;
          border-radius: 0.5rem;
        }
      }
      @include phone-width {
        padding: 0.625rem;
        .q-btn {
          height: 3.125rem;
          font-size: 1rem;
          border-radius: 0.5rem;
        }
      }
    }
  }
}

.edit-dialog {
  .dialog-card {
    width: 100%;
    height: 500px;
    background-color: $background-light-color;

    .dialog-header {
      height: 5.5rem;
      font-size: 2rem;
      padding: 1.25rem 1.75rem;
      border-bottom: 1px solid rgba($border-pale-gray-color, 0.5);
      display: flex;
      align-items: center;
      justify-content: space-between;
      .q-btn {
        font-size: 2rem;
        text-transform: capitalize;
        font-weight: 400;
        padding: 0;
        min-height: auto;
      }
      .btn-cancel {
        color: $text-sky-gray-color;
      }
      .title {
        font-weight: bold;
        max-width: 20rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 700;
      }
    }
    .dialog-body {
      .dialog-form-row {
        width: 100%;
        padding: 20px;
        height: 134px;
        :deep(.q-field__control) {
          color: $text-pale-gray-color !important;
        }
        .dialog-form-title {
          font-weight: 400;
          line-height: 2.87;
          letter-spacing: 0.00938em;
          position: relative;
          display: block;
          transform-origin: left top;
          text-overflow: ellipsis;
          max-width: 100%;
          font-family: "PingFang SC";
          color: $text-charcoal-gray-color-light;
          font-size: 1.75rem;
          padding: 0px;
          white-space: nowrap;
          overflow: hidden;
          transition: color 200ms cubic-bezier(0, 0, 0.2, 1), transform 200ms cubic-bezier(0, 0, 0.2, 1),
            max-width 200ms cubic-bezier(0, 0, 0.2, 1);
        }
        .dialog-form-input {
          font-size: 1.75rem;
          font-weight: 400;
          :deep(.q-icon) {
            font-size: 1.875rem !important;
          }
        }
      }
      .select-container {
        height: 25.75rem;
        overflow-y: scroll;
        .select-row {
          width: 100%;
          height: 96px;
          list-style: none;
          color: $text-charcoal-gray-color-light;
          font-size: 1.75rem;
          padding: 0px 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .check-img {
            display: none;
          }
          &.active {
            color: $text-charcoal-gray-color;
            font-weight: bold;
            background: rgba($background-pale-blue-color, 0.5);
            .check-img {
              display: block;
              width: 2.5rem;
              height: 2.5rem;
            }
          }
        }
      }
    }
    @include phone-width {
      height: 350px;
      .dialog-header {
        height: 2.9375rem;
        font-size: 16px;
        padding: 10px 14px;
        .q-btn {
          font-size: 1rem;
        }
        .title {
          max-width: 160px;
          font-size: 1.125rem;
        }
      }
      .dialog-body {
        .dialog-form-row {
          .dialog-form-title {
            font-size: 0.875rem;
          }
          .dialog-form-input {
            font-size: 0.875rem;
          }
        }
        .select-container {
          height: 12.875rem;
          .select-row {
            height: 3rem;
            font-size: 0.875rem;
            padding: 0px 0.875rem;
            &.active {
              .check-img {
                width: 1.375rem;
                height: 1.375rem;
              }
            }
          }
        }
      }
    }
  }
}
</style>
