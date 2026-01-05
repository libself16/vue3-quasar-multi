export enum Enums {
  /** 未領取 */
  NOT_COLLECTED = 0,

  /** 已領取 */
  COLLECTED,

  /** 拒絕 */
  REJECTED
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.NOT_COLLECTED]: "collaboration.not_collected",
  [Enums.COLLECTED]: "collaboration.collected",
  [Enums.REJECTED]: "collaboration.rejected"
}
