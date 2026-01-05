export enum Enums {
  /** 全部 */
  All = 0,

  /** 存款 */
  Deposit,

  /** 出款 */
  Withdrawal
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.All]: "common.btn.all",
  [Enums.Deposit]: "common.btn.deposit",
  [Enums.Withdrawal]: "common.btn.withdrawal"
}

export const FpI18nKeys: Record<Enums, string> = {
  [Enums.All]: "common.btn.all",
  [Enums.Deposit]: "common.btn.cash_in",
  [Enums.Withdrawal]: "common.btn.withdraw"
}

export const I18nTitle: Record<Enums, string> = {
  [Enums.All]: "common.btn.all",
  [Enums.Deposit]: "menu.depositPendingStatus",
  [Enums.Withdrawal]: "menu.withdrawalPendingStatus"
}

export const FpI18nTitle: Record<Enums, string> = {
  [Enums.All]: "common.btn.all",
  [Enums.Deposit]: "menu.pendingCashInStatus",
  [Enums.Withdrawal]: "menu.withdrawPendingStatus"
}
