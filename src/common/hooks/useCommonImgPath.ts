import { useGame } from "src/common/composables/useGame"
import { useEnv } from "src/common/hooks/useEnv"
import gameDefaultImg from "src/common/assets/images/default/game.png"
import productDefaultImg from "src/common/assets/images/default/product.png"

import {
  ResultImgPathListType,
  PNG_FORMATS,
  JPG_FORMATS,
  SVG_FORMATS,
  GIF_FORMATS
  // ALL_FORMATS
} from "src/common/utils/constants/imgFormats"

export function useCommonImgPath() {
  const { gameTypeState } = useGame()
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()

  const resultAssetsPath = (url: string) => new URL(`/src/common/assets/${url}`, import.meta.url).href
  const resultImagesPath = (url: string) => new URL(`/src/common/assets/images/${url}`, import.meta.url).href
  const resultImgPathList = ({ url, formats, isInImages = true }: ResultImgPathListType) => {
    return formats.map((format) =>
      isInImages ? resultImagesPath(`${url}.${format}`) : resultAssetsPath(`${url}.${format}`)
    )
  }

  /** Rectangle圖 */
  const commonSvgIcon = (iconName: string) => resultImgPathList({ url: `svg/${iconName}`, formats: SVG_FORMATS })
  const commonGifImg = (imgName: string) => resultImgPathList({ url: `gif/${imgName}`, formats: GIF_FORMATS })

  /** header組件 */
  const closeImg = resultImgPathList({ url: "close", formats: PNG_FORMATS })
  const getFlagImg = (url: string) => resultImgPathList({ url: `flag/${url}`, formats: PNG_FORMATS })
  const getSquareFlagImg = (url: string) => resultImgPathList({ url: `flagSquare/${url}`, formats: PNG_FORMATS })

  /** content 區塊 */
  const marqueeUserIcon = resultImgPathList({ url: "slide/user", formats: PNG_FORMATS })

  /** 遊戲類 */
  const gamePlayerImg = resultImgPathList({ url: "game/player", formats: PNG_FORMATS })

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
    return resultImgPathList({ url: `verify/${num}`, formats: JPG_FORMATS })
  }

  const rouletteGameImg = (file: string) => resultImgPathList({ url: `roulette-game/${file}`, formats: PNG_FORMATS })
  // 轉盤圖片
  const rouletteGameRegisterImg = (file: string) =>
    resultImgPathList({ url: `roulette-game-register/${file}`, formats: PNG_FORMATS })

  const depositChannelImg = (file: string) => resultImgPathList({ url: `depositChannel/${file}`, formats: PNG_FORMATS })

  const commonProductDefaultImg = resultImgPathList({ url: "default/product", formats: PNG_FORMATS })

  return {
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
    commonProductDefaultImg,

    /** 設定遊戲預設圖 */
    setDefaultGameImg,
    gameDefaultImg
  }
}
