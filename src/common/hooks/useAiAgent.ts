import { useI18n } from "vue-i18n"
import { AgentBetEnum } from "src/common/utils/constants/AIAgentType"

export function useAiAgent() {
  const { t } = useI18n()

  // 過濾為百分比
  const formatPercentage = (value: string) => {
    const numValue = parseFloat(value)

    if (isNaN(numValue)) {
      return value
    }

    return `${Math.round(numValue * 100)}%`
  }

  // 投注盤面翻譯
  const translateBetAreaIndex = (index: number) => {
    // 取得 Enum 的鍵值來進行映射
    const enumEntries = Object.entries(AgentBetEnum)

    const enumItem = enumEntries.find(([key, value]) => value === index)

    if (!enumItem) {
      // 防呆用的翻譯
      return t("ai.wait_add_game_name")
    }

    const enumName = enumItem[0]
    const i18nKey = enumName.replace(/([A-Z])/g, (match, p1, offset) => (offset > 0 ? "_" : "") + p1.toLowerCase())

    return t(`ai.${i18nKey}`)
  }

  return {
    formatPercentage,
    translateBetAreaIndex
  }
}
