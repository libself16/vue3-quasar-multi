import { CMS_TYPE } from "src/common/utils/constants"
import { useCmsListQuery } from "./useCmsListQuery"

export function useHomeListCms() {
  // useCmsListQuery 讀取 HOME 類型的 CMS 列表
  const { data: tqvHomeCmsList } = useCmsListQuery({ type: CMS_TYPE.Enums.HOME })

  return {
    homeList: tqvHomeCmsList
  }
}
