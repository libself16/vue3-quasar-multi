<template>
  <div class="recent-list-content">
    <div v-for="item in chatRoomState.recentList" :key="item.target_id" class="recent-list-row">
      <div class="recent-list-row-left">
        <q-img :src="svgIcon('avatar-other')" loading="lazy" class="recent-list-avatar"></q-img>
        <div class="recent-list-user-name" @click="handleGoChat(item.target_id)">
          {{ item.target_account }} {{ item.target_nickname ? `(${item.target_nickname})` : "" }}
        </div>
      </div>
      <div class="recent-list-row-right">{{ dateformat(item.last_message_at, "YYYY-MM-DD HH:mm:ss") }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue"
import { useChatRoom } from "src/common/composables/useChatRoom"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"

const { svgIcon } = useSiteImg()
const { chatRoomState, handleGoChat, handleGetChatroomRecent, startIntervalRecent, stopIntervalRecent } = useChatRoom()

onMounted(async () => {
  await handleGetChatroomRecent()
  startIntervalRecent()
})

onBeforeUnmount(() => {
  stopIntervalRecent()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";
@import "app/template/set_r016/assets/css/button.scss";

.recent-list-content {
  @apply flex flex-col justify-center gap-5;

  @include phone-width {
    gap: 0.625rem;
  }

  .recent-list-row {
    @apply flex justify-between py-3 px-5;

    @include phone-width {
      @apply px-0;
    }

    .recent-list-row-left {
      @apply flex items-center gap-3;

      @include phone-width {
        max-width: 50%;
        overflow: hidden;
      }

      .recent-list-avatar {
        width: 3.5rem;
        height: 3.5rem;
      }

      .recent-list-user-name {
        @include fontStyle(1.125rem, 700, 1.3125rem);
        color: $neutral10;
        max-width: calc(100% - 4.25rem);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }
    }

    .recent-list-row-right {
      @include fontStyle(1rem, 400, 1.125rem);
      color: $neutral06;
    }
  }
}
</style>
