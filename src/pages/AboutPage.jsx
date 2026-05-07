import { useState } from "react";

const aboutContent = {
  en: {
    title: "About DataBox",
    subtitle: "A modern file system for durable digital storage",
    intro:
      "DataBox is designed to bring real-world file management to the modern era with a sustainable, efficient, and secure approach.",
    paragraphs: [
      "Our mission is to replace outdated paper-based storage with a digital system built for durability and long-term preservation.",
      "DataBox helps organizations save costs, reduce waste, and improve workflows by keeping files accessible, secure, and organized.",
      "With less dependence on physical media, we support environmental responsibility and help teams stay productive in a fast-paced world.",
    ],
    features: [
      "Durable digital storage for long-term data preservation",
      "Lower operational expenses through efficient file management",
      "Paperless workflow to reduce environmental impact",
      "Faster collaboration and better use of working time",
    ],
  },
  hy: {
    title: "DataBox - ի Մասին",
    subtitle: "Ժամանակակից ֆայլային համակարգ` տվյալների երկարաժամկետ պահպանումի համար",
    intro:
      "DataBox-ը նախագծված է փաստացի մրցակցային ֆայլային կառավարման ժամանակակից մոտեցման համար, որը ապահովում է կայուն և անվտանգ լուծում։",
    paragraphs: [
      "Մեր նպատակն է հին մեթոդները թվային համակարգով փոխարինել՝ ապահովելով տվյալների երկարակեցություն և պահպանման ժամանակավոր լուծում։",
      "DataBox-ը օգնում է տնտեսություններ կատարել, կրճատել աղբը և բարելավել աշխատանքային հոսքերը՝ ֆայլերը դարձնելով ավելի մատչելի և կազմակերպված։",
      "Ֆիզիկական թղթի վրա կախվածության նվազեցումը նպաստում է շրջակա միջավայրի պահպանությանը և աշխատակիցների արդյունավետության բարձրացմանը։",
    ],
    features: [
      "Երկարակեցիկ թվային պահեստ՝ տվյալների երկարաժամկետ պահպանման համար",
      "Ձեռնարկությունների ծախսերի իջեցում արդյունավետ ֆայլային կառավարման միջոցով",
      "Թուղթ չօգտագործող աշխատանքային հոսք՝ շրջակա միջավայրի համար",
      "Աշխատանքային ժամանակի ավելի լավ օգտագործում և արագ համագործակցություն",
    ],
  },
};

export default function AboutPage() {
  const [language, setLanguage] = useState("en");
  const [fullScreen, setFullScreen] = useState(false);
  const { title, subtitle, intro, paragraphs, features } = aboutContent[language];

  const toggleFullScreen = () => {
    setFullScreen((current) => !current);
  };

  return (
    <main className="main about-page">
      <div className="toolbar" style={{ marginBottom: 30 }}>
        <div>
          <h2>{title}</h2>
          <p className="about-subtitle">{subtitle}</p>
        </div>
        <div className="toolbar-actions">
          <div className="language-switcher">
            <button
              className={language === "en" ? "active" : ""}
              onClick={() => setLanguage("en")}
            >
              English
            </button>
            <button
              className={language === "hy" ? "active" : ""}
              onClick={() => setLanguage("hy")}
            >
              Հայերեն
            </button>
          </div>
          <button className="full-screen-btn" onClick={toggleFullScreen}>
            {fullScreen ? "Close read mode" : "Open read mode"}
          </button>
        </div>
      </div>

      <div className="about-card">
        <p className="about-intro">{intro}</p>
        <div className="about-list">
          {paragraphs.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>

        <div className="about-features">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <span className="feature-bullet">✔</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {fullScreen && (
        <div className="about-fullscreen">
          <div className="about-fullscreen-card">
            <div className="fullscreen-header">
              <div>
                <h2>{title}</h2>
                <p className="about-subtitle">{subtitle}</p>
              </div>
              <button className="full-screen-close" onClick={toggleFullScreen}>
                ✕
              </button>
            </div>

            <p className="about-intro">{intro}</p>
            <div className="about-list">
              {paragraphs.map((text, index) => (
                <p key={index}>{text}</p>
              ))}
            </div>
            <div className="about-features">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-bullet">✔</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
