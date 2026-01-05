export enum Enums {
  /** 優惠 */
  Promotion = 1,

  /** 中講 */
  Winning
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Promotion]: "member.mail.promotion",
  [Enums.Winning]: "member.mail.winning_notification"
}
