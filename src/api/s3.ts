import { requestApi } from "src/common/utils/request"
import { ERROR_CODE_TYPE, S3_STORAGE_CATEGORY } from "src/common/utils/constants"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const getS3UploadUrl = async (params: Request.GetS3UploadUrl) => {
  return requestApi<Request.GetS3UploadUrl, Response.GetS3UploadUrl>(`/platform/v1/player/s3/upload-url`, params, {
    name: "getS3UploadUrl",
    method: "post"
  })
}

export const uploadFileToS3 = async (params: Request.UploadFileToS3 & { upload_url: string }) => {
  return requestApi<Request.UploadFileToS3, Response.UploadFileToS3>(
    params.upload_url,
    { file: params.file, storage_category: params.storage_category },
    {
      name: "uploadFileToS3",
      method: "put",
      headers: {
        "Content-Type": params.file.type
      },
      needToken: false,
      directCallAWS: true
    }
  )
}
