import { ClockCircleOutlined } from '@ant-design/icons'
import Loading from '@components/Loading'
import { textError } from '@components/TextValidation'
import ImageUpload from '@components/UploadImage.jsx'
import {
  ACCEPT_TYPE,
  CHAT_STATUS,
  ORDER_STATUS,
  ORDER_STATUS_STRING,
  SOCKET_URL,
  STATUS_SHOW_BUTTON_DEPOSIT_HISTORY,
  STATUS_SHOW_BUTTON_PAYMENT,
  STATUS_SHOW_BUTTON_PAYMENT_HISTORY,
  STRING,
  TRANSACTION,
  PEOPLE,
  PAYMENT_STATUS_NEW,
} from '@constants/Constant'
import { Container } from '@material-ui/core'
import orderApi from '@networks/orderApi'
import userApi from '@networks/userApi'
import { createFormData } from '@utils/createFormData'
import Fire from '@utils/firebaseConfig'
import { handleRating } from '@utils/handleRating.js'
import { notifySuccess } from '@utils/notify'
import { Checkbox, Empty, Image, Radio, Rate, Timeline } from 'antd'
import axios from 'axios'
import Cookies from 'js-cookie'
import moment from 'moment'
import React, { useEffect, useState, useRef } from 'react'
import { Button, FormControl, Modal, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'
import swal from 'sweetalert'

import { Tabs } from 'antd'

import QRCode from 'qrcode.react'

const { TabPane } = Tabs

function formatNumber(n) {
  return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function formatPrice(price) {
  if (!price) return ''
  return price.toString().split('.').join('')
}

function BookingRoomDetail(props) {
  const params = useParams()
  const orderId = params.id
  const history = useHistory()
  const [userInfo, setUserInfo] = useState({})
  const [orderDetail, setOrderDetail] = useState({})
  const [isLoading, setLoading] = useState(false)
  const [modalUpload, setModalUpload] = useState(false)
  const [orderTransitionType, setOrderTransitionType] = useState(TRANSACTION.DEPOSIT)
  const [imageBakingDisplay, setImageBakingDisplay] = useState('')
  const [imageBakingUpload, setImageBakingUpload] = useState('')
  const [paymentStatus, setpaymentStatus] = useState(1)
  const [isUsePoint, setUsePoint] = useState(false)
  const [point, setPoint] = useState('')
  const [isCheck, setIsCheck] = useState(false)
  const [statusName, setStatusName] = useState('')
  const [showModalRating, setShowModalRating] = useState(false)
  const [rateService, setRateService] = useState(5)
  const [rateSale, setRateSale] = useState(5)
  const [noteService, setNoteService] = useState('')
  const [noteSale, setNoteSale] = useState('')
  const [transactionDetail, setTransactionDetail] = useState('')
  const [showModalTransaction, setShowModalTransaction] = useState(false)
  const [transactionName, setTransactionName] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [showModalEditMember, setShowModalEditMember] = useState(false)
  const [memberInfo, setMemberInfo] = useState() //thông tin thành viên muốn chỉnh sửa
  const [openModalService, setOpenModalService] = useState(false)
  const [percent, setPercent] = useState()
  const memberRef = useRef(null)

  const { register, errors, handleSubmit, reset } = useForm({
    criteriaMode: 'all',
  })

  const getOrderDetail = async (id) => {
    setLoading(true)
    // console.log('id', id)
    try {
      const params = {
        order_id: id,
      }
      const res = await orderApi.orderDetail(params)
      console.log('rés ', res)
      setOrderDetail(res.data)
      // getStatusTour(res.data.status)
      setLoading(false)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
      setLoading(false)
    }
  }

  const updateTransaction = async () => {
    setLoading(true)
    try {
      await orderApi.updateTransaction(
        createFormData({
          order_id: orderId,
          image: imageBakingUpload,
        })
      )
      setLoading(false)
      swal('Thành công', 'Ảnh chuyển khoản đã được cập nhật', 'success').then(() => {
        clearData()
        getOrderDetail(orderId)
      })
      window.location.reload()
    } catch (err) {
      setLoading(false)
      swal('Thất bại', `${err.msg}`, 'error')
    }
  }

  const clearData = () => {
    setModalUpload(false)
    setOrderTransitionType(TRANSACTION.DEPOSIT)
    setImageBakingDisplay('')
    setImageBakingUpload('')
    setpaymentStatus(1)
    setUsePoint(false)
    setPoint('')
    setIsCheck(false)
  }

  const handleChangeImage = (event) => {
    if (event.target?.files?.length <= 0) {
      return
    }
    if (event.target.files[0] && !ACCEPT_TYPE.IMAGE.includes(event.target.files[0].type)) {
      alert('Định dạng ảnh không được hỗ trợ. Vui lòng chọn ảnh khác.')
      return
    }
    setImageBakingDisplay(
      event.target.files[0] && (window.URL || window.webkitURL).createObjectURL(event.target.files[0])
    )
    setImageBakingUpload(event.target.files[0])
  }

  const getUserInfo = async () => {
    try {
      const res = await userApi.userInfo()
      setUserInfo(res.data)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
    }
  }

  useEffect(async () => {
    // getFirstDataOrderDetail(orderId)
    getOrderDetail(orderId)
    getUserInfo()
  }, [])

  const checkCreatePayment = () => {
    setIsCheck(true)
    if (
      isUsePoint &&
      point &&
      (Number(formatPrice(point)) > Number(userInfo?.customer_info?.point) || Number(formatPrice(point)) < 0)
    ) {
    } else {
      updateTransaction()
    }
  }

  const renderUploadModal = () => {
    return (
      <Modal
        show={modalUpload}
        onHide={() => setModalUpload(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
        className="pb-0"
        scrollable={true}
      >
        <Modal.Header closeButton>
          <h5 className="m-0">Cập nhật thông tin chuyển khoản</h5>
        </Modal.Header>
        <Modal.Body className="custom-body">
          <div className="row">
            <div className="ml-3 mr-3" style={{ flexGrow: 1 }}>
              <label>Số tiền yêu cầu cọc thanh toán: </label>
              <span className="ml-2">
                {Number(1000000)?.toLocaleString('vi', {
                  currency: 'VND',
                }) || 'Chưa cập nhật'}{' '}
                VND
              </span>

              <br />
              <label className="mt-2">Thông tin tài khoản: </label>
              <br />
              <span className="ml-2">Quý khách vui lòng thanh toán qua số tài khoản: 107875448296</span>
              <br />
              <span className="ml-2">Ngân hàng: Vietinbank</span>
              <br />

              <label className="mt-2">Số tiền còn lại:</label>
              <span className="ml-2">
                {Number(orderDetail?.price - orderDetail?.deposited)?.toLocaleString('vi', {
                  currency: 'VND',
                }) || 'Chưa cập nhật'}{' '}
                VND
              </span>
              <br />
              <label className="mt-2">Note: </label>
              <span className="ml-2">
                Quý khách lưu ý trên đây chỉ là số tiền tính theo đầu người, chi phí phát sinh thêm sẽ được phía quản
                trị viên gọi điện trao đổi trực tiếp
              </span>
              <br />
              <label className="mt-2">Ảnh chuyển khoản</label>
              <br />
              <ImageUpload
                src={imageBakingDisplay}
                id="upload1"
                sizeClass="image-size-md"
                onChange={(e) => handleChangeImage(e)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="row d-flex justify-content-center">
            <Button variant="success" className="mr-2" onClick={() => checkCreatePayment()}>
              Cập nhật
            </Button>
            <Button variant="danger" onClick={() => setModalUpload(false)}>
              Đóng
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }

  const renderModalService = () => {
    return (
      <Modal
        show={openModalService}
        onHide={() => setOpenModalService(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
        className="pb-0"
        scrollable={true}
      >
        <Modal.Header closeButton>
          <h5 className="m-0">Danh sách dịch vụ đi kèm</h5>
        </Modal.Header>
        <Modal.Body className="custom-body">
          <Table striped bordered responsive hover className="text-center">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên dịch vụ</th>
                <th>Phát sinh bán</th>
              </tr>
            </thead>
            <tbody>
              {orderDetail?.order_surcharges?.length > 0 ? (
                orderDetail?.order_surcharges?.map((value, index) => (
                  <tr>
                    <td style={{ verticalAlign: 'middle' }}>{index + 1}</td>
                    <td style={{ verticalAlign: 'middle' }}>{value?.note || 'Chưa cập nhật'}</td>
                    <td style={{ verticalAlign: 'middle' }}>
                      {Number(value?.price).toLocaleString('vi', {
                        currency: 'VND',
                      }) + ' VNĐ' || 'Chưa cập nhật'}
                    </td>
                  </tr>
                ))
              ) : (
                <td colSpan="3">
                  <Empty description="Không có dịch vụ đi kèm" />
                </td>
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    )
  }

  const renderButtonDeposit = () => {
    return (
      <Button
        variant="success"
        className="mt-1 mr-1"
        onClick={() => {
          setpaymentStatus(6)
          setModalUpload(true)
        }}
      >
        Thanh toán
      </Button>
    )
  }

  const checkStatusOrder = (status) => {
    let s
    switch (status) {
      case 1:
        s = 'Đang chờ xử lý'
        break
      case 2:
        s = 'Đã xác nhận'
        break
      case 3:
        s = 'Đã từ chối'
        break
      default:
        s = 'Chưa cập nhật'
    }
    return s
  }

  return (
    <Container maxWidth="lg">
      {(Number(orderDetail.payment_status) === PAYMENT_STATUS_NEW.SUCCESS ||
        Number(orderDetail.payment_status) === PAYMENT_STATUS_NEW.ACCEPT_FOR_DESPOSIT ||
        paymentStatus === PAYMENT_STATUS_NEW.DESPOSIT_SUCCESS ||
        Number(orderDetail.payment_status) === PAYMENT_STATUS_NEW.CAN_CHECK_IN) &&
        renderUploadModal()}
      {renderModalService()}
      <div className="mt-4">
        {isLoading && <Loading />}
        <div className="row mt-3 mb-3">
          <h4 className="m-0 ml-3">CHI TIẾT ĐẶT PHÒNG</h4>
        </div>
        <div className="infor-status-tour row">
          <div className="col-md-9 info_left">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="title_tab">{orderDetail?.service_name || 'Chưa cập nhật'}</span>
              {/* <span className="status-tag">{statusName || 'Chưa cập nhật'}</span> */}
              <span
                style={{
                  backgroundColor: '#bdbdbd',
                  color: '#0abe35',
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '3px',
                }}
                className="ml-4"
              >
                {checkStatusOrder(orderDetail?.status) || 'Chưa cập nhật'}
              </span>
            </div>

            <div className="row">
              <div className="col-sm-3">
                <div>
                  <div className="title_info">Ngày ở</div>
                  <div>
                    {`${moment(orderDetail?.checkin_at).format('DD/MM/YYYY')} - ${moment(
                      orderDetail?.checkin_out
                    ).format('DD/MM/YYYY')}`}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="title_info">Số khách</div>
                  <div>{orderDetail?.amount_people}</div>
                </div>
                <div className="mt-2">
                  <div className="title_info">Đã tải ảnh chuyển khoản: </div>

                  <div>
                    {orderDetail?.image_confirm ? (
                      <img src={'https://fiddle.jshell.net/_display/2993de9164a5aafbf3b4.jpg'} />
                    ) : (
                      'chưa cập nhật ảnh'
                    )}
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div>
                  <div className="title_info">Sale chăm sóc: </div>
                  <div>{orderDetail?.sale}</div>
                </div>

                <div className="mt-2">
                  <div className="title_info">Dịch vụ đi kèm</div>
                  <div>
                    {orderDetail?.accompanied_service
                      ? Number(orderDetail?.accompanied_service).toLocaleString('vi', {
                          currency: 'VND',
                        }) + ' VNĐ'
                      : 'Chưa cập nhật'}
                  </div>
                  <i
                    style={{ color: '#0abe35', cursor: 'pointer', fontSize: '0.8rem' }}
                    onClick={() => setOpenModalService(true)}
                  >{`Xem chi tiết`}</i>
                </div>
              </div>
              <div className="col-sm-3">
                <div>
                  <div className="title_info">Khu vực</div>
                  <div>{orderDetail?.address}</div>
                </div>

                <div className={orderId === Cookies.get('orderHightlight') ? 'hightlight mt-2' : 'mt-2'}>
                  <div className="title_info">Tổng số tiền</div>
                  <div>
                    {Number(orderDetail?.price).toLocaleString('vi', {
                      currency: 'VND',
                    }) + ' VNĐ' || 'Chưa cập nhật'}
                  </div>
                </div>
              </div>

              <div className="col-sm-3">
                <div>
                  <div className="title_info">Mã code</div>
                  <div>
                    <QRCode value={orderDetail?.code || ''} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <span className="title_tab">Tư vấn</span>
            <div>Bạn cần giúp đỡ ?</div>
            <span
              style={{
                backgroundColor: '#bdbdbd',
                color: '#0abe35',
                fontWeight: 'bold',
                // padding: '4px 8px',
              }}
              className="ml-4"
            >
              <p>Gọi ngay hotline: 0922227384</p>
            </span>
          </div>
        </div>
        <div className="col-xl-12 col-xs-12">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {renderButtonDeposit()}
          </div>
        </div>
      </div>
    </Container>
  )
}

export default BookingRoomDetail
