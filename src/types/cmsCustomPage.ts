import type { CmsLangTitle } from "src/api/response.type"

export interface CmsTextPageItem {
  lang: string
  title: string
  content: string
}

export interface CmsTextPayload {
  page: CmsTextPageItem[]
}

export interface CmsGamePayload {
  alt_tag?: string
  game_code: string
  game_type: number
  product_code: number
  product_integration_id: number
}

export interface CmsGameTypePayload {
  game_type: number
  cms_product_category_id: number
}

export interface CmsLinkPayload {
  link: string
  opening_method: number
}

export type CmsNestedEntrancePayload = CmsGamePayload | CmsGameTypePayload | CmsLinkPayload

export interface CmsSliderNestedEntrance {
  img: string
  lang: CmsLangTitle
  sort: number
  type: number
  payload: CmsNestedEntrancePayload
  img_path: string
  img_base64?: string
  is_editable: boolean
  updated_time?: number
}

export interface CmsSliderProcessedItem {
  img: string
  lang: CmsLangTitle
  sort: number
  type: number
  payload: CmsNestedEntrancePayload
  img_path: string
  img_base64?: string
  is_editable: boolean
  updated_time?: number
  alt_tag: string
}

export interface CmsSliderPayload {
  nested_entrance: CmsSliderNestedEntrance[]
}

// CustomImage 相關型別定義
export interface CmsImageNestedEntrance {
  img: string
  lang: CmsLangTitle
  sort: number
  type: number
  payload: CmsNestedEntrancePayload
  img_path: string
  img_base64?: string
  is_editable: boolean
  updated_time?: number
}

export interface CmsImageProcessedItem {
  img: string
  lang: CmsLangTitle
  sort: number
  type: number
  payload: CmsNestedEntrancePayload
  img_path: string
  img_base64?: string
  is_editable: boolean
  updated_time?: number
  alt_tag: string
  title: string
}

export interface CmsImagePayload {
  row_show?: number
  nested_entrance: CmsImageNestedEntrance[]
}

// CustomGameEntrance 相關型別定義
export interface CmsGameEntrancePayload {
  title?: string
  row_num?: number
  row_show?: number
  game_type_id?: number
  product_code?: number
  product_integration_id?: number
  game_type_entrance_type: number // 判斷為單一入口(供應商入口)還是遊戲入口
}

export type CmsCustomPayload =
  | CmsTextPayload
  | CmsSliderPayload
  | CmsImagePayload
  | CmsGameEntrancePayload
  | Record<string, any>
