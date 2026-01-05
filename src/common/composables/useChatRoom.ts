import { ref, computed, nextTick, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useDebounceFn } from "@vueuse/core"
import heic2any from "heic2any"
import { storeToRefs } from "pinia"
import { useChatRoomStore } from "src/stores/chatRoomStore"
import { useEnv } from "src/common/hooks/useEnv"
import { useApi } from "src/common/hooks/useApi"
import {
  getChatroomMemberSearch,
  getChatroomRecent,
  getChatroomRelation,
  deleteChatroomRelation,
  getChatroomInfo,
  getChatroomMessage,
  putChatroomMemberNickname,
  postChatroomMessage,
  postChatroomImage
} from "src/api/chatroom"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { CHAT_MESSAGE_TYPE } from "src/common/utils/constants"

export function useChatRoom() {
  const route = useRoute()
  const router = useRouter()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const store = useChatRoomStore()
  const { chatRoomState } = storeToRefs(store)
  const {
    setSearchMemberInfo,
    setRelationList,
    setRecentList,
    setChatRoomInfo,
    setChatRoomMessageList,
    setChatRoomId,
    setChatRoomRelationNickname,
    syncNicknameInputValue,
    clearChatRoomStore
  } = store

  // 允許的開頭順序：A~Z 再來 0~9
  const otherGroup = "other"
  const validHeaders = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", ..."0123456789"]
  const sortedGroups = computed(() => {
    // 初始化分組
    const map = new Map<string, Response.GetChatroomRelation>()
    validHeaders.forEach((char) => map.set(char, []))
    map.set(otherGroup, []) // 其他字元的 fallback 區塊

    // 分組帳號
    chatRoomState.value.relationList.forEach((relationItem) => {
      const firstChar = relationItem.account.charAt(0).toUpperCase()

      if (map.has(firstChar)) {
        map.get(firstChar)!.push(relationItem)
      } else {
        map.get(otherGroup)!.push(relationItem)
      }
    })

    // 組合回陣列，只保留非空群組，並對每組帳號排序
    return [...map.entries()]
      .filter(([, list]) => list.length > 0)
      .map(([key, list]) => ({
        key,
        members: list.sort((a, b) => a.account.localeCompare(b.account))
      }))
  })

  const onInput = computed(() => chatRoomState.value.searchInputValue.trim() !== "")

  const mergedMessages = computed(() => {
    const result: {
      member_id: number
      isSender: boolean
      messages: Response.ChatroomMsgItem[]
    }[] = []

    for (const msg of chatRoomState.value.chatRoomMessageList) {
      const isSender = msg.member_id !== routeMemberId.value
      const messageEntry: Response.ChatroomMsgItem = {
        id: msg.id,
        chat_room_id: msg.chat_room_id,
        member_id: msg.member_id,
        target_id: msg.target_id,
        message: {
          type: msg.message.type,
          message: msg.message.message,
          path: msg.message.path
        },
        created_at: msg.created_at
      }

      if (msg.message.type === CHAT_MESSAGE_TYPE.Enums.image && msg.message.path) {
        messageEntry.message.path = `${VITE_APP_DYNAMIC_RESOURCE_URL}/${msg.message.path}?v=${msg.created_at}`
      }

      // 只合併「上一筆」的 member_id 相同時
      const lastGroup = result[result.length - 1]
      if (lastGroup && lastGroup.member_id === msg.member_id) {
        lastGroup.messages.push(messageEntry)
      } else {
        result.push({
          member_id: msg.member_id,
          isSender,
          messages: [messageEntry]
        })
      }
    }

    return result
  })

  const routeMemberId = computed(() => {
    if (route.name !== "memberChat") return 0

    const memberId = Number(route.params.memberId)

    if (isNaN(memberId)) return 0

    return memberId
  })

  const isLoading = ref(false)
  let recentTimer: NodeJS.Timeout
  let relationTimer: NodeJS.Timeout
  let chatroomInfoTimer: NodeJS.Timeout
  let chatroomMessageTimer: NodeJS.Timeout
  const chatContainer = ref<HTMLDivElement | null>(null)
  const isAtBottom = ref(true)
  const didInitScroll = ref(false)

  function handleGoChat(memberId: number) {
    router.push({ name: "memberChat", params: { memberId } })
  }

  //#region 處理滾動邏輯
  function handleChatContainerScroll() {
    const el = chatContainer.value
    if (!el) return
    const threshold = 20 // 允許一些誤差
    isAtBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < threshold
  }

  function scrollChatContainerToBottom() {
    const el = chatContainer.value

    if (!el) return

    el.scrollTop = el.scrollHeight
  }

  watch(
    () => chatRoomState.value.chatRoomMessageList.length,
    async (newLen) => {
      // 如果第一次進入畫面
      if (!didInitScroll.value && newLen > 0) {
        await nextTick()
        scrollChatContainerToBottom()
        didInitScroll.value = true
      } else if (isAtBottom.value) {
        await nextTick()
        scrollChatContainerToBottom()
      }
    },
    { immediate: true }
  )
  //#endregion

  //#region 查詢聊天室好友
  async function handleGetChatroomMemberSearch(account: string) {
    if (!account) {
      setSearchMemberInfo(null)
      return
    }

    isLoading.value = true
    const payload: Request.GetMemberSearch = {
      account
    }
    const { status, data } = await useApi(getChatroomMemberSearch, payload)
    isLoading.value = false

    if (status) {
      setSearchMemberInfo(data)
      return
    }
    setSearchMemberInfo(null)
  }

  const debounceGetChatroomMemberSearc = useDebounceFn(handleGetChatroomMemberSearch, 600)

  function handleSearchInputUpdate(value: string | number | null) {
    debounceGetChatroomMemberSearc(String(value ?? ""))
  }
  //#endregion

  //#region 聊天紀錄
  async function handleGetChatroomRecent() {
    isLoading.value = true
    const payload: Request.GetChatroomCecent = {
      size: "300"
    }
    const { status, data } = await useApi(getChatroomRecent, payload)
    isLoading.value = false

    if (status && data.length) {
      setRecentList(data)
      return
    }
    setRecentList([])
  }

  function startIntervalRecent(ms = 10000) {
    if (recentTimer) return

    recentTimer = setInterval(() => {
      handleGetChatroomRecent()
    }, ms)
  }

  function stopIntervalRecent() {
    if (recentTimer) clearInterval(recentTimer)
  }
  //#endregion

  //#region 聊天室
  async function handleGetChatroomRelation() {
    isLoading.value = true
    const { status, data } = await useApi(getChatroomRelation)
    isLoading.value = false
    if (status && data.length) {
      setRelationList(data)
      return
    }
    setRelationList([])
  }

  function startIntervalRelation(ms = 10000) {
    if (relationTimer) return

    relationTimer = setInterval(() => {
      handleGetChatroomRelation()
    }, ms)
  }

  function stopIntervalRelation() {
    if (relationTimer) clearInterval(relationTimer)
  }

  async function handleDeleteChatroomRelation(target_id: number): Promise<boolean> {
    if (!target_id) return false

    isLoading.value = true
    const payload: Request.DeleteChatroomRelation = {
      target_id
    }
    const { status } = await useApi(deleteChatroomRelation, payload)
    isLoading.value = false

    if (status) {
      await handleGetChatroomRelation()
    }

    return status
  }
  //#endregion

  //#region 一對一聊天
  async function handleGetChatroomInfo() {
    if (!routeMemberId.value) return

    isLoading.value = true
    const payload: Request.GetChatroomInfo = {
      target_id: routeMemberId.value
    }
    const { status, data } = await useApi(getChatroomInfo, payload)
    isLoading.value = false

    if (status) {
      setChatRoomInfo(data)

      if (data.chat_room_id !== "0") {
        stopIntervalChatroomInfo()

        await handleGetChatroomMessage()
        startIntervalChatroomMessage()
        return
      }

      startIntervalChatroomInfo()
      return
    }
    setChatRoomInfo(null)
  }

  function startIntervalChatroomInfo(ms = 10000) {
    if (chatroomInfoTimer) return

    chatroomInfoTimer = setInterval(() => {
      handleGetChatroomInfo()
    }, ms)
  }

  function stopIntervalChatroomInfo() {
    if (chatroomInfoTimer) clearInterval(chatroomInfoTimer)
  }

  async function handleGetChatroomMessage() {
    const chat_room_id = chatRoomState.value.chatRoomInfo?.chat_room_id
    if (chat_room_id === "0") return

    const payload: Request.GetChatroomMessage = {
      chat_room_id: `${chat_room_id}`,
      size: "100"
    }

    const { status, data } = await useApi(getChatroomMessage, payload)

    if (status) {
      if (
        chatRoomState.value.chatRoomMessageList[chatRoomState.value.chatRoomMessageList.length - 1]?.id !==
        data[data.length - 1]?.id
      ) {
        setChatRoomMessageList(data)
      }
      return
    }

    setChatRoomMessageList([])
  }

  function startIntervalChatroomMessage(ms = 3000) {
    if (chatroomMessageTimer) return

    chatroomMessageTimer = setInterval(() => {
      handleGetChatroomMessage()
    }, ms)
  }

  function stopIntervalChatroomMessage() {
    if (chatroomMessageTimer) clearInterval(chatroomMessageTimer)
  }

  async function handlePutChatroomMemberNickname(): Promise<{
    status: boolean
    code?: number
  }> {
    if (!routeMemberId.value) return { status: false }

    const nickname = chatRoomState.value.nicknameInputValue
    if (nickname === chatRoomState.value.chatRoomInfo?.member_relation.nickname) return { status: true }

    isLoading.value = true
    const payload: Request.PutChatroomMemberNickname = {
      target_id: routeMemberId.value,
      nickname: chatRoomState.value.nicknameInputValue
    }
    const { status, code } = await useApi(putChatroomMemberNickname, payload)
    isLoading.value = false

    if (status) {
      setChatRoomRelationNickname(nickname)
    }

    return { status, code }
  }

  async function handlePostChatroomMessage(message: string): Promise<{
    status: boolean
    data?: Response.PostChatroomMessage
  }> {
    if (!message || !routeMemberId.value) return { status: false }

    isLoading.value = true
    const payload: Request.PostChatroomMessage = {
      target_id: routeMemberId.value,
      message
    }
    const { status, data } = await useApi(postChatroomMessage, payload)
    isLoading.value = false

    if (status) {
      if (chatRoomState.value.chatRoomInfo && chatRoomState.value.chatRoomInfo.chat_room_id === "0") {
        setChatRoomId(data.chat_room_id)
      }
      handleGetChatroomMessage()
    }

    return { status, data }
  }

  async function handlePostChatroomImage(imgFiles: File[]): Promise<{
    status: boolean
    data?: Response.PostChatroomMessage[]
  }> {
    if (!imgFiles || !routeMemberId.value) return { status: false }

    isLoading.value = true
    let images = imgFiles

    // 檢查是否包含 .heic
    if (images.some((file) => file.name.toLocaleLowerCase().endsWith(".heic"))) {
      // 將所有檔案轉換成 Promise

      const conversionPromises = images.map(async (image) => {
        if (image.name.toLocaleLowerCase().endsWith(".heic")) {
          const converted = await heic2any({
            blob: image,
            toType: "image/jpeg",
            quality: 0.9
          })

          // heic2any 可能回傳 Blob[] 或 Blob
          const blob = Array.isArray(converted) ? converted[0] : converted

          // 轉成 File 以便保留檔名與使用上相容
          return new File([blob], image.name.replace(/\.heic$/i, ".jpg"), {
            type: "image/jpeg"
          })
        } else {
          return image // 非 heic 就保留原檔
        }
      })

      // 等待所有轉換完成
      images = await Promise.all(conversionPromises)
    }

    const payload: Request.PostChatroomImage = {
      target_id: routeMemberId.value,
      images
    }

    const { status, data } = await useApi(postChatroomImage, payload)
    isLoading.value = false

    if (status) {
      if (
        chatRoomState.value.chatRoomInfo &&
        chatRoomState.value.chatRoomInfo.chat_room_id === "0" &&
        data.length &&
        data[0].chat_room_id
      ) {
        setChatRoomId(data[0].chat_room_id)
      }
      handleGetChatroomMessage()
    }

    return { status, data }
  }
  //#endregion

  return {
    isLoading,

    /** 聊天畫面容器 */
    chatContainer,

    /** chat room store state */
    chatRoomState,

    /** 聊天室排序其他類別常數 */
    otherGroup,

    /** 聊天室字母排序 */
    sortedGroups,

    /** 查詢會員中 */
    onInput,

    /** 合併聊天內容 */
    mergedMessages,

    /** 清空 chat room store state */
    clearChatRoomStore,

    /** 跳轉至聊天畫面 */
    handleGoChat,

    /** 監聽聊天畫面容器滑動 */
    handleChatContainerScroll,

    /** 防抖查詢會員api */
    handleSearchInputUpdate,

    /** 查詢聊天紀錄清單 */
    handleGetChatroomRecent,

    /** 輪詢聊天紀錄清單 */
    startIntervalRecent,

    /** 停止輪詢聊天紀錄清單 */
    stopIntervalRecent,

    /** 查詢聊天室清單 */
    handleGetChatroomRelation,

    /** 輪詢聊天室清單 */
    startIntervalRelation,

    /** 停止輪詢聊天室清單 */
    stopIntervalRelation,

    /** 刪除聊天室會員清單 */
    handleDeleteChatroomRelation,

    /** 取得聊天畫面資訊 */
    handleGetChatroomInfo,

    /** 輪詢聊天畫面資訊 */
    startIntervalChatroomInfo,

    /** 停止輪詢聊天畫面資訊 */
    stopIntervalChatroomInfo,

    /** 取得一對一聊天內容 */
    handleGetChatroomMessage,

    /** 輪詢一對一聊天內容 */
    startIntervalChatroomMessage,

    /** 停止輪詢一對一聊天內容 */
    stopIntervalChatroomMessage,

    /** 修改暱稱 */
    handlePutChatroomMemberNickname,

    /** 同步 store cNickname Input Value  */
    syncNicknameInputValue,

    /** 發送訊息 */
    handlePostChatroomMessage,

    /** 發送圖片 */
    handlePostChatroomImage
  }
}
