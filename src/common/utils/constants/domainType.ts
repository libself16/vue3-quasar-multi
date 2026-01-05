export enum Enums {
  // 添加中
  ADDING = 0,

  // 使用中
  IN_USE,

  // 已到期
  EXPIRED
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.ADDING]: "collaboration.adding",
  [Enums.IN_USE]: "collaboration.in_use",
  [Enums.EXPIRED]: "collaboration.expired"
}
