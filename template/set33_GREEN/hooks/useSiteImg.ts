import { useEnv } from "src/common/hooks/useEnv"
import { useGame } from "src/common/composables/useGame"

export function useSiteImg() {
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()
  const { gameTypeState, productState } = useGame()
  const result = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  const logoImg = result("logo.png")
  const iconHome = (iconName: string) => result(`icon/home/${iconName}.png`)
  const iconPng = (iconName: string) => result(`common/icons/icon-${iconName}.png`)
  const iconSvg = (iconName: string) => result(`common/icons/icon-${iconName}.svg`)
  const contactUs = result("common/side.png")
  const qrGsi = result("common/qr-GSI.jpeg")
  const hotTagImg = result("tags/hottag.png")
  const newTagImg = result("tags/newtag.png")

  /** app 下載頁 */
  const downloadPageImg = result("app-download/pg-download.png")
  const mDownloadPageImg = result("app-download/m-download.png")
  const downloadPageAndroidQRImg = result("app-download/qr-Android.png")
  const downloadPageAppleQRImg = result("app-download/qr-Apple.png")

  /** vip頁 */
  const vipBadge = (level: string) => result(`vip/badge-${level}.jpg`)

  /** vip 圖片 */
  const vipImg = (file: string) => result(`vip/${file}`)

  /** history */
  function historyImg(iconName: string): string {
    const langList = ["CN", "EN", "THAI", "TW", "VN"]
    let img = ""
    if (langList.includes(iconName)) {
      img = iconName
    } else {
      img = "EN"
    }
    return result(`common/flag/flag-${img}.png`)
  }
  /** pending */
  function pendingImg(iconName: string): string {
    const langList = ["CN", "EN", "THAI", "TW", "VN"]
    let img = ""
    if (langList.includes(iconName)) {
      img = iconName
    } else {
      img = "EN"
    }
    return result(`common/flag/flag-${img}.png`)
  }

  function homeImg(name: string | undefined): string {
    return result(`home/${name}`)
  }
  function menuTabImg(name: string | undefined): string {
    return result(`mobile/icon-${name}.png`)
  }

  const homeGameImages = (productCode: number | string, gameType: string, gameId: string) => {
    return result(`games/${productCode}/${gameType}/${gameId}.png`)
  }

  const footerSvg = (name: string) => result(`footer/${name}.svg`)
  const footerImg = (name: string) => result(`footer/${name}.png`)

  function getCommonSvg(name: string): string {
    return result(`common/${name}.svg`)
  }

  function getSiteProductImg(gameTypeId: number, productCode: number): string {
    const gameType = gameTypeState.map[gameTypeId].game_type
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/set33_GREEN/${gameType}/${productCode}.png`
  }

  return {
    logoImg,
    iconHome,
    iconPng,
    iconSvg,
    contactUs,
    qrGsi,
    vipBadge,
    vipImg,
    homeGameImages,
    downloadPageImg,
    mDownloadPageImg,
    downloadPageAndroidQRImg,
    downloadPageAppleQRImg,
    historyImg,
    pendingImg,
    getCommonSvg,
    homeImg,
    menuTabImg,
    footerSvg,
    footerImg,
    getSiteProductImg,
    hotTagImg,
    newTagImg
  }
}
