<template>
  <div class="search-content text-base font-semibold">
    <p>{{ $t("collaboration.search_content") }}</p>
    <div class="mt-[1.125rem] mobile-form-row">
      {{ $t("collaboration.settlement_time") }}
      <q-input
        v-model="settlementTime"
        filled
        dense
        readonly :placeholder="$t('collaboration.account_number')"
      >
        <!-- <q-menu ref="dateRangePickerMenuRef"> -->
        <q-date
          v-model="settlementTime"
          range
          @update:model-value="handleDateRangePick"
          @range-end="closeDateRangePicker"
        />
        <!-- </q-menu> -->

        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
              :breakpoint="768"
            >
              <q-date
                v-model="settlementTime"
                range
                @update:model-value="handleDateRangePick"
                @range-end="closeDateRangePicker"
              >
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Confirm" color="primary" flat v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>

    <div class="mt-[1.75rem] flex flex-nowrap items-center justify-between">
      <div class="mobile-form-row">
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
    </div>
    <q-btn class="hide-hover btn-search" @click="submit">{{ $t("common.btn.search") }}</q-btn>
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
  // dateRangePickerMenuRef,
  settlementTime,
  rebateState,
  // statusDropDown,
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

.mobile-form-row {
  @apply flex items-center gap-4;
  .q-input {
    @apply w-[16.75rem] h-[2.375rem];
    border: 1px solid $gray-border-color;
    border-radius: 0.625rem;
    :deep(.q-field__control) {
      @apply h-[2.375rem];
    }
    :deep(.q-field__native) {
      color: $primary-white-color;
    }
  }
  .q-select {
    @apply w-[7.0625rem] h-[2.375rem] rounded-[2.5rem];
    border: 1px solid $gray-border-color;
    :deep(.q-field__control) {
      @apply h-[2.375rem] rounded-[2.5rem];
    }
    :deep(.q-field__native) {
      color: $primary-white-color;
      @apply justify-center;
    }
    :deep(.q-icon) {
      color: $primary-white-color;
    }
  }
}
.btn-search {
  @apply mt-[1.4375rem] w-full py-[.625rem] rounded-[2.4606rem] capitalize;
  font-size: 1rem;
  background: $primary-gradient-color;
  color: $primary-text-black;
}
</style>
