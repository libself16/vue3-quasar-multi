/** 歷史紀錄頁面選單列表 */
export enum Enums {
  /** 全部 */
  All = -1,

  /** 會員 */
  Member = 0,

  /** AI */
  Ai = 1
}

export const I18nKeys: Record<Enums | 0, string> = {
  [Enums.All]: "common.btn.all",
  [Enums.Member]: "tableHeader.member",
  [Enums.Ai]: "Ai"
}
