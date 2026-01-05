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
          />
        </q-menu>
      </q-input>
    </div>
    <div class="mt-[2.1875rem] flex items-center">
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
      <q-btn class="hide-hover btn-search" @click="submit">{{ $t("common.btn.search") }}</q-btn>
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
@import "app/template/okbet_blackGold/assets/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/button.scss";

.pc-form-row {
  @apply flex items-center gap-5;
  .q-input {
    @apply w-[13.75rem] h-[3rem];
    border: 1px solid $gray-border-color;
    border-radius: 0.625rem;
    color: $gray-border-color;
    :deep(.q-field__control) {
      @apply h-[3rem];
    }

    :deep(.q-field__native) {
      color: $primary-white-color;
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
    border: 1px solid $gray-border-color;
    :deep(.q-field__control) {
      @apply h-[2.5rem] rounded-[3.125rem];
      .q-field__native {
        @apply justify-center;
      }
    }
    :deep(.q-field__native) {
      color: $primary-white-color;
    }
    :deep(.q-icon) {
      color: $primary-white-color;
    }
  }
}
.btn-search {
  @apply ml-5 w-[9.375rem] h-[2.5625rem] rounded-[3.125rem] capitalize;
  font-size: 1rem;
  background: $primary-gradient-color;
  color: $primary-text-black;
}
</style>
