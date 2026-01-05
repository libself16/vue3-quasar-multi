<template>
  <q-dialog v-model="dialogShow" persistent class="z-[5990] profile-dialog">
    <div class="profile-body">
      <q-btn icon="close" round flat v-close-popup class="btn-close"></q-btn>
      <div v-if="loading" class="w-full flex items-center justify-center my-8">
        <q-spinner></q-spinner>
      </div>
      <!-- PC自訂欄位 -->

      <template v-else v-for="item in memberColumnList" :key="item.column_name">
        <template
          v-if="
            needCountryCodePhone &&
            (item.column_name === COLUMN_NAME.Enums.COUNTRY || item.column_name === COLUMN_NAME.Enums.PHONE)
          "
        >
          <div
            v-if="item.column_name === COLUMN_NAME.Enums.PHONE"
            class="input-container flex flex-nowrap gap-8 !w-full"
          >
            <q-select
              v-if="columnCountryCode"
              v-model="userInfoForm2[columnCountryCode.column_name]"
              class="w-1/2"
              :class="{ 'select-placeholder': !userInfoForm2[columnCountryCode.column_name] }"
              :options="columnCountryCode.values"
              emit-value
              map-options
              dense
              :display-value="
                userInfoForm2[columnCountryCode.column_name]
                  ? undefined
                  : columnCountryCode.lang[nowLang as LANGUAGE_TYPE.Enums] || ''
              "
              :disable="!columnCountryCode.edit"
              :rules="columnCountryCode.required ? [Rules.required()] : [Rules.noRule]"
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
              class="w-1/2"
              dense
              :placeholder="item.lang[nowLang as LANGUAGE_TYPE.Enums] || ''"
              :disable="!item.edit"
              :rules="item.required ? [Rules.required()] : [Rules.noRule]"
            >
            </q-input>
          </div>
        </template>

        <div v-else-if="item.type === INPUT_TYPE.Enums.INPUT" class="input-container">
          <q-input
            v-model="userInfoForm2[item.column_name]"
            dense
            :placeholder="item.lang[nowLang as LANGUAGE_TYPE.Enums] || ''"
            :disable="!item.edit"
            :rules="item.required ? [Rules.required()] : [Rules.noRule]"
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
              userInfoForm2[item.column_name] ? undefined : item.lang[nowLang as LANGUAGE_TYPE.Enums] || ''
            "
            :disable="!item.edit"
            :rules="item.required ? [Rules.required()] : [Rules.noRule]"
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
            :placeholder="item.lang[nowLang as LANGUAGE_TYPE.Enums] || ''"
            readonly
            :rules="item.required ? [Rules.required()] : [Rules.noRule]"
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

      <div class="btn-submit-container">
        <q-btn unelevated color="primary" @click="onSubmit" type="submit">{{ $t("common.btn.submit") }}</q-btn>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import { computed, reactive, ref, watch, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useSiteImg } from "app/template/bmm_set_obtd/hooks/useSiteImg"
import { useLanguage } from "src/common/composables/useLanguage"
import { INPUT_TYPE, LANGUAGE_TYPE, COLUMN_NAME } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { injectStrict } from "src/common/utils/injectTyped"
import { useRule } from "src/common/hooks/useRule"
import { EventBusKey } from "src/symbols"
import { setUserInfo } from "src/api/userInfo"

const loading = ref(false)
const dialogShow = ref(false)
const $q = useQuasar()
const { t } = useI18n()
const router = useRouter()
const eventbus = injectStrict(EventBusKey)
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
  columnCountryCode
} = useUserInfo()
const { nowLang } = useLanguage()
const { svgIcon } = useSiteImg()
const { isTelegramMiniApp, closeMiniApp } = useTelegram()
const Rules = useRule()

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

function closeDialog() {
  dialog.show = false
  resetUserInfoForm2()
}

const onSubmit = async () => {
  await setUserInfo2()
  dialogShow.value = false
}

onMounted(async () => {
  loading.value = true
  await getMemberColumn()
  loading.value = false

  eventbus.on("openUpdateProfile", (show: boolean) => {
    dialogShow.value = show
    resetUserInfoForm2()
  })
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/button.scss";

.profile-dialog {
  .profile-body {
    background: $background-light-color;
    width: 100%;
    margin-top: 10px;
    border: 2px solid $border-pale-gray-color;
    border-radius: 14px;
    padding: 60px 60px;
    font-size: 16px;
    position: relative;
    display: flex;
    gap: 0.9375rem;
    flex-wrap: wrap;
    @include phone-width {
      padding: 50px 30px;
    }

    .btn-close {
      @apply absolute right-0 top-0 m-1;
    }

    .input-container {
      width: 48%;
      margin-bottom: 24px;
      font-family: "Segoe UI";

      @include phone-width {
        width: 100%;
      }

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
      @apply w-full flex justify-center items-center my-3 gap-4;
      .q-btn {
        width: 100%;
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
