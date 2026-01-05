import { debounce } from "lodash"
import { storeToRefs } from "pinia"
import { openURL, useQuasar } from "quasar"
import * as bankApi from "src/api/bank"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useApi } from "src/common/hooks/useApi"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { useEnvInfoStore } from "src/stores/envStore"

import {
  DEPOSIT_REDIRECT_TYPE,
  DEPOSIT_REDIRECT_CHANNEL,
  ERROR_CODE_TYPE,
  FEE_TYPE,
  FUND_METHOD_TYPE,
  WITHDRAWAL_PASSWORD
} from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { useBankStore } from "src/stores/bankStore"
import { EventBusKey } from "src/symbols"
import { Ref, computed, nextTick, onMounted, reactive, ref, watchEffect } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

interface BankCardState {
  list: Response.BankCard[]
  form: Request.AddBankCard
  lastQuery?: Request.GetBankCardList
}

interface DepositState {
  list: Response.PaymentList["list"]
  supportedCurrency: Response.PaymentList["supported_currency"]
  fundTypeList: string[]
  usingFundType: string
  usingPaymentInfoList: Response.TransferInfo[]
  form: Request.Deposit
  paymentDetail: Response.DepositPaymentDetail
  quickBtns: string[]
  deposit_quick_btns: string[]
  withdrawal_quick_btns: string[]
  promotion_list: Response.depositPromotion[]
  uploadConfig: Response.UploadConfig
}

interface withdrawState {
  list: Response.PaymentList["list"]
  supportedCurrency: Response.PaymentList["supported_currency"]
  fundTypeList: string[]
  usingFundType: string
  usingPaymentInfoList: Response.TransferInfo[]
  form: Request.Withdraw
  paymentDetail: Response.WithdrawPaymentDetail
  bankCards: Response.BankCard[]
  gateWayHidden: boolean
  uploadConfig: Response.UploadConfig
}

interface IMayaDepositWithdrawalState {
  form: {
    amount: string
    currency: string
    promotion_id: number
  }
  deposit_quick_btns: string[]
  withdrawal_quick_btns: string[]
  promotion_list: Response.depositPromotion[]
  selectedQuickBtn: null | string
}

export interface ICheckWithdrawalPassword {
  routeName?: string
  openSetWithdrawalPassword?: boolean
  cb?: any
}

export function useBank() {
  const { activeWalletLabel } = useUserInfo()
  const $q = useQuasar()
  const { envInfo } = useEnvInfoStore()
  const router = useRouter()
  const { getLanguage } = useLanguage()
  const nowLang = computed(() => getLanguage())
  const { t } = useI18n()
  const { userWalletList, userInfo, userInfo2, accountInfo } = useUserInfo()
  const { envData } = useEnv()
  const { withdrawal_password } = envData()
  const eventbus = injectStrict(EventBusKey)
  const { openHtml, openUrlWithDevice } = useCommon()
  const Rules = useRule()
  const bankStore = useBankStore()
  const { availCurrencyList } = storeToRefs(bankStore)
  const { isGOG, isNBL1, isIDRToEUR } = useAgentCode()
  const { launchGameDialog } = useGame()
  const defaultQuickAmount = ["500", "1000", "5000", "10000", "50000"]

  // 2024/12/31 為了因應, 入款/出款 Type 也要翻譯的需求
  const typeI18n = (item: string) => {
    return t(FUND_METHOD_TYPE.I18nKeys[FUND_METHOD_TYPE.Enums[item as any] as any as FUND_METHOD_TYPE.Enums])
  }

  //  gateway display
  const showGateway = (type: number) => {
    if (!bankCardState.form.payment_type_id) return false

    switch (bankCardState.form.payment_type_id) {
      case FUND_METHOD_TYPE.Enums.EWallet:
      case FUND_METHOD_TYPE.Enums.CryptoPayment:
        return true
      default:
        return false
    }
  }

  //#region common

  const currencyList = computed(() => {
    return userWalletList.value.map((e) => {
      return {
        value: e.currency_id,
        label: e.currency_code
      }
    })
  })

  // 純粹顯示幣種(不分贈金錢包  錢包幣種)
  // const availCurrencyList = ref<Response.AvailCurrencyList>([])
  const currencyIdMap = computed(() => {
    if (!availCurrencyList.value.length) {
      getAvailCurrencyList()
      return null
    }

    const result: { [key: number]: Response.AvailCurrency } = {}
    availCurrencyList.value.forEach((e) => {
      result[e.id] = e
    })

    return result
  })

  const currencyCodeMap = computed(() => {
    if (!availCurrencyList.value.length) {
      getAvailCurrencyList()
      return null
    }

    const result: { [key: string]: Response.AvailCurrency } = {}
    availCurrencyList.value.forEach((e) => {
      result[e.code] = e
    })

    return result
  })

  const paymentTypeList = ref<Response.PaymentTypeList>([])
  const paymentGatewayList = ref<Response.PaymentGatewayList>([])
  const totalPaymentGatewayList = ref<Response.PaymentGatewayList>([])

  const firstDepositPromotionInfo = ref<Response.FirstDepositPromotion | null>(null)
  const cryptoRate = ref<number>(0)
  const bankList = ref<Response.BaseListType[]>([])
  const cryptoList = ref<Response.BaseListType[]>([])
  const bankFilterList = ref<Response.BaseListType[]>([])
  const gatewayFilterList = ref<Response.BaseListType[]>([])

  const excludedKeys = new Set([
    FUND_METHOD_TYPE.Enums.CryptoWallet,
    FUND_METHOD_TYPE.Enums.ApplePay,
    FUND_METHOD_TYPE.Enums.PayPal
  ])

  async function getFirstDepositPromotion(currency_id: number) {
    const { status, data } = await useApi(bankApi.getFirstDepositPromotion, {
      currency_id,
      pop_out_type: 1
    })
    if (status) {
      firstDepositPromotionInfo.value = data
    }
  }

  async function getAvailCurrencyList() {
    const { status, data } = await useApi(bankApi.getAvailCurrencyList)

    if (status) {
      availCurrencyList.value = data.currencies
    }
  }

  async function getPaymentTypeList(currency: string) {
    const payload: Request.GetPaymentTypeList = {
      currency_id: currencyList.value.find((e) => e.label === currency)?.value as number
    }

    const { status, data } = await useApi(bankApi.getPaymentTypeList, currency ? payload : undefined)

    if (status) {
      paymentTypeList.value = data.payment_type
        // .filter((key) => !excludedKeys.has(Number(key) as FUND_METHOD_TYPE.Enums))
        .map((key) => {
          const name = FUND_METHOD_TYPE.Enums[key as any as FUND_METHOD_TYPE.Enums]
          const label = FUND_METHOD_TYPE.I18nKeys[key as any as FUND_METHOD_TYPE.Enums]
          const iconClass = FUND_METHOD_TYPE.iconClass[key as any as FUND_METHOD_TYPE.Enums]

          return {
            name,
            label,
            value: key,
            iconClass
          }
        })

      totalPaymentGatewayList.value = data.supported_payment_gateway.map((item: Response.PaymentGateway) => {
        return {
          type: item.type,
          value: item.id,
          label: item.name
        }
      })

      getUsingPaymentGatewayList()

      // bankCardState.form.payment_type_id = paymentTypeList.value[0]
      // bankCardState.form.payment_type_id = Number(paymentTypeList.value[0].value)
      // if (paymentGatewayList.value.length !== 0) {
      //   bankCardState.form.payment_gateway_id = Number(paymentGatewayList.value[0].value)
      // }
    }
  }

  async function getUsingPaymentGatewayList() {
    paymentGatewayList.value = totalPaymentGatewayList.value.filter(
      (list) => list.type === bankCardState.form.payment_type_id
    )
  }

  async function getWithdrawCryptoRate(params: Request.WithdrawCryptoRate) {
    const payload = {
      currency: params.currency,
      crypto_id: params.crypto_id
    }

    const { status, data } = await useApi(bankApi.getWithdrawCryptoRate, payload)

    if (status) {
      cryptoRate.value = data.rate
    }
  }

  async function getCryptoList() {
    const payload = {
      currency: bankCardState.form.currency
    }

    const { status, data } = await useApi(bankApi.getWithdrawCryptoCurrency, payload)

    if (status) {
      cryptoList.value = data.map((e) => {
        return {
          label: e.code,
          value: e.id
        }
      })
    }
  }

  async function getBankList(gatewayId?: number) {
    interface PayloadType {
      payment_gateway_id?: number
      payment_type_id: number
    }
    const payload: PayloadType = {
      payment_type_id: bankCardState.form.payment_type_id
    }

    if (gatewayId) payload.payment_gateway_id = gatewayId

    const { status, data } = await useApi(bankApi.getBankList, payload)

    if (status) {
      bankList.value = data.list.map((e) => {
        return {
          label: e.name,
          value: e.id
        }
      })

      if (bankList.value.find((e) => e.value === bankCardState.form.bank_id)) return
      else {
        bankCardState.form.bank_id = null
      }
    }
  }

  async function getGatewayList() {
    const { status, data } = await useApi(bankApi.getPaymentGatewayList)

    if (status) {
      gatewayFilterList.value = data.map((e: any) => {
        return {
          label: e.name,
          value: e.id
        }
      })
    }
  }

  function getPaymentImg(list: Response.PaymentInfo) {
    for (const currency in list) {
      const methods = list[currency]
      for (const method in methods) {
        const payments = methods[method]
        if (payments.length !== 0) {
          payments.forEach(async (payment) => {
            if (payment.logo_image_id) {
              const { status, data } = await useApi(bankApi.getPaymentImg, payment.logo_image_id)
              if (status) {
                payment.imgUrl = data
              }
            }
          })
        }
      }
    }
  }
  const validateNumeric = () => {
    const account_number = bankCardState.form.account_number as string
    const validFormat = /^\d*$/
    if (!validFormat.test(account_number)) {
      bankCardState.form.account_number = account_number.replace(/\D/g, "")
    }
  }

  const validateAlphanumeric = () => {
    const account_number = bankCardState.form.account_number as string
    // 只允許數字和英文字母（大小寫）
    const validFormat = /^[0-9A-Za-z]*$/
    if (!validFormat.test(account_number)) {
      bankCardState.form.account_number = account_number.replace(/[^0-9A-Za-z]/g, "")
    }
  }

  //#endregion

  //#region bank card
  const bankCardState = reactive<BankCardState>({
    list: [],
    form: {
      id: 0,
      payment_type_id: 0,
      name: "",
      account_number: "",
      account_name: "",
      currency: currencyList.value[0]?.label,
      branch: "",
      bank_id: "",
      bank_name: "",
      // 虛擬幣種才有的參數
      wallet_address: "",
      currency_brand: "",
      chain: ""
    }
  })

  async function getBankCardList(query?: Request.GetBankCardList) {
    $q.loading.show()
    // 保存查询条件，如果有新的查询条件就更新，否则使用上次保存的条件
    if (query !== undefined) {
      bankCardState.lastQuery = query
    }
    const { status, data } = await useApi(bankApi.getBankCardList, bankCardState.lastQuery)
    if (status) {
      bankCardState.list = data.list
      $q.loading.hide()
    }
  }

  async function getBankCardInfo(params: Request.GetBankCardInfo) {
    $q.loading.show()
    const { status, data } = await useApi(bankApi.getUserBankInfo, params)
    if (status) {
      $q.loading.hide()
      bankCardState.form.id = params.id
      bankCardState.form.payment_type_id = data.payment_type_id
      bankCardState.form.name = data.name
      bankCardState.form.currency = currencyList.value.find((e) => e.value === data.currency_id)?.label as string
      // 以下因不同的支付type 所需參數不同, 需判斷是否帶入
      if (data.bank_id) bankCardState.form.bank_id = data.bank_id
      if (data.crypto_id) bankCardState.form.crypto_id = data.crypto_id
      if (data.bank_name) bankCardState.form.bank_name = data.bank_name
      if (data.payment_gateway_id) bankCardState.form.payment_gateway_id = data.payment_gateway_id
      if (data.account_number) bankCardState.form.account_number = data.account_number
      if (data.account_name) bankCardState.form.account_name = data.account_name
      if (data.bank_name) bankCardState.form.bank_name = data.bank_name
      if (data.wallet_address) bankCardState.form.wallet_address = data.wallet_address
      if (data.currency_brand) bankCardState.form.currency_brand = data.currency_brand
      if (data.chain) bankCardState.form.chain = data.chain
    }
  }

  async function handleBankCardCurrencyClick(currency: string) {
    await getPaymentTypeList(currency)
    resetBankCardForm()
    bankCardState.form.currency = currency
    getCryptoList()
    getUsingPaymentGatewayList() // 取得該type 該有的渠道list
  }

  function handleBankCardPaymentTypeClick(id: string) {
    bankCardState.form.payment_type_id = parseInt(id)
    bankCardState.form.payment_gateway_id = null // 切換時初始化渠道
    bankCardState.form.bank_id = null // 切換時清空銀行ID
    bankCardState.form.bank_name = ""
    bankCardState.form.account_number = ""
    bankCardState.form.account_name = ""
    bankCardState.form.wallet_address = ""
    bankCardState.form.currency_brand = ""
    bankCardState.form.chain = ""
    bankCardState.form.name = ""

    getUsingPaymentGatewayList() // 取得該type 該有的渠道list
    switch (bankCardState.form.payment_type_id) {
      case FUND_METHOD_TYPE.Enums.EWallet:
      case FUND_METHOD_TYPE.Enums.CryptoPayment:
        // 在業務邏輯頁面中有watch 監聽payment_gateway_id, 所以無須getBankList
        bankCardState.form.payment_gateway_id = paymentGatewayList.value[0].value
        break
      case FUND_METHOD_TYPE.Enums.CryptoWallet:
        // 虛擬貨幣 沒有渠道,  所以gateway id , watch不到異動, 需要在切換type時, 取得銀行list
        getBankList()
      default:
        bankCardState.form.payment_gateway_id = null
        break
    }
  }

  function handleBankCardBankClick(id: number) {
    bankCardState.form.bank_id = id
  }

  function handleBankCardCryptoClick(id: number) {
    bankCardState.form.crypto_id = id
  }

  async function handleBankCardAdd(): Promise<boolean> {
    if (!bankCardState.form.currency) {
      $q.notify({
        type: "negative",
        message: t("common.alarm.pleaseUseCurrency"),
        position: "top",
        timeout: 1000
      })
      return false
    }

    if (!bankCardState.form.payment_type_id) {
      $q.notify({
        type: "negative",
        message: t("common.alarm.pleaseSelectPaymentType"),
        position: "top",
        timeout: 1000
      })
      return false
    }

    try {
      $q.loading.show()

      const payload: Request.AddBankCard = {
        payment_type_id: bankCardState.form.payment_type_id,
        name: bankCardState.form.name,
        currency: bankCardState.form.currency
      }
      switch (bankCardState.form.payment_type_id) {
        case FUND_METHOD_TYPE.Enums.EWallet:
          // payload.name = bankCardState.form.name
          payload.bank_id = bankCardState.form.bank_id
          payload.payment_gateway_id = bankCardState.form.payment_gateway_id
          payload.account_number = bankCardState.form.account_number
          payload.account_name = bankCardState.form.account_name
          break
        case FUND_METHOD_TYPE.Enums.BankTransfer:
          payload.bank_name = bankCardState.form.bank_name
          payload.account_number = bankCardState.form.account_number
          payload.account_name = bankCardState.form.account_name
          break
        case FUND_METHOD_TYPE.Enums.CryptoWallet:
          payload.bank_id = bankCardState.form.bank_id
          payload.crypto_id = bankCardState.form.crypto_id
          payload.wallet_address = bankCardState.form.wallet_address
          break
        case FUND_METHOD_TYPE.Enums.CryptoPayment:
          payload.payment_gateway_id = bankCardState.form.payment_gateway_id
          payload.bank_id = bankCardState.form.bank_id
          payload.crypto_id = bankCardState.form.crypto_id
          payload.wallet_address = bankCardState.form.wallet_address
          break

        default:
          break
      }

      const { status } = await useApi(bankApi.addBankCard, payload)
      if (status) {
        $q.notify({
          type: "positive",
          message: t("common.alarm.createSuccess"),
          position: "top",
          timeout: 1000
        })
        nextTick(() => {
          resetBankCardForm()
        })
      }
      $q.loading.hide()

      return status
    } catch (error) {
      $q.loading.hide()
      return false
    }
  }

  async function handleBankCardEdit(): Promise<boolean> {
    if (!bankCardState.form.currency) {
      $q.notify({
        type: "negative",
        message: t("common.alarm.pleaseUseCurrency"),
        position: "top",
        timeout: 1000
      })
      return false
    }

    if (!bankCardState.form.payment_type_id) {
      $q.notify({
        type: "negative",
        message: t("common.alarm.pleaseSelectPaymentType"),
        position: "top",
        timeout: 1000
      })
      return false
    }

    try {
      $q.loading.show()

      const payload: Request.EditBankCard = {
        id: bankCardState.form.id as number,
        payment_type_id: bankCardState.form.payment_type_id,
        name: bankCardState.form.name,
        currency: bankCardState.form.currency
      }

      switch (bankCardState.form.payment_type_id) {
        case FUND_METHOD_TYPE.Enums.EWallet:
          // payload.name = bankCardState.form.name
          payload.bank_id = bankCardState.form.bank_id
          payload.payment_gateway_id = bankCardState.form.payment_gateway_id
          payload.account_number = bankCardState.form.account_number
          payload.account_name = bankCardState.form.account_name
          break
        case FUND_METHOD_TYPE.Enums.BankTransfer:
          payload.bank_name = bankCardState.form.bank_name
          payload.account_number = bankCardState.form.account_number
          payload.account_name = bankCardState.form.account_name
          break
        case FUND_METHOD_TYPE.Enums.CryptoWallet:
          payload.bank_id = bankCardState.form.bank_id
          payload.crypto_id = bankCardState.form.crypto_id
          payload.wallet_address = bankCardState.form.wallet_address
          break
        case FUND_METHOD_TYPE.Enums.CryptoPayment:
          payload.payment_gateway_id = bankCardState.form.payment_gateway_id
          payload.bank_id = bankCardState.form.bank_id
          payload.crypto_id = bankCardState.form.crypto_id
          payload.wallet_address = bankCardState.form.wallet_address
          break

        default:
          break
      }

      const { status } = await useApi(bankApi.editBankCard, payload)
      if (status) {
        $q.notify({
          type: "positive",
          message: t("common.alarm.editSuccess"),
          position: "top",
          timeout: 1000
        })
        resetBankCardForm()
      }
      $q.loading.hide()

      return status
    } catch (error) {
      $q.loading.hide()
      return false
    }
  }

  async function handleBankCardDelete(id: number): Promise<boolean> {
    try {
      $q.loading.show()

      const payload: { id: number } = { id }

      const { status } = await useApi(bankApi.deleteBankCard, payload)
      if (status) {
        $q.notify({
          type: "positive",
          message: t("common.alarm.deleteSuccess"),
          position: "top",
          timeout: 1000
        })
        getBankCardList()
      }
      $q.loading.hide()

      return status
    } catch (error) {
      $q.loading.hide()
      return false
    }
  }

  async function getWithdrawBankCardList() {
    const currency_id = currencyList.value.find((e) => e.label === withdrawState.form.currency)?.value
    const payment_type_id = paymentTypeList.value.find((e) => e.name === withdrawState.usingFundType)?.value

    if (currency_id && withdrawState.usingFundType) {
      const payload: Request.GetBankCardList = {
        currency_id: `${currency_id}`,
        payment_type_id
      }

      const { status, data } = await useApi(bankApi.getBankCardList, payload)
      if (status) {
        withdrawState.bankCards = data.list
      }
    }
  }

  function resetBankCardForm() {
    bankCardState.form.payment_type_id = paymentTypeList.value.length ? parseInt(paymentTypeList.value[0].value) : 0
    bankCardState.form.name = ""
    bankCardState.form.account_number = ""
    bankCardState.form.account_name = ""
    bankCardState.form.currency = currencyList.value.length ? currencyList.value[0].label : ""
    bankCardState.form.bank_id = ""
    bankCardState.form.bank_name = ""
    bankCardState.form.wallet_address = ""
    bankCardState.form.currency_brand = ""
    bankCardState.form.chain = ""
  }

  // watchEffect(() => {
  //   switch (bankCardState.form.payment_type_id) {
  //     case FUND_METHOD_TYPE.Enums.BankTransfer:
  //       bankCardState.form.bank_id = ""
  //       break
  //     case FUND_METHOD_TYPE.Enums.EWallet:
  //       bankCardState.form.branch = ""
  //       break
  //     default:
  //       break
  //   }
  // })

  //#endregion

  //#region deposit
  const depositState = reactive<DepositState>({
    list: {},
    supportedCurrency: [],
    fundTypeList: [],
    usingFundType: "",
    usingPaymentInfoList: [],
    form: {
      amount: "",
      payment_gateway_id: 0,
      currency: "",
      promotion_id: 0,
      return_url: `${window.location.origin}/windowClose`,
      failed_return_url: `${window.location.origin}/windowClose`,
      extra_remark: [],
      images: []
    },
    uploadConfig: {
      transCode: "",
      images: [],
      uploadSwitch: Boolean(envInfo.upload_details),
      uploadRemark: {
        images: [],
        content: []
      }
    },
    paymentDetail: {
      enable_first_deposit_check: false,
      first_deposit_min: "",
      deposit_min: "",
      deposit_max: "",
      extra_field: {},
      extra_field_key: "",
      audit_rate: "",
      fee_type: FEE_TYPE.Enums.Amount,
      fee_amount: "",
      fee_rate: "",
      usdt_rate: "",
      bank_name: "",
      bank_account: "",
      qrcode_image_id: 0,
      imgUrl: "",
      currency_brand: "",
      wallet_address: "",
      chain: "",
      extra_remark: [],
      quick_amounts: []
    },
    quickBtns: defaultQuickAmount,
    deposit_quick_btns: ["50", "100", "300", "500", "1000"],
    withdrawal_quick_btns: ["200", "300", "500", "1000", "5000", "10000", "30000", "50000", "100000"],
    promotion_list: []
  })

  const mayaDepositWithdrawalState = reactive<IMayaDepositWithdrawalState>({
    form: {
      amount: "",
      currency: "",
      promotion_id: 0
    },
    deposit_quick_btns: ["100", "300", "500", "1000", "5000", "10000", "30000", "50000", "100000"],
    withdrawal_quick_btns: ["200", "300", "500", "1000", "5000", "10000", "30000", "50000", "100000"],
    promotion_list: [],
    selectedQuickBtn: ""
  })

  async function getDepositPaymentList() {
    const { status, data } = await useApi(bankApi.depositPaymentList)
    if (status) {
      // 檢查 data.list 是否為空
      if (!data.list || Object.keys(data.list).length === 0) {
        $q.notify({
          type: "negative",
          message: t("common.alarm.noPaymentMethodAvailable"),
          position: "top",
          timeout: 3000
        })
        depositState.list = {}
        depositState.supportedCurrency = []
        depositState.form.currency = ""
        return
      }

      depositState.list = data.list
      depositState.supportedCurrency = [...data.supported_currency]

      if (data.supported_currency.includes(activeWalletLabel.value)) {
        depositState.form.currency = activeWalletLabel.value
      } else {
        depositState.form.currency = data.supported_currency[0]
      }
    }
  }

  function handleDepositCurrencyClick(currency: string) {
    depositState.form.currency = currency
    // 檢查 depositState.list 是否有資料，沒有資料就不調用 getPromotionList
    if (depositState.list && Object.keys(depositState.list).length > 0) {
      getPromotionList()
    }
  }

  function handleDepositFundTypeClick(fundType: string) {
    depositState.usingFundType = fundType
    // 檢查 depositState.list 是否有資料，沒有資料就不調用 getPromotionList
    if (depositState.list && Object.keys(depositState.list).length > 0) {
      getPromotionList()
    }
  }

  function handleDepositPaymentClick(id: number) {
    depositState.form.payment_gateway_id = id
    // 檢查 depositState.list 是否有資料，沒有資料就不調用 getPromotionList
    if (depositState.list && Object.keys(depositState.list).length > 0) {
      getPromotionList()
    }
  }

  function handleDepositQuickBtnClick(amount: string) {
    depositState.form.amount = amount
  }

  const amount = Rules.usePositiveInteger({
    modelValue: {
      get value() {
        return mayaDepositWithdrawalState.form.amount
      },
      set value(newValue: string) {
        mayaDepositWithdrawalState.form.amount = newValue
      }
    },
    min: 100,
    max: 100000
  })

  function handleMayaDepositQuickBtnClick(clickedAmount: string) {
    amount.value = clickedAmount
    mayaDepositWithdrawalState.selectedQuickBtn = clickedAmount
  }

  function handlePromotionClick(pid: number) {
    depositState.form.promotion_id = pid === depositState.form.promotion_id ? 0 : pid
  }

  function handleMayaDepositPromotionClick(pid: number) {
    mayaDepositWithdrawalState.form.promotion_id = pid === mayaDepositWithdrawalState.form.promotion_id ? 0 : pid
  }

  function handleDepositUploadImageDelete(index: number) {
    depositState.uploadConfig.images.splice(index, 1)
  }

  async function handleDepositSubmit(pageQRCode = "DepositQRCode") {
    try {
      $q.loading.show()

      const { status, data, code } = await useApi(bankApi.deposit, depositState.form)
      if (status) {
        switch (data.redirect_type) {
          // 三方金流打開URL
          case DEPOSIT_REDIRECT_TYPE.Enums.OpenUrl:
            openUrlWithDevice(data.redirect_content, {
              onReject: () => {
                console.warn("URL opening was rejected, showing game dialog")
                window.location.href = data.redirect_content
              }
            })
            break

          // 三方金流打開HTML
          case DEPOSIT_REDIRECT_TYPE.Enums.OpenHtml:
            openHtml({
              htmlContent: data.redirect_content
            })
            break

          case DEPOSIT_REDIRECT_TYPE.Enums.OpenQRCode:
            const qrCodeUrl = router.resolve({
              name: pageQRCode,
              query: {
                type: data.redirect_type,
                currency: data.currency,
                amount: data.amount,
                channel: data.channel,
                content: data.redirect_content
              }
            })

            openUrlWithDevice(qrCodeUrl.href, {
              onReject: () => {
                console.warn("URL opening was rejected, showing game dialog")
                launchGameDialog.showDialog()
                launchGameDialog.gameUrl = qrCodeUrl.href
              }
            })
            break

          // 其餘則跳訊息
          default:
            $q.notify({
              type: "positive",
              message: t("common.alarm.createSuccess"),
              position: "top",
              timeout: 1000
            })
        }
      }

      $q.loading.hide()
      return {
        status,
        data,
        code
      }
    } catch (error) {
      $q.loading.hide()
      return {
        status: false,
        data: undefined,
        code: ERROR_CODE_TYPE.Enums.SERVER_EXCEPTION
      }
    }
  }

  async function handleMayaDepositSubmit() {
    try {
      $q.loading.show()
      const { status, code } = await useApi(bankApi.mayaDeposit, mayaDepositWithdrawalState.form)
      $q.loading.hide()

      return { status, code }
    } catch (error) {
      $q.loading.hide()
      return {
        status: false,
        data: undefined,
        code: ERROR_CODE_TYPE.Enums.SERVER_EXCEPTION
      }
    }
  }

  // 取得支付圖片
  watchEffect(() => {
    if (Object.keys(depositState.list).length) {
      getPaymentImg(depositState.list)
    }
  })

  // 切換幣別
  watchEffect(() => {
    if (Object.keys(depositState.list).length && depositState.form.currency) {
      const paymentInfo = depositState.list[depositState.form.currency]
      const paymentInfoKeys = Object.keys(paymentInfo)
      depositState.fundTypeList = paymentInfoKeys
    }
  })
  watchEffect(() => {
    if (depositState.fundTypeList.length) {
      depositState.usingFundType = depositState.fundTypeList[0]
    }
  })
  watchEffect(() => {
    if (depositState.paymentDetail.extra_remark && depositState.paymentDetail.extra_remark.length > 0) {
      const combinedRemark = depositState.paymentDetail.extra_remark.map((item) => {
        const remark: Request.DepositExtraRemark = {
          id: item.id,
          type: item.type,
          content: item.content ?? ""
        }

        return remark
      })

      depositState.form.extra_remark = combinedRemark
    }
  })

  // 切換金流類型
  watchEffect(() => {
    if (Object.keys(depositState.list).length && depositState.form.currency && depositState.usingFundType) {
      // 使用 nextTick 確保所有狀態都已更新
      nextTick(() => {
        // 重設 extra_remark, 避免保留上一個 payment_gateway的config
        depositState.form.extra_remark = []

        const paymentInfo = depositState.list[depositState.form.currency]
        const payments = paymentInfo[depositState.usingFundType]
        if (!payments) return
        depositState.usingPaymentInfoList = payments
        if (payments.length) {
          depositState.form.payment_gateway_id = payments[0].id
        } else {
          depositState.form.payment_gateway_id = 0
        }
      })
    }
  })

  watchEffect(async () => {
    if (depositState.form.payment_gateway_id) {
      // 重設 extra_remark, 避免保留上一個 payment_gateway的config
      depositState.form.extra_remark = []

      const { status, data } = await useApi(bankApi.depositPaymentDetail, depositState.form.payment_gateway_id)
      if (status) {
        // 判斷有額外欄位時, 再塞入form 表單動態欄位[重要]
        if (data.extra_field_key) {
          data.extra_field[data.extra_field_key].map((field) => {
            depositState.form[data.extra_field_key] = {
              ...depositState.form[data.extra_field_key],
              [field.field_name]: ""
            }
          })
        }

        if (!data.qrcode_image_id) {
          depositState.paymentDetail = { ...data, imgUrl: "" }
        } else {
          const { data: PaymentImg } = await useApi(bankApi.getPaymentImg, data.qrcode_image_id)
          depositState.paymentDetail = { ...data, ...{ imgUrl: PaymentImg } }
        }

        // 判斷當API有快選金額時就帶入, 否則就直接預設金額快選
        if (depositState.paymentDetail.quick_amounts.length) {
          depositState.quickBtns = depositState.paymentDetail.quick_amounts
        } else {
          depositState.quickBtns = defaultQuickAmount
        }
      }
    }
  })

  //#endregion

  //#region withdraw

  const needWithdrawalPassword = computed(
    () =>
      withdrawal_password === WITHDRAWAL_PASSWORD.Enums.Require &&
      withdrawState.usingFundType !== FUND_METHOD_TYPE.BackendKeysEnums.ExternalChannelTransfer
  )

  const withdrawState = reactive<withdrawState>({
    list: {},
    supportedCurrency: [],
    fundTypeList: [],
    usingFundType: "",
    usingPaymentInfoList: [],
    form: {
      id: 0,
      amount: "",
      payment_gateway_id: null,
      payment_gateway_name: "",
      payment_type_id: 0,
      currency: "",
      bank_id: 0,
      balance: "",
      crypto_rate: "",
      remaining_turnover: "",
      withdrawal_password: "",
      images: []
    },
    uploadConfig: {
      transCode: "",
      images: [],
      uploadSwitch: Boolean(envInfo.upload_details),
      uploadRemark: {
        images: [],
        content: []
      }
    },
    paymentDetail: {
      withdraw_min: "",
      withdraw_max: "",
      audit_rate: "",
      fee_type: FEE_TYPE.Enums.Amount,
      fee_amount: "",
      fee_rate: "",
      extra_field: {},
      extra_field_key: ""
    },
    bankCards: [],
    gateWayHidden: false
  })

  const initWithdrawPayemntDetail = async () => {
    withdrawState.paymentDetail = {
      withdraw_min: "",
      withdraw_max: "",
      audit_rate: "",
      fee_type: FEE_TYPE.Enums.Amount,
      fee_amount: "",
      fee_rate: "",
      extra_field: {},
      extra_field_key: ""
    }
  }

  async function getWithdralPaymentList() {
    const { status, data } = await useApi(bankApi.withdrawPaymentList)
    if (status) {
      withdrawState.list = data.list
      withdrawState.supportedCurrency = [...data.supported_currency]
      if (!data.supported_currency.length) return

      if (data.supported_currency.includes(activeWalletLabel.value)) {
        handleWithdralCurrencyClick(activeWalletLabel.value)
        withdrawState.form.currency = activeWalletLabel.value
      } else {
        handleWithdralCurrencyClick(data.supported_currency[0])
        withdrawState.form.currency = data.supported_currency[0]
      }
    }
  }

  async function getWithdralPaymentDetail(gatewayId: number) {
    const { status, data } = await useApi(bankApi.withdrawPaymentDetail, gatewayId)
    if (status) {
      withdrawState.paymentDetail = data
    }
  }

  function handleWithdralUploadImageDelete(index: number) {
    withdrawState.uploadConfig.images.splice(index, 1)
  }

  const handleWithdralCurrencyClick = async (currency: string) => {
    // if (withdrawState.form.currency === currency) return

    try {
      $q.loading.show()

      // update form status
      withdrawState.form.currency = currency
      withdrawState.form.bank_id = 0

      // get payment type list
      await getPaymentTypeList(currency)

      // init payment detail
      initWithdrawPayemntDetail()

      // update balance info
      const currencyItem = userWalletList.value.filter((item) => item.currency_code === currency)
      if (currencyItem.length) {
        withdrawState.form.balance = currencyItem[0].balance
        withdrawState.form.remaining_turnover = currencyItem[0].remaining_turnover || "2000"
      }
    } finally {
      $q.loading.hide()
    }
  }

  function handleWithdralFundTypeClick(fundType: string) {
    initWithdrawPayemntDetail()
    // 目前出款 銀行轉帳/虛擬貨幣 支付渠道是隱藏的
    switch (fundType) {
      case "CryptoWallet":
      case "BankTransfer":
        withdrawState.gateWayHidden = true
        break
      default:
        withdrawState.gateWayHidden = false
        break
    }

    withdrawState.usingFundType = fundType
  }

  function handleWithdralPaymentClick(type: number, id: number) {
    withdrawState.form.payment_type_id = type
    initWithdrawPayemntDetail()
    if (withdrawState.form.payment_gateway_id) {
      withdrawState.form.payment_gateway_id = id
    }
  }

  function handleWithdralBankCardClick(id: number, rate: string | number) {
    withdrawState.form.bank_id = id
    withdrawState.form.crypto_rate = rate
  }

  const handlerWithdrawal = async () => {
    if (withdrawState.usingFundType === FUND_METHOD_TYPE.BackendKeysEnums.ExternalChannelTransfer) {
      return await handleMayaLogin()
    } else {
      return await handleWithdralSubmit()
    }
  }

  // maya出款的第一步，確認是否需要登入
  const handleMayaLogin = async () => {
    $q.loading.show()

    const paymentInfo = withdrawState.list[withdrawState.form.currency]
    // 取得maya類型的name
    withdrawState.form.payment_gateway_name = paymentInfo[withdrawState.usingFundType].find(
      (item) => item.id === withdrawState.form.payment_gateway_id
    )?.name

    const mayaData = {
      payment_gateway_name: withdrawState.form.payment_gateway_name,
      currency: withdrawState.form.currency,
      amount: withdrawState.form.amount
    }

    localStorage.setItem("mayaData", JSON.stringify(mayaData))

    const { status, data } = await useApi(bankApi.getMayaLoginInfo, withdrawState.form.payment_gateway_name)
    if (status) {
      if (data.IsNeedLogin) {
        // 需要登入就要前往maya登入畫面，去取得token
        const authorizeDomainUrl = data?.AuthorizeDomainUrl
        if (authorizeDomainUrl) {
          location.href = authorizeDomainUrl
        }
      } else {
        // 不用登入可以直接申請出款
        const status = await handlerSendMayaWithdraw({
          currency: withdrawState.form.currency,
          amount: withdrawState.form.amount
        })

        $q.loading.hide()
        return status
      }
    }

    $q.loading.hide()
  }

  // 傳送maya token給後端
  const handlerSendMayaToken = async (params: Request.SendMayaToken) => {
    const { status } = await useApi(bankApi.sendMayaToken, params)
    if (status) {
      const mayaData = JSON.parse(localStorage.getItem("mayaData") || "{}")
      const params = {
        currency: mayaData.currency,
        amount: mayaData.amount
      }
      // 成功後才可以申請出款
      const result = await handlerSendMayaWithdraw(params)
      return result
    }

    return false
  }

  // 發送maya出款申請給後端
  const handlerSendMayaWithdraw = async (params: Request.SendMayaWithdraw) => {
    const { status } = await useApi(bankApi.sendMayaWithdraw, params)
    localStorage.removeItem("mayaData")
    if (status) {
      $q.notify({
        type: "positive",
        message: t("common.alarm.createSuccess"),
        position: "top",
        timeout: 1000
      })
    }
    return status
  }

  async function handleWithdralSubmit() {
    if (!withdrawState.form.bank_id) {
      $q.notify({
        type: "negative",
        message: t("common.alarm.pleaseSelectBankCard"),
        position: "top",
        timeout: 1000
      })
      return
    }

    // if (withdrawState.form.remaining_turnover !== "0") {
    //   $q.notify({
    //     type: "negative",
    //     message: t("common.alarm.checkAudit"),
    //     position: "top",
    //     timeout: 1000
    //   })
    //   return
    // }

    try {
      $q.loading.show()
      const newForm: Ref<Request.Withdraw> = ref({
        id: 0,
        amount: "",
        payment_type_id: 0,
        payment_gateway_id: null,
        crypto_rate: 0,
        currency: "",
        bank_id: 0,
        remaining_turnover: "",
        withdrawal_password: "",
        balance: ""
      })

      newForm.value = withdrawState.form
      // if (withdrawState.form.payment_type_id !== 1) {
      //   newForm.value = withdrawState.form
      // } else {
      //   newForm.value = {
      //     amount: withdrawState.form.amount,
      //     payment_type_id: withdrawState.form.payment_type_id,
      //     currency: withdrawState.form.currency,
      //     bank_id: withdrawState.form.bank_id
      //   }
      // }
      const { status } = await useApi(bankApi.withdraw, newForm.value)
      if (status) {
        // 清空選到的銀行卡與渠道
        withdrawState.form.bank_id = 0
        $q.notify({
          type: "positive",
          message: t("common.alarm.createSuccess"),
          position: "top",
          timeout: 1000
        })
      }
      $q.loading.hide()
      return status
    } catch (error) {
      $q.loading.hide()
    }
  }

  async function handleMayaWithdrawalSubmit() {
    try {
      $q.loading.show()
      const { status, code } = await useApi(bankApi.mayaWithdraw, mayaDepositWithdrawalState.form)
      $q.loading.hide()
      return { status, code }
    } catch (error) {
      $q.loading.hide()
      return {
        status: false,
        data: undefined,
        code: ERROR_CODE_TYPE.Enums.SERVER_EXCEPTION
      }
    }
  }

  function checkWithdrawalPassword(item: ICheckWithdrawalPassword) {
    if (
      userInfo.value.has_withdrawal_password ||
      userInfo2.value.has_withdrawal_password ||
      accountInfo.value.has_withdrawal_password ||
      !needWithdrawalPassword.value
    ) {
      return
    }

    if (item.routeName) {
      router.push({ name: item.routeName })
      return
    }

    if (item.openSetWithdrawalPassword) {
      eventbus.emit("openSetWithdrawalPassword", true)
      return
    }

    if (item.cb) {
      item.cb()
    }
  }

  async function getPromotionList() {
    if (!depositState.list || Object.keys(depositState.list).length === 0) return

    // 驗證 payment_gateway_id 是否有效，避免後端驗證失敗
    if (!depositState.form.payment_gateway_id || depositState.form.payment_gateway_id === 0) {
      console.warn("[Deposit Promotion] payment_gateway_id 無效，跳過優惠列表請求", {
        payment_gateway_id: depositState.form.payment_gateway_id,
        currency: depositState.form.currency,
        fundType: depositState.usingFundType
      })
      // 清空優惠列表
      const states = [depositState, mayaDepositWithdrawalState]
      states.forEach((state) => {
        state.promotion_list = []
        state.form.promotion_id = 0
      })
      return
    }

    const { status, data } = await useApi(bankApi.getDepositPromotionList, depositState.form)

    if (status) {
      const promotionList = data ? data : []

      const mappedPromotions = promotionList.map((item: any) => {
        const languageDetails = item.details[nowLang.value]
        return {
          ...item,
          title: languageDetails?.title ?? ""
        }
      })

      const states = [depositState, mayaDepositWithdrawalState]
      states.forEach((state) => {
        state.promotion_list = mappedPromotions
        state.form.promotion_id = 0
      })
    }
  }

  async function getMayaPromotionList(amount: string) {
    if (amount === "") return

    // 檢查 depositState.list 是否有資料，沒有資料就不發出請求
    if (!depositState.list || Object.keys(depositState.list).length === 0) {
      return
    }

    // maya 固定拿第一個payment的id來打存款優惠清單
    const firstPayment = depositState.list[depositState.supportedCurrency[0]]

    // 檢查 firstPayment 是否存在且有效
    if (!firstPayment || !Object.keys(firstPayment).length) {
      return
    }

    const firstPaymentId = firstPayment[Object.keys(firstPayment)[0]][0].id

    const payload: Request.Deposit = {
      amount: amount,
      payment_gateway_id: firstPaymentId,
      currency: depositState.supportedCurrency[0],
      promotion_id: 0,
      extra_remark: [],
      images: []
    }

    const { status, data } = await useApi(bankApi.getDepositPromotionList, payload)

    if (status) {
      const promotionList = data ? data : []

      const mappedPromotions = promotionList.map((item: any) => {
        const languageDetails = item.details[nowLang.value]
        return {
          ...item,
          title: languageDetails?.title ?? ""
        }
      })

      mayaDepositWithdrawalState.promotion_list = mappedPromotions
      mayaDepositWithdrawalState.form.promotion_id = data[0].id
    }
  }

  const formatterCurrency = (currencyCode?: string) => {
    if (isGOG.value && currencyCode === "CNY") {
      return "USDT"
    }

    if (isIDRToEUR.value && currencyCode === "IDR") {
      return "EUR"
    }

    if (isNBL1.value && currencyCode === "IDR") {
      return "Rp"
    }

    return currencyCode
  }

  // 取得支付圖片
  watchEffect(() => {
    // 目前銀行轉帳/ 虛擬錢包  是沒有支付渠道(方式)的
    if (
      !withdrawState.form.payment_type_id ||
      withdrawState.form.payment_type_id === 1 ||
      withdrawState.form.payment_type_id === 3
    )
      return
    if (withdrawState.usingPaymentInfoList.length) {
      getPaymentImg(withdrawState.list)
    }
  })

  // 切換幣別
  watchEffect(() => {
    if (Object.keys(withdrawState.list).length && withdrawState.form.currency) {
      const paymentInfo = withdrawState.list[withdrawState.form.currency]
      const paymentInfoKeys = Object.keys(paymentInfo)
      withdrawState.fundTypeList = paymentInfoKeys
    }
  })

  // 初始化金流類型
  watchEffect(() => {
    if (withdrawState.fundTypeList.length) {
      handleWithdralFundTypeClick(withdrawState.fundTypeList[0])
      // withdrawState.usingFundType = withdrawState.fundTypeList[0]
    }
  })
  watchEffect(() => {
    if (withdrawState.fundTypeList.length && withdrawState.usingFundType) {
      handleWithdralBankCardClick(0, 0)
      withdrawState.form.payment_type_id = Number(
        FUND_METHOD_TYPE.Enums[withdrawState.usingFundType as any as FUND_METHOD_TYPE.Enums]
      )
    }
  })

  // 切換金流類型
  watchEffect(() => {
    if (Object.keys(withdrawState.list).length && withdrawState.form.currency && withdrawState.usingFundType) {
      // 使用 nextTick 確保所有狀態都已更新
      nextTick(() => {
        const paymentInfo = withdrawState.list[withdrawState.form.currency]
        const payments = paymentInfo[withdrawState.usingFundType]
        if (!payments || withdrawState.gateWayHidden) {
          withdrawState.form.payment_gateway_id = null
          return
        }

        withdrawState.usingPaymentInfoList = payments
        if (payments.length) {
          withdrawState.form.payment_gateway_id = payments[0].id
        } else {
          withdrawState.form.payment_gateway_id = null
        }
      })
    }
  })

  watchEffect(async () => {
    if (!withdrawState.form.currency || !withdrawState.usingFundType) return

    const currency_id = currencyList.value.find((e) => e.label === withdrawState.form.currency)?.value
    const payment_type_id = paymentTypeList.value.find((e) => e.name === withdrawState.usingFundType)?.value

    switch (Number(payment_type_id)) {
      case FUND_METHOD_TYPE.Enums.EWallet:
      case FUND_METHOD_TYPE.Enums.CryptoPayment:
        if (currency_id && payment_type_id && withdrawState.form.payment_gateway_id) {
          const payload = {
            currency_id: `${currency_id}`,
            payment_type_id,
            payment_gateway_id: withdrawState.form.payment_gateway_id
          }

          await debounceGetBankCardList(payload)
        }
        break
      default:
        if (currency_id && payment_type_id) {
          const payload = {
            currency_id: `${currency_id}`,
            payment_type_id
          }

          await debounceGetBankCardList(payload)
        }
        break
    }
  })

  watchEffect(async () => {
    if (withdrawState.form.payment_gateway_id) {
      // 重設 extra_remark, 避免保留上一個 payment_gateway的config
      withdrawState.form.extra_remark = []

      const { status, data } = await useApi(bankApi.withdrawPaymentDetail, withdrawState.form.payment_gateway_id)
      if (status) {
        // 判斷有額外欄位時, 再塞入form 表單動態欄位[重要]
        if (data.extra_field_key) {
          data.extra_field[data.extra_field_key].map((field) => {
            withdrawState.form[data.extra_field_key] = {
              ...withdrawState.form[data.extra_field_key],
              [field.field_name]: ""
            }
          })
        }

        withdrawState.paymentDetail = { ...data }
      }
    }
  })

  const debounceGetBankCardList = debounce(async (payload) => {
    const { status, data } = await useApi(bankApi.getBankCardList, payload)

    if (status) {
      withdrawState.bankCards = data.list
    }
  }, 300)

  //#endregion

  onMounted(() => {
    // getPaymentTypeList(bankCardState.form.currency)
    // getBankList(String(withdrawState.form.payment_gateway_id))
    // getGatewayList()
  })

  return {
    // 依照後端給的key name 做type 的翻譯用
    typeI18n,
    // 判斷是否顯示渠道區塊
    showGateway,
    /** 幣別清單 */
    currencyList,

    /** 渠道清單 */
    gatewayFilterList,

    // 不區分贈金錢包與錢包的  幣別清單
    currencyIdMap,
    currencyCodeMap,
    availCurrencyList,

    /** 取得首存優惠 */
    getFirstDepositPromotion,

    /** 取得幣別列表 */
    firstDepositPromotionInfo,

    getAvailCurrencyList,

    /** 支付類型對照表 */
    paymentTypeList,

    /** 支付渠道對照表  篩選過payment type */
    paymentGatewayList,

    /** 支付渠道對照表 */
    totalPaymentGatewayList,

    /** 切換 payment type 時要fitler 過新的渠道list */
    getUsingPaymentGatewayList,

    /** 取得支付類型列表 */
    getPaymentTypeList,

    /** 虛擬幣種匯率 */
    cryptoRate,

    /** 虛擬幣種換算匯率 */
    getWithdrawCryptoRate,

    /** 虛擬幣種列表 */
    cryptoList,

    /** 取得虛擬幣種列表 */
    getCryptoList,

    /** 電子支付銀行列表 */
    bankList,

    /** 取得電子支付銀行列表 */
    getBankList,

    /** 取得渠道列表 */
    getGatewayList,

    /** 驗證account number */
    validateNumeric,

    /** 驗證account number (數字+英文) */
    validateAlphanumeric,

    /** 銀行卡資料 */
    bankCardState,

    /** 取得銀行卡列表 */
    getBankCardList,

    /** 取得單筆銀行卡資料 */
    getBankCardInfo,

    /** 新增銀行卡點擊幣別 */
    handleBankCardCurrencyClick,

    /** 新增銀行卡點擊支付類型 */
    handleBankCardPaymentTypeClick,

    /** 新增銀行卡 - 電子支付 - 點擊銀行 */
    handleBankCardBankClick,

    /** 新增銀行卡 - 虛擬幣種 - 點擊虛擬幣種下拉選單 */
    handleBankCardCryptoClick,

    /** 新增銀行卡 */
    handleBankCardAdd,

    /** 編輯銀行卡 */
    handleBankCardEdit,

    /** 刪除銀行卡 */
    handleBankCardDelete,

    /** 取得出款銀行卡 */
    getWithdrawBankCardList,

    /** 重置新增銀行卡表單 */
    resetBankCardForm,

    /** 存款資料 */
    depositState,

    /** 取得存款優惠 */
    getPromotionList,

    /** 取得MAYA存款優惠 */
    getMayaPromotionList,

    /** 取得存款支付資訊 */
    getDepositPaymentList,

    /** 存款資訊幣別點擊 */
    handleDepositCurrencyClick,

    /** 存款資訊支付類型點擊 */
    handleDepositFundTypeClick,

    /** 存款資訊支付通道選擇 */
    handleDepositPaymentClick,

    /** 存款資訊快速設定金額 */
    handleDepositQuickBtnClick,

    /** Maya 存款快速設定金額 */
    handleMayaDepositQuickBtnClick,

    /** 存款QR-code 上傳圖片刪除 */
    handleDepositUploadImageDelete,

    /** 存款 post api */
    handleDepositSubmit,

    /** Maya 存款 post api */
    handleMayaDepositSubmit,

    /** 出款資料 */
    withdrawState,

    /** 是否需要出款密碼 */
    needWithdrawalPassword,

    /** 取得出款支付資訊 */
    getWithdralPaymentList,

    /** 取得出款支付詳細資訊 - 帶入渠道id */
    getWithdralPaymentDetail,

    /** 出款QR-code 上傳圖片刪除 */
    handleWithdralUploadImageDelete,

    /** 出款資訊幣別點擊 */
    handleWithdralCurrencyClick,

    /** 出款資訊支付類型點擊 */
    handleWithdralFundTypeClick,

    /** 出款資訊支付通道選擇 */
    handleWithdralPaymentClick,

    /** 出款資訊銀行卡選擇 */
    handleWithdralBankCardClick,

    /** 判斷要使用哪個出款 api */
    handlerWithdrawal,

    /** 傳送maya token給後端 */
    handlerSendMayaToken,

    /** 出款 post api */
    handleWithdralSubmit,

    /** Maya 出款 post api */
    handleMayaWithdrawalSubmit,

    /** 檢查出款密碼 */
    checkWithdrawalPassword,

    /** Maya 存取款資料 */
    mayaDepositWithdrawalState,

    /*選取某個活動*/
    handlePromotionClick,

    /** Maya 存款活動選取 */
    handleMayaDepositPromotionClick,

    /** 格式化幣別(特規情境) */
    formatterCurrency
  }
}
