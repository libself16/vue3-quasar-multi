export enum Enums {
  Unknow = 0,

  /** 錯誤代碼 M133 - 收款人的帳戶設定不允許從此合作夥伴接收款項。 */
  RECIPIENT_ACCOUNT_RESTRICTED = "M133",

  /** 錯誤代碼 1096 - 不允許轉帳至相同帳戶。 */
  TRANSFER_TO_SAME_ACCOUNT_NOT_ALLOWED = "1096",

  /** 錯誤代碼 1301 - Client-Id 標頭無效。 */
  INVALID_CLIENT_ID_HEADER = "1301",

  INVALID_PRODUCT_TYPE = "1630",

  /** 錯誤代碼 1646 收款人類型不允許從該合作夥伴接收資金。 */
  RECIPIENT_TYPE_NOT_ALLOWED = "1646",

  /** 錯誤代碼 2841 - 收款人值無效。 */
  INVALID_RECIPIENT_VALUE = "2841",

  /** 錯誤代碼 2856 - 收款人不是已認可的 PayMaya 帳戶。 */
  RECIPIENT_NOT_VERIFIED_PAYMAYA_ACCOUNT = "2856",

  /** 錯誤代碼 2896 - 內部服務逾時。 */
  INTERNAL_SERVICE_TIMEOUT = "2896",

  /** 錯誤代碼 6005 - 內部賬本錯誤。 */
  INTERNAL_LEDGER_ERROR = "6005",

  /** 錯誤代碼 6014 - 帳戶詳細資料無效。 */
  INVALID_ACCOUNT_DETAILS = "6014",

  /** 錯誤代碼 6041 - 收件者的主帳戶標記為遺失。 */
  RECIPIENT_PRIMARY_ACCOUNT_MARKED_AS_LOST = "6041",

  /** 錯誤代碼 6043 - 收件者的主帳戶標記為"卡片被盜"。 */
  RECIPIENT_PRIMARY_ACCOUNT_MARKED_AS_CARD_STOLEN = "6043",

  /** 錯誤代碼 6051 - 您的資金不足以提供給客戶。 */
  INSUFFICIENT_FUNDS_TO_PROVIDE_TO_CUSTOMER = "6051",

  /** 錯誤代碼 6054 - 收件者的主帳戶已過期。 */
  RECIPIENT_PRIMARY_ACCOUNT_EXPIRED = "6054",

  /** 錯誤代碼 6058 - 接收者的個人資料不允許與我們帳本中的該合作夥伴進行交易。 */
  RECEIVER_PERSONAL_INFO_NOT_ALLOWED_FOR_TRANSACTION_WITH_PARTNER = "6058",

  /** 錯誤代碼 6061 - 收件人已達儲值限額（金額）。 */
  RECIPIENT_REACHED_TOP_UP_LIMIT = "6061",

  /** 錯誤代碼 6065 - 收件者已達到儲值限額（計數）。 */
  RECIPIENT_REACHED_TOP_UP_LIMIT_COUNT = "6065",

  /** 錯誤代碼 6072 - 合作夥伴的帳戶已達上限。 */
  PARTNER_ACCOUNT_REACHED_LIMIT = "6072",

  /** 錯誤代碼 6076 - 收件者的主帳戶無效。 */
  RECIPIENT_PRIMARY_ACCOUNT_INVALID = "6076",

  /** 錯誤代碼 6091 - 內部分類帳錯誤。 */
  INTERNAL_LEDGER_CATEGORY_ERROR = "6091",

  /** 錯誤代碼 6096 - 內部分類帳錯誤。 */
  INTERNAL_LEDGER_CATEGORY_ERROR2 = "6096",

  /** 錯誤代碼 6097 - 內部分類帳錯誤。 */
  INTERNAL_LEDGER_CATEGORY_ERROR3 = "6097",

  /** 錯誤代碼 6098 - 內部分類帳錯誤。 */
  INTERNAL_LEDGER_CATEGORY_ERROR4 = "6098",

  /** 錯誤代碼 7011 - 遇到臨時故障 */
  TEMPORARY_FAILURE = "7011",

  /** 錯誤代碼 7012 - 交易仍在處理中或遇到連接失敗。 */
  TRANSACTION_PENDING_OR_CONNECTION_FAILED = "7012",

  /** M001 - 未為合作夥伴定義母帳戶。 */
  MOTHER_ACCOUNT_NOT_DEFINED_FOR_PARTNER = "M001",

  /** M003 - 無效的母帳戶產品類型。 */
  INVALID_MOTHER_ACCOUNT_PRODUCT_TYPE = "M003",

  /** M036 - Add Money 代碼無效。 */
  INVALID_ADD_MONEY_CODE = "M036",

  /** M055 - 金額不匹配 */
  AMOUNT_VALUE_MISMATCH1 = "M055",

  /** M056 - 金額數值不匹配 */
  AMOUNT_VALUE_MISMATCH2 = "M056",

  /** M057 - 金額貨幣不匹配 */
  AMOUNT_VALUE_MISMATCH3 = "M057",

  /** M122 - 收款人處於非活躍狀態，無法接收資金。 */
  RECIPIENT_INACTIVE_CANNOT_RECEIVE_FUNDS = "M122",

  /** 錯誤代碼 M132 收款方的資金已關閉，無法接收資金。 */
  RECIPIENT_FUNDS_CLOSED_CANNOT_RECEIVE = "M132"
}
