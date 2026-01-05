export enum Enums {
  /** 現金 */
  Cash = 1,

  /** 贈金 */
  Bonus
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Cash]: "common.btn.point",
  [Enums.Bonus]: "common.btn.bonus"
}
