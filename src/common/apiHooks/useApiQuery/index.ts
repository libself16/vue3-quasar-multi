import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/vue-query"
import { useAuth } from "src/common/hooks/useAuth"
import { ApiResponse, ErrorHandlerDependencies } from "./types"
import { handleApiError } from "./handleApiError"
import { useI18n } from "vue-i18n"

/**
 * 使用 TanStack Query 的 useQuery，並整合原有的 error handling
 *
 * @param queryKey - Query key for caching
 * @param apiFunction - API function to call
 * @param payload - Parameters for the API function
 * @param options - Additional TanStack Query options
 */
export function useApiQuery<T extends (...args: any) => Promise<ApiResponse<any>>, TData = Awaited<ReturnType<T>>>(
  queryKey: any[],
  apiFunction: T,
  payload?: Parameters<T>[0],
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<T>>, // TQueryFnData (e.g., ApiResponse<CmsItem[]>)
      Error, // TError
      TData, // TData (將由 select 推導)
      any[] // TQueryKey
    >,
    "queryKey" | "queryFn"
  >
) {
  const { reset: resetAuth } = useAuth()
  const { t, te } = useI18n()
  const errorDeps: ErrorHandlerDependencies = { resetAuth, t, te }

  const query = useQuery<Awaited<ReturnType<T>>, Error, TData, any[]>({
    queryKey,
    queryFn: async (): Promise<Awaited<ReturnType<T>>> => {
      try {
        const response = await apiFunction(payload)

        // 如果 API 返回失敗狀態,處理錯誤
        if (response.status !== true) {
          handleApiError(response, errorDeps)
          throw new Error(response.msg || `API Error Code: ${response.code}`)
        }

        return response as Awaited<ReturnType<T>>
      } catch (err) {
        // 應該不太可能會執行到，除非上面的代碼有找不到的變數
        // 攔截器會自己把錯誤的狀況變成 resolve 並且給 status = false
        console.error("Failed to fetch data:", err)
        throw err
      }
    },
    ...options
  })

  return query
}

/**
 * 使用 TanStack Query 的 useMutation，並整合原有的 error handling
 *
 * @param apiFunction - API function to call
 * @param options - Additional TanStack Query options
 */
export function useApiMutation<T extends (...args: any) => Promise<ApiResponse<any>>>(
  apiFunction: T,
  options?: Omit<UseMutationOptions<ApiResponse<any>, Error, Parameters<T>[0]>, "mutationFn">
) {
  const { reset: resetAuth } = useAuth()
  const { t, te } = useI18n()

  const errorDeps: ErrorHandlerDependencies = { resetAuth, t, te }

  const mutation = useMutation({
    mutationFn: async (payload: Parameters<T>[0]) => {
      try {
        const response = await apiFunction(payload)

        // 如果 API 返回失敗狀態，處理錯誤
        if (response.status === true) {
          handleApiError(response, errorDeps)
          throw new Error(response.msg || `API Error Code: ${response.code}`)
        }

        return response
      } catch (err) {
        console.error("Failed to fetch data:", err)
        throw err
      }
    },
    // onError: (error, variables, context) => {
    // 1. error: 就是你 new Error(response.msg) 拋出的錯誤
    // 2. variables: 你呼叫 mutate(variables) 時傳入的 payload
    // 3. context: (較少用) onMutate 回傳的內容
    onError: (error) => {
      console.error("!! [tanstack-vue-query] useApiMutation caught an exception:", error)
    },
    ...options
  })

  return mutation
}
