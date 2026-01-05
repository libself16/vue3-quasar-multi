import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const getFirstDepositPromotion = (params: Request.FirstDepositPromotion) => {
  return requestApi<Request.FirstDepositPromotion, null | Response.FirstDepositPromotion>(
    "/v1/player/promotions/free_spin/pop_out",
    params,
    {
      name: "getFirstDepositPromotion",
      method: "get"
    }
  )
}

export const getPaymentImg = (id: number) => {
  return requestApi<null, string>(`/v1/player/center/image/${id}`, null, {
    name: "getPaymentImg",
    method: "get"
  })
}

export const getAvailCurrencyList = () => {
  return requestApi<null, { currencies: [] }>("/v1/player/center/wallets/currencies/available", null, {
    name: "availCurrencyList",
    method: "get"
  })
}

export const getPaymentGatewayList = () => {
  return requestApi<null, []>("/v1/player/payment_gateway/list", null, {
    name: "paymentGatewayList",
    method: "get"
  })
}

export const getPaymentTypeList = (params?: Request.GetPaymentTypeList) => {
  return requestApi<Request.GetPaymentTypeList | undefined, { payment_type: []; supported_payment_gateway: [] }>(
    "/v1/player/withdraw/payment/type",
    params,
    {
      name: "getPaymentTypeList",
      method: "get"
    }
  )
}

export const getBankList = (params?: Request.GetBankList) => {
  return requestApi<Request.GetBankList | undefined, Response.BankList>("/v1/player/withdraw/bank", params, {
    name: "getBankList",
    method: "get"
  })
}

export const getBankCardList = (params?: Request.GetBankCardList) => {
  return requestApi<Request.GetBankCardList | undefined, Response.BankCards>("/v1/player/withdraw/bank/card", params, {
    name: "getBankCardList",
    method: "get"
  })
}

export const getUserBankInfo = (params: { id: number }) => {
  return requestApi<Request.GetBankCardInfo | undefined, Response.BankCardList>(
    `/v1/player/withdraw/bank/card/${params.id}`,
    undefined,
    {
      name: "getBankCardInfo",
      method: "get"
    }
  )
}

export const addBankCard = (params: Request.AddBankCard) => {
  return requestApi<Request.AddBankCard, null>("/v1/player/withdraw/bank/card", params, {
    name: "addBankCard",
    method: "post"
  })
}

export const editBankCard = (params: Request.EditBankCard) => {
  return requestApi<Request.EditBankCard, null>(`/v1/player/withdraw/bank/card/${params.id}`, params, {
    name: "editBankCard",
    method: "put"
  })
}

export const deleteBankCard = (params: { id: number }) => {
  return requestApi<{ id: number }, null>(`/v1/player/withdraw/bank/card/${params.id}`, params, {
    name: "deleteBankCard",
    method: "delete"
  })
}

export const depositPaymentList = () => {
  return requestApi<null, Response.PaymentList>("/v1/player/deposit/payment/info", null, {
    name: "depositPaymentList",
    method: "get"
  })
}

export const depositPaymentDetail = (id: number) => {
  return requestApi<null, Response.DepositPaymentDetail>(`/v1/player/deposit/payment/${id}`, null, {
    name: "depositPaymentDetail",
    method: "get"
  })
}

export const depositRemark = (transCode: string) => {
  return requestApi<null, Response.UploadRemark>(`/v1/player/deposit/payment/remark/${transCode}`, null, {
    name: "depositRemark",
    method: "get"
  })
}

export const withdrawalRemark = (transCode: string) => {
  return requestApi<null, Response.UploadRemark>(`/v1/player/withdraw/payment/remark/${transCode}`, null, {
    name: "withdrawRemark",
    method: "get"
  })
}

export const depositDetailUpload = (params: Request.UploadDetailUpload) => {
  return requestApi<Request.UploadDetailUpload, null>(`/v1/player/deposit/image`, params, {
    name: "depositDetailUpload",
    method: "post"
  })
}

export const withdrawalDetailUpload = (params: Request.UploadDetailUpload) => {
  return requestApi<Request.UploadDetailUpload, null>(`/v1/player/withdraw/image`, params, {
    name: "withdrawalDetailUpload",
    method: "post"
  })
}

export const deposit = (params: Request.Deposit) => {
  return requestApi<Request.Deposit, Response.Deposit>("/v1/player/deposit", params, {
    name: "deposit",
    method: "post"
  })
}

export const mayaDeposit = (params: Request.MayaDeposit) => {
  return requestApi<Request.MayaDeposit, Response.Deposit>("/v1/maya/deposit", params, {
    name: "mayaDeposit",
    method: "post"
  })
}

export const withdrawPaymentList = () => {
  return requestApi<null, Response.PaymentList>("/v1/player/withdraw/payment/info", null, {
    name: "withdrawPaymentList",
    method: "get"
  })
}

export const withdrawPaymentDetail = (id: number) => {
  return requestApi<null, Response.WithdrawPaymentDetail>(`/v1/player/withdraw/payment/${id}`, null, {
    name: "withdrawPaymentDetail",
    method: "get"
  })
}

export const withdraw = (params: Request.Withdraw) => {
  return requestApi<Request.Withdraw, null>("/v1/player/withdraw", params, {
    name: "withdraw",
    method: "post"
  })
}

export const mayaWithdraw = (params: Request.MayaWithdraw) => {
  return requestApi<Request.MayaWithdraw, null>("/v1/maya/withdraw", params, {
    name: "mayaWithdraw",
    method: "post"
  })
}

// 取得maya連結資訊
export const getMayaLoginInfo = (params: string) => {
  return requestApi<null, Response.MayaLoginInfo>(
    `/platform/v1/player/withdrawal/external/info?payment_gateway_name=${params}`,
    null,
    {
      name: "getMayaLoginInfo",
      method: "get"
    }
  )
}

// 傳送maya token給後端
export const sendMayaToken = (params: Request.SendMayaToken) => {
  return requestApi<Request.SendMayaToken, null>("/platform/v1/player/withdrawal/external/maya/token", params, {
    name: "sendMayaToken",
    method: "post"
  })
}

// 發送maya出款申請給後端
export const sendMayaWithdraw = (params: Request.SendMayaWithdraw) => {
  return requestApi<Request.SendMayaWithdraw, null>("/v1/player/withdrawal/external/maya", params, {
    name: "sendMayaWithdraw",
    method: "post"
  })
}

export const getWithdrawCryptoRate = (params: Request.WithdrawCryptoRate) => {
  return requestApi<Request.WithdrawCryptoRate, Response.WithdrawCryptoRate>(
    "/v1/player/withdraw/crypto/rate",
    params,
    {
      name: "getWithdrawCryptoRate",
      method: "get"
    }
  )
}

export const getWithdrawCryptoCurrency = (params: Request.WithdrawCrypto) => {
  return requestApi<Request.WithdrawCrypto, Response.WithdrawCryptoCurrency[]>("/v1/player/withdraw/crypto", params, {
    name: "getWithdrawCryptoCurrency",
    method: "get"
  })
}

export const getDepositPromotionList = (params: Request.Deposit) => {
  const payload = {
    currency: params.currency,
    deposit_amount: params.amount !== "" ? params.amount : 0,
    deposit_gateway_id: params.payment_gateway_id
  }
  return requestApi<
    { currency: string; deposit_amount: string | number; deposit_gateway_id: number },
    Response.depositPromotion[]
  >("/v1/player/promotions/deposit", payload, {
    name: "getDepositPromotionList",
    method: "get"
  })
}
