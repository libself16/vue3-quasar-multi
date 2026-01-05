/** 後端真正的紀錄類型 */
export enum Enums {
  // 入款
  DEPOSIT = 1,

  // 出款
  WITHDRAWAL = 2,

  // 手動存款
  ADJUSMENT_DEPOSIT = 3,

  // 手動提款
  ADJUSMENT_WITHDRAWAL = 4,

  // 投注
  BET = 5,

  // 拒絕提款
  WITHDRAWAL_REJECTED = 6,

  // 優惠
  PROMOTION = 7,

  //反水
  REBATE = 8,

  //贈金轉帳
  BONUS_WALLET_TRANSFER = 9,

  //VIP獎勵
  VIP_BONUS = 10,

  //生日獎勵
  BIRTHDAY_BONUS = 11,

  //代理佣金
  AGENT_COMMISSION = 12,

  //合營代理返佣
  AGENT_COLLABORATION_COMMISSION = 13,

  // 上級返佣
  REFERRAL_REBATE = 14,

  // 禮金
  BONUS_GIFT = 15,

  // 股東盤存款
  SHAREHOLDER_DEPOSIT = 17
}

export const I18nKeys: Record<Enums | 0, string> = {
  0: "common.btn.all",
  [Enums.DEPOSIT]: "action_type.deposit",
  [Enums.WITHDRAWAL]: "action_type.withdrawal",
  [Enums.ADJUSMENT_DEPOSIT]: "action_type.adjusmentDeposit",
  [Enums.ADJUSMENT_WITHDRAWAL]: "action_type.adjusmentWithdrawal",
  [Enums.BET]: "action_type.betRecord",
  [Enums.WITHDRAWAL_REJECTED]: "action_type.withdrawalRejected",
  [Enums.PROMOTION]: "action_type.promotion",
  [Enums.REBATE]: "action_type.rebate",
  [Enums.BONUS_WALLET_TRANSFER]: "action_type.bonusWalletTransfer",
  [Enums.VIP_BONUS]: "action_type.vipBonus",
  [Enums.BIRTHDAY_BONUS]: "action_type.birthdayBonus",
  [Enums.AGENT_COMMISSION]: "action_type.affiliateCommission",
  [Enums.AGENT_COLLABORATION_COMMISSION]: "action_type.agentCommission",
  [Enums.REFERRAL_REBATE]: "action_type.referral_rebate",
  [Enums.BONUS_GIFT]: "action_type.bonus_gift",
  [Enums.SHAREHOLDER_DEPOSIT]: "action_type.shareholderDeposit"
}

export const FpI18nKeys: Record<Enums | 0, string> = {
  0: "common.btn.all",
  [Enums.DEPOSIT]: "common.btn.cash_in",
  [Enums.WITHDRAWAL]: "common.btn.withdraw",
  [Enums.ADJUSMENT_DEPOSIT]: "action_type.manualCashIn",
  [Enums.ADJUSMENT_WITHDRAWAL]: "action_type.adjusmentWithdraw",
  [Enums.BET]: "action_type.betRecord",
  [Enums.WITHDRAWAL_REJECTED]: "action_type.withdrawRejected",
  [Enums.PROMOTION]: "action_type.promotion",
  [Enums.REBATE]: "action_type.rebate",
  [Enums.BONUS_WALLET_TRANSFER]: "action_type.bonusWalletTransfer",
  [Enums.VIP_BONUS]: "action_type.vipBonus",
  [Enums.BIRTHDAY_BONUS]: "action_type.birthdayBonus",
  [Enums.AGENT_COMMISSION]: "action_type.affiliateCommission",
  [Enums.AGENT_COLLABORATION_COMMISSION]: "action_type.agentCommission",
  [Enums.REFERRAL_REBATE]: "action_type.referral_rebate",
  [Enums.BONUS_GIFT]: "action_type.bonus_gift"
}
