import { FC, useEffect } from "react";
import "./HomePage.css"; 

export const HomePage: FC = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="home">
      <video className="background-video" autoPlay loop muted>
        <source src="/space_orbits_frontend/videos/background.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
      <div className="overlay" />
      <div className="content">
        <h1>Переход космических аппаратов на орбиты</h1>
        <p>
          Сервис помогает операторам миссий добавлять и отслеживать переходы космических аппаратов на различные орбиты, а
          диспетчерам ЦУПа — контролировать процессы этих переходов.
        </p>
      </div>
    </div>
  );
};