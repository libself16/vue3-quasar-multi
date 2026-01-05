import { computed } from "vue"
import { storeToRefs } from "pinia"
import { getPixelCodes } from "src/api/pixelCodes"
import { usePixelCodeStore } from "src/stores/pixelCodeStore"
import { useApi } from "src/common/hooks/useApi"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

export function usePixelCodes() {
  const pixelCodeStore = usePixelCodeStore()
  const { pixelCodeState } = storeToRefs(pixelCodeStore)
  const { setStorePixelCodeList } = pixelCodeStore

  const pixelCodedMap = computed(() => {
    return Object.fromEntries(pixelCodeState.value.list.map((item) => [item.type, item]))
  })

  const handleGetPixelCodes = async () => {
    const { status, data } = await useApi(getPixelCodes)

    if (status) {
      setStorePixelCodeList(data.list)

      const headItem = data.list.find((item) => item.type === PIXEL_CODE_TYPE.Enums.HEAD)

      if (headItem?.content) {
        const frag = document.createRange().createContextualFragment(headItem.content)
        const head = document.head
        head.insertBefore(frag, head.firstChild)
      }
    }
  }

  const handleTriggerPixelCode = (type: PIXEL_CODE_TYPE.Enums) => {
    const pixelCode = pixelCodedMap.value[type]

    if (pixelCode && pixelCode.is_enabled && pixelCode.content) {
      const runPixelCode = new Function(pixelCode.content)

      runPixelCode()
    }
  }

  return {
    PIXEL_CODE_TYPE,
    pixelCodedMap,
    handleGetPixelCodes,
    handleTriggerPixelCode
  }
}
