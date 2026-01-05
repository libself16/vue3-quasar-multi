<template>
  <ModalBase
    v-model="modalShow"
    :templateType="'primary'"
    use-title
    :title="t('menu.profile')"
    max-width="50rem"
    modal-class="primary-modal"
  >
    <div class="profile-wrapper">
      <q-form class="profile-form column" @submit="handleSubmit">
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
                <div class="form-label" :class="{ required: column.required }">{{ column.column_label }}</div>
                <div class="phone-row">
                  <DynamicSelect
                    v-if="columnCountryCode"
                    v-model="accountInfoForm[columnCountryCode.column_name]"
                    :field="columnCountryCode"
                    class="column-country-code"
                    dense
                    bg-color="white"
                    color="black"
                    outlined
                    options-dark
                  />
                  <DynamicInput
                    v-model="accountInfoForm[column.column_name]"
                    :field="column"
                    class="column-phone"
                    standout
                    outlined
                    dense
                    bg-color="white"
                    color="black"
                  />
                </div>
              </div>
            </template>
          </template>
          <div v-else-if="column.type === INPUT_TYPE.Enums.INPUT" class="form-item">
            <div class="form-label" :class="{ required: column.required }">{{ column.column_label }}</div>
            <DynamicInput
              v-model="accountInfoForm[column.column_name]"
              :field="column"
              standout
              outlined
              dense
              bg-color="white"
              color="black"
            />
          </div>
          <div v-else-if="column.type === INPUT_TYPE.Enums.SELECT" class="form-item">
            <div class="form-label" :class="{ required: column.required }">{{ column.column_label }}</div>
            <DynamicSelect
              v-model="accountInfoForm[column.column_name]"
              :field="column"
              dense
              bg-color="white"
              color="black"
              outlined
              options-dark
            />
          </div>
          <div v-else-if="column.type === INPUT_TYPE.Enums.DATE" class="form-item">
            <div class="form-label" :class="{ required: column.required }">{{ column.column_label }}</div>
            <DynamicDate
              v-model="accountInfoForm[column.column_name]"
              :field="column"
              outlined
              readonly
              dense
              bg-color="white"
              class="date-input"
            />
          </div>
        </template>

        <!-- Submit -->
        <div class="form-btn-wrapper">
          <q-btn class="form-btn-submit" type="submit" :loading="isLoading">
            {{ $t("common.btn.submit") }}
          </q-btn>
        </div>
      </q-form>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { INPUT_TYPE, COLUMN_NAME } from "src/common/utils/constants"
import { useAuth } from "src/common/hooks/useAuth"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import ModalBase from "./ModalBase.vue"
import DynamicInput from "src/common/components/DynamicColumn/Input.vue"
import DynamicSelect from "src/common/components/DynamicColumn/Select.vue"
import DynamicDate from "src/common/components/DynamicColumn/Date.vue"

const { t } = useI18n()
const eventbus = injectStrict(EventBusKey)
const { needCountryCodePhone, columnCountryCode, getMemberColumn, memberColumnList, accountInfoForm, setAccountInfo } =
  useUserInfo()
const { isLoading } = useAuth()
const modalShow = ref(false)

const handleSubmit = async () => {
  await setAccountInfo()
  modalShow.value = false
}

onMounted(() => {
  eventbus.on("openProfile", async (show: boolean) => {
    modalShow.value = show
    if (show) {
      await getMemberColumn()
    }
  })
})
</script>

<style lang="scss">
@import "app/template/set_ed8888/assets/css/_variable.scss";
.q-menu {
  .bg-date {
    color: white;
    background: $pink-button-gradient;
  }
}
</style>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/_variable.scss";
@import "app/template/set_ed8888/assets/css/form.scss";

.profile-wrapper {
  @apply pt-4 px-[.625rem] pb-4;

  :deep(.form-label) {
    @apply uppercase text-base font-bold;
  }

  .form-icon {
    color: $primary-color;
  }

  .form-item {
    @apply pb-5;

    .phone-row {
      @apply flex flex-nowrap items-center;
      gap: 0.625rem;

      .column-country-code {
        flex: 3;

        @include phone-width() {
          flex: 5;
        }
      }

      .column-phone {
        flex: 7;

        @include phone-width() {
          flex: 5;
        }
      }
    }

    :deep(.date-input) {
      .q-field__control {
        &::before {
          border-style: solid;
        }
      }
    }
  }
}
</style>
