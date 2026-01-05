<template>
  <HeaderTitleBack
    v-if="$q.platform.is.mobile"
    :titleI18n="`${t('member.profile.selfRestriction')} - ${$t('member.profile.bettingLimit')}`"
    dialogClass="bet-limit-dialog"
  >
    <div class="h5-bet-limit-wrapper">
      <q-btn
        class="btn-add-bet-limit"
        outline
        color="primary"
        icon-right="add_circle_outline"
        :to="{ name: 'memberBetLimitAdd' }"
      >
        {{ $t("common.btn.add") }}
      </q-btn>
      <div class="h5-bet-limit-content">
        <div v-if="betLimitState.list.length">
          <q-card v-for="betLimit in betLimitState.list" :key="betLimit.id" flat bordered class="h5-bet-limit-card">
            <q-card-section>
              <div v-for="colMain in betLimitColumnMain" :key="colMain.name" class="h5-bet-limit-col">
                <span>{{ colMain.label }}</span>
                <span>
                  <template v-if="colMain.name === 'dateRange'">
                    {{ dayjs.unix(betLimit.begin_date).format("YYYY-MM-DD") }}
                    ~
                    {{ dayjs.unix(betLimit.end_date).format("YYYY-MM-DD") }}
                  </template>
                  <template v-else-if="colMain.name === 'currency_id'">
                    {{ getCurrencyCodeById(betLimit.currency_id) }}</template
                  >
                  <template v-else-if="colMain.name === 'func'">
                    <q-btn
                      flat
                      class="h5-func-btn"
                      :disable="isTodayAfterTimestamp(betLimit.end_date)"
                      :to="{ name: 'memberBetLimitAdd', params: { id: betLimit.id } }"
                    >
                      {{ $t("common.btn.modify") }}
                    </q-btn>
                  </template>
                  <template v-else>
                    {{ moneyFormat(betLimit[colMain.field as keyof typeof betLimit] as string) }}
                  </template>
                </span>
              </div>

              <q-btn
                v-if="betLimit.settings.length > 1"
                flat
                dense
                :icon="betLimit.expanded ? 'remove' : 'fa-solid fa-plus'"
                @click="betLimit.expanded = !betLimit.expanded"
                class="h5-btn-expand"
              />
            </q-card-section>

            <q-slide-transition>
              <div v-show="betLimit.expanded">
                <q-card-section class="h5-bet-limit-expand-item">
                  <div
                    v-for="(setting, settingIndex) in betLimit.settings"
                    :key="settingIndex"
                    class="h5-bet-limit-expand-child"
                  >
                    <div v-for="colSub in betLimitColumnSub" :key="colSub.name" class="h5-bet-limit-col">
                      <span>{{ colSub.label }}</span>
                      <span>
                        <template v-if="colSub.name === 'dateRange'">
                          {{ dayjs.unix(setting.begin_date).format("YYYY-MM-DD") }}
                          ~
                          {{ dayjs.unix(setting.end_date).format("YYYY-MM-DD") }}
                        </template>
                        <template v-else-if="colSub.name === 'currency_id'">
                          {{ getCurrencyCodeById(setting[colSub.field as keyof typeof setting] as number) }}</template
                        >
                        <template v-else>
                          {{ moneyFormat(setting[colSub.field as keyof typeof setting] as string) }}
                        </template>
                      </span>
                    </div>
                  </div>
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>
          <div v-if="betLimitState.pagination.totalPage" class="w-full flex justify-end q-pa-md custom-pagination">
            <q-pagination
              v-model="betLimitState.pagination.page"
              :max="betLimitState.pagination.totalPage"
              :max-pages="5"
              :boundary-numbers="false"
              @update:model-value="handleBetLimitPagination"
              direction-links
              flat
              active-design="flat"
              color="deep-grey"
              active-color="blue-8"
              icon-prev="arrow_left"
              icon-next="arrow_right"
            />
          </div>
        </div>

        <dev v-else class="h5-no-data-content">
          <p>{{ $t("tableHeader.no_data_available") }}</p>
        </dev>
      </div>
    </div>
  </HeaderTitleBack>
  <div v-else class="profile-container pc">
    <q-btn class="profile-header hide-hover" flat :to="{ name: 'memberProfile' }">
      <q-icon name="arrow_back" class=""></q-icon>
      {{ $t("member.profile.selfRestriction") }} - {{ $t("member.profile.bettingLimit") }}
    </q-btn>
    <q-btn
      class="btn-add-bet-limit"
      outline
      color="primary"
      icon-right="add_circle_outline"
      :to="{ name: 'memberBetLimitAdd' }"
    >
      {{ $t("common.btn.add") }}
    </q-btn>

    <div class="profile-body">
      <q-table
        v-if="betLimitState.list.length"
        flat
        hide-bottom
        :rows-per-page-options="[betLimitState.pagination?.rowsPerPage || 5]"
        :rows="betLimitState.list"
        :columns="betLimitColumnMain"
        row-key="id"
        class="pc-bet-limit-table"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" :class="{ 'odd-row': props.rowIndex % 2 === 0 }">
            <q-td auto-width>
              <q-btn
                v-if="props.row.settings.length > 1"
                dense
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'fa-solid fa-minus' : 'fa-solid fa-plus'"
                class="btn-expand"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name === 'dateRange'">
                {{ dayjs.unix(props.row.begin_date).format("YYYY-MM-DD") }}
                ~
                {{ dayjs.unix(props.row.end_date).format("YYYY-MM-DD") }}
              </template>
              <template v-else-if="col.name === 'currency_id'"> {{ getCurrencyCodeById(col.value) }}</template>
              <template v-else-if="col.name === 'func'">
                <q-btn
                  flat
                  class="func-btn"
                  :disable="isTodayAfterTimestamp(props.row.end_date)"
                  :to="{ name: 'memberBetLimitAdd', params: { id: props.row.id } }"
                >
                  {{ $t("common.btn.modify") }}
                </q-btn>
              </template>
              <template v-else> {{ moneyFormat(col.value) }}</template>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%" class="expand-row">
              <q-table flat hide-bottom :rows="props.row.settings" :columns="betLimitColumnSub" row-key="id">
                <template v-slot:body="props2">
                  <q-tr :props="props2" :class="{ 'odd-row': props2.rowIndex % 2 === 0 }">
                    <q-td v-for="col2 in props2.cols" :key="col2.name" :props="props2">
                      <template v-if="col2.name === 'dateRange'">
                        {{ dayjs.unix(props2.row.begin_date).format("YYYY-MM-DD") }}
                        ~
                        {{ dayjs.unix(props2.row.end_date).format("YYYY-MM-DD") }}
                      </template>
                      <template v-else-if="col2.name === 'currency_id'">
                        {{ getCurrencyCodeById(col2.value) }}</template
                      >
                      <template v-else> {{ moneyFormat(col2.value) }}</template>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div v-if="betLimitState.pagination.totalPage" class="w-full flex justify-end q-pa-md custom-pagination">
        <q-pagination
          v-model="betLimitState.pagination.page"
          :max="betLimitState.pagination.totalPage"
          :max-pages="5"
          :boundary-numbers="false"
          @update:model-value="handleBetLimitPagination"
          direction-links
          flat
          active-design="flat"
          color="deep-grey"
          active-color="blue-8"
          icon-prev="arrow_left"
          icon-next="arrow_right"
        />
      </div>

      <dev v-else class="no-data-content">
        <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
        <p>{{ $t("tableHeader.no_data_available") }}</p>
      </dev>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import dayjs from "dayjs"
import { useEnv } from "src/common/hooks/useEnv.ts"
import { useUserPreferences } from "src/common/composables/useUserPreferences"
import { useLogo } from "src/common/composables/useLogo"
import { useCommon } from "src/common/hooks/useCommon"
import { useCurrency } from "src/common/hooks/useCurrency"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"

const $q = useQuasar()
const { t } = useI18n()
const router = useRouter()
const { betLimitEnabled } = useEnv()
const { getWideLogo } = useLogo()
const { moneyFormat } = useCommon()
const { getCurrencyCodeById } = useCurrency()
const {
  betLimitState,
  betLimitColumnMain,
  betLimitColumnSub,
  initBetLimitQueryString,
  handleGetBetLimitList,
  handleBetLimitPagination,
  isTodayAfterTimestamp
} = useUserPreferences()

onMounted(async () => {
  if (!betLimitEnabled.value) {
    console.error("Bet limit is not available on this site.")
    router.push({ name: "memberProfile" })
    return
  }
  initBetLimitQueryString()
  await handleGetBetLimitList()
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

.btn-add-bet-limit {
  border-radius: 0.625rem;
  padding: 0.5313rem 1rem;
  min-height: auto;

  &::before {
    border-width: 2px;
  }

  :deep(.q-btn__content) {
    font-family: NotoSansTC;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.25rem;
    gap: 0.25rem;

    .q-icon {
      font-size: 1.25rem;
    }
  }
}

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
  .btn-add-bet-limit {
    margin-top: 2.5rem;
  }

  .profile-body {
    width: 100%;
    min-height: 33rem;
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

    .pc-bet-limit-table {
      @apply w-full bg-transparent;

      :deep(.q-table) {
        th {
          font-family: NotoSansTC;
          font-weight: 400;
          font-size: 16px;
          line-height: 23px;
          color: #000000b2;
          padding: 17.5px 14.5px;
        }

        td {
          font-family: NotoSansTC;
          font-weight: 400;
          font-size: 16px;
          line-height: 23px;
          color: #5e6d78;
          padding: 17.5px 14.5px;

          .btn-expand {
            padding: 0.175rem;
            min-height: auto;
            background-color: #ffffff;
            border: 0.7px solid #cfcfcf;
            &::before {
              box-shadow: none;
            }

            .q-icon {
              font-size: 8.4px;
              font-weight: 900;
            }
          }

          .func-btn {
            padding: 0;
            color: #025be8;
            .q-btn__content {
              font-family: NotoSansTC;
              font-weight: 400;
              font-size: 16px;
              line-height: 23px;
              text-transform: none;
            }

            &.disabled {
              color: #b0b0b0;
              opacity: 1 !important;
            }
          }
        }

        .odd-row {
          background-color: #e5ebf2;
        }

        .expand-row {
          padding: 1.5rem;
          background-color: #e9e9e9;
        }
      }
    }

    .no-data-content {
      @apply w-full h-full flex flex-col items-center justify-center gap-3;

      img {
        height: 1.375rem;
        width: auto;
      }

      p {
        font-family: NotoSansTC;
        font-weight: 400;
        font-size: 16px;
        line-height: 23px;
        color: #a7b2c4;
      }
    }
  }
}

.h5-bet-limit-wrapper {
  padding: 1rem 1.1531rem 1rem 0.875rem;

  .h5-bet-limit-content {
    @apply mt-3;

    .h5-bet-limit-col {
      @apply flex items-center justify-between p-2 pr-0 text-black;
      font-family: Arial;
      font-weight: 700;
      font-size: 10px;
      line-height: 0.6875rem;
      border-bottom: 1px solid #0000001a;
      margin-bottom: 0.625rem;
      &:last-of-type {
        border-bottom: none;
        margin-bottom: 0;
      }

      .h5-func-btn {
        padding: 0;
        color: #025be8;
        :deep(.q-btn__content) {
          font-family: Arial;
          font-weight: 700;
          font-size: 10px;
          line-height: 11px;
          text-transform: none;
        }

        &.disabled {
          color: #b0b0b0;
          opacity: 1 !important;
        }
      }
    }

    .h5-bet-limit-card {
      padding: 0;
      border: 1px solid #6288d2;
      margin-bottom: 0.75rem;

      .q-card__section {
        padding: 0.625rem;
      }

      .h5-btn-expand {
        @apply w-full py-2 mt-[.625rem];
        border: 0.7px solid #cfcfcf;

        :deep(.q-btn__content) {
          .q-icon {
            font-size: 0.875rem;
            font-weight: 400;
          }
        }
      }
    }
    .h5-no-data-content {
      @apply flex items-center justify-center py-[.7813rem];
      background: #e5ebf2;
      font-family: NotoSansTC;
      font-weight: 400;
      font-size: 16px;
      line-height: 16px;
      text-align: center;
      vertical-align: middle;
      color: #a7b2c4;
    }

    .h5-bet-limit-expand-item {
      @apply flex flex-col gap-[.625rem];
      background-color: #e5ebf2;

      .h5-bet-limit-expand-child {
        padding: 0 0.75rem;
        background-color: #ffffff;
      }
    }
  }
}
</style>
