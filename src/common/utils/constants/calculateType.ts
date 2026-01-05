export enum Enums {
  /** 有效投注 */
  ValidBet = 1,

  /** 盈虧 */
  WinLose
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.ValidBet]: "member.referralRebate.latestTotalValidBetAmount",
  [Enums.WinLose]: "member.referralRebate.latestTotalProfit"
}