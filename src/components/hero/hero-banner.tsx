import React, { useState } from "react";
import mainBannerImg from "../../assets/main-banner.png";
import slideBanner2Img from "../../assets/main-banner2.png";

interface SlideData {
  id: number;
  badge: string;
  title: string;
  description: string;
  backgroundImage: string;
  link: string;
}

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: SlideData[] = [
    {
      id: 0,
      badge: "수강생 모집 중",
      title: "견고한 파이썬\n부스트 커뮤니티 1기",
      description:
        "위니브와 함께하는 파이썬 완전 정복 온라인 강의가 출시되었습니다.\n얼리버드 20% 할인 혜택을 놓치지 마세요!",
      backgroundImage: mainBannerImg,
      link: "#",
    },
    {
      id: 1,
      badge: "새로운 강의",
      title: "JavaScript 심화\n완벽 마스터 과정",
      description:
        "모던 JavaScript부터 Node.js까지 한 번에 배우는\n전문가 양성 과정이 시작됩니다!",
      backgroundImage: slideBanner2Img,
      link: "#",
    },
  ];

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="flex-[2] relative rounded-[10px] overflow-hidden max-w-[880px] min-h-[330px]">
      {slides.map((slide, index) => (
        <article
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${
            index === currentSlide
              ? "translate-x-0"
              : index < currentSlide
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
        >
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-[1]"
            style={{ backgroundImage: `url(${slide.backgroundImage})` }}
          />
          <a href={slide.link} className="block h-full">
            <div className="relative z-[2] pl-[52px] max-[834px]:p-6 max-[834px]:w-full h-full flex flex-col justify-center">
              <span className="inline-block w-fit bg-white text-primary px-1 py-[3px] text-sm font-bold mb-3">
                {slide.badge}
              </span>
              <h2 className="text-main-text text-[40px] max-[834px]:text-2xl font-bold leading-[1.2] mb-3 whitespace-pre-line">
                {slide.title}
              </h2>
              <p className="text-main-text text-base leading-[1.5] whitespace-pre-line">
                {(() => {
                  const desc = slide.description;

                  if (slide.id === 0) {
                    const [before, after] = desc.split(
                      "얼리버드 20% 할인 혜택을 놓치지 마세요!"
                    );
                    return (
                      <>
                        {before}
                        <span className="font-bold">
                          얼리버드 20% 할인 혜택을 놓치지 마세요!
                        </span>
                        {after}
                      </>
                    );
                  }

                  if (slide.id === 1) {
                    const [before, after] =
                      desc.split("전문가 양성 과정이 시작됩니다!");
                    return (
                      <>
                        {before}
                        <span className="font-bold">
                          전문가 양성 과정이 시작됩니다!
                        </span>
                        {after}
                      </>
                    );
                  }

                  return desc;
                })()}
              </p>
            </div>
          </a>
        </article>
      ))}

      <nav className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-[3]">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-colors duration-200 ${
              index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
            }`}
            onClick={() => handleSlideChange(index)}
          />
        ))}
      </nav>
    </section>
  );
};

export default HeroBanner;
