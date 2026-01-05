export function useSiteImg() {
  const resultImages = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  // ai agent
  const aiAgentBalanceImg = resultImages(`aiAgent/balance.png`)
  const aiAgentBettingImg = resultImages(`aiAgent/betting.png`)

  // Game
  const aiLiveCasinoImg = resultImages(`aiAgent/game/ai-live-casino.png`)
  const wowGamingImg = resultImages(`aiAgent/game/wow-gaming.png`)
  const kaGamingImg = resultImages(`aiAgent/game/ka-gaming.png`)
  const hotDogGamingImg = resultImages(`aiAgent/game/hotdog-gaming.png`)

  // Float Icon CMS Open
  const floatCmsOpenIconBlackGold01 = resultImages(`floatIcon/open/black-gold01.png`)
  const floatCmsOpenIconBlackGold02 = resultImages(`floatIcon/open/black-gold02.png`)
  const floatCmsOpenIconBlackYellow = resultImages(`floatIcon/open/black-yellow.png`)
  const floatCmsOpenIconBlue01 = resultImages(`floatIcon/open/blue01.png`)
  const floatCmsOpenIconBlue02 = resultImages(`floatIcon/open/blue02.png`)
  const floatCmsOpenIconBlue03 = resultImages(`floatIcon/open/blue03.png`)
  const floatCmsOpenIconDarkBlue = resultImages(`floatIcon/open/dark-blue.png`)
  const floatCmsOpenIconGray = resultImages(`floatIcon/open/gray.png`)
  const floatCmsOpenIconGreen = resultImages(`floatIcon/open/green.png`)
  const floatCmsOpenIconOrangePurple = resultImages(`floatIcon/open/orange-purple.png`)
  const floatCmsOpenIconPurple = resultImages(`floatIcon/open/purple.png`)
  const floatCmsOpenIconRed = resultImages(`floatIcon/open/red.png`)

  // Float Icon CMS Close
  const floatCmsCloseIconBlackGold01 = resultImages(`floatIcon/close/black-gold01.png`)
  const floatCmsCloseIconBlackGold02 = resultImages(`floatIcon/close/black-gold02.png`)
  const floatCmsCloseIconBlackYellow = resultImages(`floatIcon/close/black-yellow.png`)
  const floatCmsCloseIconBlue01 = resultImages(`floatIcon/close/blue01.png`)
  const floatCmsCloseIconBlue02 = resultImages(`floatIcon/close/blue02.png`)
  const floatCmsCloseIconBlue03 = resultImages(`floatIcon/close/blue03.png`)
  const floatCmsCloseIconDarkBlue = resultImages(`floatIcon/close/dark-blue.png`)
  const floatCmsCloseIconGray = resultImages(`floatIcon/close/gray.png`)
  const floatCmsCloseIconGreen = resultImages(`floatIcon/close/green.png`)
  const floatCmsCloseIconOrangePurple = resultImages(`floatIcon/close/orange-purple.png`)
  const floatCmsCloseIconPurple = resultImages(`floatIcon/close/purple.png`)
  const floatCmsCloseIconRed = resultImages(`floatIcon/close/red.png`)

  // AI function
  const aiFunctionRpgImg = resultImages(`aiFunction/rpg.png`)
  const aiFunctionHelperImg = resultImages(`aiFunction/helper2.png`)
  const aiFunctionFansImg = resultImages(`aiFunction/fans.png`)
  const aiFunctionCloseImg = resultImages(`aiFunction/close-black.svg`)
  const aiFunctionCloseH5Img = resultImages(`aiFunction/close-h5.svg`)
  const aiFunctionAgentImg = (iconName: string) => resultImages(`aiFunction/${iconName}.png`)

  // Promotion
  const promotionImg = (iconName: string) => resultImages(`promotion/${iconName}`)
  const forgotPassImg = (iconName: string) => resultImages(`forgotPass/${iconName}`)
  const inboxImg = (iconName: string) => resultImages(`inbox/${iconName}`)
  const orderImg = (iconName: string) => resultImages(`order/${iconName}`)

  return {
    aiAgentBalanceImg,
    aiAgentBettingImg,
    aiLiveCasinoImg,
    wowGamingImg,
    kaGamingImg,
    hotDogGamingImg,

    // Float Icon CMS
    floatCmsOpenIconBlackGold01,
    floatCmsOpenIconBlackGold02,
    floatCmsOpenIconBlackYellow,
    floatCmsOpenIconBlue01,
    floatCmsOpenIconBlue02,
    floatCmsOpenIconBlue03,
    floatCmsOpenIconDarkBlue,
    floatCmsOpenIconGray,
    floatCmsOpenIconGreen,
    floatCmsOpenIconOrangePurple,
    floatCmsOpenIconPurple,
    floatCmsOpenIconRed,

    // Float Icon CMS Close
    floatCmsCloseIconBlackGold01,
    floatCmsCloseIconBlackGold02,
    floatCmsCloseIconBlackYellow,
    floatCmsCloseIconBlue01,
    floatCmsCloseIconBlue02,
    floatCmsCloseIconBlue03,
    floatCmsCloseIconDarkBlue,
    floatCmsCloseIconGray,
    floatCmsCloseIconGreen,
    floatCmsCloseIconOrangePurple,
    floatCmsCloseIconPurple,
    floatCmsCloseIconRed,

    // AI function
    aiFunctionRpgImg,
    aiFunctionHelperImg,
    aiFunctionFansImg,
    aiFunctionCloseImg,
    aiFunctionCloseH5Img,
    aiFunctionAgentImg,
    promotionImg,
    forgotPassImg,
    inboxImg,
    orderImg
  }
}
