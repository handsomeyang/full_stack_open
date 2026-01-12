import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    changeNotification(state, action) {
      return action.payload
    },
    resetNotification() {
      return null
    }
  },
})

const { changeNotification, resetNotification } = notificationSlice.actions

export const setNotification = (content, timeout) => {
  return (dispatch) => {
    dispatch(changeNotification(content))
    setTimeout(() => dispatch(resetNotification()), timeout * 1000)
  }
}

export default notificationSlice.reducer
