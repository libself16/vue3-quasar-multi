import * as Response from "src/api/response.type"
import { CustomColumnRuleType } from "src/common/hooks/useRule"

export function genPlaceholderByColumnRule(field: Response.RegistInputCustom): string | undefined {
  if (!field.column_rule || !field.column_rule.enabled) {
    return undefined
  }

  switch (field.column_name) {
    case "account":
      if (field.column_rule.minLength && field.column_rule.maxLength) {
        return $t("placeholder.pleaseEnterMinMaxAccount", {
          min: field.column_rule.minLength,
          max: field.column_rule.maxLength
        })
      }
      return undefined
    case "password":
      if (field.column_rule.minLength && field.column_rule.maxLength) {
        return $t("placeholder.pleaseEnterMinMaxPassword", {
          min: field.column_rule.minLength,
          max: field.column_rule.maxLength
        })
      }
      return undefined
    default:
      return undefined
  }
}

interface CheckCustomRuleProps {
  val: string
  Rules: any
  column_rule: CustomColumnRuleType
  column_name: string
}

export const checkCustomRule = ({ Rules, val, column_rule, column_name }: CheckCustomRuleProps) => {
  return (Rules[column_name as keyof typeof Rules] as any)?.(val, null, column_rule)
}
