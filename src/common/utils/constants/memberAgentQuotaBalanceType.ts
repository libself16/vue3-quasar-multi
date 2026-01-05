export enum Enums {
  /** 加款 */
  Add = 1,

  /** 扣款 */
  Minus,

  /** 查看下級 */
  ViewSubordinate = 3,

  /** 編輯 */
  Edit = 4
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Add]: "common.btn.addAmount",
  [Enums.Minus]: "common.btn.minusAmount",
  [Enums.ViewSubordinate]: "member.membershipManagement.viewSubordinateMember",
  [Enums.Edit]: "common.btn.edit"
}
