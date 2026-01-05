import { ref, reactive, computed } from "vue"
import { useI18n } from "vue-i18n"
import { QTableProps, useQuasar } from "quasar"
import { useApi } from "src/common/hooks/useApi"
import { getDomainList, addDomain } from "src/api/domain"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"

export function useDomain() {
  const { t } = useI18n()
  const $q = useQuasar()

  const host = computed(() => window.location.host)

  const isLoading = ref(false)
  const addDomainForm = reactive<Request.AddDomain>({
    title: "",
    name: ""
  })

  const domainState = reactive<Response.DomainList>({
    list: [],
    pagination: {
      page: 1,
      offset: 0,
      size: 10,
      total: 0
    },
    direct_domain: ""
  })

  const totalPages = computed(() => {
    const total = domainState.pagination.total ?? 0
    return Math.max(1, Math.ceil(total / domainState.pagination.size))
  })

  const domainTableColumns = computed<QTableProps["columns"]>(() => [
    { name: "title", field: "title", align: "center", label: t("collaboration.domain_name") },
    { name: "status", field: "status", align: "center", label: t("collaboration.status") },
    { name: "name", field: "name", align: "center", label: t("collaboration.domain") },
    { name: "created_at", field: "created_at", align: "center", label: t("collaboration.add_time") },
    { name: "expired_at", field: "expired_at", align: "center", label: t("collaboration.expiration_time") }
  ])

  const handlePagination = async (page: number) => {
    domainState.pagination.page = page
    handleGetDomainList()
  }

  async function handleGetDomainList() {
    try {
      domainState.pagination.offset = (domainState.pagination.page - 1) * domainState.pagination.size

      const payload: Request.GetDomainList = {
        offset: domainState.pagination.offset,
        size: domainState.pagination.size
      }

      isLoading.value = true
      const { status, data } = await useApi(getDomainList, payload)
      isLoading.value = false

      if (status) {
        domainState.pagination.page = Math.floor(data.pagination.offset / data.pagination.size) + 1
        domainState.pagination.total = data.pagination.total

        if (!data.list) {
          domainState.list = []
          return
        }

        domainState.list = data.list
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  function initAddDomainForm() {
    addDomainForm.title = ""
    addDomainForm.name = ""
  }

  async function handleAddDomain(): Promise<{
    status: boolean
    code: number
  }> {
    isLoading.value = true
    const { status, code } = await useApi(addDomain, addDomainForm)
    isLoading.value = false

    if (status) {
      $q.notify({
        type: "positive",
        message: t("common.alarm.createSuccess"),
        position: "top",
        timeout: 1000
      })
    }

    return Promise.resolve({
      status,
      code
    })
  }

  return {
    /** 查詢中 */
    isLoading,

    /** 當前網域 */
    host,

    /** 網域表格欄位 */
    domainTableColumns,

    /** 網域列表頁數 */
    totalPages,

    /** 網域列表資料 */
    domainState,

    /** 新增網域表單 */
    addDomainForm,

    /** 網域列表切換分頁 */
    handlePagination,

    /** 取得網域列表 */
    handleGetDomainList,

    /** 初始化新增網域表單 */
    initAddDomainForm,

    /** 新增網域 */
    handleAddDomain
  }
}
