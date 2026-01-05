<template>
  <q-form class="invite-wrapper" @submit="submit">
    <div class="search-content">
      <p class="search-content-title">{{ $t("collaboration.search_content") }}</p>
      <div class="search-row">
        <div class="form-item">
          <div class="form-title">{{ $t("collaboration.member_account") }}</div>
          <q-input
            standout
            v-model="invitationState.query.member_account"
            :placeholder="$t('collaboration.account_number')"
            rounded
            outlined
            dense
            borderless
            class="form-input"
            no-error-icon
            hide-bottom-space
          >
          </q-input>
        </div>
        <div class="form-item">
          <div class="form-title required">{{ $t("collaboration.status") }}</div>
          <q-select
            standout
            v-model="invitationState.query.status"
            :options="statusDropDown"
            map-options
            emit-value
            class="form-select"
            rounded
            outlined
            dense
            borderless
            no-error-icon
            hide-bottom-space
          />
        </div>
        <div class="form-item">
          <div class="form-title required">{{ $t("collaboration.currency") }}</div>
          <q-select
            standout
            v-model="invitationState.query.currency_id"
            :options="props.walletDropdown"
            map-options
            emit-value
            class="form-select"
            rounded
            outlined
            dense
            borderless
            no-error-icon
            hide-bottom-space
          />
        </div>
        <q-btn class="hide-hover btn-search" type="submit">{{ $t("common.btn.search") }}</q-btn>
      </div>
    </div>
    <div class="invite-data-content">
      <q-table
        v-if="isDesktop"
        square
        hide-pagination
        row-key="id"
        ref="tableRef"
        :rows="invitationState.list"
        :rows-per-page-options="[invitationState.pagination.size || 10]"
        :columns="invitationTableColumns"
        :loading="isLoading"
        class="custom-table table-transparent"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="red" />
        </template>
        <template #body="props">
          <q-tr>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <span v-if="col.name === 'member_account' || col.name === 'currency_code'"> {{ col.value }} </span>
              <span
                v-else-if="col.name === 'status'"
                class="domain-status"
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
        <template #no-data>
          {{ $t("tableHeader.no_data") }}
        </template>
      </q-table>

      <div v-else class="mobile-list-wrapper">
        <q-list v-if="invitationState.list.length" class="mobile-list">
          <div v-for="(item, index) in invitationState.list" :key="index" class="w-full">
            <div class="mobile-item-top">
              <div class="mobile-item-top-left">{{ item.currency_code }}</div>
            </div>
            <q-expansion-item dense dense-toggle expand-separator class="mobile-item" header-class="mobile-item-header">
              <template v-slot:header>
                <div class="header-item">
                  <div class="header-item-title">{{ $t("collaboration.member_account") }}</div>
                  <div class="header-item-value">
                    {{ item.member_account }}
                  </div>
                </div>
                <div class="header-item">
                  <div class="header-item-title">{{ $t("collaboration.deposit_count") }}</div>
                  <div class="header-item-value">{{ moneyFormat(item.deposit_count) }}</div>
                </div>
              </template>
              <q-list class="mobile-item-body">
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("collaboration.deposit_amount") }}</span>
                  <span class="body-item-value">{{ moneyFormat(item.deposit_amount, 2) }}</span>
                </q-item>
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("collaboration.valid_bet_amount") }}</span>
                  <span class="body-item-value">{{ moneyFormat(item.valid_bet_amount, 2) }}</span>
                </q-item>
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("collaboration.status") }}</span>
                  <div class="body-item-value">
                    <span
                      class="domain-status"
                      :class="{
                        red: item.status === INVITATION_STATUS.Enums.NOT_ACHIEVED,
                        green: item.status === INVITATION_STATUS.Enums.ACHIEVED
                      }"
                    >
                      {{ $t(INVITATION_STATUS.I18nKeys[item.status as INVITATION_STATUS.Enums]) }}
                    </span>
                  </div>
                </q-item>
              </q-list>
            </q-expansion-item>
          </div>
        </q-list>
        <div v-else class="mobile-no-data">{{ $t("tableHeader.no_data") }}</div>
      </div>

      <div v-if="totalPages > 1" class="custom-pagination">
        <q-pagination
          v-model="invitationState.pagination.page"
          :max="totalPages"
          direction-links
          icon-prev="fa-solid fa-caret-left"
          icon-next="fa-solid fa-caret-right"
          active-color="pagination-active"
          @update:model-value="handlePagination"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useInvitation } from "src/common/composables/useInvitation"
import { BaseListType } from "src/api/response.type"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { INVITATION_STATUS } from "src/common/utils/constants"

const props = defineProps({
  walletDropdown: {
    type: Array<BaseListType>,
    required: true,
    default: () => []
  }
})

const {
  isLoading,
  invitationState,
  statusDropDown,
  getInvitationList,
  initInvitationState,
  submit,
  invitationTableColumns,
  totalPages,
  handlePagination
} = useInvitation()
const { moneyFormat } = useCommon()
const { isDesktop } = useMediaQuery()

onMounted(() => {
  initInvitationState()
  getInvitationList()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/table.scss";
@import "app/template/set_r016/assets/css/form.scss";
@import "app/template/set_r016/assets/css/button.scss";

.search-content {
  .search-content-title {
    @include fontStyle(1.25rem);
    color: $neutral01;
  }

  .search-row {
    @apply mt-5 flex flex-nowrap items-end  gap-5;

    @include phone-width {
      flex-wrap: wrap;
    }
    .form-item {
      width: 28.85%;
      max-width: 18.75rem;

      @include phone-width {
        width: 100%;
        max-width: none;
      }
    }

    .btn-search {
      @include fontStyle();
      color: $neutral01;
      background: $gradient01;
      border-radius: 0.625rem;
      padding: 0.625rem;
      min-width: 5rem;
      height: 2.5rem;

      @include phone-width {
        width: 100%;
      }
    }
  }
}
</style>
