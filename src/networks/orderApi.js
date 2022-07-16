import Url from '@constants/Url'
import { ApiClient } from '@constants/Api'
import { ApiClientV1 } from '@constants/ApiV1'

const orderApi = {
  createOrder: (payload) => {
    return ApiClientV1.post(Url.createOrder, payload)
  },
  listOrder: (payload) => {
    return ApiClientV1.get(Url.listOrder, payload)
  },
  orderDetail: (payload) => {
    return ApiClientV1.get(Url.orderDetail, payload)
  },
  updateTransaction: (payload) => {
    return ApiClientV1.put(Url.updateTransaction, payload)
  },
  orderCustomer: (payload) => {
    return ApiClient.post(Url.orderCustomer, payload)
  },
  orderReview: (payload) => {
    return ApiClient.post(Url.orderReview, payload)
  },
  transactionDetail: (payload) => {
    return ApiClient.get(Url.transactionDetail, payload)
  },
  createOrderCustomer: (payload) => {
    return ApiClient.post(Url.createOrderCustomer, payload)
  },
  deleteOrderCustomer: (payload) => {
    return ApiClient.post(Url.deleteOrderCustomer, payload)
  },
  requestPayment: (payload) => {
    return ApiClient.post(Url.requestPament, payload)
  },
}

export default orderApi
