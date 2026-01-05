import { computed } from "vue"
import { getSite, trafficView } from "src/api/site"
import { useApi } from "src/common/hooks/useApi"
import { storeToRefs } from "pinia"
import { useEnvInfoStore, AGENT_CODE_LIST } from "src/stores/envStore"
import { REGISTER_METHOD, AGENT_TYPE, ENV_TYPE, AUTH_REQUIRED } from "src/common/utils/constants"

export { AGENT_CODE_LIST }

export function useEnv() {
  const envStore = useEnvInfoStore()
  const { envInfo, updateIsCordova, updateInviteCode, resetInviteCode, setIsDark } = envStore
  const { inviteCode, isCordova } = storeToRefs(envStore)

  const companyName = computed(() => {
    switch (envInfo.agentCode.toUpperCase()) {
      case AGENT_CODE_LIST.ANIP.toUpperCase():
        return "ANIBET"
      case AGENT_CODE_LIST.SAMJ.toUpperCase():
        return "AMUSEVIP"
      case AGENT_CODE_LIST.DBO1.toUpperCase():
        return "DBO88"
      case AGENT_CODE_LIST.FP1A.toUpperCase():
      case AGENT_CODE_LIST.FP1D.toUpperCase():
        return "FairPlay"
      case AGENT_CODE_LIST.UFA1.toUpperCase():
      case AGENT_CODE_LIST.UFAD.toUpperCase():
        return "UFAONG"
      case AGENT_CODE_LIST.ds49.toUpperCase():
      case AGENT_CODE_LIST.MGB1.toUpperCase():
        return "MEGABET"
      case AGENT_CODE_LIST.EIB1.toUpperCase():
        return "EISBET"
      case AGENT_CODE_LIST.ARG1.toUpperCase():
        return "Aurora Gaming"
      default:
        return "Our Website"
    }
  })

  const envType = computed(() => {
    if (process.env.NODE_ENV === "development") {
      return ENV_TYPE.Enums.DEVELOP
    }

    return process.env.VITE_APP_SITE_ENV
  })

  const nowHost = computed(() => window.location?.hostname || "")
  const isPhoneRegisterMode = computed(() => envInfo.registerMethod === REGISTER_METHOD.Enums.Phone)
  const isCash = computed(() => envInfo.agentType === AGENT_TYPE.Enums.Cash)
  const isCredit = computed(() => envInfo.agentType === AGENT_TYPE.Enums.Credit)
  const showBonusWallet = computed(() => envInfo.wallet_type_bonus_flag)
  const showWithdrawalPassword = computed(() => envInfo.withdrawal_password)
  const isMain = computed(() => envType.value === ENV_TYPE.Enums.MAIN)
  const isStaging = computed(() => envType.value === ENV_TYPE.Enums.STAGING)
  const isDevelop = computed(() => envType.value === ENV_TYPE.Enums.DEVELOP)
  const aiAgentStatus = computed(() => envInfo.ai_agent)
  const betLimitEnabled = computed(() => envInfo.member_self_bet_restriction_enabled === 1)
  const isAuthRequired = computed(() => envInfo.auth_required === AUTH_REQUIRED.Enums.ENABLE)
  const isCordovaMode = computed(() => isCordova.value === "1")
  const isDark = computed(() => envInfo.isDark)

  const getModeEnv = () => {
    return {
      VITE_APP_TITLE: "Quasar Core",
      VITE_APP_BASE_API: envInfo.baseApi,
      VITE_APP_BASE_API_PATH: envInfo.apiPath,
      VITE_APP_STATIC_RESOURCE_URL: envInfo.staticResourceUrl || "",
      VITE_APP_DYNAMIC_RESOURCE_URL:
        removeTrailingSlash(envInfo.dynamicResourceUrl) || removeTrailingSlash(envInfo.baseApi),
      agentType: envInfo.agentType,
      registerMethod: envInfo.registerMethod,
      agentCode: envInfo.agentCode,
      siteKey: envInfo.siteKey,
      open_lobby_mode: envInfo.open_lobby_mode,
      withdrawal_password: envInfo.withdrawal_password,
      international_calling_code: envInfo.international_calling_code,
      open_register_promotion: envInfo.open_register_promotion,
      open_sub_ad: envInfo.open_sub_ad,
      ai_agent: envInfo.ai_agent,
      ai_helper: envInfo.ai_helper,
      gs1_small_game: envInfo.gs1_small_game,
      miniGameAuthKeyMap: envInfo.miniGameAuthKeyMap
    }
  }

  const envData = () => getModeEnv()

  function visitWebsite() {
    if (!envInfo.agentCode) return

    trafficView({ agent_code: envInfo.agentCode })
  }

  function removeTrailingSlash(url: string) {
    return url.endsWith("/") ? url.slice(0, -1) : url
  }

  return {
    /** 環境資料 */
    envData,

    /** 取得網站Title */

    /** 訪問次數統計 */
    visitWebsite,

    /** 各代理公司名稱 */
    companyName,

    /** 當前網址 */
    nowHost,

    /** 手機註冊模式 */
    isPhoneRegisterMode,

    /** 現金模式 */
    isCash,

    /** 信用模式 */
    isCredit,

    /** 是否開啟贈金錢包 */
    showBonusWallet,

    /** 是否開出款密碼 */
    showWithdrawalPassword,

    /** 是否開ai agent */
    aiAgentStatus,

    /** 判斷是否為cordova */
    isCordova,
    isCordovaMode,
    updateIsCordova,

    /** 推薦碼 */
    inviteCode,

    /** 環境類型 */
    envType,

    /** main環境 */
    isMain,

    /** staging環境 */
    isStaging,

    /** dev環境 */
    isDevelop,

    /** 更新推薦碼 */
    updateInviteCode,

    /** 重設推薦碼 */
    resetInviteCode,

    /** 是否開啟投注限額 */
    betLimitEnabled,

    /** 是否需要登入時驗證KYC */
    isAuthRequired,

    /** 設定暗黑模式 */
    setIsDark,

    /** 是否為暗黑模式 */
    isDark
  }
}
