import { reactive } from "vue"
import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"

type ChatRoomState = {
  searchInputValue: string
  searchMemberInfo: Response.GetMemberSearch | null
  recentList: Response.GetChatroomCecent
  relationList: Response.GetChatroomRelation
  nicknameInputValue: string
  chatRoomInfo: Response.GetChatroomInfo | null
  chatRoomMessageList: Response.GetChatroomMessage
}

export const useChatRoomStore = defineStore("chatRoomStore", () => {
  const chatRoomState = reactive<ChatRoomState>({
    searchInputValue: "",
    searchMemberInfo: null,
    recentList: [],
    relationList: [],
    nicknameInputValue: "",
    chatRoomInfo: null,
    chatRoomMessageList: []
  })

  function setSearchMemberInfo(data: Response.GetMemberSearch | null) {
    if (!data) {
      chatRoomState.searchMemberInfo = data
      return
    }

    if (chatRoomState.searchMemberInfo) {
      chatRoomState.searchMemberInfo.account = data.account
      chatRoomState.searchMemberInfo.member_id = data.member_id
      return
    }

    chatRoomState.searchMemberInfo = {
      account: data.account,
      member_id: data.member_id
    }
  }

  function setRecentList(list: Response.GetChatroomCecent) {
    chatRoomState.recentList = list
  }

  function setRelationList(list: Response.GetChatroomRelation) {
    chatRoomState.relationList = list
  }

  function setChatRoomInfo(data: Response.GetChatroomInfo | null) {
    if (!data) {
      chatRoomState.chatRoomInfo = data
      return
    }

    chatRoomState.nicknameInputValue = data.member_relation.nickname

    if (chatRoomState.chatRoomInfo) {
      chatRoomState.chatRoomInfo.chat_room_id = data.chat_room_id
      chatRoomState.chatRoomInfo.member_relation.account = data.member_relation.account
      chatRoomState.chatRoomInfo.member_relation.member_id = data.member_relation.member_id
      chatRoomState.chatRoomInfo.member_relation.nickname = data.member_relation.nickname
      return
    }

    chatRoomState.chatRoomInfo = {
      chat_room_id: data.chat_room_id,
      member_relation: {
        account: data.member_relation.account,
        member_id: data.member_relation.member_id,
        nickname: data.member_relation.nickname
      }
    }
  }

  function setChatRoomId(id: string) {
    if (!id) return
    if (!chatRoomState.chatRoomInfo) return
    if (chatRoomState.chatRoomInfo.chat_room_id === id) return

    chatRoomState.chatRoomInfo.chat_room_id = id
  }

  function setChatRoomRelationNickname(nickname: string) {
    if (!chatRoomState.chatRoomInfo) return
    if (chatRoomState.chatRoomInfo.member_relation.nickname === nickname) return
    chatRoomState.chatRoomInfo.member_relation.nickname = nickname
  }

  function syncNicknameInputValue() {
    if (!chatRoomState.chatRoomInfo) return
    chatRoomState.nicknameInputValue = chatRoomState.chatRoomInfo.member_relation.nickname
  }

  function setChatRoomMessageList(list: Response.GetChatroomMessage) {
    chatRoomState.chatRoomMessageList = list
  }

  function clearChatRoomStore() {
    chatRoomState.searchInputValue = ""
    chatRoomState.searchMemberInfo = null
    chatRoomState.recentList = []
    chatRoomState.relationList = []
    chatRoomState.nicknameInputValue = ""
    chatRoomState.chatRoomInfo = null
    chatRoomState.chatRoomMessageList = []
  }

  return {
    chatRoomState,
    setSearchMemberInfo,
    setRecentList,
    setRelationList,
    setChatRoomInfo,
    setChatRoomMessageList,
    setChatRoomId,
    setChatRoomRelationNickname,
    syncNicknameInputValue,
    clearChatRoomStore
  }
})
