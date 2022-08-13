import React, { useState, useEffect } from 'react'
import { ErrorMessage } from '@hookform/error-message'
import { useForm } from 'react-hook-form'
import { Button, FormControl, Modal } from 'react-bootstrap'
import { Radio, DatePicker, Space } from 'antd'
import moment from 'moment'

import serviceApi from '@networks/serviceApi'
import swal from 'sweetalert'
import Loading from '@components/Loading'
import ImageUpload from '@components/UploadImage.jsx'
import { createFormData } from '@utils/createFormData'
import { formatDateTimeForInput } from '@utils/formatDatePicker'
import { STRING, TRANSACTION, ACCEPT_TYPE, PEOPLE } from '@constants/Constant'
import { textError } from '@components/TextValidation'
import { useParams } from 'react-router-dom'

function TourCategoryDetail(props) {
  const { register, errors, handleSubmit } = useForm({
    criteriaMode: 'all',
  })
  const params = useParams()
  const [isLoading, setLoading] = useState(false)
  const [categoryDetail, setCategoryDetail] = useState({})
  const [imageAvatarUpload, setImageAvatarUpload] = useState('')
  const categoryId = params.id
  const dateFormat = 'DD/MM/YYYY'

  const getCategoryDetail = async () => {
    setLoading(true)
    try {
      const params = {
        id: categoryId,
      }
      const res = await serviceApi.categoryDetail(params)
      setCategoryDetail(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      swal('Thất bại', `${err.msg}`, 'error')
    }
  }

  const updateCategory = async (payload) => {
    setLoading(true)
    try {
      await serviceApi.updateCategory(
        createFormData({
          ...payload,
        })
      )
      setLoading(false)
      swal('Thành công', 'Lưu thành công', 'success').then(window.location.reload())
    } catch (err) {
      setLoading(false)
      swal('Thất bại', `${err.msg}`, 'error')
    }
  }

  useEffect(() => {
    getCategoryDetail()
  }, [])

  const onSubmit = (data) => {
    updateCategory({ ...data, id: categoryDetail?.id })
  }

  const formCategory = () => {
    return (
      <div className="row mt-4">
        <div className="col-sm-6">
          <form action="#" method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="row mb-3"></div>

            <div className="row">
              <div className="col-sm-2 mt-2 p-0">Tên *</div>
              <div className="col-sm-10 p-0">
                <FormControl
                  type="text"
                  name="name"
                  placeholder="Nhập tên danh mục"
                  ref={register({
                    required: 'Vui lòng điền đầy đủ thông tin',
                  })}
                  value={categoryDetail.name}
                  onChange={(e) => setCategoryDetail({ ...categoryDetail, name: e.target.value })}
                />
                <ErrorMessage
                  errors={errors}
                  name="name"
                  render={({ messages }) =>
                    messages &&
                    Object.entries(messages).map(([type, message]) => (
                      <p key={type} style={{ color: 'red' }}>
                        {message}
                      </p>
                    ))
                  }
                />
              </div>
            </div>

            <div className="row mt-4"></div>

            <div className="row mt-4"></div>

            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">
                Ngày tạo: {moment(categoryDetail?.created_at, 'YYYY/MM/DD').format(dateFormat)}
              </div>
            </div>
            <div>
              <div className="row mt-4">
                <div className="col-sm-2 mt-2 p-0">Người tạo: {categoryDetail?.create_by}</div>
                <div className="col-sm-10 p-0"></div>
              </div>
              <div className="row mt-4">
                <div className="col-sm-2 mt-1 p-0">
                  Trạng thái: {categoryDetail.is_active === 1 ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                </div>
                <div className="col-sm-10 p-0"></div>
              </div>
            </div>
            <div className="row mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="submit" variant="success" className="mr-2 mt-2">
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </div>
        <div className="col-sm-1"></div>
        <div className="col-sm-3"></div>
      </div>
    )
  }

  return (
    <div className="tab-detail ml-5">
      {isLoading && <Loading />}
      <div className="row">
        <h4>Chi tiết danh mục</h4>
      </div>
      {formCategory()}
    </div>
  )
}

export default TourCategoryDetail
