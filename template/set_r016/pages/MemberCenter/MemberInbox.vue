<template>
  <div class="inbox-wrapper">
    <BackBtn />
    <div class="inbox-content">
      <h2 class="inbox-title">{{ $t("menu.inbox") }}</h2>
      <q-table
        v-if="isDesktop"
        square
        hide-pagination
        row-key="id"
        ref="tableRef"
        :rows="mailState.list"
        :rows-per-page-options="[10]"
        :columns="columns"
        :loading="isLoading"
        class="custom-table"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="red" />
        </template>
        <template #body="props">
          <q-tr>
            <q-td key="mail_title" :props="props">
              <span>{{ props.row.mail_title }}</span>
            </q-td>
            <q-td key="mail_type" :props="props">
              <span>{{ $t(MAIL_TYPE.I18nKeys[props.row.mail_type as MAIL_TYPE.Enums]) }}</span>
            </q-td>
            <q-td key="send_at" :props="props">
              <span>{{ dateformat(props.row.send_at, "YYYY-MM-DD HH:mm:ss") }}</span>
            </q-td>
            <q-td key="mail_body" :props="props" class="cursor-pointer">
              <span @click="showInfo(props.row.id)" v-html="truncatedHtmlContent(props.row.mail_body, 61)"></span>
            </q-td>
          </q-tr>
        </template>
        <template #no-data>
          {{ $t("tableHeader.no_data") }}
        </template>
      </q-table>
      <div v-else class="inbox-list">
        <template v-if="mailState.list">
          <div class="inbox-row" v-for="(item, index) in mailState.list" :key="index" @click="showInfo(item.id)">
            <q-img :src="svgIcon(`mail-type-${item.mail_type}`)" loading="lazy" class="inbox-icon" />
            <div class="inbox-item">
              <div class="inbox-item-type">{{ $t(MAIL_TYPE.I18nKeys[item.mail_type]) }}</div>
              <div class="inbox-item-title">{{ item.mail_title }}</div>
              <div class="inbox-item-body" v-html="truncatedHtmlContent(item.mail_body, 58)"></div>
              <div class="inbox-date">{{ dateformat(item.send_at, "YYYY-MM-DD HH:mm:ss") }}</div>
            </div>
          </div>
        </template>
        <div v-else class="mobile-no-data">{{ $t("tableHeader.no_data") }}</div>
      </div>

      <div v-if="totalPage > 1" class="custom-pagination">
        <q-pagination
          v-model="mailState.query.page"
          :max="totalPage"
          direction-links
          icon-prev="fa-solid fa-caret-left"
          icon-next="fa-solid fa-caret-right"
          active-color="pagination-active"
          @update:model-value="handlePagination"
        />
      </div>
    </div>
  </div>

  <BaseDialog
    v-model="modalShow"
    :title="$t(MAIL_TYPE.I18nKeys[mailState.detail.mail_type])"
    useFooter
    :footerBtnTitle="$t('modal.confirm')"
    @footerBtnClick="handleDialogBtnClick"
    @close-dialog="initMailDetail"
  >
    <div class="inbox-detail">
      <div class="inbox-detail-date">{{ dateformat(mailState.detail.send_at, "YYYY-MM-DD HH:mm:ss") }}</div>
      <div class="inbox-detail-title">{{ mailState.detail.mail_title }}</div>
      <div class="inbox-detail-body" v-html="mailState.detail.mail_body"></div>
    </div>
  </BaseDialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue"
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import { QTableProps } from "quasar"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useMail } from "src/common/composables/useMail"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { MAIL_TYPE } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import BackBtn from "app/template/set_r016/components/Button/Back.vue"
import BaseDialog from "app/template/set_r016/components/Dialog/BaseDialog.vue"

const route = useRoute()
const { t } = useI18n()

const { svgIcon } = useSiteImg()
const { isLoading, mailState, totalPage, getMailList, getMailDetail, truncatedHtmlContent, initMailDetail } = useMail()
const { isDesktop } = useMediaQuery()

const tableRef = ref()

const columns = computed<QTableProps["columns"]>(() => [
  { name: "mail_title", align: "center", label: t("tableHeader.title"), field: "mail_title" },
  { name: "mail_type", align: "center", label: t("tableHeader.type"), field: "mail_type" },
  { name: "send_at", align: "center", label: t("tableHeader.dateAndTime"), field: "send_at" },
  { name: "mail_body", align: "center", label: t("tableHeader.content"), field: "mail_body" }
])

const handlePagination = (page: number) => {
  handleMailList(page, mailState.query.rowsPerPage)
}

const handleMailList = async (page: number, rowsPerPage: number) => {
  if (isLoading.value) return

  await getMailList({ page: page, rowsPerPage: rowsPerPage })
}

const modalShow = ref(false)
const showInfo = async (id: number) => {
  modalShow.value = true
  await getMailDetail(id)
}

const handleDialogBtnClick = () => {
  modalShow.value = false
  initMailDetail()
}

onMounted(() => {
  const { page, rowsPerPage } = route.query
  if (route.query.page && route.query.rowsPerPage) {
    mailState.query.page = Number(page)
    mailState.query.rowsPerPage = Number(rowsPerPage)
  }
  mailState.query.rowsPerPage = 10
  handleMailList(mailState.query.page, mailState.query.rowsPerPage)
})
</script>
<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/table.scss";

.inbox-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;

  @include phone-width {
    margin: 0;
    padding: 0.625rem 0.375rem;
  }

  .inbox-content {
    margin-top: 1.25rem;
    padding: 3.75rem;
    background-color: $primary07;
    color: $neutral01;
    border-radius: 0.625rem;

    @include phone-width {
      margin-top: 0.625rem;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .inbox-title {
      @include fontStyle(1.625rem);
      color: $secondary03;
    }

    .inbox-list {
      @apply flex flex-col gap-5 mt-5;

      .inbox-row {
        @apply flex items-center;
        gap: 0.625rem;

        .inbox-icon {
          width: 2.625rem;
          height: 2.625rem;
        }

        .inbox-item {
          max-width: calc(100vw - 7.75rem);
          .inbox-item-type {
            @include fontStyle(0.625rem, 400);
            color: $primary02;
            padding-bottom: 0.0625rem;
          }
          .inbox-item-title {
            @include fontStyle();
            color: $neutral01;
            padding-bottom: 0.125rem;
          }
          .inbox-item-body {
            @include fontStyle(0.75rem, 400);
            color: $neutral04;
            padding-bottom: 0.625rem;
          }
          .inbox-date {
            @include fontStyle(0.625rem, 400);
            color: $neutral06;
            padding-bottom: 0.0625rem;
          }
        }
      }
    }
  }
}

.inbox-detail {
  @apply flex flex-col;
  @include fontStyle();
  gap: 0.375rem;
  color: $neutral09;
  min-height: 9.125rem;

  .inbox-detail-date {
    @include fontStyle(0.875rem, 400);
    color: $neutral09;
  }
}
</style>
