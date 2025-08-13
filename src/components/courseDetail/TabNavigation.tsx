import React from "react";
import type { TabType } from "../../types/courseDetail";

interface TabInfo {
  key: TabType;
  label: string;
}

interface TabNavigationProps {
  tabs: TabInfo[];
  activeTab: TabType;
  onTabClick: (tabKey: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabClick,
}) => {
  return (
    <div className="mt-16 border-b border-gray-300 sticky top-0 bg-white z-10">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <nav className="flex justify-center items-center space-x-10 py-3">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabClick(tab.key)}
              className={`font-medium ${
                activeTab === tab.key
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-blue-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default React.memo(TabNavigation);
