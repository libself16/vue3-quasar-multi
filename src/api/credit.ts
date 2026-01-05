import AdminRequest from "src/common/utils/adminRequest"

// keyword 為非必填條件
interface SystemSettingInfo {
  search_type?: string
  status?: string
  offset: number
  size: number
}

export const getCreditList = (params: SystemSettingInfo) => {
  const { search_type, status, offset, size } = params
  const filterParams: SystemSettingInfo = {
    offset,
    size
  }

  if (search_type !== "") filterParams.search_type = search_type
  if (status !== "") filterParams.status = status

  return AdminRequest({
    url: "/v1/credit-requisitions",
    method: "get",
    params: filterParams
  })
}
