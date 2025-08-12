import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../store/slices/apiSlice'
import chapterReducer from "../store/slices/chapterSlice";
import { useDispatch, useSelector } from 'react-redux'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    chapter: chapterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector