import { customRef } from "vue"
import { GENDER } from "src/common/utils/constants"
import { useI18n } from "vue-i18n"
import * as Response from "src/api/response.type"

// 使用 RegistInputCustom 中的 column_rule 類型定義
export type CustomColumnRuleType = NonNullable<Response.RegistInputCustom["column_rule"]>

export const DEFAULT_CUSTOM_COLUMN_RULE: CustomColumnRuleType = {
  enabled: false,
  maxLength: 20,
  minLength: 10,
  requireNumber: false,
  requireSpecialChar: false,
  requireUpperLowerCase: false
}

export function useRule() {
  const { t } = useI18n()

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/
  const phoneMask = "(##) ### - ### - ####"
  const otpRegex = /^\d{4}$/

  const account = (val: string, customMessage?: string, customRule?: CustomColumnRuleType) => {
    if (!val || val === "") {
      return customMessage || t("common.validate.mustNotBeEmpty")
    }

    if (customRule?.enabled) {
      if (customRule.requireUpperLowerCase) {
        if (!/[A-Z]/.test(val) || !/[a-z]/.test(val)) {
          return t("common.validate.needUpperLowerLetters")
        }
      }

      if (customRule.requireNumber) {
        if (!/\d/.test(val)) {
          return t("common.validate.needNumber")
        }
      }

      if (customRule.minLength !== undefined && val.length < customRule.minLength) {
        return t("common.validate.limitMinLength", { num: customRule.minLength }) + t("common.validate.Bit")
      }

      if (customRule.maxLength !== undefined && val.length > customRule.maxLength) {
        return t("common.validate.limitLength", { num: customRule.maxLength }) + t("common.validate.Bit")
      }

      if (customRule.requireSpecialChar) {
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(val)) {
          return t("common.validate.needSpecialSymbol")
        }
      }

      return true
    }

    return true
  }

  const password = (val: string, customMessage?: string, customRule?: CustomColumnRuleType) => {
    if (!val || val === "") {
      return customMessage || t("common.validate.mustNotBeEmpty")
    }

    if (customRule?.enabled) {
      if (customRule.requireUpperLowerCase) {
        if (!/[A-Z]/.test(val) || !/[a-z]/.test(val)) {
          return t("common.validate.needUpperLowerLetters")
        }
      }

      if (customRule.requireNumber) {
        if (!/\d/.test(val)) {
          return t("common.validate.needNumber")
        }
      }

      if (customRule.minLength !== undefined && val.length < customRule.minLength) {
        return t("common.validate.limitMinLength", { num: customRule.minLength }) + t("common.validate.Bit")
      }

      if (customRule.maxLength !== undefined && val.length > customRule.maxLength) {
        return t("common.validate.limitLength", { num: customRule.maxLength }) + t("common.validate.Bit")
      }

      if (customRule.requireSpecialChar) {
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(val)) {
          return t("common.validate.needSpecialSymbol")
        }
      }

      return true
    }

    return true
  }

  const phone = (val: string, customMessage?: string) => {
    if (!val || val === "") {
      return customMessage || t("common.validate.phoneFormatError")
    }

    if (!phoneRegex.test(val)) {
      return t("common.validate.phoneFormatError")
    }

    return true
  }

  const handleAccountValidate = (val: string, isPhoneRegisterMode: boolean) => {
    if (isPhoneRegisterMode) {
      return phone(val)
    }

    return account(val, undefined, undefined)
  }

  // 限制只能輸入正整數 & 小數點
  const validatePositiveNumber = (e: KeyboardEvent) => {
    const inputElement = e.target as HTMLInputElement
    const currentValue = inputElement.value
    const key = e.key

    // 去除千分號
    const sanitizedValue = currentValue.replace(/,/g, "")

    // 構造新的值，包括當前輸入的鍵
    const newValue = sanitizedValue + key

    // 驗證格式
    if (!/^\d*\.?\d*$/.test(newValue)) {
      e.preventDefault() // 阻止無效輸入
    }
  }

  interface PositiveIntegerOptions {
    min?: number
    max?: number
    modelValue: {
      value: string
    }
  }

  // 限制只能輸入正整數，允許自定義最小值和最大值
  const usePositiveInteger = (options: PositiveIntegerOptions) => {
    // default min and max value
    const { min = 100, max = 100000 } = options

    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return options.modelValue.value
        },
        set(newValue: string) {
          // 移除所有非數字（包括小數點, 負號, 逗號, 空格, 中英文）
          const sanitizedValue = newValue.replace(/[^0-9]/g, "")

          // 轉換為數字進行範圍驗證
          const numValue = parseInt(sanitizedValue)

          if (numValue > max) {
            // 如果數字大於最大值，則將數字設為最大值
            options.modelValue.value = max.toString()
          } else {
            options.modelValue.value = sanitizedValue
          }

          trigger()
        }
      }
    })
  }

  return {
    noRule: () => true,
    /** 必填 */
    required: (customMessage?: string) => (val: string | number) => {
      if (typeof val === "string") {
        return (!!val && val.length > 0) || customMessage || t("common.validate.mustNotBeEmpty")
      }
      return !!val || customMessage || t("common.validate.mustNotBeEmpty")
    },
    requiredInt: (val: string) => !!val || t("common.validate.mustNotBeEmpty"),
    requiredGender: (val: GENDER.Enums) => {
      if (!Object.values(GENDER.Enums).includes(val)) {
        return t("common.validate.mustNotBeEmpty")
      }
      return true
    },

    /** 不允許空白字元 */
    noWhitespace: (customMessage?: string) => (val: string) => {
      const hasWhitespace = /\s/.test(val)
      return !hasWhitespace || customMessage || t("common.validate.noWhitespaceAllowed")
    },

    /** 帳號規則 */
    account,

    /** 密碼規則 */
    password,

    /** 新密碼規則 */
    newPassword: (oldPassword: string, newPasswordew: string) => {
      if (oldPassword === newPasswordew) {
        return t("common.validate.newPasswordValidation")
      }
      return true
    },

    /** 確認密碼規則 */
    confirmPassword: (newPassword: string, nconfirmPasswordew: string) => {
      if (newPassword !== nconfirmPasswordew) {
        return t("common.validate.confimrPasswordValidation")
      }
      return true
    },

    /** 全名規則 */
    fullname: (val: string, customMessage?: string) => {
      if (!val || val === "") {
        return customMessage ?? t("common.validate.mustNotBeEmpty")
      }
      return true
    },

    /** 信箱規則 */
    email: (val: string) => {
      if (!val || val === "") {
        return t("common.validate.mustNotBeEmpty")
      }

      if (!emailRegex.test(val)) {
        return t("common.validate.emailFormatError")
      }

      return true
    },

    /** 手機規則 */
    phone,

    /** 存款金額規則 */
    depositAmount: ({ min, max, val }: { min: string; max: string; val: string }) => {
      const numberVal = Number(val)

      if (isNaN(numberVal)) {
        return t("common.validate.numberFormatError")
      }

      const numberMin = Number(min)
      const numberMax = Number(max)

      if (numberVal < numberMin) {
        return t("common.validate.amountExceedMinLimit")
      }

      if (numberVal > numberMax) {
        return t("common.validate.amountExceedMaxLimit")
      }

      return true
    },
    /** 帳號驗證 */
    handleAccountValidate,

    /** 手機號碼input mask */
    phoneMask,

    /** 信箱規則 */
    otp: (val: string) => {
      if (!val || val === "") {
        return t("common.validate.verifyCodeError")
      }

      if (!otpRegex.test(val)) {
        return t("common.validate.verifyCodeError")
      }

      return true
    },

    /** 限制只能輸入正整數 & 小數點 */
    validatePositiveNumber,

    /** 限制只能輸入正整數，允許自定義最小值和最大值 */
    usePositiveInteger
  }
}
