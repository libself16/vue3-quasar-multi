<template>
  <ModalBase
    v-model="modalShow"
    modal-class="modal_share_custom"
    use-title
    :title="$t('menu.inbox')"
    title-class="modal_title_top_inbox"
    max-width="1280px"
    height="calc(100vh - 100px)"
  >
    <!-- pc -->
    <div class="tranc-table d-show">
      <div class="table-responsive">
        <q-table
          ref="tableRef"
          :rows="mailState.list"
          :rows-per-page-options="[10]"
          :columns="columns"
          row-key="id"
          :loading="isLoading"
          hide-pagination
          separator="none"
          flat
        >
          <template v-slot:loading>
            <q-inner-loading showing dark color="accent" />
          </template>

          <template #body="props">
            <q-tr>
              <q-td key="mail_type" :props="props" width="15%">
                <span>{{ $t(MAIL_TYPE.I18nKeys[props.row.mail_type as MAIL_TYPE.Enums]) }}</span>
              </q-td>
              <q-td key="mail_title" :props="props" width="20%">
                <span class="w-56 inline-block overflow-hidden text-ellipsis">{{ props.row.mail_title }}</span>
              </q-td>

              <q-td key="mail_body" :props="props" class="cursor-pointer" width="45%">
                <span
                  @click="showInfo(props.row.id)"
                  v-html="truncatedHtmlContent(props.row.mail_body, 80)"
                  class="w-[33.5rem] inline-block overflow-hidden"
                ></span>
              </q-td>
              <q-td key="send_at" :props="props" width="10%">
                <span>{{ dateformat(props.row.send_at, "YYYY/MM/DD HH:mm:ss") }}</span>
              </q-td>
              <q-td key="status" :props="props" width="10%">
                <span>{{ $t(MAIL_STATUS.I18nKeys[props.row.status as MAIL_STATUS.Enums]) }}</span>
              </q-td>
            </q-tr>
          </template>
          <template #no-data>
            <div class="no-data-container">
              <span>{{ $t("tableHeader.no_data") }}</span>
            </div>
          </template>
        </q-table>
      </div>
    </div>
    <!-- h5 -->
    <div class="tranc-table m-show">
      <div class="msg-inbox">
        <ul v-if="mailState.list.length">
          <li v-for="(item, index) in mailState.list" :key="index">
            <div class="msg-iteam">
              <div class="msg-date">
                {{ dateformat(item.send_at, "YYYY/MM/DD") }} <span>{{ dateformat(item.send_at, "HH:mm:ss") }}</span>
              </div>
              <div
                class="msg-wrap"
                :class="{
                  'msg-unread': item.status === MAIL_STATUS.Enums.Active,
                  'msg-read': item.status === MAIL_STATUS.Enums.Completed
                }"
              >
                <div class="msg-type">{{ $t(MAIL_TYPE.I18nKeys[item.mail_type as MAIL_TYPE.Enums]) }}</div>
                <div class="msg-tl overflow-hidden text-ellipsis">{{ item.mail_title }}</div>
                <div class="msg-cnt overflow-hidden" v-html="truncatedHtmlContent(item.mail_body, 35)"></div>
                <button class="btn-mr" @click="showInfo(item.id)">{{ $t("common.btn.readMore") }}</button>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="msg-iteam">
          <div class="msg-wrap text-center">
            {{ $t("tableHeader.no_data") }}
          </div>
        </div>
      </div>
    </div>
    <!-- pagination -->
    <div v-if="totalPage" class="af-pag my-4">
      <q-pagination
        v-model="mailState.query.page"
        :max="totalPage"
        direction-links
        outline
        color="pagination"
        active-color="pagination-active"
        icon-prev="keyboard_double_arrow_left"
        icon-next="keyboard_double_arrow_right"
        @update:model-value="handlePagination"
      />
    </div>
    <!-- inbox detail -->
    <ModalBase
      v-model="modalInboxDetailShow"
      modal-class="modal_share_custom"
      use-title
      :title="$t('member.mail.inboxContent')"
      title-class="modal_title_top_inbox"
      max-width="31.25rem"
      class="inbox-detail-dialog"
    >
      <div class="msg-content-pop">
        <div class="msg-in">
          <div class="msg-item">
            <div class="msg-l">{{ $t("modal.title") }}</div>
            <div class="msg-l">{{ mailState.detail.mail_title }}</div>
          </div>
          <div class="msg-item">
            <div class="msg-l">{{ $t("modal.time") }}</div>
            <div class="msg-l">{{ dateformat(mailState.detail.send_at, "YYYY-MM-DD HH:mm:ss") }}</div>
          </div>
          <div class="msg-item">
            <div class="msg-l">{{ $t("modal.type") }}</div>
            <div class="msg-l">{{ $t(MAIL_TYPE.I18nKeys[mailState.detail.mail_type]) }}</div>
          </div>
          <div class="msg-item">
            <div class="msg-l">{{ $t("modal.content") }}</div>
            <div class="msg-l table-content">
              <div v-html="mailState.detail.mail_body"></div>
            </div>
          </div>
        </div>
      </div>
    </ModalBase>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useMail } from "src/common/composables/useMail"
import { MAIL_STATUS, MAIL_TYPE } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import ModalBase from "./modalBase.vue"

const { mailState, columns, totalPage, isLoading, getMailList, getMailDetail, truncatedHtmlContent } = useMail()
const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)
const modalInboxDetailShow = ref(false)

const showInfo = async (id: number) => {
  modalInboxDetailShow.value = true
  await getMailDetail(id)
}

const handlePagination = (page: number) => {
  handleMailList(page, mailState.query.rowsPerPage)
}

const handleMailList = async (page: number, rowsPerPage: number) => {
  if (isLoading.value) return
  await getMailList({ page: page, rowsPerPage: rowsPerPage })
}

onMounted(() => {
  eventbus.on("openInbox", (show: boolean) => {
    modalShow.value = show
    if (show) {
      handleMailList(1, 10)
    }
  })
})
</script>

<style scoped lang="scss">
@import "app/template/set_royalslot88/assets/css/history.css";
@import "app/template/set_royalslot88/assets/css/inbox.css";
@import "app/template/set_royalslot88/assets/css/table.scss";
@import "app/template/set_royalslot88/assets/css/pagination.scss";

.table-content {
  :deep(td) {
    border: 1px solid #6237f0;
  }
}
</style>
