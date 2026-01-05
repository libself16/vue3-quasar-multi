import { useSessionStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"
import {
  AGENT_TYPE,
  MEMBER_BANK_EDIT,
  OPEN_LOBBY_MODE,
  REGISTER_METHOD,
  VIP_REWARDS_SWITCH,
  WALLET_TYPE,
  AUTH_REQUIRED,
  WITHDRAWAL_PASSWORD
} from "src/common/utils/constants"
import { computed, reactive } from "vue"

// 往後所有state型別定義都固定以此方式命名(stateType)
interface stateType {
  [key: string]: any
  baseApi: string
  apiPath: string
  agentCode: string
  title: string
  agentType: AGENT_TYPE.Enums
  registerMethod: REGISTER_METHOD.Enums
  member_bank_edit: MEMBER_BANK_EDIT.Enums
  staticResourceUrl: string
  dynamicResourceUrl: string
  siteKey: string
  open_lobby_mode: OPEN_LOBBY_MODE.Enums
  withdrawal_password: WITHDRAWAL_PASSWORD.Enums
  international_calling_code: string[]
  wallet_type_bonus_flag: boolean
  wallet_type_order: WALLET_TYPE.Enums
  age_confirmation: boolean
  isDark: boolean
  auth_required: AUTH_REQUIRED.Enums
  withdraw_kyc_verify: number
  open_register_promotion: number
  open_sub_ad: number
  ai_agent: number
  ai_helper: number
  gs1_small_game: number
  upload_details: number
  vip_rewards: VIP_REWARDS_SWITCH.Enums
  member_self_bet_restriction_enabled: number
  first_deposit?: boolean
}

export enum AGENT_CODE_LIST {
  /** 內部測試 */
  NGSI = "NGSI",

  /** 菲律賓站 ANIBET */
  ANIP = "anip",

  /** 日本站 AMUSEVIP (SAMJP) */
  SAMJ = "samj",

  /*DBO88*/
  DBO1 = "DBO1",

  /*FP 測試環境*/
  FP1D = "FP1D",

  /*FP 正式環境*/
  FP1A = "FP1A",

  /** UFA測試環境 */
  UFAD = "UFAD",

  /** UFA正式環境 */
  UFA1 = "UFA1",

  /** UFA測試環境 */
  ds49 = "ds49",

  /** UFA正式環境 */
  MGB1 = "MGB1",

  /** EISBET正式環境 */
  EIB1 = "EIB1",

  /** ARGON正式環境 */
  ARG1 = "ARG1"
}

export const useEnvInfoStore = defineStore("envInfo", () => {
  // 預設資料
  const envInfo: stateType = reactive({
    baseApi: "",
    apiPath: "/v1/player",
    agentCode: "",
    title: "",
    agentType: AGENT_TYPE.Enums.Cash,
    registerMethod: REGISTER_METHOD.Enums.Account,
    member_bank_edit: MEMBER_BANK_EDIT.Enums.CLOSE,
    staticResourceUrl: "",
    dynamicResourceUrl: "",
    siteKey: "",
    open_lobby_mode: OPEN_LOBBY_MODE.Enums.REDIRECT,
    withdrawal_password: WITHDRAWAL_PASSWORD.Enums.NoRequire,
    international_calling_code: [],
    wallet_type_bonus_flag: false,
    wallet_type_order: WALLET_TYPE.Enums.Cash,
    age_confirmation: false,
    isDark: false,
    auth_required: AUTH_REQUIRED.Enums.DISABLE,
    withdraw_kyc_verify: 0,
    open_register_promotion: 0,
    open_sub_ad: 0,
    ai_agent: 0,
    ai_helper: 0,
    gs1_small_game: 0,
    upload_details: 1,
    vip_rewards: VIP_REWARDS_SWITCH.Enums.Disable,
    member_self_bet_restriction_enabled: 0
  })

  const updatedEnvInfo = (data: stateType, attr: any = "") => {
    if (attr === "") {
      for (const key in data) {
        envInfo[key] = data[key]
      }
      return
    }

    envInfo[attr] = data[attr]
  }

  function updateEnvAgentSetting(data: Response.ISetting) {
    envInfo.agentType = data.agent_type
    envInfo.registerMethod = data.register_method
    envInfo.member_bank_edit = data.member_bank_edit
    // envInfo.registerMethod = 1
    envInfo.open_lobby_mode = data.open_lobby_mode ? data.open_lobby_mode : OPEN_LOBBY_MODE.Enums.REDIRECT
    envInfo.withdrawal_password = data.withdrawal_password
      ? data.withdrawal_password
      : WITHDRAWAL_PASSWORD.Enums.NoRequire
    envInfo.international_calling_code = data.international_calling_code
      ? JSON.parse(data.international_calling_code)
      : []
    envInfo.wallet_type_bonus_flag = data.wallet_type_bonus_flag
    envInfo.wallet_type_order = data.wallet_type_order
    envInfo.age_confirmation = !!data.age_confirmation
    envInfo.auth_required = data.auth_required
    envInfo.withdraw_kyc_verify = data.withdraw_kyc_verify
    envInfo.open_register_promotion = data.open_register_promotion
    envInfo.ai_agent = data.ai_agent
    envInfo.ai_helper = data.ai_helper
    envInfo.gs1_small_game = data.gs1_small_game
    envInfo.open_sub_ad = data.open_sub_ad
    envInfo.upload_details = data.upload_details
    envInfo.vip_rewards = data.vip_rewards
    envInfo.saba_widget_id = data.saba_widget_id
    envInfo.member_self_bet_restriction_enabled = data.member_self_bet_restriction_enabled || 0
  }

  const isCordova = useSessionStorage<string>("isCordova", "")
  function updateIsCordova(type: string) {
    isCordova.value = type
  }

  const inviteCode = useSessionStorage<string>("inviteCode", "")
  function updateInviteCode(code: string) {
    inviteCode.value = code
  }
  function resetInviteCode() {
    inviteCode.value = ""
  }

  const isVipRewardsOpen = computed(() => envInfo.vip_rewards === VIP_REWARDS_SWITCH.Enums.Enable)

  const setIsDark = (isDark: boolean) => {
    envInfo.isDark = isDark
  }

  return {
    envInfo,
    isVipRewardsOpen,
    updatedEnvInfo,
    updateEnvAgentSetting,
    AGENT_CODE_LIST,
    isCordova,
    updateIsCordova,
    inviteCode,
    updateInviteCode,
    resetInviteCode,
    setIsDark
  }
})
