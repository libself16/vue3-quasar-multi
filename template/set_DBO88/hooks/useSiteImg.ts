import { useEnv } from "src/common/hooks/useEnv"
import { useGame } from "src/common/composables/useGame"
import productTabDefaultImg from "../assets/images/Default/tab.png"
import productDefaultImg from "../assets/images/Default/product.png"

export function useSiteImg() {
  const { envData } = useEnv()
  const { VITE_APP_STATIC_RESOURCE_URL } = envData()
  const { gameTypeState } = useGame()

  const result = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href
  const resultImages = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href
  const svgIcon = (iconName: string) => resultImages(`svg/${iconName}.svg`)

  // Header
  const headerChat = resultImages("Header/chat.png")
  const headerLoginBg = resultImages("Header/login-bg.png")
  const avatarIcon = resultImages("Header/avatar.png")
  const headerOpenDrawer = resultImages("Header/open-drawer.png")
  const headerCloseDrawer = resultImages("Header/close-drawer.png")

  // Product Default Image
  const setDefaultProductImg = (e: Event) => {
    const image = e.target as HTMLImageElement
    image.src = productDefaultImg
  }

  // Product Default Image
  const setDefaultProductTabImg = (e: Event) => {
    const image = e.target as HTMLImageElement
    image.src = productTabDefaultImg
  }

  // Vip
  const vipImg = (file: string) => resultImages(`Vip/${file}`)

  // Share Link Button
  const shareLinkImage = result(`Share/icon-share.png`)
  const downLineImage = result(`Share/icon-downline.png`)
  const checkImage = result(`Share/icon-check.png`)

  const hotTagImg = resultImages("Tags/hottag.png")
  const newTagImg = resultImages("Tags/newtag.png")

  const gameTitleIcon = (gameType: number) => {
    switch (gameType) {
      case 1:
        return resultImages("GameTitleIcon/slots.png")
      case 2:
        return resultImages("GameTitleIcon/casino.png")
      case 3:
        return resultImages("GameTitleIcon/sports.png")
      case 4:
        return resultImages("GameTitleIcon/cricket.png")
      case 7:
        return resultImages("GameTitleIcon/p2p.png")
      case 8:
        return resultImages("GameTitleIcon/fish.png")
      case 9:
        return resultImages("GameTitleIcon/other.png")
      case 11:
        return resultImages("GameTitleIcon/esports.png")
      case 12:
        return resultImages("GameTitleIcon/poker.png")
      default:
        return resultImages("GameTitleIcon/1.png")
    }
  }

  return {
    setDefaultProductTabImg,
    setDefaultProductImg,
    svgIcon,
    gameTitleIcon,
    headerChat,
    headerLoginBg,
    avatarIcon,
    hotTagImg,
    newTagImg,
    headerOpenDrawer,
    headerCloseDrawer,
    vipImg,
    shareLinkImage,
    downLineImage,
    checkImage
  }
}
