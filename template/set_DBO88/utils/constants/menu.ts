export const RouterNameMapping: Record<string, string> = {
  homepage: "Home",
  promotion: "promotion",
  app_download: "download",
  website_information: "webInformation",
  news: "News",
  // 登入狀態時，允許進入以下頁面
  basic_information: "Profile",
  withdrawal_setting: "memberBank",
  change_password: "ChangePassword",
  site_message: "Inbox",
  deposit: "DepositWithdrawal",
  withdrawal: "DepositWithdrawal",
  history: "TransactionHistory",
  processing_order: "PendingTransaction",
  kyc: "MemberKyc",
  member_level: "vip",
  saba_page: "SabaPage"
  // okbet 版型尚無以下頁面，統一跳回首頁, 等有這些頁面時再加入
  // announcement: "home",
  // affiliate_detail: "home",
  // receive_bonus: "home"
}
