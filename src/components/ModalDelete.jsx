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
import userApi from '@networks/userApi'
import swal from 'sweetalert'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />
})

export default function ModalDelete(props) {
  const { openModalDelete, handleCloseModalDelete, handleOpenModalDelete, id } = props
  const [isLoading, setLoading] = useState(false)

  const deleteUser = async (id) => {
    setLoading(true)
    try {
      await userApi.deleteCustomer({ id })
      setLoading(false)
      swal('Thành công', 'Đã vô hiệu hóa tài khoản này', 'success')
      window.location.href = ROUTER.LIST_CUSTOMER
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
        <DialogTitle id="alert-dialog-slide-title">Bạn có muốn xóa?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseModalDelete} style={{ color: 'red' }}>
            Đóng
          </Button>
          <Button onClick={() => deleteUser(id)} style={{ color: '#0abe35' }}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
