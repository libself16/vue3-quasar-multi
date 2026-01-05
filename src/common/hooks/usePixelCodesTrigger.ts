import { watch } from "vue"
import { useRoute } from "vue-router"
import { storeToRefs } from "pinia"
import { useInitStore } from "src/stores/initStore"
import { useEventBus } from "src/common/hooks/useEventBus"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

export function usePixelCodesTrigger() {
  const route = useRoute()
  const initStore = useInitStore()
  const { isReady } = storeToRefs(initStore)
  const { eventOn } = useEventBus()
  const { handleTriggerPixelCode } = usePixelCodes()

  eventOn("openDeposit", (show: boolean) => {
    if (show) {
      handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT)
    }
  })

  eventOn("openDepositDialog", (show: boolean) => {
    if (show) {
      handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT)
    }
  })

  eventOn("openDepositWithWithdrawal", (show: boolean, type?: string) => {
    if (show && type === "deposit") {
      handleTriggerPixelCode(PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT)
    }
  })

  watch(
    [() => isReady.value, () => route.name],
    ([newReady, newRoute], [oldReady, oldRoute]) => {
      const pixelCodes = route?.meta?.triggerPixelCodes as PIXEL_CODE_TYPE.Enums[]

      if (newReady && pixelCodes && pixelCodes.length) {
        pixelCodes.forEach((pixelCode) => {
          handleTriggerPixelCode(pixelCode)
        })
      }
    },
    { immediate: true }
  )

  return {}
}
