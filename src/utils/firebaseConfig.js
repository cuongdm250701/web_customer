// import R from '@app/assets/R'
// import { ONESIGNAL_ANDROID_CHANNEL_ID, ONESIGNAL_APP_ID, TYPE_NOTIFICATION } from '@app/constants/Constant'
import firebase from 'firebase'
// import { Platform } from 'react-native'
// import reactotron from 'reactotron-react-native'
// import { soundPlay } from '@utils/SoundNotify'
import { notification } from '@utils/NotifycationDesktop'
import axios from 'axios'
import { ACCEPT_TYPE, SOCKET_URL, CHAT_STATUS } from '@constants/Constant'

const makeid = (length) => {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const ROOT = 'oho_tour'
export const THREAD = 'thread'
export const MESSAGES = 'messages'
export const CUSTOMER_AVATAR = 'customer_avatar'
export const CUSTOMER_COUNT_READ = 'customer_count_read'
export const CUSTOMER_PHONE = 'customer_phone'
export const SALE_AVATAR = 'sale_avatar'
export const SALE_COUNT_READ = 'sale_count_read'
export const SALE_PHONE = 'sale_phone'
export const THREAD_ID = 'thread_id'
export const USERS = 'users'
export const DEVICE_ID = 'device_id'
export const THREAD_FOCUS = 'thread_focus'
export const ROLE = 'role'
export const SALE_NAME = 'sale_name'
export const CUSTOMER_NAME = 'customer_name'
export const CUSTOMER_KEY = 'customer_key'
export const SALE_KEY = 'sale_key'

export const USER = 'user'
export const IS_CHAT_ROOM = 'isChatRoom'
export const LIST_BLOCK = 'listBlock'
export const IMAGE = 'image'
export const ID = 'id'
export const LAST_MESSAGE = 'last_message'
export const TIME = 'time'
export const MAX = 'max'
export const COUNT_READ = 'countRead'
export const IS_FOCUS = 'isFocus'
export const AVATAR = 'avatar'
export const NAME = 'name'
export const IS_ACTIVE = 'isActive'
export const DEVICEID = 'deviceID'
export const NAME_SALE = 'nameSale'

const FIREBASE_CONFIG = {
  DEV: {
    // apiKey: 'AIzaSyA3O5_tisuOhooo9xv8QqJ2EnAO5i4WLy8',
    // authDomain: 'my-project-71800.firebaseapp.com',
    // databaseURL: 'https://my-project-71800.firebaseio.com',
    // projectId: 'my-project-71800',
    // storageBucket: 'my-project-71800.appspot.com',
    // messagingSenderId: '1031849092426',
    // appId: '1:1031849092426:web:f45af540f3649619850db3',
    // measurementId: 'G-HYTLP8SVVG',

    apiKey: 'AIzaSyAoPbI9DL6rHDB5GPH-w1hUjjeDM03eKmI',
    authDomain: 'ohotour-efb66.firebaseapp.com',
    databaseURL: 'https://ohotour-efb66-default-rtdb.firebaseio.com',
    projectId: 'ohotour-efb66',
    storageBucket: 'ohotour-efb66.appspot.com',
    messagingSenderId: '762740267598',
    appId: '1:762740267598:web:5be2d4d8859e6f68df411f',
    measurementId: 'G-LRTXXFXTT8',
  },
  RELEASE: {
    apiKey: 'AIzaSyAoPbI9DL6rHDB5GPH-w1hUjjeDM03eKmI',
    authDomain: 'ohotour-efb66.firebaseapp.com',
    databaseURL: 'https://ohotour-efb66-default-rtdb.firebaseio.com',
    projectId: 'ohotour-efb66',
    storageBucket: 'ohotour-efb66.appspot.com',
    messagingSenderId: '762740267598',
    appId: '1:762740267598:web:5be2d4d8859e6f68df411f',
    measurementId: 'G-LRTXXFXTT8',
  },
}

const ONESIGNAL_APP_ID = '7c1a5535-d30a-4e58-b2bc-3bafd900fb5d'
const ONESIGNAL_ANDROID_CHANNEL_ID = 'c7385bce-66c0-4fd3-a105-e9580d71e483'

class Fire {
  constructor() {
    this.prepareInit()
  }

  static shared = Fire.shared || new Fire()
  static currentThread = ''

  prepareInit = () => {
    this.init()
  }

  init = () => {
    var __DEV__ = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    var firebaseConfig = __DEV__ ? FIREBASE_CONFIG.DEV : FIREBASE_CONFIG.RELEASE

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }
  }

  ref() {
    let usersRef = firebase.database().ref(ROOT)
    return usersRef
  }

  onThread = async (params, callback) => {
    const { currentUser } = params
    let res = []
    const ref = this.ref().child(THREAD)
    const isExist = await (await ref.once('value')).exists()
    if (!isExist) {
      callback([])
      return
    }
    ref
      .orderByChild(currentUser.keyChat)
      .equalTo(true)
      .on('value', (snapshot) => {
        callback(snapshot.val())
        console.log(snapshot.val())
      })
  }

  checkExistThread = async (threadID, callback) => {
    let ref = this.ref().child(THREAD)
    const isExist = (await ref.child(threadID).once('value')).exists()
    callback(isExist)
  }

  getThreadDetail = async (threadID, callback) => {
    let ref = this.ref().child(THREAD)
    const threadDetail = await (await ref.child(threadID).once('value')).val()
    callback(threadDetail)
  }

  createThread = async (params, callback) => {
    const { threadID, customerInfo, saleInfo } = params
    const time = new Date().getTime()
    let ref = this.ref().child(THREAD)

    await ref.child(threadID).update({
      [customerInfo.keyChat]: true,
      [saleInfo.keyChat]: true,
      [CUSTOMER_KEY]: customerInfo.keyChat,
      [SALE_KEY]: saleInfo.keyChat,
      [CUSTOMER_AVATAR]: customerInfo.avatar,
      [LAST_MESSAGE]: '',
      [CUSTOMER_PHONE]: customerInfo.phone,
      [TIME]: time,
      [SALE_AVATAR]: saleInfo.avatar,
      [SALE_COUNT_READ]: 0,
      [SALE_PHONE]: saleInfo.phone,
      [THREAD_ID]: threadID,
      [SALE_NAME]: saleInfo.name,
      [CUSTOMER_NAME]: customerInfo.name,
    })

    const threadDetail = await (await ref.child(threadID).once('value')).val()

    callback(threadDetail)
  }

  // getListMessages = async (threadID, callback) => {
  //   let ref = this.ref().child(MESSAGES)
  //   const listMessages = await (await ref.child(threadID).once('value')).val()
  //   callback(listMessages)
  // }

  createUser = async (params, callback) => {
    const { keyChat, deviceID, role, threadID } = params
    let ref = this.ref().child(USERS)

    await ref.child(keyChat).update({
      [ROLE]: role,
      [DEVICE_ID]: deviceID,
      [THREAD_FOCUS]: threadID,
    })
  }

  onSendMessage = async (threadID, message, callback) => {
    const ref = this.ref().child(MESSAGES).child(threadID)
    await ref.push({
      ...message,
      createdAt: new Date().getTime(),
    })

    const refThread = this.ref().child(THREAD)

    // reactotron.log(message)

    await refThread.child(threadID).update({
      [LAST_MESSAGE]: message.text || '[Hình ảnh]',
      [TIME]: message.createdAt.getTime(),
    })
    callback(threadID)
  }

  updateReadSale = async (params, callback) => {
    axios.defaults.baseURL = SOCKET_URL
    const { name, message, threadID } = params
    const refThread = this.ref().child(THREAD)
    const refUsers = this.ref().child(USERS)

    const saleKey = await (await refThread.child(threadID).child(SALE_KEY).once('value')).val()
    const saleInfo = await (await refUsers.child(saleKey).once('value')).val()

    if (threadID !== saleInfo[THREAD_FOCUS]) {
      const saleCountRead = await (await refThread.child(threadID).child(SALE_COUNT_READ).once('value')).val()
      await refThread.child(threadID).update({
        [SALE_COUNT_READ]: saleCountRead + 1,
      })
      // await axios
      //   .get('/socketio', {
      //     params: {
      //       type: CHAT_STATUS.CUSTOMER_CHAT,
      //       content: 'Bạn có tin nhắn mới từ ' + name + '!',
      //     },
      //   })
      //   .then(function (response) {
      //     console.log(response, 'value socket')
      //   })
      //   .catch(function (error) {})
    }

    let arrDeviceID = []

    if (saleInfo?.[DEVICE_ID] && threadID !== saleInfo?.[THREAD_FOCUS]) {
      this.oneSignalPushNotify(saleInfo?.[DEVICE_ID], params, message)
      await axios
        .get('/socketio', {
          params: {
            type: CHAT_STATUS.SALE_CHAT,
            content: 'Bạn có tin nhắn mới từ ' + name + '!',
          },
        })
        .then(function (response) {
          console.log(response, 'sale socket')
        })
        .catch(function (error) {})
    }
  }

  updateReadCustomer = async (params, callback) => {
    const { name, message, threadID } = params
    const refThread = this.ref().child(THREAD)
    const refUsers = this.ref().child(USERS)

    const customerKey = await (await refThread.child(threadID).child(CUSTOMER_KEY).once('value')).val()
    const cutomerInfo = await (await refUsers.child(customerKey).once('value')).val()

    if (threadID !== cutomerInfo[THREAD_FOCUS]) {
      const customerCountRead = await (await refThread.child(threadID).child(CUSTOMER_COUNT_READ).once('value')).val()
      await refThread.child(threadID).update({
        [CUSTOMER_COUNT_READ]: customerCountRead + 1,
      })
    }

    let arrDeviceID = []

    // if (!!arrDeviceID.length && !!isChatRoom) {
    //   while (!!arrDeviceID.length) {
    //     this.oneSignalPushNotify(arrDeviceID.splice(0, 80), { ...params, chatRoomID }, message)
    //   }
    // }
  }

  getConversation = (threadID, callback) => {
    const ref = this.ref().child(MESSAGES)

    if (this.currentThread) {
      ref.child(this.currentThread).off()
    }
    this.currentThread = threadID

    ref.child(threadID).on('value', (snapshot) => {
      callback(snapshot.val())
    })
  }

  checkExistChatRoom = async (params, callback) => {
    const ref = this.ref().child(THREAD)
    ref.child(params).once('value', (snapshot) => callback(snapshot.exists()))
  }

  updateFocus = async (params, callback) => {
    const { keyChat, threadID } = params
    const ref = this.ref().child(USERS)
    await ref.child(keyChat).update({
      [THREAD_FOCUS]: threadID,
    })
    callback(threadID)
  }

  resetFocus = async (params, callback) => {
    const { keyChat } = params
    const ref = this.ref().child(USERS)
    await ref.child(keyChat).update({
      [THREAD_FOCUS]: '',
    })
    callback(keyChat)
  }

  resetReadCustomer = async (params, callback) => {
    const { threadID } = params
    const ref = this.ref().child(THREAD)
    await ref.child(threadID).update({
      [CUSTOMER_COUNT_READ]: 0,
    })
    callback(threadID)
  }

  resetReadSale = async (params, callback) => {
    const { threadID } = params
    const ref = this.ref().child(THREAD)
    await ref.child(threadID).update({
      [SALE_COUNT_READ]: 0,
    })
    callback(threadID)
  }

  updateDeviceID = async (params, callback) => {
    const { keychat, deviceID, role } = params
    const refUser = this.ref().child(USERS)

    await refUser.child(keychat).update({
      [DEVICE_ID]: deviceID,
      [ROLE]: role,
    })
    callback(true)
  }

  oneSignalPushNotify = (arrDeviceID, params, message) => {
    const { threadID, name } = params
    var myHeaders = new Headers()
    // myHeaders.append('https', '//onesignal.com/api/v1/notifications')
    myHeaders.append('Authorization', 'Basic :Y2U1MWU2ZjctYTA1My00ZDk2LTgxODYtMDhhMjRjNTkwMTBi')
    myHeaders.append('Content-Type', 'application/json')
    var raw = JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      data: {
        // type: NOTIFICATION_TYPE.CHAT,
        type: 10,
        name,
        threadID,
      },
      headings: { en: name }, // tên người gửi
      contents: { en: message || 'Hình ảnh' },
      android_channel_id: ONESIGNAL_ANDROID_CHANNEL_ID,
      include_player_ids: [arrDeviceID],
    })
    var requestOptions = {
      method: 'POST',
      mode: 'cors',
      headers: myHeaders,
      credentials: 'same-origin',
      body: raw,
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }
    fetch('https://onesignal.com/api/v1/notifications', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))
  }

  uploadImage = async (result) => {
    const name = new Date().getTime()

    const storageRef = firebase.storage().ref(`${ROOT}/images/${name.toString()}`)
    const snapshot = await storageRef.put(result)
    return await snapshot.ref.getDownloadURL()
  }

  updateUserInfo = async (userState) => {
    const { customerName, urlAvatar, keyChat } = userState

    //update in thread
    const refThread = this.ref().child(THREAD)

    await (
      await refThread.once('value')
    ).forEach((elementThread) => {
      if (elementThread.child(USER).hasChild(`${keyChat}`)) {
        refThread
          .child(elementThread.key)
          .child(USER)
          .child(`${keyChat}`)
          .update({
            [NAME]: customerName,
            [AVATAR]: urlAvatar,
          })
        if (elementThread.child(IS_CHAT_ROOM).val().toString() == '0') {
          refThread.child(elementThread.key).update({
            [IMAGE]: urlAvatar,
            [NAME]: customerName,
          })
        }
      }
    })

    //update in detail
    const refDetail = this.ref().child(MESSAGES)
    await (
      await refDetail.once('value')
    ).forEach((elementDetail) => {
      elementDetail.forEach((elementMessage) => {
        if (elementMessage.child(USER).child('_id').val().toString() == `${keyChat}`)
          refDetail
            .child(elementDetail.key)
            .child(elementMessage.key)
            .child(USER)
            .update({
              [NAME]: customerName,
              [AVATAR]: urlAvatar,
            })
      })
    })
  }
}

export default Fire
