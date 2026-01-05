// Saba iframe 事件類型定義
export interface SabaEventBase {
  eventCode: string
}

export interface SabaEventR001 extends SabaEventBase {
  eventCode: "R001"
  oddsType: number
  redirectUrl: string
}

export interface SabaEventR001_2 extends SabaEventBase {
  eventCode: "R001_2"
  eventId: number
  leaguekey: number
  marketId: number
  oddsType: number
  redirectUrl: string
}

export interface SabaEventR001_3 extends SabaEventBase {
  eventCode: "R001_3"
  eventId: number
  key: string
  leaguekey: number
  marketId: number
  oddsType: number
  redirectUrl: string
  sportType: number
}

export interface SabaEventU001 extends SabaEventBase {
  eventCode: "U001"
  message: string
}

export interface SabaEventU002 extends SabaEventBase {
  eventCode: "U002"
  message: string
}

export interface SabaEventU003 extends SabaEventBase {
  eventCode: "U003"
  message: string
  redirectUrl: string
}

export interface SabaEventU003_2 extends SabaEventBase {
  eventCode: "U003_2"
  eventId: number
  leaguekey: number
  marketId: number
  message: string
  redirectUrl: string
  sportType: number
}

export interface SabaEventU003_3 extends SabaEventBase {
  eventCode: "U003_3"
  eventId: number
  key: string
  leaguekey: number
  marketId: number
  message: string
  redirectUrl: string
  sportType: number
}

export interface SabaEventS001 extends SabaEventBase {
  eventCode: "S001"
  size: {
    width: number
    height: number
  }
}

// 聯合類型：所有可能的 Saba 事件
export type SabaEvent =
  | SabaEventR001
  | SabaEventR001_2
  | SabaEventR001_3
  | SabaEventU001
  | SabaEventU002
  | SabaEventU003
  | SabaEventU003_2
  | SabaEventU003_3
  | SabaEventS001

export type SabaEventCallback = (event: SabaEvent) => void

// 事件代碼枚舉（方便使用和類型檢查）
export enum SabaEventCode {
  /** 用戶登入後點擊"更多"按鈕 */
  R001 = "R001",
  /** 用戶登入後點擊卡片箭頭 */
  R001_2 = "R001_2",
  /** 用戶登入後點擊賠率按鈕 */
  R001_3 = "R001_3",
  /** 用戶未儲值 */
  U001 = "U001",
  /** 用戶餘額不足 */
  U002 = "U002",
  /** 用戶未登入點擊"更多"按鈕 */
  U003 = "U003",
  /** 用戶未登入點擊卡片箭頭 */
  U003_2 = "U003_2",
  /** 用戶未登入點擊賠率按鈕 */
  U003_3 = "U003_3",
  /** 調整iframe尺寸 */
  S001 = "S001"
}
