import { computed, onMounted, reactive, watch } from "vue"
import { useDebounceFn } from "@vueuse/core"
import { useGame } from "src/common/composables/useGame"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import type * as Response from "src/api/response.type"

type SearchState = {
  gameList: Response.GameList
  keyword: string
  isFocus: boolean
}

export function useGameKeyword() {
  const { gameState } = useGame()

  const searchState = reactive<SearchState>({
    gameList: [],
    keyword: "",
    isFocus: false
  })

  const { isMobile } = useMediaQuery()

  const filterGameList = computed(() => {
    if (!searchState.keyword) {
      return []
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

  const debounceKeyword = useDebounceFn((newValue) => {
    if (newValue) {
      searchGameKeyword(gameState.allProviderGameList, newValue.toLowerCase())
    }
  }, 500)

  watch(
    () => searchState.keyword,
    (newValue) => {
      debounceKeyword(newValue)
    }
  )

  onMounted(async () => {
    if (isMobile.value) {
      searchState.isFocus = true
    }
  })

  return {
    searchState,
    filterGameList
  }
}
