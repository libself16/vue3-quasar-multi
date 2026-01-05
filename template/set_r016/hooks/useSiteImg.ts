import { useGame } from "src/common/composables/useGame"
import { useEnv } from "src/common/hooks/useEnv"
import launchGameDefaultImg from "../assets/images/default/game.png"
import productDefaultImg from "../assets/images/default/product.png"
import productTabDefaultImg from "../assets/images/default/tab.png"

export function useSiteImg() {
  const { gameTypeState, productState } = useGame()
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()
  const result = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href
  const resultAssets = (url: string) => new URL(`../assets/${url}`, import.meta.url).href
  const resultImages = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  /** menu */
  const logoImg = resultImages("logo.png")
  const svgIcon = (iconName: string) => resultImages(`svg/${iconName}.svg`)

  //禮金
  const claimGiftImg = (name: string) => resultAssets(`images/promotions/${name}`)

  //首次存款弹窗
  const firstDepositLayout = resultImages("firstDepositLayout.png")
  const firstDepositBottom = resultImages("firstDepositBottom.png")
  /** content 區塊 */
  function menuTabImg(name: string | undefined, active: boolean): string {
    return resultImages(`menu/${name}.png`)
  }
  const homeImg = (url: string) => resultImages(`home/${url}.png`)
  const lobbyGameImg = (num: number) => resultImages(`content/Lobby/lobbyGame${num}.png`)
  const downloadImg = resultImages("home/download.png")
  const downloadPageImg = resultImages("content/Download/DesktopDownload.png")
  const mDownloadPageImg = resultImages("content/Download/MobileDownload.png")
  const mDownloadPageImg2 = resultImages("content/Download/MobileDownload2.png")
  const promotionImg = resultAssets("promotions/promo-1.png")
  const hotTagImg = resultImages("tags/hottag.png")
  const newTagImg = resultImages("tags/newtag.png")

  // 會員中心icon
  const memberCenterIconImage = (file: string) => resultImages(`member-center/icons/${file}.png`)
  const memberCenterImage = (file: string) => resultImages(`member-center/${file}.png`)

  /** vip 圖片 */
  const vipImg = (file: string) => resultImages(`vip/${file}`)

  //代理
  const proxyImg = (name: string) => resultImages(`proxy/${name}`)

  // 浮動圖
  const liveChatImg = () => resultImages("float/live-chat.png")

  // footer 區塊
  const contactImg = resultImages("footer/contact.png")
  const contactDetailImg = resultImages("footer/contact-detail.png")

  const footerSvg = (name: string) => resultImages(`footer/${name}.svg`)
  const footerImg = (name: string) => resultImages(`footer/${name}.png`)

  const leftHandImg = resultImages("footer/left-hand.png")
  const rightHandImg = resultImages("footer/right-hand.png")

  // 彈窗類
  const loginTitleImg = resultImages("modal/modal-title-login.png")
  const registerTitleImg = resultImages("modal/modal-title-register.png")
  const loginImg = (file: string) => resultImages(`login/${file}`)
  const registerImg = (file: string) => resultImages(`register/${file}`)

  // 遊戲
  const playBtnImg = resultImages("btns/play.png")

  // 提款 KYC 驗證提示
  const withdrawalKycImg = resultImages("withdrawal/withdrawal-kyc.png")

  // Shareholder Platform(合營股東)
  const shareholderLogo = resultImages("shareholder-platform/shareholder-logo.png")
  const shareholderTabImg = (name: string) => resultImages(`shareholder-platform/${name}.png`)

  function setDefaultProductTabImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productTabDefaultImg
  }

  function setDefaultProductImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productDefaultImg
  }

  function setDefaultGameImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = launchGameDefaultImg
  }

  function getSiteProductImg(gameTypeId: number, productCode: number): string {
    const gameType = gameTypeState.map[gameTypeId].game_type
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/set_r016/${gameType}/${productCode}.png`
  }

  return {
    /** logo */
    logoImg,
    svgIcon,
    loginImg,
    registerImg,

    /** menu tab */
    menuTabImg,

    /** 遊戲圖片 */
    homeImg,

    /** lobby 遊戲圖片 */
    lobbyGameImg,

    /** 下載頁圖片 */
    downloadImg,
    downloadPageImg,
    mDownloadPageImg,
    mDownloadPageImg2,

    /** 優惠圖片 */
    promotionImg,

    /** 會員中心icon */
    memberCenterIconImage,
    memberCenterImage,

    /** vip 圖片 */
    vipImg,

    /** 站內信icon */
    liveChatImg,
    contactImg,
    contactDetailImg,
    loginTitleImg,
    registerTitleImg,

    /** 遊戲 */
    playBtnImg,
    setDefaultProductImg,
    setDefaultGameImg,
    setDefaultProductTabImg,

    /** 提款 KYC 驗證提示 */
    withdrawalKycImg,

    /*footer*/
    footerSvg,
    footerImg,

    getSiteProductImg,
    resultImages,
    result,

    /** Shareholder Platform(合營股東) */
    shareholderLogo,
    shareholderTabImg,
    /** 代理 */
    proxyImg,

    claimGiftImg,
    firstDepositBottom,
    firstDepositLayout,

    hotTagImg,
    newTagImg,

    leftHandImg,
    rightHandImg
  }
}
