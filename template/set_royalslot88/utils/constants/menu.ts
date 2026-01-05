export const RouterNameMapping: Record<string, string> = {
  homepage: "home",
  promotion: "openPromotion",
  app_download: "openDownload",
  contact_us: "openContactUs",
  website_information: "openWebInformation",
  // news: "News",
  // 登入狀態時，不允許進入以下頁面, 由於此判斷會影響active 狀態,  所以當format 不到就undefined 沒關係
  register: "openRegister",
  // forget_password: "home",
  // 登入狀態時，允許進入以下頁面
  basic_information: "openProfile",
  withdrawal_setting: "openBankDetail",
  change_password: "openChangePassword",
  site_message: "openInbox",
  history: "openHistory",
  deposit: "openDeposit",
  withdrawal: "openWithdraw",
  processing_order: "openOrder",
  // kyc: "MemberKyc"
  // affiliate_detail: "Referral",
  strategy_detail: "Proxy",
  // member_strategy: "Referral",
  agent_collaboration_strategy: "Collaboration",
  // okbet 版型尚無以下頁面，統一跳回首頁, 等有這些頁面時再加入
  announcement: "openAnnouncement",
  vip: "openVip",
  saba_page: "SabaPage"
  // receive_bonus: "home"
}
