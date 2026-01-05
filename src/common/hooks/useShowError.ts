import { ref } from 'vue'
import { getCurrentInstance } from 'vue'
import { Modal, Message } from 'view-ui-plus'

export function useShowError (title: string) {

  // const params = ref(condition)
  let showErrorMsg = async (res: any) => {
    const goLoginCodeList = ['400', '401', '402', '403', '404']
    if(goLoginCodeList.indexOf(res.code) === -1) {
      switch (res.code) {
        case '1':
          (Message as any)['success']({
            background: true,
            content: `${res.message}`
          })
          break;
      
        default:
          (Message as any)['warning']({
            background: true,
            content: `${res.message}`
          })
          break;
      }
    } else {
      (Modal as any).confirm({
        title: '系统忙碌，請重新登入',
        onOk: () => {
          localStorage.removeItem('publicToken')
          localStorage.removeItem('tabData')
          localStorage.removeItem('userData')
          location.reload()
        }
      })
    }

  }
  
  return { showErrorMsg }
}
