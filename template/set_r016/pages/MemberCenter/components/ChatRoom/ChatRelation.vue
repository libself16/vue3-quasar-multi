<template>
  <div v-for="item in sortedGroups" :key="item.key" class="relation-list-wrapper">
    <div class="relation-list-header">{{ item.key === otherGroup ? $t("menu.other") : item.key }}</div>
    <div class="relation-list-content">
      <div v-for="member in item.members" :key="member.member_id" class="relation-list-row">
        <div class="relation-list-row-left">
          <q-img :src="svgIcon('avatar-other')" loading="lazy" class="relation-list-avatar"></q-img>
          <div class="relation-list-user-name" @click="handleGoChat(member.member_id)">
            {{ member.account }} {{ member.nickname ? `(${member.nickname})` : "" }}
          </div>
        </div>
        <div class="relation-list-row-right">
          <q-btn class="btn-delete hide-hover" @click="openDeleteDialog(member.member_id)">
            <q-img :src="svgIcon('trash')" loading="lazy" class="svg-trash"></q-img>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
  <BaseDialog
    v-model="dialog"
    :title="$t('common.warning')"
    max-width="21.4375rem"
    @close-dialog="closeDeleteDialog"
    class="mobile-align-center"
  >
    <div class="delete-dialog-body">
      <q-icon name="error" class="icon-error"></q-icon>
      <div class="tip-error">{{ $t("chatRoom.sure_remove_player_chat_history") }}</div>
    </div>
    <div class="delete-dialog-footer">
      <q-btn class="btn-cancel" flat :loading="deleteLoading" @click="closeDeleteDialog">
        {{ $t("common.btn.cancel") }}
      </q-btn>
      <q-btn class="btn-submit" :loading="deleteLoading" @click="handleDeleteSubmit">
        {{ $t("common.btn.confirm") }}
      </q-btn>
    </div>
  </BaseDialog>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useChatRoom } from "src/common/composables/useChatRoom"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import BaseDialog from "app/template/set_r016/components/Dialog/BaseDialog.vue"

const { svgIcon } = useSiteImg()
const {
  otherGroup,
  sortedGroups,
  handleGoChat,
  handleGetChatroomRelation,
  handleDeleteChatroomRelation,
  startIntervalRelation,
  stopIntervalRelation
} = useChatRoom()
const dialog = ref(false)
const deleteLoading = ref(false)
const deleteAccount = ref(0)

function openDeleteDialog(memberId: number) {
  if (!memberId) return
  deleteAccount.value = memberId
  dialog.value = true
}

function closeDeleteDialog() {
  deleteAccount.value = 0
  dialog.value = false
}

async function handleDeleteSubmit() {
  deleteLoading.value = true
  const status = await handleDeleteChatroomRelation(deleteAccount.value)
  deleteLoading.value = false

  if (status) {
    closeDeleteDialog()
  }
}

onMounted(async () => {
  await handleGetChatroomRelation()
  startIntervalRelation()
})

onBeforeUnmount(() => {
  stopIntervalRelation()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";
@import "app/template/set_r016/assets/css/button.scss";

.relation-list-header {
  @apply px-10 py-4 rounded-[1.875rem];
  background: $neutral04;
  font-family: DMSans;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.625rem;

  @include phone-width {
    @apply px-5 py-3;
  }
}

.relation-list-content {
  @apply flex flex-col justify-center gap-5 py-5;
  @include phone-width {
    @apply py-3;
    gap: 0.625rem;
  }

  .relation-list-row {
    @apply flex justify-between items-center py-3 px-5;

    @include phone-width {
      @apply p-4;
    }

    .relation-list-row-left {
      @apply flex items-center gap-3;

      @include phone-width {
        max-width: calc(100% - 4.375rem);
        overflow: hidden;
      }

      .relation-list-avatar {
        width: 3.5rem;
        height: 3.5rem;
      }

      .relation-list-user-name {
        @include fontStyle(1.125rem, 700, 1.3125rem);
        color: $neutral10;
        max-width: calc(100% - 4.25rem);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }
    }

    .relation-list-row-right {
      .btn-delete {
        border-radius: 0.625rem;
        background: #efefef;
        padding: 0.2269rem 0.9769rem;
        min-height: auto;
        box-shadow: $shadow05;

        &::before {
          box-shadow: none;
        }

        :deep(.q-btn__content) {
          .svg-trash {
            width: 1.4212rem;
            height: 1.4212rem;
          }
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
