export enum Enums {
  /** 首頁 */
  Home = 1,
  /** 站內信 */
  Inbox,
  /** 優惠活動 */
  Promotion,
  /** 優惠 */
  Promos,
  /** 資訊 */
  Profile,
  /** 存款 */
  Deposit,
  /** 出款 */
  Wthdrawal,
  /** 存提款 */
  DepositWthdrawal,
  /** 歷史紀錄 */
  History,
  /** 訂單 */
  Order,
  /** 修改密碼 */
  Password,
  /** vip */
  Vip,
  /** blog */
  Blog,
  /** 下載 */
  Download,
  /** 關於我們 */
  AboutUs,
  /** 登入 */
  Login,
  /** 註冊 */
  Register,
  /** 熱門遊戲 */
  Hot,
  /** 遊戲大廳 */
  GameLobby,
  /** 熱門列表 */
  GameList,
  /** News */
  News,
  /** 關注我們 */
  FollowUs,
  /** 客服 */
  Support,
  /** facebook */
  Facebook,
  /** telegram */
  Telegram,
  /** instagram */
  Instagram,
  /** youtube */
  Youtube,
  /** language */
  Language
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Home]: "menu.home",
  [Enums.Inbox]: "menu.inbox",
  [Enums.Promotion]: "menu.promotion",
  [Enums.Promos]: "menu.promos",
  [Enums.Profile]: "menu.profile",
  [Enums.Deposit]: "menu.deposit",
  [Enums.Wthdrawal]: "menu.withdrawal",
  [Enums.DepositWthdrawal]: "menu.deposit_withdrawal",
  [Enums.History]: "menu.history",
  [Enums.Order]: "menu.order",
  [Enums.Password]: "menu.password",
  [Enums.Vip]: "menu.vip",
  [Enums.Blog]: "menu.blog",
  [Enums.Download]: "menu.download",
  [Enums.AboutUs]: "menu.about_us",
  [Enums.Login]: "menu.login",
  [Enums.Register]: "menu.register",
  [Enums.Hot]: "menu.hot",
  [Enums.GameLobby]: "menu.game_lobby",
  [Enums.GameList]: "menu.game_list",
  [Enums.News]: "menu.news",
  [Enums.FollowUs]: "menu.follow_us",
  [Enums.Support]: "menu.support",
  [Enums.Facebook]: "menu.facebook",
  [Enums.Telegram]: "menu.telegram",
  [Enums.Instagram]: "menu.instagram",
  [Enums.Youtube]: "menu.youtube",
  [Enums.Language]: "menu.language"
}

export const FrontendKey: Record<Enums, string> = {
  [Enums.Home]: "home",
  [Enums.Inbox]: "inbox",
  [Enums.Promotion]: "promotion",
  [Enums.Promos]: "promos",
  [Enums.Profile]: "profile",
  [Enums.Deposit]: "deposit",
  [Enums.Wthdrawal]: "withdrawal",
  [Enums.DepositWthdrawal]: "deposit",
  [Enums.History]: "history",
  [Enums.Order]: "order",
  [Enums.Password]: "password",
  [Enums.Vip]: "vip",
  [Enums.Blog]: "blog",
  [Enums.Download]: "download",
  [Enums.AboutUs]: "aboutUs",
  [Enums.Login]: "login",
  [Enums.Register]: "register",
  [Enums.Hot]: "hot",
  [Enums.GameLobby]: "gameLobby",
  [Enums.GameList]: "gameList",
  [Enums.News]: "news",
  [Enums.FollowUs]: "followUs",
  [Enums.Support]: "support",
  [Enums.Facebook]: "facebook",
  [Enums.Telegram]: "telegram",
  [Enums.Instagram]: "instagram",
  [Enums.Youtube]: "youtube",
  [Enums.Language]: "language"
}
