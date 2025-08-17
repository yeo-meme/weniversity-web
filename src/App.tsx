import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import RegisterPage from "./page/register/RegisterPage.tsx";
import CoursePage from "./page/course/CoursePage.tsx";
import CourseDetailPage from "./page/courseDetail/CourseDetailPage.tsx";
import MyPage from "./page/mypage/MyPage.tsx";
import LoginPage from "./page/login/login.tsx";
import HomePage from "./page/main/HomePage.tsx";
import Layout from "./page/main/Layout.tsx";
import NotFoundPage from "./page/NotFoundPage.tsx";
import SearchPage from "./page/search/SearchPage.tsx";
import MyLecturesPage from "./page/myLectures/MyLecturesPage.tsx";
import StudyPlayer from "./components/video/StudyLayoutPlayerBasic.tsx";
import { useAuth } from "./hooks/useAuth.ts";

// 로그인된 상태에서 접근하면 홈으로 리다이렉트
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

// 로그인이 필요한 페이지 용
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        {/* 로그인 없이도 접근 가능한 페이지들 */}
        <Route path="courses" element={<CoursePage />} />
        <Route path="courses/:courseId" element={<CourseDetailPage />} />
        <Route path="search" element={<SearchPage />} />

        {/* 로그인이 필요한 페이지들을 그룹화 */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route path="mypage" element={<MyPage />} />
                <Route path="my-lectures" element={<MyLecturesPage />} />
                <Route path="studyplayer" element={<StudyPlayer />} />
              </Routes>
            </PrivateRoute>
          }
        />
      </Route>

      {/* 로그인된 사용자는 접근 불가 */}
      <Route
        path="login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
