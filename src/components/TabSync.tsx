// components/TabSync.tsx
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentTab } from "../store/slices/pageSlice";

const TabSync = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(" TabSync: 현재 경로", location.pathname); 

    const path = location.pathname;
    if (path === "/") {
      console.log("🎯 / → currentTab 'home'으로 설정");
      dispatch(setCurrentTab("home"));
    } else if (path === "/my-lectures") {
      console.log("🎯 /my-lectures → currentTab 'my-lectures'으로 설정");
      dispatch(setCurrentTab("my-lectures"));
    } else if (path === "/login") {
      console.log("🎯 /login → currentTab 'login'으로 설정");
      dispatch(setCurrentTab("login"));
    } else {
      console.log("⚠️ 알 수 없는 경로:", path);
    }
  }, [location.pathname, dispatch]);

  return null;
};

export default TabSync;
