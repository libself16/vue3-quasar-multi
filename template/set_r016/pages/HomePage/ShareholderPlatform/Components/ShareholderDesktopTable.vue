<template>
  <div class="shareholder-desktop-table">
    <template v-if="rows && rows.length > 0">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="name"
        hide-bottom
        :pagination="{ rowsPerPage: rowsPerPageProp ?? 10, sortBy: null }"
        class="table-content"
        :class="{
          clickable: handleRowClick !== undefined,
          [activeTableTab.value]: true,
          'no-padding': activeTableTab.value === 'newReport' || activeTableTab.value === 'myReport',
          hideHeader: hideHeader
        }"
        @row-click="handleRowClick"
        @virtual-scroll="handleVirtualScroll"
        :virtual-scroll="useVirtualScroll"
      >
        <template v-slot:body-cell-details="props">
          <q-td :props="props">
            <q-btn class="details-btn" :label="$t('shareholder_platform.details')" />
          </q-td>
        </template>
        <template v-slot:body-cell-game_type="props">
          <q-td :props="props">
            {{ $t(gameTypeI18nKeys[(props.row as any).game_type as GAME_TYPE.Enums]) }}
          </q-td>
        </template>
        <template v-slot:body-cell-valid_bet="props">
          <q-td :props="props">
            {{ moneyFormat((props.row as any).valid_bet) }}
          </q-td>
        </template>
        <template v-slot:body-cell-settlement_rate="props">
          <q-td :props="props">
            {{ moneyFormat((props.row as any).settlement_rate) }}
          </q-td>
        </template>
        <template v-slot:body-cell-profit="props">
          <q-td :props="props">
            {{ moneyFormat((props.row as any).profit) }}
          </q-td>
        </template>
      </q-table>
    </template>
    <div v-else class="shareholder-no-data-container">
      <!-- <q-img v-if="getWideLogo" :src="getWideLogo()" lazy-load /> -->
      <span>{{ $t("common.btn.no_update") }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QTableProps } from "quasar"
import { useLogo } from "src/common/composables/useLogo"
import {
  type NewReportTableColumnType,
  type MyReportTableColumnType,
  type MyReportSummaryTableColumnType,
  type MyReportDetailTableColumnType
} from "src/common/composables/useShareholder"
import { useCommon } from "src/common/hooks/useCommon"
import type * as Response from "src/api/response.type"
import { GAME_TYPE } from "src/common/utils/constants"

const { getWideLogo } = useLogo()
const { moneyFormat } = useCommon()

defineProps<{
  rows?: Response.MyReportEvents[] | Response.MyReportSummaryEvents[] | Response.MyReportDetailsEvents[]
  columns?:
    | NewReportTableColumnType[]
    | MyReportSummaryTableColumnType[]
    | MyReportTableColumnType[]
    | MyReportDetailTableColumnType[]
  activeTableTab: any
  handleRowClick?: (evt: Event, row: any, index: number) => void
  handleVirtualScroll?: QTableProps["onVirtualScroll"]
  useVirtualScroll?: boolean
  hideHeader?: boolean
  rowsPerPageProp?: number
}>()

const gameTypeI18nKeys: Record<GAME_TYPE.Enums, string> = {
  [GAME_TYPE.Enums.SLOT]: "shareholder_platform.slots",
  [GAME_TYPE.Enums.LIVECASINO]: "shareholder_platform.live_casino",
  [GAME_TYPE.Enums.SPORTBOOK]: "shareholder_platform.sports",
  [GAME_TYPE.Enums.VIRTUALSPORT]: "shareholder_platform.virtualSport",
  [GAME_TYPE.Enums.LOTTERY]: "shareholder_platform.lottery",
  [GAME_TYPE.Enums.CARDBOARD]: "shareholder_platform.cardboard",
  [GAME_TYPE.Enums.P2P]: "shareholder_platform.p2p",
  [GAME_TYPE.Enums.FISHING]: "shareholder_platform.fishing",
  [GAME_TYPE.Enums.OTHER]: "shareholder_platform.other",
  [GAME_TYPE.Enums.COCKFIGHTING]: "shareholder_platform.cockfighting",
  [GAME_TYPE.Enums.ESPORT]: "shareholder_platform.esport",
  [GAME_TYPE.Enums.POKER]: "shareholder_platform.poker",
  [GAME_TYPE.Enums.CASINO_PREMIUM]: "shareholder_platform.casino_premium"
}
</script>

<style scoped lang="scss">
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/shareholder.scss";
</style>
