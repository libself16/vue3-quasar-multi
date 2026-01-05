<template>
  <div
    id="member-profile-detail-content"
    class="w-full h-full rounded-xl p-5 phone:p-0 flex flex-col gap-[.625rem] bg-[var(--bg-11)] phone:bg-transparent"
  >
    <!-- 標題 -->
    <div id="member-profile-detail-header" class="flex items-center justify-between gap-[.625rem]">
      <div
        id="member-profile-detail-header-title"
        class="font-[NotoSans] font-bold text-[1.25rem] leading-[1.6875rem] text-[var(--text-01)] flex items-center gap-1 flex-1"
      >
        <BackBtn />
        <span> {{ $t("member.profile.personalInformation") }}</span>
      </div>
    </div>
    <q-form
      id="member-profile-detail-main"
      class="w-[35rem] phone:w-full flex-1 flex flex-col justify-between gap-5 mx-auto relative phone:pb-[3.5rem]"
      @submit="handleSubmit"
    >
      <div id="member-profile-detail-body" class="flex flex-col gap-[.625rem]">
        <div id="member-profile-form-content" class="grid grid-cols-2 gap-[.625rem] phone:grid-cols-1">
          <template v-for="column in memberColumnList" :key="column.column_name">
            <!-- 國碼+手機同時顯示，需要在同一區塊 -->
            <template
              v-if="
                needCountryCodePhone &&
                (column.column_name === COLUMN_NAME.Enums.COUNTRY || column.column_name === COLUMN_NAME.Enums.PHONE)
              "
            >
              <template v-if="column.column_name === COLUMN_NAME.Enums.PHONE">
                <div class="member-profile-form-item">
                  <div class="member-profile-form-title" :class="{ required: column.required }">
                    {{ column.column_label }}
                  </div>
                  <div class="phone-row">
                    <DynamicSelect
                      v-if="columnCountryCode"
                      v-model="accountInfoForm[columnCountryCode.column_name]"
                      :field="columnCountryCode"
                      class="member-profile-form-input min-w-[5.875rem]"
                      standout
                      outlined
                      dense
                      no-error-icon
                      hide-bottom-space
                      color="select"
                    />
                    <DynamicInput
                      v-model="accountInfoForm[column.column_name]"
                      :field="column"
                      class="member-profile-form-input flex-1"
                      rounded
                      outlined
                      dense
                      borderless
                      no-error-icon
                      hide-bottom-space
                    />
                  </div>
                </div>
              </template>
            </template>
            <div v-else-if="column.type === INPUT_TYPE.Enums.INPUT" class="member-profile-form-item">
              <div class="member-profile-form-title" :class="{ required: column.required }">
                {{ column.column_label }}
              </div>
              <DynamicInput
                v-model="accountInfoForm[column.column_name]"
                :field="column"
                class="member-profile-form-input"
                rounded
                outlined
                dense
                borderless
                no-error-icon
                hide-bottom-space
              />
            </div>
            <div v-else-if="column.type === INPUT_TYPE.Enums.SELECT" class="member-profile-form-item">
              <div class="member-profile-form-title" :class="{ required: column.required }">
                {{ column.column_label }}
              </div>
              <DynamicSelect
                v-model="accountInfoForm[column.column_name]"
                :field="column"
                class="member-profile-form-input"
                standout
                outlined
                dense
                borderless
                no-error-icon
                hide-bottom-space
                color="select"
              />
            </div>
            <div v-else-if="column.type === INPUT_TYPE.Enums.DATE" class="member-profile-form-item">
              <div class="member-profile-form-title" :class="{ required: column.required }">
                {{ column.column_label }}
              </div>
              <DynamicDate
                v-model="accountInfoForm[column.column_name]"
                :field="column"
                class="member-profile-form-input"
                rounded
                outlined
                dense
                borderless
                no-error-icon
                hide-bottom-space
              />
            </div>
          </template>
        </div>
        <div
          id="member-profile-form-self-exclusion-row"
          class="flex items-center phone:items-start gap-[.375rem] phone:flex-col"
        >
          <div id="member-profile-form-self-exclusion-first" class="flex items-center gap-[.375rem]">
            <div id="member-profile-form-self-exclusion-title" class="member-profile-form-title">
              {{ $t("member.profile.disableAccount") }}
            </div>
            <div
              id="member-profile-form-self-exclusion-control"
              class="flex items-center p-[.375rem] rounded-[6.25rem] bg-[var(--tab-bg-03)]"
            >
              <div
                @click="disableAccount = true"
                class="member-profile-form-self-exclusion-control-btn"
                :class="{ active: disableAccount === true }"
              >
                {{ $t("common.enable") }}
              </div>
              <div
                @click="disableAccount = false"
                class="member-profile-form-self-exclusion-control-btn"
                :class="{ active: disableAccount === false }"
              >
                {{ $t("common.disable") }}
              </div>
            </div>
          </div>

          <q-input
            v-if="disableAccount"
            v-model="accountInfoForm.self_exclusion_at"
            :placeholder="$t('member.profile.disableAccountDate')"
            class="member-profile-form-input flex-1 phone:w-full"
            standout
            outlined
            dense
            no-error-icon
            hide-bottom-space
          >
            <q-menu>
              <q-date
                v-model="accountInfoForm.self_exclusion_at"
                mask="YYYY-MM-DD"
                color="date"
                :options="selfExclusionDateOptions"
                minimal
                :dark="isDark"
              />
            </q-menu>
            <template v-slot:append>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.501 10C17.8926 10 18.0904 10.0004 18.2129 10.1221C18.3342 10.2446 18.334 10.4411 18.334 10.833V15C18.334 16.5717 18.334 17.3564 17.8457 17.8447C17.3574 18.3331 16.5726 18.333 15.001 18.333H5.00098C3.42931 18.333 2.64458 18.3331 2.15625 17.8447C1.66792 17.3564 1.66797 16.5717 1.66797 15V10.833C1.66797 10.4419 1.66775 10.2446 1.78906 10.1221C1.91156 10.0004 2.10848 10 2.50098 10H17.501ZM14.167 1.5C14.7193 1.5 15.167 1.94772 15.167 2.5V4.16797C16.6285 4.16857 17.3749 4.18445 17.8457 4.65527C18.334 5.14361 18.334 5.92833 18.334 7.5C18.334 7.8925 18.3346 8.08941 18.2129 8.21191C18.0904 8.33358 17.8926 8.33301 17.501 8.33301H2.50098C2.10848 8.33301 1.91156 8.33358 1.78906 8.21191C1.6674 8.08941 1.66797 7.89167 1.66797 7.5C1.66797 5.92833 1.66792 5.14361 2.15625 4.65527C2.62697 4.18455 3.37308 4.16858 4.83398 4.16797V2.5C4.83398 1.94782 5.28185 1.50018 5.83398 1.5C6.38627 1.5 6.83398 1.94772 6.83398 2.5V4.16699H13.167V2.5C13.167 1.94793 13.615 1.50035 14.167 1.5Z"
                  class="fill-[var(--icon-03)]"
                />
              </svg>
            </template>
          </q-input>
        </div>
      </div>
      <div
        id="member-profile-detail-footer"
        class="flex items-center justify-center phone:fixed phone:left-4 phone:right-4 phone:bottom-[calc(12vw+.625rem)] iphone:bottom-[calc(3.875rem+.625rem)]"
      >
        <button
          id="member-profile-detail-submit-btn"
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
import { onMounted, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useEnv } from "src/common/hooks/useEnv"
import { useGlobalStore } from "src/stores/globalStore"
import { COLUMN_NAME, INPUT_TYPE } from "src/common/utils/constants"
import DynamicInput from "src/common/components/DynamicColumn/Input.vue"
import DynamicSelect from "src/common/components/DynamicColumn/Select.vue"
import DynamicDate from "src/common/components/DynamicColumn/Date.vue"
import BackBtn from "src/common/components/BackBtn/Index.vue"

const router = useRouter()
const {
  needCountryCodePhone,
  columnCountryCode,
  getMemberColumn,
  memberColumnList,
  accountInfoForm,
  selfExclusionDateOptions,
  setAccountInfo
} = useUserInfo()
const { isDark } = useEnv()
const globalStore = useGlobalStore()

const disableAccount = ref(false)

async function handleSubmit() {
  const { status } = await setAccountInfo()
  if (status) {
    if (globalStore.globalState.backRouteName) {
      router.push({ name: globalStore.globalState.backRouteName })
    }
  }
}

watch(disableAccount, () => {
  accountInfoForm.self_exclusion_at = null
})

onMounted(async () => {
  await getMemberColumn()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.member-profile-form-item {
  @apply flex flex-col gap-[.375rem];

  .phone-row {
    @apply flex flex-nowrap items-center gap-[0.625rem];
  }
}

.member-profile-form-title {
  @apply font-[NotoSansTC] font-bold text-[.875rem] leading-[1.0625rem] text-[var(--text-03)];
}

.member-profile-form-input {
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

.member-profile-form-self-exclusion-control-btn {
  @apply py-2 px-5 rounded-[6.25rem] cursor-pointer;
  @apply font-[NotoSansTC] font-bold text-[.875rem] leading-[1.0625rem] text-[var(--tab-text-01)];

  &.active {
    background: linear-gradient(90deg, var(--tab-bg-01) 0%, var(--tab-bg-02) 100%);
  }
}
</style>
