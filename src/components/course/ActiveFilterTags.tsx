import React, { memo } from "react";
import DeleteIcon from "../../assets/icon-X.png";
import type { CourseFilters } from "../../types/course/course";

interface ActiveFilterTagsProps {
  activeFilters: {
    categories: string[];
    types: string[];
    levels: string[];
    prices: string[];
  };
  onFilterChange: (filterType: keyof CourseFilters, value: string) => void;
}

const FilterTag = memo<{
  label: string;
  filterType: keyof CourseFilters;
  value: string;
  onRemove: (filterType: keyof CourseFilters, value: string) => void;
}>(({ label, filterType, value, onRemove }) => (
  <span className="inline-flex items-center text-sm rounded-md px-3 py-1 bg-slate-700 text-white">
    {label}
    <button
      onClick={() => onRemove(filterType, value)}
      className="ml-2 hover:text-blue-600"
      aria-label={`${label} 필터 제거`}
    >
      <img src={DeleteIcon} alt="" />
    </button>
  </span>
));

FilterTag.displayName = "FilterTag";

const ActiveFilterTags: React.FC<ActiveFilterTagsProps> = memo(
  ({ activeFilters, onFilterChange }) => {
    return (
      <div className="ml-6">
        <div className="flex flex-wrap gap-2">
          {/* 카테고리 필터 */}
          {!activeFilters.categories.includes("전체") &&
            activeFilters.categories.map(category => (
              <FilterTag
                key={`category-${category}`}
                label={category}
                filterType="categories"
                value={category}
                onRemove={onFilterChange}
              />
            ))}

          {/* 유형 필터 */}
          {activeFilters.types.map(type => (
            <FilterTag
              key={`type-${type}`}
              label={type}
              filterType="types"
              value={type}
              onRemove={onFilterChange}
            />
          ))}

          {/* 난이도 필터 */}
          {activeFilters.levels.map(level => (
            <FilterTag
              key={`level-${level}`}
              label={level}
              filterType="levels"
              value={level}
              onRemove={onFilterChange}
            />
          ))}

          {/* 가격 필터 */}
          {activeFilters.prices.map(price => (
            <FilterTag
              key={`price-${price}`}
              label={price}
              filterType="prices"
              value={price}
              onRemove={onFilterChange}
            />
          ))}
        </div>
      </div>
    );
  }
);

ActiveFilterTags.displayName = "ActiveFilterTags";

export default ActiveFilterTags;
