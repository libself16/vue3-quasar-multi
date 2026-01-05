import { useGame } from "src/common/composables/useGame"
import { useEnv } from "src/common/hooks/useEnv"
import productDefaultImg from "../assets/images/default/product.png"
import productTabDefaultImg from "../assets/images/default/tab.png"

export function useSiteImg() {
  const { gameTypeState, productState } = useGame()
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()
  const resultAssets = (url: string) => new URL(`../assets/${url}`, import.meta.url).href
  const resultImages = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  /** menu */
  const logoImg = resultImages("logo.png")
  const rectangle = resultImages("aside/Rectangle.png")
  const svgIcon = (iconName: string) => resultImages(`svg/${iconName}.svg`)
  const menuIcon = (iconName: string) => resultImages(`home/menu/${iconName}.png`)

  /** content 區塊 */
  const homeImg = (url: string) => resultImages(`home/${url}.png`)
  const lobbyGameImg = (num: number) => resultImages(`content/Lobby/lobbyGame${num}.png`)
  const welcomeImg = resultImages("home/welcome.png")
  const mWelcomeImg = resultImages("home/m-welcome.png")
  const downloadPageImg = resultImages("content/Download/DesktopDownload.png")
  const mDownloadPageImg = resultImages("content/Download/MobileDownload.png")
  const mDownloadPageImg2 = resultImages("content/Download/MobileDownload2.png")
  const promotionImg = resultAssets("promotions/promo-1.png")

  // 浮動圖
  const liveChatImg = () => resultImages("float/live-chat.png")

  // footer 區塊
  const contactImg = resultImages("footer/contact.png")
  const contactDetailImg = resultImages("footer/contact-detail.png")

  const footerSvg = (name: string) => resultImages(`footer/${name}.svg`)
  const footerImg = (name: string) => resultImages(`footer/${name}.png`)

  // 彈窗類
  const loginTitleImg = resultImages("modal/modal-title-login.png")
  const registerTitleImg = resultImages("modal/modal-title-register.png")

  // 遊戲
  const playBtnImg = resultImages("btns/play.png")
  function setDefaultProductImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productDefaultImg
  }

  function getSiteProductImg(gameTypeId: number, productCode: number): string {
    const gameType = gameTypeState.map[gameTypeId].game_type
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/set_jokerhill/${gameType}/${productCode}.png`
  }

  function setDefaultProductTabImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productTabDefaultImg
  }

  return {
    /** logo */
    logoImg,
    rectangle,
    svgIcon,
    menuIcon,

    /** 遊戲圖片 */
    homeImg,

    /** lobby 遊戲圖片 */
    lobbyGameImg,

    /** welcome圖片 */
    welcomeImg,
    mWelcomeImg,
    /** 下載頁圖片 */
    downloadPageImg,
    mDownloadPageImg,
    mDownloadPageImg2,

    /** 優惠圖片 */
    promotionImg,

    /** 站內信icon */
    liveChatImg,
    contactImg,
    contactDetailImg,
    loginTitleImg,
    registerTitleImg,

    /** 遊戲 */
    playBtnImg,
    setDefaultProductImg,

    /*footer*/
    footerSvg,
    footerImg,

    getSiteProductImg,
    setDefaultProductTabImg
  }
}
