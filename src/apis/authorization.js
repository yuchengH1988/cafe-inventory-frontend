import { apiHelper } from './../utils/helpers'

export default {
  // 帶入需要的參數
  signIn({ account, password }) {
    // 這裡 return 的會是一個 Promise
    return apiHelper.post('/signin', {
      account,
      password
    })
  },
  signUp(data) {
    return apiHelper.post('/signup', { ...data })
  }
}