<template>
  <div v-if="chatRoomState.searchMemberInfo" class="search-list-content">
    <div class="search-list-row">
      <q-img :src="svgIcon('avatar-other')" loading="lazy" class="search-list-avatar"></q-img>
      <div
        class="search-list-user-name"
        :class="{ disable: accountInfo.account === chatRoomState.searchMemberInfo.account }"
        @click="handleAccountClick"
      >
        {{ chatRoomState.searchMemberInfo.account }}
      </div>
    </div>
  </div>
  <div v-else class="search-list-no-data">{{ $t("chatRoom.no_results_found_please_check_id") }}</div>
</template>
<script lang="ts" setup>
import { useChatRoom } from "src/common/composables/useChatRoom"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useUserInfo } from "src/common/composables/useUserInfo"

const { svgIcon } = useSiteImg()
const { chatRoomState, handleGoChat } = useChatRoom()
const { accountInfo } = useUserInfo()

function handleAccountClick() {
  if (!chatRoomState.value.searchMemberInfo) return
  if (accountInfo.value.account === chatRoomState.value.searchMemberInfo.account) return

  handleGoChat(chatRoomState.value.searchMemberInfo.member_id)
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";
@import "app/template/set_r016/assets/css/button.scss";

.search-list-content {
  @apply flex flex-col justify-center gap-5 mt-5;

  @include phone-width {
    gap: 0.625rem;
  }

  .search-list-row {
    @apply flex items-center gap-3 py-3 px-5;

    .search-list-avatar {
      width: 3.5rem;
      height: 3.5rem;
    }

    .search-list-user-name {
      @include fontStyle(1.125rem, 700, 1.3125rem);
      color: $neutral10;
      cursor: pointer;

      &.disable {
        cursor: default;
      }
    }
  }
}

.search-list-no-data {
  @apply text-center mt-5;
  @include fontStyle(1.125rem, 700, 1.3125rem);
  padding: 0.625rem;
  color: $neutral09;
}
</style>
