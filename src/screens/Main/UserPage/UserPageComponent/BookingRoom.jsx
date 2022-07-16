import Loading from '@components/Loading'
import { Pagi } from '@components/Pagination'
import { ORDER_STATUS_STRING, ROUTER, STRING } from '@constants/Constant'
import orderApi from '@networks/orderApi'
import { Empty } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert'

function BookingRoom(props) {
  const [isLoading, setLoading] = useState(false)
  const [listOrder, setListOrder] = useState([])
  const [paging, setPaging] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const history = useHistory()

  const getListOrder = async (page) => {
    setLoading(true)
    try {
      const params = {
        status: '',
        page: page,
      }
      const res = await orderApi.listOrder(params)
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

  useEffect(() => {
    getListOrder(currentPage)
  }, [])

  const findStatusBooking = (id) => {
    const status = ORDER_STATUS_STRING.findIndex((value) => value.value === id)
    return ORDER_STATUS_STRING[status].name
  }

  return (
    <>
      <div className="tab-detail">
        {isLoading && <Loading />}
        <div className="row" style={{ alignItems: 'center', marginBottom: '2rem' }}>
          <span>
            <h4 className="m-0 ml-2">LỊCH SỬ ĐẶT TOUR</h4>
          </span>
        </div>
        <>
          <div className="row mt-3">
            <Table striped hover responsive className="text-center" bordered>
              <thead style={{ color: '#0ABE35', backgroundColor: '#eeeeee' }}>
                <tr>
                  <th>STT</th>
                  <th>Địa điểm</th>
                  <th>{STRING.zone}</th>
                  {/* <th>{STRING.tourCode}</th> */}
                  <th>{STRING.startDate}</th>
                  <th>{STRING.toDate}</th>
                  <th>{STRING.roomType}</th>
                  <th>{STRING.people}</th>
                  <th>{STRING.status}</th>
                </tr>
              </thead>
              <tbody>
                {listOrder?.length > 0 ? (
                  listOrder?.map((value, key) => (
                    <tr
                      onClick={() => history.push(`${ROUTER.BOOKING_DETAIL}/${value.id}`)}
                      style={{ cursor: 'pointer' }}
                      key={key}
                    >
                      <td>{key + 1 + (paging.page - 1) * 12}</td>
                      <td>{value?.name || 'Chưa cập nhật'}</td>
                      <td>{value?.address}</td>
                      {/* <td>{value?.service_code}</td> */}
                      <td>{moment(value?.checkin_at, 'YYYY/MM/DD').format('DD/MM/YYYY')}</td>
                      <td>{moment(value?.checkin_out, 'YYYY/MM/DD').format('DD/MM/YYYY')}</td>
                      <td>Chưa cập nhật</td>
                      <td>{value?.amount_people}</td>
                      <td>{findStatusBooking(value?.status)}</td>
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

export default BookingRoom
