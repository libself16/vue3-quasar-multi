<template>
  <div class="inbox-layout">
    <q-table
      v-if="!isMobile"
      class="inbox-table d-show"
      color="primary"
      table-class="text-grey-1"
      table-header-class="text-grey-1"
      ref="tableRef"
      :rows="mailState.list"
      :rows-per-page-options="[20]"
      :columns="columns"
      row-key="id"
      v-model:pagination="mailState.query"
      :loading="loading"
      @request="onRequest"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template #body="props">
        <q-tr>
          <q-td key="mail_type" :props="props">
            <span>{{ props.row.mail_type }}</span>
          </q-td>
          <q-td key="mail_title" :props="props">
            <span>{{ props.row.mail_title }}</span>
          </q-td>
          <q-td key="mail_body" :props="props">
            <span @click="showInfo(props.row.id)" v-html="truncatedHtmlContent(props.row.mail_body)"></span>
          </q-td>
          <q-td key="send_at" :props="props">
            <span>{{ props.row.send_at }}</span>
          </q-td>
          <q-td key="status" :props="props">
            <span>{{ props.row.status }}</span>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <InboxTable v-if="isMobile" class="m-show" @openDetail="(id) => showInfo(id)" />
  </div>
  <q-dialog v-model="modalShow">
    <q-card class="q-dark">
      <q-card-section>
        <div class="text-h6">{{ $t("modal.content") }}</div>
      </q-card-section>

      <q-card-section class="row items-center text-body2">
        <div>
          <div class="msg-item">
            <div>{{ $t("modal.title") }}</div>
            <div>{{ mailState.detail.mail_title }}</div>
          </div>
          <div class="msg-item">
            <div>{{ $t("modal.time") }}</div>
            <div>{{ mailState.detail.send_at }}</div>
          </div>
          <div class="msg-item">
            <div>{{ $t("modal.type") }}</div>
            <div>{{ mailState.detail.mail_type }}</div>
          </div>
          <div class="msg-item">
            <div>{{ $t("modal.content") }}</div>
            <div v-html="mailState.detail.mail_body"></div>
          </div>
        </div>
        <!-- <q-inner-loading :showing="modalLoading" class="q-dark">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading> -->
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('modal.confirm')" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import type { QTableProps } from "quasar"
import { useMail } from "src/common/composables/useMail"
import { onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import InboxTable from "./mobile/InboxTable.vue"

const { mailState, columns, getMailList, getMailDetail, truncatedHtmlContent } = useMail()

const { width } = useWindowSize()
const route = useRoute()
const tableRef = ref()
const loading = ref(false)
let isMobile = ref(false)

const onRequest = async (props: Parameters<NonNullable<QTableProps["onRequest"]>>[0]) => {
  const { page, rowsPerPage } = props.pagination
  if (loading.value) return
  loading.value = true

  await getMailList({ page: page, rowsPerPage: rowsPerPage })

  loading.value = false
}

const modalShow = ref(false)
const showInfo = async (id: number) => {
  modalShow.value = true
  await getMailDetail(id)
}

onMounted(() => {
  // get initial data from server (1st page)
  const { page, rowsPerPage } = route.query
  if (route.query.page && route.query.rowsPerPage) {
    mailState.query.page = Number(page)
    mailState.query.rowsPerPage = Number(rowsPerPage)
  }
  if (!isMobile.value) tableRef.value.requestServerInteraction()
})

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/common/css/loading.sass'
@import 'app/template/epicwin/css/table.sass'

.af-txt-grn
  margin-left: 10px

.modal-dialog-scrollable .modal-body
  overflow-y: auto

.modal-content
  position: relative
  display: -ms-flexbox
  display: flex
  -ms-flex-direction: column
  flex-direction: column
  width: 100% !important
  pointer-events: auto
  background-color: #fff
  background-clip: padding-box
  border: 1px solid rgba(0, 0, 0, 0.2)
  border-radius: 0.3rem
  outline: 0

.msg-pp button.close
  background-color: transparent !important
  box-shadow: none !important
  border: none !important

.msg-in
  float: left
  padding: 20px

.msg-item
  min-width: 300px
  display: grid
  grid-template-columns: repeat(2, 1fr)
  margin-bottom: 20px

.q-card
  background: #021524
  border-radius: 8px
  border: 1px solid #7a18a5

.inbox-layout
  width: 100%
  .d-show
    display: block
  .m-show
    display: none
  +iphone-width
    .d-show
      display: none
    .m-show
      display: block
</style>
