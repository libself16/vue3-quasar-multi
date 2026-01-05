import { defineStore } from "pinia"
import { reactive, computed } from "vue"
import type * as Response from "src/api/response.type"
import { CUSTOMER_SERVICES } from "src/common/utils/constants"

type configType = {
  "Unus Live Chat": {
    type: CUSTOMER_SERVICES.Enums
    filePath: string
    appID: string
    compID: string
    enable: boolean
  }
}

/**
 * const state: stateType = reactive({
    [AGENT_CODE_LIST.ANIP]: {
      filePath: "/anip-unus-live-chat.html",
      appId: "fd41acc2df7109aac68d99a675305d56",
      compId: "10021"
    },
    [AGENT_CODE_LIST.SAMJ]: {
      filePath: "/samj-unus-live-chat.html",
      appId: "8b1b35d47c038cbb939a04382fc7ff0e",
      compId: "10022"
    },
    set33: {
      filePath: "/set33-unus-live-chat.html",
      appId: "addda1cf24c695faff9fe52e18c47f64",
      compId: "10032"
    }
  })
  appID: "18912656",
 */

export type ServiceKey = keyof configType

export const liveChatConfigsStore = defineStore("liveChatConfigs", () => {
  const configs: configType = reactive({
    "Unus Live Chat": {
      type: CUSTOMER_SERVICES.Enums.Unus,
      filePath: "/liveChat/unusLiveChat.ejs",
      appID: "",
      compID: "",
      enable: false
    },
    textLiveChat: {
      type: CUSTOMER_SERVICES.Enums.TextLiveChat,
      filePath: "/liveChat/textLiveChat.ejs",
      appID: "",
      enable: false
    },
    tawk: {
      type: CUSTOMER_SERVICES.Enums.Tawk,
      appID: "",
      enable: false
    }
  })

  const enableConfigs = computed(() => {
    return Object.keys(configs)
      .map((service) => {
        const serviceKey = service as ServiceKey
        return {
          ...configs[serviceKey]
        }
      })
      .filter((item) => item.enable)
  })

  function updateLiveChatConfigs(data: Response.ISetting) {
    if ("customer_services" in data) {
      const services = JSON.parse(data.customer_services)
      Object.keys(services).forEach((service) => {
        const serviceKey = service as ServiceKey
        if (serviceKey in configs) {
          configs[serviceKey] = { ...configs[serviceKey], ...services[serviceKey] }
        }
      })
    }
  }

  return {
    configs,
    enableConfigs,
    updateLiveChatConfigs
  }
})
