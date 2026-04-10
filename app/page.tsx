"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "./components/Button";

// Мы импортируем библиотеку только ВНУТРИ компонента
let Lottie: any = () => null;

const getRandomPosition = () => {
  if (typeof window !== 'undefined') {
    return {
      randomLeft: `${Math.random() * (window.innerWidth - 100)}px`,
      randomTop: `${Math.random() * (window.innerHeight - 50)}px`,
    };
  }
  return { randomLeft: "0px", randomTop: "0px" };
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [bunnyState, setBunnyState] = useState("normal");
  const [hasStarted, setHasStarted] = useState(false);
  const [randomPosition, setRandomPosition] = useState({ randomLeft: "0px", randomTop: "0px" });
  
  // Анимации подгружаем динамически
  const [animations, setAnimations] = useState<any>({});

  useEffect(() => {
    // Импортируем всё только в браузере
    const loadLottie = async () => {
      const LottieLib = (await import("react-lottie")).default;
      Lottie = LottieLib;
      
      const [cry, please, yes, punch] = await Promise.all([
        import("./animations/bunnyCry.json"),
        import("./animations/bunnyPlease.json"),
        import("./animations/bunnyYes.json"),
        import("./animations/bunnyPunch.json"),
      ]);
      
      setAnimations({ cry, please, yes, punch });
      setIsClient(true);
      setRandomPosition(getRandomPosition());
    };
    
    loadLottie();
  }, []);

  const handleHover = (hoverState: boolean) => {
    setHasStarted(true);
    if (hoverState) {
      setRandomPosition(getRandomPosition());
      const states = ["cry", "punch"];
      setBunnyState(states[Math.floor(Math.random() * states.length)]);
    }
  };

  const lottieSettings = (data: any) => ({
    loop: true,
    autoplay: true,
    animationData: data,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" }
  });

  if (!isClient) return <div style={{ background: '#feeafb', height: '100vh' }} />;

  return (
    <StyledHome>
      <div className="home-container">
        <div className="title">
          {bunnyState === "yes" ? "С Днем Рождения, Хлопик! ❤️" : "У Хлопика сегодня день рождения?"}
        </div>
        <div className="animation">
          {bunnyState === "normal" && animations.please && <Lottie options={lottieSettings(animations.please)} height={300} width={300} />}
          {bunnyState === "cry" && animations.cry && <Lottie options={lottieSettings(animations.cry)} height={300} width={300} />}
          {bunnyState === "yes" && animations.yes && <Lottie options={lottieSettings(animations.yes)} height={400} width={400} />}
          {bunnyState === "punch" && animations.punch && <Lottie options={lottieSettings(animations.punch)} height={300} width={300} />}
        </div>
        {bunnyState !== "yes" && (
          <div className="buttons">
            <button className="yes-btn" onClick={() => setBunnyState("yes")}>Да!</button>
            <Button
              $randomleft={randomPosition.randomLeft}
              $randomtop={randomPosition.randomTop}
              $hasstarted={hasStarted}
              onMouseEnter={() => handleHover(true)}
              onMouseLeave={() => handleHover(false)}
            >нет</Button>
          </div>
        )}
      </div>
    </StyledHome>
  );
}

const StyledHome = styled.div`
  display: flex; position: fixed; left: 0; top: 0; height: 100vh; width: 100%;
  align-items: center; justify-content: center; background-color: #feeafb; font-family: sans-serif;
  .home-container { display: flex; flex-direction: column; gap: 2rem; align-items: center; }
  .title { font-size: 2rem; color: #5caff3; text-align: center; padding: 0 20px; font-weight: bold; }
  .buttons { display: flex; gap: 2rem; }
  .yes-btn { background: #5caff3; color: white; border: none; padding: 10px 40px; border-radius: 12px; font-size: 1.5rem; cursor: pointer; font-weight: bold; transition: transform 0.2s; }
  .yes-btn:active { transform: scale(0.95); }
`;
