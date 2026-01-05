import { defineStore } from "pinia"
import { reactive, computed } from "vue"
import type * as Response from "src/api/response.type"
import { TRAFFIC_ANALYSIS } from "src/common/utils/constants"

export type TrafficAnalysisType = {
  [TRAFFIC_ANALYSIS.Enums.google_tag]: {
    tag_id: string
  }
  [TRAFFIC_ANALYSIS.Enums.meta_tag]: {
    [key: string]: string
  }
}

export type TrafficAnalysisKey = keyof TrafficAnalysisType

export const tafficAnalysisStore = defineStore("trafficAnalysisStore", () => {
  const trafficAnalysisConfigMap: TrafficAnalysisType = reactive({
    google_tag: {
      tag_id: ""
    },
    meta_tag: {}
  })

  function updateTrafficAnalysisConfigMap(data: Response.ISetting) {
    if ("digital_analytics" in data) {
      const analytics = JSON.parse(data.digital_analytics)
      Object.keys(analytics).forEach((service) => {
        const analysisKey = service as TrafficAnalysisKey
        if (analysisKey in trafficAnalysisConfigMap) {
          trafficAnalysisConfigMap[analysisKey] = {
            ...trafficAnalysisConfigMap[analysisKey],
            ...analytics[analysisKey]
          }
        }
      })
    }
  }

  return {
    /** 網站流量追蹤Map */
    trafficAnalysisConfigMap,

    /** 更新網站流量追蹤Map */
    updateTrafficAnalysisConfigMap
  }
})
