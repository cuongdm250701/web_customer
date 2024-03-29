import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'

import SlideShowBanner from './HomePageComponent/SlideShowBanner'
import GalleryRoom from './HomePageComponent/GalleryRoom'
import LocationAttractive from './HomePageComponent/LocationAttractive'
import TourFavourite from './HomePageComponent/TourFavourite'
import ReviewTour from './HomePageComponent/ReviewTour'

import filterApi from '@networks/filterApi'
import newsApi from '@networks/newsApi'
import serviceApi from '@networks/serviceApi'
import Loading from '@components/Loading'
import './HomePage.css'
import { Container } from '@material-ui/core'
import Cookie from 'js-cookie'
import { ROUTER } from '@constants/Constant'
import { useHistory } from 'react-router-dom'
import Chat from '../../../Chat'

function HomePage(props) {
  const [isLoading, setLoading] = useState(false)
  const [locations, setLocations] = useState([])
  const [banners, setBanners] = useState([])
  const [toursFavourite, setToursFavourite] = useState([])
  const [cates, setCates] = useState([])
  const isLogin = Cookie.get('SESSION_ID')
  const history = useHistory()
  const [reviews, setReviews] = useState([
    {
      id: 1,
      image: 'http://ohotour.oss-ap-southeast-1.aliyuncs.com/image/ba21a120e00df334354c5354a7d7f943.jpeg',
      title: 'DỊP LỄ 30/4 KHIÊN NGAY COMBO DU LỊCH ĐẢO LÝ SƠN 2N1Đ GIÁ CHỈ 799.000Đ',
    },
    {
      id: 2,
      image: 'http://ohotour.oss-ap-southeast-1.aliyuncs.com/image/4c7b15dd6c6b60ab29c76422fd71ea68.jpeg',
      title: 'TOUR DU LỊCH HUẾ – ĐÀ NẴNG- SƠN TRÀ- NGŨ HÀNH SƠN- HỘI AN – BÀ NÀ HILL 3N2Đ',
    },
    {
      id: 3,
      image: 'http://ohotour.oss-ap-southeast-1.aliyuncs.com/image/40e7ecef337d6d8eb720dfff0d4f5b47.jpeg',
      title: 'Travel Bot',
    },
  ])

  const getListLocation = async () => {
    setLoading(true)
    try {
      const res = await filterApi.regions({ search: '' })
      setLocations(res.data)
      setLoading(false)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
      setLoading(false)
    }
  }

  const getHomeData = async () => {
    setLoading(true)
    try {
      const res = await newsApi.home({ limit: '' })
      console.log('res home', res)
      setBanners(res.data[0])
      setToursFavourite(res.data[1])
      setReviews(res.data[2])
      setLoading(false)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
      setLoading(false)
    }
  }

  const getListCate = async () => {
    setLoading(true)
    try {
      const res = await serviceApi.listCate({ search: '', is_active: '' })
      setCates(res.data)
      setLoading(false)
    } catch (err) {
      swal('Thất bại', `${err.msg}`, 'error')
      setLoading(false)
    }
  }

  useEffect(() => {
    // getListLocation()
    // getHomeData()
    getListCate()
    window.scrollTo(0, 0)
  }, [])

  const getReviewImages = () => {
    let reviewImages = []
    const temp =
      reviews?.length > 0 &&
      reviews?.map((value) => {
        reviewImages.push({ url: value.image, id: value.id, title: value.title })
      })

    return reviewImages
  }

  return (
    <>
      <SlideShowBanner banners={banners} />
      <Container maxWidth="lg">
        {isLoading && <Loading />}
        {!isLogin && (
          <div className="mb-5">
            <h3>Chào mừng đến với OhoTour</h3>
            <p>Đặt chỗ ở, homestay, cho thuê xe, trải nghiệm và nhiều hơn nữa trên OhoTour</p>
            <p>
              <strong onClick={() => history.push(ROUTER.LOGIN)} style={{ cursor: 'pointer' }}>
                Đăng nhập
              </strong>{' '}
              hoặc{' '}
              <strong onClick={() => history.push(ROUTER.REGISTER)} style={{ cursor: 'pointer' }}>
                Đăng ký
              </strong>{' '}
              để trải nghiệm !
            </p>
          </div>
        )}
        {/* <div className="body_fluid"> */}
        <GalleryRoom cates={cates} />
        <LocationAttractive locations={locations} />
        {/* <TourFavourite toursFavourite={toursFavourite} /> */}
        <ReviewTour reviews={reviews} reviewImages={getReviewImages()} />
        {/* </div> */}
      </Container>
      {isLogin && <Chat />}
    </>
  )
}

export default HomePage
