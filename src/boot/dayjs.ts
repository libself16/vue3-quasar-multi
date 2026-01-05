import { boot } from "quasar/wrappers"
import * as dayjsUtils from "src/common/utils/dayjsUtils.ts"

export default boot(({ app }) => {
  app.config.globalProperties.$dayjsUtils = dayjsUtils
})
