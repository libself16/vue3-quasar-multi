<template>
  <div class="profile-wrapper">
    <BackBtn />
    <div class="profile-content">
      <h2 class="profile-title">{{ $t("member.profile.personalInformation") }}</h2>
      <q-form class="profile-form" ref="formRef" @submit="setAccountInfo">
        <div class="form-content">
          <template v-for="column in memberColumnList" :key="column.column_name">
            <!-- 國碼+手機同時顯示，需要在同一區塊 -->
            <template
              v-if="
                needCountryCodePhone &&
                (column.column_name === COLUMN_NAME.Enums.COUNTRY || column.column_name === COLUMN_NAME.Enums.PHONE)
              "
            >
              <template v-if="column.column_name === COLUMN_NAME.Enums.PHONE">
                <div class="form-item">
                  <div class="form-title" :class="{ required: column.required }">{{ column.column_label }}</div>
                  <div class="phone-row">
                    <DynamicSelect
                      v-if="columnCountryCode"
                      v-model="accountInfoForm[columnCountryCode.column_name]"
                      :field="columnCountryCode"
                      class="form-select column-country-code"
                      standout
                      outlined
                      dense
                      borderless
                      no-error-icon
                      hide-bottom-space
                    />
                    <DynamicInput
                      v-model="accountInfoForm[column.column_name]"
                      :field="column"
                      class="form-input"
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
            <div v-else-if="column.type === INPUT_TYPE.Enums.INPUT" class="form-item">
              <div class="form-title" :class="{ required: column.required }">{{ column.column_label }}</div>
              <DynamicInput
                v-model="accountInfoForm[column.column_name]"
                :field="column"
                class="form-input"
                rounded
                outlined
                dense
                borderless
                no-error-icon
                hide-bottom-space
              />
            </div>
            <div v-else-if="column.type === INPUT_TYPE.Enums.SELECT" class="form-item">
              <div class="form-title" :class="{ required: column.required }">{{ column.column_label }}</div>
              <DynamicSelect
                v-model="accountInfoForm[column.column_name]"
                :field="column"
                class="form-select"
                standout
                outlined
                dense
                borderless
                no-error-icon
                hide-bottom-space
              />
            </div>
            <div v-else-if="column.type === INPUT_TYPE.Enums.DATE" class="form-item">
              <div class="form-title" :class="{ required: column.required }">{{ column.column_label }}</div>
              <DynamicDate
                v-model="accountInfoForm[column.column_name]"
                :field="column"
                class="form-input"
                rounded
                outlined
                dense
                borderless
                no-error-icon
                hide-bottom-space
              />
            </div>
          </template>
          <div class="flex flex-nowrap items-start gap-4 form-item">
            <q-toggle
              v-model="disableAccount"
              :label="$t('member.profile.disableAccount')"
              :left-label="true"
              color="toggle"
              class="min-w-36"
            />
            <q-input
              v-if="disableAccount"
              v-model="accountInfoForm.self_exclusion_at"
              :placeholder="$t('member.profile.disableAccountDate')"
              class="form-input w-full"
              rounded
              outlined
              dense
              borderless
              no-error-icon
              hide-bottom-space
            >
              <q-menu>
                <q-date
                  v-model="accountInfoForm.self_exclusion_at"
                  mask="YYYY-MM-DD"
                  color="date"
                  :options="selfExclusionDateOptions"
                />
              </q-menu>
            </q-input>
          </div>
        </div>
        <q-btn :label="$t('common.btn.submit')" class="btn-submit hide-hover" type="submit" />
      </q-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { COLUMN_NAME, INPUT_TYPE } from "src/common/utils/constants"
import BackBtn from "app/template/set_r016/components/Button/Back.vue"
import DynamicInput from "src/common/components/DynamicColumn/Input.vue"
import DynamicSelect from "src/common/components/DynamicColumn/Select.vue"
import DynamicDate from "src/common/components/DynamicColumn/Date.vue"

const {
  needCountryCodePhone,
  columnCountryCode,
  getMemberColumn,
  memberColumnList,
  accountInfoForm,
  selfExclusionDateOptions,
  setAccountInfo
} = useUserInfo()

const disableAccount = ref(false)

watch(disableAccount, () => {
  accountInfoForm.self_exclusion_at = null
})

onMounted(async () => {
  await getMemberColumn()
})
</script>

<style lang="scss">
@import "app/template/set_r016/assets/css/_variable.scss";
.q-menu {
  .bg-date {
    background-color: $primary04;
  }
}
</style>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";
@import "app/template/set_r016/assets/css/button.scss";

.profile-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    margin: 0;
    padding: 0.625rem 1rem 1.875rem;
  }

  .profile-content {
    margin-top: 1.25rem;
    padding: 3.75rem;
    background-color: $primary07;
    color: $neutral01;
    border-radius: 0.625rem;

    @include phone-width {
      margin-top: 0.625rem;
      padding: 1.25rem;
    }

    .profile-title {
      @include fontStyle(1.625rem);
      color: $secondary03;
    }

    .profile-form {
      @apply flex flex-col justify-center items-center gap-10;
      margin: 2.5rem auto 0;

      @include phone-width {
        @apply mt-5 gap-5;
      }

      .form-content {
        @apply w-full flex flex-wrap gap-10;

        @include phone-width {
          gap: 1.25rem;
        }

        .form-item {
          width: calc(50% - 2.5rem);

          @include phone-width {
            width: 100%;
          }

          .phone-row {
            @apply flex flex-nowrap items-center;
            gap: 0.625rem;
            .column-country-code {
              min-width: 5.875rem;
            }

            .form-input {
              width: 100%;
            }
          }
        }
      }

      :deep(.q-toggle__inner--truthy) {
        color: $primary04;
      }

      .btn-submit {
        @include fontStyle();
        max-width: 100%;
        width: 18.75rem;
        height: 2.25rem;
        background: $gradient01;
        border-radius: 0.625rem;
        text-transform: capitalize;

        @include phone-width() {
          width: 100%;
        }
      }
    }
  }
}
</style>
