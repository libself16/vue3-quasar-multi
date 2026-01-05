export enum Enums {
  /**未上傳前的狀態, 前端自己判斷用 */

  NONE = 888, // 刪除的狀態
  PREUPLOAD = 999, // 等待上傳的圖片的狀態

  /*後端返回的狀態 */
  UNSUBMITTED = 0,
  REVIEWING = 1,
  VERIFIED = 2,
  REJECTED = 3
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.NONE]: "",
  [Enums.PREUPLOAD]: "",
  [Enums.UNSUBMITTED]: "member.kyc.UNSUBMITTED",
  [Enums.REVIEWING]: "member.kyc.status_pending",
  [Enums.VERIFIED]: "member.kyc.status_success",
  [Enums.REJECTED]: "member.kyc.status_failed"
}
