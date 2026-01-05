import { ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { minLength, maxLength, required, alphaNum, helpers } from '@vuelidate/validators'

export function useValidate () {
  const maxNameLength = ref(10)  // 限制字數不得超過10位數用
  const minNameLength = ref(2)  // 限制字數不得超過2位數用
  const maxDescriptionLength = ref(100)  // 限制字數不得超過100位數用

  const alphabetAndChinese = (value: any) => {
    const re = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
    return re.test(value)
  }

  const alphabetAndDash = (value: any) => {
    const re = /^[A-Za-z0-9-]+$/
    return re.test(value)
  }
  // 擴充客製化的驗證可新增於此
  const rules = {
    required: {
      required: helpers.withMessage('不得為空', required)
    },
    name: {
      required: helpers.withMessage('不得為空', required),
      maxLength: helpers.withMessage(`限制長度不得超過${maxNameLength.value}位`, maxLength(maxNameLength)),
      minLength: helpers.withMessage(`限制長度不得少於${minNameLength.value}位`, minLength(minNameLength)),
      alphabetAndChinese: helpers.withMessage(`僅能輸入中文，英文與數字`, alphabetAndChinese)
    },
    type: {
      alphabetAndDash: helpers.withMessage(`限制只能英文與數字與${" \"-\" 符號"}`, alphabetAndDash),
      required: helpers.withMessage('不得為空', required),
      maxLength: helpers.withMessage(`限制長度不得超過${maxNameLength.value}位`, maxLength(maxNameLength)),
      $lazy: true
    },
    description: {
      maxLength: helpers.withMessage(`限制長度不得超過${maxDescriptionLength.value}位`, maxLength(maxDescriptionLength))
    }
  }

  let v$: any = useVuelidate()

  return {
    rules,
    v$
  }
}