import React, { useState, useEffect } from 'react'
import { ErrorMessage } from '@hookform/error-message'
import { useForm } from 'react-hook-form'
import { Button, FormControl, Form } from 'react-bootstrap'
// import Form from 'react-bootstrap'
import { Radio, DatePicker, Space } from 'antd'
import moment from 'moment'

import serviceApi from '@networks/serviceApi'
import swal from 'sweetalert'
import Loading from '@components/Loading'
import { createFormData } from '@utils/createFormData'
import { formatDateTimeForInput } from '@utils/formatDatePicker'
import { ACCEPT_TYPE } from '@constants/Constant'
import { useParams } from 'react-router-dom'
import { ROUTER } from '@constants/Constant'
import { useHistory } from 'react-router-dom'

function TourCreate(props) {
  const { register, errors, handleSubmit } = useForm({
    criteriaMode: 'all',
  })
  const [isLoading, setLoading] = useState(false)
  const [service, setService] = useState({})
  const [gender, setGender] = useState(1)
  const [option, setOption] = useState('')
  const [imageAvatarUpload, setImageAvatarUpload] = useState('')
  const [listCategory, setListCategory] = useState([])
  const dateFormat = 'YYYY/MM/DD'
  const history = useHistory()

  const getListServiceCategory = async () => {
    try {
      const res = await serviceApi.listCate()
      console.log('res', res.data)
      setListCategory(res.data)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
    }
  }

  const createTour = async (payload) => {
    setLoading(true)
    try {
      await serviceApi.createService(
        createFormData({
          ...payload,
        })
      )
      setLoading(false)
      swal('Thành công', 'Lưu thành công', 'success').then(history.push(ROUTER.TOUR_LIST))
    } catch (err) {
      setLoading(false)
      swal('Thất bại', `${err.msg}`, 'error')
    }
  }

  useEffect(() => {
    getListServiceCategory()
  }, [])

  const onSubmit = (data) => {
    console.log('data', data)
    createTour({ ...data, service_category_id: data.category })
  }

  const fromTourDetail = () => {
    return (
      <div className="row mt-4 ml-5">
        <div className="col-sm-6">
          <form action="#" method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-sm-2 mt-2 p-0">Tên *</div>
              <div className="col-sm-10 p-0">
                <FormControl
                  type="text"
                  name="name"
                  placeholder="Nhập họ tên"
                  ref={register({
                    required: 'Vui lòng điền đầy đủ thông tin',
                  })}
                  value={service.name}
                  onChange={(e) => setService({ ...service, name: e.target.value })}
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

            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">Chọn danh mục*</div>
              <div className="col-sm-10 p-0">
                <Form.Control
                  as="select"
                  name="category"
                  ref={register({
                    required: 'Vui lòng điền đầy đủ thông tin',
                  })}
                  value={option}
                  onChange={(e) => {
                    setOption(e.target.value)
                    setService({ ...service, category: e.target.value })
                  }}
                >
                  <option value="">Chọn danh mục</option>
                  {listCategory.map((item, index) => (
                    <option value={item?.id} key={index}>
                      {item?.name}
                    </option>
                  ))}
                </Form.Control>
                <ErrorMessage
                  errors={errors}
                  name="category"
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
              <div className="col-sm-2 mt-2 p-0">Số lượng người *</div>
              <div className="col-sm-10 p-0">
                <FormControl
                  type="text"
                  name="people"
                  ref={register({
                    required: 'Vui lòng điền đầy đủ thông tin',
                  })}
                  placeholder="Nhập số người"
                  value={service.people}
                  onChange={(e) => setService({ ...service, people: e.target.value })}
                />
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">Điện thoại *</div>
              <div className="col-sm-10 p-0">
                <FormControl
                  type="text"
                  name="contact_phone"
                  placeholder="Nhập số điện thoại"
                  ref={register({
                    // required: 'Vui lòng nhập đầy đủ thông tin',
                    // pattern: {
                    //   value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    //   message: 'Số điện thoại không hợp lệ',
                    // },
                  })}
                  // disabled="true"
                  value={service.contact_phone}
                  onChange={(e) => setService({ ...service, contact_phone: e.target.value })}
                />
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">Địa chỉ</div>
              <div className="col-sm-10 p-0">
                <FormControl
                  type="text"
                  name="address"
                  placeholder="Nhập địa chỉ"
                  ref={register({
                    // required: 'Vui lòng nhập đầy đủ thông tin',
                  })}
                  value={service?.address || ''}
                  onChange={(e) =>
                    setService({
                      ...service,
                      address: e.target.value,
                    })
                  }
                />
                <ErrorMessage
                  errors={errors}
                  name="address"
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
            <div>
              <div className="row mt-4">
                <div className="col-sm-2 mt-2 p-0">Mô tả *</div>
                <div className="col-sm-10 p-0">
                  <FormControl
                    type="text"
                    as="textarea"
                    name="content"
                    placeholder="Nhập mô tả"
                    ref={register({
                      required: 'Vui lòng nhập đầy đủ thông tin',
                    })}
                    value={service?.content || ''}
                    onChange={(e) =>
                      setService({
                        ...service,
                        content: e.target.value,
                      })
                    }
                  />
                  <ErrorMessage
                    errors={errors}
                    name="content"
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
            </div>
            <div>
              <div className="row mt-4">
                <div className="col-sm-2 mt-2 p-0">Lịch trình *</div>
                <div className="col-sm-10 p-0">
                  <FormControl
                    type="text"
                    as="textarea"
                    name="schedule"
                    placeholder="Nhập lịch trình"
                    ref={register({
                      required: 'Vui lòng nhập đầy đủ thông tin',
                    })}
                    value={service?.schedule || ''}
                    onChange={(e) =>
                      setService({
                        ...service,
                        schedule: e.target.value,
                      })
                    }
                  />
                  <ErrorMessage
                    errors={errors}
                    name="schedule"
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
            </div>
            <div className="row mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="submit" variant="success" className="mr-2 mt-2">
                Thêm Tour
              </Button>
            </div>
          </form>
        </div>
        <div className="col-sm-1"></div>
      </div>
    )
  }

  return (
    <div className="tab-detail">
      {isLoading && <Loading />}
      <div className="row ml-5">
        <h4>Chi tiết tour</h4>
      </div>
      {fromTourDetail()}
    </div>
  )
}

export default TourCreate
