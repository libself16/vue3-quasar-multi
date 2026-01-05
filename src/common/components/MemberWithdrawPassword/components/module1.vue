<template>
  <div
    id="member-withdraw-password-content"
    class="w-full h-full rounded-xl p-5 phone:p-0 flex flex-col gap-[.625rem] bg-[var(--bg-11)] phone:bg-transparent"
  >
    <!-- 標題 -->
    <div id="member-withdraw-password-header" class="flex items-center justify-between gap-[.625rem]">
      <div
        id="member-withdraw-password-header-title"
        class="font-[NotoSans] font-bold text-[1.25rem] leading-[1.6875rem] text-[var(--text-01)] flex items-center gap-1 flex-1"
      >
        <BackBtn />
        <span> {{ $t("member.changePassword.setWithdrawPassword") }}</span>
      </div>
    </div>
    <q-form
      ref="formRef"
      id="member-withdraw-password-main"
      class="w-[35rem] phone:w-full flex-1 flex flex-col justify-between gap-5 mx-auto"
      @submit="handleSubmit"
    >
      <div id="member-withdraw-password-body">
        <div v-if="accountInfo.has_withdrawal_password" id="member-withdraw-password-form-content1">
          <div class="member-withdraw-password-form-item">
            <div class="member-withdraw-password-form-title">
              {{ $t("member.forgotPassword.currentPassword") }}
            </div>
            <q-input
              v-model="withdrawalPasswordForm.old_password"
              class="member-withdraw-password-form-input"
              :placeholder="$t('placeholder.pleaseEnter2')"
              :type="showPassword.oldPassword ? 'text' : 'password'"
              rounded
              outlined
              dense
              borderless
              no-error-icon
              hide-bottom-space
              :rules="[(val) => Rules.password(val, $t('placeholder.characters8-20'))]"
            >
              <template #append>
                <q-icon
                  :name="showPassword.oldPassword ? 'visibility' : 'visibility_off'"
                  @click="showPassword.oldPassword = !showPassword.oldPassword"
                />
              </template>
            </q-input>
          </div>
        </div>
        <div
          id="member-withdraw-password-form-content2"
          class="mt-[.625rem] grid grid-cols-2 gap-[.625rem] phone:grid-cols-1"
          :class="{ '!grid-cols-1': !accountInfo.has_withdrawal_password }"
        >
          <div class="member-withdraw-password-form-item">
            <div class="member-withdraw-password-form-title">
              {{ $t("member.forgotPassword.newPassword") }}
            </div>
            <q-input
              v-model="withdrawalPasswordForm.new_password"
              class="member-withdraw-password-form-input"
              :placeholder="$t('placeholder.pleaseEnter2')"
              :type="showPassword.newPassword ? 'text' : 'password'"
              rounded
              outlined
              dense
              borderless
              no-error-icon
              hide-bottom-space
              :rules="[
                (val) => Rules.password(val, $t('placeholder.characters8-20')),
                (val) => Rules.newPassword(withdrawalPasswordForm.old_password, val)
              ]"
            >
              <template #append>
                <q-icon
                  :name="showPassword.newPassword ? 'visibility' : 'visibility_off'"
                  @click="showPassword.newPassword = !showPassword.newPassword"
                />
              </template>
            </q-input>
          </div>
          <div class="member-withdraw-password-form-item">
            <div class="member-withdraw-password-form-title">
              {{ $t("member.forgotPassword.confirmPassword") }}
            </div>
            <q-input
              v-model="withdrawalPasswordForm.confirm_password"
              class="member-withdraw-password-form-input"
              :placeholder="$t('placeholder.pleaseEnter2')"
              :type="showPassword.confirmPassword ? 'text' : 'password'"
              rounded
              outlined
              dense
              borderless
              no-error-icon
              hide-bottom-space
              :rules="[(val) => Rules.confirmPassword(withdrawalPasswordForm.new_password, val)]"
            >
              <template #append>
                <q-icon
                  :name="showPassword.confirmPassword ? 'visibility' : 'visibility_off'"
                  @click="showPassword.confirmPassword = !showPassword.confirmPassword"
                />
              </template>
            </q-input>
          </div>
        </div>
      </div>
      <div id="member-withdraw-password-footer" class="flex items-center justify-center">
        <button
          id="member-withdraw-password-submit-btn"
          :class="`
          w-full py-[.625rem] rounded
          font-[NotoSans] font-bold text-[.75rem] leading-[1rem] text-[var(--btn-text-01)]
          bg-gradient-to-r from-[var(--btn-bg-01)] to-[var(--btn-bg-02)]
          `"
          type="submit"
        >
          {{ $t("common.btn.confirm") }}
        </button>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from "vue"
import { useRouter } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { useGlobalStore } from "src/stores/globalStore"
import BackBtn from "src/common/components/BackBtn/Index.vue"

const router = useRouter()
const { accountInfo, withdrawalPasswordForm, setUserWithdrawalPassword } = useUserInfo()
const Rules = useRule()
const globalStore = useGlobalStore()

const formRef = ref<InstanceType<typeof import("quasar")["QForm"]> | null>(null)

const showPassword = reactive({
  oldPassword: false,
  newPassword: false,
  confirmPassword: false
})

async function handleSubmit() {
  const { status } = await setUserWithdrawalPassword()
  if (status) {
    await nextTick()
    formRef.value?.resetValidation()

    if (globalStore.globalState.backRouteName) {
      router.push({ name: globalStore.globalState.backRouteName })
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.member-withdraw-password-form-item {
  @apply flex flex-col gap-[.375rem];

  .phone-row {
    @apply flex flex-nowrap items-center gap-[0.625rem];
  }
}

.member-withdraw-password-form-title {
  @apply font-[NotoSansTC] font-bold text-[.875rem] leading-[1.0625rem] text-[var(--text-03)];
}

.member-withdraw-password-form-input {
  :deep(.q-field__control) {
    @apply rounded px-4  h-[2.5rem];
    @apply rounded bg-[var(--input-dropdown-bg-01)] shadow-[0_2px_4px_0_#00000080];
    @apply border-[2px] border-[var(--input-dropdown-text-03)];

    .q-field__control-container {
      @apply h-[2.375rem];
    }

    .q-field__native {
      @apply p-0 font-[NotoSansTC] font-bold text-[1rem] leading-[1.1875rem] text-[var(--input-dropdown-text-01)];

      &::placeholder {
        @apply opacity-100;
      }
    }

    &::after {
      @apply border-none;
    }
  }

  :deep(.q-field__append) {
    .q-icon {
      @apply cursor-pointer text-[1.25rem] text-[var(--icon-03)];
    }
  }

  &.q-field--error {
    :deep(.q-field__control) {
      @apply border-[var(--input-dropdown-border-02)];
    }

    :deep(.q-field__bottom) {
      @apply px-0 pt-1;

      div {
        @apply font-[NotoSans] font-normal text-[.875rem] leading-[1.1875rem] text-[var(--emotional-01)];
      }
    }
  }

  &.q-select {
    :deep(.q-field__control) {
      &::before {
        border: none;
      }

      .q-field__append {
        @apply h-[2.375rem] text-[var(--input-dropdown-text-01)];
      }
    }
  }
}
</style>
