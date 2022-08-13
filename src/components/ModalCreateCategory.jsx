import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import serviceApi from '@networks/serviceApi'
import Cookie from 'js-cookie'
import { ROUTER } from '@constants/Constant'
import { useForm } from 'react-hook-form'
import { FormControl } from 'react-bootstrap'
import { ErrorMessage } from '@hookform/error-message'
import swal from 'sweetalert'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />
})

export default function ModalCreateCategory(props) {
  const { openModalCreateCate, handleCloseModalCreateCate, handleOpenModalCreateCate } = props
  const [isLoading, setLoading] = useState(false)
  const { register, errors, handleSubmit } = useForm({
    criteriaMode: 'all',
  })
  const [categoryName, setCategoryName] = useState('')

  const createCate = async (payload) => {
    setLoading(true)
    try {
      await serviceApi.createCategory(payload)
      setLoading(false)
      swal('Thành công', 'Lưu thành công', 'success').then(window.location.reload())
    } catch (err) {
      setLoading(false)
      swal('Thất bại', `${err.msg}`, 'error')
    }
  }
  const onSubmit = (data) => {
    createCate({ ...data })
  }
  return (
    <div>
      <Dialog
        open={openModalCreateCate}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseModalCreateCate}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Thêm mới danh mục</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div className="row mt-4">
              <div className="col-sm-6">
                <form action="#" method="post" onSubmit={handleSubmit(onSubmit)}>
                  <div className="row mb-3"></div>

                  <div className="row">
                    <div className="col-sm-2 mt-2 p-0">Tên *:</div>
                    <div className="col-sm-10 p-0 ml-5">
                      <FormControl
                        type="text"
                        name="name"
                        placeholder="Nhập tên danh mục"
                        ref={register({
                          required: 'Vui lòng điền đầy đủ thông tin',
                        })}
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
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
                  <div className="row mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="submit" variant="success" className="mr-2 mt-2">
                      Thêm mới
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalCreateCate} style={{ color: 'red' }}>
            Đóng
          </Button>
          {/* <Button type="submit" style={{ color: '#0abe35' }}>
            Thêm mới
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  )
}
