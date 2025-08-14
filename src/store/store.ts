import { configureStore } from '@reduxjs/toolkit'
import { authApiSlice } from '../auth/authApiSlice'
import { useDispatch, useSelector } from 'react-redux'


export const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector