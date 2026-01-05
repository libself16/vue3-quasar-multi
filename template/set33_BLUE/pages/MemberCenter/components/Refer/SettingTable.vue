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
            {{ t("menu.setting") }}
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
        <!-- <div class="rate-tips" v-html="rateTips"></div> -->
      </q-card-section>
      <q-card-section v-if="combinedCurrencyData.length" class="rate-input-section">
        <form>
          <div class="ref-form-group">
            <!-- <div class="re-ttl" v-html="rateTips"></div> -->
            <div class="referral-row">
              <table class="table">
                <tr>
                  <th v-for="item in combinedCurrencyData" :key="item.id">
                    {{ item.code }}
                    <span>({{ t("menu.upperLimit") }}:{{ item.upperLimit }}%)</span>
                  </th>
                </tr>
                <tr>
                  <td v-for="item in combinedCurrencyData" :key="item.id">
                    <div class="ref-td">
                      <input
                        v-model="editingRateData.currency_limit[item.id]"
                        class="ref-input"
                        placeholder="0"
                        :disabled="originRateData.currency_limit[item.id] > 0"
                      />
                      %
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </form>
        <!-- <div v-for="(rate, key) in editingRateData.currency_limit" :key="key" class="rate-input-item">
          <span class="rate-input-label">{{ currencyIdMap?.[Number(key)]?.code }}</span>
          <q-input standout class="rate-input" v-model="editingRateData.currency_limit[key]">
            <template v-slot:append>
              <span>%</span>
            </template>
          </q-input>
        </div> -->
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
import Pagination from "app/template/set33_BLUE/components/Pagination/Index.vue"
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
    label: t("menu.setting"),
    format: () => t("menu.setting"),
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

<style scoped lang="scss">
@import "app/template/set33_BLUE/assets/css/referral.scss";
@import "src/common/css/_variable.sass";

.dialog-card {
  @apply p-3;

  .dialog-title-wrapper {
    @apply flex justify-between items-center text-[24px];
    @apply font-bold;
  }

  ::v-deep(.q-card__section--vert) {
    &:nth-child(1) {
      padding: 10px;
      border-bottom: 1px solid #47b83d;
    }
    &:nth-child(2) {
      padding: 0px;
    }
  }

  .rate-tips {
    @apply mt-[1.75rem];

    :deep(.text-rate-number) {
      @apply text-[#025BE8] font-bold;
    }
  }

  .btn-wrapper {
    @apply flex justify-center items-center gap-[43px];
    width: 100%;

    .confirm-btn {
      color: #000;
      border-radius: 46px;
      background: linear-gradient(180deg, #08eb99 0%, #02ab6e 100%);
      box-shadow: 0px 2px 5.8px 0px rgba(179, 255, 227, 0.8) inset, 0px 4px 4px 0px rgba(0, 0, 0, 0.2),
        0px 4px 0px 0px #65c9a6, 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
      @apply text-[1rem] h-[15px] w-[10rem];
      @include iphone-width {
        width: 50%;
      }
    }

    .cancel-btn {
      color: #000;
      border-radius: 46px;
      background: linear-gradient(180deg, #eddd8d 0%, #d0b45d 100%);
      box-shadow: 0px 2px 5.8px 0px rgba(255, 255, 255, 0.8) inset, 0px 4px 4px 0px rgba(0, 0, 0, 0.14),
        0px 4px 0px 0px #a99a6b, 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
      @apply text-[1rem] h-[15px] w-[10rem];
      @include iphone-width {
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
</style>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
.table-setting-dialog {
  .q-card {
    @apply w-[600px] h-auto;
    border-radius: 12px;
    border: 1px solid #47b83d;
    background: #082f1a;
    color: #fff;
  }
}

.ref-form-group {
  margin: 15px 8px;
  border: 1px solid #47b83d;
  background: #082f1a;
  border-collapse: collapse;
  border-radius: 8px 8px 0px 0px;
  overflow: hidden;
  .re-ttl {
    padding: 10px 20px;
    border-bottom: 1px solid #47b83d;
    background: linear-gradient(180deg, #00794e 0%, #023d27 100%);
    color: #fff;
  }
  .referral-row {
    margin: 15px;
    border-collapse: collapse;
    border-radius: 8px 8px 0px 0px;
    overflow: hidden;
  }
  .referral-row tr td {
    border: 1px solid #47b83d;
    color: #fff;
    height: 48px;
    line-height: 48px;
    padding: 0px 35%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .referral-row tr th {
    border-bottom: 1px solid #47b83d;
    background: linear-gradient(180deg, #00794e 0%, #023d27 100%);
    color: #fff;
    padding: 0px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-weight: 100;
    display: flex;
    justify-content: center;
    gap: 0.25rem;
    @include iphone-width {
      flex-direction: column;
      line-height: 1.25rem;
      gap: 0;
    }
  }
  .ref-td {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 76px;
    height: 20px;
    input.ref-input {
      width: 75px;
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
    display: flex;
    flex-direction: row;
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

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    width: 50%;
    height: 100%;
  }

  td {
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50% !important;
    text-align: left !important;
  }

  td:before {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    font-weight: bold;
  }
}
</style>
