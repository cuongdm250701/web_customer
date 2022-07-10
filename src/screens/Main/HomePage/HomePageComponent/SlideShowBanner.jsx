import { ROUTER } from '@constants/Constant'
import DateFnsUtils from '@date-io/date-fns'
import { Button, Container, TextField } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import React from 'react'
import { useHistory } from 'react-router-dom'
import 'swiper/components/navigation/navigation.min.css'
import 'swiper/components/pagination/pagination.min.css'
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper/core'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'
import './styles.css'

SwiperCore.use([Autoplay, Pagination, Navigation])

const SlideShowBanner = (props) => {
  const banners = [
    {
      id: 1,
      image:
        'https://firebasestorage.googleapis.com/v0/b/graduation-4e427.appspot.com/o/images%2Fslides%2F1590223194666.webp?alt=media&token=87bf5316-5a18-4443-937e-e3de111a5c4b',
      title: 'Du lịch Hạ Long',
    },
    {
      id: 2,
      image:
        'https://firebasestorage.googleapis.com/v0/b/graduation-4e427.appspot.com/o/images%2Fslides%2F1590223140351.webp?alt=media&token=dd4cb5f9-59be-4029-8ec3-c23726d6b55b',
      title: 'Du lịch Đà Nẵng',
    },
    {
      id: 3,
      image:
        'https://firebasestorage.googleapis.com/v0/b/graduation-4e427.appspot.com/o/images%2Fslides%2F1590223078771.webp?alt=media&token=d2618751-158d-44d6-8b53-79734a4ac53f',
      title: 'Du lịch Phú Quốc',
    },
  ]
  console.log('banner', banners)
  const [selectedDate, setSelectedDate] = React.useState()
  const [name, setName] = React.useState('')

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }
  let history = useHistory()

  const handleChangeName = (e) => {
    setName(e.target.value)
  }

  const handleGotoResultSearchPage = () => {
    if (name) {
      localStorage.setItem('name', name)
      history.push(ROUTER.RESULT_SEARCH)
    }
  }

  return (
    <div className="banner-container" style={{ position: 'relative' }}>
      <Container maxWidth="lg" className="box-search_fluid">
        <div className="banner_box-search row m-0">
          <div className="col-md-3 item-search-in-box" style={{ borderRight: '1px solid gray' }}>
            <strong className="m-0">Địa điểm du lịch</strong>
            <TextField
              placeholder="Bạn muốn đi đâu"
              style={{ width: '100%' }}
              onChange={handleChangeName}
              value={name}
            />
          </div>
          <div className="col-md-3 text-right btn_search_inbox_home">
            <Button
              variant="contained"
              style={{ backgroundColor: '#0ABE35', color: '#fff' }}
              startIcon={<SearchIcon />}
              onClick={() => handleGotoResultSearchPage()}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </Container>
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="mySwiper"
        style={{ marginTop: 0 }}
      >
        {banners?.length > 0 &&
          banners?.map((value, key) => (
            <SwiperSlide>
              <img
                className="d-block w-100 img-banner"
                src={value?.image}
                style={{ borderRadius: 0 }}
                // onClick={() => history.push(ROUTER.NEW_DETAIL + `/${value.id}`)}
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  )
}

export default SlideShowBanner
