<template>
  <div class="mobile-invite-list">
    <div class="list-wrapper" v-if="invitationState.list && invitationState.list.length">
      <q-card class="list-item" v-for="(item, index) in invitationState.list" :key="index">
        <q-card-section class="list-item-section">
          <q-expansion-item class="expansion-wrapper">
            <template v-slot:header>
              <q-item-section class="expansion-info">
                <q-item-label class="expansion-info-title">{{ $t("collaboration.member_account") }}</q-item-label>
                <q-item-label class="expansion-info-value">{{ item.member_account }}</q-item-label>
              </q-item-section>

              <q-item-section class="expansion-info">
                <q-item-label class="expansion-info-title">{{ $t("collaboration.deposit_count") }}</q-item-label>
                <q-item-label class="expansion-info-value">{{ moneyFormat(item.deposit_count) }}</q-item-label>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section class="revenue-wrapper">
                <div class="revenue-item">
                  <span>{{ $t("collaboration.deposit_amount") }}</span>
                  <span>{{ moneyFormat(item.deposit_amount, 2) }}</span>
                </div>
                <div class="revenue-item">
                  <span>{{ $t("collaboration.valid_bet_amount") }}</span>
                  <span>{{ moneyFormat(item.valid_bet_amount, 2) }}</span>
                </div>
                <div class="revenue-item">
                  <span>{{ $t("collaboration.status") }}</span>
                  <span
                    class="revenue-status"
                    :class="{
                      red: item.status === INVITATION_STATUS.Enums.NOT_ACHIEVED,
                      green: item.status === INVITATION_STATUS.Enums.ACHIEVED
                    }"
                  >
                    {{ $t(INVITATION_STATUS.I18nKeys[item.status as INVITATION_STATUS.Enums]) }}
                  </span>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>
      <div class="referral-pagination-wrapper">
        <Pagination
          v-model="invitationState.pagination.page"
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
import { useInvitation } from "src/common/composables/useInvitation"
import { INVITATION_STATUS } from "src/common/utils/constants"
import Pagination from "app/template/bmm_set_obtd/components/Pagination/Index.vue"

const { getWideLogo } = useLogo()
const { moneyFormat } = useCommon()
const { invitationState, totalPages, handlePagination } = useInvitation()
</script>

<style scoped lang="scss">
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/referral.scss";
</style>
