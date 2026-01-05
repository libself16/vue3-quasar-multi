<template>
  <section class="mobile-setting-list">
    <div class="list-wrapper" v-if="referralSettingData?.list?.length">
      <q-card class="list-item" v-for="(item, index) in referralSettingData.list" :key="index">
        <q-card-section class="list-item-section">
          <div class="account-info">
            <span>{{ $t("menu.userAccount") }}</span>
            <span class="info-text">{{ item.account }}</span>
          </div>
          <div class="down-line-info">
            <span>{{ $t("menu.directMemberCount") }}</span>
            <span class="info-text">{{ item.direct_member_count }}</span>
          </div>
          <div class="setting-icon" @click="handleSettingClick(item.account, item.member_id)">
            <q-img :src="referralEditIcon" lazy-load />
          </div>
        </q-card-section>
      </q-card>
      <div class="referral-pagination-wrapper">
        <Pagination
          v-model="currentPage"
          :total-pages="totalPages"
          :max-pages="3"
          @update:model-value="(page: number) => handlePagination(page, 'setting', undefined, 20)"
        />
      </div>
    </div>
    <div v-else class="referral-no-data-container">
      <q-img v-if="getWideLogo" :src="getWideLogo()" lazy-load />
      <span>{{ $t("tableHeader.no_data") }}</span>
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
          <div v-for="item in combinedCurrencyData" :key="item.id" class="rate-input-item">
            <div class="rate-info">
              <p class="rate-input-label">
                <span>{{ item.code }} ({{ t("menu.upperLimit") }}:</span>
                <span class="rate-input-label-text">{{ item.upperLimit }}</span
                >%)
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
        <q-card-section v-else class="rate-input-section"> {{ $t("menu.pleaseContactYourSuperior") }}</q-card-section>
        <q-card-actions align="center">
          <div class="btn-wrapper">
            <q-btn class="cancel-btn" :label="$t('common.btn.cancel')" v-close-popup />
            <q-btn class="confirm-btn" @click="handleConfirm" :label="$t('common.btn.confirm')" />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useQuasar } from "quasar"
import { useReferral } from "src/common/composables/useReferral"
import { useBank } from "src/common/composables/useBank"
import { useLogo } from "src/common/composables/useLogo"
import { useI18n } from "vue-i18n"
import { useAuth } from "src/common/hooks/useAuth"
import Pagination from "app/template/okbet_red/components/Pagination/Index.vue"
import { useSiteImg } from "app/template/okbet_red/hooks/useSiteImg"
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
const { referralEditIcon } = useSiteImg()

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
  await handlePagination(currentPage.value, "setting", undefined, 20)
  await getAvailCurrencyList()
})
</script>

<style scoped lang="scss">
@import "app/template/okbet_red/assets/css/_variable.sass";
@import "app/template/okbet_red/assets/css/referral.scss";

.mobile-setting-list {
  @apply my-4 pb-14;

  .list-item {
    @apply mb-4;
    border: 1px solid $primary-color;
  }

  .list-item-section {
    @apply flex items-center;

    .account-info,
    .down-line-info {
      @apply flex flex-col w-5/12;
    }

    .info-text {
      color: rgba($text-dark-gray-color, 0.4);
    }

    .setting-icon {
      @apply w-2/12;

      :deep(.q-img__container) {
        @apply flex justify-center items-center;
      }

      :deep(img) {
        @apply w-[1.5rem] h-[1.5rem];
      }
    }
  }
}

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
      @apply text-[1.25rem] h-[43px] w-[9rem] capitalize rounded-[1.5rem];
      background: $primary-color;
      color: $text-light-color;
    }

    .cancel-btn {
      background: $secondary-color;
    }
  }

  .rate-input-item {
    @apply flex justify-evenly items-center mb-[2rem];

    .rate-input-label {
      @apply flex justify-end pr-1;
      @apply text-base font-bold;

      .rate-input-label-text {
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
