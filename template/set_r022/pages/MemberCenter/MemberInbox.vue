<template>
  <HeaderTitleBack v-if="isLargeTablet" variant="setR022" title-i18n="common.tip.message">
    <q-tab-panels v-model="panel" animated>
      <q-tab-panel :name="MAIL_STATUS.Enums.Active">
        <q-scroll-area @scroll="handleScroll">
          <div v-for="(item, index) in mailState.list" :key="item.id" @click="showInfo(item)" class="mail-row">
            <div class="mail-item">
              <p class="mail-number">{{ index + 1 }}</p>
              <div class="mail-content">
                <p class="title">{{ item.mail_title }}</p>
                <p class="time">{{ dateformat(item.send_at, "YYYY-MM-DD HH:mm:ss") }}</p>
              </div>
            </div>
            <q-separator />
          </div>
          <div class="footer">
            {{ $t("member.mail.noMoreDataToDisplay") }}
          </div>
        </q-scroll-area>
      </q-tab-panel>
    </q-tab-panels>
  </HeaderTitleBack>

  <div v-else class="inbox-area">
    <div class="top-area">
      {{ $t("common.tip.message") }}
    </div>

    <div class="data-table">
      <q-table
        ref="tableRef"
        :rows="mailState.list"
        :rows-per-page-options="[10]"
        :columns="columns"
        :loading="loading"
        row-key="id"
        hide-pagination
        flat
        class="table-list"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template #body="props">
          <q-tr>
            <q-td class="custom-td" key="mail_title" :props="props">
              <span>{{ props.row.mail_title }}</span>
            </q-td>
            <q-td class="custom-td" key="mail_type" :props="props">
              <span>{{ $t(MAIL_TYPE.I18nKeys[props.row.mail_type as MAIL_TYPE.Enums]) }}</span>
            </q-td>

            <q-td class="custom-td" key="send_at" :props="props">
              <span>{{ dateformat(props.row.send_at, "YYYY-MM-DD HH:mm:ss") }}</span>
            </q-td>
            <q-td class="custom-td link underline underline-offset-4" key="mail_body" :props="props">
              <span @click="showInfo(props.row)">{{ $t("member.mail.checkDetails") }}</span>
            </q-td>
          </q-tr>
        </template>
        <template #no-data>
          <div class="no-data-area">
            <img :src="resultImages('history/no-data.png')" alt="" />
            <span>{{ $t("tableHeader.no_data") }}</span>
          </div>
        </template>
      </q-table>
    </div>

    <div class="flex justify-end q-pa-md custom-pagination">
      <q-pagination
        v-model="mailState.query.page"
        :max="totalPage"
        :max-pages="5"
        :boundary-numbers="false"
        @update:model-value="handlePagination"
        direction-links
        flat
        active-design="flat"
        color="deep-grey"
        active-color="blue-8"
        icon-prev="arrow_left"
        icon-next="arrow_right"
      />
    </div>
  </div>

  <q-dialog v-model="modalShow" @hide="initMailDetail" :persistent="!isLargeTablet">
    <q-card v-if="isLargeTablet" class="dialog h5">
      <img :src="memberImg('inbox-message.png')" class="dialog-icon" />
      <q-card-section class="flex flex-col justify-center items-center text-center dialog-content">
        <h2 class="mail-title">{{ mailState.detail.mail_title }}</h2>
        <div v-html="mailState.detail.mail_body" class="mail-body"></div>
      </q-card-section>

      <q-card-actions class="dialog-footer">
        <q-btn :label="$t('common.btn.confirm')" v-close-popup />
      </q-card-actions>
    </q-card>

    <q-card v-else class="dialog pc">
      <q-card-section class="dialog-header">
        <p class="title">{{ $t("member.mail.informationDetails") }}</p>
        <q-btn icon="close" flat v-close-popup class="btn-close"></q-btn>
      </q-card-section>
      <q-card-section class="dialog-body">
        <div class="tips">
          <div class="title">{{ mailState.detail.mail_title }}</div>
          <div class="time">{{ dateformat(mailState.detail.send_at, "YYYY-MM-DD HH:mm:ss") }}</div>
        </div>

        <div class="content" v-html="mailState.detail.mail_body"></div>
      </q-card-section>

      <q-card-actions class="dialog-footer">
        <q-btn :label="$t('common.btn.close')" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import { onMounted, ref, computed } from "vue"
import type * as Response from "src/api/response.type"
import { useMail } from "src/common/composables/useMail"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useQuasar, QScrollAreaProps, QTableProps } from "quasar"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { MAIL_STATUS, MAIL_TYPE } from "src/common/utils/constants"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"

const { memberImg, resultImages } = useSiteImg()
const { mailState, totalPage, getMailList, lazyLoadMailList, getMailDetail, initMailDetail } = useMail()

const tableRef = ref()
const $q = useQuasar()
const { t } = useI18n()
const route = useRoute()
const loading = ref(false)
const modalShow = ref(false)
const { isLargeTablet } = useMediaQuery()
const panel = ref(MAIL_STATUS.Enums.Active)

const columns = computed<QTableProps["columns"]>(() => [
  { name: "mail_title", align: "center", label: t("tableHeader.Headline"), field: "mail_title" },
  { name: "mail_type", align: "center", label: t("tableHeader.type2"), field: "mail_type" },
  { name: "send_at", align: "center", label: t("tableHeader.time"), field: "send_at" },
  { name: "mail_body", align: "center", label: t("tableHeader.operating"), field: "mail_body" }
])

const handlePagination = (page: number) => {
  handleMailList(page, mailState.query.rowsPerPage)
}

const handleMailList = async (page: number, rowsPerPage: number) => {
  if (loading.value) return

  loading.value = true

  await getMailList({ page: page, rowsPerPage: rowsPerPage })

  loading.value = false
}

const handleScroll: QScrollAreaProps["onScroll"] = async (info) => {
  if (info.verticalPercentage > 0.7) {
    await lazyLoadMailList()
  }
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
  if (isLargeTablet.value) {
    mailState.query.page = 1
    mailState.query.rowsPerPage = 15
  }
  handleMailList(mailState.query.page, mailState.query.rowsPerPage)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/reports.scss";
@import "app/template/set_r022/assets/css/button.scss";

.inbox-area {
  width: 100%;
  max-width: 87.5rem;
  padding: 1.4625rem 0 10%;
  margin: 0 auto;

  .top-area {
    width: 100%;
    border-radius: 0.5rem;
    padding: 1.3125rem 1.25rem;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .custom-td {
    &.link {
      color: var(--text-link);
      cursor: pointer;
    }
  }
}

.q-tab-panel {
  padding: 0;
  background: var(--neutral-01);

  .q-scrollarea {
    height: 100dvh;

    .mail-item {
      padding: 0.46875rem 0.75rem;
      display: flex;
      align-items: center;

      .mail-number {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        font-size: 0.875rem;
        background: var(--primary-06);
        border-radius: 50%;
        color: var(--secondary-01);
      }
      .mail-content {
        flex: 1 1 auto;
        padding-left: 1rem;

        .title {
          font-size: 1rem;
          overflow: hidden;
          white-space: nowrap;
        }

        .time {
          color: var(--primary-02);
          font-size: 0.875rem;
        }
      }
    }

    .q-separator {
      border-color: var(--neutral-04);
      height: 0.0625rem;
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.6875rem 0;
      color: var(--secondary-01);
      background: var(--primary-06);
      font-size: 1rem;
    }
  }
}

.dialog {
  &.pc {
    width: 31.4375rem;
    height: 22.125rem;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    padding: 2rem 1.25rem;
    background: var(--neutral-01);
    box-shadow: none;
    word-wrap: break-word;

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.125rem;
      padding: 0;

      .title {
        color: var(--neutral-10);
        font-size: 1.5rem;
      }

      .btn-close {
        color: var(--neutral-09);
        width: 1.5rem;
        height: 1.5rem;
        cursor: pointer;

        :deep(.q-icon) {
          font-weight: 600;
          font-size: 2rem;
        }
      }
    }

    .dialog-body {
      height: 100%;
      padding-top: 2rem 0 0;
      border-top: 1px solid var(--neutral-03);
      flex-wrap: wrap;

      .tips {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.75rem;

        .title {
          font-weight: 600;
          font-size: 1.25rem;
          color: var(--neutral-10);
        }

        .time {
          font-size: 0.875rem;
          color: var(--primary-08);
        }

        .content {
          color: var(--neutral-09);
          font-size: 0.9375rem;
        }
      }
    }

    .dialog-footer {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 2.75rem;
      padding: 0;

      .q-btn {
        width: 100%;
        flex: 1 1 0%;
        text-align: center;
        border-radius: 0.5rem;
        height: 2.75rem;
        font-size: 1.125rem;
        background: var(--primary-01);
        color: var(--text-01);
      }
    }
  }

  &.h5 {
    @apply flex flex-col justify-center items-center;
    border-radius: 0.75rem;
    background: var(--neutral-01);
    width: 88%;
    max-width: 37.5rem;
    box-shadow: none;
    padding: 2.5rem 2.125rem;

    .dialog-icon {
      width: 7.875rem;
      height: 6.4375rem;
      margin-bottom: 1.8125rem;
    }

    .dialog-content {
      width: 100%;
      padding: 0;
    }

    .mail-title {
      color: var(--secondary-01);
      text-align: center;
      margin-bottom: 0.4375rem;
      font-size: 1rem;
      line-height: normal;
    }

    .mail-body {
      width: 100%;
      text-align: center;
      color: var(--primary-02);
      word-wrap: break-word;
      font-size: 0.875rem;
      line-height: normal;
    }

    .dialog-footer {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 2.75rem;
      padding: 0;

      .q-btn {
        width: 100%;
        flex: 1 1 0%;
        text-align: center;
        border-radius: 0.5rem;
        height: 2.75rem;
        font-size: 1.125rem;
        background: var(--primary-01);
        color: var(--text-01);
      }
    }
  }
}
</style>
