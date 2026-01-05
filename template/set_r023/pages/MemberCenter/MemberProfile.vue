<template>
  <HeaderTitleBack v-if="isLargeTablet" variant="setR022" :title-i18n="'menu.profile'">
    <div class="h5-profile-area">
      <div class="profile-avatar-area">
        <div class="avatar-text">{{ $t("member.profile.profilePhoto") }}</div>
        <div class="avatar-area">
          <Avatar />
        </div>
      </div>

      <div class="user-data-area mb-2">
        <div class="invite-code">
          <div>{{ $t("member.register.invite_code") }}</div>
          <div class="flex items-center justify-center">
            <span class="mr-1">
              {{ accountInfoForm.invite_code }}
            </span>
            <q-icon
              name="fa-solid fa-copy"
              size="0.75rem"
              @click="copyMessage(accountInfoForm.invite_code)"
              class="cursor-pointer copy-icon"
            />
          </div>
        </div>
        <div class="nickname">
          <div>{{ $t("member.profile.nickname") }}</div>
          <div>{{ accountInfoForm.nickname }}</div>
        </div>
        <div class="kyc-verify" @click="handlerOpenKycDialog()">
          <div>{{ $t("member.kyc.kyc_verify") }}</div>
          <div class="kyc-text flex items-center justify-center">
            <span class="mr-1">
              {{ accountInfo.approval_status ? $t("member.kyc.status_success") : $t("member.kyc.status_unverified") }}
            </span>
            <q-icon name="fa-solid fa-chevron-right" class="right-arrow-icon" />
          </div>
        </div>
      </div>

      <div class="cms-area">
        <div
          v-for="item in memberColumnList"
          :key="item.column_name"
          class="cms-item"
          @click="handlerShowEditDialog(item)"
        >
          <div>{{ item.lang?.[nowLang as LANGUAGE_TYPE.Enums] }}</div>
          <div class="flex items-center justify-center">
            <span class="mr-1">
              <template v-if="item.column_name === COLUMN_NAME.Enums.GENDER">{{ genderLabel }}</template>
              <template v-else>{{ accountInfoForm[item.column_name] }}</template>
            </span>
            <q-icon v-if="item.edit" name="fa-solid fa-chevron-right" class="right-arrow-icon" />
          </div>
        </div>

        <!-- 登入密碼 -->
        <div class="cms-item" @click="showPasswordDialog = true">
          <div>{{ $t("member.profile.loginPassword") }}</div>
          <div class="flex items-center justify-center">
            <span class="mr-1"> ******** </span>
            <q-icon name="fa-solid fa-chevron-right" class="right-arrow-icon" />
          </div>
        </div>

        <!-- 出款密碼 -->
        <div v-if="needWithdrawalPassword" class="cms-item" @click="showWithdrawelPasswordDialog = true">
          <div>{{ $t("menu.withdrawalPassword") }}</div>
          <div class="flex items-center justify-center">
            <span class="mr-1"> ******** </span>
            <q-icon name="fa-solid fa-chevron-right" class="right-arrow-icon" />
          </div>
        </div>
      </div>
    </div>
  </HeaderTitleBack>

  <div class="pc-profile-area">
    <div class="top-area">{{ $t("menu.profile") }}</div>

    <div class="detail-area">
      <!-- user name -->
      <div class="user-detail">
        <div class="user-left">
          <Avatar />

          <div class="user-left-data">
            <div class="user-nickname-area">
              <div class="title">{{ `${$t("member.profile.nickname")}:` }}</div>
              <div class="nickname">{{ accountInfoForm.nickname }}</div>
            </div>

            <div class="invite-code-area">
              <div class="invite-code">{{ accountInfoForm.invite_code }}</div>
              <q-icon
                name="fa-solid fa-copy"
                size="0.75rem"
                @click="copyMessage(accountInfoForm.invite_code)"
                class="cursor-pointer copy-icon"
              />
            </div>
          </div>
        </div>

        <div class="user-right">
          <div class="user-account">{{ `id: ${accountInfo.account}` }}</div>
          <q-icon
            name="fa-solid fa-copy"
            size="0.75rem"
            @click="copyMessage(accountInfo.account)"
            class="cursor-pointer"
          />
        </div>
      </div>

      <!-- KYC -->
      <div class="detail-data" @click="handlerOpenKycDialog()">
        <div class="data-left">
          <div class="detail-title">
            {{ $t("member.kyc.kyc_verify") }}
          </div>
        </div>

        <div class="kyc-text">
          {{ accountInfo.approval_status ? $t("member.kyc.status_success") : $t("member.kyc.status_unverified") }}
        </div>
      </div>

      <!-- CMS -->
      <template v-for="item in memberColumnList" :key="item.column_name">
        <div class="detail-data" :class="{ '!cursor-default': !item.edit }" @click="handlerShowEditDialog(item)">
          <div class="data-left">
            <div class="detail-title">
              {{ item.lang?.[nowLang as LANGUAGE_TYPE.Enums] }}
            </div>
            <div class="user-data">
              <span v-if="item.column_name === COLUMN_NAME.Enums.GENDER">{{ genderLabel }}</span>
              <span v-else>{{ accountInfoForm[item.column_name] }}</span>
            </div>
          </div>

          <div v-if="item.edit" class="data-right">
            <span class="edit-text">{{ $t("common.btn.edit") }}</span>
            <q-icon name="fa-solid fa-chevron-right" class="right-arrow-icon" />
          </div>
        </div>
      </template>

      <!-- 登入密碼 -->
      <div class="detail-data" @click="showPasswordDialog = true">
        <div class="data-left">
          <div class="detail-title">
            {{ $t("member.profile.loginPassword") }}
          </div>
          <div class="user-data">********</div>
        </div>

        <div class="data-right">
          <span class="edit-text">{{ $t("common.btn.edit") }}</span>
          <q-icon name="fa-solid fa-chevron-right" class="right-arrow-icon" />
        </div>
      </div>

      <!-- 出款密碼 -->
      <div v-if="needWithdrawalPassword" class="detail-data" @click="showWithdrawelPasswordDialog = true">
        <div class="data-left">
          <div class="detail-title">
            {{ $t("menu.withdrawalPassword") }}
          </div>
          <div class="user-data">********</div>
        </div>

        <div class="data-right">
          <span class="edit-text">{{ $t("menu.withdrawalPassword") }}</span>
          <q-icon name="fa-solid fa-chevron-right" class="right-arrow-icon" />
        </div>
      </div>
    </div>

    <ProfileEditDialog
      v-if="showEditDialog"
      v-model="showEditDialog"
      :data="selectItem"
      :refresh="resetAccountInfoForm()"
    />
    <ChangePasswordDialog v-if="showPasswordDialog" v-model="showPasswordDialog" />
    <ChangeWithdrawalPasswordDialog v-if="showWithdrawelPasswordDialog" v-model="showWithdrawelPasswordDialog" />
  </div>
</template>
<script lang="ts" setup>
import { EventBusKey } from "src/symbols"
import Avatar from "./components/Avatar.vue"
import { ref, computed, onMounted } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { useCommon } from "src/common/hooks/useCommon"
import { injectStrict } from "src/common/utils/injectTyped"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLanguage } from "src/common/composables/useLanguage"
import ProfileEditDialog from "./components/ProfileEditDialog.vue"
import ChangePasswordDialog from "./components/ChangePasswordDialog.vue"
import ChangeWithdrawalPasswordDialog from "./components/ChangeWithdrawalPasswordDialog.vue"
import { LANGUAGE_TYPE, COLUMN_NAME } from "src/common/utils/constants"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useBank } from "src/common/composables/useBank"

const { needWithdrawalPassword } = useBank()
const { nowLang } = useLanguage()
const { copyMessage } = useCommon()
const { isLargeTablet } = useMediaQuery()
const eventbus = injectStrict(EventBusKey)
const { accountInfo, accountInfoForm, memberColumnList, getMemberColumn, resetAccountInfoForm } = useUserInfo()

const selectItem = ref()
const showEditDialog = ref(false)
const showPasswordDialog = ref(false)
const showWithdrawelPasswordDialog = ref(false)

const genderLabel = computed(() => {
  const genderOptions = memberColumnList.value.find((item) => item.column_name === COLUMN_NAME.Enums.GENDER)?.values
  if (!genderOptions?.length) return ""

  return genderOptions.find((item) => accountInfoForm[COLUMN_NAME.Enums.GENDER] === item.value)?.label || ""
})

const handlerShowEditDialog = (item: any) => {
  if (!item.edit) return

  selectItem.value = item
  showEditDialog.value = true
}

const handlerOpenKycDialog = () => {
  eventbus.emit("openKycDialog", true)
}

onMounted(async () => {
  await getMemberColumn()
})
</script>
<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.copy-icon {
  color: var(--primary-01);
}

.right-arrow-icon {
  color: var(--primary-08);
}

.pc-profile-area {
  width: 100%;
  max-width: 87.5rem;
  padding: 1.525rem 0 10%;
  margin: 0 auto;

  .top-area {
    background: var(--neutral-01);
    border-radius: 0.5rem;
    padding: 1.25rem 1.5rem;
    font-size: 1.5rem;
    color: var(--secondary-01);
    margin-bottom: 1.5rem;
  }

  .detail-area {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.625rem;

    .detail-data {
      min-height: 6.75rem;
      border-radius: 0.75rem;
      background: var(--neutral-01);
      border: 1px solid var(--neutral-03);
      padding: 1.545625rem 2.045625rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      .data-left {
        .detail-title {
          color: var(--secondary-01);
          font-size: 1.25rem;
        }

        .user-data {
          margin-top: 0.25rem;
          color: var(--primary-02);
          font-size: 1rem;
        }
      }

      .data-right {
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        justify-content: center;

        .edit-text {
          color: var(--primary-01);
          margin-right: 0.4375rem;
        }
      }

      .kyc-text {
        background: var(--primary-08);
        color: var(--neutral-01);
        border-radius: 0.625rem;
        padding: 0.1675rem 0.5rem;
        font-size: 0.875rem;
        cursor: pointer;
      }
    }

    .user-detail {
      border-radius: 0.75rem;
      background: var(--neutral-01);
      border: 1px solid var(--neutral-03);
      padding: 1.545625rem 2.045625rem;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      .user-left {
        display: flex;
        align-items: center;
        justify-content: center;

        .user-left-data {
          color: var(--secondary-01);
          margin-left: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          font-size: 1.125rem;

          .user-nickname-area {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.134375rem;

            .title {
              margin-right: 0.604375rem;
            }

            .nickname {
              color: var(--primary-01);
            }
          }

          .invite-code-area {
            display: flex;
            align-items: center;
            justify-content: center;

            .invite-code {
              color: var(--primary-02);
              margin-right: 0.25rem;
            }
          }
        }
      }

      .user-right {
        color: var(--primary-02);
        display: flex;
        align-items: center;
        justify-content: center;

        .user-account {
          margin-right: 0.125rem;
        }

        :deep(.q-icon) {
          color: var(--primary-01);
        }
      }
    }
  }
}

.h5-profile-area {
  width: 100%;
  height: 100%;
  background: var(--bg-main-bg);
  padding-top: 0.5625rem;

  .profile-avatar-area {
    width: 100%;
    height: 6.375rem;
    margin-bottom: 0.5625rem;
    background: var(--neutral-02);
    padding: 1.11375rem 1.25rem;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;

    .avatar-text {
      color: var(--secondary-01);
      font-size: 0.875rem;
    }

    .avatar-area {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, 25%);
    }
  }

  .user-data-area,
  .cms-area {
    width: 100%;
    background: var(--neutral-02);
    color: var(--secondary-01);

    .invite-code,
    .nickname,
    .kyc-verify,
    .cms-item {
      padding: 0.5rem 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 0.045625rem solid var(--primary-07);
      font-size: 0.875rem;
      line-height: 2.125rem;
      color: var(--primary-02);

      &:last-child {
        border: none;
      }

      .kyc-text {
        color: var(--primary-08);
      }
    }
  }
}
</style>
