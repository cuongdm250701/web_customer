import React, { useState, useEffect } from 'react'
import { Tooltip } from 'antd'
import { useLocation, useParams } from 'react-router-dom'
import swal from 'sweetalert'

import '../TourDetailPage.css'
import { STRING, ROUTER } from '@constants/Constant'
import { handleRating } from '@utils/handleRating.js'
import serviceApi from '@networks/serviceApi'
import { notifySuccess } from '@utils/notify'
import RoomIcon from '@material-ui/icons/Room'
import HowToRegIcon from '@material-ui/icons/HowToReg'
import CodeIcon from '@material-ui/icons/Code'

const TourDetailHeader = (props) => {
  const { tourDetail, userInfo, index, handleLike } = props
  const [listService, setListService] = useState([])
  const [checkLiked, setCheckLiked] = useState(false)
  const location = useLocation()
  const params = useParams()
  const isExist = location.pathname.search(ROUTER.TOUR_DETAIL_PAGE)

  const likeService = async (msg) => {
    try {
      await serviceApi.likeService({ service_id: tourDetail?.id })
      handleLike(params.id)
      notifySuccess(msg)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
    }
  }

  const listServiceLiked = async () => {
    try {
      const res = await serviceApi.listServiceLiked()
      setListService(res.data)
      checkIsExistInListServiceLiked(res.data)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
    }
  }

  // useEffect(() => {
  //   listServiceLiked()
  // }, [])

  const checkIsExistInListServiceLiked = (list) => {
    for (var value of list) {
      if (value.id == tourDetail?.id) {
        setCheckLiked(true)
        return true
      }
    }
    setCheckLiked(false)
    return false
  }

  return (
    <>
      {index === -1 ? (
        <div className="tour-code mt-3" style={{ alignItems: 'center' }}>
          <div>
            <span>
              <HowToRegIcon className="text-white bg-gray mb-1" style={{ borderRadius: '50%', padding: 3 }} />
            </span>
            <span className="star ml-1">{handleRating(tourDetail?.rating || 5)}</span>
          </div>
          <div>
            <span>
              <RoomIcon className="text-white bg-gray mb-1" style={{ borderRadius: '50%', padding: 3 }} />
            </span>
            <strong className="ml-1">{tourDetail?.address || ''}</strong>
          </div>

          <div>
            <span>
              <CodeIcon className="text-white bg-gray mb-1" style={{ borderRadius: '50%', padding: 3 }} />
            </span>
            <strong className="ml-1">{tourDetail?.code || (Math.random() + 1).toString(36).substring(7)}</strong>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default TourDetailHeader
