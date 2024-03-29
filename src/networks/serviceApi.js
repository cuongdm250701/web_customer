import Url from '@constants/Url'
import { ApiClient } from '@constants/Api'
import { ApiClientV1 } from '@constants/ApiV1'

const serviceApi = {
  listService: (payload) => {
    return ApiClientV1.get(Url.listService, payload)
  },
  serviceDetail: (payload) => {
    return ApiClientV1.get(Url.serviceDetail, payload)
  },
  review: (payload) => {
    return ApiClient.get(Url.review, payload)
  },
  listCate: (payload) => {
    return ApiClientV1.get(Url.listCate, payload)
  },
  likeService: (payload) => {
    return ApiClientV1.post(Url.likeService, payload)
  },
  listServiceLiked: (payload) => {
    return ApiClientV1.get(Url.listServiceLiked, payload)
  },
  deleteCategory: (payload) => {
    return ApiClientV1.delete(Url.deleteCategory, payload)
  },
  categoryDetail: (payload) => {
    return ApiClientV1.get(Url.categoryDetail, payload)
  },
  updateCategory: (payload) => {
    return ApiClientV1.put(Url.updateCategory, payload)
  },
  createCategory: (payload) => {
    return ApiClientV1.post(Url.createCategory, payload)
  },
  updateService: (payload) => {
    return ApiClientV1.put(Url.updateService, payload)
  },
  createService: (payload) => {
    return ApiClientV1.post(Url.createService, payload)
  },
}

export default serviceApi
