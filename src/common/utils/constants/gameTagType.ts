export enum Enums {
  // 全部
  All = 0,

  // 最新
  New = 1,

  // 熱門
  Hot = 2,

  // 收藏
  Favorites = 3
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.All]: "common.btn.all",
  [Enums.Favorites]: "common.btn.favorites",
  [Enums.New]: "common.btn.new",
  [Enums.Hot]: "common.btn.hot"
}

export const BtnIcons: Record<Enums, string> = {
  [Enums.All]: "fa-solid fa-clover",
  [Enums.Favorites]: "fa-solid fa-thumbs-up",
  [Enums.New]: "fa-solid fa-n",
  [Enums.Hot]: "fa-solid fa-fire"
}

export const BtnIcoSName: Record<Enums, string> = {
  [Enums.All]: "all",
  [Enums.Favorites]: "favorites",
  [Enums.New]: "hot",
  [Enums.Hot]: "new"
}
