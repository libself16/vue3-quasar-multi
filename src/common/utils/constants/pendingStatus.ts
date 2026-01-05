export enum Enums {
  /** 待處理 */
  Pending = 1,

  /** 確認 */
  confirmed = 2,

  /** 拒絕 */
  rejected = 3,

  /** 取消 */
  cancel = 4
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Pending]: "report.pending",
  [Enums.confirmed]: "report.confirmed",
  [Enums.rejected]: "report.rejected",
  [Enums.cancel]: "report.cancel"
}
