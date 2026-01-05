<template>
  <div class="referral-table">
    <template v-if="rebateState.list && rebateState.list.length">
      <q-table
        :rows="rebateState.list"
        :columns="rebateTableColumns"
        row-key="name"
        class="referral-table-content"
        hide-bottom
        :pagination="{
          rowsPerPage: rebateState.pagination.size
        }"
      >
        <template #body="props">
          <q-tr>
            <q-td v-for="col in props.cols" :key="col.name" :props="props" class="!py-3">
              <span v-if="col.name === 'currency_code'"> {{ col.value }} </span>
              <span v-else-if="col.name === 'level'"> LV.{{ col.value }} </span>
              <span v-else-if="col.name === 'settled_time'">
                {{ dateformat(col.value, "YYYY/MM/DD HH:mm:ss") }}
              </span>
              <span
                v-else-if="col.name === 'status'"
                class="commission-status"
                :class="{
                  green: col.value === REBATE_STATUS.Enums.COLLECTED,
                  orange: col.value === REBATE_STATUS.Enums.NOT_COLLECTED,
                  red: col.value === REBATE_STATUS.Enums.REJECTED
                }"
              >
                {{ $t(REBATE_STATUS.I18nKeys[col.value as REBATE_STATUS.Enums]) }}
              </span>
              <span v-else> {{ moneyFormat(col.value, 2) }}</span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="referral-pagination-wrapper">
        <Pagination
          v-model="rebateState.pagination.page"
          :total-pages="totalPages"
          :max-pages="3"
          @update:model-value="handlePagination"
        />
      </div>
    </template>
    <template v-else>
      <div class="referral-no-data-container">
        <q-img v-if="getWideLogo" :src="getWideLogo()" lazy-load />
        <span>{{ $t("tableHeader.no_data") }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useLogo } from "src/common/composables/useLogo"
import { useCommon } from "src/common/hooks/useCommon"
import { useRebate } from "src/common/composables/useRebate"
import { dateformat } from "src/common/utils/dayjsUtils"
import { REBATE_STATUS } from "src/common/utils/constants"
import Pagination from "app/template/okbet/components/Pagination/Index.vue"

const { moneyFormat } = useCommon()
const { getWideLogo } = useLogo()
const { rebateTableColumns, rebateState, totalPages, handlePagination } = useRebate()
</script>

<style scoped lang="scss">
@import "app/template/okbet/assets/css/referral.scss";
</style>
