import type { Ref, ComputedRef, InjectionKey } from "vue"
import type { GAME_TAG_TYPE, INTEGRATION_ID } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"

type SearchState = {
  gameList: Response.GameList
  favouriteGameList?: Response.GameList
  keyword?: string
  isFocus: boolean
  tag?: GAME_TAG_TYPE.Enums
}

type tagItem = {
  label: string
  value: GAME_TAG_TYPE.Enums
  icon: string
  iconName: string
}

export interface SearchGame {
  gameTagList: ComputedRef<tagItem[]>
  searchState: SearchState
  filterGameList: ComputedRef<Response.GameList>
  handleTagClick?: (value: GAME_TAG_TYPE.Enums, pup?: boolean) => void
  integrationId: Ref<INTEGRATION_ID.Enums, INTEGRATION_ID.Enums>
  gameSearchType: Ref<GAME_TAG_TYPE.Enums, GAME_TAG_TYPE.Enums>
  handleGameSearchTypeClick: (params: {
    tagValue: GAME_TAG_TYPE.Enums
    pup?: boolean
    gameTypeId: number
    productCode: number
  }) => Promise<{
    isBlock: boolean
  }>
  gameType: ComputedRef<number>
  productCode: Ref<number, number>
  handleTabClick: (integration_id: number, product_id: number) => void
}

export const SearchGameKey: InjectionKey<SearchGame> = Symbol("SearchGame")
