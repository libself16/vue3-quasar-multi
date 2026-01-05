export const RouterNameMapping: Record<string, string> = {
  homepage: "home",
  promotion: "promotion",
  app_download: "download",
  contact_us: "ContactUs",
  website_information: "webInformation",
  // 登入狀態時，不允許進入以下頁面, 由於此判斷會影響active 狀態,  所以當format 不到就undefined 沒關係
  // register: "home" // dialog,
  forget_password: "ForgotPass",
  // 登入狀態時，允許進入以下頁面
  basic_information: "memberProfile",
  withdrawal_setting: "memberBank",
  change_password: "memberChangePassword",
  site_message: "memberInbox",
  history: "history",
  deposit: "MemberDeposit",
  withdrawal: "MemberWithdrawal",
  processing_order: "orders",
  vip: "MemberVip",
  referral_rebate: "ReferralRebate",
  member_level: "memberVip",
  saba_page: "SabaPage"
  // set49 版型尚無以下頁面，統一跳回首頁, 等有這些頁面時再加入
  // news: "home",
  // kyc: "MemberKyc",
  // announcement: "home",
  // receive_bonus: "home"
}
