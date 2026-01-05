export enum Enums {
  /** 未讀 */
  Active = 1,

  /** 已讀 */
  Completed
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Active]: "member.mail.active",
  [Enums.Completed]: "member.mail.completed"
}
