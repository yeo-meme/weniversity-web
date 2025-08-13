import React, { useState } from "react";
import DownIcon from "../../assets/icon-down.png";
import type { CourseFAQ } from "../../types/courseDetail";

const FAQSection: React.FC = () => {
  const [faqData, setFaqData] = useState<CourseFAQ[]>([
    {
      id: "faq_1",
      question: "프로그래밍이 처음인데 괜찮을까요?",
      answer:
        "영상을 반복적으로 학습하며 따라오면 가능합니다. 프로그래밍 경험이 한 번이라도 있다면 더 원활하게 수업을 들을 수 있습니다. 가능하면 1 ~ 2시간 간단한 기초 강의라도 유튜브에서 보고 오시는 것을 권해드립니다.",
      isExpanded: false,
    },
    {
      id: "faq_2",
      question: "교육은 꼭 정해진 시간에만 수강할 수 있나요?",
      answer:
        "아닙니다. 영상 강의는 언제든지 자신의 속도에 맞춰 학습할 수 있습니다. 또한 강의가 끝나도 1년간은 지속해서 들을 수 있습니다. 다만 매주 화요일 라이브 세션은 정해진 시간에 진행됩니다.",
      isExpanded: false,
    },
    {
      id: "faq_3",
      question: "필수 참여 시간은 어떻게 되나요?",
      answer:
        "주간 줌 라이브 강의가 매주 저녁 8 ~ 10시 실시간 진행됩니다. 첫날 오리엔테이션은 꼭 참석할 수 있도록 해주세요.",
      isExpanded: false,
    },
    {
      id: "faq_4",
      question: "코딩테스트는 어느레벨까지 진행하나요?",
      answer:
        "4주차 마지막 라이브 세션에서 코딩 테스트 전략, 문제 분석, 문제 풀이를 다룹니다. 가장 어려운 문제를 Lv5라고 했을 Lv0 ~ Lv2까지 쉬운 문제 풀이와 함께 합격 전략을 다룹니다.",
      isExpanded: false,
    },
    {
      id: "faq_5",
      question: "결제는 어떻게 진행하나요?",
      answer: "위니버시티의 강의 결제를 통해 가능합니다.",
      isExpanded: false,
    },
    {
      id: "faq_6",
      question: "멘토님은 항상 상주하시나요?",
      answer: "평일 10시 ~ 11시, 4시 ~ 5시 상주합니다.",
      isExpanded: false,
    },
  ]);

  const handleFAQToggle = (faqId: string) => {
    setFaqData(prevData =>
      prevData.map(faq =>
        faq.id === faqId ? { ...faq, isExpanded: !faq.isExpanded } : faq
      )
    );
  };

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
              <button onClick={() => handleFAQToggle(faq.id)}>
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
