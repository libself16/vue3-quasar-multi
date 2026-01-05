export const RouterNameMapping: Record<string, string> = {
  homepage: "home",
  promotion: "promotion",
  app_download: "download",
  website_information: "webInformation",
  news: "News",
  // 登入狀態時，不允許進入以下頁面, 由於此判斷會影響active 狀態,  所以當format 不到就undefined 沒關係
  // register: "home",
  // forget_password: "home",
  // 登入狀態時，允許進入以下頁面
  basic_information: "memberProfile",
  withdrawal_setting: "memberBank",
  change_password: "memberChangePassword",
  site_message: "memberInbox",
  history: "history",
  deposit: "MemberDeposit",
  withdrawal: "MemberWithdrawal",
  processing_order: "orders",
  kyc: "MemberKyc",
  strategy_detail: "Referral",
  member_strategy: "Referral",
  agent_collaboration_strategy: "Referral",
  member_level: "memberVip"
  // okbet 版型尚無以下頁面，統一跳回首頁, 等有這些頁面時再加入
  // announcement: "home",
  // vip: "home",
  // receive_bonus: "home"
}
