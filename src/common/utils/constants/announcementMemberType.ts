export enum Enums {
  /** 全部 */
  All = 0,

  /** 活動消息 */
  ACTIVE_MESSAGE = 1,

  /** 遊戲消息 */
  GAME_NEWS = 2,

  /** 功能更新 */
  FEATURE_UPDATE = 3,

  /**網站公告 */
  WEBSITE_ANNOUNCE = 4
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.All]: "common.btn.all",
  [Enums.ACTIVE_MESSAGE]: "announcement.active_message",
  [Enums.GAME_NEWS]: "announcement.game_news",
  [Enums.FEATURE_UPDATE]: "announcement.feature_update",
  [Enums.WEBSITE_ANNOUNCE]: "announcement.website_announce"
}
