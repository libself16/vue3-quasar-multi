import dayjs from "dayjs"
import { ref, computed } from "vue"
import { useQuasar } from "quasar"
import { getSetting } from "src/api/setting"
import { useApi } from "src/common/hooks/useApi"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useUserInfoStore } from "src/stores/userInfoStore"
import { useEnvInfoStore } from "src/stores/envStore"
import { KYC_STATUS_CODE, KYC_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"
import { use } from "echarts"

export function useKyc() {
  const $q = useQuasar()

  const { getUserKyc, setUserKycV2 } = useUserInfo()
  const { setStoreUserKyc, userKyc, setKycEnabled } = useUserInfoStore()
  const { updateEnvAgentSetting } = useEnvInfoStore()

  const isLoading = ref<boolean>(true)
  const kycSetting = ref<Response.kycSetting[]>([])

  // KYC 拖曳事件 event
  const dragCounter = ref(0)
  const dragEnter = ref<number | null>(null)

  // 視窗 dragging 為外部事件需從props傳入
  const dragging = ref(false)

  const resultImages = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  const placeholderImg = resultImages("kyc/placeholder.png")
  const pendingImg = resultImages("kyc/pending.png")
  const successImg = resultImages("kyc/verified.png")
  const failedImg = resultImages("kyc/reject.png")

  const fileConfig = {
    format: ["image/png", "image/jpeg", "image/jpg"],
    maxSizeInMB: 10,
    previewRatio: 268 / 164
  }

  async function getKycSetting() {
    isLoading.value = true
    const { status, data } = await useApi(getSetting)

    if (status) {
      if ("kyc_setting" in data) {
        kycSetting.value = JSON.parse(data.kyc_setting)
        matcheKycItemToSetting()
      }
      setKycEnabled(data)
      updateEnvAgentSetting(data)
    }

    isLoading.value = false
  }

  // 驗證檔案類型
  const isValidImageType = (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"]
    return validTypes.includes(file.type)
  }

  const isValidFileSize = (file: File) => {
    return file.size / (1024 * 1024) < fileConfig.maxSizeInMB
  }

  const setKycItemValue = (
    settingID: number,
    img: string,
    status: KYC_STATUS_CODE.Enums,
    kycType: KYC_TYPE.Enums,
    fileName = ""
  ) => {
    const _kycItem = userKyc.value.find((i) => i.correspondence === settingID)

    if (status == KYC_STATUS_CODE.Enums.NONE) {
      if (_kycItem) {
        userKyc.value.splice(userKyc.value.indexOf(_kycItem), 1)
        setStoreUserKyc(userKyc.value)
      }
      return
    }

    if (_kycItem) {
      _kycItem.img = img
      _kycItem.status = status
    } else {
      userKyc.value.push({
        id: settingID,
        img: img,
        status: status,
        type: kycType,
        correspondence: settingID,
        updated_time: 0,
        updated_at: 0,
        fileName: fileName
      })
      setStoreUserKyc(userKyc.value)
    }
  }

  const setUploadImage = (itemId: number, file: any, kycType: KYC_TYPE.Enums) => {
    if (!isValidImageType(file)) {
      $q.notify({
        type: "negative",
        message: `Invalid file type, only accept ${fileConfig.format.join(",")}`
      })
      return
    }

    if (!isValidFileSize(file)) {
      $q.notify({
        type: "negative",
        message: `Invalid file size, max ${fileConfig.maxSizeInMB}MB`
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e: any) => {
      setKycItemValue(itemId, e.target.result, KYC_STATUS_CODE.Enums.PREUPLOAD, kycType, file.name)
    }
    reader.readAsDataURL(file)
  }

  const onDeleteImage = (settingID: number, kycType: KYC_TYPE.Enums) => {
    setKycItemValue(settingID, "", KYC_STATUS_CODE.Enums.NONE, kycType)
  }

  // Dropzone 事件
  const onDragEnter = (settingID: number) => {
    dragEnter.value = settingID
  }
  const onDragLeave = () => {
    dragEnter.value = null
  }
  const onDrop = (itemId: number, e: any, kycType: KYC_TYPE.Enums) => {
    dragEnter.value = null
    const files = e.dataTransfer.files

    if (files.length > 0 && files[0].type.startsWith("image/")) {
      setUploadImage(itemId, files[0], kycType)
    }
  }

  // File 上傳事件
  const triggerFileSelect = ($event: any) => {
    $event.target.closest(".kyc-placeholder").querySelector("input").click()
  }

  const onFileChange = (itemId: number, $event: any, kycType: KYC_TYPE.Enums) => {
    const files = $event.target.files
    if (files.length > 0) {
      setUploadImage(itemId, files[0], kycType)

      // input 的值重置，避免相同文件第二次無法觸發
      $event.target.value = ""
    }
  }

  // window 視窗拖曳事件
  const handleWindowDragEnter = () => {
    dragCounter.value += 1
    dragging.value = true
  }

  const handleWindowDragLeave = () => {
    dragCounter.value -= 1
    if (dragCounter.value === 0) {
      dragging.value = false
    }
  }

  const handleWindowDragDrop = () => {
    dragCounter.value = 0
    dragging.value = false
  }

  const isUploadedStatus = (status: KYC_STATUS_CODE.Enums) => {
    switch (status) {
      case KYC_STATUS_CODE.Enums.REVIEWING:
      case KYC_STATUS_CODE.Enums.VERIFIED:
      case KYC_STATUS_CODE.Enums.REJECTED:
      case KYC_STATUS_CODE.Enums.UNSUBMITTED:
        return true
    }
  }

  const uploadStatusToString = (status: KYC_STATUS_CODE.Enums) => {
    switch (status) {
      case KYC_STATUS_CODE.Enums.PREUPLOAD:
        return "preupload"
      case KYC_STATUS_CODE.Enums.NONE:
        return "none"
      case KYC_STATUS_CODE.Enums.REVIEWING:
        return "pending"
      case KYC_STATUS_CODE.Enums.VERIFIED:
        return "success"
      case KYC_STATUS_CODE.Enums.REJECTED:
      case KYC_STATUS_CODE.Enums.UNSUBMITTED:
        return "failed"
    }
  }

  const getFilename = (url: string) => {
    if (url.startsWith("data:image/")) {
      return ""
    }

    try {
      let filename = url.split(".")
      const ext = filename[1]
      filename = filename[0].split("/")

      return `${filename[3]}.${ext}`
    } catch (error) {
      return ""
    }
  }

  const getFilename2 = (kycItem: Response.UserKycItem) => {
    if (kycItem.fileName) return kycItem.fileName
    if (kycItem.img.startsWith("data:image/")) {
      return ""
    }

    try {
      let filename = kycItem.img.split(".")
      const ext = filename[1]
      filename = filename[0].split("/")

      return `${filename[3]}.${ext}`
    } catch (error) {
      return ""
    }
  }

  const getUploadDate = (unixtime: number | null) => {
    if (!unixtime) unixtime = dayjs().unix()
    return dayjs.unix(unixtime).format("YYYY/MM/DD")
  }

  const getKycItem = async () => {
    await getUserKyc()
  }

  const matcheKycItemToSetting = () => {
    kycSetting.value.forEach((setting) => {
      const matchedItem = userKyc.value.find((item) => {
        return item.correspondence == setting.id
      })

      if (matchedItem) {
        setting.kycItemId = matchedItem.id
      }
    })
  }

  const handleSubmit = async () => {
    const canSubmit = showSubmit()
    if (!canSubmit) return

    // 比對已上傳的kyc資料
    // 如果沒有配對到setting則不需要上傳，避免上傳失敗
    let isUpdate = true

    const preUploadKycItem: {
      id: number
      kycItemId?: number
      img: string
      type: KYC_TYPE.Enums
      status: KYC_STATUS_CODE.Enums
      correspondence: number
      updated_at: number
    }[] = []

    userKyc.value.forEach((item) => {
      const matchedSetting = kycSetting.value.find((setting) => {
        return setting.id === item.correspondence
      })

      if (matchedSetting && !item.img.includes("upload")) {
        preUploadKycItem.push({ ...item, kycItemId: matchedSetting.kycItemId })
      }
    })

    const preUploadData = preUploadKycItem.map((i) => {
      return {
        id: i.kycItemId,
        img: i.img,
        type: i.type,
        correspondence: i.correspondence
      }
    })

    const updateItemCount = preUploadData.filter((i) => {
      return i.id
    })
    if (updateItemCount.length === 0) isUpdate = false

    const sendData = {
      imgs: preUploadKycItem.map((i) => {
        return {
          id: i.kycItemId,
          img: i.img,
          type: i.type,
          correspondence: i.correspondence
        }
      })
    }

    const { status } = await setUserKycV2(sendData, isUpdate)

    await getKycItem()
    await getKycSetting()

    return status
  }

  const showSubmit = () => {
    let show = false

    userKyc.value.forEach((item) => {
      if (item.status === KYC_STATUS_CODE.Enums.NONE || item.status === KYC_STATUS_CODE.Enums.PREUPLOAD) {
        show = true
      }
    })

    return show
  }

  return {
    isLoading,
    handleSubmit,
    showSubmit,
    getKycItem,
    getKycSetting,
    kycSetting,
    dragEnter,
    dragging,
    fileConfig,
    isValidImageType,
    isValidFileSize,
    isUploadedStatus,
    uploadStatusToString,
    getFilename,
    getFilename2,
    getUploadDate,
    placeholderImg,
    pendingImg,
    successImg,
    failedImg,
    triggerFileSelect,
    onFileChange,
    onDeleteImage,
    onDragEnter,
    onDragLeave,
    onDrop,
    handleWindowDragEnter,
    handleWindowDragLeave,
    handleWindowDragDrop
  }
}
