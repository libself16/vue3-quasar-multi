<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" titleI18n="member.profile.myDetails" variant="purple-dark">
    <div class="profile-container h5">
      <div class="avator-container">
        <span class="title">Profile Photo</span>
        <div class="flex items-center justify-center">
          <Avatar />
        </div>
      </div>
      <div class="info-container">
        <!-- username -->
        <div class="info-row">
          <p class="title">{{ $t("member.register.username") }}</p>
          <p class="content">{{ userInfo.username }}</p>
        </div>
        <q-separator />
        <!-- real_name -->
        <div class="info-row" @click="handleDialogOpen(PROFILE_DETAIL_EDIT_TYPE.Enums.RealName)">
          <p class="title">{{ $t("member.register.fullName") }}</p>
          <p class="content">
            {{ userInfo.real_name }}
            <q-icon name="arrow_forward_ios"></q-icon>
          </p>
        </div>
        <q-separator />
        <!-- nickname -->
        <div class="info-row" @click="handleDialogOpen(PROFILE_DETAIL_EDIT_TYPE.Enums.Nickname)">
          <p class="title">{{ $t("member.profile.nickname") }}</p>
          <p class="content">{{ userInfo.nickname }} <q-icon name="arrow_forward_ios"></q-icon></p>
        </div>
      </div>
      <div class="info-container">
        <!-- email -->
        <div class="info-row">
          <p class="title">{{ $t("member.register.email") }}</p>
          <p class="content">{{ userInfo.email }}</p>
        </div>
        <q-separator />
        <!-- phone -->
        <div class="info-row">
          <p class="title">{{ $t("member.register.phone") }}</p>
          <p class="content">{{ userInfo.phone }}</p>
        </div>
        <q-separator />
      </div>
      <div class="info-container">
        <!-- gender -->
        <div class="info-row" @click="handleDialogOpen(PROFILE_DETAIL_EDIT_TYPE.Enums.Gender)">
          <p class="title">{{ $t("member.register.gender") }}</p>
          <p class="content">
            {{ $t(GENDER.I18nKeys[userInfo.gender]) }}
            <q-icon name="arrow_forward_ios"></q-icon>
          </p>
        </div>
        <q-separator />
        <!-- birthdate -->
        <div class="info-row" @click="handleDialogOpen(PROFILE_DETAIL_EDIT_TYPE.Enums.Birth)">
          <p class="title">{{ $t("member.register.birthdate") }}</p>
          <p class="content">{{ userInfo.date_of_birth }} <q-icon name="arrow_forward_ios"></q-icon></p>
        </div>
      </div>
      <div class="info-container">
        <!-- contact1 -->
        <div class="info-row" @click="handleDialogOpen(PROFILE_DETAIL_EDIT_TYPE.Enums.Contact1)">
          <p class="title">{{ $t("member.register.contact1") }}</p>
          <p class="content">
            {{ userInfo.contact.contact1 }}
            <q-icon name="arrow_forward_ios"></q-icon>
          </p>
        </div>
        <q-separator />
        <!-- contact2 -->
        <div class="info-row" @click="handleDialogOpen(PROFILE_DETAIL_EDIT_TYPE.Enums.Contact2)">
          <p class="title">{{ $t("member.register.contact2") }}</p>
          <p class="content">{{ userInfo.contact.contact2 }} <q-icon name="arrow_forward_ios"></q-icon></p>
        </div>
      </div>
      <div class="info-container">
        <!-- self exclusion -->
        <div class="info-row" @click="handleDialogOpen(PROFILE_DETAIL_EDIT_TYPE.Enums.SelfExclusion)">
          <p class="title">{{ $t("member.profile.disableAccount") }}</p>
          <p class="content">
            <q-icon name="arrow_forward_ios"></q-icon>
          </p>
        </div>
      </div>
      <div class="info-container" v-if="isMayaLogin == false">
        <!-- kyc -->
        <div class="info-row" @click="$router.push({ name: 'MemberKyc' })">
          <p class="title">{{ $t("menu.getVerify") }}</p>
          <p class="content">
            <q-icon name="arrow_forward_ios"></q-icon>
          </p>
        </div>
      </div>
      <div class="info-container logout" v-if="isMayaLogin == false">
        <!-- contact1 -->
        <q-btn :loading="isLoading" @click="logout">{{ $t("common.btn.logout") }}</q-btn>
      </div>
    </div>
    <q-dialog v-model="dialog.show" position="bottom" persistent full-width class="edit-dialog" :maximized="true">
      <q-card class="dialog-card">
        <q-card-siction class="dialog-header">
          <q-btn flat class="btn-cancel" @click="closeDialog"> {{ $t("common.btn.cancel") }}</q-btn>
          <span class="title">{{ $t(PROFILE_DETAIL_EDIT_TYPE.I18nKeys[dialog.type]) }}</span>
          <q-btn flat class="btn-confirm" color="primary" type="submit" @click="submit">
            {{ $t("common.btn.confirm") }}</q-btn
          >
        </q-card-siction>
        <q-card-siction class="dialog-body">
          <div v-if="dialog.type === PROFILE_DETAIL_EDIT_TYPE.Enums.RealName" class="dialog-form-row">
            <q-input
              v-model="userInfoForm.real_name"
              :placeholder="$t('placeholder.pleaseEnterFullname')"
              name="realName"
              dense
              class="dialog-form-input"
            >
            </q-input>
          </div>
          <div v-if="dialog.type === PROFILE_DETAIL_EDIT_TYPE.Enums.Nickname" class="dialog-form-row">
            <q-input
              v-model="userInfoForm.nickname"
              :placeholder="$t('placeholder.pleaseEnterNickName')"
              name="nickName"
              dense
              class="dialog-form-input"
            >
            </q-input>
          </div>
          <div v-if="dialog.type === PROFILE_DETAIL_EDIT_TYPE.Enums.Contact1" class="dialog-form-row">
            <q-input
              v-model="userInfoForm.contact.contact1"
              :placeholder="$t('placeholder.pleaseEnterContactNo')"
              name="contact1"
              dense
              class="dialog-form-input"
            >
            </q-input>
          </div>
          <div v-if="dialog.type === PROFILE_DETAIL_EDIT_TYPE.Enums.Contact2" class="dialog-form-row">
            <q-input
              v-model="userInfoForm.contact.contact2"
              :placeholder="$t('placeholder.pleaseEnterContactNo')"
              name="contact2"
              dense
              class="dialog-form-input"
            >
            </q-input>
          </div>
          <div v-if="dialog.type === PROFILE_DETAIL_EDIT_TYPE.Enums.Gender" class="select-container">
            <div
              v-for="item in genderDropdown"
              :key="item.value"
              class="select-row"
              :class="{ active: userInfoForm.gender === item.value }"
              @click="setGender(item.value as GENDER.Enums)"
            >
              <span class="label">
                {{ item.label }}
              </span>
              <img :src="svgIcon('check')" alt="check" class="check-img" />
            </div>
          </div>
          <div v-if="dialog.type === PROFILE_DETAIL_EDIT_TYPE.Enums.Birth" class="flex items-center justify-center">
            <q-date
              v-model="userInfoForm.date_of_birth"
              mask="YYYY-MM-DD"
              minimal
              color="primary"
              :options="qDateAdultOptions"
            />
          </div>
          <div
            v-if="dialog.type === PROFILE_DETAIL_EDIT_TYPE.Enums.SelfExclusion"
            class="flex items-center justify-center"
          >
            <q-date minimal color="primary" v-model="userInfoForm.self_exclusion_at" :options="dateOptions" />
          </div>
        </q-card-siction>
      </q-card>
    </q-dialog>
  </HeaderTitleBack>
  <q-form v-else class="profile-container pc" @submit="submit">
    <q-btn class="profile-header hide-hover" flat :to="{ name: 'memberProfile' }">
      <q-icon name="arrow_back" class=""></q-icon>
      {{ $t("member.profile.personalInformation") }}
    </q-btn>
    <div class="profile-body">
      <!-- username -->
      <div class="input-container">
        <q-input v-model="userInfoForm.username" dense :placeholder="$t('member.register.username')" disable>
          <template v-slot:before> <q-icon name="fa-regular fa-circle-user" /> </template>
        </q-input>
      </div>
      <!-- real name -->
      <div class="input-container">
        <q-input v-model="userInfoForm.real_name" dense :placeholder="$t('member.register.fullName')">
          <template v-slot:before> <q-icon name="fa-regular fa-address-card" /> </template>
        </q-input>
      </div>
      <!-- email -->
      <div class="input-container long">
        <q-input v-model="userInfoForm.email" dense :placeholder="$t('member.profile.email')" disable>
          <template v-slot:before> <q-icon name="mail_outline" /> </template>
        </q-input>
      </div>
      <!-- phone -->
      <div class="input-container">
        <q-input v-model="userInfoForm.phone" dense :placeholder="$t('member.register.phone')" disable>
          <template v-slot:before> <q-icon name="phone_android" /> </template>
        </q-input>
      </div>
      <!--gender -->
      <div class="input-container">
        <q-select v-model="userInfoForm.gender" :options="genderDropdown" emit-value map-options dense>
          <template v-slot:before> <q-icon name="fa-solid fa-venus-mars" /> </template>
        </q-select>
      </div>
      <!-- birth -->
      <div class="input-container">
        <q-input v-model="userInfoForm.date_of_birth" dense :placeholder="$t('member.register.birthdate')" readonly>
          <template v-slot:before> <q-icon name="cake" /> </template>
          <q-menu>
            <q-date v-model="userInfoForm.date_of_birth" mask="YYYY-MM-DD" minimal :options="qDateAdultOptions" />
          </q-menu>
        </q-input>
      </div>
      <!-- nickname -->
      <div class="input-container">
        <q-input v-model="userInfoForm.nickname" dense :placeholder="$t('member.register.nickName')">
          <template v-slot:before> <q-icon name="fa-regular fa-address-card" /> </template>
        </q-input>
      </div>
      <!-- contact1 -->
      <div class="input-container">
        <q-input v-model="userInfoForm.contact.contact1" dense :placeholder="$t('member.register.contact1')">
          <template v-slot:before> <q-icon name="fa-brands fa-skype" /> </template>
        </q-input>
      </div>
      <!-- contact2 -->
      <div class="input-container">
        <q-input v-model="userInfoForm.contact.contact2" dense :placeholder="$t('member.register.contact2')">
          <template v-slot:before> <q-icon name="fa-brands fa-line" /> </template>
        </q-input>
      </div>
      <!-- self exclusion -->
      <div>
        <div class="flex items-start gap-4">
          <q-toggle v-model="disableAccount" :label="$t('member.profile.disableAccount')" :left-label="true" />
          <q-input
            :placeholder="$t('member.profile.disableAccountDate')"
            v-if="disableAccount"
            dense
            filled
            v-model="userInfoForm.self_exclusion_at"
            mask="date"
            :rules="['date']"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="userInfoForm.self_exclusion_at" :options="dateOptions">
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
        <q-btn unelevated type="submit">{{ $t("common.btn.submit") }}</q-btn>
      </div>
    </div>
  </q-form>
</template>
<script lang="ts" setup>
import dayjs from "dayjs"
import { computed, reactive, ref, watchEffect, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useSiteImg } from "app/template/okbet_purple/hooks/useSiteImg"
import { GENDER, PROFILE_DETAIL_EDIT_TYPE } from "src/common/utils/constants"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import Avatar from "./components/Avatar.vue"

const $q = useQuasar()
const { t } = useI18n()
const router = useRouter()
const { handleLogout, isLoading, isMayaLogin } = useAuth()
const { genEnumToDropdown } = useCommon()
const { userInfo, userInfoForm, resetUserInfoForm, setUserInfo, qDateAdultOptions } = useUserInfo()
const { svgIcon } = useSiteImg()

const dialog = reactive({
  show: false,
  type: PROFILE_DETAIL_EDIT_TYPE.Enums.RealName
})

const disableAccount = ref(false)
const dateOptions = (date: string) => {
  return dayjs(date).isAfter(dayjs())
}

const genderDropdown = computed(() =>
  genEnumToDropdown(GENDER.Enums, GENDER.I18nKeys).map((e) => {
    e.label = t(e.label)
    return e
  })
)

function handleDialogOpen(type: PROFILE_DETAIL_EDIT_TYPE.Enums) {
  dialog.show = true
  dialog.type = type
}

function setGender(gender: GENDER.Enums) {
  userInfoForm.gender = gender
}

function closeDialog() {
  dialog.show = false
  resetUserInfoForm()
}

const submit = async (isH5: boolean) => {
  // 新增前端阻擋判斷
  if (userInfoForm.real_name.length == 0) {
    const msg = `<b>${t("member.profile.fullName")}</b> ${t("common.tip.forgotPasswordTip1")}.`
    $q.notify({
      type: "negative",
      message: msg.toUpperCase(),
      position: "top",
      html: true
    })
    return
  }

  await setUserInfo()

  if (isH5) dialog.show = false
}

async function logout() {
  await handleLogout()
  closeDialog()
  router.push({ name: "home" })
}

watchEffect(() => {
  if (userInfo.value.contact) resetUserInfoForm()
})

watch(disableAccount, () => {
  userInfoForm.self_exclusion_at = null
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/button.scss";

.profile-container.pc {
  @apply flex w-full h-full;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  border-radius: 20px;
  padding: 70px 45px;
  .profile-header {
    @apply flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    color: $bg-secondary;
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
    border: 2px solid $border-dark;
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
      &.long {
        width: 98%;
      }
      :deep(.q-field__before) {
        color: $text-light-secondary !important;
        padding-right: 14px;
      }
      :deep(.q-field--readonly) {
        .q-field__control {
          &:before {
            border-bottom-style: solid;
          }
        }
      }
      :deep(.q-field__native) {
        color: $text-light-secondary !important;
      }
    }
    .btn-submit-container {
      @apply w-full flex justify-center items-center my-3;
      .q-btn {
        width: 454px;
        height: 50px;
        text-transform: none;
        border-radius: 8px;
        background: $bg-secondary;
        color: $text-light-secondary;
        font-size: 16px;
        font-weight: 510;
        line-height: 19px;
        letter-spacing: 0em;
      }
    }
  }
}

.profile-container.h5 {
  @apply w-full;
  display: inline-grid;
  row-gap: 1rem;
  @include phone-width {
    row-gap: 0.5rem;
  }
  .avator-container {
    width: 100%;
    height: 12.3125rem;
    position: relative;
    display: inline-grid;
    background: $bg-dark;
    @include phone-width {
      height: 6.875rem;
    }
    .title {
      position: absolute;
      margin: 1.25rem 1.875rem;
      font-size: 1.75rem;
      color: $text-light-secondary;
      @include phone-width {
        margin: 0.6875rem 1rem;
        font-size: 0.875rem;
      }
    }
  }
  .info-container {
    width: 100%;
    list-style: none;
    background: $bg-dark;
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
      color: $text-light-secondary;
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
        color: $text-light-secondary;
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
        background: $bg-secondary;
        color: $text-light-secondary;
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
    background-color: rgb(255, 255, 255);

    .dialog-header {
      height: 5.5rem;
      font-size: 2rem;
      padding: 1.25rem 1.75rem;
      border-bottom: 1px solid rgba(227, 232, 238, 0.5);
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
        color: rgb(167, 178, 196);
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
          color: #e5e7eb !important;
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
          color: rgb(83, 93, 118);
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
          color: rgb(83, 93, 118);
          font-size: 1.75rem;
          padding: 0px 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .check-img {
            display: none;
          }
          &.active {
            color: rgb(65, 70, 85);
            font-weight: bold;
            background: rgba(232, 239, 253, 0.5);
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
