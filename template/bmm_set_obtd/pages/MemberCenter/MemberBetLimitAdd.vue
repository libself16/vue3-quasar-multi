<template>
  <HeaderTitleBack
    v-if="$q.platform.is.mobile"
    :titleI18n="`${t('member.profile.selfRestriction')} - ${$t('member.profile.bettingLimit')}`"
    dialogClass="bet-limit-dialog"
  >
    <q-form class="profile-container h5" @submit="handleSubmit">
      <div class="form-container">
        <div class="form-row">
          <div class="form-title">
            {{ $t("member.profile.bettingLimit") }}
          </div>
          <div class="form-content">
            <date-picker
              v-model:value="betLimitForm.date_range"
              range
              type="date"
              value-type="timestamp"
              format="YYYY-MM-DD"
              :clearable="false"
              :disabled="isEditMode"
              :shortcuts="betLimitDatetimeShortcuts"
              @change="handleDatePickerChange"
              class="bet-limit-date-picker-h5"
              popup-class="h5-bet-limit-date-picker-popup"
              :editable="false"
            >
              <template #icon-calendar>
                <q-img :src="svgIcon('calendar_month')" loading="lazy"></q-img>
              </template>
              <!-- <template #footer>
              <div class="flex justify-start gap-2 p-2 border-t bg-black">
                <button class="text-sm text-gray-500">取消</button>
                <button class="text-sm text-blue-600 font-medium">確定</button>
              </div>
            </template> -->
            </date-picker>
          </div>
        </div>
        <div class="form-row">
          <div class="form-title">
            {{ $t("member.profile.bettingLimit") }}
          </div>
          <div class="form-content">
            <q-select
              v-model="betLimitForm.currency_id"
              :options="currencyOptions"
              emit-value
              map-options
              dense
              :display-value="betLimitForm.currency_id ? undefined : $t('member.bank.selectCurrency')"
              :rules="[Rules.required()]"
              hide-bottom-space
              :disable="isEditMode"
            >
            </q-select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-title">
            {{ $t("member.profile.bettingLimit") }}
          </div>
          <div class="form-content">
            <q-input
              v-model="betLimitForm.restrict_amount"
              dense
              :placeholder="$t('shareholder_platform.please_enter_amount')"
              :rules="[Rules.required()]"
              hide-bottom-space
            >
            </q-input>
          </div>
        </div>
      </div>
      <div class="submit-container">
        <q-btn outline color="primary" :to="{ name: 'memberBetLimitList' }">{{ $t("common.btn.cancel") }}</q-btn>
        <q-btn unelevated color="submit" type="submit" class="btn-submit">{{ $t("common.btn.confirm") }}</q-btn>
      </div>
    </q-form>
  </HeaderTitleBack>

  <q-form v-else class="profile-container pc" @submit="handleSubmit">
    <q-btn class="profile-header hide-hover" flat :to="{ name: 'memberBetLimitList' }">
      <q-icon name="arrow_back" class=""></q-icon>
      {{ $t("member.profile.selfRestriction") }} - {{ $t("member.profile.bettingLimit") }}
    </q-btn>

    <div class="profile-body">
      <div class="bet-limit-row">
        <div class="bet-limit-item">
          <div class="bet-limit-title">{{ $t("member.profile.setRange") }}</div>
          <div class="bet-limit-content">
            <date-picker
              v-model:value="betLimitForm.date_range"
              range
              type="date"
              value-type="timestamp"
              format="YYYY-MM-DD"
              class="bet-limit-date-picker"
              :clearable="false"
              :disabled="isEditMode"
              :shortcuts="betLimitDatetimeShortcuts"
              @change="handleDatePickerChange"
              :editable="false"
            >
              <template #icon-calendar>
                <q-img :src="svgIcon('calendar_month')" loading="lazy"></q-img>
              </template>
            </date-picker>
          </div>
        </div>
        <div class="bet-limit-item">
          <div class="bet-limit-title">{{ $t("member.profile.currency") }}</div>
          <div class="bet-limit-content">
            <q-select
              v-model="betLimitForm.currency_id"
              :options="currencyOptions"
              emit-value
              map-options
              dense
              :disable="isEditMode"
              :display-value="betLimitForm.currency_id ? undefined : $t('member.bank.selectCurrency')"
              :rules="[Rules.required()]"
              hide-bottom-space
            >
            </q-select>
          </div>
        </div>
        <div class="bet-limit-item">
          <div class="bet-limit-title">{{ $t("member.profile.cumulativeLimit") }}</div>
          <div class="bet-limit-content">
            <q-input
              v-model="betLimitForm.restrict_amount"
              dense
              :placeholder="$t('shareholder_platform.please_enter_amount')"
              :rules="[Rules.required()]"
              hide-bottom-space
            >
            </q-input>
          </div>
        </div>
      </div>

      <div class="btn-submit-container">
        <q-btn outline color="primary" :to="{ name: 'memberBetLimitList' }">{{ $t("common.btn.cancel") }}</q-btn>
        <q-btn unelevated color="primary" type="submit">{{ $t("common.btn.submit") }}</q-btn>
      </div>
    </div>
  </q-form>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useEnv } from "src/common/hooks/useEnv.ts"
import { useCurrency } from "src/common/hooks/useCurrency"
import { useRule } from "src/common/hooks/useRule"
import { useUserPreferences } from "src/common/composables/useUserPreferences"
import { useSiteImg } from "app/template/bmm_set_obtd/hooks/useSiteImg"
import { toMsUnixTimestamp } from "src/common/utils/dayjsUtils"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import DatePicker from "vue-datepicker-next"
import "vue-datepicker-next/index.css"
import dayjs from "dayjs"

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()
const { betLimitEnabled } = useEnv()
const { currencyOptions } = useCurrency()
const { svgIcon } = useSiteImg()
const Rules = useRule()
const {
  betLimitDatetimeShortcuts,
  betLimitForm,
  handleGetBetLimitItem,
  handlePostBetLimitItem,
  handlePutBetLimitItem
} = useUserPreferences()

const editId = computed(() => route.params.id)
const isEditMode = computed(() => {
  if (editId.value) return true

  return false
})

const handleDatePickerChange = (val: any) => {
  if (val.length === 2) {
    val[1] = dayjs(val[1]).endOf("day").valueOf() // Ensure the end date is set to the end of the day
  }
  betLimitForm.date_range = val
}

const handleSubmit = async () => {
  const apiFunc = isEditMode.value ? handlePutBetLimitItem : handlePostBetLimitItem
  const { status } = await apiFunc()

  if (status) {
    router.push({ name: "memberBetLimitList" })
  }
}

onMounted(async () => {
  if (!betLimitEnabled.value) {
    console.error("Bet limit is not available on this site.")
    router.push({ name: "memberProfile" })
    return
  }

  if (isEditMode.value) {
    handleGetBetLimitItem(editId.value as string)
    return
  }

  const range = betLimitDatetimeShortcuts.value[0].onClick()
  betLimitForm.date_range = [toMsUnixTimestamp(dayjs(range[0]).unix()), toMsUnixTimestamp(dayjs(range[1]).unix())]
})
</script>

<style lang="scss">
@import "src/common/css/_variable.sass";

.pc-bet-limit-date-picker-menu {
  box-shadow: none;
  background: transparent;

  .mx-datepicker {
    opacity: 0;
  }
}

.bet-limit-dialog {
  .full-screen-container {
    background: #ffffff;
  }
}

.h5-bet-limit-date-picker-popup {
  z-index: 7001 !important;
  left: 14px !important;

  // .mx-date-time-range {
  //   width: calc(100vw - 100px);
  //   height: 33.75rem;
  //   overflow-x: auto;

  //   .mx-time {
  //     width: 15.5rem;
  //   }
  // }
}
</style>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/button.scss";

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
    justify-content: center;
    align-items: center;
    font-size: 32px;
    color: $primary-color;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    text-transform: none;
    min-height: 2.75rem;
    line-height: 2.75rem;
    .q-icon {
      font-size: 34px;
      margin-right: 16px;
    }
  }

  .profile-body {
    width: 100%;
    min-height: 36.0625rem;
    margin-top: 12px;
    border: 1px solid $border-pale-gray-color;
    border-radius: 14px;
    padding: 28px;
    font-size: 16px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.9375rem;
    flex-wrap: wrap;

    .bet-limit-row {
      @apply w-full flex flex-wrap gap-5;
      .bet-limit-item {
        width: calc(50% - 0.625rem);
        .bet-limit-title {
          @apply my-4;
          font-family: NotoSansTC;
          font-size: 0.875rem;
          line-height: 1.0625rem;
          font-weight: 350;
          color: #000000;
        }

        .bet-limit-content {
          @apply w-full mt-2;

          .bet-limit-date-picker {
            width: 18.75rem;
            :deep(.mx-input) {
              @apply py-[.7188rem] px-[.5625rem] h-10;
              border: none;
              box-shadow: none;
              background: transparent;
              border-bottom: 0.0456rem solid #0000003d;
              border-radius: 0rem;
              color: #000000de !important;
            }

            :deep(.mx-icon-calendar) {
              right: 0.5rem;
              .q-img {
                width: 1.5rem;
                height: 1.5rem;
              }
            }

            &.disabled {
              background: #b6b6b6;
              opacity: 1 !important;
              :deep(.mx-input) {
                opacity: 1 !important;
                border-bottom: none;
              }
            }
          }

          .q-select {
            width: 18.75rem;

            :deep(.q-field__native) {
              @apply py-[.7188rem] px-[.5625rem] h-10;
            }

            &.q-field--disabled {
              background: #b6b6b6;
              opacity: 1 !important;

              :deep(.q-field__control) {
                div {
                  opacity: 1 !important;
                }
              }
            }
          }
          .q-input {
            width: 18.75rem;

            :deep(.q-field__native) {
              @apply py-[.7188rem] px-[.5625rem] h-10;
            }
          }
        }
      }
    }

    .btn-submit-container {
      @apply w-full flex justify-center items-center mt-[3.75rem] gap-5;
      .q-btn {
        width: 50%;
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

        &.q-btn--outline {
          &::before {
            border-width: 2px;
          }
        }
      }
    }
  }
}

.profile-container.h5 {
  box-sizing: border-box;
  flex-direction: row;
  position: relative;
  width: 100%;

  .form-container {
    @apply flex flex-col gap-6;
    background-color: $background-light-color;
    padding: 16px 4px;

    .form-row {
      font-family: serif;
      width: 100%;

      .form-title {
        font-weight: 400;
        line-height: 2;
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

      .form-content {
        margin-top: 5px;

        .bet-limit-date-picker-h5 {
          width: 100%;

          :deep(.mx-input) {
            @apply py-[.7188rem] px-[.5625rem] h-10;
            border: none;
            box-shadow: none;
            background: transparent;
            border-bottom: 0.0456rem solid #0000003d;
            border-radius: 0rem;
            color: #000000de !important;
            font-size: 1.25rem;
          }

          :deep(.mx-icon-calendar) {
            right: 0.5rem;
            .q-img {
              width: 1.5rem;
              height: 1.5rem;
            }
          }

          &.disabled {
            background: #b6b6b6;
            opacity: 1 !important;
            :deep(.mx-input) {
              opacity: 1 !important;
              border-bottom: none;
            }
          }
        }

        .q-select {
          :deep(.q-field__native) {
            @apply py-[.7188rem] px-[.5625rem] h-10;
          }
          &.q-field--disabled {
            background: #b6b6b6;
            opacity: 1 !important;

            :deep(.q-field__control) {
              div {
                opacity: 1 !important;
              }
            }
          }
        }

        .q-input {
          :deep(.q-field__native) {
            @apply py-[.7188rem] px-[.5625rem] h-10;
          }
        }
      }

      @include phone-width {
        height: auto;
        padding: 0 0.625rem;
        .form-title {
          font-size: 0.875rem;
        }
        .form-content {
          margin-top: 5px;

          .bet-limit-date-picker-h5 {
            width: 100%;

            :deep(.mx-input) {
              font-size: 0.875rem;
            }
          }
        }
      }
    }
  }
  .submit-container {
    margin-top: 60px;
    padding: 0px 14px;
    width: 100%;
    row-gap: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    .q-btn {
      width: 100%;
      font-weight: 500;
      line-height: 1.75;
      letter-spacing: 0.02857em;
      min-width: 64px;
      text-transform: none;
      font-family: "PingFang SC";
      height: 80px;
      font-size: 28px;
      width: 100%;
      color: $text-light-color;
      border-radius: 8px;

      &.q-btn--outline {
        &::before {
          border-width: 2px;
        }
      }
      @include phone-width {
        height: 50px;
        font-size: 16px;
      }
    }
  }
}
</style>
