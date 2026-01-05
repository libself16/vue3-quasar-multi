<template>
  <div class="inbox-wrapper common-page-wrapper">
    <div class="page-title">{{ $t("menu.inbox") }}</div>
    <section class="common-page-container">
      <div v-if="mailState.list.length > 0" class="mail-list-wrapper">
        <MobileMailList v-if="isLargeTablet" :mailList="mailState.list" @show-info="showInfo" />
        <DesktopMailList v-else :mailList="mailState.list" @show-info="showInfo" />
      </div>
      <div v-else class="no-data">
        <p class="no-data-text">
          {{ $t("tableHeader.no_data") }}
        </p>
      </div>
    </section>
    <q-dialog v-model="inboxDetailShow">
      <q-card class="modal-card">
        <q-card-section class="row items-center q-pa-xs">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="row items-center q-pt-none">
          <div class="w-full">
            <div class="flex mb-[1.25rem]">
              <div class="w-2/5 pl-[.625rem]">
                <div class="modal-title">{{ $t("modal.title") }}</div>
              </div>
              <div class="w-3/5">
                <div>{{ mailState.detail.mail_title }}</div>
              </div>
            </div>
            <div class="flex mb-[1.25rem]">
              <div class="w-2/5 pl-[.625rem]">
                <div class="modal-title">{{ $t("modal.time") }}</div>
              </div>
              <div class="w-3/5">
                <div>{{ dateformat(mailState.detail.send_at, "YYYY-MM-DD HH:mm:ss") }}</div>
              </div>
            </div>
            <div class="flex mb-[1.25rem]">
              <div class="w-2/5 pl-[.625rem]">
                <div class="modal-title">{{ $t("modal.type") }}</div>
              </div>
              <div class="w-3/5">
                <div>{{ $t(MAIL_TYPE.I18nKeys[mailState.detail.mail_type]) }}</div>
              </div>
            </div>
            <div class="flex mb-[1.25rem]">
              <div class="w-2/5 pl-[.625rem]">
                <div class="modal-title">{{ $t("modal.content") }}</div>
              </div>
              <div class="w-3/5">
                <div v-html="mailState.detail.mail_body"></div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <Pagination v-model="mailState.query.page" :total-pages="totalPage" @change="handlePagination" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useQuasar } from "quasar"
import { useMail } from "src/common/composables/useMail"
import { MAIL_TYPE } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useAuth } from "src/common/hooks/useAuth"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import Pagination from "app/template/set_DBO88/components/Pagination/Index.vue"
import DesktopMailList from "./DesktopMailList.vue"
import MobileMailList from "./MobileMailList.vue"

const route = useRoute()
const $q = useQuasar()
const { isLogin } = useAuth()
const { mailState, totalPage, getMailList, getMailDetail } = useMail()
const loading = ref(false)
const inboxDetailShow = ref(false)
const { isLargeTablet } = useMediaQuery()

const handlePagination = (page: number) => {
  handleMailList(page, mailState.query.rowsPerPage)
}

const handleMailList = async (page: number, rowsPerPage: number) => {
  if (loading.value) return

  loading.value = true

  await getMailList({ page: page, rowsPerPage: rowsPerPage })

  loading.value = false
}

const showInfo = async (id: number) => {
  inboxDetailShow.value = true
  await getMailDetail(id)
}

const initMailList = async () => {
  $q.loading.show()
  await handleMailList(mailState.query.page, mailState.query.rowsPerPage)
  $q.loading.hide()
}

onMounted(() => {
  const { page = "1", rowsPerPage = "20" } = route.query

  mailState.query.page = Number(page) || 1
  mailState.query.rowsPerPage = Number(rowsPerPage) || 20

  if (isLogin.value) {
    initMailList()
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";
@import "app/template/set_DBO88/assets/css/common.scss";
@import "app/template/set_DBO88/assets/css/text.scss";

.inbox-wrapper {
  .mail-list-wrapper {
    @apply mb-[.9375rem];
  }

  .no-data {
    .no-data-text {
      @apply text-center font-bold text-2xl;
      color: $primary-color;
    }
  }
}

.modal-card {
  @apply min-w-[31.25rem];
  background: #14181e;
  color: $text-white;
  border: 1px solid $primary-color;

  @include iphone-width {
    @apply min-w-full;
  }

  .modal-title {
    @apply font-bold;
    color: $primary-color;
  }
}
</style>
