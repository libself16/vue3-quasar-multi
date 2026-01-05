import { useFavicon } from "@vueuse/core"
import { getLogoList } from "src/api/site"
import { useApi } from "src/common/hooks/useApi"
import { LOGO_TYPE } from "src/common/utils/constants"
import { useEnv } from "src/common/hooks/useEnv"
import { useLogoStore } from "src/stores/logoStore"

export function useLogo() {
  const { logoState, setStoreLogoList } = useLogoStore()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()

  function getWideLogo() {
    const logo = logoState.map[LOGO_TYPE.Enums.Wide]

    if (logo) {
      return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${logo.path}?v=${logo.updated_time}`
    }
    return ""
  }

  function getSquareLogo() {
    const logo = logoState.map[LOGO_TYPE.Enums.Square]
    if (logo) {
      return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${logo.path}?v=${logo.updated_time}`
    }
    return ""
  }

  async function handleLogoList() {
    const { status, data } = await useApi(getLogoList)

    if (status) {
      setStoreLogoList(data)
      const favicons = data.filter((e) => e.logo_type >= LOGO_TYPE.Enums.Pixel16)
      if (favicons.length) {
        const icon = `/${favicons[0].path}?v=${favicons[0].updated_time}`
        useFavicon(icon, {
          baseUrl: VITE_APP_DYNAMIC_RESOURCE_URL,
          rel: "icon"
        })
      }
    }
  }

  return { getWideLogo, getSquareLogo, handleLogoList }
}
