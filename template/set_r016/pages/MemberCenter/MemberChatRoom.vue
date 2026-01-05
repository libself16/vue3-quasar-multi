<template>
  <div class="chat-room-wrapper">
    <div class="chat-room-header">
      <div class="header-top">
        <q-img :src="svgIcon('chat')" loading="lazy" class="svg-chat"></q-img>
        {{ $t("chatRoom.chatroom") }}
      </div>
      <div class="header-middle">
        <q-input
          standout
          v-model="chatRoomState.searchInputValue"
          :placeholder="$t('chatRoom.please_enter_your_friend_id')"
          rounded
          outlined
          dense
          borderless
          class="form-input form-search"
          no-error-icon
          hide-bottom-space
          @update:model-value="handleSearchInputUpdate"
        >
          <template #append>
            <q-btn flat class="cursor-default hide-hover" :loading="isLoading">
              <q-img :src="svgIcon('search')" loading="lazy" class="svg-search"></q-img>
            </q-btn>
          </template>
        </q-input>
      </div>
      <div class="header-bottom">
        <q-btn class="header-btn hide-hover" :to="{ name: 'MemberDeposit' }">
          <q-img :src="svgIcon('deposit')" loading="lazy" class="svg-wallet"></q-img>
          <div class="header-btn-text">{{ $t("menu.deposit") }}</div>
        </q-btn>
        <q-btn class="header-btn hide-hover" :to="{ name: 'MemberWithdrawal' }">
          <q-img :src="svgIcon('withdraw')" loading="lazy" class="svg-wallet"></q-img>
          <div class="header-btn-text">{{ $t("menu.withdrawal") }}</div>
        </q-btn>
      </div>
    </div>

    <!-- 搜尋畫面 -->
    <div v-if="onInput">
      <SearchList />
    </div>

    <div v-else>
      <q-tabs v-model="tab" class="tabs-wrapper" indicator-color="transparent" active-class="active" dense>
        <q-tab v-for="(type, key) in tabTypes.types" :key="key" :name="type.value" :label="$t(type.i18nLabel)"></q-tab>
      </q-tabs>
      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="fade"
        transition-next="fade"
        :swipeable="false"
        class="tab-panels-wrapper"
      >
        <q-tab-panel :name="TAB_TYPE.chatRelation">
          <!-- 聊天室畫面 -->
          <ChatRelation />
        </q-tab-panel>
        <q-tab-panel :name="TAB_TYPE.chatRecent">
          <!-- 聊天紀錄畫面 -->
          <ChatRecent />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount } from "vue"
import { useChatRoom } from "src/common/composables/useChatRoom"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import SearchList from "./components/ChatRoom/SearchList.vue"
import ChatRelation from "./components/ChatRoom/ChatRelation.vue"
import ChatRecent from "./components/ChatRoom/ChatRecent.vue"

enum TAB_TYPE {
  chatRelation = "chatRelation",
  chatRecent = "chatRecent"
}

const { chatRoomState, onInput, isLoading, clearChatRoomStore, handleSearchInputUpdate } = useChatRoom()
const { svgIcon } = useSiteImg()

const tabTypes = reactive({
  types: [
    {
      i18nLabel: "chatRoom.chatroom",
      value: TAB_TYPE.chatRelation
    },
    {
      i18nLabel: "chatRoom.chat_history",
      value: TAB_TYPE.chatRecent
    }
  ]
})
const tab = ref(tabTypes.types[0].value)

onBeforeUnmount(() => {
  clearChatRoomStore()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";
@import "app/template/set_r016/assets/css/button.scss";

.chat-room-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    margin: 0;
    padding: 0 0.375rem;
  }

  .chat-room-header {
    @apply flex flex-col gap-5;
    padding: 2.5rem 2.0625rem 1.25rem;
    border-radius: 0.625rem;
    background: $gradient02;

    @include phone-width {
      padding: 1.25rem;
    }

    .header-top {
      @apply flex items-center justify-center;
      @include fontStyle(1.625rem, 700, 1.875rem);
      color: $neutral01;
      gap: 0.625rem;

      .svg-chat {
        width: 2.5rem;
        height: 2.5rem;
      }
    }

    .header-middle {
      .form-search {
        :deep(.q-field__control) {
          height: 3.75rem;
          padding: 0 0.9375rem 0 1.25rem;

          .q-field__native {
            @include fontStyle(1rem, 400, 1.375rem);
          }

          .q-field__append {
            height: 3.75rem;

            .svg-search {
              width: 1.875rem;
              height: 1.875rem;
            }
          }
        }
      }
    }

    .header-bottom {
      @apply w-full flex justify-center items-center gap-5;

      .header-btn {
        @include gradientBtn();
        width: 50%;
        height: 6.5rem;
        padding: 0.625rem;
        border-radius: 0.625rem;

        :deep(.q-btn__content) {
          flex-direction: column;
          gap: 0.375rem;

          .q-img {
            width: 3.75rem;
            height: 3.75rem;
          }

          .header-btn-text {
            @include fontStyle(1rem, 700, 1.125rem);
            text-transform: none;
          }
        }
      }
    }
  }

  .tabs-wrapper {
    @apply mt-5;

    @include phone-width {
      margin-top: 0.625rem;
    }

    :deep(.q-tabs__content) {
      @apply gap-5;

      .q-tab {
        @apply w-1/2 p-0 relative;
        text-transform: initial;

        .q-focus-helper {
          opacity: 0;
        }

        .q-tab__content {
          padding: 0.625rem 0;

          .q-tab__label {
            @include fontStyle(1.125rem, 700, 1.3125rem);
            color: $neutral09;
          }
        }

        &.active {
          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            width: 100%;
            background-color: $primary04;
          }

          .q-tab__label {
            color: $primary04;
          }
        }
      }
    }
  }

  .tab-panels-wrapper {
    @apply mt-5;

    @include phone-width {
      margin-top: 0.625rem;
    }

    :deep(.q-tab-panel) {
      @apply p-0;
    }
  }
}
</style>
