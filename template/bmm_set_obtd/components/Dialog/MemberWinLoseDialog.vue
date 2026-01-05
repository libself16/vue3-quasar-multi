<template>
  <q-dialog
    v-model="modelValue"
    transition-show="fade"
    transition-hide="fade"
    @hide="closeDialog"
    class="member-win-lose-dialog"
  >
    <q-card :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`" class="member-win-lose-card">
      <q-card-section class="dialog-header">
        <h2 class="title">{{ $t("menu.winLoss") }}</h2>
        <q-btn icon="close" flat class="btn-close" @click="closeDialog"></q-btn>
      </q-card-section>
      <q-card-section class="dialog-body">
        <div class="mb-2 online-time">
          <label>{{ $t("common.online_time") }}：</label>
          <span class="text-primary font-bold">{{ onlineTime }}</span>
        </div>
        <div class="win-lose-list-wrapper">
          <label>{{ $t("menu.winLoss") }}：</label>
          <div class="win-lose-list">
            <q-badge
              v-for="(item, key) in genWinLoseList"
              :key="key"
              :color="item.isPositive ? 'light-green-3' : 'red-2'"
              :text-color="item.isPositive ? 'green-9' : 'red-8'"
              class="px-2 py-2 font-[500] text-[16px] mr-2 mt-2"
              align="middle"
            >
              {{ moneyFormat(item.win_loss_amount) }} {{ item.currency_code }}
            </q-badge>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useQuasar } from "quasar"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useCommon } from "src/common/hooks/useCommon"
import { useOnlineTime } from "src/common/composables/useOnlineTime"
import { useUserInfo } from "src/common/composables/useUserInfo"
import * as Response from "src/api/response.type"

const $q = useQuasar()
const eventbus = injectStrict(EventBusKey)
const { moneyFormat } = useCommon()
const { lastLoginTime, winLoseList } = useUserInfo()

const modelValue = ref(false)

const genWinLoseList = computed<Response.UserBetHistoryTotalItem[]>(() =>
  winLoseList.value.map((item) => ({
    ...item,
    isPositive: item.win_loss_amount && !item.win_loss_amount.startsWith("-")
  }))
)
const { onlineTime } = useOnlineTime(lastLoginTime)

function closeDialog() {
  eventbus.emit("openWinLoseDialog", false)
}

onMounted(async () => {
  eventbus.on("openWinLoseDialog", (show: boolean) => {
    modelValue.value = show
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/button.scss";

.member-win-lose-dialog {
  .member-win-lose-card {
    width: 90%;
    max-width: 640px;
    padding: 20px;
    height: auto;
    border-radius: 1rem;
    overflow: hidden;

    .dialog-header {
      @apply flex justify-between items-center mb-5 p-0;
      color: rgba($text-dark-color, 0.88);
      .title {
        font-family: "Segoe UI";
        display: flex;
        font-size: 28px;
        color: $primary-color;
        font-weight: 590;
        line-height: 1.5;
        word-wrap: break-word;
      }
      .btn-close {
        padding: 0;
        min-width: auto;
        &:hover {
          :deep(.q-icon) {
            color: $text-dark-color;
          }
        }
        :deep(.q-icon) {
          color: rgba($text-dark-color, 0.45);
          font-size: 2rem;
          font-weight: bold;
        }
      }
    }

    .dialog-body {
      @apply flex flex-col ml-3;
      justify-content: center;
      border-radius: 0.875rem;
      font-size: 1rem;
      padding: 0;

      label {
        @apply mr-1;
        word-break: keep-all;
      }

      .win-lose-list-wrapper {
        @apply flex flex-row;

        .win-lose-list {
          @apply flex;
          flex: 1;
          flex-wrap: wrap;
          margin-top: -0.625rem;
        }

        .more-wrapper {
          .btn-more {
            @include btn-common;
            width: auto;
            min-width: auto;
          }
        }
      }
    }
  }
}
</style>
