import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, ref } from "vue"

export function useSlideVerify() {
  const eventbus = injectStrict(EventBusKey)
  const verifyStatus = ref(false)
  let callbackList: (() => void | Promise<void>)[] = []

  // 不走callback使用狀態判斷
  const isVerify = computed(() => verifyStatus.value)
  function setVerifyFalse() {
    verifyStatus.value = false
  }

  function showVerifyModal(callback?: (() => void | Promise<void>)[]) {
    eventbus.emit("openSlideVerify", true)
    if (callback && callback.length) {
      callbackList = callback
    }
  }

  function initVerify() {
    verifyStatus.value = false
    callbackList.length = 0
  }

  onMounted(() => {
    eventbus.on("verifyResult", (status: boolean) => {
      verifyStatus.value = status
      if (status && callbackList.length) {
        Promise.all(callbackList.map((func) => func()))
          .finally(() => {
            initVerify()
          })
          .catch((error) => {
            console.error(error)
            initVerify()
          })
      }
    })
  })

  return {
    isVerify,
    setVerifyFalse,
    showVerifyModal
  }
}
