import { ref } from 'vue';
// import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue';

export function useSearch(searchFunction: any) {
  // const router = useRouter()
  // 使用Vue.config.globalProperties實例上的方法在proxy裡面可以找到
  // 因此可以解決this.$Message 諸如此類問題
  const { proxy }: any = getCurrentInstance();
  const spinShow = ref(false);
  const tableData: any = ref([]);
  const totalSize = ref(0);

  const clearListData = () => (tableData.value = []);

  // const params = ref(condition)
  const search = async (params: any = {}) => {
    spinShow.value = true;
    await searchFunction(params).then((res: any) => {
      const resInfo = res.data ? res.data : res; // 暫時
      if (res.code !== 0) {
        spinShow.value = false;
        // proxy.$Message['error']({
        //   background: true,
        //   content: `${resInfo.message}`,
        // });
        return;
      }
      // 這部分需要協商一下是否要統一叫做list, 不要每個api 陣列名稱都不同, 很難統一
      tableData.value = resInfo.credit_requisitions
        ? resInfo.credit_requisitions
        : resInfo;
      totalSize.value = res.pagination.size;
      spinShow.value = false;
    });
  };

  // 提供不打search 時  仍然能改變 list loading 狀態的窗口
  const changeLoading = (status: boolean) => {
    spinShow.value = status;
  };

  return {
    spinShow,
    totalSize,
    tableData,
    clearListData,
    changeLoading,
    search,
  };
}
