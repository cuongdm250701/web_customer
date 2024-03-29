import React, { useState, useEffect } from 'react'
import { ErrorMessage } from '@hookform/error-message'
import { useForm } from 'react-hook-form'
import { Button, FormControl, Modal } from 'react-bootstrap'
import { Radio, DatePicker, Space } from 'antd'
import moment from 'moment'

import userApi from '@networks/userApi'
import swal from 'sweetalert'
import Loading from '@components/Loading'
import ImageUpload from '@components/UploadImage.jsx'
import { createFormData } from '@utils/createFormData'
import { formatDateTimeForInput } from '@utils/formatDatePicker'
import { STRING, TRANSACTION, ACCEPT_TYPE, PEOPLE } from '@constants/Constant'
import { textError } from '@components/TextValidation'

function UserInfo(props) {
  const { register, errors, handleSubmit } = useForm({
    criteriaMode: 'all',
  })
  const [isLoading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [gender, setGender] = useState(1)
  const [dob, setDob] = useState('')
  const [imageAvatarUpload, setImageAvatarUpload] = useState('')
  const [imageBakingDisplay, setImageBakingDisplay] = useState('')

  const dateFormat = 'YYYY/MM/DD'

  const getUserInfo = async () => {
    setLoading(true)
    try {
      const res = await userApi.userInfo()
      setGender(res.data?.gender)
      setUserInfo(res.data)
      setLoading(false)
      setDob(res.data?.dob)
    } catch (err) {
      setLoading(false)
      swal('Thất bại', `${err.msg}`, 'error')
    }
  }

  const updateUserInfo = async (payload) => {
    console.log('payload', payload)
    setLoading(true)
    try {
      await userApi.updateUser(
        createFormData({
          ...payload,
          image: imageAvatarUpload,
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
    getUserInfo()
  }, [])

  const handleChangeDate = (e) => {
    setDob(moment(e).format('YYYY/MM/DD'))
  }

  const onChangeCheckBox = (e) => {
    setGender(e.target.value)
  }

  const onSubmit = (data) => {
    if (!dob) {
      swal('Thất bại', `Vui lòng điền đầy đủ thông tin bắt buộc`, 'error')
    } else {
      updateUserInfo({ ...data, dob: dob, gender: gender, id: userInfo?.id })
    }
  }

  const handleChangeImage = (event) => {
    if (event.target?.files?.length <= 0) {
      return
    }
    if (!ACCEPT_TYPE.IMAGE.includes(event.target.files[0].type)) {
      alert('Định dạng ảnh không được hỗ trợ. Vui lòng chọn ảnh khác.')
      return
    }
    // setUserInfo({
    //   ...userInfo,
    //   customer_info: {
    //     ...userInfo.customer_info,
    //     profile_image: (window.URL || window.webkitURL).createObjectURL(event.target.files[0]),
    //   },
    // })
    setImageBakingDisplay(
      event.target.files[0] && (window.URL || window.webkitURL).createObjectURL(event.target.files[0])
    )
    setImageAvatarUpload(event.target.files[0])
    console.log('ImageAvatarUpload', imageBakingDisplay)
  }

  const fromUserInfo = () => {
    return (
      <div className="row mt-4">
        <div className="col-sm-6">
          <form action="#" method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="row mb-3">
              <div className="col-sm-2 p-0">Điểm tích lũy</div>
              <div className="col-sm-10 p-0">
                <div style={{ fontWeight: 700 }}>
                  {userInfo?.point
                    ? Number(userInfo?.customer_info?.point)?.toLocaleString('vi', {
                        currency: 'VND',
                      })
                    : 0}{' '}
                  điểm
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-2 mt-2 p-0">Họ và tên *</div>
              <div className="col-sm-10 p-0">
                <FormControl
                  type="text"
                  name="full_name"
                  placeholder="Nhập họ tên"
                  ref={register({
                    required: 'Vui lòng điền đầy đủ thông tin',
                  })}
                  value={userInfo.full_name}
                  onChange={(e) => setUserInfo({ ...userInfo, full_name: e.target.value })}
                />
                <ErrorMessage
                  errors={errors}
                  name="full_name"
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
              <div className="col-sm-2 mt-2 p-0">Số điện thoại *</div>
              <div className="col-sm-10 p-0">
                <FormControl type="text" placeholder="Nhập số điện thoại" disabled="true" value={userInfo.user_name} />
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-sm-2 mt-2 p-0">Email *</div>
              <div className="col-sm-10 p-0">
                <FormControl
                  type="text"
                  name="email"
                  placeholder="Nhập email"
                  ref={register({
                    required: 'Vui lòng nhập đầy đủ thông tin',
                    pattern: {
                      value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: 'Email không hợp lệ',
                    },
                  })}
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
                <ErrorMessage
                  errors={errors}
                  name="email"
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
              <div className="col-sm-2 mt-2 p-0">Địa chỉ</div>
              <div className="col-sm-10 p-0">
                <FormControl
                  type="text"
                  name="address"
                  placeholder="Nhập địa chỉ"
                  ref={register({
                    // required: 'Vui lòng nhập đầy đủ thông tin',
                  })}
                  value={userInfo?.address || ''}
                  onChange={(e) =>
                    setUserInfo({
                      ...userInfo,
                      customer_info: { ...userInfo.customer_info, address: e.target.value },
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
                <div className="col-sm-2 mt-2 p-0">Ngày sinh *</div>
                <div className="col-sm-10 p-0">
                  {dob ? (
                    <Space direction="vertical">
                      <DatePicker
                        style={{
                          height: 'auto',
                          cursor: 'pointer',
                          padding: '6px 16px',
                          borderRadius: '4px',
                        }}
                        value={moment(formatDateTimeForInput(dob), dateFormat)}
                        format={dateFormat}
                        onChange={(e) => handleChangeDate(e)}
                        placeholder="Chọn ngày sinh"
                      />
                    </Space>
                  ) : (
                    <Space direction="vertical">
                      <DatePicker
                        style={{
                          height: 'auto',
                          cursor: 'pointer',
                          padding: '6px 16px',
                          borderRadius: '4px',
                        }}
                        format={dateFormat}
                        onChange={(e) => handleChangeDate(e)}
                        placeholder="Chọn ngày sinh"
                      />
                    </Space>
                  )}
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-sm-2 mt-1 p-0">Giới tính</div>
                <div className="col-sm-10 p-0">
                  <Radio.Group value={gender} onChange={(e) => onChangeCheckBox(e)}>
                    <Radio value={1}>Nam</Radio>
                    <Radio value={2}>Nữ</Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>
            <div className="row mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="submit" variant="success" className="mr-2 mt-2">
                Lưu thay đổi
              </Button>
              {/* <Button variant="success" onClick={() => uploadAvatar()} className="mr-2 mt-2">
                Lưu Avatar
              </Button>
              {!userInfo.referred && (
                <Button variant="success" onClick={() => setShowEnterInviteCodeModal(true)} className="mt-2">
                  Nhập mã giới thiệu
                </Button>
              )} */}
            </div>
          </form>
        </div>
        <div className="col-sm-1"></div>
        <div className="col-sm-3">
          <div>Ảnh đại diện</div>
          <ImageUpload
            src={userInfo?.profile_image || imageBakingDisplay}
            id="upload1"
            sizeClass="image-size-md"
            onChange={(e) => handleChangeImage(e)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="tab-detail">
      {isLoading && <Loading />}
      <div className="row">
        <h4>HỒ SƠ CÁ NHÂN</h4>
      </div>
      {fromUserInfo()}
    </div>
  )
}

export default UserInfo
