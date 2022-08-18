import React, { useState, useEffect } from 'react'
import { ErrorMessage } from '@hookform/error-message'
import { useForm } from 'react-hook-form'
import { Button, FormControl, Form } from 'react-bootstrap'
import { Radio, DatePicker, Space } from 'antd'
import moment from 'moment'

import orderApi from '@networks/orderApi'
import swal from 'sweetalert'
import Loading from '@components/Loading'
import ImageUpload from '@components/UploadImage.jsx'
import { createFormData } from '@utils/createFormData'
import { formatDateTimeForInput } from '@utils/formatDatePicker'
import { STRING, TRANSACTION, ACCEPT_TYPE, PEOPLE, STATUS_TRANSACTION } from '@constants/Constant'
import { textError } from '@components/TextValidation'
import { useParams } from 'react-router-dom'

function BookingDetail(props) {
  const { register, errors, handleSubmit } = useForm({
    criteriaMode: 'all',
  })
  const params = useParams()
  const [isLoading, setLoading] = useState(false)
  const [orderDetail, setOrderDetail] = useState({})
  const [imageAvatarUpload, setImageAvatarUpload] = useState('')
  const orderId = params.id
  const dateFormat = 'DD/MM/YYYY'
  const [option, setOption] = useState()

  const statusOrder = [
    {
      id: 2,
      value: 'Phê duyệt',
    },
    {
      id: 1,
      value: 'Đang chờ xác nhận',
    },
    {
      id: 3,
      value: 'Từ chối',
    },
  ]

  const orderCustomerDetail = async () => {
    setLoading(true)
    try {
      const params = {
        order_id: orderId,
      }
      const res = await orderApi.orderCustomerDetail(params)
      setOrderDetail(res.data)
      setLoading(false)
      setOption(res.data.status)
    } catch (err) {
      setLoading(false)
      swal('Thất bại', `${err.msg}`, 'error')
    }
  }

  const updateOrder = async (payload) => {
    setLoading(true)
    try {
      await orderApi.updateOrder(
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
    orderCustomerDetail()
  }, [])

  const onSubmit = (data) => {
    console.log('data', data)
    updateOrder({ ...data, id: orderDetail?.id, response: '' })
  }
  const formCategory = () => {
    return (
      <div className="row mt-4">
        <div className="col-sm-6">
          <form action="#" method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="row mb-3"></div>

            <div className="row">
              <div className="col-sm-2 mt-2 p-0">Trạng thái *:</div>
              <div className="col-sm-10 p-0">
                <Form.Control
                  as="select"
                  name="status"
                  ref={register({
                    required: 'Vui lòng điền đầy đủ thông tin',
                  })}
                  value={option}
                  onChange={(e) => {
                    console.log('e', e.target.value)
                    setOption(e.target.value)
                  }}
                >
                  {statusOrder.map((item, index) => {
                    if (item.id === option) {
                      return (
                        <option value={item.id} key={index}>
                          {item.value}
                        </option>
                      )
                    } else {
                      return (
                        <option value={item.id} key={index}>
                          {item.value}
                        </option>
                      )
                    }
                  })}
                </Form.Control>
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

            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">Ngày khởi hành:</div>
              <div className="col-sm-10 p-0 mt-2">
                {moment(orderDetail?.checkin_at, 'YYYY/MM/DD').format(dateFormat)}
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">Ngày kết thúc:</div>
              <div className="col-sm-10 p-0 mt-2">
                {moment(orderDetail?.checkin_out, 'YYYY/MM/DD').format(dateFormat)}
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">Ngày tạo:</div>
              <div className="col-sm-10 p-0 mt-2">
                {moment(orderDetail?.created_at, 'YYYY/MM/DD').format(dateFormat)}
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">Hướng dẫn viên: </div>
              <div className="col-sm-10 p-0 mt-2">{orderDetail?.sale}</div>
            </div>
            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">Tên khách hàng: </div>
              <div className="col-sm-10 p-0 mt-2">{orderDetail?.customer_name}</div>
            </div>
            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">Số điện thoại: </div>
              <div className="col-sm-10 p-0 mt-2">{orderDetail?.customer_phone}</div>
            </div>
            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">Tên tour: </div>
              <div className="col-sm-10 p-0 mt-2">{orderDetail?.service_name}</div>
            </div>
            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">Số lượng người: </div>
              <div className="col-sm-10 p-0 mt-2">{orderDetail?.amount_people}</div>
            </div>
            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">Ảnh xác nhận: </div>
              <div className="col-sm-10 p-0 mt-2">
                <img
                  className="card-img-top"
                  src={orderDetail?.image_confirm}
                  alt="Dist Photo 1"
                  style={{ objectFit: 'cover', height: '100%' }}
                />
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
        <h4>Chi tiết order</h4>
      </div>
      {formCategory()}
    </div>
  )
}

export default BookingDetail
