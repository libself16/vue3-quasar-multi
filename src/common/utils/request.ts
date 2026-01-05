import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { ERROR_CODE_TYPE } from "src/common/utils/constants"
import { useLanguageStore } from "src/stores/languageStore"
import type { ApiResponse } from "src/common/apiHooks/useApiQuery/types"

declare module "axios" {
  export interface AxiosRequestConfig {
    /** API名稱，用於對應mock api */
    name?: string

    /** 是否使用 form data 格式傳送 */
    useFormData?: boolean

    /** 是否需要自動戴上 token，預設為 true */
    needToken?: boolean

    /**
     * 用來判斷此請求是否直接呼叫 AWS 的服務
     * @預設 undefined
     *
     * @undefined 預設為 false
     * @true時 response 的 status 會直接使用 http status code 來判斷
     */
    directCallAWS?: boolean
  }
}

const langStore = useLanguageStore()
const acceptLanguage = langStore.lang || langStore.defaultLang
const { envData } = useEnv()
const { auth } = useAuth()
const { VITE_APP_BASE_API, VITE_APP_BASE_API_PATH, agentCode } = envData()
// axios 實例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: VITE_APP_BASE_API,
  timeout: 1000 * 10 // timeout時間，單位為毫秒
})

// request 攔截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 無論是否為form-data, 都設定Accept-Language
    config.headers["Accept-Language"] = acceptLanguage

    const { useFormData = false } = config
    if (useFormData) {
      config.headers["Content-Type"] = "multipart/form-data"
    }

    const { needToken = true } = config
    if (needToken) {
      const { access_token } = auth.value
      config.headers.Authorization = `Bearer ${access_token}`
    }
    if (process.env.NODE_ENV === "development") {
      config.headers["Agentcode"] = agentCode
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// response 攔截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { status: httpStatusCode, data: httpResponseData, config } = response

    // 若請求為直接 call AWS 服務，則直接透過 http status code 來判斷是否成功
    if (config.directCallAWS) {
      if (httpStatusCode >= 200 && httpStatusCode < 300) {
        return Promise.resolve({
          status: true,
          code: ERROR_CODE_TYPE.Enums.SUCCESS,
          msg: "success",
          data: httpResponseData
        })
      }
      return Promise.resolve({
        status: false,
        code: ERROR_CODE_TYPE.Enums.CALL_S3_FAILED,
        msg: "AWS request failed.",
        data: httpResponseData
      })
    }

    if (!httpResponseData) {
      return Promise.resolve({
        status: false,
        code: ERROR_CODE_TYPE.Enums.SERVER_EXCEPTION,
        excode: undefined,
        msg: "response is empty.",
        data: null
      })
    }

    if (httpStatusCode !== 200) {
      const { error, excode } = httpResponseData
      const errorCode = error?.code ?? 0
      const errorMessage = error?.message ?? ""

      return Promise.resolve({
        status: false,
        code: errorCode,
        excode: excode || undefined,
        msg: errorMessage,
        data: error
      })
    }

    const { code, msg, data, excode } = httpResponseData
    return Promise.resolve({
      status: code === ERROR_CODE_TYPE.Enums.SUCCESS,
      msg,
      code,
      excode: excode || undefined,
      data: data || null
    })
  },
  (error: any) => {
    return Promise.resolve({
      status: false,
      msg: error?.response?.data?.msg || error?.message,
      code: error?.response?.data?.code || error?.code || ERROR_CODE_TYPE.Enums.SERVER_EXCEPTION,
      excode: error?.response?.data?.excode || undefined,
      data: error?.response?.data || error
    })
  }
)

export const requestApi = async <RequestData, ResponseData>(
  url: string,
  params: RequestData,
  config: AxiosRequestConfig
): Promise<ResponseData> => {
  try {
    // 構建配置項
    const requestConfig: AxiosRequestConfig = {
      ...config,
      method: config.method,
      url,
      [config.method && config.method.toLowerCase() === "get" ? "params" : "data"]: params
    }

    const response = await axiosInstance.request<RequestData, ResponseData>(requestConfig)
    return response
  } catch (error) {
    throw new Error("Failed to fetch data")
  }
}

/**
 * 呼叫 API 並回傳「完整的」 ApiResponse 物件
 * (專門給 useApiQuery 或 useApiMutation 使用)
 */
export const requestApiFullResponse = async <RequestData, ResponseData>(
  url: string,
  params: RequestData,
  config: AxiosRequestConfig
): Promise<ApiResponse<ResponseData>> => {
  // <-- 承諾回傳 ApiResponse

  const requestConfig: AxiosRequestConfig = {
    ...config,
    method: config.method,
    url,
    [config.method && config.method.toLowerCase() === "get" ? "params" : "data"]: params
  }

  // 你的攔截器保證 response 永遠是 ApiResponse 格式
  // 我們使用 "as unknown as" 告訴 TypeScript 這一點
  const response = await axiosInstance.request(requestConfig)
  return response as unknown as ApiResponse<ResponseData>
}
