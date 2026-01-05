import productTabDefaultImg from "../assets/images/tabs/default.png"

export function useSiteImg() {
  const resultAssets = (url: string) => new URL(`../assets/${url}`, import.meta.url).href
  const resultImages = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  /** menu */
  const logoImg = resultImages("logo.svg")
  const rectangle = resultImages("aside/Rectangle.png")
  const backBtnImg = resultImages("back-btn.png")
  const referralBannerImg = resultImages("referral-banner.png")
  const referralEditIcon = resultImages("referral-edit.png")
  const mobileExpansionDetailImg = resultImages("mobile-expansion-detail.png")
  const mobileBackBtnImg = resultImages("mobile-back-btn.png")
  const svgIcon = (iconName: string) => resultImages(`svg/${iconName}.svg`)
  const menuIcon = (iconName: string, folder: "normal" | "active" = "normal") => {
    if (folder === "active") {
      return resultImages(`svg/active/${iconName}.svg`)
    } else {
      return resultImages(`svg/${iconName}.svg`)
    }
  }

  /** content 區塊 */
  const homeImg = (url: string) => resultImages(`home/${url}.png`)
  const lobbyGameImg = (num: number) => resultImages(`content/Lobby/lobbyGame${num}.png`)
  const downloadImg = resultImages("home/download.png")
  const downloadPageImg = resultImages("content/Download/DesktopDownload.png")
  const mDownloadPageImg = resultImages("content/Download/MobileDownload.png")
  const mDownloadPageImg2 = resultImages("content/Download/MobileDownload2.png")
  const promotionImg = resultAssets("promotions/promo-1.png")
  const hotTagImg = resultImages("tags/hottag.png")
  const newTagImg = resultImages("tags/newtag.png")

  /** member 圖片 */
  const memberImg = (file: string) => resultImages(`member/${file}`)

  /** vip 圖片 */
  const vipImg = (file: string) => resultImages(`vip/${file}`)

  // 浮動圖
  const liveChatImg = () => resultImages("float/live-chat.svg")

  // Rank board
  const rankIcon = () => resultImages(`rankBoard/rank_icon.png`)
  const betDetailIcon = () => resultImages(`rankBoard/icon_bet_detail.png`)

  // footer 區塊
  const contactImg = resultImages("footer/contact.png")
  const contactDetailImg = resultImages("footer/contact-detail.png")

  const footerSvg = (name: string) => resultImages(`footer/${name}.svg`)
  const footerImg = (name: string) => resultImages(`footer/${name}.png`)

  // 彈窗類
  const loginTitleImg = resultImages("modal/modal-title-login.png")
  const registerTitleImg = resultImages("modal/modal-title-register.png")
  const loginCarousel = (num: number) => resultImages(`login/carousel-${num}.jpg`)
  const loginImg = (file: string) => resultImages(`login/${file}`)
  const logoPagcor = resultImages("ageWarning/image_27.svg")
  const logo21Year = resultImages("ageWarning/d49e7e3f57f6713c19e528152cb75df0.png")
  const collaborationImg = (name: string) => resultImages(`collaboration/${name}.png`)
  //NEWS
  const newsImg = (name: string) => resultImages(`news/${name}`)

  // ai agent
  const aiAgentBalanceImg = resultImages(`aiAgent/balance.png`)
  const aiAgentBettingImg = resultImages(`aiAgent/betting.png`)
  //禮金
  const claimGiftImg = (name: string) => resultAssets(`promotions/${name}`)
  //代理
  const proxyImg = (name: string) => resultImages(`proxy/${name}`)

  // 遊戲
  const playBtnImg = resultImages("btns/play.png")

  // 提款 KYC 驗證提示
  const withdrawalKycImg = resultImages("withdrawal/withdrawal-kyc.png")

  // Float Icon CMS
  const floatCmsIconDefault = resultImages(`float/float-cms-default.png`)
  const floatCmsIconClose = resultImages(`float/float-cms-close.png`)

  // aside menu
  const asideMenuImage = (name: string) => resultImages(`asideMenu/${name}.png`)

  // 404
  const error404Img = resultImages("error/404.png")

  function setDefaultProductTabImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productTabDefaultImg
  }

  return {
    resultImages,

    /** logo */
    logoImg,
    rectangle,
    backBtnImg,
    referralBannerImg,
    referralEditIcon,
    mobileExpansionDetailImg,
    mobileBackBtnImg,
    svgIcon,
    hotTagImg,
    newTagImg,

    menuIcon,

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

    /** 會員中心圖片 */
    memberImg,

    /** vip圖片 */
    vipImg,

    /** 站內信icon */
    liveChatImg,
    contactImg,
    contactDetailImg,
    loginTitleImg,
    registerTitleImg,
    loginCarousel,
    loginImg,

    /** 遊戲 */
    playBtnImg,
    setDefaultProductTabImg,

    /** Rank board */
    rankIcon,
    betDetailIcon,

    /** footer */
    footerSvg,
    footerImg,

    /** 年齡告警彈窗 */
    logoPagcor,
    logo21Year,

    /*新聞*/
    newsImg,

    /** 禮金 */
    claimGiftImg,
    /** 代理 */
    proxyImg,

    /** 提款 KYC 驗證提示 */
    withdrawalKycImg,

    /** ai agent */
    aiAgentBalanceImg,
    aiAgentBettingImg,

    /** Float Icon CMS */
    floatCmsIconDefault,
    floatCmsIconClose,

    /** aside menu */
    asideMenuImage,
    collaborationImg,

    /** 404 */
    error404Img
  }
}
