import React from "react";
import type { CourseFAQ } from "../../types/courseDetail";
import DownIcon from "../../assets/icon-down.png";

interface FAQSectionProps {
  faqData: CourseFAQ[];
  onFAQToggle: (faqId: string) => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqData, onFAQToggle }) => {
  return (
    <>
      <h3 className="text-center text-4xl font-bold mb-10">FAQ</h3>

      <div className="space-y-3">
        {faqData.map((faq, index) => (
          <div key={faq.id} className="p-6 border border-gray-200 rounded-lg">
            <div className="flex justify-between">
              <span className="flex items-center font-medium text-gray-900">
                <span className="text-2xl text-blue-600 mr-3">
                  Q{index + 1}.
                </span>
                {faq.question}
              </span>
              <button className="" onClick={() => onFAQToggle(faq.id)}>
                <img
                  src={DownIcon}
                  alt=""
                  className={`border border-gray-200 rounded-full w-8 h-8 p-2 transition-transform ${
                    faq.isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            {faq.isExpanded && faq.answer && (
              <div className="mt-6 text-sm text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-14 p-8">
        <p className="mb-3 text-gray-400 text-">[유의 사항]</p>
        <div className="text-sm">
          <p>- 본 프로그램은 5일 동안 수강 가능합니다.</p>
          <p>- 프로그램 시작일부터는 환불이 불가합니다.</p>
        </div>
      </div>
    </>
  );
};

export default FAQSection;
