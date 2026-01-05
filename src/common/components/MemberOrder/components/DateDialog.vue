<template>
  <q-dialog persistent>
    <q-card class="date-dialog">
      <div class="date-dialog-header">
        <div class="date-dialog-title">
          {{ $t("order.searchTime") }}
        </div>

        <q-btn icon="close" class="close-img-btn" flat round dense v-close-popup size="md" @click="handlerClick(1)" />
      </div>

      <div class="date-dialog-body">
        <div class="search-type-btns">
          <q-btn-toggle
            v-model="pendingOrderState.query.dateType"
            no-caps
            unelevated
            spread
            toggle-color="primary"
            class="toggle-date-picker font"
            :options="dayTypeTabs"
          />
        </div>

        <div flat square class="date-area">
          <span> {{ pendingOrderState.query.start_date }} ~ {{ pendingOrderState.query.end_date }} </span>
          <q-icon name="fa-solid fa-calendar" class="cursor-pointer"> </q-icon>

          <q-menu @show="datePickerShow = true" @hide="datePickerShow = false" ref="menuRef">
            <q-date
              v-model="datePickerValue"
              range
              mask="YYYY-MM-DD"
              color="date"
              @range-end="hideMenu"
              @update:model-value="handleDateRangePick"
            />
          </q-menu>
        </div>

        <div class="footer-area">
          <q-btn class="btn-reset" :label="$t('common.btn.reset')" @click="handlerClick(1)" />
          <q-btn class="btn-submit" :label="$t('common.btn.submit')" @click="handlerClick(2)" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, inject } from "vue"
import { REPORT_DATE_TYPES } from "src/common/utils/constants"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const emit = defineEmits(["reset", "submit", "close"])

// 從父組件注入共享的狀態和方法
const pendingOrderState = inject("pendingOrderState") as any
const handleDateRangePick = inject("handleDateRangePick") as any
const getPendingOrderList = inject("getPendingOrderList") as any

const menuRef = ref()
const datePickerShow = ref(false)
const datePickerValue = ref({
  from: pendingOrderState.query.start_date || "",
  to: pendingOrderState.query.end_date || ""
})

const dayTypeTabs = computed(() => [
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.Today]),
    value: REPORT_DATE_TYPES.Enums.Today
  },
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.Yesterday]),
    value: REPORT_DATE_TYPES.Enums.Yesterday
  },
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastSevenDays]),
    value: REPORT_DATE_TYPES.Enums.LastSevenDays
  },
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastThirtyDays]),
    value: REPORT_DATE_TYPES.Enums.LastThirtyDays
  }
])

const hideMenu = () => {
  menuRef.value.hide()
}

const handlerClick = async (type: number) => {
  if (type === 1) {
    emit("reset")
  } else if (type === 2) {
    emit("submit")
  }
}
</script>

<style scoped lang="scss">
.date-dialog {
  width: 34rem;
  background: var(--dialog-bg);
  padding: 1rem 1rem;

  .date-dialog-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    position: relative;

    .date-dialog-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--dialog-text-01);
    }

    .close-img-btn {
      position: absolute;
      right: 0;
      top: 0;
      color: var(--icon-03);
    }
  }

  .date-dialog-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;

    .search-type-btns {
      width: 100%;

      .toggle-date-picker {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 0.625rem;

        :deep(.q-btn) {
          min-width: 25%;
          min-height: auto;
          background: var(--tab-bg-04);
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--tab-text-01);
          border-radius: 6.25rem;
          flex: 0 0 auto;

          &.bg-primary {
            background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%) !important;
          }
        }
      }
    }

    .date-area {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 2px solid var(--input-dropdown-text-03);
      color: var(--input-dropdown-text-01);
      background: var(--input-dropdown-bg-01);
      border-radius: 0.25rem;
      padding: 0.65625rem 1rem;
      box-shadow: 0px 2px 4px 0px #00000080;
      cursor: pointer;
      margin: 1rem 0.625rem 2rem;

      .q-menu {
        .bg-date {
          background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%) !important;
        }
      }
    }

    .footer-area {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.625rem;

      .btn-reset {
        width: 50%;
        color: var(--btn-text-04);
        border: 1px solid var(--btn-border-02);
        border-radius: 0.25rem;
      }

      .btn-submit {
        width: 50%;
        background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%);
        color: var(--btn-text-01);
      }
    }
  }
}
</style>
