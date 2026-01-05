/** 歷史紀錄頁面選單列表 */
export enum Enums {
  /** 全部 */
  All = 0,

  /** 存款 => 存款、手動存款 */
  Deposit = 1,

  /** 取款 => 提款、手動提款、拒絕提款 */
  Withdrawal,

  /** 投注記錄 */
  BetHistory,

  /** 獎金 => 優惠、反水、贈金轉帳、VIP獎勵、生日獎勵、代理佣金、合營代理返佣 */
  Promotion
}

export const I18nKeys: Record<Enums | 0, string> = {
  [Enums.All]: "common.btn.all",
  [Enums.Deposit]: "common.btn.deposit",
  [Enums.Withdrawal]: "common.btn.withdrawal",
  [Enums.BetHistory]: "common.btn.betHistory",
  [Enums.Promotion]: "common.btn.bonus"
}

export const FpI18nKeys: Record<Enums | 0, string> = {
  [Enums.All]: "common.btn.all",
  [Enums.Deposit]: "common.btn.cash_in",
  [Enums.Withdrawal]: "common.btn.withdraw",
  [Enums.BetHistory]: "common.btn.betHistory",
  [Enums.Promotion]: "common.btn.bonus"
}

export const I18nTitle: Record<Enums | 0, string> = {
  [Enums.All]: "common.btn.all",
  [Enums.Deposit]: "menu.depositHistory",
  [Enums.Withdrawal]: "menu.withdrawalHistory",
  [Enums.BetHistory]: "common.btn.betHistory",
  [Enums.Promotion]: "menu.bonusHistory"
}

export const FpI18nTitle: Record<Enums | 0, string> = {
  [Enums.All]: "common.btn.all",
  [Enums.Deposit]: "menu.cashInHistory",
  [Enums.Withdrawal]: "menu.withdrawHistory",
  [Enums.BetHistory]: "common.btn.betHistory",
  [Enums.Promotion]: "menu.bonusHistory"
}
