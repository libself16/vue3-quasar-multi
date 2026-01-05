import { getSetting } from "src/api/setting"
import { useApi } from "src/common/hooks/useApi"
import { useEnvInfoStore } from "src/stores/envStore"
import { useLanguageStore } from "src/stores/languageStore"
import { liveChatConfigsStore } from "src/stores/liveChatConfigsStore"
import { tafficAnalysisStore } from "src/stores/TrafficAnalysisStore"
import { useUserInfoStore } from "src/stores/userInfoStore"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { loadLanguageAsync } from "src/boot/i18n"
/* backend key
  英語：en
  泰語：th
  越南：vi
  簡體中文：zh-cn
  繁體中文：zh-tw
  菲律宾: fil
  印尼：id
  印度：hi
  西班牙：sp
  巴西：br
  韓文：ko
  孟加拉文: bn
  馬來文: bm
 */

export function useLanguage() {
  const route = useRoute()
  const router = useRouter()
  const { locale, availableLocales } = useI18n()
  const langStore = useLanguageStore()
  const { updateEnvAgentSetting } = useEnvInfoStore()
  const { updateLiveChatConfigs } = liveChatConfigsStore()
  const { updateTrafficAnalysisConfigMap } = tafficAnalysisStore()
  const { setKycEnabled } = useUserInfoStore()

  const availableLanguages = computed(() => {
    return availableLocales.filter((item) => langStore.storedLanguageList.includes(item))
  }).value

  const langListWithLabel = computed(() =>
    availableLanguages.map((e) => {
      const langLabel: { [key: string]: string } = {
        en: "English",
        "zh-cn": "简体中文",
        "zh-tw": "繁體中文",
        jp: "日本語",
        th: "แบบไทย",
        vi: "Tiếng Việt",
        ko: "한국어",
        bn: "বাংলা",
        sp: "Español",
        br: "Português (Brasil)",
        id: "Bahasa Indonesia",
        bm: "Bahasa Melayu",
        ar: "العربية"
      }

      return {
        label: langLabel[e] || e,
        value: e
      }
    })
  )

  const nowLang = computed(() => locale.value)

  const apiLanguages = ref<string[]>([])

  const commonResult = (url: string) => new URL(`/src/common/assets/images/${url}`, import.meta.url).href
  const getFlagImg = (url: string) => commonResult(`flag/${url}.png`)
  const getSquareFlagImg = (url: string) => commonResult(`flagSquare/${url}.png`)

  function getLanguage() {
    return locale.value
  }

  async function setLanguage(lang: string) {
    const availableLangs = availableLocales.filter((item) => langStore.storedLanguageList.includes(item))
    if (!lang || !availableLangs.includes(lang)) return

    // 先載入語系檔案
    const loaded = await loadLanguageAsync(lang)
    if (!loaded) {
      console.warn(`Failed to load language: ${lang}`)
      return
    }

    if (locale.value !== lang) {
      locale.value = lang
      langStore.setStoreLang(lang)
    }
  }

  function checkLang(lang: string) {
    return (
      availableLocales.find((e) => e.toLowerCase().trim() === lang.toLowerCase().trim()) &&
      apiLanguages.value.find((e) => e.toLowerCase().trim() === lang.toLowerCase().trim())
    )
  }

  async function getAgentSetting() {
    const { status, data } = await useApi(getSetting)

    if (status) {
      langStore.setAgentLangSetting(data)
      updateEnvAgentSetting(data)
      updateLiveChatConfigs(data)
      updateTrafficAnalysisConfigMap(data)
      setKycEnabled(data)

      apiLanguages.value = (JSON.parse(data.language) as string[]) || []

      if (!apiLanguages.value || !apiLanguages.value.length) return

      // query
      const queryLang = route.query.lang as string
      if (queryLang && checkLang(queryLang)) {
        await setLanguage(queryLang)
        langStore.setStoreLang(queryLang)
        const query = { ...router.currentRoute.value.query }
        delete query.lang
        router.push({ query })
        return
      }

      // localStorage
      if (langStore.storedLang && checkLang(langStore.storedLang)) {
        await setLanguage(langStore.storedLang)
        return
      }

      // api default
      if (data.default_language && checkLang(data.default_language)) {
        await setLanguage(data.default_language)
        return
      }

      // languageList[0]
      if (apiLanguages.value.length && checkLang(apiLanguages.value[0])) {
        await setLanguage(apiLanguages.value[0])
      }
    }
  }

  function getCountryNameByCode(localeCode: string, displayLang = "en") {
    const displayNames = new Intl.DisplayNames([displayLang], { type: "language" })

    if (localeCode == "jp") localeCode = "ja"

    return displayNames.of(localeCode)
  }

  return {
    /** 可使用語系列表 */
    availableLanguages,

    /** 可使用語系列表含標籤 */
    langListWithLabel,

    /** 當前語系 */
    nowLang,

    /** 取得當前使用語系 */
    getLanguage,

    /** 設定語系 */
    setLanguage,

    /** 取得語系國旗圓形圖 */
    getFlagImg,

    /** 取得語系國旗方形圖 */
    getSquareFlagImg,

    /** 取得代理設定語系 */
    getAgentSetting,

    /** 使用語系代號取得國家名稱 (國家名稱按當前使用語系顯示),
     * ex: zh-tw => Chinese (Taiwan) */
    getCountryNameByCode
  }
}
