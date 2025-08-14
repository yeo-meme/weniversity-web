import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./registerSlice";
import myPageReducer from "./myPageSlice";
import findPasswordReducer from "./findPasswordSlice";
import courseReducer from "./courseSlice";
import courseDetailReducer from "./courseDetailSlice";

export const store = configureStore({
  reducer: {
    register: registerReducer,
    myPage: myPageReducer,
    findPassword: findPasswordReducer,
    course: courseReducer,
    courseDetail: courseDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
