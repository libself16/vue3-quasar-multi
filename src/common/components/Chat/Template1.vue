<template>
  <div ref="chatContainer" @scroll="handleChatContainerScroll" class="chat-container">
    <q-chat-message
      v-for="(item, index) in mergedMessages"
      :key="`message-${item.member_id}=${index}`"
      :text="[]"
      bg-color="transparent"
      :sent="item.isSender"
    >
      <template #avatar>
        <q-icon name="account_circle" class="icon-user" />
      </template>
      <template #default>
        <div class="chat-content">
          <template v-for="chat in item.messages" :key="chat.id">
            <div v-if="chat.message.type === CHAT_MESSAGE_TYPE.Enums.text" class="chat-text">
              {{ chat.message.message }}
            </div>
            <img
              v-else-if="chat.message.type === CHAT_MESSAGE_TYPE.Enums.image"
              :src="chat.message.path"
              alt="chat image"
              class="chat-image"
            />
          </template>
        </div>
      </template>
    </q-chat-message>
  </div>
</template>

<script setup lang="ts">
import { useChatRoom } from "src/common/composables/useChatRoom"
import { CHAT_MESSAGE_TYPE } from "src/common/utils/constants"

const { mergedMessages, chatContainer, handleChatContainerScroll } = useChatRoom()
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.q-message {
  margin-bottom: 0.75rem;
  padding: 0.625rem;

  @include phone-width {
    @apply px-0;
  }

  :deep(.q-message-container) {
    gap: 0.9375rem;

    div {
      flex: 1;
    }

    .icon-user {
      font-size: 3.5rem;
      color: #2c2c2c;

      @include phone-width {
        font-size: 2rem;
      }
    }

    .q-message-text {
      padding: 0;
      line-height: normal;
    }

    .q-message-text + .q-message-text {
      margin-top: 0;
    }

    .chat-content {
      @apply w-full flex flex-col items-start  gap-[.9375rem];

      .chat-text {
        font-family: Inter;
        font-weight: 400;
        font-size: 16px;
        line-height: 1.1875rem;
        background: #e5e5e5;
        color: #2c2c2c;
        padding: 0.75rem;
        border-radius: 0.625rem;
        max-width: 86.47%;

        @include phone-width {
          max-width: 66%;
        }
      }

      .chat-image {
        width: 12.0625rem;
        height: 12.0625rem;
      }
    }
  }

  // 接收者客製
  // &.q-message-received{}

  // 發送者客製
  &.q-message-sent {
    .chat-content {
      @apply items-end;
    }
  }
}
</style>
