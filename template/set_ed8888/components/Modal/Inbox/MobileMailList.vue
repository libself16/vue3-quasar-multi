<template>
  <ul class="mobile-mail-wrapper">
    <li v-for="(mail, key) in mailList" :key="key" class="mail-list">
      <span class="mail-date">{{ dateformat(mail.send_at, "YYYY/MM/DD HH:mm:ss") }}</span>
      <div class="mail-item">
        <span class="mail-type">{{ $t(MAIL_TYPE.I18nKeys[mail.mail_type]) }}</span>
        <div class="mail-title" :class="{ 'mail-unread': mail.status === MAIL_STATUS.Enums.Active }">
          <span class="mr-1">{{ dateformat(mail.send_at, "YYYY/MM/DD") }}</span>
          <span>{{ mail.mail_title }}</span>
        </div>
        <div class="mail-content py-[10px]">
          <span v-html="truncatedHtmlContent(mail.mail_body)"></span>
        </div>
        <div class="flex w-full justify-center">
          <button class="btn-read-more" @click="$emit('show-info', mail.id)">
            {{ $t("common.btn.readMore") }}
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { dateformat } from "src/common/utils/dayjsUtils"
import { MAIL_TYPE, MAIL_STATUS } from "src/common/utils/constants"
import { useMail } from "src/common/composables/useMail"
import type { Mail } from "src/api/response.type"

const { truncatedHtmlContent } = useMail()

defineProps<{
  mailList: Mail[]
}>()

defineEmits<{
  (e: "show-info", id: number): void
}>()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/_variable.scss";

.mobile-mail-wrapper {
  @apply max-h-[80vh] overflow-y-auto;

  .mail-list {
    @apply mb-[1.25rem] px-2;
  }

  .mail-date {
    @apply flex justify-center mb-[.3125rem] text-black font-bold;
  }

  .mail-item {
    @apply text-white rounded-[.3125rem] p-[.9375rem];
    background: $primary-color;
  }

  .mail-type,
  .mail-title {
    @apply font-bold text-sm;
  }

  .mail-title {
    @apply flex pb-[.3125rem];
    border-bottom: 1px solid rgba($pink-shadow-color, 0.4);
  }

  .btn-read-more {
    @apply py-[.3125rem] px-[.625rem] rounded-[.625rem] text-sm;
    background: $pink-button-gradient;
  }
}
</style>
