import type * as Response from "src/api/response.type"
import { useCms } from "src/common/composables/useCms"
import { CMS_ENTRANCE_TYPE, CMS_OPENING_METHOD } from "src/common/utils/constants"
import { useSiteRedirect } from "./useSiteRedirect"
import { MENU } from "../utils/constants"

export function useEntranceHandler() {
  const { handleEntrance } = useCms()
  const { handleSiteRedirect } = useSiteRedirect()

  const handleEntranceClick = (item: {
    entrance: Response.CmsEntranceItem
    opening_method?: CMS_OPENING_METHOD.Enums
  }) => {
    console.log(item)
    if (item.entrance.type === CMS_ENTRANCE_TYPE.Enums.INTERNAL_PAGE) {
      console.log(item.entrance.payload.did)
      const did = item.entrance.payload.did as keyof typeof MENU.RouterNameMapping
      handleSiteRedirect({ did, opening_method: item.opening_method })
      return
    }
    handleEntrance({
      entrance: item.entrance,
      isLoginPup: true,
      productLobbyRoute: {
        name: "ProductLobby",
        params: { gameType: item.entrance.payload.game_type }
      },
      cmsHomeRoute: {
        name: "CmsHome",
        params: { cmsId: item.entrance.payload.link_id }
      },
      openingMethod: item.opening_method
    })
  }

  return {
    handleEntranceClick
  }
}
