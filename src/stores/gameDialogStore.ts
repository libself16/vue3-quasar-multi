import { defineStore } from "pinia"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { reactive } from "vue"

type Dialog = {
  show: boolean
  showDialog: () => void
  closeDialog: () => void
}

type LaunchGame = Dialog & {
  gameUrl: string
  gameContent: string
}

type CurrencySupport = Dialog & {
  currencies: string[]
  integrationId: number
  productCode: number
  gameCode: string
}

export const useGameDialogStore = defineStore("gameDialogStore", () => {
  const { getUserWalletList } = useUserInfo()

  const launchGameDialog: LaunchGame = reactive<LaunchGame>({
    show: false,
    showDialog: () => {
      launchGameDialog.show = true
    },
    closeDialog: () => {
      getUserWalletList()
      launchGameDialog.show = false
    },
    gameUrl: "",
    gameContent: ""
  })
  const currencySupportDialog: CurrencySupport = reactive<CurrencySupport>({
    show: false,
    showDialog: () => {
      currencySupportDialog.show = true
    },
    closeDialog: () => {
      currencySupportDialog.show = false
    },
    currencies: [],
    integrationId: 0,
    productCode: 0,
    gameCode: ""
  })

  return { launchGameDialog, currencySupportDialog }
})
