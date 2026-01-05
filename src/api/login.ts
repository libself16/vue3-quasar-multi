import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const getOTP = (params: Request.GetOTP) => {
  return requestApi<Request.GetOTP, null>("/v1/player/user/sms_otp", params, {
    name: "getOTP",
    method: "post",
    needToken: false
  })
}

export const registerCustomInput = (params: Request.RegistInputCustom) => {
  return requestApi<Request.RegistInputCustom, Response.RegistInputCustom[]>(
    "/v1/player/user/customize_column/list",
    params,
    {
      name: "registInputCustom",
      method: "get",
      needToken: false
    }
  )
}

export const login = (params: Request.login) => {
  return requestApi<Request.login, Response.login>("/v1/player/user/login", params, {
    name: "login",
    method: "post",
    needToken: false
  })
}

export const loginByToken = (login_token: string) => {
  return requestApi<null, Response.login>(`/v1/player/user/login/${login_token}`, null, {
    name: "loginByToken",
    method: "post",
    needToken: false
  })
}

export const logout = () => {
  return requestApi<null, Response.logout>("/v1/player/user/logout", null, {
    name: "logout",
    method: "post"
  })
}

export const register = (params: Request.register) => {
  return requestApi<Request.register, Response.register>("/v1/player/user", params, {
    name: "register",
    method: "post",
    needToken: false
  })
}

export const registerSms = (params: Request.RegisterSms) => {
  return requestApi<Request.RegisterSms, null>("/v1/player/user", params, {
    name: "registerSms",
    method: "post",
    needToken: false
  })
}

export const forgetPassword = (params: Request.forgetPassword) => {
  return requestApi<Request.forgetPassword, Response.forgetPassword>("/v1/player/user/forgot", params, {
    name: "forgetPassword",
    method: "post",
    needToken: false
  })
}

export const forgetPasswordSms = (params: Request.forgetPasswordSms) => {
  return requestApi<Request.forgetPasswordSms, Response.forgetPasswordSms>("/v1/player/user/forgot_sms_otp", params, {
    name: "forgetPasswordSms",
    method: "post",
    needToken: false
  })
}

export const resetPassword = (params: Request.resetPassword) => {
  return requestApi<Request.resetPassword, Response.resetPassword>("/v1/player/user/forgot/reset", params, {
    name: "resetPassword",
    method: "put",
    needToken: false
  })
}
export const checkPhone = (params: Request.CheckPhone) => {
  return requestApi<Request.CheckPhone, null>("/v1/player/user/check_phone", params, {
    name: "checkPhone",
    method: "post",
    needToken: false
  })
}

export const tgWebAppLogin = (params: Request.TgWebAppLogin) => {
  return requestApi<Request.TgWebAppLogin, Response.TgWebAppLogin>("/v1/operator/member/login/tg", params, {
    name: "tgWebAppLogin",
    method: "post"
  })
}

export const mayaLogin = (params: Request.MayaLogin) => {
  return requestApi<Request.MayaLogin, Response.login>("/v1/maya/login", params, {
    name: "mayaLogin",
    method: "post"
  })
}

export const getTotpStatus = () => {
  return requestApi<null, Response.GetTotpStatus>("/platform/v1/player/auth/totp/status", null, {
    name: "getTotpStatus",
    method: "get"
  })
}

export const getTotpStatusOnboarding = () => {
  return requestApi<null, Response.GetTotpStatus>("/platform/v1/player/auth/onboarding/totp/status", null, {
    name: "getTotpStatusOnboarding",
    method: "get"
  })
}

export const getTotpGenerate = () => {
  return requestApi<null, Response.GetTotpGenerate>("/platform/v1/player/auth/totp/generate", null, {
    name: "getTotpGenerate",
    method: "get"
  })
}

export const getTotpGenerateOnboarding = () => {
  return requestApi<null, Response.GetTotpGenerate>("/platform/v1/player/auth/onboarding/totp/generate", null, {
    name: "getTotpGegetTotpGenerateOnboardingnerate",
    method: "get"
  })
}

export const postTotpEnable = (params: Request.PostTotpEnable) => {
  return requestApi<Request.PostTotpEnable, null>("/platform/v1/player/auth/totp/enable", params, {
    name: "postTotpEnable",
    method: "post"
  })
}

export const postTotpEnableOnboarding = (params: Request.PostTotpEnable) => {
  return requestApi<Request.PostTotpEnable, null>("/platform/v1/player/auth/onboarding/totp/enable", params, {
    name: "postTotpEnableOnboarding",
    method: "post"
  })
}

export const postTotpVerify = (params: Request.PostTotpVerify) => {
  return requestApi<Request.PostTotpVerify, null>("/platform/v1/player/auth/totp/verify", params, {
    name: "postTotpVerify",
    method: "post"
  })
}

export const postTotpVerifyOnboarding = (params: Request.PostTotpVerify) => {
  return requestApi<Request.PostTotpVerify, null>("/platform/v1/player/auth/onboarding/totp/verify", params, {
    name: "postTotpVerifyOnboarding",
    method: "post"
  })
}
