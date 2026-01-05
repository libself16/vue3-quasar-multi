export enum Enums {
  /** 全名 */
  RealName = 0,

  /** 匿名 */
  Nickname,

  /** 匿名 */
  Gender,

  /** 匿名 */
  Birth,

  /** 匿名 */
  Contact1,

  /** 匿名 */
  Contact2,

  /** 自我排除 */
  SelfExclusion,
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.RealName]: "member.register.fullName",
  [Enums.Nickname]: "member.profile.nickname",
  [Enums.Gender]: "member.register.gender",
  [Enums.Birth]: "member.register.birthdate",
  [Enums.Contact1]: "member.register.contact1",
  [Enums.Contact2]: "member.register.contact2",
  [Enums.SelfExclusion]: "member.profile.disableAccountDate"
}
