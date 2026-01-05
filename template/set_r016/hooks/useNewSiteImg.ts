import { useGame } from "src/common/composables/useGame"
import { useEnv } from "src/common/hooks/useEnv"

export function useSiteImg() {
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()
  const { gameTypeState, productState } = useGame()
  const result = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href
  const svgIcon = (iconName: string) => result(`svg/${iconName}.svg`)

  function menuTabImg(name: string | undefined, active: boolean): string {
    return result(`menu/${name}.png`)
  }
  function getSiteProductImg(gameTypeId: number, productCode: number): string {
    const gameType = gameTypeState.map[gameTypeId].game_type
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/set_r016/${gameType}/${productCode}.png`
  }

  // app download page
  const downloadPageImg = result("AppDownload/download.png")
  const downloadPageAndroidQRImg = result("AppDownload/qr-Android.png")
  const downloadPageAppleQRImg = result("AppDownload/qr-Apple.png")

  return {
    svgIcon,
    menuTabImg,
    result,
    getSiteProductImg,
    downloadPageImg,
    downloadPageAndroidQRImg,
    downloadPageAppleQRImg
  }
}
