import { boot } from "quasar/wrappers"
import { directivesTypes } from "./types"

export default boot(({ app }) => {
  // 註冊指令
  directivesTypes.forEach((element) => {
    app.directive(element.name, element.directive)
  })
})
