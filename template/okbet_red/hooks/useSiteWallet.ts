import { useCommon } from "src/common/hooks/useCommon"
import { useSesstion } from "src/common/hooks/useSesstion"
import { useAgentCode } from "src/common/hooks/useAgentCode"

export function useSiteWallet() {
  const { moneyFormat, discardThreeDigits } = useCommon()
  const { isA99M } = useAgentCode()
  const { isDiscardThreeDigits } = useSesstion()

  const formatWalletBalance = (balance: string) => {
    const cleanBalance = balance.replace(/,/g, "")

    if (isA99M.value && isDiscardThreeDigits?.value) {
      return moneyFormat(discardThreeDigits(cleanBalance), 2)
    }

    return moneyFormat(cleanBalance, 2)
  }

  return {
    /** A99M 無條件捨去三位數字 */
    formatWalletBalance
  }
}
