<template>
  <div class="referral-table">
    <template v-if="invitationState.list && invitationState.list.length">
      <q-table
        :rows="invitationState.list"
        :columns="invitationTableColumns"
        row-key="name"
        class="referral-table-content"
        hide-bottom
        :pagination="{
          rowsPerPage: invitationState.pagination.size
        }"
      >
        <template #body="props">
          <q-tr>
            <q-td v-for="col in props.cols" :key="col.name" :props="props" class="!py-3">
              <span v-if="col.name === 'member_account' || col.name === 'currency_code'"> {{ col.value }} </span>
              <span
                v-else-if="col.name === 'status'"
                class="commission-status"
                :class="{
                  red: col.value === INVITATION_STATUS.Enums.NOT_ACHIEVED,
                  green: col.value === INVITATION_STATUS.Enums.ACHIEVED
                }"
              >
                {{ $t(INVITATION_STATUS.I18nKeys[col.value as INVITATION_STATUS.Enums]) }}
              </span>
              <span v-else> {{ moneyFormat(col.value, 2) }}</span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="referral-pagination-wrapper">
        <Pagination
          v-model="invitationState.pagination.page"
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
import { useInvitation } from "src/common/composables/useInvitation"
import { INVITATION_STATUS } from "src/common/utils/constants"
import Pagination from "app/template/okbet_green/components/Pagination/Index.vue"

const { moneyFormat } = useCommon()
const { getWideLogo } = useLogo()
const { invitationTableColumns, invitationState, totalPages, handlePagination } = useInvitation()
</script>

<style scoped lang="scss">
@import "app/template/okbet_green/assets/css/referral.scss";
</style>
