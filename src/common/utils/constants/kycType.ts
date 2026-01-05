export enum Enums {
    /** 身分證 */
    ID = 1,

    /** 駕照 */
    DRIVER_LICENSE = 2,

    /** 自拍照 */
    SELFIE = 3,

    /** 保險證 */
    INSURANCE = 4,

    /** 工資明細 */
    PAYSLIP = 5,
  }

  export const I18nKeys: Record<Enums, string> = {
    [Enums.ID]: "member.kyc.id",
    [Enums.DRIVER_LICENSE]: "member.kyc.driverLicense",
    [Enums.SELFIE]: "member.kyc.selfie",
    [Enums.INSURANCE]: "member.kyc.insurance",
    [Enums.PAYSLIP]: "member.kyc.payslip"
  }