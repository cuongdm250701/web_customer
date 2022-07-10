import React, { Component } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class ToastCustom extends Component {
  render() {
    return (
      <div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss={false}
          draggable={true}
          pauseOnHover={true}
          limit={2}
        />
      </div>
    )
  }
}

export default ToastCustom
