/** VIP 開關 */
export enum Enums {
  /** 關閉 */
  Disable = 0,

  /** 開啟 */
  Enable = 1
}

export const I18nKeys: Record<Enums> = {
  [Enums.Disable]: "common.disable",
  [Enums.Enable]: "common.enable"
}
