import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/register/RegisterPage";
import CoursePage from "./pages/course/CoursePage";
import CourseDetailPage from "./pages/courseDetail/CourseDetailPage";
import MyPage from "./pages/mypage/MyPage";
import Header from "./components/header/header";

function App2() {
  return (
    <HashRouter>
      <Header />
      <main className="max-w-[1190px] max-[834px]:max-w-[calc(100% - 32px)] mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          {/* <Route
            path="*"
            element={<div>404 - 페이지를 찾을 수 없습니다</div>}
          /> */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        </Routes>
        <div className="mt-4 flex gap-4"></div>
      </main>
    </HashRouter>
  );
}

export default App2;
