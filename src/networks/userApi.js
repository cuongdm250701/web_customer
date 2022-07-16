import Url from '@constants/Url'
import { ApiClient } from '@constants/Api'
import { ApiClientV1 } from '@constants/ApiV1'

const userApi = {
  userInfo: () => {
    return ApiClientV1.get(Url.getUserInfo)
  },
  createUser: (payload) => {
    return ApiClientV1.post(Url.createUser, payload)
  },
  updateUser: (payload) => {
    return ApiClient.post(Url.customerUpdate, payload)
  },
  uploadAvatar: (payload) => {
    return ApiClient.post(Url.uploadAvatar, payload)
  },
  userReferred: (payload) => {
    return ApiClient.post(Url.userReferred, payload)
  },
  getListNotif: (payload) => {
    return ApiClient.get(Url.getListNotif, payload)
  },
  updateIsRead: (payload) => {
    return ApiClient.post(Url.updateIsRead, payload)
  },
  createNoti: (payload) => {
    return ApiClient.post(Url.createNoti, payload)
  },
  forgotPassword: (payload) => {
    return ApiClient.post(Url.forgotPassword, payload)
  },
  changePassword: (payload) => {
    return ApiClient.post(Url.changePassword, payload)
  },
  getConfig: () => {
    return ApiClient.get(Url.getConfig)
  },
}

export default userApi