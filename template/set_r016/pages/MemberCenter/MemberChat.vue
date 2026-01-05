<template>
  <div class="chat-wrapper">
    <div class="chat-header">
      <div class="header-top">
        <q-btn flat class="btn-go-back" :to="{ name: 'memberChatRoom' }">
          <q-img :src="svgIcon('arrow-left')" loading="lazy" class="svg-back"></q-img>
        </q-btn>
        <div class="header-title">{{ $t("chatRoom.friend") }}</div>
        <div class="w-[1.875rem]"></div>
      </div>
      <div class="header-bottom">
        <div class="bottom-left">
          <q-img :src="svgIcon('avatar-big')" loading="lazy" class="svg-avatar-big"></q-img>
        </div>
        <div v-if="chatRoomState.chatRoomInfo" class="bottom-right">
          <div class="user-account">{{ chatRoomState.chatRoomInfo.member_relation.account }}</div>
          <q-separator />
          <q-input
            ref="nicknameRef"
            standout
            v-model="chatRoomState.nicknameInputValue"
            :placeholder="$t('chatRoom.change_nickname')"
            rounded
            outlined
            dense
            borderless
            class="form-input form-nickname"
            no-error-icon
            hide-bottom-space
            :readonly="!isEdit"
            :maxlength="15"
          >
            <template #append>
              <q-btn v-show="isEdit" class="btn-save" @click="handleEditNickname" :disable="isLoading">{{
                $t("common.btn.save")
              }}</q-btn>
              <q-img
                v-show="!isEdit && chatRoomState.chatRoomInfo.chat_room_id !== '0'"
                :src="svgIcon('edit')"
                loading="lazy"
                class="svg-edit"
                @click="handleOpenEditNickname"
              ></q-img>
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <div class="chat-body">
      <ChatTemplate1 />
    </div>

    <q-form class="chat-footer" @submit="handleSendMessage">
      <q-file
        ref="imgFileRef"
        v-model="imgFile"
        style="display: none"
        @update:model-value="handleImgUpload"
        multiple
        max-files="5"
        max-file-size="5242880"
        accept=".jpg,.jpeg,.png,.heic"
        @rejected="onRejected"
      />
      <q-btn flat class="action-btn" @click="handleAddImageClick" :disable="isLoading">
        <q-img v-show="isLoading" :src="svgIcon('add-image-disable')" loading="lazy"></q-img>
        <q-img v-show="!isLoading" :src="svgIcon('add-image')" loading="lazy"></q-img>
      </q-btn>

      <q-input
        ref="messageRef"
        standout
        v-model.trim="message"
        :placeholder="$t('chatRoom.please_enter_content')"
        rounded
        outlined
        dense
        borderless
        class="form-input form-msg"
        no-error-icon
        hide-bottom-space
        :disable="isLoading"
      >
      </q-input>

      <!-- <q-btn flat class="action-btn" :class="{ isLoading: isLoading }" :loading="isLoading"> -->
      <q-btn flat class="action-btn" :disable="isLoading" type="submit">
        <q-img v-show="isLoading" :src="svgIcon('loading')" loading="lazy" class="svg-loading"></q-img>
        <q-img v-show="!isLoading" :src="svgIcon('send-msg')" loading="lazy"></q-img>
      </q-btn>
    </q-form>
  </div>
  <BaseDialog
    v-model="nicknameDialog"
    :title="$t('common.warning')"
    max-width="21.4375rem"
    @close-dialog="closeNicknameDialog"
    class="mobile-align-center"
  >
    <div class="delete-dialog-body">
      <q-icon name="error" class="icon-error"></q-icon>
      <div class="tip-error">{{ $t("chatRoom.maximum_number_of_nickname") }}</div>
    </div>
    <div class="delete-dialog-footer">
      <q-btn class="btn-cancel" flat :loading="nicknameLoading" @click="closeNicknameDialog">
        {{ $t("common.btn.cancel") }}
      </q-btn>
      <q-btn class="btn-submit" :loading="nicknameLoading" @click="closeNicknameDialog">
        {{ $t("common.btn.confirm") }}
      </q-btn>
    </div>
  </BaseDialog>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted, onBeforeUnmount } from "vue"
import { useI18n } from "vue-i18n"
import { QFile, useQuasar, QInput } from "quasar"
import { useChatRoom } from "src/common/composables/useChatRoom"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { ERROR_CODE_TYPE } from "src/common/utils/constants"
import ChatTemplate1 from "src/common/components/Chat/Template1.vue"
import BaseDialog from "app/template/set_r016/components/Dialog/BaseDialog.vue"

const { t } = useI18n()
const $q = useQuasar()
const {
  isLoading,
  chatRoomState,
  handleGetChatroomInfo,
  handlePutChatroomMemberNickname,
  syncNicknameInputValue,
  handlePostChatroomMessage,
  handlePostChatroomImage,
  stopIntervalChatroomInfo,
  stopIntervalChatroomMessage
} = useChatRoom()
const { svgIcon } = useSiteImg()

const isEdit = ref(false)
const nicknameRef = ref() as Ref<QInput>
const nicknameDialog = ref(false)
const nicknameLoading = ref(false)

const message = ref("")
const messageRef = ref() as Ref<QInput>

const imgFileRef = ref() as Ref<QFile>
const imgFile = ref<File[]>([])
const rejected = ref(false)

function handleOpenEditNickname() {
  isEdit.value = true
  nicknameRef.value.focus()
}

async function handleEditNickname() {
  const { status, code } = await handlePutChatroomMemberNickname()

  if (status) {
    isEdit.value = false
    return
  }

  if (code === ERROR_CODE_TYPE.Enums.CHATROOM_MEMBER_NICKNAME_REACH_MAX) {
    nicknameDialog.value = true
  }
}

function closeNicknameDialog() {
  syncNicknameInputValue()
  isEdit.value = false
  nicknameDialog.value = false
}

async function handleSendMessage() {
  const { status } = await handlePostChatroomMessage(message.value)
  messageRef.value.focus()
  if (status) {
    message.value = ""
  }
}

function handleAddImageClick() {
  imgFileRef.value.pickFiles()
}

const handleImgUpload = async () => {
  if (rejected.value) {
    rejected.value = false
    return
  }

  if (imgFile.value.length) {
    const { status } = await handlePostChatroomImage(imgFile.value)
    if (status) {
      imgFile.value = []
    }
  }
}

function onRejected() {
  rejected.value = true
  $q.notify({
    type: "negative",
    message: t("common.alarm.uploadImageError"),
    position: "top",
    timeout: 1000
  })
}

onMounted(async () => {
  await handleGetChatroomInfo()
})

onBeforeUnmount(() => {
  stopIntervalChatroomInfo()
  stopIntervalChatroomMessage()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";
@import "app/template/set_r016/assets/css/button.scss";

.chat-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    margin: 0;
    padding: 0 0.375rem;
  }

  .chat-header {
    @apply flex flex-col gap-[1.875rem] p-10;
    border-radius: 0.9375rem;
    background: $gradient02;

    @include phone-width {
      padding: 1.25rem;
      gap: 1.25rem;
    }

    .header-top {
      @apply flex items-center justify-between;

      .btn-go-back {
        @apply p-0 min-h-0;

        .svg-back {
          width: 1.875rem;
          height: 1.875rem;
        }
      }

      .header-title {
        font-family: AlibabaPuHuiTi;
        font-weight: 700;
        font-size: 24px;
        line-height: 2.0625rem;
        color: $neutral01;
      }
    }

    .header-bottom {
      @apply flex items-center gap-[1.875rem];

      @include phone-width {
        @apply flex-col gap-5;
      }

      .bottom-left {
        @apply px-10;

        @include phone-width {
          @apply px-0;
        }

        .svg-avatar-big {
          width: 9.375rem;
          height: 9.375rem;

          @include phone-width {
            width: 6.25rem;
            height: 6.25rem;
          }
        }
      }

      .bottom-right {
        @apply w-full bg-white rounded-[.9375rem] p-[1.875rem] flex flex-col gap-5;
        // height: 9.375rem;

        .user-account {
          font-family: DMSans;
          font-weight: 700;
          font-size: 20px;
          line-height: 1.625rem;
          color: $neutral10;
        }

        .q-separator {
          @apply relative h-0;

          &::after {
            content: "";
            width: 100%;
            height: 2px;
            background: $neutral05;
            position: absolute;
          }
        }

        .form-nickname {
          &.q-field--readonly {
            :deep(.q-field__native) {
              cursor: no-drop;
            }
            :deep(.q-field__control) {
              height: 1.5rem;
              border-bottom: none;

              .q-field__append {
                height: 1.5rem;

                .svg-edit {
                  width: 1.5rem;
                  height: 1.5rem;
                  cursor: pointer;
                }
              }
            }
          }

          :deep(.q-field__control) {
            height: 2.875rem;
            padding: 0;
            box-shadow: none;
            border-radius: 0;
            border-bottom: 1px solid $primary05;

            &::before {
              border: none;
            }

            .q-field__native {
              font-family: DMSans;
              font-weight: 400;
              font-size: 16px;
              line-height: 1.3125rem;
              color: $neutral10;
            }

            .q-field__append {
              height: 2.875rem;

              .btn-save {
                padding: 0.625rem 1.125rem;
                background: $gradient01;
                border-radius: 0.625rem;

                &::before {
                  box-shadow: none;
                }

                .q-btn__content {
                  @include fontStyle(0.875rem, 700, 1rem);
                  color: $neutral01;
                }
              }
            }
          }
        }
      }
    }
  }

  .chat-body {
    @apply py-5 flex flex-col gap-3;

    @include phone-width {
      margin-bottom: 71px;
    }

    :deep(.chat-container) {
      height: 529px;
      overflow-y: auto;

      @include phone-width {
        height: 479px;
      }
      .q-message-sent {
        .icon-user {
          color: $primary04;
        }

        .chat-text {
          background: $primary02;
        }
      }
    }
  }

  .chat-footer {
    @apply w-full flex justify-between items-center gap-6;
    padding: 1.5625rem 2.5rem;
    background: $gradient02;
    border-radius: 3.75rem;

    @include phone-width {
      @apply fixed left-0 ring-0 items-start gap-3 z-50;
      height: 125px;
      bottom: 40px;
      border-radius: 1.25rem 1.25rem 0 0;
      padding: 1.5rem 0.75rem;
    }

    .form-msg {
      width: 100%;

      :deep(.q-field__control) {
        height: 3.125rem;
        padding: 0 1.8125rem;
        box-shadow: none;
        border-radius: 1.25rem;

        @include phone-width {
          height: 1.75rem;
        }

        &::before {
          border: none;
        }

        .q-field__native {
          @include fontStyle(1.125rem, 400, 1.375rem);
          color: $neutral06;
        }
      }

      &.q-field--disabled {
        :deep(.q-field__inner) {
          .q-field__control {
            background: $neutral04;
          }
        }
      }
    }

    .action-btn {
      padding: 0;
      min-height: auto;

      &.q-btn.disabled {
        opacity: 1 !important;
      }

      &.isLoading {
        background-color: #fff;
        border-radius: 50%;
      }

      .q-img {
        width: 3.125rem;
        height: 3.125rem;

        @include phone-width {
          width: 1.75rem;
          height: 1.75rem;
        }

        &.svg-loading {
          animation: q-spin 2s linear infinite;
        }
      }
    }
  }
}

.delete-dialog-body {
  @apply flex gap-2;
  min-height: 4rem;

  .icon-error {
    font-size: 1.125rem;
    color: $primary04;
  }

  .tip-error {
    @include fontStyle(0.875rem, 700, 1rem);
    color: $neutral09;
  }
}

.delete-dialog-footer {
  @apply p-0 mt-[1.875rem] flex items-center flex-nowrap gap-[.625rem];

  .q-btn {
    @apply w-1/2 h-[2.25rem];
    @include fontStyle(0.875rem, 700, 1rem);
    border-radius: 0.625rem;

    &.btn-cancel {
      color: $primary04;
    }

    &.btn-submit {
      background: $gradient01;
      color: $neutral01;
    }
  }
}
</style>
