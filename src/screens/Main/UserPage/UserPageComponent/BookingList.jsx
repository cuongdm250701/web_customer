import Loading from '@components/Loading'
import { Pagi } from '@components/Pagination'
import { ORDER_STATUS_STRING, ROUTER, STRING, STATUS_TRANSACTION } from '@constants/Constant'
import orderApi from '@networks/orderApi'
import { Empty } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPenAlt } from '@fortawesome/free-solid-svg-icons'
import ModalDeleteCate from '../../../../components/ModalDeleteCate'
import { Button } from 'react-bootstrap'
import ModalCreateCategory from '../../../../components/ModalCreateCategory'

function BookingList(props) {
  const [isLoading, setLoading] = useState(false)
  const [listOrder, setListOrder] = useState([])
  const [paging, setPaging] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [id, setId] = useState()
  const history = useHistory()

  const getListOrder = async (page) => {
    setLoading(true)
    try {
      const params = {
        status: '',
        page: page,
        search: '',
      }
      const res = await orderApi.listOrderCustomer(params)
      setListOrder(res.data)
      setPaging(res.pagging)
      setLoading(false)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    getListOrder(page)
  }

  const handleOpenModalDelete = (id) => {
    setId(id)
    setOpenModalDelete(true)
  }

  useEffect(() => {
    getListOrder(currentPage)
  }, [])

  const checkStatusOrder = (status) => {
    let result = ''
    switch (status) {
      case STATUS_TRANSACTION.ACCEPTED:
        result = 'Đã xác nhận'
        break
      case STATUS_TRANSACTION.REJECT:
        result = 'Đã từ chối'
        break
      default:
        result = 'Đang chờ xác nhận'
    }
    return result
  }

  return (
    <>
      <div className="tab-detail">
        {isLoading && <Loading />}
        <div className="row" style={{ alignItems: 'center', marginBottom: '2rem' }}>
          <span>
            <h4 className="m-0 ml-5">Danh sách đặt Tour</h4>
            {/* <Button onClick={() => history.push(ROUTER.TOUR_CREATE)} variant="success" className="m-0 ml-5">
              Thêm mới
            </Button> */}
          </span>
        </div>
        <>
          <div className="row ml-5 mt-3 mr-5">
            <Table striped hover responsive className="text-center" bordered>
              <thead style={{ color: '#0ABE35', backgroundColor: '#eeeeee' }}>
                <tr>
                  <th>STT</th>
                  <th>Tên khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Số lượng người</th>
                  <th>Ngày khởi hành</th>
                  <th>Ngày kết thúc</th>
                  <th>Mã tour</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {listOrder?.length > 0 ? (
                  listOrder?.map((value, key) => (
                    <tr
                      style={{ cursor: 'pointer' }}
                      key={key}
                      onClick={() => history.push(`${ROUTER.ORDER_DETAIL}/${value.id}`)}
                    >
                      <td>{key + 1 + (paging.page - 1) * 6}</td>
                      <td>{value?.customer_name || 'Chưa cập nhật'}</td>
                      <td>{value?.customer_phone || 'Chưa cập nhật'}</td>
                      <td>{value?.amount_people}</td>
                      <td>{moment(value?.checkin_at, 'YYYY/MM/DD').format('DD/MM/YYYY')}</td>
                      <td>{moment(value?.checkin_out, 'YYYY/MM/DD').format('DD/MM/YYYY')}</td>
                      <td>{value?.code}</td>
                      <td>{moment(value?.created_at, 'YYYY/MM/DD').format('DD/MM/YYYY')}</td>
                      <td>{checkStatusOrder(value?.status)}</td>
                    </tr>
                  ))
                ) : (
                  <td colSpan="8">
                    <Empty description="Không có dữ liệu" />
                  </td>
                )}
              </tbody>
            </Table>
          </div>
          <div className="mt-2">
            <Pagi paging={paging} handlePageChange={handlePageChange} />
          </div>
        </>
      </div>
    </>
  )
}

export default BookingList
