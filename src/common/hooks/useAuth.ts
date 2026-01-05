import {
  checkPhone,
  forgetPassword,
  forgetPasswordSms,
  getOTP,
  login,
  loginByToken,
  logout,
  register,
  registerCustomInput,
  registerSms,
  resetPassword,
  mayaLogin,
  getTotpStatus,
  getTotpStatusOnboarding,
  getTotpGenerate,
  getTotpGenerateOnboarding,
  postTotpVerify,
  postTotpVerifyOnboarding,
  postTotpEnable,
  postTotpEnableOnboarding
} from "src/api/login"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { useApi } from "src/common/hooks/useApi"
import { ERROR_CODE_TYPE, PIXEL_CODE_TYPE } from "src/common/utils/constants"
import { useAuthStore } from "src/stores/authStore"
import { useGameStore } from "src/stores/gameStore"
import { useUserInfoStore } from "src/stores/userInfoStore"
import { useAnnouncementStore } from "src/stores/announcementStore"
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"

export function useAuth() {
  const router = useRouter()
  const route = useRoute()
  const store = useAuthStore()
  const { resetInviteCode } = useEnv()

  const isLoading = ref(false)

  const isLogin = computed(() => {
    return store.isLogin
  })
  const isMayaLogin = store.isMayaLogin
  // TODO: gcash 判斷flag
  const isOnBoarding = store.isOnBoarding
  const isToptEnabled = store.isToptEnabled
  const isToptVerified = store.isToptVerified
  const hasSentOtp = ref(false)

  const auth = computed(() => store.$state)
  const toptQrcodeUrl = computed(() => {
    if (!auth.value.totpGenerate) return ""

    const totpGenerate = auth.value.totpGenerate

    return `otpauth://totp/GSI：${totpGenerate.account_name}?algorithm=${totpGenerate.algorithm}&digits=${totpGenerate.digits}&period=${totpGenerate.period}&secret=${totpGenerate.secret}`
  })

  const hiddenColumn = (columnName: string) => {
    switch (columnName) {
      case "password":
      case "confirm_password":
        return true

      default:
        return false
    }
  }

  async function handleLogin(form: Request.login): Promise<{
    status: boolean
    code: number
    data?: Response.login
  }> {
    isLoading.value = true
    const { status, data, code } = await useApi(login, form)

    isLoading.value = false

    if (!status) {
      if (code === ERROR_CODE_TYPE.Enums.P_USER_AUTH_REQUIRED) {
        store.$patch((state) => {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              state[key as keyof Response.login] = data[key as keyof Response.login] as any
            }
          }

          state.onBoarding = true
        })
      }
      return Promise.resolve({
        status,
        code
      })
    }
    resetInviteCode()
    // 强制換密碼流程
    if (data?.need_change_password) {
      // 查找 QuickPass 是否存在
      const allRoutes = router.getRoutes()
      const quickPassRoute = allRoutes.find((route) => route.name === "QuickPass")
      const targetRoute = quickPassRoute ? quickPassRoute.name : route.name

      if (!quickPassRoute) {
        console.warn("QuickPass route is not found.")
      }

      router
        .push({
          name: targetRoute!,
          params: {
            account: data.account || form.username,
            token: data.access_token
          }
        })
        .catch((err) => {
          console.error("Navigation error:", err)
        })

      reset()
    } else {
      // 將 data 全部更新到 authStore.state
      store.$patch((state) => {
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            state[key as keyof Response.login] = data[key as keyof Response.login] as any
          }
        }
      })
    }

    const userInfoStroe = useUserInfoStore()
    userInfoStroe.setLoginByUserClick(true)

    return Promise.resolve({
      status,
      code,
      data
    })
  }

  async function handleLoginByToken(token: string): Promise<{
    status: boolean
    code: number
    data?: Response.login
  }> {
    if (!token) {
      return Promise.resolve({ status: false, code: ERROR_CODE_TYPE.Enums.PAYLOAD_NOT_ALLOW })
    }
    isLoading.value = true
    const { status, data, code } = await useApi(loginByToken, token)
    isLoading.value = false

    if (!status) {
      if (code === ERROR_CODE_TYPE.Enums.P_USER_AUTH_REQUIRED) {
        store.$patch((state) => {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              state[key as keyof Response.login] = data[key as keyof Response.login] as any
            }
          }

          state.onBoarding = true
        })
      }
      return Promise.resolve({
        status,
        code
      })
    }
    resetInviteCode()
    // TODO: 全站檢查quickpass, 整合login after
    // 强制換密碼流程
    if (data?.need_change_password) {
      // 查找 QuickPass 是否存在
      const allRoutes = router.getRoutes()
      const quickPassRoute = allRoutes.find((route) => route.name === "QuickPass")
      const targetRoute = quickPassRoute ? quickPassRoute.name : route.name

      if (!quickPassRoute) {
        console.warn("QuickPass route is not found.")
      }
      const query = { ...router.currentRoute.value.query }
      delete query.login_token

      router
        .push({
          name: targetRoute!,
          params: {
            token: data.access_token
          },
          query
        })
        .catch((err) => {
          console.error("Navigation error:", err)
        })

      reset()
    } else {
      // 將 data 全部更新到 authStore.state
      store.$patch((state) => {
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            state[key as keyof Response.login] = data[key as keyof Response.login] as any
          }
        }
      })
    }

    return Promise.resolve({
      status,
      code,
      data
    })
  }

  async function handleLogout(): Promise<{
    status: boolean
    code: number
  }> {
    isLoading.value = true
    const { status, code } = await useApi(logout)
    isLoading.value = false

    // 無論 logout api 是否呼叫成功，統一都清除 authStore
    reset()

    return Promise.resolve({
      status,
      code
    })
  }

  function reset() {
    const userInfoStroe = useUserInfoStore()
    const announcementStore = useAnnouncementStore()
    const { removeFavoriteList } = useGameStore()

    store.$reset()
    announcementStore.$reset()
    userInfoStroe.$reset()
    removeFavoriteList()
    resetInviteCode()
  }

  async function handleRegister(form: Request.register): Promise<{
    status: boolean
    code: number
  }> {
    const formData: Request.register = {}
    for (const key in form) {
      if (Object.prototype.hasOwnProperty.call(form, key)) {
        const element = form[key]
        if (element || element === false) {
          formData[key] = element
        }
      }
    }

    isLoading.value = true
    const { status, data, code } = await useApi(register, formData)
    isLoading.value = false

    if (!status) {
      return Promise.resolve({
        status,
        code
      })
    }
    const { handleTriggerPixelCode } = usePixelCodes()
    handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_REGISTER_SUCCESS)

    // TODO: 待確認是否自動登入

    return Promise.resolve({
      status,
      code
    })
  }

  async function handleRegisterCustomInput(form: Request.RegistInputCustom): Promise<{
    status: boolean
    code: number
    data?: Response.RegistInputCustomList
  }> {
    isLoading.value = true
    const { status, code, data } = await useApi(registerCustomInput, form)
    isLoading.value = false

    return Promise.resolve({
      status,
      code,
      data
    })
  }

  async function handleRegisterSms(form: Request.RegisterSms): Promise<{
    status: boolean
    code: number
  }> {
    isLoading.value = true
    const { status, code } = await useApi(registerSms, form)
    isLoading.value = false

    if (status) {
      const { handleTriggerPixelCode } = usePixelCodes()
      handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_REGISTER_SUCCESS)
    }

    return Promise.resolve({
      status,
      code
    })
  }

  async function handleForgetPassword(form: Request.forgetPassword): Promise<{
    status: boolean
    code: number
  }> {
    if (Object.values(form).some((item) => !item)) {
      return Promise.resolve({ status: false, code: ERROR_CODE_TYPE.Enums.PAYLOAD_NOT_ALLOW })
    }

    isLoading.value = true
    const { status, code } = await useApi(forgetPassword, {
      account: form.account,
      email: form.email
    })
    isLoading.value = false

    if (!status) {
      return Promise.resolve({
        status,
        code
      })
    }

    return Promise.resolve({
      status,
      code
    })
  }

  async function handleForgetPasswordSms(form: Request.forgetPasswordSms): Promise<{
    status: boolean
    code: number
    data?: Response.forgetPasswordSms
  }> {
    if (Object.values(form).some((item) => !item)) {
      return Promise.resolve({ status: false, code: ERROR_CODE_TYPE.Enums.PAYLOAD_NOT_ALLOW })
    }

    isLoading.value = true
    const { status, code, data } = await useApi(forgetPasswordSms, form)
    isLoading.value = false

    return Promise.resolve({
      status,
      code,
      data
    })
  }

  async function handleResetPassword(form: Request.resetPassword): Promise<{
    status: boolean
    code: number
  }> {
    if (Object.values(form).some((item) => !item)) {
      return Promise.resolve({ status: false, code: ERROR_CODE_TYPE.Enums.PAYLOAD_NOT_ALLOW })
    }

    isLoading.value = true
    const { status, code } = await useApi(resetPassword, {
      token: form.token,
      account: form.account,
      password: form.password,
      confirm_password: form.confirm_password
    })
    isLoading.value = false

    if (!status) {
      return Promise.resolve({
        status,
        code
      })
    }

    return Promise.resolve({
      status,
      code
    })
  }

  async function handleGetOTP(form: Request.GetOTP): Promise<{
    status: boolean
    code: number
  }> {
    isLoading.value = true
    const { status, code } = await useApi(getOTP, form)
    isLoading.value = false

    if (status) {
      hasSentOtp.value = true
    }

    return Promise.resolve({
      status,
      code
    })
  }

  async function handleCheckPhone(form: Request.CheckPhone): Promise<{
    status: boolean
    code: number
  }> {
    isLoading.value = true
    const { status, code } = await useApi(checkPhone, form)
    isLoading.value = false

    return Promise.resolve({
      status,
      code
    })
  }

  async function handleMayaLogin(form: Request.MayaLogin): Promise<{
    status: boolean
    code: number
    data?: Response.login
  }> {
    if (Object.values(form).some((item) => !item && item !== 0)) {
      return Promise.resolve({ status: false, code: ERROR_CODE_TYPE.Enums.PAYLOAD_NOT_ALLOW })
    }

    isLoading.value = true
    const { status, data, code } = await useApi(mayaLogin, form)
    isLoading.value = false

    if (!status) {
      return Promise.resolve({
        status,
        code
      })
    }

    // 强制換密碼流程
    if (data?.need_change_password) {
      // 查找 QuickPass 是否存在
      const allRoutes = router.getRoutes()
      const quickPassRoute = allRoutes.find((route) => route.name === "QuickPass")
      const targetRoute = quickPassRoute ? quickPassRoute.name : route.name

      if (!quickPassRoute) {
        console.warn("QuickPass route is not found.")
      }

      router
        .push({
          name: targetRoute!,
          params: {
            account: "",
            token: data.access_token
          }
        })
        .catch((err) => {
          console.error("Navigation error:", err)
        })

      reset()
    } else {
      // 將 data 全部更新到 authStore.state
      store.$patch((state) => {
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            state[key as keyof Response.login] = data[key as keyof Response.login] as any
          }
        }
      })

      // 從 API 取得token代表已經通過 maya security 驗證，可視為從 maya 客戶端登入
      // 將 isMayaLogin 狀態持久化
      store.$patch({
        is_maya_login: true,
        maya_last_session_id: form.session_id
      })
    }

    return Promise.resolve({
      status,
      code,
      data
    })
  }

  async function handleAccessToken(token: string) {
    if (token) {
      await store.$patch({
        access_token: token
      })
    }
  }

  async function handleGetTotpStatus() {
    if (!isLogin.value) return
    const apiFunc = isOnBoarding.value ? getTotpStatusOnboarding : getTotpStatus
    isLoading.value = true
    const { status, data } = await useApi(apiFunc)
    isLoading.value = false

    if (status && data) {
      store.setTotpStatus(data)
    }
  }

  async function handleGetTotpGenerate() {
    if (!isLogin.value) return
    const apiFunc = isOnBoarding.value ? getTotpGenerateOnboarding : getTotpGenerate
    isLoading.value = true
    const { status, data } = await useApi(apiFunc)
    isLoading.value = false

    if (status) {
      store.setTotpGenerate(data)
    }
  }

  async function handlePostTotpEnable(passcode: string): Promise<{
    status: boolean
    code?: number
  }> {
    if (!isLogin.value) return { status: false }
    const apiFunc = isOnBoarding.value ? postTotpEnableOnboarding : postTotpEnable
    const payload: Request.PostTotpEnable = {
      passcode
    }
    isLoading.value = true
    const { status } = await useApi(apiFunc, payload)
    isLoading.value = false

    if (status) {
      await handleGetTotpStatus()
    }
    store.setToptVerified(status)

    return { status }
  }

  async function handlePostTotpVerify(passcode: string): Promise<{
    status: boolean
    code?: number
  }> {
    if (!isLogin.value) return { status: false }
    const apiFunc = isOnBoarding.value ? postTotpVerifyOnboarding : postTotpVerify
    const payload: Request.PostTotpEnable = {
      passcode
    }
    isLoading.value = true
    const { status } = await useApi(apiFunc, payload)
    isLoading.value = false

    store.setToptVerified(status)
    return { status }
  }

  return {
    /** 登入取得的所有資料 */
    auth,

    /** topt qr code */
    toptQrcodeUrl,

    /** 是否登入的 flag */
    isLogin,

    /** 是否 maya 登入的 flag */
    isMayaLogin,

    /** 是否 On Boarding flag */
    isOnBoarding,

    /** 是否已開啟topt */
    isToptEnabled,

    /** 是否已驗證topt */
    isToptVerified,

    /** 送出登入時的 loading */
    isLoading,

    /** 呼叫登入 api */
    handleLogin,

    /** 呼叫Token登入 api */
    handleLoginByToken,

    /** 呼叫登出 api */
    handleLogout,

    /** 重置 authStore */
    reset,

    /** 呼叫註冊取特定欄位 api */
    handleRegisterCustomInput,

    // 判斷哪些欄位需要*** 隱藏輸入內容
    hiddenColumn,

    /** 呼叫註冊 api */
    handleRegister,

    /** 呼叫手機註冊 api */
    handleRegisterSms,

    /** 呼叫忘記密碼 api */
    handleForgetPassword,

    /** 呼叫忘記密碼Sms api */
    handleForgetPasswordSms,

    /** 呼叫重設密碼 api */
    handleResetPassword,

    /** 取得SMS驗證碼 */
    handleGetOTP,

    /** 是否曾送出過OTP */
    hasSentOtp,

    /** 檢查手機號是否存在 */
    handleCheckPhone,

    handleMayaLogin,

    handleAccessToken,

    /** 取得topt狀態 */
    handleGetTotpStatus,

    /** 產生topt註冊資料 */
    handleGetTotpGenerate,

    /** 註冊topt */
    handlePostTotpEnable,

    /** 驗證topt */
    handlePostTotpVerify
  }
}
