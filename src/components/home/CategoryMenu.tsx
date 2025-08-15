import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/redux-hooks";
import { setActiveFilter, clearAllFilters } from "../../store/courseSlice";
import categoryAll from "../../assets/category_all.png";
import categoryBack from "../../assets/category_back.png";
import categoryFront from "../../assets/category_front.png";
import categoryData from "../../assets/category_data.png";
import categoryDesign from "../../assets/category_design.png";
import categoryAi from "../../assets/category_ai.png";
import categoryEtc from "../../assets/category_etc.png";

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  filterValue: string;
}

const CategoryMenu: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const categories: CategoryItem[] = [
    {
      id: "all",
      name: "전체 보기",
      icon: categoryAll,
      filterValue: "전체",
    },
    {
      id: "frontend",
      name: "프론트엔드",
      icon: categoryFront,
      filterValue: "프론트엔드",
    },
    {
      id: "backend",
      name: "백엔드",
      icon: categoryBack,
      filterValue: "백엔드",
    },
    {
      id: "data",
      name: "데이터 분석",
      icon: categoryData,
      filterValue: "데이터 분석",
    },
    {
      id: "ai",
      name: "AI",
      icon: categoryAi,
      filterValue: "AI",
    },
    {
      id: "design",
      name: "디자인",
      icon: categoryDesign,
      filterValue: "디자인",
    },
    {
      id: "other",
      name: "기타",
      icon: categoryEtc,
      filterValue: "기타",
    },
  ];

  const handleCategoryClick = useCallback(
    (category: CategoryItem) => {
      dispatch(clearAllFilters());

      if (category.id !== "all") {
        dispatch(
          setActiveFilter({
            filterType: "categories",
            value: category.filterValue,
          })
        );
      }

      navigate("/courses");
    },
    [dispatch, navigate]
  );

  return (
    <section className="w-full max-w-[880px] mx-auto px-5 py-8">
      <div className="grid grid-cols-7 gap-4 max-[834px]:grid-cols-4 max-[834px]:gap-3">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`
              flex flex-col items-center justify-center
              p-4 rounded-[20px] 
              transition-all duration-200 ease-in-out
              hover:scale-105 hover:shadow-md
            text-gray-700 hover:bg-blue-200
              max-[834px]:p-3
            `}
            aria-label={`${category.name} 카테고리로 이동`}
          >
            {/* 아이콘 영역 */}
            <div className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center max-[834px]:w-10 max-[834px]:h-10 max-[834px]:mb-2">
              <img
                src={category.icon}
                alt={`${category.name} 아이콘`}
                className="max-[834px]:w-6 max-[834px]:h-6 object-contain"
              />
            </div>

            {/* 카테고리 이름 */}
            <span className="text-sm font-medium text-center leading-tight max-[834px]:text-xs">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default React.memo(CategoryMenu);
