import Loading from '@components/Loading'
import { ROUTER } from '@constants/Constant'
import { Container } from '@material-ui/core'
import newsApi from '@networks/newsApi'
import serviceApi from '@networks/serviceApi'
import userApi from '@networks/userApi'
import Cookie from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import swal from 'sweetalert'
import Chat from '../../../Chat'
import BannerAds from '../ReviewPage/ReviewPageComponent/BannerAds'
import TourDetailBookingInfo from './TourDetailComponent/TourDetailBookingInfo'
import TourDetailContent from './TourDetailComponent/TourDetailContent'
import TourDetailHeader from './TourDetailComponent/TourDetailHeader'
import TourDetailImage from './TourDetailComponent/TourDetailImage'
import TourDetailReview from './TourDetailComponent/TourDetailReview'
import TourDetailSchedule from './TourDetailComponent/TourDetailSchedule'
import TourDetailService from './TourDetailComponent/TourDetailService'
import './TourDetailPage.css'

const TourDetailPage = () => {
  const [isLoading, setLoading] = useState(false)
  const [tourDetail, setTourDetail] = useState({})
  const [reviews, setReview] = useState({})
  const [newDetail, setNewDetail] = useState({})
  const [userInfo, setUserInfo] = useState({})
  const [tabActive, setTabActive] = useState('description')
  const [listService, setListService] = useState([])
  const params = useParams()
  const location = useLocation()
  const isLogin = Cookie.get('SESSION_ID')

  const index = location.pathname.search(ROUTER.NEW_DETAIL)

  const getListService = async (data) => {
    setLoading(true)
    try {
      const params = {
        search: '',
        is_active: '',
        service_category_id: '',
        regions_id: data?.region?.id || '',
        province_id: '',
        district_id: '',
        village_id: '',
        isCustomer: 1,
        list_service_category_id: '',
        list_regions_id: '',
      }
      const res = await serviceApi.listService(params)
      setListService(res.data)
      setLoading(false)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
      setLoading(false)
    }
  }

  const getTourDetail = async (id) => {
    setLoading(true)
    try {
      const res = await serviceApi.serviceDetail({ id })
      setTourDetail(res.data)
      getListService(res.data)
      setLoading(false)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
      setLoading(false)
    }
  }

  const getReview = async (id) => {
    setLoading(true)
    try {
      const res = await serviceApi.review({ id })
      setReview(res.data?.list_review)
      setLoading(false)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
      setLoading(false)
    }
  }

  const getUserInfo = async () => {
    try {
      const res = await userApi.userInfo()
      setUserInfo(res.data)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    isLogin && getUserInfo()
    // getReview(params.id)
    getTourDetail(params.id)
  }, [])

  return (
    <>
      <div>
        {isLoading && <Loading />}
        <div className="pl-2 pr-2">
          <TourDetailImage images={tourDetail?.service_images} />
          <Container maxWidth="lg">
            {index === -1 ? (
              <div className="row">
                <div className="col-sm-8 p-0">
                  <div>
                    <TourDetailHeader
                      tourDetail={tourDetail}
                      userInfo={userInfo}
                      index={index}
                      handleLike={getTourDetail}
                    />
                  </div>

                  <div className="mt-5">
                    <TourDetailContent content={tourDetail?.content} />
                  </div>

                  <div className="mt-5">
                    <TourDetailSchedule schedule={tourDetail?.schedule} />
                  </div>

                  <div className="mt-5 mb-5"></div>
                </div>
                <div className="col-sm-4 box_booking">
                  {Object.keys(userInfo).length !== 0 && (
                    <TourDetailBookingInfo tourDetail={tourDetail} userInfo={userInfo} />
                  )}
                  <BannerAds listService={listService} />
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-sm-8 p-0">
                  <TourDetailHeader
                    tourDetail={tourDetail}
                    userInfo={userInfo}
                    index={index}
                    handleLike={getTourDetail}
                  />
                  <TourDetailContent content={tourDetail?.content} />
                </div>
                <div className="col-sm-4 pr-0">
                  <BannerAds listService={listService} />
                </div>
              </div>
            )}
            {/* </div> */}
          </Container>
        </div>
      </div>
      {isLogin && <Chat />}
    </>
  )
}

export default TourDetailPage
