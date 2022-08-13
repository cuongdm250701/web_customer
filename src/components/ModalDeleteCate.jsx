import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import loginApi from '@networks/loginApi'
import Cookie from 'js-cookie'
import { ROUTER } from '@constants/Constant'
import serviceApi from '@networks/serviceApi'
import swal from 'sweetalert'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />
})

export default function ModalDeleteCate(props) {
  const { openModalDelete, handleCloseModalDelete, handleOpenModalDelete, id } = props
  const [isLoading, setLoading] = useState(false)
  const deleteCategory = async (id) => {
    setLoading(true)
    try {
      await serviceApi.deleteCategory({ id })
      setLoading(false)
      swal('Thành công', 'Đã xóa danh mục này', 'success')
      window.location.href = ROUTER.TOUR_CATEGORY
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
      setLoading(false)
    }
  }

  return (
    <div>
      <Dialog
        open={openModalDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseModalDelete}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Bạn có muốn xóa danh mục này?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseModalDelete} style={{ color: 'red' }}>
            Đóng
          </Button>
          <Button onClick={() => deleteCategory(id)} style={{ color: '#0abe35' }}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
