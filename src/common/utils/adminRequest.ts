import axios, { AxiosInstance } from "axios"
import { ComponentInternalInstance, getCurrentInstance } from "vue"
// import { Modal } from 'view-ui-plus';
// import Vrouter from '../router'; // 直接從路由引入路由對象

// 顯示axios 返回的資料
interface BaseResponse<T> {
  code: string
  data: null | T | Array<T>
  message: string
}

// 目前後端資料格式尚未修正為BaseResponse格式, 所以先開後門允許string
interface Error<T> {
  message: string
  status: number
  data: BaseResponse<T> | string
}

let responseErrorData: Error<object>

// const modalOut = () => {
//   (Modal as any).confirm({
//     title: '系统忙碌，請重新登入',
//     onOk: () => {
//       sessionStorage.removeItem('publicToken');
//       sessionStorage.removeItem('userData');
//       location.reload();
//     },
//   });
// };
const instance: AxiosInstance = axios.create({
  baseURL: "https://api-stagingagent.gsiwl.com",
  timeout: 10000,
  headers: {
    "Content-type": "application/json"
  }
})

// 使用Vue.config.globalProperties實例上的方法在proxy裡面可以找到
// 因此可以解決this.$Message 諸如此類問題
// const { proxy } = getCurrentInstance() as ComponentInternalInstance

instance.interceptors.request.use(
  (config: any) => {
    const auth = `Bearer ${sessionStorage.getItem("token")}`
    config.headers = {
      Authorization: auth
      // 'Content-Type': 'application/json',
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => {
    switch (response.data.code) {
      case "400":
      case "401":
      case "402":
      case "403":
      case "404":
      case "405":
      case "406":
      case "407":
        // (Vrouter as any).push({ name: 'ErrorPage' });
        break
      default:
        break
    }
    // const hasDisposition = response.request.getResponseHeader(
    //   'Content-Disposition'
    // );
    // if (hasDisposition && hasDisposition.indexOf("utf-8''") > -1) {
    //   const data = response.data;
    //   data.fileName = decodeURIComponent(
    //     hasDisposition.split("utf-8''")[1].split('.')[0]
    //   );
    //   return data;
    // }
    return response.data
  },
  (error) => {
    const errorData = error.response
    // if (errorData) modalOut();

    const { status, data } = error.response
    responseErrorData = {
      message: error.message,
      status,
      data
    }

    return Promise.reject(responseErrorData.data)
  }
)

export default instance
