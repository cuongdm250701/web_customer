import { useHistory, Link } from 'react-router-dom'
import { ROUTER, IMAGE_REGION } from '@constants/Constant'

import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/swiper.min.css'
import 'swiper/components/pagination/pagination.min.css'

import './styles.css'
import SwiperCore, { Pagination } from 'swiper/core'
import CardAttractive from '../../../../components/CardAttractive'

SwiperCore.use([Pagination])

const LocationAttractive = (props) => {
  const locations = [
    {
      id: 1,
      content:
        'Vùng Tây Bắc là vùng miền núi phía tây của miền Bắc Việt Nam, gồm 6 tỉnh Hòa Bình, Sơn La, Điện Biên, Lai Châu, Lào Cai, Yên Bái, có chung đường biên giới với Lào và Trung Quốc. Đến du lịch Tây Bắc du khách sẽ không khỏi nạc nhiên trước khung cảnh vùng núi trập trùng đẹp như tranh, trước cuộc sống của người dân vùng cao vẫn còn chút gì đó hoang sơ nhưng thật bình yên, êm ả.',
      is_active: 1,
      name: 'Tây Bắc',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiFOZwz5z4y9pYO44NyTDsY7QglAm0cFLehQ&usqp=CAU',
    },
    {
      id: 2,
      content:
        'Được thiên nhiên ưu đãi với cảnh quan thiên nhiên tuyệt đẹp của núi, thung lũng, thác nước và rừng mưa, du lịch Đông Bắc Việt Nam là điểm đến lý tưởng cho hành trình trải nghiệm những điều mới mẻ. Theo chân kinh nghiệm du lịch Đông Bắc tự túc tham gia vào các hoạt động thú vị chỉ có ở vùng Đông Bắc và ngắm nhìn vẻ đẹp hùng vĩ của núi rừng Đông Bắc.',
      is_active: 1,
      name: 'Đông Bắc',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4hx2u021qZ0ShPJaNB46RyCOU-cSVRZki8g&usqp=CAU',
    },
    {
      id: 3,
      content:
        'Đồng bằng sông Hồng  là một vùng đất rộng lớn nằm quanh khu vực hạ lưu sông Hồng thuộc miền Bắc Việt Nam, vùng đất bao gồm 10 tỉnh và thành phố như: Bắc Ninh, Hà Nam, Hà Nội, Hải Dương, Hải Phòng, Hưng Yên, Nam Định, Ninh Bình, Thái Bình và Vĩnh Phúc.',
      is_active: 1,
      name: 'Đồng bằng sông Hồng',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrtf1P7qRngFywbNHoX9b8T2QF9n_PWsEwXA&usqp=CAU',
    },
    {
      id: 4,
      content:
        'Bắc Trung Bộ nằm gọn trên dải đất hẹp nhất của Việt Nam, giữa một bên là dãy Trường Sơn hùng vĩ, một bên là biển Đông mênh mông. Với đường bờ biển dài cùng nhiều cửa khẩu giáp với Lào, khu vực này có vị trí đặc biệt quan trọng trong phát triển kinh tế - du lịch giữa Việt Nam với các nước trong khu vực trên hành lang Đông - Tây.',
      is_active: 1,
      name: 'Bắc Trung Bộ',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQWGL2CzIeRLHLdNElP2SwRfXqGwax2VwZKA&usqp=CAU',
    },
  ]
  let history = useHistory()

  const items = []
  const item =
    locations?.length &&
    locations.map((value) => {
      const item = IMAGE_REGION.find((i) => i.id === value?.id)
      items.push(
        <SwiperSlide>
          <CardAttractive
            image={item?.url}
            name={value?.name}
            handle={() => history.push(ROUTER.TOUR_PAGE + `/${value?.id}`)}
            description={item.shortDes}
          />
        </SwiperSlide>
      )
    })

  return (
    <div>
      <div>
        <h4>Địa điểm thu hút</h4>
        <p>Cùng TravelBot bắt đầu chuyến hành trình chinh phục thế giới của bạn</p>
      </div>
      <Swiper
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        loop={true}
        className="mySwiper"
        style={{ position: 'relative', minHeight: 400, paddingBottom: 2 }}
      >
        {/* {items} */}
        {locations?.length &&
          locations.map((value, key) => (
            <SwiperSlide key={key}>
              <CardAttractive
                image={value?.url}
                name={value?.name}
                // handle={() => history.push(ROUTER.TOUR_PAGE + `/${value?.id}`)}
                description={value.content}
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  )
}

export default LocationAttractive
