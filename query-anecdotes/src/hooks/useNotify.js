import { useContext } from 'react'
import { NotificationContext } from '../context/notificationContextInstance'

export const useNotify = () => {
  const context = useContext(NotificationContext)

  return context
}