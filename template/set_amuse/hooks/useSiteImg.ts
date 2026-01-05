import { useEnv } from "src/common/hooks/useEnv"
import { useGame } from "src/common/composables/useGame"
import productTabDefaultImg from "../assets/images/tabs/default.png"

export function useSiteImg() {
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()
  const { gameTypeState, productState } = useGame()
  const result = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  const iconPng = (iconName: string) => result(`common/icons/icon-${iconName}.png`)
  const iconSvg = (iconName: string) => result(`common/icons/icon-${iconName}.svg`)
  const iconHome = (iconName: string) => result(`icon/home/${iconName}.png`)
  const iconHeart = (iconName: string) => result(`favorite/${iconName}.png`)
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
  function getSiteProductImg(gameTypeId: number, productCode: number): string {
    const gameType = gameTypeState.map[gameTypeId].game_type
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/set_amuse/${gameType}/${productCode}.png`
  }
  function getSiteProductTabImg(productCode: number): string {
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/tabs/set_amuse/${productCode}.png`
  }

  function setDefaultProductTabImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productTabDefaultImg
  }

  function menuTabImg(name: string | undefined): string {
    return result(`mobile/icon-${name}.png`)
  }

  const footerSvg = (name: string) => result(`footer/${name}.svg`)
  const footerImg = (name: string) => result(`footer/${name}.png`)

  function getCommonSvg(name: string): string {
    return result(`common/${name}.svg`)
  }

  const setVipCommonImg = () => result(`vip/vip-background.jpeg.jpeg`)

  const successImg = () => result("success.png")
  return {
    iconPng,
    iconSvg,
    iconHome,
    getSiteProductImg,
    getSiteProductTabImg,
    setDefaultProductTabImg,
    historyImg,
    getCommonSvg,
    menuTabImg,
    footerSvg,
    footerImg,
    setVipCommonImg,
    iconHeart,
    successImg
  }
}
