import { useGame } from "src/common/composables/useGame"
import { useEnv } from "src/common/hooks/useEnv"

export function useSiteImg() {
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()
  const { gameTypeState, productState } = useGame()
  const result = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href
  const svgIcon = (iconName: string) => result(`svg/${iconName}.svg`)

  const resultImages = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  function menuTabImg(name: string | undefined, active: boolean): string {
    return result(`menu/${name}-${active ? "1" : "2"}.png`)
  }

  const collaborationImg = (name: string) => resultImages(`collaboration/${name}.png`)

  // app download page
  const downloadPageImg = result("AppDownload/download.png")
  const downloadPageAndroidQRImg = result("AppDownload/qr-Android.png")
  const downloadPageAppleQRImg = result("AppDownload/qr-Apple.png")

  const copyIconImg = result("menu/copy.png")

  /** vip 圖片 */
  const vipImg = (file: string) => resultImages(`vip/${file}`)

  return {
    svgIcon,
    menuTabImg,
    result,
    downloadPageImg,
    downloadPageAndroidQRImg,
    downloadPageAppleQRImg,
    collaborationImg,
    copyIconImg,

    /** vip圖片 */
    vipImg
  }
}
