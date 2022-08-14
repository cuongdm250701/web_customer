import Loading from '@components/Loading'
import { Pagi } from '@components/Pagination'
import { ORDER_STATUS_STRING, ROUTER, STRING } from '@constants/Constant'
import serviceApi from '@networks/serviceApi'
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

function TourListService(props) {
  const [isLoading, setLoading] = useState(false)
  const [listCategory, setListCategory] = useState([])
  const [paging, setPaging] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [opentModalCreateCate, setOpenModalCreateCate] = useState(false)
  const [id, setId] = useState()
  console.log('id', id)
  const history = useHistory()

  const getListTour = async (page) => {
    setLoading(true)
    try {
      const params = {
        status: '',
        page: page,
        search: '',
      }
      const res = await serviceApi.listService(params)
      setListCategory(res.data)
      setPaging(res.pagging)
      setLoading(false)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    getListTour(page)
  }

  const handleOpenModalDelete = (id) => {
    setId(id)
    setOpenModalDelete(true)
  }

  const handleCloseModalDelete = () => {
    setOpenModalDelete(false)
  }

  const handleOpenModalCreateCate = () => {
    setOpenModalCreateCate(true)
  }

  useEffect(() => {
    getListTour(currentPage)
  }, [])

  return (
    <>
      <div className="tab-detail">
        {isLoading && <Loading />}
        <ModalDeleteCate
          id={id}
          openModalDelete={openModalDelete}
          handleCloseModalDelete={handleCloseModalDelete}
          handleOpenModalDelete={handleOpenModalDelete}
        />
        <div className="row" style={{ alignItems: 'center', marginBottom: '2rem' }}>
          <span>
            <h4 className="m-0 ml-5">Danh sách Tour</h4>
            <Button onClick={handleOpenModalCreateCate} variant="success" className="m-0 ml-5">
              Thêm mới
            </Button>
          </span>
        </div>
        <>
          <div className="row ml-5 mt-3 mr-5">
            <Table striped hover responsive className="text-center" bordered>
              <thead style={{ color: '#0ABE35', backgroundColor: '#eeeeee' }}>
                <tr>
                  <th>STT</th>
                  <th>Tên</th>
                  <th>Trạng thái</th>
                  <th>Danh mục</th>
                  <th>Liên hệ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listCategory?.length > 0 ? (
                  listCategory?.map((value, key) => (
                    <tr style={{ cursor: 'pointer' }} key={key}>
                      <td>{key + 1 + (paging.page - 1) * 12}</td>
                      <td>{value?.name || 'Chưa cập nhật'}</td>
                      <td>{value?.is_active === 1 ? 'Đang hoạt động' : 'Đã xóa'}</td>
                      <td>{value?.category_name}</td>
                      <td>{value?.contact_phone}</td>
                      {value?.is_active === 1 ? (
                        <td>
                          <FontAwesomeIcon
                            onClick={() => history.push(`${ROUTER.TOUR_DETAIL}/${value.id}`)}
                            icon={faPenAlt}
                            className="mr-2"
                          />
                          <FontAwesomeIcon onClick={() => handleOpenModalDelete(value?.id)} icon={faTrashAlt} />
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

export default TourListService
