import Loading from '@components/Loading'
import { Pagi } from '@components/Pagination'
import { ORDER_STATUS_STRING, ROUTER, STRING } from '@constants/Constant'
import userApi from '@networks/userApi'
import { Empty } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import ModalDelete from '../../../../components/ModalDelete'

function ListCustomer(props) {
  const [isLoading, setLoading] = useState(false)
  const [listCustomer, setListCustomer] = useState([])
  const [paging, setPaging] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [id, setId] = useState()

  const getListCustomer = async (page) => {
    setLoading(true)
    try {
      const params = {
        status: '',
        page: page,
      }
      const res = await userApi.getListCustomer(params)
      setListCustomer(res.data)
      setPaging(res.pagging)
      setLoading(false)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
      setLoading(false)
    }
  }

  const handleOpenModalDelete = (id) => {
    setId(id)
    setOpenModalDelete(true)
  }

  const handleCloseModalDelete = () => {
    setOpenModalDelete(false)
  }

  const handlePageChange = (page) => {
    getListCustomer(page)
  }

  useEffect(() => {
    getListCustomer(currentPage)
  }, [])

  return (
    <>
      <div className="tab-detail">
        {isLoading && <Loading />}
        <ModalDelete
          id={id}
          openModalDelete={openModalDelete}
          handleCloseModalDelete={handleCloseModalDelete}
          handleOpenModalDelete={handleOpenModalDelete}
        />
        <div className="row" style={{ alignItems: 'center', marginBottom: '2rem' }}>
          <span>
            <h4 className="m-0 ml-5">LỊCH SỬ ĐẶT TOUR</h4>
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
                  <th>Email</th>
                  <th>Địa chỉ</th>
                  <th>CCCD</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listCustomer?.length > 0 ? (
                  listCustomer?.map((value, key) => (
                    <tr style={{ cursor: 'pointer' }} key={key}>
                      <td>{key + 1 + (paging.page - 1) * 12}</td>
                      <td>{value?.full_name || 'Chưa cập nhật'}</td>
                      <td>{value?.user_name}</td>
                      <td>{value?.email}</td>
                      <td>{value?.address ? value?.address : 'Chưa cập nhật'}</td>
                      <td>{value?.identify || 'Chưa cập nhật'}</td>
                      <td>{moment(value?.created_at, 'YYYY/MM/DD').format('DD/MM/YYYY')}</td>
                      <td>{value?.is_active === 1 ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}</td>
                      {value?.is_active === 1 ? (
                        <td onClick={() => handleOpenModalDelete(value?.id)}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </td>
                      ) : (
                        <td></td>
                      )}
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

export default ListCustomer
