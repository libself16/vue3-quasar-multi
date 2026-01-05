export enum Enums {
  /** 未指定 */
  NotSpecified = 0,

  /** 男 */
  Male = 1,

  /** 女 */
  Female = 2
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.NotSpecified]: "member.profile.notSpecified",
  [Enums.Male]: "member.profile.male",
  [Enums.Female]: "member.profile.female"
}
