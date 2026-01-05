<template>
  <HeaderTitleBack
    v-if="$q.platform.is.mobile"
    :titleI18n="`${t('member.profile.selfRestriction')} - ${$t('member.profile.bettingRestriction')}`"
    dialogClass="bet-limit-dialog"
  >
    <q-form class="profile-container h5" @submit="handlePutPreferencesExclusion">
      <div class="form-container">
        <div class="form-row">
          <div class="form-title">
            {{ $t("member.profile.setTime") }}
          </div>
          <div class="form-content">
            <date-picker
              v-model:value="betRestrictionDatetime"
              type="datetime"
              value-type="timestamp"
              format="YYYY-MM-DD HH:mm:ss"
              class="bet-limit-date-picker-h5"
              :clearable="false"
              :disabled="betRestrictionDatetimeSetted"
              popup-class="h5-bet-limit-date-picker-popup"
              :disabled-date="disableDate"
              :disabled-time="disableTime"
              :shortcuts="betRestrictionDatetimeShortcuts"
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
      </div>
      <div v-if="!betRestrictionDatetimeSetted" class="submit-container">
        <q-btn outline color="primary" :to="{ name: 'memberProfile' }">{{ $t("common.btn.cancel") }}</q-btn>
        <q-btn unelevated color="submit" type="submit" class="btn-submit">{{ $t("common.btn.confirm") }}</q-btn>
      </div>
    </q-form>
  </HeaderTitleBack>
  <q-form v-else class="profile-container pc" @submit="handlePutPreferencesExclusion">
    <q-btn class="profile-header hide-hover" flat :to="{ name: 'memberProfile' }">
      <q-icon name="arrow_back" class=""></q-icon>
      {{ $t("member.profile.selfRestriction") }} - {{ $t("member.profile.bettingRestriction") }}
    </q-btn>

    <div class="profile-body">
      <div class="bet-limit-wrapper">
        <div class="bet-limit-title">{{ $t("member.profile.setTime") }}</div>
        <div class="bet-limit-content">
          <date-picker
            v-model:value="betRestrictionDatetime"
            type="datetime"
            value-type="timestamp"
            format="YYYY-MM-DD HH:mm:ss"
            class="bet-limit-date-picker"
            :clearable="false"
            :disabled="betRestrictionDatetimeSetted"
            :disabled-date="disableDate"
            :disabled-time="disableTime"
            :shortcuts="betRestrictionDatetimeShortcuts"
          >
            <template #icon-calendar>
              <q-img :src="svgIcon('calendar_month')" loading="lazy"></q-img>
            </template>
          </date-picker>
        </div>
      </div>

      <div v-if="!betRestrictionDatetimeSetted" class="btn-submit-container">
        <q-btn outline color="primary" :to="{ name: 'memberProfile' }">{{ $t("common.btn.cancel") }}</q-btn>
        <q-btn unelevated color="primary" type="submit">{{ $t("common.btn.submit") }}</q-btn>
      </div>
    </div>
  </q-form>
</template>
<script lang="ts" setup>
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useUserPreferences } from "src/common/composables/useUserPreferences"
import { useSiteImg } from "app/template/bmm_set_obtd/hooks/useSiteImg"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import DatePicker from "vue-datepicker-next"
import "vue-datepicker-next/index.css"

const $q = useQuasar()
const { t } = useI18n()
const { svgIcon } = useSiteImg()
const {
  disableDate,
  disableTime,
  betRestrictionDatetimeShortcuts,
  betRestrictionDatetime,
  betRestrictionDatetimeSetted,
  handleGetPreferencesExclusion,
  handlePutPreferencesExclusion
} = useUserPreferences()

onMounted(async () => {
  await handleGetPreferencesExclusion()
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
  z-index: 7001;
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
    .q-icon {
      font-size: 34px;
      margin-right: 16px;
    }
  }
  .profile-body {
    width: 100%;
    min-height: 36.0625rem;
    margin-top: 10px;
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

    .bet-limit-wrapper {
      width: 18.75rem;
      .bet-limit-title {
        @apply my-4;
        font-family: NotoSansTC;
        font-size: 0.875rem;
        line-height: 1.0625rem;
        font-weight: 350;
        color: #000000;
      }

      .bet-limit-content {
        @apply mt-2;

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
    margin-top: 149.36px;
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
