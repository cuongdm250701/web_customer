import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import userApi from '@networks/userApi'
import { useForm } from 'react-hook-form'
import Form from '@components/Form'
import swal from 'sweetalert'
import Loading from '@components/Loading'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />
})

export default function ModalChangePassword(props) {
  const { openModalChangePassword, handleCloseModalChangePassword } = props
  const [isLoading, setLoading] = useState(false)
  const { register, errors, handleSubmit, watch, reset } = useForm({
    criteriaMode: 'all',
  })

  const handleChangePassword = async (data) => {
    setLoading(true)
    try {
      await userApi.changePassword(data)
      setLoading(false)
      swal('Thành công', 'Thay đổi mật khẩu thành công', 'success')
      handleCloseModalChangePassword()
      reset()
    } catch (err) {
      setLoading(false)
      swal('Thất bại', `${err.msg}`, 'error')
    }
  }

  return (
    <div>
      {isLoading && <Loading />}
      <Dialog
        open={openModalChangePassword}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseModalChangePassword}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="alert-dialog-slide-title">Đổi mật khẩu</DialogTitle>
        <form action="#" method="post" onSubmit={handleSubmit(handleChangePassword)}>
          <DialogContent>
            <div className="form-group first">
              <label htmlFor="old_pass">Mật khẩu hiện tại</label>
              <Form
                name="old_pass"
                errors={errors}
                register={register}
                validation={{
                  required: 'Vui lòng nhập đầy đủ thông tin',
                }}
                placeholder="Nhập mật khẩu hiện tại"
                type="password"
              />
            </div>

            <div className="form-group first">
              <label htmlFor="new_pass">Mật khẩu mới</label>
              <Form
                name="new_pass"
                errors={errors}
                register={register}
                validation={{
                  required: 'Vui lòng nhập đầy đủ thông tin',
                }}
                placeholder="Nhập mật khẩu mới"
                type="password"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModalChangePassword} style={{ color: 'red' }}>
              Đóng
            </Button>
            <Button type="submit" style={{ color: '#0abe35' }}>Xác nhận</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}
