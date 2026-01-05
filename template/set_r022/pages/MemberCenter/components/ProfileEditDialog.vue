<template>
  <q-dialog
    v-model="showDialog"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="isLargeTablet ? '0' : '300'"
    :maximized="isLargeTablet"
  >
    <q-card class="profile-edit-dialog">
      <q-card-section class="profile-edit-container">
        <div class="header-area">
          <q-btn
            v-if="isLargeTablet"
            icon="arrow_back_ios"
            class="hide-hover"
            flat
            round
            dense
            @click="showDialog = false"
          />
          <div class="header-text">{{ props.data.lang?.[nowLang as LANGUAGE_TYPE.Enums] }}</div>
          <q-btn v-if="!isLargeTablet" icon="close" class="hide-hover" flat round dense @click="showDialog = false" />
        </div>

        <div class="container">
          <div class="edit-area">
            <div v-if="isLargeTablet" class="mobile-text" :class="{ require: props.data.required }">
              {{ props.data.lang?.[nowLang as LANGUAGE_TYPE.Enums] }}
            </div>

            <q-input
              v-if="props.data.type === INPUT_TYPE.Enums.INPUT"
              v-model="accountInfoForm[props.data.column_name]"
              :placeholder="$t(memberColumnPlaceholderI18n[props.data.column_name])"
              :disable="!props.data.edit"
              :rules="props.data.required ? [Rules.required()] : []"
              dense
              borderless
              class="input-style"
            />

            <q-select
              v-else-if="props.data.type === INPUT_TYPE.Enums.SELECT"
              v-model="accountInfoForm[props.data.column_name]"
              :class="{ 'select-placeholder': !accountInfoForm[props.data.column_name] }"
              :options="props.data.values"
              :display-value="
                accountInfoForm[props.data.column_name]
                  ? undefined
                  : $t(memberColumnPlaceholderI18n[props.data.column_name] || '')
              "
              :disable="!props.data.edit"
              :rules="props.data.required ? [Rules.required()] : []"
              emit-value
              map-options
              dense
              borderless
              class="input-style"
            />

            <q-input
              v-else-if="props.data.type === INPUT_TYPE.Enums.DATE"
              v-model="accountInfoForm[props.data.column_name]"
              :placeholder="$t(memberColumnPlaceholderI18n[props.data.column_name])"
              readonly
              :rules="props.data.required ? [Rules.required()] : []"
              :disable="!props.data.edit"
              dense
              borderless
              class="input-style"
            >
              <template v-slot:append> <q-icon name="event" /> </template>
              <q-menu>
                <q-date v-model="accountInfoForm[props.data.column_name]" mask="YYYY-MM-DD" minimal color="primary" />
              </q-menu>
            </q-input>
          </div>

          <q-btn
            flat
            class="btn-confirm hide-hover"
            :class="{ require: props.data.required }"
            @click="handlerClickConfirm()"
          >
            {{ $t("common.btn.confirm") }}
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { onMounted, ref, watch } from "vue"
import { useRule } from "src/common/hooks/useRule"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { COLUMN_NAME, LANGUAGE_TYPE, INPUT_TYPE } from "src/common/utils/constants"

const emit = defineEmits(["update:modelValue", "refresh"])
const props = defineProps({
  modelValue: Boolean,
  data: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const { t } = useI18n()
const $q = useQuasar()
const Rules = useRule()
const { nowLang } = useLanguage()
const { isLargeTablet } = useMediaQuery()
const { accountInfoForm, memberColumnPlaceholderI18n, getMemberColumn, setSingleAccountInfo } = useUserInfo()

const showDialog = ref(props.modelValue)

const handlerClickConfirm = async () => {
  const dialogColumnValue = accountInfoForm[props.data.column_name]
  if (props.data.required && !dialogColumnValue) {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("common.validate.mustNotBeEmpty"),
      icon: "warning",
      timeout: 1000
    })
    return
  }

  const { status } = await setSingleAccountInfo(props.data.column_name)
  if (status) {
    showDialog.value = false
    emit("refresh", true)
  }
}

watch(
  () => props.modelValue,
  (val) => {
    showDialog.value = val
  }
)
watch(showDialog, (val) => {
  emit("update:modelValue", val)
})

onMounted(async () => {
  await getMemberColumn()
})
</script>
<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/form.scss";
@import "app/template/set_r022/assets/css/button.scss";

.profile-edit-dialog {
  width: 31.4375rem;
  background: var(--neutral-01);
  box-shadow: none;

  @include pad-large-width {
    background: var(--bg-main-bg);
  }

  .profile-edit-container {
    padding: 1.25rem 1.5rem;
    border-radius: 0.5rem !important;

    @include pad-large-width {
      padding: 0;
      background: var(--neutral-01);
    }

    .header-area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--neutral-10);
      font-size: 1.5rem;
      margin-bottom: 3rem;
      position: relative;

      @include pad-large-width {
        justify-content: flex-start;
        font-size: 1.125rem;
        padding: 0.71875rem 0.5rem;
        background: var(--bg-headerbottom);
        margin-bottom: 0;
      }

      .header-text {
        @include pad-large-width {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }

    .container {
      @include pad-large-width {
        padding: 0.9375rem;
      }

      .edit-area {
        width: 100%;

        .mobile-text {
          font-size: 0.75rem;
          margin-bottom: 0.634375rem;

          &.require {
            &::before {
              content: "＊";
              color: var(--emotional-danger-01);
            }
          }
        }

        .input-style {
          :deep(.q-field__inner) {
            height: 2.75rem;
            border: 1px solid var(--neutral-03);
            border-radius: 0.375rem;

            .q-field__prepend {
              padding: 0;

              .form-icon {
                cursor: auto;
                margin: 0.75rem;

                @include pad-large-width {
                  margin: unset;
                }

                img {
                  width: 1rem;
                  height: 1rem;

                  @include pad-large-width {
                    width: 1.625rem;
                    height: 1.625rem;
                  }
                }
              }
            }

            .q-field__append {
              .eye-icon {
                font-size: 0.9375rem;
                margin: 0.375rem 0.75rem;
                color: var(--primary-02);
                cursor: pointer;

                @include pad-large-width {
                  font-size: 1.1rem;
                  margin: 0 0.5rem 0 0.25rem;
                }
              }
            }

            .q-field__control {
              height: 2.75rem;
              padding: 0 0.75rem;
            }

            .q-field__control-container {
              width: 100%;
              border: none;
              font-size: 14px;
              font-weight: 400;
              background: transparent;
              overflow-wrap: break-word;

              @include pad-large-width {
                font-size: 0.9647rem;
              }

              .q-field__native {
                height: 2.75rem;
                color: var(--secondary-01);
                padding: 0.6875rem 0;
              }
            }
          }
        }
      }

      .btn-confirm {
        width: 100%;
        height: 2.75rem;
        background: var(--primary-01);
        color: var(--text-01);
        margin-top: 2rem;
        border-radius: 0.5rem;

        @include pad-large-width {
          height: 2rem;
          margin: 0.75rem 0;

          &.require {
            margin: 0 0 0.75rem;
          }
        }
      }
    }
  }
}
</style>
