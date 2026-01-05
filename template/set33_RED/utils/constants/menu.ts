export const RouterNameMapping: Record<string, string> = {
  homepage: "HomePage",
  promotion: "Promotion",
  app_download: "download",
  // contact_us: "ContactUs",
  website_information: "WebInformationCms",
  news: "News",
  register: "Register",
  forget_password: "ForgotPass",
  // 登入狀態時，允許進入以下頁面
  basic_information: "ProfileDetail",
  withdrawal_setting: "ProfileBank",
  change_password: "ProfilePassword",
  site_message: "ProfileInbox",
  history: "MemberHistory",
  deposit: "MemberDeposit",
  withdrawal: "MemberWithdrawal",
  processing_order: "MemberOrder",
  // agent_collaboration_strategy: "Referral"
  agent_collaboration_strategy: "Collaboration",
  referral_rebate: "ReferralRebate",
  member_strategy: "Referral",
  saba_page: "SabaPage"
  // 尚無以下頁面，統一跳回首頁, 等有這些頁面時再加入
  // announcement: "home",
  // vip: "home",
  // affiliate_detail: "home",
  // receive_bonus: "home"
}
