import { useGame } from "src/common/composables/useGame"
import { useEnv } from "src/common/hooks/useEnv"
import gameDefaultImg from "src/common/assets/images/default/game.png"
import productDefaultImg from "src/common/assets/images/default/product.png"

export function useCommonImg() {
  const { gameTypeState } = useGame()
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()

  const commonResult = (url: string) => new URL(`/src/common/assets/images/${url}`, import.meta.url).href

  /** Rectangle圖 */
  const commonSvgIcon = (iconName: string) => commonResult(`svg/${iconName}.svg`)
  const commonGifImg = (imgName: string) => commonResult(`gif/${imgName}.gif`)

  /** header組件 */
  const closeImg = commonResult("close.png")
  const getFlagImg = (url: string) => commonResult(`flag/${url}.png`)
  const getGiftImg = (file: string) => commonResult(`gift/${file}`)
  const getSquareFlagImg = (url: string) => commonResult(`flagSquare/${url}.png`)

  /** content 區塊 */
  const marqueeUserIcon = commonResult("slide/user.png")

  /** 遊戲類 */
  const gamePlayerImg = commonResult("game/player.png")

  function getTabProductImages(productCode: number) {
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/tabs/${productCode}.png`
  }

  function getPorductImg(gameTypeId: number, productCode: number): string {
    const gameType = gameTypeState.map[gameTypeId].game_type
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/${gameType}/${productCode}.png`
  }

  function getGametImg(gameTypeId: number, productCode: number, gameCode: string): string {
    const gameType = gameTypeState.map[gameTypeId].game_type
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/games/${productCode}/${gameType}/${gameCode}.png`
  }

  function setDefaultProductImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productDefaultImg
  }

  function setDefaultGameImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = gameDefaultImg
  }

  /** 滑塊驗證圖片 */
  function verifyImg(num: number) {
    return commonResult(`verify/${num}.jpg`)
  }

  const rouletteGameImg = (file: string) => commonResult(`roulette-game/${file}`)
  // 轉盤圖片
  const rouletteGameRegisterImg = (file: string) => commonResult(`roulette-game-register/${file}`)

  const depositChannelImg = (file: string) => commonResult(`depositChannel/${file}.png`)

  return {
    commonResult,

    /** 共用svg icon */
    commonSvgIcon,

    /** deposit qr code channel */
    depositChannelImg,

    /** 共用gif */
    commonGifImg,

    /** 關閉按鈕X */
    closeImg,

    /** 語系國旗圓形 */
    getFlagImg,
    getGiftImg,
    /** 語系國旗方形 */
    getSquareFlagImg,

    /** 跑馬燈人物頭像 */
    marqueeUserIcon,

    /** 遊玩人數icon */
    gamePlayerImg,

    /** 產品tab圖片 */
    getTabProductImages,

    /** 產品圖片 */
    getPorductImg,

    /** 遊戲圖片 */
    getGametImg,

    /** 驗證圖片 */
    verifyImg,

    /** 輪盤遊戲圖片 */
    rouletteGameImg,

    /** 註冊輪盤遊戲 */
    rouletteGameRegisterImg,

    /** 設定產品預設圖 */
    setDefaultProductImg,
    productDefaultImg,

    /** 設定遊戲預設圖 */
    setDefaultGameImg,
    gameDefaultImg
  }
}
