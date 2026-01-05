export const RouterNameMapping: Record<string, string> = {
  homepage: "home",
  promotion: "promotion",
  app_download: "download",
  contact_us: "ContactUs",
  website_information: "webInformation",
  // 登入狀態時，不允許進入以下頁面, 由於此判斷會影響active 狀態,  所以當format 不到就undefined 沒關係
  register: "Register",
  forget_password: "ForgotPass",
  // 登入狀態時，允許進入以下頁面
  basic_information: "memberCenter",
  withdrawal_setting: "memberBank",
  change_password: "memberChangePassword",
  site_message: "memberInbox",
  history: "history",
  deposit: "MemberDeposit",
  withdrawal: "MemberWithdrawal",
  processing_order: "orders",
  vip: "MemberVip",
  referral_rebate: "ReferralRebate",
  agent_shareholder_strategy: "ShareholderPlatform",
  agent_collaboration_strategy: "Collaboration",
  affiliate_detail: "Proxy",
  chat_room: "memberChatRoom",
  member_level: "memberVip",
  saba_page: "SabaPage"
  // set_r016 版型尚無以下頁面，統一跳回首頁, 等有這些頁面時再加入
  // news: "home",
  // kyc: "MemberKyc",
  // announcement: "home",
  // vip: "home",
  // receive_bonus: "home"
}
