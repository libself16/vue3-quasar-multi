<template>
  <div class="referral-table" v-if="!isMobile">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="name"
      class="referral-table-content"
      hide-bottom
      :pagination="{
        rowsPerPage: referralPagination.size,
        sortBy: null
      }"
    >
      <template #no-data>
        <div class="no-data-container">
          <img v-if="getWideLogo" :src="getWideLogo()" />
          <span>{{ $t("tableHeader.no_data") }}</span>
        </div>
      </template>
      <template #body-cell-settings="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            class="table-setting-btn"
            @click.stop="handleSettingClick(props.row.account, props.row.member_id)"
          >
            {{ t("menu.settings") }}
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <div class="referral-pagination-wrapper">
      <Pagination
        v-model="currentPage"
        :total-pages="totalPages"
        :max-pages="totalPages"
        @update:model-value="(page: number) => handlePagination(page, 'setting')"
      />
    </div>
  </div>
  <div class="m-referral-table" v-else>
    <q-list>
      <q-expansion-item v-for="(rowData, index) in rows" :key="index" dense dense-toggle expand-separator>
        <template v-slot:header>
          <q-item-section class="expansion-header af-ref-col">
            <div>
              <span
                >{{ $t("menu.userAccount") }}
                <span class="re-col-user">{{ rowData.account }}</span>
              </span>
            </div>
            <div>
              <span
                >{{ $t("menu.directMemberCount") }}
                <span class="re-col-user">{{ rowData.direct_member_count }}</span>
              </span>
            </div>
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <div class="table-ref">
              <table>
                <tbody>
                  <tr v-for="currencyItem in currencyColumns" :key="currencyItem.id">
                    <td>
                      <div class="ref-tbl-in">{{ currencyItem.label }}</div>
                    </td>
                    <td>{{ `${rowData.settings.currency_limit[currencyItem.id]}%` }}</td>
                  </tr>
                  <tr>
                    <td><div class="ref-tbl-in">設定</div></td>
                    <td>
                      <i class="fas fa-cog" @click.stop="handleSettingClick(rowData.account, rowData.member_id)"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
  <q-dialog persistent v-model="openSettingDialog" class="table-setting-dialog">
    <q-card class="dialog-card">
      <q-card-section>
        <div class="dialog-title-wrapper">
          <div class="title-text">{{ dialogAccount }}</div>
          <div class="title-icon cursor-pointer" @click="handleClose">
            <q-icon name="close" />
          </div>
        </div>
      </q-card-section>
      <q-card-section v-if="combinedCurrencyData.length" class="rate-input-section">
        <form>
          <div class="ref-form-group">
            <div class="referral-row">
              <div class="table">
                <div class="table-header-row">
                  <div class="table-header" v-for="item in combinedCurrencyData" :key="item.id">
                    {{ item.code }}
                    <span>({{ t("menu.upperLimit") }}:{{ item.upperLimit }}%)</span>
                  </div>
                </div>
                <div class="table-body-row">
                  <div class="table-cell" v-for="item in combinedCurrencyData" :key="item.id">
                    <div class="ref-td">
                      <input
                        v-model="editingRateData.currency_limit[item.id]"
                        class="ref-input"
                        placeholder="0"
                        :disabled="originRateData.currency_limit[item.id] > 0"
                      />
                      %
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </q-card-section>
      <div v-else class="p-[.625rem]">{{ $t("menu.pleaseContactYourSuperior") }}</div>
      <q-card-actions align="center">
        <div class="btn-wrapper">
          <q-btn class="cancel-btn" :label="$t('common.btn.cancel')" v-close-popup />
          <q-btn class="confirm-btn" @click="handleConfirm" :label="$t('common.btn.confirm')" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"
import Pagination from "app/template/set33_RED/components/Pagination/Index.vue"
import { useQuasar } from "quasar"
import * as Response from "src/api/response.type"
import { useBank } from "src/common/composables/useBank"
import { useLogo } from "src/common/composables/useLogo"
import { useReferral } from "src/common/composables/useReferral"
import { useAuth } from "src/common/hooks/useAuth"
import { computed, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

const { width } = useWindowSize()
const $q = useQuasar()
const { t } = useI18n()
const {
  fetchReferralSetting,
  referralSettingData,
  upperReferralSettingDetailData,
  fetchReferralSettingDetail,
  referralSettingDetailData,
  updateReferralSetting,
  referralPagination,
  handlePagination
} = useReferral()
const { currencyIdMap, getAvailCurrencyList } = useBank()
const { getWideLogo } = useLogo()
const currentPage = ref(0)
const { auth } = useAuth()
let isMobile = ref(false)

const rows = computed(() => referralSettingData.value?.list ?? [])
const openSettingDialog = ref(false)
const dialogAccount = ref("")
const dialogMemberId = ref(0)
const originRateData = ref<Response.ReferralSettingDetail>({
  currency_limit: {},
  is_limit_configured: false
})
const editingRateData = ref<Response.ReferralSettingDetail>({
  currency_limit: {},
  is_limit_configured: false
})
const totalPages = computed(() => {
  const total = referralSettingData.value?.total ?? 0
  return Math.max(1, Math.ceil(total / referralPagination.size))
})

// 抓不重複的幣別 id
const currencyColumns = computed(() => {
  const currencyIds = new Set<string>()
  rows.value.forEach((row) => {
    Object.keys(row.settings.currency_limit).forEach((id) => {
      currencyIds.add(id)
    })
  })
  return Array.from(currencyIds).map((id) => {
    const numId = Number(id)
    const currencyCode = currencyIdMap.value?.[numId]?.code ?? id

    return {
      id,
      name: `currency_${id}`,
      field: (row: any) => row.settings.currency_limit[id] || "-",
      format: (val: any, row: any) => {
        const value = row.settings.currency_limit[id]
        if (!value && value !== 0) return "-"
        return `${value}%`
      },
      label: currencyCode,
      align: "center" as const
    }
  })
})

const combinedCurrencyData = computed(() => {
  const allCurrencyIds = new Set([
    ...Object.keys(upperReferralSettingDetailData.value?.currency_limit || {}),
    ...Object.keys(editingRateData.value.currency_limit || {})
  ])

  const sortedCurrencyIds = Array.from(allCurrencyIds).sort((a, b) => Number(a) - Number(b))

  return sortedCurrencyIds.map((currencyId) => ({
    id: currencyId,
    code: currencyIdMap.value?.[Number(currencyId)]?.code,
    upperLimit: upperReferralSettingDetailData.value?.currency_limit[currencyId],
    currentLimit: editingRateData.value.currency_limit[currencyId] || 0
  }))
})

// 合併靜態與動態表格
const columns = computed(() => {
  const baseColumns = [
    {
      name: "account",
      field: "account",
      label: t("menu.userAccount"),
      align: "center" as const
    },
    {
      name: "direct_member_count",
      field: "direct_member_count",
      align: "center" as const,
      label: t("menu.directMemberCount")
    }
  ]

  const settingColumn = {
    name: "settings",
    field: "settings",
    align: "center" as const,
    label: t("menu.settings"),
    format: () => t("menu.settings"),
    classes: "table-setting-btn"
  }

  return [...baseColumns, ...currencyColumns.value, settingColumn]
})

const handleSettingClick = async (account: string, memberId: number) => {
  await fetchReferralSettingDetail(auth.value.user_id as number, true)
  await fetchReferralSettingDetail(memberId)
  openSettingDialog.value = true
  dialogAccount.value = account
  dialogMemberId.value = memberId
  editingRateData.value = JSON.parse(JSON.stringify(referralSettingDetailData.value))
  originRateData.value = JSON.parse(JSON.stringify(referralSettingDetailData.value))
}

const rateTips = computed(() => {
  return t("menu.commissionRate", { number: `<span class="text-rate-number">40</span>` })
})

const handleClose = () => {
  openSettingDialog.value = false
}

const handleConfirm = async () => {
  if (!combinedCurrencyData.value.length) {
    openSettingDialog.value = false
    return
  }

  const parsedData = Object.fromEntries(
    Object.entries(editingRateData.value.currency_limit).map(([key, value]) => [key, Number(value)])
  )

  const result = await updateReferralSetting({
    member_id: dialogMemberId.value,
    currency_limit: parsedData
  })
  if (result) {
    openSettingDialog.value = false
    await fetchReferralSetting()
    $q.notify({
      message: t("common.alarm.editSuccess"),
      color: "green"
    })
  }
}

onMounted(async () => {
  $q.loading.show()
  await fetchReferralSetting()
  await getAvailCurrencyList()
  $q.loading.hide()
})

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set33_RED/assets/css/_variable.sass";
@import "app/template/set33_RED/assets/css/referral.scss";

.dialog-card {
  @apply p-3;

  .dialog-title-wrapper {
    @apply flex justify-between items-center text-[24px];
    @apply font-bold;

    .title-text {
      @apply flex w-full justify-center items-center;
    }
  }

  ::v-deep(.q-card__section--vert) {
    &:nth-child(1) {
      padding: 10px;
      border-bottom: 1px solid $border-red01;
    }
    &:nth-child(2) {
      padding: 0px;
    }
  }

  .btn-wrapper {
    @apply flex justify-center items-center gap-[43px];
    width: 100%;

    .confirm-btn {
      @apply text-[1rem] h-[15px] w-[10rem];
      border-radius: 2.875rem;
      background: $btn-register;
      color: $black01;

      @include phone-width {
        width: 50%;
      }
    }

    .cancel-btn {
      @apply text-[1rem] h-[15px] w-[10rem];
      border-radius: 2.875rem;
      background: $bg-gradient-green01;
      color: $black01;

      @include phone-width {
        width: 50%;
      }
    }
  }

  .rate-input-item {
    @apply flex items-center mb-[2rem];

    .rate-input-label {
      @apply w-1/2 flex justify-end pr-[2.1875rem];
      @apply text-base font-bold;
    }

    .rate-input {
      @apply w-[7.5rem];
    }
  }
}

.table-setting-dialog {
  .q-card {
    @apply h-auto;
    max-width: 75rem;
    border-radius: 12px;
    border: 1px solid $primary-red02;
    background: $primary-red01;
    color: #fff;

    @include phone-width {
      @apply w-[90%];
    }

    @include iphone-width {
      @apply w-full;
    }
  }
}

.ref-form-group {
  margin: 15px 8px;
  border: 1px solid $border-red01;
  background: $primary-red01;
  border-collapse: collapse;
  border-radius: 8px 8px 0px 0px;
  overflow: hidden;
  .referral-row {
    margin: 15px;
    border-collapse: collapse;
    border-radius: 8px 8px 0px 0px;
    overflow: hidden;
  }
  .table-cell {
    border: 1px solid $border-red01;
    border-left: none;
    color: #fff;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 0 5px;
  }
  .table-header {
    @apply flex font-bold justify-center items-center;
    @apply text-[.875rem];
    background: $bg-gradient-red01;
    color: #fff;
    padding: 0px 5px;
    height: 48px;
    text-align: center;
    flex: 1;
    border-right: 1px solid $border-red01;

    @include phone-width {
      line-height: 3rem;
    }

    @include iphone-width {
      line-height: 2.5rem;
    }
  }

  .table-header-row,
  .table-body-row {
    display: flex;
    width: 100%;
    border-left: 1px solid $border-red01;
  }

  @include phone-width {
    .table-header-row {
      flex-direction: column;
    }
    .table-body-row {
      flex-direction: column;
    }
    .table {
      display: flex;
      flex-direction: row;
    }
  }

  .ref-td {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 20px;
    input.ref-input {
      width: 100%;
      border: 1px solid #000;
      color: #000;
      margin-right: 10px;
      border-radius: 5px;
      text-align: center;
      height: 26px;
      font-size: 12px;
      &[disabled] {
        color: #fff;
        opacity: 1 !important;
      }
    }
  }
  .referral-row .table {
    margin: 0px;
    overflow: hidden;
  }
  .ref-bth {
    padding: 0px 15px;
    padding-bottom: 20px;
    justify-content: center;
  }
  .ref-bth button {
    font-size: 12px;
  }
}
</style>
