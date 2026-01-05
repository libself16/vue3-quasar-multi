import { boot } from "quasar/wrappers"
import { cx } from "src/common/utils/cx.ts"

export default boot(({ app }) => {
  app.config.globalProperties.cx = cx
  console.log("[boot init] cx load successful")
})
