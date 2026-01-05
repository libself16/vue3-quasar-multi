export enum Enums {
  /** 全部 */
  All = 0,

  /** 存款優惠 */
  DepositBonus = 1,

  /** 註冊獎金 */
  RegisterBonus,

  /** 投注優惠 */
  BetBonus,

  /** 自訂優惠 */
  CustomizeBonus

  /** 救援金 */
  // RescueBonus
}

export const I18nKeys: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.All]: "common.btn.all",
  [Enums.DepositBonus]: "promotion.deposit_bonus",
  [Enums.RegisterBonus]: "promotion.register_bonus",
  [Enums.BetBonus]: "promotion.bet_bonus",
  [Enums.CustomizeBonus]: "promotion.customize_bonus"
  // [Enums.RescueBonus]: "event_type.rescue_bonus"
}
