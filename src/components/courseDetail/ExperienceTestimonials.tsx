import QueteIcon from "../../assets/icon-quote.png";

const ExperienceTestimonials = () => {
  const testimonials = [
    "파이썬, 유튜브로 몇 번 시작했지만 끝까지 해본 적 없어요.",
    "실무에 쓸 수 있는 결과물을 하나 만들고 싶은데 어떻게 시작해야 할지 모르겠어요.",
    "AI 시대라는데 뭘 어떻게 배워야 하는지 막막해요.",
    "혼자 공부하면 자꾸 포기하게 돼서 동기부여가 필요해요.",
    "퇴근하고 책 펴는 것도 버거운데 혼자서는 도저히 못 하겠어요.",
  ];

  return (
    <div className="bg-blue-100 py-16 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-4xl font-bold text-gray-900">
            이런 경험 다들 있으시죠?
          </p>
        </div>

        <ul className="space-y-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <li
              key={index}
              className="flex flex-col items-center bg-white rounded-lg p-6 shadow-sm relative"
            >
              <img src={QueteIcon} alt="" className="w-5 h3" />
              <p className="text-gray-700 text-center leading-relaxed pt-2">
                {testimonial}
              </p>
            </li>
          ))}
        </ul>

        <div className="text-center">
          <p className="text-4xl font-bold text-blue-600 mb-6">
            그렇다면, 이번에는 혼자가 아닌 '함께' 해보세요
          </p>

          <div className="text-xl text-gray-700 leading-relaxed">
            <p className="mb-2">
              생성형 AI를 활용해 배우고, 커뮤니티에서 함께 성장하고,
            </p>
            <p>실제로 작동하는 결과물로 인정까지 이끌니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceTestimonials;
