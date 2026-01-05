import { useGame } from "src/common/composables/useGame"
import launchGameDefaultImg from "../assets/images/games/default.png"
import productDefaultImg from "../assets/images/products/product/default.png"
import productTabDefaultImg from "../assets/images/products/tab/default.png"

export function useSiteImg() {
  const { gameTypeState, productState } = useGame()
  const resultImages = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  /** menu */
  const logoImg = resultImages("logo.png")
  const rectangle = resultImages("aside/Rectangle.png")
  const svgIcon = (iconName: string) => resultImages(`svg/${iconName}.svg`)
  const menuIcon = (iconName: string) => resultImages(`menu/m-${iconName.toLowerCase()}.png`)
  const gifIcon = (iconName: string) => resultImages(`menu/m-${iconName.toLowerCase()}.gif`)

  /** content 區塊 */
  const dropdownIcon = resultImages("dropdown-icon.png")
  const slideTitleImg = resultImages("slide/title.png")
  const gameImg = (imageName: string, num: number) => resultImages(`content/Index/${imageName}${num}.png`)
  const downloadPageImg = resultImages("content/Download/DesktopDownload.png")
  const mDownloadPageImg = resultImages("content/Download/MobileDownload.png")
  const followImg = (imageName: string) => resultImages(`follow-us/${imageName}.png`)
  const promotionImg = resultImages("content/Promotion/promo.jpg")

  // 浮動圖
  const floatImg = (slide: string) => resultImages(`float-${slide}.png`)

  /** 彈窗類 */
  const cancelImg = resultImages("cancel-icon.png")

  /** banner圖 */
  const demoBannerImg = resultImages("demo/d-banner.jpg")
  const marqueeIcon = resultImages("ann-icon.png")

  /** 會員中心 */
  function memberNavImg(imgName: string) {
    return resultImages(`tab/${imgName}.png`)
  }

  /** 遊戲類 */

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

  return {
    /** logo */
    logoImg,
    rectangle,
    svgIcon,

    /** menu */
    menuIcon,
    /** slot logo gif */
    gifIcon,

    /** 向下箭頭 */
    dropdownIcon,

    /** content slide title */
    slideTitleImg,

    /** content reward img */
    gameImg,

    /** 下載頁面圖 */
    downloadPageImg,

    /** 手機版下載頁面圖 */
    mDownloadPageImg,

    /** follow頁面社群圖 */
    followImg,

    /** 彈窗關閉按鈕 */
    cancelImg,

    /** 跑馬燈icon */
    marqueeIcon,

    /** 假banner */
    demoBannerImg,

    /** 優惠預設圖 */
    promotionImg,

    /** 右下浮動圖標  */
    floatImg,

    /** 會員中心導覽圖片 */
    memberNavImg,

    /** 設定產品tab預設圖片 */
    setDefaultProductTabImg,

    /** 設定產品預設圖片 */
    setDefaultProductImg,

    /** 設定遊戲預設圖片 */
    setDefaultGameImg
  }
}
