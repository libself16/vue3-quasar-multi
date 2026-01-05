import { getS3UploadUrl, uploadFileToS3 } from "src/api/s3"
import { useApi } from "src/common/hooks/useApi"
import { ERROR_CODE_TYPE, S3_STORAGE_CATEGORY } from "src/common/utils/constants"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"

/**
 * *useS3Upload Hook*
 *
 * 提供單檔案、多檔案直接上傳至 AWS S3 的功能
 * 1. 先透過後端生成預簽名 upload url。
 * 2. 透過 upload url 直接將檔案上傳至 S3。
 *
 * 注意：
 * - file: 必填/欲上傳的 File
 * - storage_category: 必填/後端提供的分類
 */
export function useS3Upload() {
  /**
   * 單檔案上傳
   * @param params
   *   - file: File 檔案 (必填)
   *   - storage_category: S3 上的分類 (必填)
   *   - expiration: upload url 過期時間 (秒/選填/預設:600)
   *
   * 使用範例：
   * const { status, data, msg } = await uploadSingleFile({
   *   file: fileInput.files[0],
   *   storage_category: S3_STORAGE_CATEGORY.Enums.site_verification
   * });
   */
  async function uploadSingleFile(params: Request.UploadFileToS3) {
    const { file, storage_category, expiration = 600 } = params

    // storage_category 必填
    if (!storage_category) {
      console.warn("storage_category is required")
      return Promise.resolve({
        status: false,
        data: null,
        msg: "storage_category is required"
      })
    }

    // file 必填
    if (!file) {
      console.warn("file is required")
      return Promise.resolve({
        status: false,
        data: null,
        msg: "file is required"
      })
    }

    try {
      // 先從後端取得 S3 upload url
      const { status, data, msg } = await useApi(getS3UploadUrl, {
        storage_category,
        file_name: file.name.replace(/\.[^/.]+$/, ""),
        extension: file.name.split(".").pop(),
        content_type: file.type,
        expiration
      })

      if (!status || !data) {
        return Promise.resolve({
          status,
          data,
          msg: "Get upload URL failed"
        })
      }

      // 透過 upload url 上傳到 S3
      const {
        status: uploadStatus,
        code: uploadCode,
        msg: uploadMsg
      } = await useApi(uploadFileToS3, { upload_url: data.upload_url, file, storage_category })

      return Promise.resolve({
        status: uploadStatus,
        data: { file, objectKey: data.object_key, expiresAt: data.expires_at },
        msg: uploadStatus
          ? "Upload to S3 successful"
          : uploadMsg || msg || `Upload to S3 failed ${uploadCode ? `(${uploadCode})` : ""}`
      })
    } catch (err: any) {
      return Promise.resolve({ status: false, data: null, msg: err.message || "Upload failed" })
    }
  }

  /**
   * 多檔案上傳
   * @param files Array<Request.UploadFileToS3>
   *   每個元素必須包含：
   *     - file: File 物件
   *     - storage_category: S3 存儲分類
   *
   * 使用範例：
   * const { status, data, msg } = await uploadMultipleFiles(
   *   Array.from(fileInput.files).map(file => ({
   *     file,
   *     storage_category: S3_STORAGE_CATEGORY.Enums.avatar
   *   }))
   * );
   */
  async function uploadMultipleFiles(files: Request.UploadFileToS3[]) {
    // 防呆檢查每個檔案
    const invalidFiles = files.filter((f) => !f.file || !f.storage_category)
    if (invalidFiles.length > 0) {
      return invalidFiles.map((f) => ({
        status: false,
        data: null,
        msg: !f.storage_category ? "storage_category is required" : !f.file ? "file is required" : "Invalid file"
      }))
    }

    return await Promise.all(files.map((f) => uploadSingleFile(f)))
  }

  return {
    S3_STORAGE_CATEGORY,
    uploadSingleFile,
    uploadMultipleFiles
  }
}
