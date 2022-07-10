import { toast } from 'react-toastify'

export const notifySuccess = (mes) =>
  toast.success(mes)

export const notifyFail = (mes) =>
  toast.error(mes)

export const notifyWarning = (mes) =>
  toast.warning(mes)
