import React, { memo } from "react";
import FilterButton from "./FilterButton";
import type { CourseFilters } from "../../types/course/course";

interface FilterSectionProps {
  filters: CourseFilters;
  activeFilters: {
    categories: string[];
    types: string[];
    levels: string[];
    prices: string[];
  };
  onFilterChange: (filterType: keyof CourseFilters, value: string) => void;
}

const FilterRow = memo<{
  title: string;
  options: string[];
  activeValues: string[];
  filterType: keyof CourseFilters;
  onFilterChange: (filterType: keyof CourseFilters, value: string) => void;
}>(({ title, options, activeValues, filterType, onFilterChange }) => (
  <div className="flex items-center p-5 border-gray-200">
    <h3 className="font-bold text-gray-700 mr-5 w-20">{title}</h3>
    <div className="flex flex-wrap gap-2 overflow-x-auto custom-scrollbar">
      {options.map(option => (
        <FilterButton
          key={option}
          label={option}
          value={option}
          isActive={activeValues.includes(option)}
          onClick={value => onFilterChange(filterType, value)}
        />
      ))}
    </div>
  </div>
));

FilterRow.displayName = "FilterRow";

const FilterSection: React.FC<FilterSectionProps> = memo(
  ({ filters, activeFilters, onFilterChange }) => {
    return (
      <div className="border-y-2 border-gray-200">
        <FilterRow
          title="주제"
          options={filters.categories}
          activeValues={activeFilters.categories}
          filterType="categories"
          onFilterChange={onFilterChange}
        />
        <FilterRow
          title="유형"
          options={filters.types}
          activeValues={activeFilters.types}
          filterType="types"
          onFilterChange={onFilterChange}
        />
        <FilterRow
          title="난이도"
          options={filters.levels}
          activeValues={activeFilters.levels}
          filterType="levels"
          onFilterChange={onFilterChange}
        />
        <FilterRow
          title="가격"
          options={filters.prices}
          activeValues={activeFilters.prices}
          filterType="prices"
          onFilterChange={onFilterChange}
        />
      </div>
    );
  }
);

FilterSection.displayName = "FilterSection";

export default FilterSection;
