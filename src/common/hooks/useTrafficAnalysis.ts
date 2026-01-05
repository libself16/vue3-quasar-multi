import { storeToRefs } from "pinia"
import { TRAFFIC_ANALYSIS } from "src/common/utils/constants"
import { tafficAnalysisStore } from "src/stores/TrafficAnalysisStore"
import { watchEffect, Ref } from "vue"

export function useTrafficAnalysis(isReady?: Ref<boolean>) {
  const trafficAnalysisStore = tafficAnalysisStore()
  const { trafficAnalysisConfigMap } = storeToRefs(trafficAnalysisStore)

  const injectHtml = (key: TRAFFIC_ANALYSIS.Enums) => {
    const trafficAnalysisConfig = trafficAnalysisConfigMap.value[key]
    switch (key) {
      case TRAFFIC_ANALYSIS.Enums.google_tag:
        if (!trafficAnalysisConfig.tag_id) {
          console.warn("tag_id is empty")
          return
        }

        try {
          const script = document.createElement("script")
          script.async = true
          script.src = `https://www.googletagmanager.com/gtag/js?id=${trafficAnalysisConfig.tag_id}`
          document.head.appendChild(script)

          const script2 = document.createElement("script")
          script2.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trafficAnalysisConfig.tag_id}');
          `
          document.head.appendChild(script2)
        } catch (error) {
          console.error("Error loading GTM:", error)
        }
        break

      case TRAFFIC_ANALYSIS.Enums.meta_tag:
        Object.keys(trafficAnalysisConfig).forEach((name) => {
          const metaObj = trafficAnalysisConfig as { [key: string]: string }
          const content = metaObj[name]

          const meta = document.createElement("meta")
          meta.setAttribute("name", name)
          meta.setAttribute("content", content)
          document.head.appendChild(meta)
        })
        break
      default:
        break
    }
  }

  const handleTrafficAnalysis = () => {
    Object.keys(trafficAnalysisConfigMap.value).forEach((e) => injectHtml(e as TRAFFIC_ANALYSIS.Enums))
  }

  watchEffect(() => {
    if (isReady?.value) {
      handleTrafficAnalysis()
    }
  })

  return {
    /** 加載網站流量追蹤 */
    handleTrafficAnalysis
  }
}
