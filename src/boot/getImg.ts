import { boot } from "quasar/wrappers"

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  // something to do
  const getImg = (url: string): string => {
    const result = new URL(`/src/common/assets/images/${url}`, import.meta.url).href
    return result
  }
  app.config.globalProperties.$getImg = getImg
})
