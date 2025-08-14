import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../store/store";

import {
  useLazyGetCoursesQuery,
  useLazyGetMyCoursesQuery,
} from "../store/slices/coursesApiSlice";

const LinkTestComponent: React.FC = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth || {});

  
  const [apiResult, setApiResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [triggerGetCourses, coursesLazyResult] = useLazyGetCoursesQuery();

  // Redux state 디버깅
  console.log("🔍 현재 Redux state:", auth);
  console.log(
    "🔍 전체 state:",
    useSelector((state: RootState) => state)
  );

  const handleRTKQueryCall = async () => {
    setIsLoading(true);
    setError(null);
    setApiResult(null);

    try {
      console.log("🔍 RTK Query Lazy 호출 시작 - /api/courses/");
      const result = await triggerGetCourses({ page: 1, limit: 10 }).unwrap();
      console.log("✅ RTK Query 응답:", result);
      setApiResult(result);
    } catch (err: any) {
      console.error("❌ RTK Query 실패:", err);
      setError(err.message || JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          🎉 API 테스트 페이지
        </h1>

        {/* 인증 상태 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔐 현재 인증 상태</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Access Token:</strong>
              <span
                className={
                  auth?.accessToken ? "text-green-600" : "text-red-600"
                }
              >
                {auth?.accessToken ? " ✅ 있음" : " ❌ 없음"}
              </span>
            </div>
            <div>
              <strong>Refresh Token:</strong>
              <span
                className={
                  auth?.refreshToken ? "text-green-600" : "text-red-600"
                }
              >
                {auth?.refreshToken ? " ✅ 있음" : " ❌ 없음"}
              </span>
            </div>
            <div>
              <strong>User:</strong> {auth?.user?.email || "없음"}
            </div>
            <div>
              <strong>Role:</strong> {auth?.user?.role || "없음"}
            </div>
          </div>
          {auth?.tokenExpiryTime && (
            <div className="mt-2 text-sm">
              <strong>토큰 만료:</strong>{" "}
              {new Date(auth.tokenExpiryTime).toLocaleString()}
            </div>
          )}
        </div>

        {/* API 테스트 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🚀 API 테스트</h2>

          <div className="space-y-3 mb-4">
            <button
              onClick={handleRTKQueryCall}
              disabled={isLoading || !auth?.accessToken}
              className="block w-full text-left px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? "호출 중..." : "RTK Query로 /api/courses/ 호출"}
            </button>
          </div>

          {!auth?.accessToken && (
            <p className="text-red-600 text-sm">
              ⚠️ API 호출을 위해서는 먼저 로그인이 필요합니다.
            </p>
          )}

          {/* API 결과 */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-semibold text-red-800">❌ 오류 발생:</h3>
              <pre className="text-sm text-red-600 mt-2 whitespace-pre-wrap">
                {error}
              </pre>
            </div>
          )}

          {apiResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold text-green-800">✅ API 응답:</h3>
              <pre className="text-sm text-green-600 mt-2 whitespace-pre-wrap overflow-auto max-h-60">
                {JSON.stringify(apiResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* 기존 네비게이션 테스트 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">🔗 네비게이션 테스트</h3>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="block w-full text-left px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              홈으로 이동 (useNavigate)
            </button>

            <Link
              to="/"
              className="block w-full text-left px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              홈으로 이동 (Link)
            </Link>

            <button
              onClick={() => window.history.back()}
              className="block w-full text-left px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              뒤로 가기
            </button>
          </div>
        </div>

        {/* 현재 상태 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">📊 현재 상태</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>현재 URL:</strong> {window.location.href}
            </li>
            <li>
              <strong>Pathname:</strong> {window.location.pathname}
            </li>
            <li>
              <strong>Hash:</strong> {window.location.hash || "없음"}
            </li>
            <li>
              <strong>Timestamp:</strong> {new Date().toLocaleString()}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LinkTestComponent;
