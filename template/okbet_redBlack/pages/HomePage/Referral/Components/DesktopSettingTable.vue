<template>
  <div class="referral-table">
    <template v-if="rows && rows.length > 0">
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
          :max-pages="3"
          @update:model-value="(page: number) => handlePagination(page, 'setting')"
        />
      </div>
    </template>
    <template v-else>
      <div class="referral-no-data-container">
        <q-img v-if="getWideLogo" :src="getWideLogo()" lazy-load />
        <span>{{ $t("tableHeader.no_data") }}</span>
      </div>
    </template>
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
          <div v-for="item in combinedCurrencyData" :key="item.id" class="rate-input-item">
            <div class="rate-info">
              <p class="rate-input-label">
                {{ item.code }} ({{ t("menu.upperLimit") }}:<span>{{ item.upperLimit }}%</span>)
              </p>
            </div>
            <q-input
              standout
              class="rate-input"
              v-model="editingRateData.currency_limit[item.id]"
              :rules="[(val) => !item.upperLimit || Number(val) <= item.upperLimit || t('menu.cannotExceedUpperLimit')]"
              :disable="originRateData.currency_limit[item.id] > 0"
            >
              <template v-slot:append>
                <span>%</span>
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-section v-else class="rate-input-section"> {{ $t("menu.pleaseContactYourSuperior") }} </q-card-section>
        <q-card-actions align="center">
          <div class="btn-wrapper">
            <q-btn class="cancel-btn" :label="$t('common.btn.cancel')" v-close-popup />
            <q-btn class="confirm-btn" @click="handleConfirm" :label="$t('common.btn.confirm')" />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useQuasar } from "quasar"
import { useReferral } from "src/common/composables/useReferral"
import { useBank } from "src/common/composables/useBank"
import { useLogo } from "src/common/composables/useLogo"
import { useI18n } from "vue-i18n"
import { useAuth } from "src/common/hooks/useAuth"
import Pagination from "app/template/okbet_redBlack/components/Pagination/Index.vue"
import * as Response from "src/api/response.type"

const $q = useQuasar()
const { t } = useI18n()
const {
  fetchReferralSetting,
  referralSettingData,
  fetchReferralSettingDetail,
  upperReferralSettingDetailData,
  referralSettingDetailData,
  updateReferralSetting,
  referralPagination,
  handlePagination
} = useReferral()
const { currencyIdMap, getAvailCurrencyList } = useBank()
const { getWideLogo } = useLogo()
const currentPage = ref(1)
const { auth } = useAuth()

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
  $q.loading.show()
  await fetchReferralSettingDetail(auth.value.user_id as number, true)
  await fetchReferralSettingDetail(memberId)
  openSettingDialog.value = true
  dialogAccount.value = account
  dialogMemberId.value = memberId
  editingRateData.value = JSON.parse(JSON.stringify(referralSettingDetailData.value))
  originRateData.value = JSON.parse(JSON.stringify(referralSettingDetailData.value))
  $q.loading.hide()
}

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
      color: "green",
      position: "top"
    })
  }
}

onMounted(async () => {
  $q.loading.show()
  await fetchReferralSetting()
  await getAvailCurrencyList()
  $q.loading.hide()
})
</script>

<style scoped lang="scss">
@import "app/template/okbet_redBlack/assets/css/referral.scss";

.dialog-card {
  @apply p-3;

  .dialog-title-wrapper {
    @apply flex justify-between items-center text-[24px];
    @apply font-bold;
  }

  .btn-wrapper {
    @apply flex justify-center items-center gap-[43px];

    .cancel-btn,
    .confirm-btn {
      @apply text-[1.25rem] h-[43px] w-[10.5rem] capitalize rounded-[1.5rem];
      background: $primary-color;
      color: $text-light-color;
    }

    .cancel-btn {
      background: $primary-red02;
    }
  }

  .rate-input-item {
    @apply flex justify-evenly items-center mb-[2rem];

    .rate-input-label {
      @apply flex justify-end pr-[2.1875rem];
      @apply text-base font-bold;

      span {
        @apply ml-1;
        color: $text-danger-color;
      }
    }

    .rate-input {
      @apply w-[7.5rem];
    }

    :deep(.q-field--with-bottom) {
      padding-bottom: 0;
    }
  }
}
</style>

<style lang="scss">
.table-setting-dialog {
  .q-card {
    @apply w-[600px] h-auto;
  }
}
</style>
