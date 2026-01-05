import { computed } from "vue"
import { FEE_TYPE } from "src/common/utils/constants"

interface PaymentDetail {
  fee_type: FEE_TYPE.Enums
  fee_amount: string
  fee_rate: string
}

export function usePayment() {
  const hasFee = computed(() => (paymentDetail: PaymentDetail) => {
    return (
      (paymentDetail.fee_type === FEE_TYPE.Enums.Amount && paymentDetail.fee_amount !== "0") ||
      (paymentDetail.fee_type === FEE_TYPE.Enums.Rate && paymentDetail.fee_rate !== "0")
    )
  })

  return {
    // 檢查是否顯示手續費
    hasFee
  }
}
