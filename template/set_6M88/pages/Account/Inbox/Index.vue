<template>
  <HeaderTitleBack titleI18n="menu.inbox" v-bind="HTBConfig">
    <div class="inbox-wrapper p-[10px]">
      <div v-if="mailState.list.length > 0" class="mb-[15px]">
        <ul class="max-h-[80vh] overflow-y-auto">
          <li v-for="(mail, key) in mailState.list" :key="key" class="mb-[20px]">
            <span class="flex justify-center mb-[5px]">{{ dateformat(mail.send_at, "YYYY/MM/DD HH:mm:ss") }}</span>
            <div class="mail-item p-[15px]">
              <span class="mail-type">{{ $t(MAIL_TYPE.I18nKeys[mail.mail_type]) }}</span>
              <div class="mail-title flex" :class="{ 'mail-unread': mail.status === MAIL_STATUS.Enums.Active }">
                <span class="mr-1">{{ dateformat(mail.send_at, "YYYY/MM/DD") }}</span>
                <span>{{ mail.mail_title }}</span>
              </div>
              <div class="mail-content py-[10px]">
                <span v-html="truncatedHtmlContent(mail.mail_body)"></span>
              </div>
              <div class="flex w-full justify-center">
                <button class="btn-read-more" @click="showInfo(mail.id)">
                  {{ $t("common.btn.readMore") }}
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="no-data">
        <p class="text-center text-yellow-primary">
          {{ $t("tableHeader.no_data") }}
        </p>
      </div>
      <q-dialog v-model="modalShow">
        <q-card class="modal-card">
          <q-card-section class="row items-center q-pa-xs">
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="row items-center q-pt-none">
            <div class="w-full">
              <div class="flex mb-[20px]">
                <div class="w-2/5 pl-[10px]">
                  <div class="modal-title">{{ $t("modal.title") }}</div>
                </div>
                <div class="w-3/5">
                  <div>{{ mailState.detail.mail_title }}</div>
                </div>
              </div>
              <div class="flex mb-[20px]">
                <div class="w-2/5 pl-[10px]">
                  <div class="modal-title">{{ $t("modal.time") }}</div>
                </div>
                <div class="w-3/5">
                  <div>{{ dateformat(mailState.detail.send_at, "YYYY-MM-DD HH:mm:ss") }}</div>
                </div>
              </div>
              <div class="flex mb-[20px]">
                <div class="w-2/5 pl-[10px]">
                  <div class="modal-title">{{ $t("modal.type") }}</div>
                </div>
                <div class="w-3/5">
                  <div>{{ $t(MAIL_TYPE.I18nKeys[mailState.detail.mail_type]) }}</div>
                </div>
              </div>
              <div class="flex mb-[20px]">
                <div class="w-2/5 pl-[10px]">
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
  </HeaderTitleBack>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useMail } from "src/common/composables/useMail"
import { useRoute } from "vue-router"
import { useQuasar } from "quasar"
import { MAIL_TYPE, MAIL_STATUS } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useHTBConfig } from "app/template/set_6M88/hooks/useHTBConfig"
import Pagination from "../../../components/Pagination/Index.vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"

const { mailState, totalPage, getMailList, getMailDetail, truncatedHtmlContent } = useMail()
const route = useRoute()

const $q = useQuasar()
const loading = ref(false)
const modalShow = ref(false)
const { HTBConfig } = useHTBConfig()

const handlePagination = (page: number) => {
  handleMailList(page, mailState.query.rowsPerPage)
}

const handleMailList = async (page: number, rowsPerPage: number) => {
  if (loading.value) return

  loading.value = true
  $q.loading.show()

  await getMailList({ page: page, rowsPerPage: rowsPerPage })

  loading.value = false
  $q.loading.hide()
}

const showInfo = async (id: number) => {
  modalShow.value = true
  await getMailDetail(id)
}

onMounted(() => {
  const { page = "1", rowsPerPage = "20" } = route.query

  mailState.query.page = Number(page) || 1
  mailState.query.rowsPerPage = Number(rowsPerPage) || 20

  handleMailList(mailState.query.page, mailState.query.rowsPerPage)
})
</script>

<style lang="scss" scoped>
@import "../../../assets/css/variable.scss";
@import "../../../assets/css/main.scss";

.mail-item {
  background: transparent;
  border: 0.0625rem solid $primary;
  border-radius: 0.3125rem;

  .mail-type {
    color: $secondary;
    font-weight: bold;
  }

  .mail-unread {
    color: #88c11a;
    font-weight: bold;
  }

  .mail-title {
    @apply font-bold;
    color: $primary;
  }
}

.modal-card {
  @apply w-[425px] min-h-[auto];
  border-radius: 0.5625rem;
  border: 0.0625rem solid $secondary;
}

.modal-title {
  color: $primary;
}

.btn-read-more {
  @apply text-black justify-center items-center cursor-pointer;
  background: $gradient-to-bottom;
  border-radius: 0.3125rem;
  padding: 0.3125rem 0.625rem;

  &:hover {
    @apply text-white;
  }
}
</style>
