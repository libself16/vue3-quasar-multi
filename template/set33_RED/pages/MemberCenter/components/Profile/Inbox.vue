<template>
  <div class="inbox-layout">
    <!-- pc table -->
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
      :loading="loading"
      hide-bottom
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template #body="props">
        <q-tr>
          <q-td key="mail_type" :props="props">
            <span>{{ $t(MAIL_TYPE.I18nKeys[props.row.mail_type as MAIL_TYPE.Enums]) }}</span>
          </q-td>
          <q-td key="mail_title" :props="props">
            <span>{{ props.row.mail_title }}</span>
          </q-td>
          <q-td key="mail_body" :props="props">
            <span @click="showInfo(props.row.id)" v-html="truncatedHtmlContent(props.row.mail_body)"></span>
          </q-td>
          <q-td key="send_at" :props="props">
            <span>{{ dateformat(props.row.send_at, "YYYY-MM-DD HH:mm:ss") }}</span>
          </q-td>
          <q-td key="status" :props="props">
            <span>{{ $t(MAIL_STATUS.I18nKeys[props.row.status as MAIL_STATUS.Enums]) }}</span>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- mobile card -->
    <div v-else class="tranc-table m-show">
      <div class="msg-inbox">
        <ul>
          <li v-for="(item, key) in mailState.list" :key="key">
            <div class="msg-iteam">
              <div class="msg-date">
                <span> {{ dateformat(item.send_at, "YYYY-MM-DD HH:mm:ss") }}</span>
              </div>
              <div class="msg-wrap msg-unread">
                <div class="msg-type">{{ $t(MAIL_TYPE.I18nKeys[item.mail_type]) }}</div>
                <div class="msg-tl">{{ item.mail_title }}</div>
                <div class="msg-cnt">
                  <span v-html="truncatedHtmlContent(item.mail_body)"></span>
                </div>
                <button class="btn-mr" @click="showInfo(item.id)">
                  {{ $t("common.btn.readMore") }}
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- pagination -->
    <div class="flex justify-end mt-7">
      <q-pagination
        v-model="mailState.query.page"
        :max="totalPage"
        direction-links
        push
        color="pagination"
        active-design="push"
        active-color="pagination"
        @update:model-value="handlePagination"
      />
    </div>
  </div>
  <!-- dialog -->
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
            <div>{{ dateformat(mailState.detail.send_at, "YYYY-MM-DD HH:mm:ss") }}</div>
          </div>
          <div class="msg-item">
            <div>{{ $t("modal.type") }}</div>
            <div>{{ $t(MAIL_TYPE.I18nKeys[mailState.detail.mail_type]) }}</div>
          </div>
          <div class="msg-item content">
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
import { onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useWindowSize } from "@vueuse/core"
import { useMail } from "src/common/composables/useMail"
import { MAIL_TYPE, MAIL_STATUS } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"

const { mailState, columns, totalPage, getMailList, getMailDetail, truncatedHtmlContent } = useMail()

const { width } = useWindowSize()
const route = useRoute()
const tableRef = ref()
const loading = ref(false)
let isMobile = ref(false)

const handlePagination = (page: number) => {
  handleMailList(page, mailState.query.rowsPerPage)
}

const handleMailList = async (page: number, rowsPerPage: number) => {
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
  const { page, rowsPerPage } = route.query
  if (route.query.page && route.query.rowsPerPage) {
    mailState.query.page = Number(page)
    mailState.query.rowsPerPage = Number(rowsPerPage)
  }
  handleMailList(mailState.query.page, mailState.query.rowsPerPage)
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
@import 'app/template/set33_RED/assets/css/table.sass'
@import 'app/template/set33_RED/assets/css/pagination.sass'

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
  &.content
    word-break: break-word

.q-card
  background: rgb(121, 15, 15)
  border-radius: 8px
  border: 1px solid #D14444

.inbox-layout
  @apply my-4
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

.msg-pp .modal-content
  background: rgb(121, 15, 15)
  border-radius: 8px
  border: 1px solid #D14444

.swiper-slide img
  background: none

.msg-inbox ul
  padding: 0px
  list-style: none

.msg-wrap
  background: rgb(121, 15, 15)
  border: 1px solid #D14444
  border-radius: 5px
  padding: 15px

.msg-unread .msg-type
  font-weight: bold

.msg-date
  text-align: center
  margin-bottom: 5px

.msg-type
  color: #0c9bd5

.msg-tl
  color: #88c11a
  border-bottom: 1px solid #ffffff36
  padding-bottom: 5px

.msg-inbox
  padding: 10px

.msg-unread .msg-tl
  font-weight: bold

.msg-read .msg-tl
  color: #fff

.msg-inbox ul li
  margin-bottom: 20px

.msg-cnt
  padding-top: 10px
  overflow: hidden
  display: -webkit-box
  -webkit-line-clamp: 2
  line-clamp: 2
  -webkit-box-orient: vertical
  margin-bottom: 10px

.btn-mr
  background: linear-gradient(to bottom, rgba(169, 211, 32, 1) 0%,rgba(56, 131, 18, 1) 100%)
  color: #fff
  box-shadow: inset 0px 0px 3px 2px #79ba18
  border: none
  border-radius: 5px
  margin: 0px auto
  display: block
  padding: 5px 10px

.msg-l:first-child
  color: #52a0d0
</style>
