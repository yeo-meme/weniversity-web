import { configureStore } from '@reduxjs/toolkit'
import { authApiSlice } from '../auth/authApiSlice'
import authReducer from '../auth/authSlice';
import { useDispatch, useSelector } from 'react-redux'

//개발시
import { coursesApiSlice } from '../store/api/coursesApiSlice'; // 추가


export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [coursesApiSlice.reducerPath]: coursesApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApiSlice.middleware,coursesApiSlice.middleware ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector