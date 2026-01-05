import { computed, ref, reactive, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export function useEdit(dialogFormInitData: any) {
  const router = useRouter()
  // 使用Vue.config.globalProperties實例上的方法在proxy裡面可以找到
  // 因此可以解決this.$Message 諸如此類問題
  let { proxy }: any = getCurrentInstance()
  let dialogForm: any = ref({})
  let dialogFormLoading = ref(false)

  let reset = () => {
    dialogForm.value = JSON.parse(JSON.stringify(dialogFormInitData))
  }

  let changeBoolean = (attr) => {
    switch (attr) {
      case 'isEnabled':
        dialogForm.value[attr] = Number(dialogForm.value[attr])
        break;
      default:
        break;
    }
  }

  let cloneDialogForm = formData => dialogForm.value = JSON.parse(JSON.stringify(formData))

  let insertDialogFormItem = (attr, formData) => dialogForm.value[attr] = formData

  let getInfo = async (row: any, infoFunction: Function | null, fixAttr: Array<string> = []) => {
    if (infoFunction === null) {
      dialogForm.value = {
        ...dialogForm.value,
        id: row.id,
        name: row.name
      }
      return
    }
    dialogFormLoading.value = true
    await (infoFunction as Function)({ id: row.id })
      .then((res: any) => {
        dialogFormLoading.value = false
        if (res.data instanceof Array) dialogForm.value.sequenceList = res.data
        else dialogForm.value = { ...res.data, id: row.id }

        // 判斷是否有需要特別處理的屬性
        if (fixAttr.length !== 0) {
          fixAttr.forEach(attr => dialogForm.value[attr] = Number(dialogForm.value[attr]))
        }
      })
  }

  let updateInfo = async (title: string, updateFunction: Function) => {
    return await updateFunction(dialogForm.value.id, dialogForm.value)
  }

  let deleteInfo = async (deleteFunction: Function) => {
    return await deleteFunction(dialogForm.value.id, dialogForm.value)
  }

  // 提供不打search 時  仍然能改變 list loading 狀態的窗口
  const changeDialogLoading = (status: boolean) => {
    dialogFormLoading.value = status
  }

  return { 
    insertDialogFormItem,
    cloneDialogForm,
    changeBoolean,
    reset,
    changeDialogLoading,
    updateInfo,
    deleteInfo,
    getInfo,
    dialogForm,
    dialogFormLoading
  }
}