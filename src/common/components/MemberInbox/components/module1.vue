<template>
  <div class="inbox-area">
    <div class="inbox-content">
      <div class="inbox-title gap-2 flex items-center justify-start">
        {{ $t("menu.my_messages") }}

        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="text-[var(--icon-02)] cursor-pointer hidden phone:!block"
        >
          <path
            d="M15 3.5C15.5523 3.5 16 3.94772 16 4.5V16.5C16 17.0523 15.5523 17.5 15 17.5H5C4.44772 17.5 4 17.0523 4 16.5V4.5C4 3.94772 4.44772 3.5 5 3.5H15ZM6 14.5V15.7002H14V14.5H6ZM6 12.7998H14V11.5996H6V12.7998ZM6 9.7998H14V8.59961H6V9.7998ZM6 6.7998H11V5.59961H6V6.7998Z"
            fill="currentColor"
          />
        </svg>
        <q-menu class="bg-transparent hidden phone:!block" :offset="[-20, 0]">
          <MemberNav module="module2" />
        </q-menu>
      </div>

      <div v-if="isDown.phone" class="mobile-table">
        <q-tab-panels v-if="mailState.list.length" v-model="panel" animated>
          <q-tab-panel :name="MAIL_STATUS.Enums.Active">
            <div v-for="(item, index) in mailState.list" :key="item.id" @click="showInfo(item)" class="mail-row">
              <div class="mail-item">
                <p class="mail-number">{{ index + 1 }}</p>
                <div class="mail-content">
                  <p class="time">{{ dateformat(item.send_at, "YYYY-MM-DD HH:mm:ss") }}</p>
                  <p class="title">{{ item.mail_title }}</p>
                </div>
              </div>

              <div class="arrow-icon">
                <img :src="inboxImg('arrow.svg')" alt="arrow-right" />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
        <div v-else class="no-data-container">
          <img :src="inboxImg('no-data.svg')" alt="no-data" class="no-data-img" />

          <span>{{ $t("tableHeader.noData") }}</span>
        </div>
      </div>

      <q-table
        v-else
        ref="tableRef"
        :rows="mailState.list"
        :rows-per-page-options="[10]"
        :columns="columns"
        row-key="id"
        :loading="loading"
        hide-pagination
        separator="none"
        flat
        class="inbox-table"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
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
            <q-td key="mail_body" :props="props">
              <q-btn flat size="sm" class="detail-btn" @click="showInfo(props.row)">
                {{ $t("member.mail.checkDetails2") }}
              </q-btn>
            </q-td>
          </q-tr>
        </template>
        <template #no-data>
          <div class="no-data-container">
            <img :src="inboxImg('no-data.svg')" alt="no-data" class="no-data-img" />

            <span>{{ $t("tableHeader.noData") }}</span>
          </div>
        </template>
      </q-table>

      <!-- pagination -->
      <q-pagination
        v-if="totalPage"
        v-model="mailState.query.page"
        :max="totalPage"
        :max-pages="5"
        class="custom-pagination"
        color="grey-7"
        direction-links
        @update:model-value="handlePagination"
      />
    </div>
  </div>

  <q-dialog v-model="modalShow" @hide="initMailDetail">
    <q-card class="detail-dialog">
      <q-card-section class="dialog-header">
        <div class="title">{{ $t("member.mail.informationDetails") }}</div>
        <q-btn icon="close" flat v-close-popup class="btn-close" />
      </q-card-section>
      <q-card-section class="dialog-body">
        <div class="tips">
          <div class="title">{{ mailState.detail.mail_title }}</div>
          <div class="time">{{ dateformat(mailState.detail.send_at, "YYYY-MM-DD HH:mm:ss") }}</div>
        </div>
        <div class="content" v-html="mailState.detail.mail_body"></div>
      </q-card-section>
      <q-btn :label="$t('common.btn.confirm')" v-close-popup class="confirm-btn" />
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import type * as Response from "src/api/response.type"
import { useMail } from "src/common/composables/useMail"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { QTableProps } from "quasar"
import { MAIL_STATUS, MAIL_TYPE } from "src/common/utils/constants"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import MemberNav from "src/common/components/MemberNav/Index.vue"

const { t } = useI18n()
const route = useRoute()
const { isDown } = useMediaQuery()
const { mailState, totalPage, getMailList, getMailDetail, initMailDetail } = useMail()
const { inboxImg } = useSiteImg()

const panel = ref(MAIL_STATUS.Enums.Active)
const tableRef = ref()
const loading = ref(false)
const modalShow = ref(false)

const columns = computed<QTableProps["columns"]>(() => [
  { name: "mail_title", align: "center", label: t("tableHeader.Headline"), field: "mail_title" },
  { name: "mail_type", align: "center", label: t("tableHeader.type2"), field: "mail_type" },
  { name: "send_at", align: "center", label: t("tableHeader.time"), field: "send_at" },
  { name: "mail_body", align: "center", label: t("tableHeader.operating"), field: "mail_body" }
])

const handleMailList = async (page: number, rowsPerPage: number) => {
  if (loading.value) return

  loading.value = true

  await getMailList({ page: page, rowsPerPage: rowsPerPage })

  loading.value = false
}

const handlePagination = (page: number) => {
  handleMailList(page, mailState.query.rowsPerPage)
}

const showInfo = async (mail: Response.Mail) => {
  modalShow.value = true
  mail.status = MAIL_STATUS.Enums.Completed
  await getMailDetail(mail.id)
}

onMounted(() => {
  const { page } = route.query
  mailState.query.page = page ? Number(page) : 1
  mailState.query.rowsPerPage = 10
  if (isDown.phone) {
    mailState.query.page = 1
    mailState.query.rowsPerPage = 15
  }
  handleMailList(mailState.query.page, mailState.query.rowsPerPage)
})
</script>
<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.inbox-area {
  .inbox-content {
    background-color: var(--bg-11);
    color: var(--text-01);
    border-radius: 0.5rem;
    padding: 1.25rem;

    @include phone-width {
      background-color: transparent;
      padding: 0;
    }

    .inbox-title {
      color: var(--text-01);
      font-weight: 700;
      font-size: 1.25rem;
      padding-bottom: 0.625rem;

      @include phone-width {
        font-size: 1.25rem;
        margin-bottom: 0.625rem;
        padding: 0;
      }
    }

    .mobile-table {
      :deep(.q-tab-panels) {
        background-color: var(--bg-14);
        border-radius: 0.5rem;

        .q-tab-panel {
          padding: 0;

          .mail-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.4375rem 0.625rem;

            .mail-item {
              display: flex;
              align-items: center;

              .mail-number {
                width: 1.75rem;
                height: 1.75rem;
                font-size: 0.875rem;
                font-weight: 700;
                border-radius: 50%;
                background: var(--bg-12);
                color: var(--text-01);
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 1rem;
              }

              .mail-content {
                .title {
                  font-size: 1rem;
                  font-weight: 700;
                  margin-bottom: 0.25rem;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  color: var(--text-01);
                }
                .time {
                  font-weight: 400;
                  font-size: 0.875rem;
                  color: var(--text-03);
                }
              }
            }

            .arrow-icon {
              background-color: var(--icon-05);
              width: 1.25rem;
              height: 1.25rem;
              border-radius: 0.25rem;
              display: flex;
              align-items: center;
              justify-content: center;

              img {
                width: 0.625rem;
              }
            }
          }
        }
      }

      .no-data-container {
        @apply w-full flex flex-col justify-center items-center py-40;

        span {
          color: var(--text-03);
          margin-top: 1.25rem;
          font-size: 0.875;
          font-weight: 700;
        }

        .no-data-img {
          width: 10rem;
        }
      }
    }

    .inbox-table {
      background-color: var(--bg-11);

      :deep(.q-table) {
        border-radius: 0.75rem;

        thead {
          tr {
            background: var(--bg-13);

            th {
              color: var(--text-03);
              font-size: 0.875rem;
              font-weight: 700;
              padding-top: 0.75rem;
              padding-bottom: 0.75rem;
            }
          }
        }

        tbody {
          background: var(--bg-14);

          td {
            color: var(--text-03);
            font-size: 0.875rem;
            font-weight: 400;
            padding: 1.375rem 0.5rem;

            .detail-btn {
              font-weight: 700;
              font-size: 0.75rem;
              background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%) !important;
              color: var(--btn-text-01) !important;
              padding: 0.625rem;
            }
          }
        }
      }

      .no-data-container {
        @apply w-full flex flex-col justify-center items-center py-40;

        span {
          color: var(--text-03);
          margin-top: 1.25rem;
          font-size: 0.875rem;
          font-weight: 700;
        }

        .no-data-img {
          width: 10rem;
        }
      }
    }

    .custom-pagination {
      margin-top: 0.625rem;
      justify-content: flex-end;

      :deep(.q-pagination__middle) {
        gap: 2px;

        .q-btn {
          background-color: var(--secondary-08);
          color: var(--text-01);
        }
      }

      :deep(.q-btn) {
        border-radius: 0.35rem;
      }

      :deep(.q-icon) {
        color: var(--text-01);
      }

      :deep(.q-btn--standard) {
        background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%) !important;
        color: var(--text-01) !important;

        &::before {
          display: none;
        }
      }
    }
  }
}

.detail-dialog {
  width: 28.75rem;
  background-color: var(--secondary-08);
  color: var(--text-01);
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;

  @include phone-width {
    width: 23.125rem;
  }

  .dialog-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin-bottom: 1rem;
    color: var(--dialog-text-01);
    font-weight: 700;
    font-size: 1.25rem;
    position: relative;

    .btn-close {
      position: absolute;
      right: 0;
      top: -0.25rem;
      width: 1.5rem;
      height: 1.5rem;
      cursor: pointer;
      transition: color 0.2s, background-color 0.2s;

      :deep(.q-icon) {
        font-size: 1.5rem;
      }
    }
  }

  .dialog-body {
    padding: 1rem 0 0;

    .tips {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.625rem;

      .title {
        color: var(--text-01);
        font-weight: 700;
        font-size: 1rem;
      }

      .time {
        color: var(--text-03);
        font-size: 0.875rem;
        font-weight: 400;
      }
    }

    .content {
      color: var(--text-01);
      font-size: 0.875rem;
      font-weight: 400;
    }
  }

  :deep(.q-btn) {
    &.confirm-btn {
      margin-top: 2rem;
      width: 100%;
      background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%) !important;
    }
  }
}
</style>
