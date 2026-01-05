import { useTitle, useSessionStorage, createSharedComposable } from "@vueuse/core"
import { useRoute, useRouter } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"
import { watch, computed, ref } from "vue"

const TITLE_STORAGE_KEY = "gsi_page_title"

// 内部实现
function _usePageTitle() {
  const route = useRoute()
  const router = useRouter()
  const { envData } = useEnv()
  const { agentCode } = envData()

  // 使用 computed 动态获取默认标题，避免 agentCode 异步加载的问题
  const defaultTitle = computed(() => agentCode || "GSI Platform")

  // 使用 useSessionStorage 持久化标题，不设置默认值，避免覆盖 URL 参数
  const storedTitle = useSessionStorage<string | null>(TITLE_STORAGE_KEY, null)

  // 初始化时优先检查 URL 中的 title 参数，然后才是 sessionStorage
  // 如果都没有，则返回 null，不做任何处理
  const getInitialTitle = () => {
    // 先检查 URL 中的 title 参数（最高优先级）
    const titleQuery = route.query.title
    if (typeof titleQuery === "string" && titleQuery.trim()) {
      const trimmedTitle = titleQuery.trim()
      // 如果 URL 中有 title 参数，立即保存到 sessionStorage
      if (trimmedTitle !== storedTitle.value) {
        storedTitle.value = trimmedTitle
      }
      return trimmedTitle
    }
    // 如果没有 URL 参数，则使用 sessionStorage
    if (storedTitle.value && storedTitle.value.trim()) {
      return storedTitle.value.trim()
    }
    // 如果 URL 和 sessionStorage 都没有，返回 null，不做处理
    return null
  }

  const initialTitle = getInitialTitle()

  // 标记是否应该管理标题（只有当有初始 title 或后续添加 title 时才管理）
  const shouldManageTitle = ref(!!initialTitle)

  // 只有当有初始标题时才使用 useTitle，否则返回一个普通的 ref
  const title = initialTitle
    ? useTitle(initialTitle, {
        // 当组件卸载时恢复原始标题
        restoreOnUnmount: false
      })
    : ref<string | undefined>(undefined)

  // 监听标题变化，自动保存到 sessionStorage（但不监听初始化时的设置）
  let isInitializing = true
  watch(
    title,
    (newTitle) => {
      // 只有在管理标题、非初始化阶段且标题有效时才保存
      if (shouldManageTitle.value && !isInitializing && newTitle && newTitle.trim()) {
        const trimmedTitle = newTitle.trim()
        // 只有在标题真正改变时才更新 sessionStorage
        if (trimmedTitle !== storedTitle.value) {
          storedTitle.value = trimmedTitle
        }
      }
    },
    { immediate: false }
  )

  // 标记初始化完成
  setTimeout(() => {
    isInitializing = false
  }, 0)

  /**
   * 处理 URL query 中的 title 参数
   * 如果存在 title query，设置为页面标题并从 URL 中移除该参数
   */
  async function handleTitleQueryString() {
    const titleQuery = route.query.title

    if (typeof titleQuery === "string" && titleQuery.trim()) {
      const trimmedTitle = titleQuery.trim()

      // 激活标题管理
      shouldManageTitle.value = true

      // 只有在標題不同時才更新，避免不必要的更新
      if (title.value !== trimmedTitle) {
        // 设置页面标题
        title.value = trimmedTitle
        // 保存到 sessionStorage
        storedTitle.value = trimmedTitle
      }

      // 从 URL 中移除 title 参数
      const query = { ...router.currentRoute.value.query }
      delete query.title
      await router.replace({ query })
    }
  }

  /**
   * 更新页面标题
   * @param newTitle 新的标题
   */
  function updateTitle(newTitle: string) {
    // 激活标题管理
    shouldManageTitle.value = true
    title.value = newTitle
  }

  /**
   * 重置为默认标题
   */
  function resetTitle() {
    // 激活标题管理
    shouldManageTitle.value = true
    title.value = defaultTitle.value
    storedTitle.value = defaultTitle.value
  }

  /**
   * 清除 sessionStorage 中的标题，停止管理标题
   */
  function clearStoredTitle() {
    storedTitle.value = null
    shouldManageTitle.value = false
    // 不设置标题，保持原始标题
  }

  /**
   * 获取 sessionStorage 中存储的标题
   */
  function getStoredTitle() {
    return storedTitle.value
  }

  // 监听路由变化，如果有新的 title query 则更新标题
  watch(
    () => route.query.title,
    (newTitle, oldTitle) => {
      // 只有在 title query 真正改变时才更新
      if (typeof newTitle === "string" && newTitle.trim() && newTitle !== oldTitle) {
        // 激活标题管理
        shouldManageTitle.value = true
        const trimmedTitle = newTitle.trim()
        title.value = trimmedTitle
        storedTitle.value = trimmedTitle
      }
    },
    { immediate: false }
  )

  // 注意：不再监听 defaultTitle 变化
  // 因为只有 URL 或 sessionStorage 中有值时才会管理标题

  return {
    /** 当前页面标题 */
    title,

    /** 持久化的标题（sessionStorage） */
    storedTitle,

    /** 处理 title query string */
    handleTitleQueryString,

    /** 更新页面标题 */
    updateTitle,

    /** 重置为默认标题 */
    resetTitle,

    /** 清除 sessionStorage 中的标题 */
    clearStoredTitle,

    /** 获取 sessionStorage 中存储的标题 */
    getStoredTitle
  }
}

// 使用 createSharedComposable 确保单例模式
// 这样无论在哪里调用 usePageTitle()，都会返回同一个实例
export const usePageTitle = createSharedComposable(_usePageTitle)
