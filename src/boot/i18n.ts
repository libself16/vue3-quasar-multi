import { boot } from "quasar/wrappers"
import { createI18n, Composer } from "vue-i18n"
import type { I18n } from "vue-i18n"

// 擴展 globalThis 型別
declare global {
  // eslint-disable-next-line no-var
  var $t: Composer["t"]
  // eslint-disable-next-line no-var
  var $te: Composer["te"]
  // eslint-disable-next-line no-var
  var $d: Composer["d"]
  // eslint-disable-next-line no-var
  var $n: Composer["n"]
  // eslint-disable-next-line no-var
  var $i18n: I18n
}

// 只導入預設語系(英文)
import en from "src/i18n/locales/en"

// 定義語系載入器
const languageLoaders: Record<string, () => Promise<any>> = {
  en: () => import("src/i18n/locales/en"),
  bn: () => import("src/i18n/locales/Bengali"),
  "zh-cn": () => import("src/i18n/locales/zh-cn"),
  "zh-tw": () => import("src/i18n/locales/zh-tw"),
  jp: () => import("src/i18n/locales/jp"),
  th: () => import("src/i18n/locales/th"),
  vi: () => import("src/i18n/locales/vi"),
  ko: () => import("src/i18n/locales/ko"),
  sp: () => import("src/i18n/locales/Spanish"),
  br: () => import("src/i18n/locales/Brazil"),
  id: () => import("src/i18n/locales/id-in"),
  bm: () => import("src/i18n/locales/Bahasa Melayu"),
  ar: () => import("src/i18n/locales/Arabic")
}

// 已載入的語系追蹤
const loadedLanguages = new Set<string>(["en"])

// 初始只包含預設語系,其他語系為空物件以確保 availableLocales 包含所有語系
const messages: any = {
  en,
  bn: {},
  "zh-cn": {},
  "zh-tw": {},
  jp: {},
  th: {},
  vi: {},
  ko: {},
  sp: {},
  br: {},
  id: {},
  bm: {},
  ar: {}
}

export type MessageLanguages = keyof typeof messages
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = (typeof messages)["en"]

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module "vue-i18n" {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

// 動態載入語系的函數
export async function loadLanguageAsync(locale: string): Promise<boolean> {
  // 如果語系已經載入,直接返回
  if (loadedLanguages.has(locale)) {
    return true
  }

  // 如果語系載入器存在
  if (languageLoaders[locale]) {
    try {
      const messages = await languageLoaders[locale]()
      globalThis.$i18n.global.setLocaleMessage(locale, messages.default)
      loadedLanguages.add(locale)
      return true
    } catch (error) {
      console.error(`Failed to load language: ${locale}`, error)
      return false
    }
  }

  return false
}

export let i18n: I18n<any, any, any, any, false>

export default boot(({ app }) => {
  const i18nInstance = createI18n({
    locale: "en",
    legacy: false,
    messages,
    sync: true,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
    globalInjection: true,
    fallbackLocale: "en" // fallback to 'en' if locale isn't found in the list
  })

  i18n = i18nInstance

  app.use(i18n)

  // 掛載全局 i18n functions 和 i18n 實例
  globalThis.$t = (i18n.global as Composer).t
  globalThis.$te = (i18n.global as Composer).te
  globalThis.$d = (i18n.global as Composer).d
  globalThis.$n = (i18n.global as Composer).n
  globalThis.$i18n = i18n
})
