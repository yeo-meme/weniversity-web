// import { Routes, Route, useNavigate } from "react-router-dom";
// import { useAppSelector, useAppDispatch } from "./hooks/hook";
// import { logout } from "./auth/authSlice";
// import { setCurrentTab } from "./store/slices/pageSlice";

// import LoginPage from "./page/login/login";
// import MyLectures from "./page/my-lectures/my-lectures";
// import Header from "./components/header/header";
// import HeroSection from "./components/hero/hero-section";
// import TabSync from "./components/TabSync";

// import {
//   selectAuthToken,
//   selectCurrentUser,
//   selectIsAuthenticated,
// } from "./auth/authSlice";

// function HomePage() {
//   const navigate = useNavigate();
//   return <HeroSection onLogin={() => navigate("/login")} />;
// }

// function AppContent() {
//   const dispatch = useAppDispatch();
//   //   const { isAuthenticated,isHydrated } = useAppSelector((state) => state.auth);

//   const currentUser = useAppSelector(selectCurrentUser);
//   const token = useAppSelector(selectAuthToken);
//   const isAuthenticated = useAppSelector(selectIsAuthenticated);
//   const { isHydrated } = useAppSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const { currentTab } = useAppSelector((state) => state.page); // ✅ page 슬라이스에서 읽기
//   console.log("현재 Redux currentTab:", currentTab);

//   console.log("=== Auth 상태 디버깅 ===");
//   console.log("🔒 isAuthenticated:", isAuthenticated);
//   console.log("📧 user.email:", currentUser?.email);
//   console.log("🎫 token 존재:", !!token);
//   console.log("👤 전체 user:", currentUser?.role);
//   console.log("🎯 currentTab:", currentTab);
//   console.log("========================");

//   const handleLoginSuccess = () => {
//     dispatch(setCurrentTab("home"));
//     navigate("/");
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     dispatch(setCurrentTab("home"));
//     navigate("/");
//   };

//   console.log(localStorage.getItem("persist:auth"));

//   if (!isHydrated) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div>로딩 중...</div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <TabSync />
//       <Header
//         onLogin={() => navigate("/login")}
//         onLogout={handleLogout}
//         onGoToMain={() => navigate("/")}
//       />
//       <main className="max-w-[1190px] max-[834px]:max-w-[calc(100% - 32px)] mx-auto">
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route
//             path="/login"
//             element={
//               <LoginPage
//                 onLoginSuccess={handleLoginSuccess}
//                 onGoToMain={() => navigate("/")}
//               />
//             }
//           />
//           <Route
//             path="/my-lectures"
//             element={
//               isAuthenticated ? (
//                 <MyLectures />
//               ) : (
//                 <LoginPage
//                   onLoginSuccess={handleLoginSuccess}
//                   onGoToMain={() => navigate("/")}
//                 />
//               )
//             }
//           />
//           <Route path="*" element={<HomePage />} />
//         </Routes>
//       </main>
//     </>
//   );
// }

// export default AppContent;
