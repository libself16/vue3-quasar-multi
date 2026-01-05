export enum Enums {
  /** 老虎機 */
  SLOT = 1,
  /** 真人 */
  LIVECASINO = 2,
  /** 體育 */
  SPORTBOOK = 3,
  /** 虛擬體育 */
  VIRTUALSPORT = 4,
  /** 彩票 */
  LOTTERY = 5,
  /** 卡牌 */
  CARDBOARD = 6,
  /** 對戰 */
  P2P = 7,
  // 捕魚
  FISHING = 8,
  // 其他
  OTHER = 9,
  // 鬥雞
  COCKFIGHTING = 10,
  // 電競
  ESPORT = 11,
  // 撲克
  POKER = 12,
  // 撲克
  CASINO_PREMIUM = 13
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.SLOT]: "menu.slots",
  [Enums.LIVECASINO]: "menu.live_casino",
  [Enums.SPORTBOOK]: "menu.sports",
  [Enums.VIRTUALSPORT]: "menu.virtualSport",
  [Enums.LOTTERY]: "menu.lottery",
  [Enums.CARDBOARD]: "menu.cardboard",
  [Enums.P2P]: "menu.p2p",
  [Enums.FISHING]: "menu.fishing",
  [Enums.OTHER]: "menu.other",
  [Enums.COCKFIGHTING]: "menu.cockfighting",
  [Enums.ESPORT]: "menu.esport",
  [Enums.POKER]: "menu.poker",
  [Enums.CASINO_PREMIUM]: "menu.casino_premium"
}

export const FrontendKey: Record<Enums, string> = {
  [Enums.SLOT]: "slots",
  [Enums.LIVECASINO]: "casino",
  [Enums.SPORTBOOK]: "sports",
  [Enums.VIRTUALSPORT]: "vsport",
  [Enums.LOTTERY]: "lottery",
  [Enums.CARDBOARD]: "cardboard",
  [Enums.P2P]: "p2p",
  [Enums.FISHING]: "fishing",
  [Enums.OTHER]: "other",
  [Enums.COCKFIGHTING]: "cockfighting",
  [Enums.ESPORT]: "esport",
  [Enums.POKER]: "poker",
  [Enums.CASINO_PREMIUM]: "casino_premium"
}

/**
 * 1.大廳開啟遊戲
 * 2.遊戲入口開啟遊戲
 */
export enum CategoryEnums {
  LobbyOpen = 1,
  GameOpen
}

export const Category: Record<Enums, number> = {
  [Enums.SLOT]: CategoryEnums.GameOpen,
  [Enums.LIVECASINO]: CategoryEnums.LobbyOpen,
  [Enums.SPORTBOOK]: CategoryEnums.LobbyOpen,
  [Enums.VIRTUALSPORT]: CategoryEnums.LobbyOpen,
  [Enums.LOTTERY]: CategoryEnums.LobbyOpen,
  [Enums.CARDBOARD]: CategoryEnums.LobbyOpen,
  [Enums.P2P]: CategoryEnums.LobbyOpen,
  [Enums.FISHING]: CategoryEnums.GameOpen,
  [Enums.OTHER]: CategoryEnums.GameOpen,
  [Enums.COCKFIGHTING]: CategoryEnums.LobbyOpen,
  [Enums.ESPORT]: CategoryEnums.LobbyOpen,
  [Enums.POKER]: CategoryEnums.GameOpen,
  [Enums.CASINO_PREMIUM]: CategoryEnums.LobbyOpen
}
