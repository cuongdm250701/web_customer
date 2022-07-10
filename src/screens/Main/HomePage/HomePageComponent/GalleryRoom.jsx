import { useHistory, Link } from 'react-router-dom'
import { ROUTER } from '@constants/Constant'

import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/swiper.min.css'
import 'swiper/components/pagination/pagination.min.css'

import './styles.css'
import SwiperCore, { Pagination } from 'swiper/core'
import MediaCard from '../../../../components/CardGallery'

SwiperCore.use([Pagination])

const GalleryRoom = (props) => {
  const { cates } = props
  let history = useHistory()
  return (
    <>
      <div>
        <h4>Danh sách dịch vụ</h4>
        <p>Để mỗi chuyến đi là một hành trình truyền cảm hứng, mỗi căn phòng là một khoảng trời an yên</p>
      </div>

      <Swiper
        breakpoints={{
          0: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          400: {
            slidesPerView: 4,
            spaceBetween: 25,
          },
          500: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}
        loop={true}
        // className="mySwiper"
      >
        {cates?.length > 0 &&
          cates?.map((value, key) => (
            <SwiperSlide
              key={key}
              className="gallery-room_item"
              onClick={() => history.push(ROUTER.SERVICE_DETAIL + `/${value.id}`)}
            >
              <div
                key={key}
                // onClick={() => history.push(ROUTER.SERVICE_DETAIL + `/${value.id}`)}
                className="d-flex mb-3"
                style={{ flexDirection: 'column', justifyContent: 'center' }}
              >
                <img
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '8px' }}
                  src={value?.image}
                ></img>
                <div style={{ fontSize: '14px' }}>{value.name}</div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  )
}

export default GalleryRoom
