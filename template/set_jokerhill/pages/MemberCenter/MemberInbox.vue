<template>
  <BannerMember />
  <div class="member-inbox-layout">
    <div class="member-inbox-content">
      <MemberNav />
      <div class="form-title-content mb-5">
        <img :src="svgIcon('member-title-icon')" />
        <div class="title">{{ $t("menu.inbox") }}</div>
      </div>
      <div v-if="!isMobile" class="custom-table">
        <q-table
          square
          hide-pagination
          row-key="id"
          ref="tableRef"
          :rows="mailState.list"
          :rows-per-page-options="[20]"
          :columns="columns"
          :loading="loading"
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
              <q-td key="mail_body" :props="props" class="cursor-pointer">
                <span @click="showInfo(props.row.id)" v-html="truncatedHtmlContent(props.row.mail_body)"></span>
              </q-td>
              <q-td key="send_at" :props="props">
                <span>{{ dateformat(props.row.send_at, "YYYY-MM-DD HH:mm:ss") }}</span>
              </q-td>
              <q-td key="status" :props="props">
                <span :class="{ 'text-red-600': props.row.status === MAIL_STATUS.Enums.Active }">{{
                  $t(MAIL_STATUS.I18nKeys[props.row.status as MAIL_STATUS.Enums])
                }}</span>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div v-else>
        <div class="member-inbox-content-mb">
          <div class="content" v-for="(item, index) in mailState.list" :key="index" @click="showInfo(item.id)">
            <img :src="svgIcon(`mail-type-${item.mail_type}`)" />
            <div class="content-item">
              <span class="title">{{ item.mail_title }}</span>
              <div>
                <span class="member" v-html="item.mail_body"></span>
              </div>
              <span class="date">{{ dateformat(item.send_at, "YYYY-MM-DD HH:mm:ss") }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="q-pa-md flex justify-end custom-pagination">
        <q-pagination
          v-model="mailState.query.page"
          :max="totalPage"
          direction-links
          color="blue"
          @update:model-value="handlePagination"
        />
      </div>
    </div>
  </div>
  <!-- dialog -->
  <q-dialog v-model="modalShow">
    <q-card class="q-light">
      <q-card-section class="row items-center">
        <div class="form-title-content !w-auto md:pl-4">
          <img :src="svgIcon('member-title-icon')" />
          <div class="title">{{ $t("menu.inbox") }}</div>
        </div>
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          class="absolute right-4 md:right-8 md:top-9 top-4 text-xs bg-black/30 text-white"
        />
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
        <q-btn flat :label="$t('modal.confirm')" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import BannerMember from "app/template/set_jokerhill/components/BannerMember.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useMail } from "src/common/composables/useMail"
import { MAIL_STATUS, MAIL_TYPE } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import MemberNav from "../../components/MemberNav.vue"

const { svgIcon } = useSiteImg()
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
@import '../../assets/css/table.sass'
@import "../../assets/css/form.sass"

.custom-table
  @apply p-10 text-white rounded-lg
  background: #fff
  :deep(.q-table__card)
    box-shadow: none


.member-inbox-layout


.member-inbox-content
  max-width: 62.5rem
  margin-left: auto
  margin-right: auto
  padding-top: 6rem
  +iphone-width
    padding-top: 0
  .carousel
    .carousel__viewport
      li
        padding-right: .625rem
.unread
  color: red
.amount
  color: #6FCF97
.member-inbox-content-mb
  width: 100%
  margin: 1rem auto
  padding: 1rem 1.25rem
  background: #fff
  border-radius: .5rem
  overflow: scroll
  scrollbar-width: none
  ::-webkit-scrollbar
    display: none
  .content
    +setFlex
    color: rgba(20, 20, 20, 0.40)
    // margin-bottom: .5rem
    padding: 0.5rem 0
    border-bottom: 1px solid rgba(98, 136, 210, 0.20)
    cursor: pointer
    &:last-child
      border-bottom: 0px
    img
      width: 20%
      max-width: 80px
      height: auto
      margin-right: 1rem
    .content-item
      +setFlex(start, start)
      flex-direction: column
      width: 70%
      .title
        font-size: 1rem
        font-weight: 900
        margin-bottom: .3125rem
      .member, .date, .amount
        font-size: .75rem
      .member
        color: rgba(20, 20, 20, 0.40)
        font-weight: 700
      .date
        color: rgba(#fff, .15)
        margin-top: .3125rem

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

.msg-item
  min-width: 18.75rem
  color: rgba(20, 20, 20, 0.6)
  display: grid
  grid-template-columns: 1fr 2fr
  margin-bottom: 1.25rem
  padding-left: 1.25rem
  padding-right: 1.25rem
  word-break: break-all
</style>
