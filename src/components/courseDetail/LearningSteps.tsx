import React, { useMemo } from "react";
import DownIcon from "../../assets/icon-down-arrow.png";

const LearningSteps: React.FC = () => {
  const steps = useMemo(
    () => [
      {
        id: 1,
        text: "생성형 AI를 기반으로,",
        bold: "AI와 함께 학습하는 방법을 익히고",
      },
      {
        id: 2,
        text: "혼자 외롭지 않도록",
        bold: "커뮤니티에서 동료들과 연결되고",
      },
      {
        id: 3,
        text: "내 속도에 맞춰 학습할 수 있는",
        bold: "VOD 강의로 기초를 단단히 다지고",
      },
      {
        id: 4,
        text: "방향을 잃어주는",
        bold: "검증된 강사의 큐레이션을 따라가며",
      },
      {
        id: 5,
        text: "직접 실습하는",
        bold: "결과물을 끝까지 만들어봅니다.",
      },
    ],
    []
  );

  return (
    <div className="bg-gray-50 py-16 px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-16">
          <p className="text-4xl font-bold text-gray-900 mb-4">
            AI는 도와줄 뿐입니다.
          </p>
          <p className="text-4xl font-bold text-gray-900">
            끝까지 가려면 동료와 멘토가 필요합니다.
          </p>
        </div>

        <div className="space-y-10 mb-20">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                {step.text}
                <span className="font-extrabold">
                  {"  "}
                  {step.bold}
                </span>
              </p>

              {index < steps.length - 1 && (
                <div className="mt-10">
                  <img src={DownIcon} alt="" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">
            이게 위니브 부스트 커뮤니티의 학습 방식입니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LearningSteps);
