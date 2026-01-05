<template>
  <div class="mobile-invite-list">
    <div class="list-wrapper" v-if="rebateState.list && rebateState.list.length">
      <q-card class="list-item" v-for="(item, index) in rebateState.list" :key="index">
        <q-card-section class="list-item-section">
          <q-expansion-item class="expansion-wrapper">
            <template v-slot:header>
              <q-item-section class="expansion-info">
                <q-item-label class="expansion-info-title">{{ $t("collaboration.settlement_time") }}</q-item-label>
                <q-item-label class="expansion-info-value">
                  {{ dateformat(item.settled_time, "YYYY/MM/DD HH:mm:ss") }}</q-item-label
                >
              </q-item-section>

              <q-item-section class="expansion-info">
                <q-item-label class="expansion-info-title">{{
                  $t("collaboration.achieved_active_member_count")
                }}</q-item-label>
                <q-item-label class="expansion-info-value">{{ moneyFormat(item.active_member_count, 2) }}</q-item-label>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section class="revenue-wrapper">
                <div class="revenue-item">
                  <span>{{ $t("collaboration.achieved_valid_bet_amount") }}</span>
                  <span>{{ moneyFormat(item.valid_bet_amount, 2) }}</span>
                </div>
                <div class="revenue-item">
                  <span>{{ $t("collaboration.commission_level") }}</span>
                  <span>LV.{{ item.level }}</span>
                </div>
                <div class="revenue-item">
                  <span>{{ $t("collaboration.commission_amount") }}</span>
                  <span>{{ moneyFormat(item.rebate_amount, 2) }}</span>
                </div>
                <!-- <div class="revenue-item">
                  <span>{{ $t("collaboration.status") }}</span>
                  <span
                    class="revenue-status"
                    :class="{
                      green: item.status === REBATE_STATUS.Enums.COLLECTED,
                      orange: item.status === REBATE_STATUS.Enums.NOT_COLLECTED,
                      red: item.status === REBATE_STATUS.Enums.REJECTED
                    }"
                  >
                    {{ $t(REBATE_STATUS.I18nKeys[item.status as REBATE_STATUS.Enums]) }}
                  </span>
                </div> -->
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>
      <div class="referral-pagination-wrapper">
        <Pagination
          v-model="rebateState.pagination.page"
          :total-pages="totalPages"
          :max-pages="3"
          @update:model-value="handlePagination"
        />
      </div>
    </div>
    <div v-else class="referral-no-data-container">
      <q-img v-if="getWideLogo" :src="getWideLogo()" lazy-load />
      <span>{{ $t("tableHeader.no_data") }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommon } from "src/common/hooks/useCommon"
import { useLogo } from "src/common/composables/useLogo"
import { useRebate } from "src/common/composables/useRebate"
import { dateformat } from "src/common/utils/dayjsUtils"
import { REBATE_STATUS } from "src/common/utils/constants"
import Pagination from "app/template/okbet_redBlack/components/Pagination/Index.vue"

const { getWideLogo } = useLogo()
const { moneyFormat } = useCommon()
const { rebateState, totalPages, handlePagination } = useRebate()
</script>

<style scoped lang="scss">
@import "app/template/okbet_redBlack/assets/css/_variable.sass";
@import "app/template/okbet_redBlack/assets/css/referral.scss";
</style>
