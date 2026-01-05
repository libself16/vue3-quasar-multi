/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  ACTION_TYPE,
  AGENT_TYPE,
  AI_HELPER_EVENT,
  AUTH_REQUIRED,
  ANNOUNCEMENT_MEMBER_TYPE,
  ANNOUNCEMENT_DISPLAY_TYPE,
  BANNER_POSITION,
  CHAT_MESSAGE_TYPE,
  CLAIM_GIFT_TYPE,
  CMS_ARRANGEMENT,
  CMS_DISPLAY_DEVICE,
  CMS_DISPLAY_LOGIN,
  CMS_ENTRANCE_SORT,
  CMS_ENTRANCE_TYPE,
  CMS_OPENING_METHOD,
  CUSTOMER_SERVICES,
  DEPOSIT_REDIRECT_TYPE,
  DEPOSIT_REDIRECT_CHANNEL,
  DOMAIN_TYPE,
  FEE_TYPE,
  FUND_METHOD_TYPE,
  GAME_TYPE,
  GENDER,
  INPUT_TYPE,
  INVITATION_STATUS,
  KYC_ENABLED,
  KYC_STATUS_CODE,
  KYC_TYPE,
  KYC_VERIFIED,
  LANGUAGE_TYPE,
  LEVEL_UP_TYPE,
  LOGIN_PROVIDER,
  LOGO_TYPE,
  MAIL_STATUS,
  MAIL_TYPE,
  OPEN_LOBBY_MODE,
  PENDING_SEARCH_TYPE,
  PENDING_STATUS,
  PROMOTION_CONDITION,
  PIXEL_CODE_TYPE,
  REBATE_STATUS,
  REGISTER_METHOD,
  VIP_REWARDS_SWITCH,
  WALLET_TYPE,
  WITHDRAWAL_PASSWORD
} from "src/common/utils/constants"
import type * as Request from "./request.type"

export interface FirstDepositPromotion {
  integration_id: number
  game_code: string
  game_name?: string
  product_code: number
  product_name?: string
  game_type?: string
  game_type_id: number
  currency_code: string
  channel_code?: string
  rounds: number
}

export interface BaseList<T> {
  list: T
  pagination: Pagination
}

export interface Pagination {
  offset: number
  size: number
  total: number
}

export interface BaseListType {
  label: string
  value: string | number
}

export interface RegistInputCustom {
  column_name: string
  customize: boolean
  edit: boolean
  lang: {
    [key: string]: string
  }
  required: boolean
  type: number
  values: []
  column_rule?: {
    enabled: boolean
    maxLength?: number
    minLength?: number
    requireNumber?: boolean
    requireSpecialChar?: boolean
    requireUpperLowerCase?: boolean
  }
}

export type RegistInputCustomList = RegistInputCustom[]

export interface login {
  account: string
  access_token: string
  agent_id: number
  role_id: number
  user_id: number
  need_change_password: boolean
  need_update_profile: boolean
  is_maya_login: boolean
  maya_last_session_id: string
}

export interface logout {}

export interface register {
  id: string
  account: string
  nickname: string
  password: string
  agent_id: number
  ref_account?: number
  member_level: number
  real_name: string
  date_of_birth: string
  gender: GENDER.Enums
  phone: string
  email: string
  contact: {
    contact1: string
    contact2: string
  }
  enabled: boolean
  block: boolean
  created_at: string
  updated_at: string
}

export interface forgetPassword {}

export interface forgetPasswordSms {
  token: string
  account: string
}

export interface resetPassword {}

export interface TgWebAppLogin {
  launch_url: string
}

export interface GetTotpStatus {
  is_enabled: boolean
  is_verified: boolean
}

export interface GetTotpGenerate {
  issuer: string
  account_name: string
  algorithm: string
  period: number
  digits: number
  secret: string
}

//#region mail
export interface Mail {
  index: number
  id: number
  mail_type: MAIL_TYPE.Enums
  mail_title: string
  mail_body: string
  status: MAIL_STATUS.Enums
  send_at: string
}

export type MailList = Mail[]

export interface MailDetail {
  id: number
  mail_type: MAIL_TYPE.Enums
  mail_title: string
  mail_body: string
  send_at: string
}

export interface MailQuery {
  page: number
  rowsPerPage: number
  rowsNumber: number
  sortBy?: string | null
  descending?: boolean
}

//#endregion

//#region UserInfo
export interface UserInfo {
  username: string
  real_name: string
  nickname: string
  email: string
  phone: string
  gender: GENDER.Enums
  date_of_birth: string
  invite_code: string
  contact: {
    contact1: string
    contact2: string
  }
  empty_password?: boolean
  member_level?: number
  has_withdrawal_password?: boolean
  avatar_path: string
  self_exclusion_at: number | null
  approval_status: boolean
  login_provider?: LOGIN_PROVIDER.Enums // 會員註冊的方式
  login_type?: LOGIN_PROVIDER.Enums // 當前會員登入的方式
  is_member_agent: boolean
}

export interface GetUserInfo {
  account: string // 帳號
  ref_account: string // 推薦人
  invite_code: string // 推薦人
  fullname: string // 真實姓名
  nickname: string // 暱稱
  dob: string // 生日
  gender: GENDER.Enums // 性別
  country: string // 國碼
  phone: string // 電話
  email: string // 電子郵箱
  sns_account_1: string // 通訊軟體1
  sns_account_2: string // 通訊軟體2
  nationality: string // 國籍
  place_of_birth: string // 出生地
  present_address: string // 現居地址
  permanent_address: string // 永久地址
  nature_of_work: string // 工作性質
  source_of_income: string // 收入來源
  gaming_site: number // 遊戲場地
  empty_password: boolean
  member_leve: number
  has_withdrawal_password: boolean
  avatar_path: string
  self_exclusion_at: number | null
  member_level: number
  approval_status: boolean
  login_provider?: LOGIN_PROVIDER.Enums // 會員註冊的方式
  login_type?: LOGIN_PROVIDER.Enums // 當前會員登入的方式
  middle_name: string
  last_name: string
  city: string
  country_name: string
  region: string
  province: string
  area: string
  postal_code: string
  job_type_details: string
  income_source_details: string
  sms_otp: string
  is_member_agent: boolean
  is_sub_ad: boolean
  registered_ip: string // 註冊IP
}

export interface AccountInfo {
  [key: string]: any
  self_exclusion_at: number | null
}

export interface UserWallet {
  currency_id: number
  currency_code: string
  remaining_turnover: string
  balance: string
  in_use: boolean
  label?: string
  wallet_type: WALLET_TYPE.Enums
}

export type UserWalletList = UserWallet[]

export interface UserLevel {
  id: number
  quota: number
  img: string
  lang: string
  updated_time: string
  remark: string
}

export type UserLevelsInfo = UserLevel[]

export interface UserRemark {
  remark: string
}

export type BaseMemberColumn = Record<keyof Request.UserInfoForm, string>

export interface MemberColumn {
  column_name: string
  customize: boolean
  lang?: {
    [key: string]: string
  }
  required: boolean
  edit: boolean
  type: INPUT_TYPE.Enums
  values: BaseListType[]
  column_label?: string
}

export type MemberColumnList = MemberColumn[]
//#endregion

//#region UserPreferences
export interface GetPreferencesExclusion {
  exclusion_at: number | null
}

export interface GetBetLimitSetting {
  id: number
  begin_date: number
  end_date: number
  restrict_amount: string
  currency_id: number
}

export interface GetBetLimit {
  id: number
  begin_date: number
  end_date: number
  currency_id: number
  restrict_amount: string
  amount: string
  settings: GetBetLimitSetting[]
  expanded: boolean
}

export type GetBetLimitList = GetBetLimit[]

export interface GetBetLimitItem {
  id: number
  setting_id: number
  begin_date: number
  end_date: number
  currency_id: number
  restrict_amount: string
  amount: string
}

//#endregion

//#region Game
export interface GameTypeItem {
  id: GAME_TYPE.Enums
  game_type: string
  use_pc_image: boolean
  use_h5_image: boolean
  pc_image: string
  h5_image: string
  updated_at: number
  label?: string
  frontendKey?: string
}

export type GameTypeList = GameTypeItem[]

export interface GameTypeMap {
  [key: number]: GameTypeItem
}

export interface ProductItem {
  integration_id: number
  product_code: number
  product_name: string
  game_type: string
  square_image: string
  tab_image: string
  wide_image: string
  updated_at: number
}

export type ProductList = ProductItem[]

export interface GameItem {
  // game_type: string | number
  // product_name: string
  // updated_at: number
  game_code: string
  game_name: string
  game_type_id: number
  product_code: number
  favorite_count: number
  game_id: number
  hot: boolean
  newly: boolean
  sort: number
  is_favorite: boolean
  custom_image: string
  integration_id: number
  hot_count: number
  integration_created_at: number
  support_currency: string
}

export type GameList = GameItem[]

export interface AllGameList {
  FISHING: GameItem[]
  LIVE_CASINO: GameItem[]
  POKER: GameItem[]
  POPULAR: GameItem[]
  SLOT: GameItem[]
}

export interface LaunchGame {
  game_content: string
  game_url: string
  currencies: string[]
}

export interface OpenGame {
  code: number
  data?: LaunchGame
}

export type FavoriteList = number[]

export interface FavoriteMap {
  [key: number]: boolean
}
//#endregion

//#region bank
export interface AvailCurrency {
  id: number
  code: string
}

export interface PaymentType {
  name: string
  label: string
  value: string
  iconClass: string
}

export interface PaymentGateway {
  id: number
  name: string
  type?: number
  currency?: number
  remark?: string
  logo_image_id?: number
}

export interface PaymentGatewayFilter {
  type?: number
  value: number
  label: string
}

export type PaymentTypeList = PaymentType[]

export type AvailCurrencyList = AvailCurrency[]

export type PaymentGatewayList = PaymentGatewayFilter[]

export interface ExtraField {
  field_code: string
  field_name: string
  is_required: boolean
  type: number
  values: []
}

export interface BankCard {
  id: number
  name: string
  bank_name: string
  account_number: string
  account_name: string
  currency_id: number
  payment_type_id: number
  payment_gateway_id?: number
  currency_code: string
  branch: string
  bank_id: number
  deleted: boolean
  created_at: string
  chain: string
  currency_brand: string
  crypto_rate: number
  wallet_address: string
}

export interface BankCards {
  list: BankCard[]
}

export interface BankCardList {
  payment_type_id: number
  payment_gateway_id: number
  name: string
  bank_name: string
  currency_id: number
  account_number: string
  account_name: string
  crypto_id: number
  bank_id: number
  wallet_address: string
  currency_brand: string
  chain: string
}

export interface BankCardInfo {
  list: BankCard[]
}

export interface Bank {
  id: number
  name: string
}

export interface BankList {
  list: Bank[]
}

export interface TransferInfo {
  id: number
  name: string
  type: FUND_METHOD_TYPE.Enums
  currency: number
  remark: string
  logo_image_id: number
  imgUrl?: string
}

export interface PaymentInfo {
  [key: string]: {
    [key: string]: TransferInfo[]
  }
}

export interface PaymentList {
  list: PaymentInfo
  supported_currency: string[]
}

export interface PaymentExtra {
  field_code: string
  field_name: string
  is_required: boolean
}

export interface ExtraRemark {
  id: number
  type: number
  titles: [
    {
      lang: string
      title: string
    }
  ]
  content?: string // 僅給前端動態輸入用
}

// 上傳從API取得的資料
// ---------------------------------------
export interface UploadRemarkContent {
  base64: string
  path: string
  upload_at: string
}
export interface UploadRemark {
  content: Array<{ title: string; content: string }>
  images: UploadRemarkContent[]
}
// -------------------------------------------------

// 上傳圖片 要送出的資料型別
// ---------------------------------------
interface UploadDetailImage {
  image: {
    base64: ""
    path: ""
  }
  status: boolean
}

export interface UploadConfig {
  transCode: ""
  images: UploadDetailImage[]
  uploadSwitch: boolean
  uploadRemark: UploadRemark
}

// ---------------------------------------

export interface DepositPaymentDetail {
  deposit_min: string
  deposit_max: string
  audit_rate: string
  fee_type: FEE_TYPE.Enums
  extra_field_key: string
  extra_field: {
    [key: string]: ExtraField[]
  }
  extra_remark: ExtraRemark[]
  quick_amounts: string[]
  fee_amount: string
  fee_rate: string
  usdt_rate: string
  bank_name: string
  bank_account: string
  qrcode_image_id: number
  imgUrl: string
  currency_brand: string
  chain: string
  wallet_address: string
  enable_first_deposit_check: boolean
  first_deposit_min: string
}

export interface Deposit {
  amount: string
  currency: number
  redirect_type: DEPOSIT_REDIRECT_TYPE.Enums
  redirect_content: string
  channel: DEPOSIT_REDIRECT_CHANNEL.Enums
}

export interface WithdrawPaymentDetail {
  withdraw_min: string
  withdraw_max: string
  audit_rate: string
  fee_type: FEE_TYPE.Enums
  fee_amount: string
  fee_rate: string
  extra_field_key: string
  extra_field: {
    [key: string]: ExtraField[]
  }
}

export interface WithdrawCryptoRate {
  rate: number
}

export interface WithdrawCryptoCurrency {
  id: number
  code: string
}

//#endregion

//#region chat room
export interface GetMemberSearch {
  account: string
  member_id: number
}

export interface ChatroomRelationItem {
  member_id: number
  account: string
  nickname: string
}

export type GetChatroomRelation = ChatroomRelationItem[]

export interface ChatroomCecentItem {
  chat_room_id: string
  last_message: {
    type: string
    message: CHAT_MESSAGE_TYPE.Enums
  }
  last_message_at: string
  target_account: string
  target_id: number
  target_nickname: string
}

export type GetChatroomCecent = ChatroomCecentItem[]

export interface PostChatroomMessage {
  id: number
  chat_room_id: string
  member_id: number
  target_id: number
  message: {
    message: string
    type: CHAT_MESSAGE_TYPE.Enums
  }
  created_at: string
}

export interface GetChatroomInfo {
  chat_room_id: string
  member_relation: ChatroomRelationItem
}

export interface ChatroomMsgItem {
  id: number
  chat_room_id: string
  member_id: number
  target_id: number
  message: {
    message?: string
    path?: string
    type: CHAT_MESSAGE_TYPE.Enums
  }
  created_at: string
}
export type GetChatroomMessage = ChatroomMsgItem[]
//#endregion

//#region rank
export interface RankItem {
  id: number
  game_name: string
  member_account: string
  bet_amount: string
  prize_amount: string
  created_at: string
  game_code: string
  game_type: GAME_TYPE.Enums
  product_code: number
  settled_at: string
  custom_image: string
  updated_at: number
}
//#endregion

//#region  邀請轉盤
export interface GetReferralWheelCurrent {
  id: number
  agent_id: number
  start_time: string
  end_time: string
  timezone: number
  status: boolean
  created_at: string
  updated_at: string
}

export interface ReferralWheelBonusItem {
  total_amount: string
  currency_id: number
}

export interface ReferralWheelBonusSpinInfo {
  id: number
  referral_wheel_id: number
  member_id: number
  member_account: string
  max_spin_count: number
  used_spin_count: number
  last_spin_at: string
  created_at: string
  updated_at: string
}

export interface GetReferralWheelMemberInfo {
  bonus: ReferralWheelBonusItem[]
  spin_info: ReferralWheelBonusSpinInfo
}

export interface ReferralWheelPrizeItem {
  id: number
  agent_id: number
  prize_name: string
  currency_id: number
  amount: string
  is_random_amount: boolean
  status: boolean
  sort_order: number
  created_at: string
  updated_at: string
  // 前端自訂義渲染欄位
  is_thank_you: boolean
  color: string
  textColor: string
  icon: string
  name: string
}

export type ReferralWheelPrizeList = ReferralWheelPrizeItem[]

export interface PostReferralWheelSpin {
  is_winning: boolean
  winning: {
    id: number
    referral_wheel_id: number
    member_id: number
    member_account: string
    prize_id: number
    prize_name: string
    currency_id: number
    amount: string
    created_at: string
    updated_at: string
  }
}

export interface GetReferralWheelWinnerItem {
  account: string
  amount: string
  time: string
}

export type GetReferralWheelWinners = GetReferralWheelWinnerItem[]

export interface GetReferralWheelMemberPrizeItem {
  id: number
  referral_wheel_id: number
  member_id: number
  member_account: string
  prize_id: number
  prize_name: string
  currency_id: number
  amount: string
  created_at: string
  updated_at: string
}

export type GetReferralWheelMemberPrizes = GetReferralWheelMemberPrizeItem[]
//#endregion

//#region report
export interface MoneyHistory {
  id: number
  game_name?: string
  product_name?: string
  promotion_title?: {
    [key: string]: string
  } | null
  transaction_code?: string
  wager_code?: string
  updated_at?: string
  currency_code?: string
  action_type?: ACTION_TYPE.Enums
  amount?: string
  before_balance?: string
  after_balance?: string
  action_target?: string
  wallet_type: WALLET_TYPE.Enums
  updated_by?: number
}

export type MoneyHistoryList = MoneyHistory[]

export type MoneyHistoryTotal = {
  valid_bet_amount_total: string
  player_profit: string
}

export interface MoneyPending {
  order_type?: PENDING_SEARCH_TYPE.Enums
  trans_code: string
  payment_type?: FUND_METHOD_TYPE.Enums
  payment_gateway_id?: number
  payment_gateway_name?: string
  currency?: number
  amount?: string
  actual_amount?: string
  submit_date?: string
  status?: PENDING_STATUS.Enums
  isActive?: boolean
}

export type MoneyPendingList = MoneyPending[]
//#endregion

//#region 網域管理

export interface DomainItem {
  id: number
  title: string
  name: string
  status: DOMAIN_TYPE.Enums
  detail: string
  created_at: string
  expired_at: string
}

export interface DomainList {
  list: DomainItem[]
  pagination: Pagination & { page: number }
  direct_domain: string
}
//#endregion

export interface GetMemberSummary {
  bet_count: number
  bet_amount: string
  bonus: string
  deposit: string
  login_at: string
  member_id: number
  prize: string
  profit: string
  valid_bet: string
  withdraw: string
  metrics: {
    date: string
    deposit: string
    withdraw: string
  }[]
}

//#region 合營代理
export interface CollaborationStatistics {
  banner: string
  active_member_count: number
  valid_bet_amount: number
  referral_code: string
  title: string
  detail: string
}

export interface InvitationItem {
  member_id: number
  member_account: string
  deposit_count: number
  deposit_amount: number
  valid_bet_amount: number
  status: INVITATION_STATUS.Enums
  currency_id: number
  currency_code: string
}

export interface InvitationList {
  list: InvitationItem[]
  pagination: Pagination & { page: number }
}

export interface RebateItem {
  id: number
  settled_time: string
  active_member_count: number
  valid_bet_amount: number
  level: number
  rebate_amount: number
  currency_id: number
  currency_code: string
  status: REBATE_STATUS.Enums
}

export interface RebateList {
  list: RebateItem[]
  pagination: Pagination & { page: number }
}
//#endregion

export interface Banner {
  code: number
  id: number
  agent_id: number
  sorts: number
  title: string
  start_date: string
  end_date: string
  enabled: boolean
  position: BANNER_POSITION.Enums
  product_code: number
  game_code: string
  game_type: GAME_TYPE.Enums
  image_json: Record<string, string>
  created_at: string
  created_by: number
  updated_at: string
  updated_by: number
  updated_time: number
  link: string
  opening_method: number
}

export type BannerList = Banner[]

export type PixelCode = {
  type: PIXEL_CODE_TYPE.Enums
  content: string
  is_enabled: boolean
}

export type GetPixelCodes = {
  list: PixelCode[]
}

export interface VipCondition {
  currency_id: number
  valid_bet_amount: string
  deposit_amount: string
}

export interface VipReward {
  currency_id: number
  promotion_bonus: string
  birthday_bonus: string
}

export interface VipBenefit {
  currency_id: number
  withdraw: {
    daily_limit: number
    max_amount: string
    fee: string
    monthly_free_limit: number
  }
}

export interface VipRewardBenefit {
  currency_id: number
  promotion_bonus: string
  birthday_bonus: string
  daily_limit: number
  max_amount: string
  fee: string
  monthly_free_limit: number
}

// api response
export interface MemberLevelItem {
  id: number
  level: number
  titles: CmsLangTitle
  img: string
  conditions: VipCondition[]
  rewards: VipReward[]
  benefits: VipBenefit[]
  remark: string
  updated_time: string
  promotion_condition: PROMOTION_CONDITION.Enums
  promotion_type: LEVEL_UP_TYPE.Enums
}

export type MemberLevelist = MemberLevelItem[]

// 多幣別顯示vip
export interface MemberVipItem {
  id: number
  level: number
  title: string
  img: string
  conditions: VipCondition[]
  rewardBenefits: VipRewardBenefit[]
  remark: string
  updated_time: string
  promotion_condition: PROMOTION_CONDITION.Enums
  promotion_type: LEVEL_UP_TYPE.Enums
}

export type MemberVipList = MemberVipItem[]

// 單一幣別顯示vip
export interface VipItem {
  id: number
  level: number
  title: string
  img: string
  condition?: VipCondition
  reward?: VipReward
  benefit?: VipBenefit
  remark: string
  updated_time: string
  promotion_condition: PROMOTION_CONDITION.Enums
  promotion_type: LEVEL_UP_TYPE.Enums
}

export type VipList = VipItem[]

export interface UserStatistics {
  currency_id: number
  total_deposit: string
  total_withdrawal: string
  total_bet_amount: string
  total_valid_bet_amount: string
  total_prize_amount: string
  total_promotion: string
}

export type UserMultiStatistics = UserStatistics[]

export interface UserStatisticsMap {
  [key: number]: UserStatistics
}

export type depositPromotion = {
  id: number
  offer_type: number
  details: CmsLangTitle
  reward: { condition: number; currency_id: number; amount: number; type: number; limit: number; reward_amount: number }
  title: string
}

export interface PromotionDetail {
  promotion_id: number
  lang: string
  title: string
  content: string
  image: string
}

export interface Promotion {
  id: number
  type: number
  category: number
  image: string
  details: PromotionDetail[]
  updated_time: number
}
export type PromotionList = Promotion[]

export type PromotionReward = {
  amount: string
  condition: string
  currency_id: number
  id: number
  level: number
  limit: string
  negative_profit_condition: string
  negative_profit_type: number
  promotion_id: number
  type: number
}

export type PromotionRegister = Promotion & {
  reward: PromotionReward[]
}

export type PromotionRegisterList = PromotionRegister[]

export interface GiftOptions {
  amount: string
  currency_id: number
  currency_code: string
}

export interface Gift {
  id: number
  type: CLAIM_GIFT_TYPE.Enums
  wallet_type: WALLET_TYPE.Enums
  status: PENDING_STATUS.Enums
  options: GiftOptions[]
}

export type GiftList = Gift[]

export interface ISetting {
  agent_code: string
  agent_type: AGENT_TYPE.Enums
  bo_default_language: string
  bo_language: string
  default_language: string
  language: string
  register_method: REGISTER_METHOD.Enums
  customer_support_links: string
  customer_services: string
  digital_analytics: string
  max_search_range: number
  member_bank_edit: number
  member_bank_register: number
  utc_offset: number
  withdraw_payment: string[]
  international_calling_code: string
  open_lobby_mode: OPEN_LOBBY_MODE.Enums
  withdrawal_password: WITHDRAWAL_PASSWORD.Enums
  wallet_type_bonus_flag: boolean
  wallet_type_order: WALLET_TYPE.Enums
  age_confirmation: number
  kyc_setting: string
  withdraw_kyc_verify: number
  open_register_promotion: number
  open_sub_ad: number
  ai_agent: number
  ai_helper: number
  gs1_small_game: number
  upload_details: number
  vip_rewards: VIP_REWARDS_SWITCH.Enums
  saba_widget_id: string
  member_self_bet_restriction_enabled?: number
  member_kyc_verify: KYC_ENABLED.Enums
  auth_required: AUTH_REQUIRED.Enums
}

export interface ISite {
  title: string
}

export interface LogoItem {
  id: number
  agent_id: number
  logo_type: LOGO_TYPE.Enums
  path: string
  updated_time: number
}

export type LogoList = LogoItem[]

export interface GetMiniGameAuthKey {
  auth_key: string
}

export interface PostLaunchMiniGame {
  auth_key: string
  gs1_data: {
    username: string
    player_id: string
    session_token: string
    gs1_player_id: number
  }
}

export type CmsLangTitle = Partial<Record<LANGUAGE_TYPE.Enums, string>>

export type CmsSettingItem = {
  lang: CmsLangTitle
  comfirm_button_lang: CmsLangTitle
  reject_button_lang: CmsLangTitle
  icon_path: string
  img_lang: {
    [key: string]: string
  }
  icon_lang: {
    [key: string]: string
  }
  contact_lang: {
    [key: string]: string
  }
  contact_img_lang: {
    [key: string]: string
  }
  selected_icon_path: string
  payload: {
    arrangement: CMS_ARRANGEMENT.Enums
    entrance_sort: CMS_ENTRANCE_SORT.Enums
    display_login: CMS_DISPLAY_LOGIN.Enums
    display_device: CMS_DISPLAY_DEVICE.Enums
    opening_method: CMS_OPENING_METHOD.Enums
    row_show_mob?: number
    row_show_pc?: number
    view_all?: number
    arrangement_row_pc: number
    arrangement_row_mob: number
    product_integration_id?: number
    product_entrance_type?: number
  }
  logo_sort: string[]
  pop_up_img: string[]
  updated_time: number
}

export type CmsEntranceItem = {
  lang: CmsLangTitle
  type: CMS_ENTRANCE_TYPE.Enums
  sort: number
  payload: {
    integration_id: number
    product_code?: number
    game_code?: string
    game_name?: string
    game_favorite_count?: number
    game_id?: number
    game_type?: GAME_TYPE.Enums
    link?: string
    opening_method?: CMS_OPENING_METHOD.Enums
    link_id?: CMS_ENTRANCE_TYPE.Enums | CUSTOMER_SERVICES.Enums
    game_hot?: number
    game_newly?: number
    did?: string
    appID?: string
    compID?: string
    product_integration_id?: number
  }
  img_path: string
  updated_time: number
}

export type CmsPageItem = {
  lang: LANGUAGE_TYPE.Enums
  title: string
  content: string
}

export type CmsItem = {
  id: number
  url_id: number
  Setting: CmsSettingItem
  Entrance: CmsEntranceItem[]
  Page: CmsPageItem[]
}

export type CmsList = CmsItem[]

export type CmsFlotIcon = {
  language: LANGUAGE_TYPE.Enums
  storage_key: string
}

export type AnnouncementItem = {
  title: string
  content: string
  image_path: string
}

export interface Announcement {
  id: number
  type: ANNOUNCEMENT_MEMBER_TYPE.Enums
  start_time: string
  end_time: string
  detail: Record<string, AnnouncementItem>
  display_options: ANNOUNCEMENT_DISPLAY_TYPE.Enums[]
  langDetail?: AnnouncementItem
}

export type AnnouncementList = Announcement[]

// === 會員代理 ===
interface PaginatedList<T> {
  list: T[]
  offset: number
  size: number
  total: number
}
export interface ReferralInfo {
  url: string
  code: string
}

export interface ReferralSummary {
  member_count: number
  total_valid_betted_amount: string
  total_profit: string
}

type ReferralSettings = {
  currency_limit: {
    [key: string]: number
  }
  is_limit_configured: boolean
}

export interface ReferralSettingDetail extends ReferralSettings {}

interface ReferralSettingItem {
  account: string
  direct_member_count: number
  settings: ReferralSettings
  member_id: number
}

export type ReferralSetting = PaginatedList<ReferralSettingItem>

type Revenue = {
  [key: string]: string
}

export interface ReferralStatementList
  extends PaginatedList<{
    statement_id: number
    billing_date: string
    billing_start: string
    billing_end: string
    cashback_count: number
    revenues: Revenue
  }> {}

export interface ReferralStatementDetail
  extends PaginatedList<{
    member_account: string
    cashback_count: number
    revenues: Revenue
  }> {
  page_summary: {
    cashback_count: number
    revenue_total: Revenue
  }
}

export interface ReferralStatementDetailTotal {
  cashback_count: number
  revenue_total: {
    [key: string]: string
  }
}

export interface ReferralSignupOverviewMetrics {
  currency_id: number
  valid_bet: string
  deposit: string
}
export interface ReferralSignupOverviewRewardsCurrencyRewards {
  currency_id: number
  reward_amount: string
}
export interface ReferralSignupOverviewRewards {
  level_id: number
  active_member_count: number
  currency_rewards: ReferralSignupOverviewRewardsCurrencyRewards[]
  is_reached: boolean
}
export interface ReferralSignupOverviewTranslation {
  description_page: string
  images: string
  language: string
  title: string
}

export interface ReferralSignupOverview {
  member_id: number
  metrics: ReferralSignupOverviewMetrics[]
  rewards: ReferralSignupOverviewRewards[]
  translation: ReferralSignupOverviewTranslation[]
}

//#region kyc
export type kycSettingLangItem = {
  code: LANGUAGE_TYPE.Enums
  title: string
  description: string
}

export type kycSetting = {
  id: number
  kycItemId?: number
  display: boolean
  type: KYC_TYPE.Enums
  lang: kycSettingLangItem[]
}

export interface GetKYCStatus {
  status: KYC_VERIFIED.Enums
}

export interface UserKycItem {
  id: number
  img: string
  type: KYC_TYPE.Enums
  status: KYC_STATUS_CODE.Enums
  correspondence: number
  updated_time: number
  updated_at: number
  fileName: string
}

export type UserKycList = UserKycItem[]

//#endregion

//#region 上級反佣
export interface ReferralRebateSummary {
  calculate_type: number
  profit: string
  valid_bet_amount: string
  revenue_amount: string
}

export interface ReferralRebateStatementsList {
  list: ReferralRebateStatements[]
  pagination: {
    page: number
    offset: number
    size: number
    total: number
  }
}

export interface ReferralRebateStatements {
  account: string
  tier: number
  rate: number
  currency_id: number
  valid_bet_amount: string
  game_type: number
  deposit_amount: string
  profit: string
  revenue_amount: string
}

export interface ReferralRebateEventsList {
  list: ReferralRebateEvents[]
  pagination: {
    page: number
    offset: number
    size: number
    total: number
  }
}

export interface ReferralRebateEvents {
  id: number
  settlement_time: string
  currency_id: number
  valid_bet_amount: string
  game_type: number
  profit: string
  revenue_amount: string
  distribution_time: string
}

// ==== 股東盤 ====
export interface YesterdayReportEvents {
  game_type: number
  prize_amount: string
  profit: string
  valid_bet: string
}

export interface YesterdayReport {
  list: YesterdayReportEvents[]
  pagination: {
    page: number
    offset: number
    size: number
    total: number
  }
}

export interface MyReportEvents {
  member_id: number // 會員 ID
  member_account: string // 會員帳號
  game_type: GAME_TYPE.Enums // 遊戲類別 ID
  valid_bet: number // 有效投注額
  profit: number // 盈虧
  settlement_rate: number // 佣金金額
}

export interface MyReportSummaryEvents {
  member_id: number // 會員 ID
  member_account: string // 會員帳號
  valid_bet: number // 有效投注額
  profit: number // 盈虧
  settlement_rate: number // 佣金金額
  commission: string
}

export interface ConditionType {
  mode: string // 觸發模式：GREATER (大於)、LESS (小於)、RANGE (區間)
  value: string
  min: string
  max: string
  agent_bet_area_index: number
  agent_bet_chip: string
}

export interface RuleType {
  required_count: number
  bet_area_indices: number[]
  agent_bet_chip: string
  agent_bet_area_index: number
  conditions: ConditionType[]
}

export interface EnabledPatternList {
  product_name: string
  game_name: string
  pattern_type: string
  is_active: boolean
  rule: RuleType
}

export interface PostLaunchAI {
  status: boolean
  agent_configs: [
    {
      currency?: string
      balance?: string
      daily_stop_profit?: string
      daily_stop_loss?: string
      enabled_pattern_list?: EnabledPatternList[]
    }
  ]
}

export interface MyReportDetailsEvents {
  id: number
  member_id: number
  member_account: string
  currency_id: number
  total_deposit: number
  valid_bet: number
  profit: number
  commission: number
  active_rate: boolean
}

export interface MyReport {
  list: MyReportEvents[]
  pagination: {
    page: number
    offset: number
    size: number
    total: number
  }
}

export interface MyReportSummary {
  list: MyReportSummaryEvents[]
  pagination: {
    page: number
    offset: number
    size: number
    total: number
  }
}

export interface MyReportDetail {
  list: MyReportDetailsEvents[]
  pagination: {
    page: number
    offset: number
    size: number
    total: number
  }
}

export interface TimeRangeTeamOverview {
  direct_count: number // 直屬下級註冊人數
  direct_first_deposit_count: number // 直屬下級首存人數
  team_first_deposit_count: number // 團隊首存人數
  direct_online_count: number // 直屬下級在線人數
  direct_valid_bet: number // 直屬下級有效投注
  team_valid_bet: number // 團隊有效投注
}

export interface TeamOverView {
  direct_count: string // 直屬總人數
  team_member_count: string // 總人數
  total_received_commission: string // 直屬總佣金
}

export interface ShareholderInfoList {
  list: ShareholderInfoItem[]
}
export interface ShareholderInfoItem {
  language: string //語系
  description_page: string // html
}
//#endregion

// 各個代理代理詳情顯示設定
export interface ProxyDisplayConfig {
  shareholder_detail: boolean // 股東盤
}

export interface Latest {
  downline_valid_bet: string // 下級總投注
  commission: string // 佣金
}

export interface AIHelperEvent {
  [key: string]: any
  event: AI_HELPER_EVENT.Enums
}

export type GetMemberAgentQuotaList = {
  member_id: number
  member_account: string
  hierarchy_level: number
  balance: string
  remain_quota_amount: string
  is_member_agent: boolean
  is_direct_downline: boolean
  is_downline_search_available: boolean
  register_date: number
  last_login_date: number
}

export interface GetMemberAgentQuotaListData {
  list: GetMemberAgentQuotaList[]
  offset: number
  size: number
  total: number
}

export type GetLowerLevelMemberAgentQuotaList = {
  member_id: number
  member_account: string
  hierarchy_level: number
  balance: string
  remain_quota_amount: string
  is_member_agent: boolean
  is_direct_downline: boolean
  is_downline_search_available: boolean
  register_date: number
  last_login_date: number
}

export type GetLowerLevelMemberAgentQuotaListData = {
  list: GetLowerLevelMemberAgentQuotaList[]
  offset: number
  size: number
  total: number
}

export type GetMemberAgentQuotaMoneyHistory = {
  member_account: string
  id: number
  transaction_code: string
  wager_code: string
  product_name: string
  game_name: string
  promotion_title: null
  updated_at: string
  updated_at_unix: string
  currency_code: string
  action_type: number
  wallet_type: number
  amount: string
  before_balance: string
  after_balance: string
  metadata: object
  crypto_id: number
  crypto: string
  crypto_rate: string
  crypto_amount: string
}

export interface GetMemberAgentQuotaMoneyHistoryList {
  list: GetMemberAgentQuotaMoneyHistory[]
  offset: number
  size: number
  total: number
}

export type GetMemberAgentQuotaAmount = {
  currency_id: number
  remain_quota_amount: string
  total_quota_amount: string
}

export type UserBetHistoryTotalItem = {
  currency_code: string
  win_loss_amount: string
}

export type GetUserBetHistoryTotal = {
  login_at: number
  bet_historys: UserBetHistoryTotalItem[]
}

export type ProductAvailableCurrency = {
  currency_id: number
  code: string
}[]
export interface MemberCustomizeColumnList {
  code: number
  msg: string
  data: MemberCustomizeColumnListData[]
}

export interface MemberCustomizeColumnListData {
  column_name: string
  customize: boolean
  edit: boolean
  lang: {
    [key: string]: string
  }
  required: boolean
  type: number
  values: {
    label: string
    value: string
  }[]
  column_label?: string
}

export interface MemberAgentReferralList {
  code: number
  msg: string
  data: MemberAgentReferralListData[]
}

export interface MemberAgentReferralListData {
  member_id: number
  member_account: string
}

export interface MemberAgentTagListData {
  id: number
  name: string
  type: number
  remark: string
  enabled: boolean
  checked?: boolean
}

export interface MemberAgentInfo {
  [key: string]: any
}

export interface GetMemberAgentBetReportList {
  list: GetMemberAgentBetReportItem[]
  summary: GetMemberAgentBetReportSummaryItem
  offset: number
  size: number
  total: number
}

export interface GetMemberAgentBetReportItem {
  bet_amount: string
  bet_count: number
  bonus: string
  member_account: string
  member_id: number
  payout: string
  profit: string
  profit_rate: string
  valid_bet_amount: string
  win_count: number
}

export interface GetMemberAgentBetReportSummaryItem {
  page: GetMemberAgentBetReportSummaryItemPage
  total: GetMemberAgentBetReportSummaryItemTotal
}

export interface GetMemberAgentBetReportSummaryItemPage {
  bet_amount: string
  bet_count: number
  bonus: string
  payout: string
  profit: string
  profit_rate: string
  valid_bet_amount: string
  win_count: number
}

export interface GetMemberAgentBetReportSummaryItemTotal {
  bet_amount: string
  bet_count: number
  bonus: string
  payout: string
  profit: string
  profit_rate: string
  valid_bet_amount: string
  win_count: number
}

export interface GetMemberAgentWagerList {
  list: GetMemberAgentWagerListItemData[]
  summary: GetMemberAgentWagerListItemSummary
  offset: number
  size: number
  total: number
}

export interface GetMemberAgentWagerListItemData {
  bet_amount: string
  channel_code: string
  created_at: string
  game_title: string
  gaming_site: number
  gaming_site_title: string
  member_account: string
  payload: { [key: string]: any }
  payout: string
  product_code: number
  product_title: string
  profit: string
  settled_at: string
  status: number
  status_title: string
  valid_bet_amount: string
  wager_code: string
}

export interface GetMemberAgentWagerListItemSummary {
  page: GetMemberAgentWagerListItemSummaryPage
  total: GetMemberAgentWagerListItemSummaryTotal
}

export interface GetMemberAgentWagerListItemSummaryPage {
  bet_amount: string
  payout: string
  profit: string
  total: number
  valid_bet_amount: string
}

export interface GetMemberAgentWagerListItemSummaryTotal {
  bet_amount: string
  payout: string
  profit: string
  total: number
  valid_bet_amount: string
}

export interface GetMemberAgentWagerDetail {
  content: string
}

export interface GetMemberAgentReport {
  personal: {
    deposit: number
    withdraw: number
    bet_count: number
    bet_amount: number
    valid_bet: number
    prize: number
    profit: number
    rate: number
    bonus: number
  }
  team: {
    deposit: number
    withdraw: number
    bet_count: number
    bet_amount: number
    valid_bet: number
    prize: number
    profit: number
    rate: number
    bonus: number
    member_id: number
    member_account: string
    member_count: number
    currency_id: number
  }
}

export interface GetMemberTeamAgentReportList {
  deposit: number
  withdraw: number
  bet_count: number
  bet_amount: number
  valid_bet: number
  prize: number
  profit: number
  rate: number
  bonus: number
  member_id: number
  member_account: string
  member_count: number
  currency_id: number
}

export interface GetMemberTeamAgentReport {
  list: GetMemberTeamAgentReportList[]
  pagination: {
    offset: number
    size: number
    total: number
  }
}

export type GetS3UploadUrl = {
  upload_url: string
  object_key: string
  expires_at: string
}

export type UploadFileToS3 = {
  file: File
  objectKey: string
  expiresAt: string
}

export interface MayaLoginInfo {
  AgentID: number
  MemberID: number
  Platform: number
  AuthorizeDomainUrl: string
  RedirectURI: string
  IsNeedLogin: boolean
}
