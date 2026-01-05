import { ref, reactive } from "vue"
import { useQuasar } from "quasar"
import { useApi } from "src/common/hooks/useApi"
import {
  getReferralInfo,
  getReferralSummary,
  getReferralSetting,
  getReferralSettingDetail,
  putReferralSetting,
  getReferralStatementList,
  getReferralStatementDetail,
  getReferralStatementDetailTotal,
  getReferralSignupOverview
} from "src/api/referral"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"

export function useReferral() {
  const referralInfoData = ref<Response.ReferralInfo>()
  const referralSummaryData = ref<Response.ReferralSummary>()
  const referralSettingData = ref<Response.ReferralSetting>()
  const referralSettingDetailData = ref<Response.ReferralSettingDetail>()
  const upperReferralSettingDetailData = ref<Response.ReferralSettingDetail>()
  const referralStatementListData = ref<Response.ReferralStatementList>()
  const referralStatementDetailData = ref<Response.ReferralStatementDetail>()
  const referralStatementDetailTotalData = ref<Response.ReferralStatementDetailTotal>()
  const referralSignupOverview = ref<Response.ReferralSignupOverview>()
  const $q = useQuasar()

  const fetchReferralInfo = async () => {
    const { status, data } = await useApi(getReferralInfo)
    if (status && data) {
      referralInfoData.value = data
    }
  }

  const fetchReferralSummary = async (currencyId?: string) => {
    const { status, data } = await useApi(() => getReferralSummary(currencyId))
    if (status && data) {
      referralSummaryData.value = data
    }
  }

  const fetchReferralSignupOverview = async () => {
    const { status, data } = await useApi(() => getReferralSignupOverview())
    if (status && data) {
      referralSignupOverview.value = data
    }
  }

  const fetchReferralSetting = async (params?: Request.GetReferralSetting) => {
    const { status, data } = await useApi(() => getReferralSetting(params))
    if (status && data) {
      referralSettingData.value = data
    }
  }

  const fetchReferralSettingDetail = async (memberId: number, isUpper?: boolean) => {
    const { status, data } = await useApi(() => getReferralSettingDetail(memberId))
    if (status && data) {
      if (isUpper) {
        upperReferralSettingDetailData.value = data
      } else {
        referralSettingDetailData.value = data
      }
    }
  }

  const updateReferralSetting = async (params: Request.UpdateReferralSetting) => {
    const { status } = await useApi(() => putReferralSetting(params))
    if (status) {
      return true
    } else {
      return false
    }
  }
  const fetchReferralStatementList = async (params?: Request.GetReferralStatementList) => {
    const { status, data } = await useApi(() => getReferralStatementList(params))
    if (status && data) {
      referralStatementListData.value = data
    }
  }

  const fetchReferralStatementDetail = async (statementId: number, params?: Request.GetReferralStatementDetail) => {
    const { status, data } = await useApi(() => getReferralStatementDetail(statementId, params))
    if (status && data) {
      referralStatementDetailData.value = data
    }
  }

  const fetchReferralStatementDetailTotal = async (statementId: number) => {
    const { status, data } = await useApi(() => getReferralStatementDetailTotal(statementId))
    if (status && data) {
      referralStatementDetailTotalData.value = data
    }
  }

  type TableType = "setting" | "statement" | "statementDetail"

  const referralPagination = reactive({
    offset: 0,
    size: 20
  })

  const handlePagination = async (page: number, tableType: TableType, statementId?: number, size?: number) => {
    referralPagination.offset = (page - 1) * referralPagination.size
    referralPagination.size = size ?? referralPagination.size
    $q.loading.show()

    switch (tableType) {
      case "setting":
        await fetchReferralSetting(referralPagination)
        break
      case "statement":
        await fetchReferralStatementList(referralPagination)
        break
      case "statementDetail":
        await fetchReferralStatementDetail(statementId as number, referralPagination)
        break
    }

    $q.loading.hide()
  }

  return {
    // 取得推薦資訊(推薦代碼)
    fetchReferralInfo,
    referralInfoData,
    // 邀請獎勵
    fetchReferralSignupOverview,
    referralSignupOverview,
    // 下級會員佣金統計總結(返佣統計)
    fetchReferralSummary,
    referralSummaryData,
    // 取得直屬下級佣金設定(代理佣金設定列表)
    fetchReferralSetting,
    referralSettingData,
    // 取得下級會員佣金設定(點擊列表上設定，彈窗返佣比例設定)
    fetchReferralSettingDetail,
    upperReferralSettingDetailData,
    referralSettingDetailData,
    // 更新下級會員佣金設定(更新返佣比例)
    updateReferralSetting,
    // 代理佣金結算明細列表
    fetchReferralStatementList,
    referralStatementListData,
    // 下級佣金結算明細詳情
    fetchReferralStatementDetail,
    referralStatementDetailData,
    // 下級佣金結算明細總計
    fetchReferralStatementDetailTotal,
    referralStatementDetailTotalData,
    // pagination
    referralPagination,
    handlePagination
  }
}
