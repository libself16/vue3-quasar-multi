import { defineStore } from 'pinia';
import { reactive } from 'vue';

// 往後所有state型別定義都固定以此方式命名(stateType)
interface stateType {
  [key: string]: any;
  currency: string;
  money: number;
}

export const userDepositStore = defineStore('userDeposit', () => {
  const userDeposit: stateType = reactive({
    currency: '',
    money: 100000,
  });

  const updatedUserDeposit = (data: any, attr: any = '') => {
    if (attr === '') {
      for (const key in data) {
        userDeposit[key] = data[key];
      }
    } else userDeposit[attr] = data[attr];
  };

  return { userDeposit, updatedUserDeposit };
});
