import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./registerSlice";
import myPageReducer from "./myPageSlice";
import findPasswordReducer from "./findPasswordSlice";
import courseReducer from "./courseSlice";

export const store = configureStore({
  reducer: {
    register: registerReducer,
    myPage: myPageReducer,
    findPassword: findPasswordReducer,
    course: courseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
