import { apiHelper } from './../utils/helpers'

export default {
  getCurrentUser() {
    return apiHelper.get(`/users/current`)
  },
  getUser({ userId }) {
    return apiHelper.get(`/users/${userId}`)
  },




}