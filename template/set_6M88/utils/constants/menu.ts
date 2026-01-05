export const RouterNameMapping: Record<string, string> = {
  homepage: "Home",
  promotion: "Promotions",
  app_download: "Download",
  website_information: "WebInformationCms",
  // news: "News",
  // 登入狀態時，不允許進入以下頁面, 由於此判斷會影響active 狀態,  所以當format 不到就undefined 沒關係
  // register: "home",
  // forget_password: "home",
  // 登入狀態時，允許進入以下頁面
  basic_information: "Profile",
  withdrawal_setting: "BankDetails",
  change_password: "ChangePassword",
  site_message: "Inbox",
  history: "TransactionHistory",
  deposit: "Deposit",
  withdrawal: "Withdraw",
  processing_order: "PendingTransaction",
  // kyc: "MemberKyc",
  vip: "Vip",
  member_level: "memberVip",
  saba_page: "SabaPage",
  // okbet 版型尚無以下頁面，統一跳回首頁, 等有這些頁面時再加入
  // announcement: "home",
  // affiliate_detail: "home",
  affiliate_detail: "Referral",
  strategy_detail: "Proxy",
  member_strategy: "Referral",
  agent_collaboration_strategy: "Collaboration",
  referral_rebate: "ReferralRebate",
  // okbet 版型尚無以下頁面，統一跳回首頁, 等有這些頁面時再加入
  // announcement: "home",
  // receive_bonus: "home"
}
