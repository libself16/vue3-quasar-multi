import {
  ResultImgPathListType,
  PNG_FORMATS,
  JPG_FORMATS,
  SVG_FORMATS,
  ALL_FORMATS
} from "src/common/utils/constants/imgFormats"
import productTabDefaultImg from "../assets/images/tabs/default.png"

export function useSiteImgPath() {
  const resultAssets = (url: string) => url
  const resultImages = (url: string) => `images/${url}`

  const resultAssetsPath = (url: string) => new URL(`../assets/${url}`, import.meta.url).href
  const resultImagesPath = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href
  const resultImgPathList = ({ url, formats, isInImages = true }: ResultImgPathListType) => {
    return formats.map((format) =>
      isInImages ? resultImagesPath(`${url}.${format}`) : resultAssetsPath(`${url}.${format}`)
    )
  }

  /** AI 圖片 */
  const aiIcon = (iconName: string) => resultImgPathList({ url: `ai/${iconName}`, formats: PNG_FORMATS })
  const aiAgentImg = (iconName: string) => resultImgPathList({ url: `aiAgent/${iconName}`, formats: PNG_FORMATS })

  /** menu */
  const logoImg = resultImgPathList({ url: "logo", formats: SVG_FORMATS })
  const rectangle = resultImgPathList({ url: "aside/Rectangle", formats: PNG_FORMATS })
  const rectangleWebp = resultImagesPath("aside/Rectangle.webp")

  const backBtnImg = resultImgPathList({ url: "back-btn", formats: PNG_FORMATS })
  const referralBannerImg = resultImgPathList({ url: "referral-banner", formats: PNG_FORMATS })
  const referralEditIcon = resultImgPathList({ url: "referral-edit", formats: PNG_FORMATS })
  const successImg = resultImgPathList({ url: "success", formats: PNG_FORMATS })
  const mobileExpansionDetailImg = resultImgPathList({ url: "mobile-expansion-detail", formats: PNG_FORMATS })
  const mobileBackBtnImg = resultImgPathList({ url: "mobile-back-btn", formats: PNG_FORMATS })
  const svgIcon = (iconName: string) => resultImgPathList({ url: `svg/${iconName}`, formats: SVG_FORMATS })
  const menuIcon = (iconName: string, folder: "normal" | "active" = "normal") => {
    if (folder === "active") {
      return resultImgPathList({ url: `svg/active/${iconName}`, formats: SVG_FORMATS })
    } else {
      return resultImgPathList({ url: `svg/${iconName}`, formats: SVG_FORMATS })
    }
  }

  /** content 區塊 */
  const homeImg = (url: string) => resultImgPathList({ url: `home/${url}`, formats: PNG_FORMATS })
  const lobbyGameImg = (num: number) =>
    resultImgPathList({ url: `content/Lobby/lobbyGame${num}`, formats: PNG_FORMATS })
  const downloadImg = resultImgPathList({ url: "home/download", formats: PNG_FORMATS })
  const downloadPageImg = resultImgPathList({ url: "content/Download/DesktopDownload", formats: PNG_FORMATS })
  const mDownloadPageImg = resultImgPathList({ url: "content/Download/MobileDownload", formats: PNG_FORMATS })
  const mDownloadPageImg2 = resultImgPathList({ url: "content/Download/MobileDownload2", formats: PNG_FORMATS })
  const promotionImg = resultImgPathList({ url: "promotions/promo-1", formats: PNG_FORMATS, isInImages: false })
  const hotTagImg = resultImgPathList({ url: "tags/hottag", formats: PNG_FORMATS })
  const newTagImg = resultImgPathList({ url: "tags/newtag", formats: PNG_FORMATS })

  /** member 圖片 */
  const memberImg = (file: string) => resultImages(`member/${file}`)

  /** vip 圖片 */
  const vipImg = (file: string) => resultImages(`vip/${file}`)

  // 浮動圖
  const liveChatImg = () => resultImgPathList({ url: "float/live-chat", formats: SVG_FORMATS })

  // Rank board
  const rankIcon = () => resultImgPathList({ url: "rankBoard/rank_icon", formats: PNG_FORMATS })
  const betDetailIcon = () => resultImgPathList({ url: "rankBoard/icon_bet_detail", formats: PNG_FORMATS })

  // footer 區塊
  const contactImg = resultImgPathList({ url: "footer/contact", formats: PNG_FORMATS })
  const contactDetailImg = resultImgPathList({ url: "footer/contact-detail", formats: PNG_FORMATS })

  const footerSvg = (name: string) => resultImgPathList({ url: `footer/${name}`, formats: SVG_FORMATS })
  const footerImg = (name: string) => resultImgPathList({ url: `footer/${name}`, formats: PNG_FORMATS })

  // 彈窗類
  const loginTitleImg = resultImgPathList({ url: "modal/modal-title-login", formats: PNG_FORMATS })
  const registerTitleImg = resultImgPathList({ url: "modal/modal-title-register", formats: PNG_FORMATS })
  const loginCarousel = (num: number) => resultImgPathList({ url: `login/carousel-${num}`, formats: JPG_FORMATS })
  const loginImg = (file: string) => resultImgPathList({ url: `login/${file}`, formats: ALL_FORMATS })
  const logoPagcor = resultImgPathList({ url: "ageWarning/image_27", formats: SVG_FORMATS })
  const logo21Year = resultImgPathList({ url: "ageWarning/d49e7e3f57f6713c19e528152cb75df0", formats: PNG_FORMATS })

  //NEWS
  const newsImg = (name: string) => resultImgPathList({ url: `news/${name}`, formats: ALL_FORMATS })

  // ai agent
  const aiAgentBalanceImg = resultImgPathList({ url: "aiAgent/balance", formats: PNG_FORMATS })
  const aiAgentBettingImg = resultImgPathList({ url: "aiAgent/betting", formats: PNG_FORMATS })
  //禮金(確認一下這個還有沒有用，感覺沒有對應的 folder)
  const claimGiftImg = (name: string) => resultImgPathList({ url: `claimGift/${name}`, formats: PNG_FORMATS })
  //代理
  const proxyImg = (name: string) => resultImgPathList({ url: `proxy/${name}`, formats: PNG_FORMATS })

  // 遊戲
  const playBtnImg = resultImgPathList({ url: "btns/play", formats: PNG_FORMATS })

  // 提款 KYC 驗證提示
  const withdrawalKycImg = resultImgPathList({ url: "withdrawal/withdrawal-kyc", formats: PNG_FORMATS })

  // Float Icon CMS
  const floatCmsIconDefault = resultImgPathList({ url: "float/float-cms-default", formats: PNG_FORMATS })
  const floatCmsIconClose = resultImgPathList({ url: "float/float-cms-close", formats: PNG_FORMATS })

  // Default product images
  const defaultProductImg = resultImgPathList({ url: "tabs/default", formats: PNG_FORMATS })

  function setDefaultProductTabImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productTabDefaultImg
  }

  return {
    /** ai 圖片 */
    aiIcon,
    aiAgentImg,

    /** logo */
    logoImg,
    rectangle,
    rectangleWebp,
    backBtnImg,
    referralBannerImg,
    referralEditIcon,
    successImg,
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

    /** Default Product Image */
    defaultProductImg
  }
}
