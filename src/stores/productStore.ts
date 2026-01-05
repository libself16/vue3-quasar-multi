import { reactive } from "vue"
import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"

type ProductState = {
  list: Response.ProductList
  allList: Response.ProductList
  using: number
}

export const useProductStore = defineStore("productStore", () => {
  const productState = reactive<ProductState>({
    list: [],
    allList: [],
    using: 0
  })

  return { productState }
})
