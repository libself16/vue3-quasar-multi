import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"

export const useLanguageStore = defineStore("languageStore", {
  state: () => {
    return {
      lang: "",
      defaultLang: "",
      languageList: [] as string[]
    }
  },
  actions: {
    setStoreLang(lang: string) {
      this.lang = lang
    },
    setAgentLangSetting(data: Response.ISetting) {
      if (data.default_language) {
        this.defaultLang = data.default_language
      }

      const languageList = JSON.parse(data.language)
      if (languageList && languageList.length) {
        this.languageList = languageList
      }
    }
  },
  getters: {
    storedLang: (state) => state.lang,
    storedDefaultLang: (state) => state.defaultLang,
    storedLanguageList: (state) => state.languageList
  },
  persist: true
})
