<template>
  <table class="desktop-mail-table">
    <thead class="thead-wrapper">
      <tr>
        <th class="p-3">{{ $t("tableHeader.type") }}</th>
        <th class="p-3">{{ $t("tableHeader.title") }}</th>
        <th class="p-3">{{ $t("tableHeader.content") }}</th>
        <th class="p-3">{{ $t("tableHeader.dateAndTime") }}</th>
        <th class="p-3">{{ $t("tableHeader.status") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(mail, key) in mailList" :key="key" class="mail-list">
        <td class="p-3">
          <span class="mail-type">{{ $t(MAIL_TYPE.I18nKeys[mail.mail_type]) }}</span>
        </td>
        <td class="p-3">
          <div class="mail-title">
            <span>{{ dateformat(mail.send_at, "YYYY/MM/DD") }}</span>
            <span>{{ mail.mail_title }}</span>
          </div>
        </td>
        <td class="p-3">
          <div class="mail-content">
            <span v-html="truncatedHtmlContent(mail.mail_body)"></span>
          </div>
        </td>
        <td class="p-3 text-center">
          {{ dateformat(mail.send_at, "YYYY/MM/DD HH:mm:ss") }}
        </td>
        <td class="p-3 text-center">
          <button
            class="btn-read-more"
            @click="$emit('show-info', mail.id)"
            :class="{ 'mail-unread': mail.status === MAIL_STATUS.Enums.Active }"
          >
            {{ mail.status === MAIL_STATUS.Enums.Active ? $t("member.mail.active") : $t("member.mail.completed") }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
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
@import "app/template/set_DBO88/assets/css/_variable.scss";

.desktop-mail-table {
  @apply max-h-[80vh] overflow-y-auto;
  border: 1px solid $primary-color;
  border-collapse: separate;
  border-spacing: 0;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  overflow: hidden;

  td {
    @apply border-r border-b;
  }

  td {
    border-color: $primary-color;
    color: $text-white;
  }

  th:last-child,
  td:last-child {
    @apply border-r-0;
  }

  tr:last-child td {
    @apply border-b-0;
  }

  .thead-wrapper {
    @apply text-white;
    background: $primary-color;
  }

  .mail-title {
    @apply flex flex-col items-center justify-center;
  }

  .btn-read-more {
    color: $text-success;
  }

  .mail-unread {
    color: $danger-color;
  }
}
</style>
