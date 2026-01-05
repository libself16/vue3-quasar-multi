import productDefaultImg from "../assets/images/default/product.png"
import { useEnv } from "src/common/hooks/useEnv"

import { useAgentCode } from "src/common/hooks/useAgentCode"

export function useSiteImg() {
  const { isRYSM, isBXM9 } = useAgentCode()
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()
  const resultAssets = (url: string) => new URL(`../assets/${url}`, import.meta.url).href
  const resultImages = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  /** menu */
  const svgIcon = (iconName: string) => resultImages(`svg/${iconName}.svg`)
  const headerImg = (iconName: string) => resultImages(`header/${iconName}.png`)

  const collaborationImg = (name: string) => resultImages(`collaboration/${name}.png`)

  const footerImg = (name: string) => resultImages(`footer/${name}.png`)

  // VIP Icon
  const vipIcon = (level: number) => resultImages(`vip/badge-${level}.png`)
  //代理
  const proxyImg = (name: string) => resultImages(`proxy/${name}`)

  function setDefaultProductImg(e: Event) {
    const image = e.target as HTMLImageElement
    image.src = productDefaultImg
  }

  return {
    /** logo */
    svgIcon,
    headerImg,

    /** 遊戲 */
    setDefaultProductImg,

    /** VIP */
    vipIcon,

    proxyImg,

    /*footer*/
    footerImg,

    /** collaboration */
    collaborationImg
  }
}
