import { useQuasar, QTableProps } from "quasar"
import { mailDetail, mailList } from "src/api/mail"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useApi } from "src/common/hooks/useApi"
import { MAIL_STATUS, MAIL_TYPE } from "src/common/utils/constants"
import { reactive, computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useEnv } from "src/common/hooks/useEnv"

interface MailState {
  list: Response.MailList
  detail: Response.MailDetail
  pagination: Response.Pagination
  query: Response.MailQuery
}

export function useMail() {
  const $q = useQuasar()
  const router = useRouter()
  const { t } = useI18n()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL, VITE_APP_BASE_API } = envData()

  const columns = computed<QTableProps["columns"]>(() => [
    { name: "mail_type", align: "center", label: t("tableHeader.type"), field: "mail_type" },
    { name: "mail_title", align: "center", label: t("tableHeader.title"), field: "mail_title" },
    { name: "mail_body", align: "center", label: t("tableHeader.content"), field: "mail_body" },
    { name: "send_at", align: "center", label: t("tableHeader.dateAndTime"), field: "send_at" },
    { name: "status", align: "center", label: t("tableHeader.status"), field: "status" }
  ])

  const unreadMails = computed(() => mailState.list.filter((e) => e.status === MAIL_STATUS.Enums.Active))
  const completedMails = computed(() => mailState.list.filter((e) => e.status === MAIL_STATUS.Enums.Completed))

  const isLoading = ref(false)
  const mailState: MailState = reactive({
    list: [],
    detail: {
      id: 0,
      mail_type: MAIL_TYPE.Enums.Promotion,
      mail_title: "",
      mail_body: "",
      send_at: ""
    },
    pagination: {
      total: 0,
      offset: 0,
      size: 20
    },
    query: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 20
    }
  })

  const totalPage = computed(() => {
    return Math.ceil(mailState.query.rowsNumber / mailState.query.rowsPerPage)
  })

  async function getMailList(query: { page: number; rowsPerPage: number }, isLazyLoad?: boolean) {
    mailState.query.page = query.page
    mailState.query.rowsPerPage = query.rowsPerPage

    const offset = mailState.query.page ? (mailState.query.page - 1) * mailState.query.rowsPerPage : 0
    const payload: Request.MailList = {
      size: mailState.query.rowsPerPage,
      offset: offset
    }

    isLoading.value = true
    const { status, data } = await useApi(mailList, payload)
    isLoading.value = false
    if (status) {
      mailState.pagination = { ...data.pagination }
      mailState.query.rowsNumber = data.pagination.total
      mailState.query.page = query.page
      mailState.query.rowsPerPage = query.rowsPerPage
      router.replace({ query: { page: query.page, rowsPerPage: query.rowsPerPage } })

      if (!data.list) {
        mailState.list = []
        return
      }

      if (isLazyLoad) {
        mailState.list = [...mailState.list, ...data.list]
        return
      }

      mailState.list = [...data.list]
    }
  }

  async function lazyLoadMailList() {
    if (isLoading.value || mailState.list.length >= mailState.pagination.total) return
    mailState.query.page++
    await getMailList({ page: mailState.query.page, rowsPerPage: mailState.query.rowsPerPage }, true)
  }

  async function getMailDetail(id: number) {
    try {
      $q.loading.show()
      isLoading.value = true
      const { status, data } = await useApi(mailDetail, id)
      isLoading.value = false
      $q.loading.hide()
      if (status) {
        mailState.detail = { ...data }
        mailState.detail.mail_body = mailState.detail.mail_body.replaceAll(
          VITE_APP_BASE_API,
          VITE_APP_DYNAMIC_RESOURCE_URL
        )
      }
    } catch (error) {
      $q.loading.hide()
    }
  }

  function initMailDetail() {
    mailState.detail.id = 0
    mailState.detail.mail_type = MAIL_TYPE.Enums.Promotion
    mailState.detail.mail_title = ""
    mailState.detail.mail_body = ""
    mailState.detail.send_at = ""
  }

  const truncatedHtmlContent = (html: string, maxLength = 100) => {
    const div = document.createElement("div")
    div.innerHTML = html

    const text = div.textContent || div.innerText

    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..."
    }
    return html
  }

  return {
    isLoading,
    mailState,
    unreadMails,
    completedMails,
    columns,
    totalPage,
    getMailList,
    lazyLoadMailList,
    getMailDetail,
    initMailDetail,
    truncatedHtmlContent
  }
}
