import ejs from "ejs"
import { computed, nextTick, onBeforeUnmount, ref, watchEffect, toRef } from "vue"
import { storeToRefs } from "pinia"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { CUSTOMER_SERVICES } from "src/common/utils/constants"
import { liveChatConfigsStore, ServiceKey } from "src/stores/liveChatConfigsStore"

export interface InjectHtml {
  name?: string
  email?: string
}

export function useLiveChat(lineLink?: string, isRWDEnabled = false) {
  const { isDown } = useMediaQuery()
  const isMobile = toRef(isDown, "phone")

  const liveChatStore = liveChatConfigsStore()
  const { configs, enableConfigs } = storeToRefs(liveChatStore)

  const htmlContent = ref<string>("")
  const htmlContainer = ref<HTMLElement | null>(null)

  const enableConfig = computed(() => {
    if (!enableConfigs.value.length) return null

    return enableConfigs.value[0]
  })

  const handleCmsLiveChatClick = (type: CUSTOMER_SERVICES.Enums) => {
    const key = CUSTOMER_SERVICES.StringKeys[type] as ServiceKey
    const config = configs.value[key]
    if (!config.enable) return

    openLiveChatPopup(config)
  }

  const handleOpenLiveChat = () => {
    openLiveChatPopup()
  }

  const openLiveChatPopup = (config = enableConfig.value) => {
    if (!config || !config.enable) return
    if (config) {
      switch (config.type) {
        case CUSTOMER_SERVICES.Enums.Unus: {
          const width = "350",
            height = "600"
          const { appID: appId, compID: compId } = config
          if (!appId || !compId) return

          // const popupUnus = window.open(
          window.open(
            `https://bundlejs01.unuschat.com/livechatWindow.aspx?code=${appId}&campid=${compId}`,
            "Unus Live Chat",
            `width=${width},height=${height},location=0,menubar=0,resizable=0,scrollbars=0,status=0,toolbar=0`
          )
          break
        }

        case CUSTOMER_SERVICES.Enums.TextLiveChat: {
          // 要預先加載text live chat
          window.LiveChatWidget?.call("maximize")
          break
        }

        case CUSTOMER_SERVICES.Enums.Unus: {
          window.Tawk_API.onStatusChange = function (status) {
            if (status === "online") {
              window.Tawk_API.start()
            }
          }
          break
        }

        default:
          break
      }
    }
  }

  const handleOpenLineLink = () => {
    if (lineLink) {
      window.open(lineLink, "_blank")
    }
  }

  const injectHtml = async (item?: InjectHtml) => {
    if (!enableConfig.value) return

    switch (enableConfig.value.type) {
      case CUSTOMER_SERVICES.Enums.Unus:
        // 預設unus手機板不加載
        if (isMobile.value) return
        if (!enableConfig.value.filePath) {
          console.warn(`file url: ${enableConfig.value.filePath} is not found, please check the file url.`)
          return
        }

        try {
          const response = await fetch(enableConfig.value.filePath)
          if (response.ok) {
            const ejsTemplate = await response.text()
            htmlContent.value = ejs.render(ejsTemplate, {
              codeChat: enableConfig.value.appID || "",
              codeCamp: enableConfig.value.compID || ""
            })

            if (htmlContainer.value) {
              // 等DOM更新後執行script
              await nextTick()

              const scripts = htmlContainer.value.querySelectorAll("script")
              scripts.forEach((script) => {
                const newScript = document.createElement("script")
                newScript.textContent = script.textContent

                document.body.appendChild(newScript).parentNode?.removeChild(newScript)
              })
            }
          } else {
            console.error("Failed to load EJS file")
          }
        } catch (error) {
          console.error("Error loading EJS file:", error)
        }
        break
      case CUSTOMER_SERVICES.Enums.TextLiveChat:
        if (!enableConfig.value.filePath) {
          console.warn(`file url: ${enableConfig.value.filePath} is not found, please check the file url.`)
          return
        }

        try {
          const response = await fetch(enableConfig.value.filePath)
          if (response.ok) {
            const ejsTemplate = await response.text()
            htmlContent.value = ejs.render(ejsTemplate, {
              appID: enableConfig.value.appID || ""
            })

            if (htmlContainer.value) {
              // 等DOM更新後執行script
              await nextTick()

              const scripts = htmlContainer.value.querySelectorAll("script")
              scripts.forEach((script) => {
                const newScript = document.createElement("script")
                newScript.textContent = script.textContent

                document.body.appendChild(newScript).parentNode?.removeChild(newScript)
              })
              await nextTick()
              if (item && window.LiveChatWidget) {
                if (item.name) {
                  window.LiveChatWidget.call("set_customer_name", item.name)
                }
                if (item.email) {
                  window.LiveChatWidget.call("set_customer_email", item.email)
                }
              }
            }
          } else {
            console.error("Failed to load EJS file")
          }
        } catch (error) {
          console.error("Error loading EJS file:", error)
        }
        break
      case CUSTOMER_SERVICES.Enums.Tawk:
        try {
          // 建立 script 元素
          const script = document.createElement("script")
          script.type = "text/javascript"
          script.innerHTML = `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/${enableConfig.value.appID}/${enableConfig.value.compID}';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `
          // 將 script 加入到 document body
          document.body.appendChild(script)
        } catch (error) {
          console.error(error)
        }
        break

      default:
        break
    }
  }

  /**
   * 因 inject html 後需要時間生成 DOM
   * 這裡寫個監聽 body 裡的 element
   * 並使用 setTimeout 做個延遲執行
   */
  let observer: MutationObserver | null = null
  const observeBodyChanges = () => {
    observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (const node of Array.from(mutation.addedNodes)) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const insertedElement = node as HTMLElement
              const appId = enableConfig.value?.appID
              if (insertedElement.id === `chat-container-${appId}`) {
                setTimeout(() => {
                  insertedElement.style.setProperty("display", "block", "important")
                  // 如果啟用 RWD 且是手機版，則隱藏
                  updateLiveChatVisibility()
                }, 3000)
              }
            }
          }
        }
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
  }

  /**
   * 隱藏 LiveChat widget
   */
  const hideLiveChat = () => {
    const appId = enableConfig.value?.appID
    const selectors = [
      `#chat-container-${appId}` // Unus
      // ".widget-visible", // Tawk
      // "#chat-widget-container", // LiveChatInc
      // "[id^='livechat-compact-container']", // LiveChatInc alternative
      // ".lc-container" // LiveChatInc alternative
    ]

    selectors.forEach((selector) => {
      const element = document.querySelector(selector) as HTMLElement
      if (element) {
        element.style.setProperty("z-index", "-1", "important")
        element.style.setProperty("visibility", "hidden", "important")
        element.style.setProperty("pointer-events", "none", "important")
      }
    })
  }

  /**
   * 顯示 LiveChat widget
   */
  const showLiveChat = () => {
    const appId = enableConfig.value?.appID
    const selectors = [
      `#chat-container-${appId}` // Unus
      // ".widget-visible", // Tawk
      // "#chat-widget-container", // LiveChatInc
      // "[id^='livechat-compact-container']", // LiveChatInc alternative
      // ".lc-container" // LiveChatInc alternative
    ]

    selectors.forEach((selector) => {
      const element = document.querySelector(selector) as HTMLElement
      if (element) {
        element.style.setProperty("z-index", "999", "important")
        element.style.setProperty("visibility", "visible", "important")
        element.style.setProperty("pointer-events", "auto", "important")
      }
    })
  }

  /**
   * 根據 RWD 設定和裝置類型更新 LiveChat 顯示狀態
   */
  const updateLiveChatVisibility = () => {
    if (!isRWDEnabled) {
      // 如果未啟用 RWD，永遠顯示
      showLiveChat()
      return
    }

    // 啟用 RWD 時，根據裝置類型決定
    if (isMobile.value) {
      hideLiveChat()
    } else {
      showLiveChat()
    }
  }

  const unmountObserve = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  watchEffect(() => {
    if (htmlContainer.value) {
      observeBodyChanges()
    }
  })

  // 監聽 isMobile 變化，動態更新 LiveChat 顯示狀態
  watchEffect(() => {
    if (isRWDEnabled && isMobile.value !== undefined) {
      updateLiveChatVisibility()
    }
  })

  onBeforeUnmount(() => {
    unmountObserve()
  })

  return {
    /** 開啟客服連結 */
    handleOpenLiveChat,

    /** 開啟指定網址 */
    handleOpenLineLink,

    /** cms type 6 */
    handleCmsLiveChatClick,

    /** 啟用的第一筆客服連結 */
    enableConfig,

    /** html內容 */
    htmlContent,

    /** html ref */
    htmlContainer,

    /** 注入html檔案 */
    injectHtml

    /** 隱藏 LiveChat */
    // hideLiveChat,

    /** 顯示 LiveChat */
    // showLiveChat,

    /** 更新 LiveChat 顯示狀態 */
    // updateLiveChatVisibility
  }
}
