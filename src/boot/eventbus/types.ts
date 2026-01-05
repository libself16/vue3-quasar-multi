import * as Response from "src/api/response.type"
import { ALERT_DIALOG_TYPE, KYC_VERIFIED } from "src/common/utils/constants"

export type OpenAlertDialog = {
  type: ALERT_DIALOG_TYPE.Enums
  show: boolean
  titleI18n: string
  contentI18n: string
  footerBtnTextI18n: string
}

export type AnnouncementAllContentEventPayload = {
  announcements: Response.AnnouncementList
  showDontShowTodayCheckbox: boolean
}

export type AnnouncementImageEventPayload = {
  announcement: Response.Announcement
  index: number
  total: number
  showDontShowTodayCheckbox: boolean
}

export type Events = {
  /** 公告：單筆全內容彈窗 */
  openSingleAnnouncement: (announcement: Response.Announcement) => void
  /** 公告：顯示全內容彈窗 */
  openAllContentAnnouncement: (data: AnnouncementAllContentEventPayload) => void
  /** 公告：顯示圖片彈窗 */
  openImageAnnouncement: (data: AnnouncementImageEventPayload) => void
  /** 公告流程結束 */
  finishedAnnouncement: () => void

  /** 打開共用Alert */
  openAlertDialog: (data: OpenAlertDialog) => void
  /** 打開KYC 驗證結果 */
  openKycResultDialog: (show: boolean, status: KYC_VERIFIED.Enums) => void
  /** 打開KYC 提示 彈窗 */
  openKycUploadDialog: (show: boolean) => void
  /** 打開google topt 彈窗 */
  openGoogleToptDialog: (show: boolean) => void
  /** 打開轉盤彈窗 */
  openRouletteGameDialog: (show: boolean) => void
  /** 打開轉盤中獎彈窗 */
  openRouletteWinningDialog: (show: boolean, status: boolean) => void
  /** 打開AI銷售助手 */
  openAIHelper: (show: boolean, url?: string) => void
  /** AI銷售助手事件 */
  handleAIHelperEvent: (data: Response.AIHelperEvent) => void
  /** AI Fans事件 */
  handleAIFansEvent: (data: Response.AIHelperEvent) => void
  /** AI RPG事件 */
  handleAIRpgEvent: (data: Response.AIHelperEvent) => void
  /** 打開登入彈窗 */
  openLogin: (show: boolean, isPasswordLogin?: boolean) => void
  /** 打開註冊彈窗 */
  openRegister: (show: boolean) => void
  /** 打開註冊彈窗 */
  openRegisterPronotionTip: (show: boolean) => void
  /** 切換註冊form */
  changeRegisterForm: () => void
  /** 註冊form渲染完畢 */
  registerFormReady: () => void
  /** 打開忘記密碼談窗 */
  openForgotPassword: (show: boolean) => void
  /** 打開滑動驗證 */
  openSlideVerify: (show: boolean) => void
  /** 驗證結果 */
  verifyResult: (status: boolean) => void
  /** 打開修改密碼 */
  openChangePassword: (show: boolean) => void
  /** 打開會員輸贏彈窗 */
  openWinLoseDialog: (show: boolean) => void
  /** 打開存款 */
  openDeposit: (show: boolean) => void
  /** 打開取款 */
  openWithdraw: (show: boolean) => void
  /** 打開待處理交易 */
  openOrder: (show: boolean) => void
  /** 更新取款銀行卡列表 */
  updateWithdrawBankCardList: () => void
  /** 打開站內信 */
  openInbox: (show: boolean) => void
  /** 打開歷史紀錄 */
  openHistory: (show: boolean) => void
  /** 打開錢包 */
  openBalance: (show: boolean) => void
  /** 打開網站資訊 */
  openWebInformation: (show: boolean) => void
  /** 打開設定出款密碼 */
  openSetWithdrawalPassword: (show: boolean) => void
  /** 打開新增銀行卡 */
  openAddBankCard: (show: boolean, bankCardId?: number) => void
  /** 打開基本資料 */
  openProfile: (show: boolean) => void
  /** 打開銀行卡詳細 */
  openBankDetail: (show: boolean) => void
  /** 更新銀行卡列表 */
  updateBankCardList: () => void
  /** 打開切換語言 */
  openSwitchLanguage: (show: boolean) => void
  /** 打開聯繫我們 */
  openContactUs: (show: boolean) => void
  /** 打開優惠活動 */
  openPromotion: (show: boolean) => void
  /** 打開下載 */
  openDownload: (show: boolean) => void
  /** 打開VIP */
  openVip: (show: boolean) => void
  /** 打開公告 */
  openAnnouncement: (show: boolean) => void
  /** 打開投注資訊，後面currency為 mini app 修正 */
  openBetDetail: (show: boolean, betDetail?: Response.RankItem, currency?: string | null) => void
  /** 打開存款 Dialog(三方金流來源) */
  openDepositDialog: (show: boolean) => void
  /** 打開取款 Dialog(三方金流來源) */
  openWithdrawalDialog: (show: boolean) => void
  /** 打開會員公告 */
  openAnnouncementDialog: (show: boolean) => void
  /** 打開禮金明細 */
  openClaimGiftDialog: (show: boolean) => void
  /** 打開註冊登入 Dialog */
  openLoginWithRegister: (show: boolean, type?: string) => void
  /** 設置推薦碼 */
  setInviteCode: (inviteCode: string) => void
  /** 打開待處理交易狀態列表 */
  openPendingTransaction: (show: boolean) => void
  /** 打開存款取款彈窗 */
  openDepositWithWithdrawal: (show: boolean, type?: string) => void
  /** 打開註冊後第一次登入會員編輯彈窗 anibet */
  openUpdateProfile: (show: boolean) => void
  /** 打開懸浮圖標彈窗 (目前只有印尼站使用) */
  openFloatingIconDialog: (show: boolean, data?: any) => void
  /** 打開KYC彈窗 */
  openKycDialog: (show: boolean) => void
  /** KYC上傳完成事件 */
  kycUploadCompleted: (success: boolean) => void
}

export const eventKeys: (keyof Events)[] = [
  "openAllContentAnnouncement",
  "openImageAnnouncement",
  "finishedAnnouncement",
  "openLogin",
  "openRegister",
  "openForgotPassword",
  "openSlideVerify",
  "verifyResult",
  "openChangePassword",
  "openWinLoseDialog",
  "openDeposit",
  "openWithdraw",
  "openOrder",
  "updateWithdrawBankCardList",
  "openInbox",
  "openHistory",
  "openBalance",
  "openWebInformation",
  "openSetWithdrawalPassword",
  "openAddBankCard",
  "openProfile",
  "updateBankCardList",
  "openSwitchLanguage",
  "openContactUs",
  "openBetDetail",
  "openDepositDialog",
  "openWithdrawalDialog",
  "openClaimGiftDialog",
  "openFloatingIconDialog",
  "openKycDialog",
  "kycUploadCompleted"
]
