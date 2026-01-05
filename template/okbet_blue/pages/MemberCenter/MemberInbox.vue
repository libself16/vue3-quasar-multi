<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" title-i18n="member.mail.messageCenter" variant="blue">
    <div class="inbox-container h5">
      <!-- TODO: 區分已讀未讀 -->
      <!-- <q-tabs v-model="panel" :outside-arrows="false" :mobile-arrows="false">
        <div class="tab-wrapper">
          <q-tab :name="MAIL_STATUS.Enums.Completed">
            {{ $t("member.mail.inbox") }}({{ completedMails.length }})
          </q-tab>
        </div>
        <div class="tab-wrapper">
          <q-tab :name="MAIL_STATUS.Enums.Active"> {{ $t("member.mail.unread") }}({{ unreadMails.length }}) </q-tab>
        </div>
      </q-tabs> -->
      <q-tab-panels v-model="panel" animated>
        <!-- TODO: 區分已讀未讀 -->
        <!-- <q-tab-panel :name="MAIL_STATUS.Enums.Completed">
          <q-scroll-area>
            <div v-for="(item, index) in completedMails" :key="item.id" @click="showInfo(item)" class="mail-row">
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
        <q-tab-panel :name="MAIL_STATUS.Enums.Active">
          <q-scroll-area @scroll="handleScroll">
            <div v-for="(item, index) in unreadMails" :key="item.id" @click="showInfo(item)" class="mail-row">
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
        </q-tab-panel> -->
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
    </div>
  </HeaderTitleBack>
  <div v-else class="inbox-container pc">
    <div class="header">
      <q-btn class="inbox-title hide-hover" flat :to="{ name: 'memberProfile' }">
        <q-icon name="arrow_back" class=""></q-icon>
        {{ $t("member.mail.myMessages") }}
      </q-btn>
      <div class="flex">
        <div class="flex items-center justify-start">
          <q-btn rounded flat icon="mail" class="btn-mail" color="white"></q-btn>
        </div>
        <q-btn v-if="isKycEnabled" rounded flat class="top-btn btn-kyc custom-btn" :to="{ name: 'MemberKyc' }">
          <img :src="svgIcon('icon_kyc')" />
          {{ $t("member.kyc.kyc_status") }}
        </q-btn>
      </div>
    </div>
    <q-table
      ref="tableRef"
      :rows="mailState.list"
      :rows-per-page-options="[10]"
      :columns="columns"
      row-key="id"
      :loading="loading"
      hide-pagination
      separator="none"
      flat
    >
      <template v-slot:loading>
        <q-inner-loading showing />
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
          <q-td key="mail_body" :props="props" class="underline text-primary underline-offset-4">
            <span @click="showInfo(props.row)">{{ $t("member.mail.checkDetails") }}</span>
          </q-td>
        </q-tr>
      </template>
      <template #no-data>
        <div class="no-data-container">
          <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
          <span>{{ $t("tableHeader.no_data") }}</span>
        </div>
      </template>
    </q-table>
    <!-- pagination -->
    <div class="flex justify-end q-pa-md custom-pagination">
      <q-pagination
        v-model="mailState.query.page"
        :max="totalPage"
        @update:model-value="handlePagination"
        direction-links
        flat
        active-design="flat"
        color="pagination"
        active-color="active-pagination"
        icon-prev="arrow_left"
        icon-next="arrow_right"
      />
    </div>
  </div>

  <!-- dialog -->
  <q-dialog v-model="modalShow" @hide="initMailDetail" :persistent="!$q.platform.is.mobile">
    <q-card v-if="$q.platform.is.mobile" class="dialog h5">
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
      <q-btn icon="close" flat v-close-popup class="btn-close"></q-btn>
      <q-card-section class="dialog-header">
        <q-icon name="fa-solid fa-calendar"></q-icon>
        <p class="title">{{ $t("member.mail.informationDetails") }}</p>
      </q-card-section>
      <q-card-section class="dialog-body">
        <div class="tips">
          <div class="title">{{ mailState.detail.mail_title }}</div>
          <div class="time">{{ dateformat(mailState.detail.send_at, "YYYY-MM-DD HH:mm:ss") }}</div>
        </div>
        <div class="content" v-html="mailState.detail.mail_body"></div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue"
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import { useQuasar, QScrollAreaProps, QTableProps } from "quasar"
import { useSiteImg } from "app/template/okbet_blue/hooks/useSiteImg"
import { useMail } from "src/common/composables/useMail"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLogo } from "src/common/composables/useLogo"
import { MAIL_STATUS, MAIL_TYPE } from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import type * as Response from "src/api/response.type"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"

const { isKycEnabled } = useUserInfo()
const { memberImg, svgIcon } = useSiteImg()
const { mailState, totalPage, getMailList, lazyLoadMailList, getMailDetail, initMailDetail, truncatedHtmlContent } =
  useMail()

const $q = useQuasar()
const route = useRoute()
const { t } = useI18n()
const { getWideLogo } = useLogo()
const tableRef = ref()
const loading = ref(false)
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

const modalShow = ref(false)
const showInfo = async (mail: Response.Mail) => {
  modalShow.value = true
  mail.status = MAIL_STATUS.Enums.Completed
  await getMailDetail(mail.id)
}

onMounted(() => {
  const { page } = route.query
  mailState.query.page = page ? Number(page) : 1
  mailState.query.rowsPerPage = 10
  if ($q.platform.is.mobile) {
    mailState.query.page = 1
    mailState.query.rowsPerPage = 15
  }
  handleMailList(mailState.query.page, mailState.query.rowsPerPage)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blue/assets/css/_variable.sass";
@import "app/template/okbet_blue/assets/css/button.scss";

.inbox-container.h5 {
  :deep(.q-tab-panels) {
    background: $bg-dark;
  }
  .q-tabs {
    border-bottom: 1px solid $text-light-secondary;
    .tab-wrapper {
      @apply flex justify-center items-center;
      width: 50%;
      height: 5rem;
      padding: 0 120px;
      .q-tab {
        height: 100%;
        font-size: 2rem;
        padding: 0;
        color: rgb(167, 178, 196);
        text-transform: capitalize;
        :deep(.q-tab__indicator) {
          background-color: #1677ff;
        }
        &.q-tab--active {
          color: rgb(65, 70, 85);
        }
      }
    }
  }

  .q-tab-panel {
    padding: 0;
    .q-scrollarea {
      height: calc(100dvh - 90px);
      .mail-item {
        @apply flex items-center px-4 py-2;
        .mail-number {
          flex-shrink: 0;
          display: block;
          width: 3.375rem;
          height: 3.375rem;
          line-height: 3.375rem;
          font-size: 1.75rem;
          background-color: $bg-secondary;
          border-radius: 50%;
          text-align: center;
          color: $text-light-secondary;
        }
        .mail-content {
          flex: 1 1 auto;
          min-width: 0px;
          margin-top: 6px;
          margin-bottom: 6px;
          padding-left: 1.5rem;
          .title {
            font-size: 1.75rem;
            line-height: 2.5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 400;
            letter-spacing: 0.00938em;
            white-space: nowrap;
            display: block;
          }
          .time {
            margin: 0px;
            font-weight: 400;
            letter-spacing: 0.01071em;
            display: block;
            padding-top: 0.25rem;
            line-height: 2.25rem;
            color: rgb(167, 178, 196);
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 1.5rem;
            font-family: "PingFang SC" !important;
          }
        }
      }
      .q-separator {
        flex-shrink: 0;
        border-width: 0px;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.12);
        margin: 0px 1.75rem;
        height: 0.57px;
      }
      .footer {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.25rem 0px;
        color: $text-light-secondary;
        background-color: $bg-secondary;
        font-size: 1.5rem;
      }
    }
  }

  @include phone-width {
    .q-tabs {
      .tab-wrapper {
        height: 3.3125rem;
        padding: 0 90px;
        .q-tab {
          font-size: 1rem;
        }
      }
    }

    .q-tab-panel {
      .q-scrollarea {
        height: calc(100dvh - 46px);
        .mail-item {
          .mail-number {
            width: 1.6875rem;
            height: 1.6875rem;
            line-height: 1.6875rem;
            font-size: 1rem;
          }
          .mail-content {
            padding-left: 0.75rem;
            .title {
              font-size: 1rem;
              line-height: 1.25rem;
            }
            .time {
              padding-top: 0.25rem;
              line-height: 1.125rem;
              font-size: 0.875rem;
            }
          }
        }
        .q-separator {
          margin: 0px 0.875rem;
        }
        .footer {
          padding: 0.625rem 0px;
          font-size: 0.875rem;
        }
      }
    }
  }
}

.dialog.h5 {
  @apply flex flex-col justify-center items-center;
  border-radius: 1.25rem;
  margin: 0px;
  width: 88%;
  max-width: 37.5rem;
  background: $bg-dark-secondary;
  .dialog-icon {
    width: 40%;
    margin: 50px 0 40px;
  }
  .dialog-content {
    width: 100%;
  }
  .mail-title {
    padding: 0px;
    margin: 0px 0px 1rem;
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 2.75rem;
    text-transform: capitalize;
    color: $text-light-secondary;
    text-align: center;
  }
  .mail-body {
    padding: 0px 3.125rem 2rem;
    text-align: center;
    font-size: 1.75rem;
    font-weight: 400;
    line-height: 2.75rem;
    text-transform: capitalize;
    color: $text-light-secondary;
    width: 100%;
    word-wrap: break-word;
  }
  .dialog-footer {
    width: 100%;
    padding: 0px 3.125rem 3.125rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 0 0 auto;
    .q-btn {
      width: 100%;
      flex: 1 1 0%;
      border-radius: 1rem;
      height: 5.5rem;
      text-align: center;
      font-size: 2.25rem;
      font-weight: 400;
      text-transform: capitalize;
      background: $bg-light;
      color: $text-light-secondary;
    }
  }
  @include phone-width {
    border-radius: 0.625rem;
    .mail-title {
      margin: 0px 0px 0.5rem;
      font-size: 1.125rem;
      line-height: 1.375rem;
    }
    .mail-body {
      padding: 0px 1.5625rem 1rem;
      font-size: 0.875rem;
      line-height: 1.375rem;
    }
    .dialog-footer {
      padding: 0px 1.5625rem 1.5625rem;
      .q-btn {
        border-radius: 0.5rem;
        height: 2.75rem;
        font-size: 1.125rem;
      }
    }
  }
}

.inbox-container.pc {
  padding: 70px 50px 30px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 100%;
    max-height: 54px;
    .inbox-title {
      font-family: OpenSans;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-size: 40px;
      color: $text-light-secondary;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      text-transform: none;
      font-weight: 800;
      .q-icon {
        font-size: 36px;
        margin-right: 12px;
      }
    }
    .btn-mail {
      @apply relative;
      min-width: 5.375rem;
      background-color: $bg-light;
      height: 1.875rem;
      min-height: 1.875rem;
      text-transform: capitalize;
      :deep(.q-icon) {
        font-size: 1.25rem;
        color: $bg-dark-secondary;
      }
    }
  }
  .q-table__container {
    @apply relative w-full;
    padding: 30px 20px;
    font-weight: 400;
    font-size: 16px;
    border: 2px solid $border-dark-secondary;
    background-color: $bg-dark-secondary;
    border-radius: 14px;
    margin-top: 25px;
    text-align: left;
    cursor: pointer;
    :deep(.q-table) {
      color: $text-light-secondary;
      thead {
        tr {
          th {
            font-size: 1rem;
            font-weight: 400;
            &:first-child {
              text-align: left;
            }
          }
        }
      }
      tbody {
        tr {
          td {
            font-size: 0.875rem;
            &:first-child {
              text-align: left;
            }
            &::before {
              background-color: transparent !important;
            }
          }
          &:nth-of-type(2n + 1) {
            background-color: $bg-dark-secondary;
          }
        }
      }
    }
    :deep(.q-table__bottom) {
      .no-data-container {
        @apply w-full flex flex-col justify-center items-center py-40;
        border-top: 1px solid $border-dark;
        img {
          width: 120px;
          height: auto;
        }
        span {
          color: $text-tertiary;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }
  .q-pagination {
    :deep(.q-btn) {
      background-color: $pagination-color;
      color: $text-light-secondary;
      &.text-active-pagination {
        background: $bg-light;
        color: $bg-light-text;
      }
    }
  }
}

.dialog.pc {
  width: 600px;
  max-width: 600px;
  min-height: 319px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  background: $bg-dark-secondary;
  color: $text-light-secondary;
  position: relative;
  pointer-events: auto;
  font-size: 14px;
  line-height: 1.5714285714285714;
  word-wrap: break-word;
  .btn-close {
    position: absolute;
    top: 12px;
    inset-inline-end: 12px;
    padding: 0;
    line-height: 1;
    text-decoration: none;
    background: transparent;
    border-radius: 4px;
    width: 32px;
    height: 32px;
    border: 0;
    outline: 0;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
    :deep(.q-icon) {
      font-weight: 600;
      font-size: 2rem;
    }
  }
  .dialog-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    color: $text-light-secondary;
    .q-icon {
      font-size: 1.75rem;
    }
    .title {
      font-size: 20px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .dialog-body {
    height: 100%;
    padding-top: 20px;
    margin-bottom: 10px;
    border-top: 1px solid $border-dark;
    font-size: 14px;
    flex-wrap: wrap;
    .tips {
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      justify-content: space-between;
      margin-bottom: 15px;
      .title {
        font-weight: 600;
        font-size: 18px;
        line-height: 20px;
      }
      .time {
        margin: 5px 0px;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
}

.custom-btn {
  text-transform: none;
}

.custom-btn img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.btn-kyc {
  margin-left: 10px;
  background: none !important;
  border: 1px solid $bg-light;
  line-height: 0;
  color: $bg-light;
}
</style>
