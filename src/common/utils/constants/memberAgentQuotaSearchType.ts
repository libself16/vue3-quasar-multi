export enum Enums {
  /** 全部 */
  All = 0,

  /** 存款 */
  Deposit = 1,

  /** 出款 */
  Withdrawal = 2,

  /** 代理加款 */
  ManualAddition = 3,

  /** 代理扣款 */
  ManualDeduction = 4,

  /** 投注紀錄 */
  BetRecord = 5
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.All]: "menu.all",
  [Enums.Deposit]: "action_type.deposit",
  [Enums.Withdrawal]: "action_type.withdrawal",
  [Enums.ManualAddition]: "action_type.manualAddition",
  [Enums.ManualDeduction]: "action_type.manualDeduction",
  [Enums.BetRecord]: "action_type.betRecord"
}
