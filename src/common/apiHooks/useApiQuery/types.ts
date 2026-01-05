export interface ApiResponse<T = any> {
  data: T
  code: number
  msg?: string
  status: boolean
  excode?: string
}

export interface ErrorHandlerDependencies {
  resetAuth: () => void
  t: (key: string, ...args: any[]) => string
  te: (key: string, locale?: string) => boolean
}
