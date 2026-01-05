import { useFileDialog } from "@vueuse/core"
import Decimal from "decimal.js"
import { copyToClipboard, openURL, useQuasar } from "quasar"
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"

interface ConvertToBase64ReturnType {
  /** base64 */
  data?: string

  /** 錯誤訊息 {String} */
  msg?: string

  /** 是否呼叫成功 {Boolean} */
  status: boolean
}

interface uploadImgInfo {
  image: { base64: string; path: string }
  status: boolean
}

export function useCommon() {
  const $q = useQuasar()
  const { t } = useI18n()

  function uploadImage() {
    const { open, reset, onChange } = useFileDialog({
      accept: "image/jpeg, image/png",
      directory: false
    })

    const maxSizeInMb = 5

    const uploadImageArr = ref<uploadImgInfo[]>([])

    const openUploader = () => {
      reset()
      open()
    }

    const uploadInit = (imgArr: uploadImgInfo[], size: number) => {
      uploadImageArr.value = imgArr // 初始資料

      onChange((files: any) => {
        if (files?.length === 0) return
        const reader = new FileReader()

        // 檢查檔案大小是否超過 5MB
        const maxSizeInBytes = maxSizeInMb * 1024 * 1024
        if (files![0].size > maxSizeInBytes) {
          $q.notify({
            type: "negative",
            message: $t("member.deposit.depositDetailUploadWarning", {
              mb: maxSizeInMb
            }),
            position: "top"
          })
          return
        }

        reader.onload = () => {
          const imgData = {
            image: {
              base64: reader.result as string,
              path: ""
            },
            status: false
          }

          // max 3 images
          if (imgArr.length >= size) {
            $q.notify({
              type: "negative",
              message: $t("member.deposit.depositDetailUploadExceedsMax"),
              position: "top"
            })
            return
          }

          // max 1 mb
          imgArr.push(imgData)

          // 帶出目前上傳後的圖片
          uploadImageArr.value = imgArr
        }

        reader.readAsDataURL(files![0])
      })
    }

    return {
      openUploader,
      uploadInit,
      maxSizeInMb,
      uploadImageArr
    }
  }

  function copyMessage(message: string) {
    if (!message) return
    // Copy with options
    copyToClipboard(message)
      .then(() => {
        $q.notify({
          type: "positive",
          message: t("common.alarm.copySuccess"),
          position: "top"
        })
      })
      .catch((error) => {
        $q.notify({
          type: "negative",
          message: `${t("common.alarm.copyFail")} : ${error}`,
          position: "top"
        })
      })
  }
  function genEnumToArray(enums: Record<string, number | string>): (number | string)[] {
    return Object.values(enums).filter((v) => !isNaN(Number(v)))
  }

  function genEnumToDropdown(enums: Record<string, number | string>, i18nKeys: typeof enums) {
    return genEnumToArray(enums).map((e) => {
      const value = e
      const label = i18nKeys[value]
      return {
        label,
        value
      }
    })
  }

  function openHtml(
    options = {
      /** 欲打開的HTML內容 */
      htmlContent: ""
    }
  ) {
    const htmlWindow = window.open("", "_blank")
    if (htmlWindow) {
      htmlWindow.document.write(`${options.htmlContent}`)
      htmlWindow.document.close()
      return
    }

    console.warn(`openHtml function exception: window.open failed`)
  }

  /**
   * 根據不同設備環境開啟 URL 的函數
   * 統一透過彈窗開啟,若被封鎖則延遲 1 秒後跳轉
   * @param url 要開啟的 URL
   * @param options 選項配置
   * @returns 是否成功開啟彈窗
   */
  function openUrlWithDevice(
    url: string,
    options: {
      /** 當彈出視窗被阻擋時的回調函數 */
      onReject?: () => void
    } = {}
  ) {
    const { isTelegramEnvironment } = useTelegram()
    const { onReject } = options

    // Telegram 環境特殊處理
    if (isTelegramEnvironment.value) {
      try {
        if ((window as any).Telegram?.WebApp) {
          ;(window as any).Telegram.WebApp.openLink(url)
          return true
        }
      } catch (error) {
        console.warn("[openUrlWithDevice] Telegram WebApp.openLink 失敗:", error)
      }
    }

    let newWindow: Window | null = null

    try {
      // 統一使用 window.open 嘗試開啟彈窗
      newWindow = window.open(url, "_blank")
    } catch (err) {
      console.warn("[openUrlWithDevice] window.open 例外:", err)
      // 發生例外,視為封鎖
      if (onReject) {
        onReject()
      } else {
        try {
          window.location.href = url
        } catch (redirectError) {
          console.error("[openUrlWithDevice] 頁面跳轉失敗:", redirectError)
        }
      }
      return false
    }

    // 延遲 1 秒後使用 document.hidden 檢測彈窗是否成功開啟
    setTimeout(() => {
      // document.hidden 為 true 表示當前頁面被隱藏(新視窗成功開啟並獲得焦點)
      // document.hidden 為 false 表示當前頁面仍可見(彈窗被封鎖)
      if (document.hidden) {
        console.log("[openUrlWithDevice] 彈窗成功開啟")
        // 嘗試聚焦新視窗
        try {
          newWindow?.focus()
        } catch (err) {
          console.log("[openUrlWithDevice] 無法聚焦彈窗:", err)
        }
      } else {
        console.warn("[openUrlWithDevice] 彈窗被封鎖 - document.hidden 為 false")

        if (onReject) {
          onReject()
        } else {
          try {
            window.location.href = url
          } catch (redirectError) {
            console.error("[openUrlWithDevice] 頁面跳轉失敗:", redirectError)
          }
        }
      }
    }, 1000)

    console.log("[openUrlWithDevice] 彈窗開啟中...")
    return true
  }

  /**
   * 處理滾輪滾動，將上下滾動轉換為左右滾動
   * @param event 滾輪事件
   * @param element 要滾動的 DOM 元素
   */
  const handleWheelScroll = (event: WheelEvent, element: HTMLElement) => {
    if (element) {
      // 檢查是否為觸控板手勢
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        // 觸控板左右滑動，不阻止默認行為
        return
      }

      // 滑鼠滾輪上下滾動，轉換為左右滾動
      event.preventDefault()
      const scrollAmount = event.deltaY
      element.scrollLeft += scrollAmount
    }
  }

  return {
    arrMove: (arr: any[], oldIndex: number, newIndex: number) => {
      if (newIndex >= arr.length) {
        let i = newIndex - arr.length + 1
        while (i--) {
          arr.push(undefined)
        }
      }
      arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
      return arr
    },

    /** 數值或字串轉換成千分位符數值 */
    moneyFormat: (money: string | number | undefined, roundingOff = 0): string | number => {
      if (!money) {
        return 0
      }
      let tempData = 0
      if (typeof money === "string") {
        try {
          tempData = Number(money)
        } catch (e) {
          return 0
        }
      } else if (typeof money === "undefined") {
        return 0
      } else {
        tempData = money
      }

      if (roundingOff > 0) {
        // 四捨五入到小數點下第 roundingOff 位
        tempData = Math.round(tempData * Math.pow(10, roundingOff)) / Math.pow(10, roundingOff)
      }

      const returnData = tempData.toString().split(".")
      returnData[0] = returnData[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return returnData.join(".")
    },

    /**
     * 四捨五入到小數點第n位
     * @params num: 值
     * @params decimal: 位數
     */
    roundTo(num: number, decimal: number) {
      return Math.round((num + Number.EPSILON) * Math.pow(10, decimal)) / Math.pow(10, decimal)
    },

    genEnumToArray,

    genEnumToDropdown,

    copyMessage,

    getValueFromUrl: function (key: string): string | null {
      // 從query string抓
      const searchParams = new URLSearchParams(window.location.search)
      let queryValue = searchParams.get(key)
      if (queryValue) return queryValue

      // 若沒抓到，從hash抓
      const hash = window.location.hash // 例如 "#/?sessionId=321321"
      const queryIndex = hash.indexOf("?")
      if (queryIndex !== -1) {
        const queryString = hash.slice(queryIndex + 1) // "sessionId=321321"
        const hashParams = new URLSearchParams(queryString)
        queryValue = hashParams.get(key)
        if (queryValue) return queryValue
      }

      return null
    },

    /** 數值轉換成K,M */
    formatNumberKM(num: number): string {
      if (!num) {
        return ""
      }

      if (num >= 1000000) {
        // 超過一百萬
        return (num / 1000000).toFixed(1) + "M"
      }

      if (num >= 1000) {
        // 超過一千
        return (num / 1000).toFixed(1) + "K"
      }
      // 不需要轉換
      return num.toString()
    },

    /** img file to base64 */
    convertToBase64(file: File): Promise<ConvertToBase64ReturnType> {
      return new Promise<ConvertToBase64ReturnType>((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
          if (reader.result) {
            // Type assertion is used here because reader.result is of type string | ArrayBuffer
            resolve({
              status: true,
              data: reader.result as string
            })
          } else {
            resolve({
              status: false,
              msg: "Failed to read file as base64"
            })
          }
        }

        reader.onerror = () => {
          resolve({
            status: false,
            msg: "Failed to read file"
          })
        }

        reader.readAsDataURL(file)
      })
    },

    openHtml,

    openUrlWithDevice,

    /**
     * 計算百分比並返回整數部分
     * @param {string|number} numerator - 分子
     * @param {string|number} denominator - 分母
     * @returns {number} 百分比的整數部分
     */
    calculatePercentage(numerator: string | number, denominator: string | number) {
      // 使用 Decimal.js 處理浮點數運算
      const num = new Decimal(numerator)
      const denom = new Decimal(denominator)
      if (num.greaterThan(denom) || num.equals(denom)) return 100
      const result = num.div(denom).times(100).floor().toNumber()
      // 計算百分比並只取整數部分
      return result > 100 ? 100 : result
    },

    /**
     * 精確加法
     * @params num1: 欲相加的數字
     * @params num2: 欲相加的數字
     */
    preciseAdd(num1: string | number, num2: string | number): number {
      return new Decimal(num1).plus(num2).toNumber()
    },

    /**
     * 精確減法
     * @params num1: 欲被減的數字
     * @params num2: 欲減去的數字
     */
    preciseSubtract(num1: string | number, num2: string | number): number {
      return new Decimal(num1).sub(num2).toNumber()
    },

    /**
     * 精確乘法
     * @params num1: 欲相乘的數字
     * @params num2: 欲相乘的數字
     */
    preciseMultiply(num1: string | number, num2: string | number): number {
      return new Decimal(num1).mul(num2).toNumber()
    },

    /**
     * 精確除法
     * @params num1: 欲被除的數字
     * @params num2: 欲除的數字
     */
    preciseDivide(num1: string | number, num2: string | number): number {
      return new Decimal(num1).div(num2).toNumber()
    },

    /**
     * 無條件捨去三位
     * @param numStr 數字字串
     * @returns number 處理後的結果
     */
    discardThreeDigits(numStr: string): number {
      const num = new Decimal(numStr)

      if (num.lessThan(1000)) {
        return 0
      }

      // 無條件去除後面三位，相當於除以1000再無條件捨去
      return num.dividedToIntegerBy(1000).toNumber()
    },

    /** 取得隨機數 */
    getRandom(min: number, max: number): number {
      return Math.floor(Math.random() * (max + 1 - min)) + min
    },

    /** 處理滾輪滾動，將上下滾動轉換為左右滾動 */
    handleWheelScroll,

    uploadImage,

    getCssVar(varName: string): string {
      // 取得根節點（通常 :root 定義 CSS 變數）
      const root = document.documentElement

      return getComputedStyle(root).getPropertyValue(varName).trim()
      // 從計算後樣式中取出變數
    },

    hexToRgba(hex: string, alpha = 1) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
  }
}
