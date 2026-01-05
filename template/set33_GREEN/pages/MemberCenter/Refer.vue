<template>
  <div>
    <div class="af-af-content">
      <div class="af-ref">
        <div class="af-af-content-all af-af-content-1">
          <div class="af-ref-top">
            <div class="">返佣统计</div>
            <div class="af-ref-sel">
              <q-btn-dropdown :label="selectedLabel" menu-anchor="bottom middle" menu-self="bottom middle">
                <q-list>
                  <q-item
                    v-for="item in walletDropdown"
                    :key="item.value"
                    clickable
                    v-close-popup
                    @click="changeCurrency(item)"
                  >
                    <q-item-section>
                      <q-item-label>{{ item.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
          <div class="af-ref-item">
            <ul>
              <li class="af-ref-blue">
                <span class="af-rel-top">
                  {{ $t("menu.players") }}
                </span>
                <span class="af-rel-bot">
                  {{ referralSummaryData?.member_count }}
                </span>
              </li>
              <li class="af-ref-gre">
                <span class="af-rel-top">
                  {{ $t("menu.validBet") }}
                </span>
                <span class="af-rel-bot">
                  {{ referralSummaryData?.total_valid_betted_amount }}
                </span>
              </li>
              <li class="af-ref-gre">
                <span class="af-rel-top">
                  {{ $t("menu.winLoss") }}
                </span>
                <span class="af-rel-bot">
                  {{ referralSummaryData?.total_profit }}
                </span>
              </li>
            </ul>
            <p>自上期結算後累計至目前，資料每10分鐘更新一次</p>
          </div>
        </div>
        <div class="af-af-content-all af-af-content-2">
          <div class="af-ref-ttl">推薦代碼</div>
          <div class="af-ref-item">
            <div class="af-ref-inp">
              <div class="af-ref-nm">{{ referralInfoData?.code }}</div>
              <button class="af-ref-cpy"><i class="far fa-copy" @click="copyReferralCode"></i></button>
            </div>
          </div>
          <button class="af-ref-link" @click="copyReferralUrl">Copy Link</button>
        </div>
      </div>
    </div>
    <!-- pc table -->
    <div class="af-ref-wrap-all">
      <q-card>
        <q-tabs
          v-model="activeTab"
          dense
          class="af-ref-wrap"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="setting" :label="$t('menu.referralSetting')" />
          <q-tab name="details" :label="$t('menu.referralDetails')" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="setting" class="q-pa-none">
            <SettingTable />
          </q-tab-panel>

          <q-tab-panel name="details">
            <template v-if="showingSubDetails">
              <SubDetailsTable @back="(status) => (showingSubDetails = status)" :statement-id="selectedStatementId" />
            </template>
            <template v-else>
              <DetailsTable @show-sub-details="handleShowSubDetails" />
            </template>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import { useSiteImg } from "app/template/set33_GREEN/hooks/useSiteImg"
import { useQuasar } from "quasar"
import { usePendingOrder } from "src/common/composables/usePendingOrder"
import { useReferral } from "src/common/composables/useReferral"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useRule } from "src/common/hooks/useRule"
import { WALLET_TYPE } from "src/common/utils/constants"
import { computed, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import DetailsTable from "./components/Refer/DetailsTable.vue"
import SettingTable from "./components/Refer/SettingTable.vue"
import SubDetailsTable from "./components/Refer/SubDetailsTable.vue"

const $q = useQuasar()
const Rules = useRule()
const { moneyFormat } = useCommon()
const { width } = useWindowSize()
let isMobile = ref(false)
const { pendingImg } = useSiteImg()

const {
  isLoading,
  pendingTableColumns,
  pendingOrderState,
  initPendingOrderQuery,
  getPendingOrderList,
  handlePagination,
  handleTableRequest,
  getPaymentTypeName,
  currencyName,
  currencyHeader,
  searchTabs,
  dayTypeTabs,
  handleFormSubmit
} = usePendingOrder()
const { fetchReferralInfo, referralInfoData, fetchReferralSummary, referralSummaryData } = useReferral()
const { userWalletMap, getWalletLabel, getUserWalletList } = useUserInfo()

type WalletDropItem = {
  label: string
  value: string
}

const walletDropdown = computed<WalletDropItem[]>(() => {
  return Object.keys(userWalletMap.value).map((e) => {
    const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
    const label = `${getWalletLabel(cashWallet)}`
    const value = String(cashWallet.currency_id)
    return { label, value }
  })
})

const { t } = useI18n()
const tableRef = ref()
const activeCurrencyId = ref("")
const tabState = ref("setting")
const showingSubDetails = ref(false)
const selectedStatementId = ref<number>(0)

const activeTab = computed({
  get: () => tabState.value,
  set: (val) => {
    tabState.value = val
    if (val === "setting") {
      showingSubDetails.value = false
      selectedStatementId.value = 0
    }
  }
})

const selectedItem = ref<WalletDropItem | null>(null)
const selectedLabel = computed(() => {
  return selectedItem.value?.label || walletDropdown.value[0]?.label || "Dropdown Button"
})

const changeCurrency = async (item: WalletDropItem) => {
  selectedItem.value = item
  activeCurrencyId.value = item.value
  await fetchReferralSummary(item.value)
}

const copyReferralCode = () => {
  navigator.clipboard.writeText(referralInfoData.value?.code || "")
  $q.notify({
    message: t("common.alarm.copySuccess"),
    color: "green",
    position: "top"
  })
}

const copyReferralUrl = () => {
  navigator.clipboard.writeText(referralInfoData.value?.url || "")
  $q.notify({
    message: t("common.alarm.copySuccess"),
    color: "green",
    position: "top"
  })
}

const handleShowSubDetails = (statementId: number) => {
  selectedStatementId.value = statementId
  showingSubDetails.value = true
}

onMounted(async () => {
  $q.loading.show()
  await getUserWalletList()
  await fetchReferralInfo()
  if (walletDropdown.value.length > 0) {
    selectedItem.value = walletDropdown.value[0]
    activeCurrencyId.value = walletDropdown.value[0].value
    await fetchReferralSummary(walletDropdown.value[0].value)
  }
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

<style scoped lang="sass">
@import 'src/common/css/_variable.sass'
@import 'src/common/css/loading.sass'
@import 'app/template/set33_GREEN/assets/css/table.sass'
@import 'app/template/set33_GREEN/assets/css/menu.sass'
@import 'app/template/set33_GREEN/assets/css/pagination.sass'

.af-ref
  display: flex
  gap: 15px
  +phone-width
    flex-direction: column
.af-af-content
  margin-bottom: 2rem
  padding: 0 1rem
.af-af-content-all
  color: #fff
  display: flex
  margin-top: 8px
  width: 100%
  background: rgb(8, 47, 26)
  border-radius: 8px
  border: 1px solid rgb(71, 184, 61)
  flex-direction: column
  &.af-af-content-1
    width: 60%
    +phone-width
      width: 100%
  &.af-af-content-2
    width: 40%
    +phone-width
      width: 100%
.af-ref-top
  display: flex
  justify-content: space-between
  align-items: center
  border-bottom: 1px solid rgb(71, 184, 61)
  padding: 10px 15px
  .af-ref-sel
    .q-btn
      border: 1px solid rgb(71, 184, 61)
.af-ref-ttl
  padding: 15px 15px
  border-bottom: 1px solid rgb(71, 184, 61)
  font-size: 16px
  font-weight: bold
.af-ref-item
  padding: 15px 15px 0px 15px
  .af-ref-inp
    margin: 0px auto
    background: #fff
    margin-top: 20px
    width: 90%
    height: 35px
    border-radius: 5px
    position: relative
    display: flex
    align-items: center
    justify-content: center
    input
      background: none
      border: none
      height: 35px
  .af-ref-cpy
    border: none
    background: none
    font-size: 16px
    padding: 0 10px
    color: #0fade8
  .af-ref-nm
    color: #000
    font-size: 14px
    font-weight: bold
  ul
    list-style: none
    padding: 0px
    margin-top: 0
    margin-bottom: 1rem
    grid-template-columns: repeat(3, 1fr)
    display: grid
    gap: 15px
    li
      flex-direction: column
      justify-content: center
      align-items: center
      text-align: center
      display: flex
      height: 95px
      background: #1EAF2C
      border-radius: 10px
      gap: 8px
  p
    text-align: end
    color: #f00
    font-size: 10px
    margin-top: 0
    margin-bottom: 1rem
.af-ref-link
  color: #fff
  font-weight: 800
  text-transform: uppercase
  border: none
  border-radius: 20px
  width: 110px
  height: 30px
  font-size: 13px
  background: linear-gradient(to bottom, rgba(169, 211, 32, 1) 0%, rgba(56, 131, 18, 1) 100%)
  box-shadow: inset 0px 0px 5px #fff
  margin: 0px auto
  margin: 25px auto

.af-ref-wrap-all
  padding: 0 1rem
  .q-card
    box-shadow: none
    background: transparent
    ::v-deep(.q-tab)
      color: #fff !important
      padding: 10px 0
      &.q-tab--active
        background: var(--TAB, linear-gradient(180deg, #A8D21F 0%, #3A8513 100%))
    ::v-deep(.q-tab-panels)
      background: rgb(8, 47, 26)
      border-left-botton-radius: 8px
      border-right-botton-radius: 8px
      padding: 2rem
      border: 1px solid rgb(71, 184, 61)
      +phone-width
        padding: 1rem
    ::v-deep(.q-tab__indicator)
      display: none
  .af-ref-wrap
    background: rgb(8, 47, 26)
    max-width: 500px
    text-align: center
    color: #fff
    border: none !important
  .tab-content
    color: #fff
    display: flex
    width: 100%
    background: #021524
    border-radius: 0px 0px 8px 8px
    border: 1px solid #086eb8
    flex-direction: column
    padding: 15px

// 上方區塊 END------------------

.expansion-menu
  font-size: 12px
  .expansion-header
    .text-green
      color: #99cc0d
    div
      +setFlex(space-between, center)
      &:first-child
        margin-top: 10px
      &:nth-child(2)
        margin: 10px 0
  .expansion-header-currency
    display: flex
    flex-direction: column
    gap: 10px
    background: #40BE36
    border-radius: 50px
    padding: 5px
    img
      height: 4vw
      width: 4vw
      margin: 0px auto
  .expansion-detail
    padding-top: 20px
    background: #0A3A20
    color: #fff
    border-radius: 5px
    padding: 5px
    font-size: 12px
    font-weight: bold
    &-item
      +setFlex(flex-start, center)
      flex-wrap: wrap
      .text-type
        width: 40%
        margin: 5px 0
::v-deep(.q-table__container)
  +pad-width
    margin: 0 10px
.pagination
  +pad-width
    margin: 10px
  +iphone-width
    margin-right: 12px
</style>
