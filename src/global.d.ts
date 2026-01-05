import { Composer } from "vue-i18n"

export {}

declare global {
  interface Window {
    fbq?: (method: string, ...args: any[]) => void
    LiveChatWidget?: {
      call(method: string, ...args: any[]): void
    }
    Tawk_API: {
      onStatusChange(status: string): void
      start(): void
    }
    Telegram?: {
      WebApp: {
        openLink(url: string): void
        openTelegramLink(url: string): void
        close(): void
        expand(): void
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
        initData: string
        initDataUnsafe: any
        version: string
        platform: string
        colorScheme: "light" | "dark"
        themeParams: any
        isClosingConfirmationEnabled: boolean
        headerColor: string
        backgroundColor: string
        BackButton: {
          isVisible: boolean
          onClick(callback: () => void): void
          offClick(callback: () => void): void
          show(): void
          hide(): void
        }
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          isProgressVisible: boolean
          setText(text: string): void
          onClick(callback: () => void): void
          offClick(callback: () => void): void
          show(): void
          hide(): void
          enable(): void
          disable(): void
          showProgress(leaveActive?: boolean): void
          hideProgress(): void
          setParams(params: any): void
        }
        onEvent(eventType: string, eventHandler: () => void): void
        offEvent(eventType: string, eventHandler: () => void): void
        sendData(data: string): void
        ready(): void
      }
    }
  }

  var $t: Composer["t"]
}
