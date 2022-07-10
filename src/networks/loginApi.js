import Url from '@constants/Url'
import { ApiClient } from '@constants/Api'
import { ApiClientV1 } from '@constants/ApiV1'

const loginApi = {
  login: (payload) => {
    return ApiClientV1.put(Url.login, payload)
  },
  logout: () => {
    return ApiClientV1.put(Url.logout)
  },
}

export default loginApi
