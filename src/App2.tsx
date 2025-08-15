import { HashRouter, Route, Routes } from "react-router-dom";
import RegisterPage from "./page/register/RegisterPage.tsx";
import CoursePage from "./page/course/CoursePage.tsx";
import CourseDetailPage from "./page/courseDetail/CourseDetailPage.tsx";
import MyPage from "./page/mypage/MyPage.tsx";
import LoginPage from "./page/login/login.tsx";
import HomePage from "./page/main/HomePage.tsx";
import Layout from "./page/main/Layout.tsx";
import NotFoundPage from "./page/NotFoundPage.tsx";
import SearchPage from "./page/search/SearchPage.tsx";

function App2() {
  return (
    <HashRouter>
      <Routes>
        {/* 레이아웃이 필요한 페이지들 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="courses" element={<CoursePage />} />
          <Route path="courses/:courseId" element={<CourseDetailPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>

        {/* 레이아웃이 필요없는 독립적인 페이지들 */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* 404 페이지 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App2;
