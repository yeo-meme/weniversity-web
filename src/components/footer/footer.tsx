import React, { useCallback } from "react";
import FooterLogo from "../../assets/footer-logo.png";
import YoutubeIcon from "../../assets/icon-youtube.png";
import InstaIcon from "../../assets/icon-insta.png";
import InflearnIcon from "../../assets/icon-inflearn.png";
import BlogIcon from "../../assets/icon-blog.png";
import HomeIcon from "../../assets/icon-home.png";
import DiscordIcon from "../../assets/icon-discord.png";

const Footer: React.FC = () => {
  const handleSocialClick = useCallback((platform: string) => {
    alert(`Weniversity ${platform} 준비중입니다.`);
  }, []);

  const socialLinks = [
    { name: "홈페이지", icon: HomeIcon },
    { name: "유튜브", icon: YoutubeIcon },
    { name: "인프런", icon: InflearnIcon },
    { name: "블로그", icon: BlogIcon },
    { name: "인스타그램", icon: InstaIcon },
    { name: "디스코드", icon: DiscordIcon },
  ];

  return (
    <footer className="bg-gray-100 py-16">
      <div className="max-w-[1190px] max-[834px]:max-w-[calc(100%-32px)] mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* 로고 및 회사 정보 */}
          <div className="flex flex-col gap-4">
            {/* 로고 */}
            <div className="flex items-center gap-3">
              <img src={FooterLogo} alt="위니버시티" className="h-6" />
            </div>

            {/* 회사 정보 */}
            <dl className="flex flex-wrap items-center text-gray-500 text-xs leading-relaxed">
              <div className="flex items-center">
                <dd className="ml-1">(주)위니브</dd>
              </div>
              <div className="flex items-center before:content-['|'] before:mx-2 before:text-gray-400">
                <dt>대표 :</dt>
                <dd className="ml-1">이호준</dd>
              </div>
              <div className="flex items-center before:content-['|'] before:mx-2 before:text-gray-400">
                <dt>사업자 번호 :</dt>
                <dd className="ml-1">546-86-01737</dd>
              </div>
              <div className="flex items-center before:content-['|'] before:mx-2 before:text-gray-400">
                <dd className="ml-1">정보통신업</dd>
              </div>
              <div className="flex items-center before:content-['|'] before:mx-2 before:text-gray-400">
                <dt>주소 :</dt>
                <dd className="ml-1">
                  제주 제주시 첨단로 330 세미양빌딩 A동 1층 106호
                </dd>
              </div>
            </dl>
          </div>

          {/* 소셜 미디어 아이콘들 */}
          <div className="flex gap-3">
            {socialLinks.map((social, index) => (
              <button
                key={index}
                onClick={() => handleSocialClick(social.name)}
                className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors flex-shrink-0"
                aria-label={`${social.name} 링크`}
              >
                <img
                  src={social.icon}
                  alt={social.name}
                  className="w-5 h-5 object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
