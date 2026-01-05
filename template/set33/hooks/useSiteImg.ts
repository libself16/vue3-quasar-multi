export function useSiteImg() {
  const result = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  const logoImg = result("logo.png")
  const iconPng = (iconName: string) => result(`common/icons/icon-${iconName}.png`)
  const iconSvg = (iconName: string) => result(`common/icons/icon-${iconName}.svg`)
  const contactUs = result("common/side.png")
  const qrGsi = result("common/qr-GSI.jpeg")

  /** app 下載頁 */
  const downloadPageImg = result("app-download/pg-download.png")
  const mDownloadPageImg = result("app-download/m-download.png")
  const downloadPageAndroidQRImg = result("app-download/qr-Android.png")
  const downloadPageAppleQRImg = result("app-download/qr-Apple.png")

  /** vip頁 */
  const vipBadge = (level: string) => result(`vip/badge-${level}.jpg`)

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

  const footerSvg = (name: string) => result(`footer/${name}.svg`)
  const footerImg = (name: string) => result(`footer/${name}.png`)

  function getCommonSvg(name: string): string {
    return result(`common/${name}.svg`)
  }

  return {
    logoImg,
    iconPng,
    iconSvg,
    contactUs,
    qrGsi,
    vipBadge,
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
    footerImg
  }
}
