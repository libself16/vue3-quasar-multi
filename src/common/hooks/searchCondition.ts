import { ref } from 'vue';

export function useSearchCondition() {
  const searchBaseData = ref({
    offset: 0,
    size: 10,
    sort: 'id',
    sort_by: 'ASC',
  });

  const initPage = () => (searchBaseData.value.offset = 0);

  const addSearchCondition = (params: any) => {
    searchBaseData.value = { ...searchBaseData.value, ...params };
  };

  return {
    searchBaseData,
    initPage,
    addSearchCondition,
  };
}
