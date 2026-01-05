import { Notify } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { ERROR_CODE_TYPE, MAYA_ERROR_CODE_TYPE } from "src/common/utils/constants"
import { ref } from "vue"
import { router } from "src/router/index"
import genMayaErrorMsg from "src/common/utils/genMayaErrorMsg"
import { useI18n } from "vue-i18n"

export interface UseApiReturnType<T> {
  /** apiFunction 回傳的資料 */
  data: T

  /** 錯誤代碼 {Number} */
  code: number

  /** 錯誤訊息 {String} */
  msg?: string

  /** 是否呼叫成功 {Boolean} */
  status: boolean

  /** 第三方或額外包含的 error code */
  excode?: string
}

type Unpacked<T> = T extends Promise<infer U> ? U : T

/**
 * 立即執行的hook(IIFE)，用於呼叫api
 *
 * @param apiFunction 欲呼叫的API
 * @param payload 請求參數
 *
 */
export async function useApi<T extends (...args: any) => Promise<any>>(
  apiFunction: T,
  payload?: Parameters<T>[0]
): Promise<UseApiReturnType<Unpacked<ReturnType<T>>>> {
  const data = ref<Unpacked<ReturnType<T>>>()
  const code = ref(0)
  const excode = ref<string | undefined>()
  const msg = ref<string | undefined>()
  const status = ref<boolean>(false)

  // call API
  await (async () => {
    try {
      const response = await apiFunction(payload)
      data.value = response.data
      code.value = response.code
      msg.value = response.msg
      status.value = response.status === true

      if (status.value) {
        return
      }

      switch (response.code) {
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
              $t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string) ||
              `${response.msg}${response.code ? " (" + response.code + ")" : ""}`,
            icon: "warning",
            timeout: 1000
          })
          const { reset } = useAuth()
          reset()
          // 因需要重新觸發beforeEach，判斷各版型沒有token去哪
          router.go(0)
          break

        // 特殊代碼判斷，不要顯示錯誤訊息
        case ERROR_CODE_TYPE.Enums.P_PHONE_EXIST:
        case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_GSMD_OFFLINE:
        case ERROR_CODE_TYPE.Enums.CHATROOM_MEMBER_NICKNAME_REACH_MAX:
        case ERROR_CODE_TYPE.Enums.CHATROOM_MEMBER_NOT_FOUND:
        case ERROR_CODE_TYPE.Enums.P_USER_PREFERENCES_EXCLUSION:
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_AMOUNT_LESSER_THAN_COLLECTION:
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXIST_IN_SAME_TIME_RANGE:
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_MAIN_TIME_SETTING:
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_COLLECTION_AMOUNT_MEET_LIMIT:
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_SUB_TIME_SETTING:
        case ERROR_CODE_TYPE.Enums.P_USER_AUTH_REQUIRED:
          break

        // Maya的error code時，判斷錯誤訊息
        case ERROR_CODE_TYPE.Enums.P_EXTERNAL_ERROR_MAYA:
          excode.value = response.excode
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

        case ERROR_CODE_TYPE.Enums.CORE_SEARCH_RANGE_EXCEED:
          const regex = /(\d+)/
          const match = response.msg?.match(regex)
          const limitDays = match ? parseInt(match[1], 10) : null
          Notify.create({
            type: "negative",
            position: "top",
            message: $t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string, {
              limitDays
            }),
            icon: "warning",
            timeout: 1000
          })
          break

        // 統一顯示錯誤訊息
        default:
          if (globalThis.$te(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string)) {
            Notify.create({
              type: "negative",
              position: "top",
              message: $t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string),
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
    } catch (err) {
      console.error("Failed to fetch data:", err)
    } finally {
    }
  })()

  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    data: data.value!,
    code: code.value,
    excode: excode.value,
    msg: msg.value,
    status: status.value
  }
}
