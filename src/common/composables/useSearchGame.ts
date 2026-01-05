import { useDebounceFn } from "@vueuse/core"
import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"
import { useGame } from "src/common/composables/useGame"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommon } from "src/common/hooks/useCommon"
import { GAME_TAG_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, reactive, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

type SearchState = {
  gameList: Response.GameList
  favouriteGameList: Response.GameList
  keyword: string
  isFocus: boolean
  tag: GAME_TAG_TYPE.Enums
}

type tagItem = {
  icon: string
  iconName: string
  label: string
  value: GAME_TAG_TYPE.Enums
}

export function useSearchGame() {
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const $q = useQuasar()
  const { gameState, getAllProviderGames } = useGame()
  const { isLogin } = useAuth()
  const { genEnumToArray } = useCommon()
  const eventbus = injectStrict(EventBusKey)

  const searchState = reactive<SearchState>({
    gameList: [],
    favouriteGameList: [],
    keyword: "",
    isFocus: false,
    tag: GAME_TAG_TYPE.Enums.All
  })

  const gameTagList = computed(() => {
    const result: tagItem[] = []
    genEnumToArray(GAME_TAG_TYPE.Enums).forEach((e) => {
      const val = e as GAME_TAG_TYPE.Enums
      const tag: tagItem = {
        label: t(GAME_TAG_TYPE.I18nKeys[val]),
        value: val,
        icon: GAME_TAG_TYPE.BtnIcons[val],
        iconName: GAME_TAG_TYPE.BtnIcoSName[val]
      }
      result.push(tag)
    })

    return result
  })

  const integrationId = computed(() => {
    return Number(route.params.integrationId)
  })

  const gameType = computed(() => {
    return Number(route.params.gameType)
  })
  const productCode = computed(() => {
    return Number(route.params.productCode)
  })
  const isMobile = computed(() => $q.screen.width < 768)

  const filterGameList = computed(() => {
    if (!searchState.keyword && !searchState.tag) {
      return gameState.list
    }
    return searchState.gameList
  })

  function processInBatches(array: Response.GameList, batchSize: number, callback: (batch: Response.GameList) => void) {
    let index = 0
    function processNextBatch() {
      if (index >= array.length) return
      const batch = array.slice(index, index + batchSize)
      callback(batch)
      index += batchSize
      setTimeout(processNextBatch, 0) // 微任务队列中执行
    }
    processNextBatch()
  }

  function searchGameKeyword(games: Response.GameList, keyword: string) {
    if (!keyword) return
    searchState.gameList.length = 0
    processInBatches(games, 200, (batch) => {
      if (searchState.keyword.toLowerCase() !== keyword) return
      const filteredBatch = batch.filter((game) => game.game_name.toLowerCase().includes(keyword))
      searchState.gameList.push(...filteredBatch)
    })
  }

  function searchGameTag(games: Response.GameList, gameTag: GAME_TAG_TYPE.Enums) {
    if (!gameTag) return
    searchState.gameList.length = 0
    processInBatches(games, 200, (batch) => {
      if (searchState.tag !== gameTag) return
      let filteredBatch: Response.GameList = []

      switch (gameTag) {
        case GAME_TAG_TYPE.Enums.Favorites:
          filteredBatch = batch.filter((game) => gameState.favoriteMap[game.game_id])
          break
        case GAME_TAG_TYPE.Enums.New:
          filteredBatch = batch.filter((game) => game.newly)
          break
        case GAME_TAG_TYPE.Enums.Hot:
          filteredBatch = batch.filter((game) => game.hot)
          break

        default:
          break
      }
      searchState.gameList.push(...filteredBatch)
    })
  }

  async function handleTagClick(value: GAME_TAG_TYPE.Enums, pup = false) {
    // 未登入沒有favorite
    if (value === GAME_TAG_TYPE.Enums.Favorites && !isLogin.value) {
      if (!pup) {
        router.push({ name: "Login" })
      } else {
        eventbus.emit("openLogin", true)
      }
      return
    }
    searchState.tag = value
  }

  const debounceKeyword = useDebounceFn((newValue) => {
    if (!gameType.value && !productCode.value) {
      router.replace({
        query: { keyword: newValue }
      })
      if (newValue) {
        searchState.tag = GAME_TAG_TYPE.Enums.All
        searchGameKeyword(gameState.list, newValue.toLowerCase())
      }
    } else {
      router.replace({
        params: { gameType: gameType.value, productCode: productCode.value },
        query: { keyword: newValue, tag: searchState.tag }
      })
      if (newValue) {
        searchState.tag = GAME_TAG_TYPE.Enums.All
        searchGameKeyword(gameState.allProviderGameList, newValue.toLowerCase())
      }
    }
  }, 500)

  watch(
    () => searchState.keyword,
    (newValue) => {
      debounceKeyword(newValue)
    }
  )
  watch(
    () => searchState.tag,
    (newValue) => {
      router.replace({
        params: { gameType: gameType.value, productCode: productCode.value },
        query: { keyword: searchState.keyword, tag: newValue }
      })
      if (newValue) {
        searchState.keyword = ""
        searchGameTag(gameState.allProviderGameList, newValue)
      }
    }
  )
  watch(
    () => gameState.favoriteMap,
    (newValue) => {
      if (newValue && searchState.tag === GAME_TAG_TYPE.Enums.Favorites) {
        searchGameTag(gameState.allProviderGameList, GAME_TAG_TYPE.Enums.Favorites)
      }
    }
  )
  watch(
    () => gameState.list,
    (newValue) => {
      if (!gameType.value && !productCode.value) {
        searchState.tag = GAME_TAG_TYPE.Enums.All
        searchGameKeyword(newValue, searchState.keyword.toLowerCase())
      }
    }
  )

  onMounted(async () => {
    // await getAllProviderGames(INTEGRATION_ID.Enums.GSCP, gameType.value)
    const queryKeyword = route.query.keyword
    if (queryKeyword) {
      searchState.keyword = queryKeyword as string

      if (isMobile.value) {
        searchState.isFocus = true
      }
    }
    const queryTag = route.query.tag
    if (queryTag) {
      searchState.tag = Number(queryTag)
    }
  })

  return {
    gameTagList,
    searchState,
    filterGameList,
    handleTagClick,
    getAllProviderGames
  }
}
