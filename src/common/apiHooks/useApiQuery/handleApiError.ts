import { ApiResponse, ErrorHandlerDependencies } from "./types"
import genMayaErrorMsg from "src/common/utils/genMayaErrorMsg"
import { ERROR_CODE_TYPE } from "src/common/utils/constants"
import { Notify } from "quasar"
import { router } from "src/router/index"

/**
 * 處理 API 錯誤訊息 (純函數版本)
 * @param response API 的原始回應
 * @param deps 從 Vue composable 傳入的依賴
 */
// TODO: type response 應該要明確定義 ApiResponse 而非
export function handleApiError(response: any, deps: ErrorHandlerDependencies) {
  const { t, te, resetAuth } = deps

  switch (response.code) {
    // --- Token 相關錯誤 (登出、重整) ---
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_EXPIRED:
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_PARSE_FAILED:
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_USER_NOT_FOUND:
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_COMPARISON_ACCESS_TOKEN_FAILED:
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_GET_ENTRANCE_LAYER_FAILED:
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_ENTRANCE_LAYER_NOT_FOUND:
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_INVALID_TOKEN:
      Notify.create({
        type: "negative",
        position: "top",
        message:
          t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string) ||
          `${response.msg}${response.code ? " (" + response.code + ")" : ""}`,
        icon: "warning",
        timeout: 1000
      })

      resetAuth()

      // router 是單例，可以直接使用
      router.go(0)
      break

    // --- 特殊代碼判斷 (靜默處理，不顯示錯誤訊息) ---
    case ERROR_CODE_TYPE.Enums.P_PHONE_EXIST:
    case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_GSMD_OFFLINE:
    case ERROR_CODE_TYPE.Enums.CHATROOM_MEMBER_NICKNAME_REACH_MAX:
    case ERROR_CODE_TYPE.Enums.CHATROOM_MEMBER_NOT_FOUND:
    case ERROR_CODE_TYPE.Enums.P_USER_PREFERENCES_EXCLUSION:
    case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_AMOUNT_LESSER_THAN_COLLECTION:
    case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXIST_IN_SAME_TIME_RANGE:
    case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_ORIGIN_TIME_SETTING:
    case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_COLLECTION_AMOUNT_MEET_LIMIT:
    case ERROR_CODE_TYPE.Enums.P_USER_AUTH_REQUIRED:
      break

    // --- Maya的error code時，判斷錯誤訊息 ---
    case ERROR_CODE_TYPE.Enums.P_EXTERNAL_ERROR_MAYA:
      Notify.create({
        type: "negative",
        position: "top",
        message: genMayaErrorMsg({
          excode: response.excode
        }),
        icon: "warning",
        timeout: 1000
      })
      break

    // --- 搜尋範圍錯誤 ---
    case ERROR_CODE_TYPE.Enums.CORE_SEARCH_RANGE_EXCEED:
      const regex = /(\d+)/
      const match = response.msg?.match(regex)
      const limitDays = match ? parseInt(match[1], 10) : null
      Notify.create({
        type: "negative",
        position: "top",
        message: t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string, {
          limitDays
        }),
        icon: "warning",
        timeout: 1000
      })
      break

    // --- 統一顯示錯誤訊息 (預設) ---
    default:
      // 使用傳入的 te()
      if (te(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string)) {
        Notify.create({
          type: "negative",
          position: "top",
          message: t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string),
          icon: "warning",
          timeout: 1000
        })
      } else {
        Notify.create({
          type: "negative",
          position: "top",
          message: `${response.msg}${response.code ? " (" + response.code + ")" : ""}`,
          icon: "warning",
          timeout: 1000
        })
      }
  }
}
