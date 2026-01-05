export enum Enums {
  /** 全部 */
  All = -1,

  /** 未達成 */
  NOT_ACHIEVED = 0,

  /** 達成 */
  ACHIEVED = 1
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.All]: "common.btn.all",
  [Enums.NOT_ACHIEVED]: "collaboration.not_achieved",
  [Enums.ACHIEVED]: "collaboration.achieved"
}
