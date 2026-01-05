export enum Enums {
  /** 今天 */
  Today = 5,

  /** 昨天 */
  Yesterday
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Today]: "common.btn.today",
  [Enums.Yesterday]: "common.btn.yesterday"
}
