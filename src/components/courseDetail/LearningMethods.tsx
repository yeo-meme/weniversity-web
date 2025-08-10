import React from "react";
import Step1 from "../../assets/step-1.png";
import Step2 from "../../assets/step-2.png";
import Step3 from "../../assets/step-3.png";
import Step4 from "../../assets/step-4.png";
import Step5 from "../../assets/step-5.png";

const LearningMethods: React.FC = () => {
  const learningMethods = [
    {
      id: 1,
      image: Step1,
      title: "생성형 AI 기반 학습",
    },
    {
      id: 2,
      image: Step2,
      title: "커뮤니티 학습",
    },
    {
      id: 3,
      image: Step3,
      title: "맞춤형 온라인 VOD 강의",
    },
    {
      id: 4,
      image: Step4,
      title: "전문가의 큐레이션",
    },
    {
      id: 5,
      image: Step5,
      title: "바이브 코딩",
    },
  ];

  return (
    <div className="bg-slate-700 py-16 px-8">
      <div className="text-center">
        <div className="mb-16">
          <p className="text-white text-4xl font-bold mb-4">대 AI 시대,</p>
          <p className="text-white text-4xl font-bold mb-8">
            개발을 어떻게 배우고 익혀야 할까요?
          </p>

          <div className="text-white text-2xl font-bold leading-relaxed">
            <p className="mb-2">위니브는 단순한 문법 강의가 아닌</p>
            <p>'배우는 방법' 자체를 바꾸는 다섯 가지 방식을 제안합니다</p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {learningMethods.map(method => (
            <li key={method.id} className="flex flex-col items-center">
              <div className="w-40 h-40 justify-center mb-6">
                <img src={method.image} alt="" />
              </div>
              <p className="text-white text-sm font-medium text-center">
                {method.title}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LearningMethods;
