<template>
  <div class="search-content text-xl font-semibold">
    <p>{{ $t("collaboration.search_content") }}</p>
    <div class="mt-6 pc-form-row">
      {{ $t("collaboration.settlement_time") }}
      <q-input v-model="settlementTime" filled dense readonly :placeholder="$t('collaboration.settlement_time')">
        <q-menu ref="dateRangePickerMenuRef">
          <q-date
            v-model="settlementTime"
            range
            @update:model-value="handleDateRangePick"
            @range-end="closeDateRangePicker"
            class="calendar-content"
          />
        </q-menu>
      </q-input>
    </div>
    <div class="mt-[2.1875rem] flex items-center">
      <!-- <div class="pc-form-row">
        {{ $t("collaboration.status") }}
        <q-select
          v-model="rebateState.query.status"
          :options="statusDropDown"
          filled
          dense
          emit-value
          map-options
        ></q-select>
      </div> -->
      <div class="pc-form-row">
        {{ $t("collaboration.currency") }}
        <q-select
          v-model="rebateState.query.currency_id"
          :options="props.walletDropdown"
          filled
          dense
          emit-value
          map-options
        ></q-select>
      </div>
      <q-btn color="primary " class="hide-hover btn-search" @click="submit">{{ $t("common.btn.search") }}</q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRebate } from "src/common/composables/useRebate"
import { BaseListType } from "src/api/response.type"

const props = defineProps({
  walletDropdown: {
    type: Array<BaseListType>,
    required: true,
    default: () => []
  }
})

const {
  dateRangePickerMenuRef,
  settlementTime,
  rebateState,
  statusDropDown,
  closeDateRangePicker,
  getRebateList,
  initRebateState,
  handleDateRangePick,
  submit
} = useRebate()

onMounted(() => {
  initRebateState()
  getRebateList()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r024/assets/css/_variable.sass";
@import "app/template/set_r024/assets/css/button.scss";
@import "app/template/set_r024/assets/css/common.scss";

.pc-form-row {
  @apply flex items-center gap-5;
  color: $neutral-01;
  .q-input {
    @apply w-[13.75rem] h-[3rem];
    :deep(.q-field__control) {
      @apply h-[3rem];
      .q-field__native {
        @apply text-center rounded-[.375rem];
        color: $neutral-01;
        border: 1px solid $functional-line;
      }
    }

    &.q-field--readonly {
      :deep(.q-field__control) {
        &::before {
          border-bottom-style: none;
        }
      }
    }
  }
  .q-select {
    @apply w-[9rem] h-[2.5rem] rounded-[3.125rem];
    border: 1px solid $functional-line;
    background: $functional-input;
    :deep(.q-field__control) {
      @apply h-[2.5rem] rounded-[3.125rem];
      .q-field__native {
        @apply justify-center;
        color: $neutral-01;
      }
    }
    :deep(.q-field__append) {
      color: $neutral-01;
    }
  }
}
.btn-search {
  @apply ml-5 w-[9.375rem] h-[2.5625rem] rounded-[3.125rem] capitalize;
  font-size: 1rem;
}
</style>
