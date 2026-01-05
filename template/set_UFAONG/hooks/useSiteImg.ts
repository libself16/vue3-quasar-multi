import { useEnv } from "src/common/hooks/useEnv"
import { useGame } from "src/common/composables/useGame"

export function useSiteImg() {
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()
  const { gameTypeState, productState } = useGame()
  const result = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  const resultImages = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  const svgIcon = (iconName: string) => resultImages(`svg/${iconName}.svg`)

  function menuTabImg(name: string | undefined, folder: "gold" | "black" = "gold"): string {
    return result(`MenuTab/${folder}/icon-${name}.png`)
  }

  // app download page
  const downloadPageImg = result("AppDownload/download.png")
  const downloadPageAndroidQRImg = result("AppDownload/qr-Android.png")
  const downloadPageAppleQRImg = result("AppDownload/qr-Apple.png")

  return {
    svgIcon,
    menuTabImg,
    downloadPageImg,
    downloadPageAndroidQRImg,
    downloadPageAppleQRImg
  }
}
