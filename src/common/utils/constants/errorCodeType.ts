export enum Enums {
  SUCCESS = 0,
  SUCCESS2 = 200,

  /** 手機號碼已註冊 */
  PHONE_EXIST = 408001,

  /** 聊天室查無會員 */
  CHATROOM_MEMBER_NICKNAME_REACH_MAX = 40000003,
  CHATROOM_MEMBER_NOT_FOUND = 40000005,

  /** Maya 的 error code */
  P_EXTERNAL_ERROR_MAYA = 499001,

  /** 前端寫死的 error code */
  SERVER_EXCEPTION = 999999,
  PAYLOAD_NOT_ALLOW = 999998,
  EXCEL_IS_EMPTY = 999997,
  CALL_S3_FAILED = 999996,

  /**
   * =========== 總代理端 ===========
   */
  /** 代理代碼已存在 */
  M_AGENT_CODE_EXIST = 201001,
  /** 代理代碼僅允許字元和數字，長度為 4 */
  M_AGENT_CODE_INVALID = 201002,
  /** 代碼不匹配 */
  M_AGENT_CODE_NO_MATCH = 201003,
  /** 用戶已停用 */
  M_USER_IS_DISABLE = 201004,
  /** 用戶已被封鎖 */
  M_USER_IS_BAN = 201005,
  /** M_USER_PASSWORD_WRONG */
  M_USER_PASSWORD_WRONG = 201006,
  /** 使用者名稱或密碼錯誤，已被封鎖 */
  M_USER_PASSWORD_WRONG_AND_BAN = 201007,
  /** 未指定密碼 */
  M_NO_PASSWORD_SPECIFIED = 202001,
  /** 新密碼和確認密碼不同 */
  M_PASSWORD_AND_CONFIRM_PASSWORD_ARE_DIFFERENT = 202002,
  /** 舊密碼不正確 */
  M_OLD_PASSWORD_IS_NOT_CORRECT = 202003,

  /**
   * =========== 代理端 ===========
   */
  /** 用戶存在 */
  A_MEMBER_EXIST = 301001,
  /** 用戶不存在 */
  A_MEMBER_NOT_EXIST = 301002,
  /** 用戶已讀信件 */
  A_MEMBER_MAIL_READED = 301003,
  /** 指定帳戶不是代理，無法調整配額。 */
  A_MEMBER_IS_NOT_MEMBER_AGENT = 301004,
  /** 代理代碼不匹配 */
  A_AGENT_CODE_NO_MATCH = 302001,
  /** 用戶已停用 */
  A_USER_IS_DISABLE = 302002,
  /** 用戶已被封鎖 */
  A_USER_IS_BAN = 302003,
  /** 使用者名稱或密碼錯誤 */
  A_USER_PASSWORD_WRONG = 302004,
  /** 使用者名稱或密碼錯誤，已被封鎖 */
  A_USER_PASSWORD_WRONG_AND_BAN = 302005,
  /** 需要一次性密碼 */
  A_USER_OTP_CODE_IS_REQUIRED = 302006,
  /** 已綁定雙重驗證 */
  A_USER_2FA_IS_BINDED_ALREADY = 302007,
  /** 一次性密碼不匹配 */
  A_USER_OTP_CODE_IS_NOT_MATCH = 302008,
  /** 未指定密碼 */
  A_NO_PASSWORD_SPECIFIED = 303001,
  /** 新密碼和確認密碼不同 */
  A_PASSWORD_AND_CONFIRM_PASSWORD_ARE_DIFFERENT = 303002,
  /** 舊密碼不正確 */
  A_OLD_PASSWORD_IS_NOT_CORRECT = 303003,
  /** 密碼格式錯誤 */
  A_PASSWORD_FORMAT_ERROR = 303004,
  /** 原因不存在 */
  A_REASON_NOT_EXIST = 304001,
  /** 會員錢包不存在 */
  A_MEMBER_WALLET_NOT_EXIST = 304002,
  /** 餘額不足 */
  A_INSUFFICIENT_BALANCE = 304003,
  /** 未找到白名單 */
  A_WHITELIST_NOT_FOUND = 305001,
  /** 此審核已被拒絕或透過 */
  A_PROMOTION_REVIEW_CANNOT_REJECT = 306001,
  /** 該等級仍有會員 */
  A_MEMBER_LEVEL_IS_NOT_EMPTY = 307001,
  /** 預設等級無法修改晉升條件 */
  A_DEFAULT_LEVEL_CANNOT_MODIFY_PROMOTON_CONDITION = 307002,
  /** 等級審核已成功 */
  A_LEVEL_REVIEW_IS_ALREADY_SUCCESS = 307003,
  /** 禮品等級已領取 */
  A_LEVEL_GIFT_OF_LEVEL_ALREADY_TAKEN = 307004,
  /** 未搜尋到代理設定 */
  AgentSettingNotFoundErrorCode = 30000001,
  /** 未搜尋到代理網域 */
  AgentDomainNotFoundErrorCode = 30000002,
  /** 未搜尋到代理 */
  AgentNotFoundErrorCode = 30000003,
  /** 未搜尋到人工智慧語音機器人 */
  AiVoiceBotNotFoundErrorCode = 30001001,
  /** 人工智慧語音機器人電話號碼解析錯誤 */
  AiVoiceBotPhoneNumberParseErrorCode = 30001002,

  /**
   * =========== 會員端 ===========
   */
  /** 用戶已停用 */
  P_USER_IS_DISABLE = 401001,
  /** 用戶被封鎖 */
  P_USER_IS_BAN = 401002,
  /** 使用者名稱或密碼錯誤 */
  P_USER_PASSWORD_WRONG = 401003,
  /** 用戶已自我排除 */
  P_USER_IS_SELF_EXCLUSION = 401004,
  /** 年齡未達要求，必須至少年滿指定歲 */
  P_USER_AGE_REQUIREMENT_NOT_MET = 401005,
  /** 用戶已自我排除 */
  P_USER_PREFERENCES_EXCLUSION = 401006,
  /** 帳戶或郵件地址錯誤 */
  P_ACCOUNT_OR_EMAIL_INCORRECT = 402001,
  /** 電子郵件發送失敗 */
  P_EMAIL_FAILED_TO_SEND = 402002,
  /** 令牌無效 */
  P_EMAIL_TOKEN_NOT_MATCH = 402003,
  /** 密碼和確認密碼不同 */
  P_PASSWORD_AND_CONFIRM_PASSWORD_ARE_DIFFERENT = 403001,
  /** 參考帳戶不存在 */
  P_REF_ACCOUNT_NOT_EXIST = 403002,
  /** 當帳號長度低於站點預設的位數會出現此則錯誤訊息 */
  P_ACCOUNT_TOO_SHORT = 403003,
  /** 當帳號長度超出站點預設的位數會出現此則錯誤訊息 */
  P_ACCOUNT_TOO_LONG = 403004,
  /** 帳號僅能輸入英文字母與數字 */
  P_ACCOUNT_FORMAT_ERROR = 403005,
  /** 當密碼長度低於站點預設的位數會出現此則錯誤訊息 */
  P_PASSWORD_TOO_SHORT = 403006,
  /** 當密碼長度超出站點預設的位數會出現此則錯誤訊息 */
  P_PASSWORD_TOO_LONG = 403007,
  /** 密碼僅能輸入英文字母與數字 */
  P_PASSWORD_FORMAT_ERROR = 403008,
  /** 不支援幣種 */
  P_LAUNCH_GAME_CURRENCY_NOT_SUPPORT = 404001,
  /** 系統維護中 */
  P_LAUNCH_GAME_GSMD_OFFLINE = 404002,
  /** OTP 已過期 */
  P_OTP_EXPIRED = 405001,
  /** OTP 無效 */
  P_INVALID_OTP = 405002,
  /** 銀行卡已存在 */
  P_BANK_CARD_EXIST = 407001,
  /** 出款密碼不匹配 */
  P_WITHDRAWAL_PASSWORD_NOT_MATCH = 407002,
  /** 有待審理的申請 */
  P_HAS_PENDING_APPLICATION = 407003,
  /** 需要KYC驗證 */
  P_WITHDRAW_KYC_REQUIRED = 407004,
  /** 未填寫用戶真實姓名 */
  P_REAL_NAME_NOT_EXIST = 407005,
  /** 用戶真實姓名必須為中文 */
  P_REAL_NAME_REAL_NAME_CHINESE_ONLY = 407006,
  /** 手機號碼已存在 */
  P_PHONE_EXIST = 408001,
  /** 可用額度不足，無法完成儲值操作。 */
  P_CENTER_MEMBER_AGENT_QUOTA_INSUFFICIENT_AVAILABLE_QUOTA = 409001,
  /** 下級帳戶餘額不足，扣款失敗。 */
  P_CENTER_MEMBER_INSUFFICIENT_BALANCE = 409002,
  /** 用戶不存在 */
  P_CENTER_MEMBER_MEMBER_NOT_EXIST = 409003,
  /** 此會員不屬於您的下線 */
  P_CENTER_MEMBER_DOWNLINE_MEMBER_NOT_QUALIFIED = 409004,
  /** 出款狀態為風險控制 */
  P_WITHDRAW_STATUS_RISK_CONTROL = 410001,
  /** 未搜尋到用戶身份 */
  MemberIdentityNotFoundErrorCode = 40000001,
  /** 未搜尋到用戶 */
  MemberNotFoundErrorCode = 40000002,
  /** 關係覆蓋範圍上限 */
  ChatRelationReachMaxErrorCode = 40000003,
  /** 創建關係繁忙 */
  ChatCreateRelationBusyErrorCode = 40000004,
  /** 無此用戶 */
  ChatNoSuchMemberErrorCode = 40000005,
  /** 給自己發訊息 */
  ChatMessageToSelfErrorCode = 40000006,
  /** 無此聊天室 */
  ChatNoSuchChatRoomErrorCode = 40000007,
  /** 未搜尋到GS1設定檔 */
  GS1NoSuchConfigErrorCode = 400001001,
  /** 呼叫外部GS1 API失敗 */
  GS1APIErrorCode = 400001002,
  /** 下級帳戶餘額不足，扣款失敗。 */
  P_CENTER_MEMBER_INSUFFICIENT_MEMBER_AGENT_QUOTA = 409006,
  /** 限制額度不可低於當前累積額度 */
  P_CETNER_MEMBER_SELF_BET_RESTRICTION_AMOUNT_LESSER_THAN_COLLECTION = 409007,
  /** 有重複區間的限制存在 */
  P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXIST_IN_SAME_TIME_RANGE = 409008,
  /** 總區間 < 7天, 要上調額度時, 錯誤提示調整為：限制區間低於7天，無法放寬額度 */
  P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_MAIN_TIME_SETTING = 409009,
  /** 額度已達限制額度上限 */
  P_CETNER_MEMBER_SELF_BET_RESTRICTION_COLLECTION_AMOUNT_MEET_LIMIT = 409010,
  /** 待審存款單數已達到上限 */
  P_MAX_PENDING_DEPOSIT_REACHED = 407027,
  /** 總區間 >= 7天, 剩餘時間 < 7天，要上調額度時, 錯誤提示調整為：剩餘時間區間低於7天，無法放寬額度 */
  P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_SUB_TIME_SETTING = 409012,
  /** TOTP 未啟用 */
  TOTPNotEnabledErrorCode = 40002001,
  /** TOTP Code 錯誤 */
  TOTPInvalidCodeErrorCode = 40002002,

  /**
   * =========== 核心通用 ===========
   */
  /** 令牌無效 */
  CORE_INVALID_AUTHORIZATION = 901001,
  /** JWT 令牌已過期 */
  CORE_JWT_TOKEN_EXPIRED = 901002,
  /** JWT 令牌解析失敗 */
  CORE_JWT_TOKEN_PARSE_FAILED = 901003,
  /** 未找到 JWT 令牌用戶 */
  CORE_JWT_TOKEN_USER_NOT_FOUND = 901004,
  /** JWT 令牌比較存取令牌失敗 */
  CORE_JWT_TOKEN_COMPARISON_ACCESS_TOKEN_FAILED = 901005,
  /** JWT 令牌取得入口失敗 */
  CORE_JWT_TOKEN_GET_ENTRANCE_LAYER_FAILED = 901006,
  /** 未找到 JWT 令牌入口層 */
  CORE_JWT_TOKEN_ENTRANCE_LAYER_NOT_FOUND = 901007,
  /** 令牌無效 */
  CORE_JWT_TOKEN_INVALID_TOKEN = 901008,
  /** IP 未授權 */
  CORE_JWT_TOKEN_UNAUTHORIZED_IP = 901009,
  /** 代理 ID 不匹配 */
  CORE_AGENT_ID_NO_MATCH = 902001,
  /** 子權限不存在 */
  CORE_SUB_PERMISSION_NOT_EXISTS = 902002,
  /** 子權限操作不匹配 */
  CORE_SUB_PERMISSION_ACTION_NO_MATCH = 902003,
  /** 權限不允許 */
  CORE_PERMISSION_IS_NOT_ALLOW = 902004,
  /** 幣別不存在 */
  CORE_CURRENCY_IS_NOT_EXIST = 903001,
  /** 標籤不存在 */
  CORE_LABEL_ID_IS_NOT_EXIST = 904001,
  /** 系統正在維護 */
  CORE_SYSTEM_UNDER_MAINTENANCE = 905001,
  /** 匯出中 */
  CORE_EXPORT_PROCESSING = 906001,
  /** 匯出失敗 */
  CORE_EXPORT_FAILED = 906002,
  /** 解組錯誤 */
  UnmarshalErrorCode = 1000,
  /** 編組錯誤 */
  MarshalErrorCode = 1001,
  /** Http 響應為空錯誤 */
  HttpResponseNilErrorCode = 1002,
  /** 貨幣匯率無效 */
  CurrencyChangeRateInvalidCode = 1003,
  /** 未搜尋到幣別 */
  CurrencyNoFoundCode = 1004,
  /** S3 影像儲存錯誤 */
  S3ImageSaveErrorCode = 1005,
  /** 本機快取資料類型無效 */
  LocalCacheInvalidDataTypeErrorCode = 1006,
  /** 本機快取操作類型無效 */
  LocalCacheInvalidActionTypeErrorCode = 1007,
  /** 本機快取快取鍵無效 */
  LocalCacheInvalidKeyErrorCode = 1008,
  /** 本機快取設定快取失敗 */
  LocalCacheSetCacheFailedErrorCode = 1009,
  /** 本機快取初始化鍵類型錯誤 */
  LocalCacheInitKeyTypeErrorCode = 1010,
  /** 請求錯誤 */
  BAD_REQUEST = 100,
  /** 載荷無效 */
  INVALID_PAYLOAD = 101,
  /** 紀錄不存在 */
  RECORD_NOT_EXISTS = 400,
  /** 令牌無效 */
  INVALID_TOKEN = 401,
  /** 資源被鎖定 */
  RESOURCE_LOCKED = 423,
  /** 伺服器內部錯誤 */
  INTERNAL_SERVER_ERROR = 999,
  /** 小數點第二位檢查 */
  P_CHECK_DECIMAL_PLACES = 407007,
  /** 最多可上傳圖片 */
  P_MAX_IMAGE_QUANTITY = 407008,
  /** 無效的存款金額：超出允許範圍 */
  P_INVALID_DEPOSIT_AMOUNT = 407009,
  /** 會員審核打碼量不足 */
  P_MEMBER_AUDIT_TURNOVER_INSUFFICIENT = 407010,
  /** 資料異常 */
  CODE_DATABASE_ABNORMAL = 14001,
  /** 資料不存在 */
  CODE_DATABASE_NOT_FIND_DATA = 14002,

  /** 會員電子郵件不存在 */
  P_EMAIL_NOT_EXIST = 407012,
  /** 會員手機號碼不存在 */
  P_PHONE_NOT_EXIST = 407013,
  /** 會員銀行卡號必須為10位數字 */
  P_BANK_CARD_MUST_TEN_DIGITS = 407014,
  /** 會員銀行卡號必須為16位數字 */
  P_BANK_CARD_MUST_SIXTEEN_DIGITS = 407015,
  /** 會員CPF號碼必須為11位數字 */
  P_CPF_NO_MUST_BE_11_CHARACTERS = 407016,
  /** 會員CPF號碼必須為數字 */
  P_CPF_NO_MUST_CONTAIN_ONLY_NUMBERS = 407017,
  /** 會員PIX帳號必須為11位數字 */
  P_PIX_ACCOUNT_MUST_BE_11_CHARACTERS = 407018,
  /** 會員PIX帳號必須為數字 */
  P_PIX_ACCOUNT_MUST_CONTAIN_ONLY_NUMBERS = 407019,
  /** 金額必須大於等於5 */
  P_AMOUNT_MUST_FIVE = 407020,
  /** 金額必須大於100且小於10000 */
  P_AMOUNT_MUST_BE_BETWEEN_100_AND_10000 = 407021,
  /** 金額必須為整數 */
  P_AMOUNT_MUST_BE_INTEGER = 407022,
  /** 原始密碼錯誤 */
  P_ORIGINAL_PASSWORD_IS_WRONG = 401007,
  /** 支付錯誤 */
  P_PAYMENT_ERROR = 499002,
  /** 需要用户身份验证 */
  P_USER_AUTH_REQUIRED = 401008,
  /** 推薦碼不存在 */
  P_REFERRAL_CODE_NOT_EXIST = 403009,
  /** 請求類型無效 */
  P_INVALID_REQUEST_TYPE = 405003,
  /** OTP 已驗證 */
  P_OTP_ALREADY_VERIFIED = 405004,
  /** OTP 未找到 */
  P_OTP_NOT_FOUND = 405005,
  /** OTP 代碼不符 */
  P_OTP_CODE_NOT_MATCH = 405006,
  /** 搜尋日期限制天數 */
  CORE_SEARCH_RANGE_EXCEED = 907001,
  /** 會員不可入款 */
  P_DEPOSIT_DISABLED = 407023,
  /** KYC 圖片數量達到上限 */
  P_CENTER_MEMBER_KYC_IMAGE_LIMIT_EXCEEDED = 409011,
  /** JENKINS 觸發錯誤 */
  A_JENKINS_BUILD_ERROR = 311001,
  /** 首次存款金額不符合要求 */
  P_INVALID_FIRST_DEPOSIT_AMOUNT = 407024,
  /** 會員不可出款 */
  P_WITHDRAW_DISABLED = 407025,
  /** 提款金額不在允許範圍內 */
  P_INVALID_WITHDRAW_AMOUNT_RANGE = 407026,

  /** 餘額不足，請充值後再試。 */
  GSCInsufficientBalanceErrorCode = 99000101,
  /** 代理商餘額不足 */
  GSCInsufficientAgBalanceErrorCode = 99000102,
  /** 金額超出可下注範圍，請調整後重試。 */
  GSCAmountOutOfRangeErrorCode = 99000103,
  /** 幣別不符，請重新選擇幣別。 */
  GSCCurrencyNotMatchedErrorCode = 99000104,
  /** 無效的幣別設定，請重新操作。 */
  GSCInvalidCurrencyErrorCode = 99000105,

  /** 找不到玩家資料，請重新登入。 */
  GSCPlayerNotFoundErrorCode = 99000201,
  /** 密碼錯誤，請確認後再試。 */
  GSCPasswordIncorrectErrorCode = 99000202,
  /** 登入已逾期，請重新登入。 */
  GSCInvalidPlayerSessionErrorCode = 99000203,
  /** 登入已過期，請重新登入。 */
  GSCSessionExpiredErrorCode = 99000204,
  /** 驗證設定失敗，請稍後再試。 */
  GSCSetOTPFailedErrorCode = 99000205,

  /** 目前無法進入遊戲，請稍後再試或聯繫客服。 */
  GSCGameNotFoundErrorCode = 99000301,
  /** 此遊戲目前暫不支援，請選擇其他遊戲。 */
  GSCGameNotSupportedErrorCode = 99000302,
  /** 目前無法開啟遊戲，請重新嘗試或聯繫客服。 */
  GSCInvalidGameCodeErrorCode = 99000303,
  /** 遊戲啟動失敗，請稍後再試。 */
  GSCLaunchGameFailedErrorCode = 99000304,
  /** 此遊戲需設定為英文語系才能啟動。 */
  GSCGameLangSettingNeedEnglishErrorCode = 99000305,
  /** 此語言設定暫不支援，請切換語系後重試。 */
  GSCGameLangSettingNotSupportErrorCode = 99000306,
  /** 此遊戲不支援免費回合，請選擇其他遊戲。 */
  GSCGameNotSupportFreeRoundErrorCode = 99000307,

  /** 重複下注，請勿重複提交。 */
  GSCWagerAlreadyExistsErrorCode = 99000401,
  /** 注單已結算或取消，無法重複操作。 */
  GSCWagerAlreadySettledOrCancelErrorCode = 99000402,
  /** 找不到注單，請稍後再試或聯繫客服。 */
  GSCWagerNotFoundErrorCode = 99000403,
  /** 注單已回滾，請重新下注。 */
  GSCWagerHasBeenRollbackErrorCode = 99000404,
  /** 找不到免費回合，請重新進入遊戲。 */
  GSCFreeRoundNotFoundErrorCode = 99000405,
  /** 免費回合次數已用完。 */
  GSCFreeRoundExceedLimitErrorCode = 99000406,
  /** 未預期的錯誤（例如伺服器或供應商錯誤） */
  UnexpectedSystemErrorCode = 1011
}

export const I18nKeys: Partial<Record<Enums, string>> = {
  /**
   * =========== 總代理端 ===========
   */
  [Enums.M_AGENT_CODE_EXIST]: "error_message.M_AGENT_CODE_EXIST",
  [Enums.M_AGENT_CODE_INVALID]: "error_message.M_AGENT_CODE_INVALID",
  [Enums.M_AGENT_CODE_NO_MATCH]: "error_message.M_AGENT_CODE_NO_MATCH",
  [Enums.M_USER_IS_DISABLE]: "error_message.M_USER_IS_DISABLE",
  [Enums.M_USER_IS_BAN]: "error_message.M_USER_IS_BAN",
  [Enums.M_USER_PASSWORD_WRONG]: "error_message.M_USER_PASSWORD_WRONG",
  [Enums.M_USER_PASSWORD_WRONG_AND_BAN]: "error_message.M_USER_PASSWORD_WRONG_AND_BAN",
  [Enums.M_NO_PASSWORD_SPECIFIED]: "error_message.M_NO_PASSWORD_SPECIFIED",
  [Enums.M_PASSWORD_AND_CONFIRM_PASSWORD_ARE_DIFFERENT]: "error_message.M_PASSWORD_AND_CONFIRM_PASSWORD_ARE_DIFFERENT",
  [Enums.M_OLD_PASSWORD_IS_NOT_CORRECT]: "error_message.M_OLD_PASSWORD_IS_NOT_CORRECT",

  /**
   * =========== 代理端 ===========
   */
  [Enums.A_MEMBER_EXIST]: "error_message.A_MEMBER_EXIST",
  [Enums.A_MEMBER_NOT_EXIST]: "error_message.A_MEMBER_NOT_EXIST",
  [Enums.A_MEMBER_MAIL_READED]: "error_message.A_MEMBER_MAIL_READED",
  [Enums.A_MEMBER_IS_NOT_MEMBER_AGENT]: "error_message.A_MEMBER_IS_NOT_MEMBER_AGENT",
  [Enums.A_AGENT_CODE_NO_MATCH]: "error_message.A_AGENT_CODE_NO_MATCH",
  [Enums.A_USER_IS_DISABLE]: "error_message.A_USER_IS_DISABLE",
  [Enums.A_USER_IS_BAN]: "error_message.A_USER_IS_BAN",
  [Enums.A_USER_PASSWORD_WRONG]: "error_message.A_USER_PASSWORD_WRONG",
  [Enums.A_USER_PASSWORD_WRONG_AND_BAN]: "error_message.A_USER_PASSWORD_WRONG_AND_BAN",
  [Enums.A_USER_OTP_CODE_IS_REQUIRED]: "error_message.A_USER_OTP_CODE_IS_REQUIRED",
  [Enums.A_USER_2FA_IS_BINDED_ALREADY]: "error_message.A_USER_2FA_IS_BINDED_ALREADY",
  [Enums.A_USER_OTP_CODE_IS_NOT_MATCH]: "error_message.A_USER_OTP_CODE_IS_NOT_MATCH",
  [Enums.A_NO_PASSWORD_SPECIFIED]: "error_message.A_NO_PASSWORD_SPECIFIED",
  [Enums.A_PASSWORD_AND_CONFIRM_PASSWORD_ARE_DIFFERENT]: "error_message.A_PASSWORD_AND_CONFIRM_PASSWORD_ARE_DIFFERENT",
  [Enums.A_OLD_PASSWORD_IS_NOT_CORRECT]: "error_message.A_OLD_PASSWORD_IS_NOT_CORRECT",
  [Enums.A_PASSWORD_FORMAT_ERROR]: "error_message.A_PASSWORD_FORMAT_ERROR",
  [Enums.A_REASON_NOT_EXIST]: "error_message.A_REASON_NOT_EXIST",
  [Enums.A_MEMBER_WALLET_NOT_EXIST]: "error_message.A_MEMBER_WALLET_NOT_EXIST",
  [Enums.A_INSUFFICIENT_BALANCE]: "error_message.A_INSUFFICIENT_BALANCE",
  [Enums.A_WHITELIST_NOT_FOUND]: "error_message.A_WHITELIST_NOT_FOUND",
  [Enums.A_PROMOTION_REVIEW_CANNOT_REJECT]: "error_message.A_PROMOTION_REVIEW_CANNOT_REJECT",
  [Enums.A_MEMBER_LEVEL_IS_NOT_EMPTY]: "error_message.A_MEMBER_LEVEL_IS_NOT_EMPTY",
  [Enums.A_DEFAULT_LEVEL_CANNOT_MODIFY_PROMOTON_CONDITION]:
    "error_message.A_DEFAULT_LEVEL_CANNOT_MODIFY_PROMOTON_CONDITION",
  [Enums.A_LEVEL_REVIEW_IS_ALREADY_SUCCESS]: "error_message.A_LEVEL_REVIEW_IS_ALREADY_SUCCESS",
  [Enums.A_LEVEL_GIFT_OF_LEVEL_ALREADY_TAKEN]: "error_message.A_LEVEL_GIFT_OF_LEVEL_ALREADY_TAKEN",
  [Enums.AgentSettingNotFoundErrorCode]: "error_message.AgentSettingNotFoundErrorCode",
  [Enums.AgentDomainNotFoundErrorCode]: "error_message.AgentDomainNotFoundErrorCode",
  [Enums.AgentNotFoundErrorCode]: "error_message.AgentNotFoundErrorCode",
  [Enums.AiVoiceBotNotFoundErrorCode]: "error_message.AiVoiceBotNotFoundErrorCode",
  [Enums.AiVoiceBotPhoneNumberParseErrorCode]: "error_message.AiVoiceBotPhoneNumberParseErrorCode",

  /**
   * =========== 會員端 ===========
   */
  [Enums.P_USER_IS_DISABLE]: "error_message.P_USER_IS_DISABLE",
  [Enums.P_USER_IS_BAN]: "error_message.P_USER_IS_BAN",
  [Enums.P_USER_PASSWORD_WRONG]: "error_message.P_USER_PASSWORD_WRONG",
  [Enums.P_USER_IS_SELF_EXCLUSION]: "error_message.P_USER_IS_SELF_EXCLUSION",
  [Enums.P_USER_AGE_REQUIREMENT_NOT_MET]: "error_message.P_USER_AGE_REQUIREMENT_NOT_MET",
  [Enums.P_USER_PREFERENCES_EXCLUSION]: "error_message.P_USER_PREFERENCES_EXCLUSION",
  [Enums.P_ACCOUNT_OR_EMAIL_INCORRECT]: "error_message.P_ACCOUNT_OR_EMAIL_INCORRECT",
  [Enums.P_EMAIL_FAILED_TO_SEND]: "error_message.P_EMAIL_FAILED_TO_SEND",
  [Enums.P_EMAIL_TOKEN_NOT_MATCH]: "error_message.P_EMAIL_TOKEN_NOT_MATCH",
  [Enums.P_PASSWORD_AND_CONFIRM_PASSWORD_ARE_DIFFERENT]: "error_message.P_PASSWORD_AND_CONFIRM_PASSWORD_ARE_DIFFERENT",
  [Enums.P_REF_ACCOUNT_NOT_EXIST]: "error_message.P_REF_ACCOUNT_NOT_EXIST",
  [Enums.P_ACCOUNT_TOO_SHORT]: "error_message.P_ACCOUNT_TOO_SHORT",
  [Enums.P_ACCOUNT_TOO_LONG]: "error_message.P_ACCOUNT_TOO_LONG",
  [Enums.P_ACCOUNT_FORMAT_ERROR]: "error_message.P_ACCOUNT_FORMAT_ERROR",
  [Enums.P_PASSWORD_TOO_SHORT]: "error_message.P_PASSWORD_TOO_SHORT",
  [Enums.P_PASSWORD_TOO_LONG]: "error_message.P_PASSWORD_TOO_LONG",
  [Enums.P_PASSWORD_FORMAT_ERROR]: "error_message.P_PASSWORD_FORMAT_ERROR",
  [Enums.P_LAUNCH_GAME_CURRENCY_NOT_SUPPORT]: "error_message.P_LAUNCH_GAME_CURRENCY_NOT_SUPPORT",
  [Enums.P_LAUNCH_GAME_GSMD_OFFLINE]: "error_message.P_LAUNCH_GAME_GSMD_OFFLINE",
  [Enums.P_OTP_EXPIRED]: "error_message.P_OTP_EXPIRED",
  [Enums.P_INVALID_OTP]: "error_message.P_INVALID_OTP",
  [Enums.P_BANK_CARD_EXIST]: "error_message.P_BANK_CARD_EXIST",
  [Enums.P_WITHDRAWAL_PASSWORD_NOT_MATCH]: "error_message.P_WITHDRAWAL_PASSWORD_NOT_MATCH",
  [Enums.P_HAS_PENDING_APPLICATION]: "error_message.P_HAS_PENDING_APPLICATION",
  [Enums.P_WITHDRAW_KYC_REQUIRED]: "error_message.P_WITHDRAW_KYC_REQUIRED",
  [Enums.P_REAL_NAME_NOT_EXIST]: "error_message.P_REAL_NAME_NOT_EXIST",
  [Enums.P_REAL_NAME_REAL_NAME_CHINESE_ONLY]: "error_message.P_REAL_NAME_REAL_NAME_CHINESE_ONLY",
  [Enums.P_PHONE_EXIST]: "error_message.P_PHONE_EXIST",
  [Enums.P_CENTER_MEMBER_AGENT_QUOTA_INSUFFICIENT_AVAILABLE_QUOTA]:
    "error_message.P_CENTER_MEMBER_AGENT_QUOTA_INSUFFICIENT_AVAILABLE_QUOTA",
  [Enums.P_CENTER_MEMBER_INSUFFICIENT_BALANCE]: "error_message.P_CENTER_MEMBER_INSUFFICIENT_BALANCE",
  [Enums.P_CENTER_MEMBER_MEMBER_NOT_EXIST]: "error_message.P_CENTER_MEMBER_MEMBER_NOT_EXIST",
  [Enums.P_CENTER_MEMBER_DOWNLINE_MEMBER_NOT_QUALIFIED]: "error_message.P_CENTER_MEMBER_DOWNLINE_MEMBER_NOT_QUALIFIED",
  [Enums.P_WITHDRAW_STATUS_RISK_CONTROL]: "error_message.P_WITHDRAW_STATUS_RISK_CONTROL",
  [Enums.P_EXTERNAL_ERROR_MAYA]: "error_message.P_EXTERNAL_ERROR_MAYA",
  [Enums.MemberIdentityNotFoundErrorCode]: "error_message.MemberIdentityNotFoundErrorCode",
  [Enums.MemberNotFoundErrorCode]: "error_message.MemberNotFoundErrorCode",
  [Enums.ChatRelationReachMaxErrorCode]: "error_message.ChatRelationReachMaxErrorCode",
  [Enums.ChatCreateRelationBusyErrorCode]: "error_message.ChatCreateRelationBusyErrorCode",
  [Enums.ChatNoSuchMemberErrorCode]: "error_message.ChatNoSuchMemberErrorCode",
  [Enums.ChatMessageToSelfErrorCode]: "error_message.ChatMessageToSelfErrorCode",
  [Enums.ChatNoSuchChatRoomErrorCode]: "error_message.ChatNoSuchChatRoomErrorCode",
  [Enums.GS1NoSuchConfigErrorCode]: "error_message.GS1NoSuchConfigErrorCode",
  [Enums.GS1APIErrorCode]: "error_message.GS1APIErrorCode",
  [Enums.P_CENTER_MEMBER_INSUFFICIENT_MEMBER_AGENT_QUOTA]:
    "error_message.P_CENTER_MEMBER_INSUFFICIENT_MEMBER_AGENT_QUOTA",
  [Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_AMOUNT_LESSER_THAN_COLLECTION]:
    "error_message.P_CETNER_MEMBER_SELF_BET_RESTRICTION_AMOUNT_LESSER_THAN_COLLECTION",
  [Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXIST_IN_SAME_TIME_RANGE]:
    "error_message.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXIST_IN_SAME_TIME_RANGE",
  [Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_MAIN_TIME_SETTING]:
    "error_message.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_MAIN_TIME_SETTING",
  [Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_COLLECTION_AMOUNT_MEET_LIMIT]:
    "error_message.P_CETNER_MEMBER_SELF_BET_RESTRICTION_COLLECTION_AMOUNT_MEET_LIMIT",
  [Enums.P_MAX_PENDING_DEPOSIT_REACHED]: "error_message.P_MAX_PENDING_DEPOSIT_REACHED",
  [Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_SUB_TIME_SETTING]:
    "error_message.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_SUB_TIME_SETTING",
  [Enums.TOTPNotEnabledErrorCode]: "error_message.TOTPNotEnabledErrorCode",
  [Enums.TOTPInvalidCodeErrorCode]: "error_message.TOTPInvalidCodeErrorCode",

  /**
   * =========== 核心通用 ===========
   */
  [Enums.CORE_INVALID_AUTHORIZATION]: "error_message.CORE_INVALID_AUTHORIZATION",
  [Enums.CORE_JWT_TOKEN_EXPIRED]: "error_message.CORE_JWT_TOKEN_EXPIRED",
  [Enums.CORE_JWT_TOKEN_PARSE_FAILED]: "error_message.CORE_JWT_TOKEN_PARSE_FAILED",
  [Enums.CORE_JWT_TOKEN_USER_NOT_FOUND]: "error_message.CORE_JWT_TOKEN_USER_NOT_FOUND",
  [Enums.CORE_JWT_TOKEN_COMPARISON_ACCESS_TOKEN_FAILED]: "error_message.CORE_JWT_TOKEN_COMPARISON_ACCESS_TOKEN_FAILED",
  [Enums.CORE_JWT_TOKEN_GET_ENTRANCE_LAYER_FAILED]: "error_message.CORE_JWT_TOKEN_GET_ENTRANCE_LAYER_FAILED",
  [Enums.CORE_JWT_TOKEN_ENTRANCE_LAYER_NOT_FOUND]: "error_message.CORE_JWT_TOKEN_ENTRANCE_LAYER_NOT_FOUND",
  [Enums.CORE_JWT_TOKEN_INVALID_TOKEN]: "error_message.CORE_JWT_TOKEN_INVALID_TOKEN",
  [Enums.CORE_JWT_TOKEN_UNAUTHORIZED_IP]: "error_message.CORE_JWT_TOKEN_UNAUTHORIZED_IP",
  [Enums.CORE_AGENT_ID_NO_MATCH]: "error_message.CORE_AGENT_ID_NO_MATCH",
  [Enums.CORE_SUB_PERMISSION_NOT_EXISTS]: "error_message.CORE_SUB_PERMISSION_NOT_EXISTS",
  [Enums.CORE_SUB_PERMISSION_ACTION_NO_MATCH]: "error_message.CORE_SUB_PERMISSION_ACTION_NO_MATCH",
  [Enums.CORE_PERMISSION_IS_NOT_ALLOW]: "error_message.CORE_PERMISSION_IS_NOT_ALLOW",
  [Enums.CORE_CURRENCY_IS_NOT_EXIST]: "error_message.CORE_CURRENCY_IS_NOT_EXIST",
  [Enums.CORE_LABEL_ID_IS_NOT_EXIST]: "error_message.CORE_LABEL_ID_IS_NOT_EXIST",
  [Enums.CORE_SYSTEM_UNDER_MAINTENANCE]: "error_message.CORE_SYSTEM_UNDER_MAINTENANCE",
  [Enums.CORE_EXPORT_PROCESSING]: "error_message.CORE_EXPORT_PROCESSING",
  [Enums.CORE_EXPORT_FAILED]: "error_message.CORE_EXPORT_FAILED",
  [Enums.UnmarshalErrorCode]: "error_message.UnmarshalErrorCode",
  [Enums.MarshalErrorCode]: "error_message.MarshalErrorCode",
  [Enums.HttpResponseNilErrorCode]: "error_message.HttpResponseNilErrorCode",
  [Enums.CurrencyChangeRateInvalidCode]: "error_message.CurrencyChangeRateInvalidCode",
  [Enums.CurrencyNoFoundCode]: "error_message.CurrencyNoFoundCode",
  [Enums.S3ImageSaveErrorCode]: "error_message.S3ImageSaveErrorCode",
  [Enums.LocalCacheInvalidDataTypeErrorCode]: "error_message.LocalCacheInvalidDataTypeErrorCode",
  [Enums.LocalCacheInvalidActionTypeErrorCode]: "error_message.LocalCacheInvalidActionTypeErrorCode",
  [Enums.LocalCacheInvalidKeyErrorCode]: "error_message.LocalCacheInvalidKeyErrorCode",
  [Enums.LocalCacheSetCacheFailedErrorCode]: "error_message.LocalCacheSetCacheFailedErrorCode",
  [Enums.LocalCacheInitKeyTypeErrorCode]: "error_message.LocalCacheInitKeyTypeErrorCode",

  [Enums.BAD_REQUEST]: "error_message.BAD_REQUEST",
  [Enums.INVALID_PAYLOAD]: "error_message.INVALID_PAYLOAD",
  [Enums.RECORD_NOT_EXISTS]: "error_message.RECORD_NOT_EXISTS",
  [Enums.INVALID_TOKEN]: "error_message.INVALID_TOKEN",
  [Enums.RESOURCE_LOCKED]: "error_message.RESOURCE_LOCKED",
  [Enums.INTERNAL_SERVER_ERROR]: "error_message.INTERNAL_SERVER_ERROR",
  [Enums.P_CHECK_DECIMAL_PLACES]: "error_message.P_CHECK_DECIMAL_PLACES",
  [Enums.P_MAX_IMAGE_QUANTITY]: "error_message.P_MAX_IMAGE_QUANTITY",
  [Enums.P_INVALID_DEPOSIT_AMOUNT]: "error_message.P_INVALID_DEPOSIT_AMOUNT",
  [Enums.P_MEMBER_AUDIT_TURNOVER_INSUFFICIENT]: "error_message.P_MEMBER_AUDIT_TURNOVER_INSUFFICIENT",
  [Enums.CODE_DATABASE_ABNORMAL]: "error_message.CODE_DATABASE_ABNORMAL",
  [Enums.CODE_DATABASE_NOT_FIND_DATA]: "error_message.CODE_DATABASE_NOT_FIND_DATA",
  [Enums.P_EMAIL_NOT_EXIST]: "error_message.P_EMAIL_NOT_EXIST",
  [Enums.P_PHONE_NOT_EXIST]: "error_message.P_PHONE_NOT_EXIST",
  [Enums.P_BANK_CARD_MUST_TEN_DIGITS]: "error_message.P_BANK_CARD_MUST_TEN_DIGITS",
  [Enums.P_BANK_CARD_MUST_SIXTEEN_DIGITS]: "error_message.P_BANK_CARD_MUST_SIXTEEN_DIGITS",
  [Enums.P_CPF_NO_MUST_BE_11_CHARACTERS]: "error_message.P_CPF_NO_MUST_BE_11_CHARACTERS",
  [Enums.P_CPF_NO_MUST_CONTAIN_ONLY_NUMBERS]: "error_message.P_CPF_NO_MUST_CONTAIN_ONLY_NUMBERS",
  [Enums.P_PIX_ACCOUNT_MUST_BE_11_CHARACTERS]: "error_message.P_PIX_ACCOUNT_MUST_BE_11_CHARACTERS",
  [Enums.P_PIX_ACCOUNT_MUST_CONTAIN_ONLY_NUMBERS]: "error_message.P_PIX_ACCOUNT_MUST_CONTAIN_ONLY_NUMBERS",
  [Enums.P_AMOUNT_MUST_FIVE]: "error_message.P_AMOUNT_MUST_FIVE",
  [Enums.P_AMOUNT_MUST_BE_BETWEEN_100_AND_10000]: "error_message.P_AMOUNT_MUST_BE_BETWEEN_100_AND_10000",
  [Enums.P_AMOUNT_MUST_BE_INTEGER]: "error_message.P_AMOUNT_MUST_BE_INTEGER",
  [Enums.P_ORIGINAL_PASSWORD_IS_WRONG]: "error_message.P_ORIGINAL_PASSWORD_IS_WRONG",
  [Enums.P_PAYMENT_ERROR]: "error_message.P_PAYMENT_ERROR",
  [Enums.P_USER_AUTH_REQUIRED]: "error_message.P_USER_AUTH_REQUIRED",
  [Enums.P_REFERRAL_CODE_NOT_EXIST]: "error_message.P_REFERRAL_CODE_NOT_EXIST",
  [Enums.P_INVALID_REQUEST_TYPE]: "error_message.P_INVALID_REQUEST_TYPE",
  [Enums.P_OTP_ALREADY_VERIFIED]: "error_message.P_OTP_ALREADY_VERIFIED",
  [Enums.P_OTP_NOT_FOUND]: "error_message.P_OTP_NOT_FOUND",
  [Enums.P_OTP_CODE_NOT_MATCH]: "error_message.P_OTP_CODE_NOT_MATCH",
  [Enums.CORE_SEARCH_RANGE_EXCEED]: "error_message.CORE_SEARCH_RANGE_EXCEED",
  [Enums.P_DEPOSIT_DISABLED]: "error_message.P_DEPOSIT_DISABLED",
  [Enums.P_CENTER_MEMBER_KYC_IMAGE_LIMIT_EXCEEDED]: "error_message.P_CENTER_MEMBER_KYC_IMAGE_LIMIT_EXCEEDED",
  [Enums.A_JENKINS_BUILD_ERROR]: "error_message.A_JENKINS_BUILD_ERROR",
  [Enums.P_INVALID_FIRST_DEPOSIT_AMOUNT]: "error_message.P_INVALID_FIRST_DEPOSIT_AMOUNT",
  [Enums.P_WITHDRAW_DISABLED]: "error_message.P_WITHDRAW_DISABLED",
  [Enums.P_INVALID_WITHDRAW_AMOUNT_RANGE]: "error_message.P_INVALID_WITHDRAW_AMOUNT_RANGE",
  [Enums.GSCInsufficientBalanceErrorCode]: "error_message.GSCInsufficientBalanceErrorCode",
  [Enums.GSCInsufficientAgBalanceErrorCode]: "error_message.GSCInsufficientAgBalanceErrorCode",
  [Enums.GSCAmountOutOfRangeErrorCode]: "error_message.GSCAmountOutOfRangeErrorCode",
  [Enums.GSCCurrencyNotMatchedErrorCode]: "error_message.GSCCurrencyNotMatchedErrorCode",
  [Enums.GSCInvalidCurrencyErrorCode]: "error_message.GSCInvalidCurrencyErrorCode",
  [Enums.GSCPlayerNotFoundErrorCode]: "error_message.GSCPlayerNotFoundErrorCode",
  [Enums.GSCPasswordIncorrectErrorCode]: "error_message.GSCPasswordIncorrectErrorCode",
  [Enums.GSCInvalidPlayerSessionErrorCode]: "error_message.GSCInvalidPlayerSessionErrorCode",
  [Enums.GSCSessionExpiredErrorCode]: "error_message.GSCSessionExpiredErrorCode",
  [Enums.GSCSetOTPFailedErrorCode]: "error_message.GSCSetOTPFailedErrorCode",
  [Enums.GSCGameNotFoundErrorCode]: "error_message.GSCGameNotFoundErrorCode",
  [Enums.GSCGameNotSupportedErrorCode]: "error_message.GSCGameNotSupportedErrorCode",
  [Enums.GSCInvalidGameCodeErrorCode]: "error_message.GSCInvalidGameCodeErrorCode",
  [Enums.GSCLaunchGameFailedErrorCode]: "error_message.GSCLaunchGameFailedErrorCode",
  [Enums.GSCGameLangSettingNeedEnglishErrorCode]: "error_message.GSCGameLangSettingNeedEnglishErrorCode",
  [Enums.GSCGameLangSettingNotSupportErrorCode]: "error_message.GSCGameLangSettingNotSupportErrorCode",
  [Enums.GSCGameNotSupportFreeRoundErrorCode]: "error_message.GSCGameNotSupportFreeRoundErrorCode",
  [Enums.GSCWagerAlreadyExistsErrorCode]: "error_message.GSCWagerAlreadyExistsErrorCode",
  [Enums.GSCWagerAlreadySettledOrCancelErrorCode]: "error_message.GSCWagerAlreadySettledOrCancelErrorCode",
  [Enums.GSCWagerNotFoundErrorCode]: "error_message.GSCWagerNotFoundErrorCode",
  [Enums.GSCWagerHasBeenRollbackErrorCode]: "error_message.GSCWagerHasBeenRollbackErrorCode",
  [Enums.GSCFreeRoundNotFoundErrorCode]: "error_message.GSCFreeRoundNotFoundErrorCode",
  [Enums.GSCFreeRoundExceedLimitErrorCode]: "error_message.GSCFreeRoundExceedLimitErrorCode",
  [Enums.UnexpectedSystemErrorCode]: "error_message.UnexpectedSystemErrorCode"
}
