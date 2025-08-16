import React, { memo, useMemo } from "react";
import ActiveFilterTags from "./ActiveFilterTags";
import ResetIcon from "../../assets/icon-reset.png";
import type { CourseFilters } from "../../types/course/course";

interface FilterControlsProps {
  activeFilters: {
    categories: string[];
    types: string[];
    levels: string[];
    prices: string[];
  };
  onFilterChange: (filterType: keyof CourseFilters, value: string) => void;
  onClearFilters: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = memo(
  ({ activeFilters, onFilterChange, onClearFilters }) => {
    const hasActiveFilters = useMemo(() => {
      return (
        !activeFilters.categories.includes("전체") ||
        activeFilters.types.length > 0 ||
        activeFilters.levels.length > 0 ||
        activeFilters.prices.length > 0
      );
    }, [activeFilters]);

    if (!hasActiveFilters) {
      return null;
    }

    return (
      <div className="flex items-center mt-8">
        <button
          onClick={onClearFilters}
          className="border rounded-lg px-4 py-3 flex text-sm hover:text-blue-500 transition-colors"
          aria-label="모든 필터 초기화"
        >
          <img src={ResetIcon} alt="" className="mr-2" />
          필터 초기화
        </button>

        <ActiveFilterTags
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
        />
      </div>
    );
  }
);

FilterControls.displayName = "FilterControls";

export default FilterControls;
