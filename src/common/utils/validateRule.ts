const usernameRule = [
  {
    required: true, message: '帳號不能为空！', trigger: 'change'
  }
]

const passwordRule = [
  {
    required: true, message: '密码不能为空！', trigger: 'change'
  }
]

export {
  usernameRule,
  passwordRule
}