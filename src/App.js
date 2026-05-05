import React, { useEffect, useRef, useState } from "react";
import './App.css';

const ENABLE_LAUNCH_COUNTDOWN = false;
const COUNTER_TARGETS = [8, 300, 24, 1];
const HERO_LOGO_URL = "https://nikeelugunda.com/wp-content/uploads/2026/05/Logo-Telugu-scaled.png";

/** 10 May 2026, 9:00 AM IST (fixed instant for all visitors) */
const HERO_EVENT_START = new Date("2026-05-10T03:30:00.000Z");

function getHeroCountdownParts() {
  const diff = HERO_EVENT_START.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  }
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    ended: false,
  };
}

function App() {
  const [isLoading, setIsLoading] = useState(ENABLE_LAUNCH_COUNTDOWN);
  const [launchCount, setLaunchCount] = useState(5);
  const [showSparkles, setShowSparkles] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [isCounterStarted, setIsCounterStarted] = useState(false);
  const [heroCountdown, setHeroCountdown] = useState(() => getHeroCountdownParts());
  const revealRefs = useRef([]);
  const stepRefs = useRef([]);
  const sectionRefs = useRef([]);
  const counterSectionRef = useRef(null);
  const partners = [
    {
      label: "Event Partner",
      name: "SuperAI Academy",
      logo: "/partners/SuperAI.png",
    },
    {
      label: "Digital PR",
      name: "Digital Connect",
      logo: "/partners/Digital%20Connect.png",
    },
    {
      label: "Video Production Partner",
      name: "Trim Spark",
      logo: "/partners/Trim%20Spark.png",
    },
    {
      label: "Instant Reels Partner",
      name: "BookMyReels",
      logo: "/partners/BookMyReels.png",
    },
    {
      label: "Media Partner",
      name: "IDream",
      logo: "/partners/IDream.png",
    },
  ];

  const addToRevealRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const addToStepRefs = (el) => {
    if (el && !stepRefs.current.includes(el)) stepRefs.current.push(el);
  };

  const addToSectionRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  };

  useEffect(() => {
    if (!ENABLE_LAUNCH_COUNTDOWN) {
      setIsLoading(false);
      return;
    }

    let openTimer;
    const countdown = setInterval(() => {
      setLaunchCount((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setShowSparkles(true);
          openTimer = setTimeout(() => setIsLoading(false), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdown);
      clearTimeout(openTimer);
    };
  }, []);

  useEffect(() => {
    const tick = () => setHeroCountdown(getHeroCountdownParts());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // 1. Reveal Animation Observer (About & Highlights)
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("show");
            }, index * 120);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((el) => {
      if (el) revealObserver.observe(el);
    });

    // 2. Journey Step Observer
    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            setTimeout(() => {
              el.classList.remove("hidden");
              el.classList.add("animate", "active");
            }, index * 200);
          }
        });
      },
      { threshold: 0.2 }
    );

    stepRefs.current.forEach((el) => {
      if (el) {
        el.classList.add("hidden"); // Initialize hidden state safely after load
        stepObserver.observe(el);
      }
    });

    // 3. Section Scroll Reveal
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    sectionRefs.current.forEach((el) => {
      if (el) sectionObserver.observe(el);
    });

    return () => {
      revealObserver.disconnect();
      stepObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [isLoading]);

  useEffect(() => {
    if (isLoading || isCounterStarted || !counterSectionRef.current) return;

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsCounterStarted(true);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    counterObserver.observe(counterSectionRef.current);

    return () => counterObserver.disconnect();
  }, [isLoading, isCounterStarted]);

  useEffect(() => {
    if (!isCounterStarted) return;

    const duration = 1800;
    const start = performance.now();
    let animationFrameId;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCounterValues(
        COUNTER_TARGETS.map((target) => Math.floor(target * easedProgress))
      );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCounterValues(COUNTER_TARGETS);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isCounterStarted]);

  const globalStyles = `
    /* GLOBAL RESET */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { background: #000; font-family: 'Poppins', sans-serif; color: #fff; overflow-x: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

    /* LAUNCH COUNTDOWN */
    .launch-screen {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      background: radial-gradient(circle at top, rgba(255,215,0,0.16), transparent 45%), #000;
    }
    .launch-center {
      position: relative;
      z-index: 2;
      text-align: center;
      padding: 40px 28px;
    }
    .launch-title {
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #d7b95a;
      margin-bottom: 20px;
    }
    .launch-count {
      font-size: clamp(70px, 16vw, 170px);
      font-weight: 900;
      line-height: 1;
      background: linear-gradient(90deg, #b8860b, #ffd700, #fff3b0, #ffffff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 34px rgba(255,215,0,0.2);
      animation: launchPulse 0.9s ease-in-out infinite;
    }
    .launch-sub {
      margin-top: 16px;
      color: #d3d3d3;
      font-size: 16px;
    }
    .launch-open {
      margin-top: 20px;
      font-size: 24px;
      font-weight: 800;
      color: #fff0b0;
      animation: popIn 0.5s ease;
    }
    .launch-sparkle {
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: radial-gradient(circle, #fff, #ffd700 60%, rgba(255,215,0,0.2));
      box-shadow: 0 0 18px rgba(255,215,0,0.9);
      opacity: 0;
    }
    .launch-sparkle.active {
      animation: sparkleBurst 0.95s ease-out forwards;
    }
    @keyframes launchPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.07); }
    }
    @keyframes popIn {
      0% { opacity: 0; transform: translateY(8px) scale(0.9); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes sparkleBurst {
      0% { opacity: 0; transform: translate(0, 0) scale(0.3); }
      20% { opacity: 1; }
      100% { opacity: 0; transform: translate(var(--spark-x), var(--spark-y)) scale(1.45); }
    }

    /* GLOBAL SCROLL REVEAL */
    .scroll-section {
      opacity: 0;
      transform: translateY(34px);
      transition: opacity 0.75s ease, transform 0.75s ease;
      will-change: opacity, transform;
    }
    .scroll-section.section-visible {
      opacity: 1;
      transform: translateY(0);
    }
    @media (prefers-reduced-motion: reduce) {
      .scroll-section {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }

    /* HERO WRAPPER */
    .hero-section { position: relative; width: 100%; height: 100vh; background: radial-gradient(circle at 50% 20%, rgba(255,215,0,0.12), transparent 42%), #000; display: flex; align-items: center; justify-content: center; overflow: hidden; isolation: isolate; }
    .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 64px 64px; opacity: 0.28; mask-image: radial-gradient(circle at center, black 35%, transparent 80%); pointer-events: none; }
    .gold-glow { position: absolute; width: 520px; height: 520px; background: radial-gradient(circle, rgba(255,215,0,0.35), transparent 60%); filter: blur(50px); opacity: 0.9; pointer-events: none; animation: heroFloat 7s ease-in-out infinite alternate; }
    .gold-glow.top-right { top: -160px; right: -160px; }
    .gold-glow.bottom-left { bottom: -160px; left: -160px; }
    .hero-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(255,215,0,0.25); box-shadow: inset 0 0 30px rgba(255,215,0,0.05), 0 0 30px rgba(255,215,0,0.12); pointer-events: none; }
    .hero-ring.ring-one { width: min(78vw, 780px); aspect-ratio: 1/1; animation: heroRotate 24s linear infinite; }
    .hero-ring.ring-two { width: min(92vw, 920px); aspect-ratio: 1/1; border-color: rgba(255,215,0,0.14); animation: heroRotateReverse 32s linear infinite; }
    .hero-content { position: relative; z-index: 2; width: min(96vw, 1100px); margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
    .hero-badge { display: inline-block; padding: 8px 18px; border-radius: 999px; border: 1px solid rgba(255,215,0,0.38); background: rgba(212,175,55,0.12); color: #ffe58a; font-size: 12px; letter-spacing: 1.4px; text-transform: uppercase; box-shadow: 0 0 22px rgba(255,215,0,0.18); }
    .hero-logo-wrap { position: relative; width: min(86vw, 700px); margin: 0 auto; padding: clamp(10px, 1.6vw, 16px); border-radius: 30px; background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.01)); border: 1px solid rgba(255,215,0,0.2); box-shadow: 0 20px 65px rgba(0,0,0,0.6), 0 0 45px rgba(255,215,0,0.1); backdrop-filter: blur(4px); display: grid; place-items: center; }
    .hero-logo-wrap::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(130deg, transparent 30%, rgba(255,255,255,0.14), transparent 60%); transform: translateX(-130%); animation: heroShine 6.8s linear infinite; }
    .hero-logo { width: 100%; max-width: 620px; max-height: 38vh; height: auto; display: block; margin: 0 auto; position: relative; z-index: 1; object-fit: contain; animation: heroLogoIn 1.1s ease, heroPulse 4.5s ease-in-out infinite; }
    .hero-subtext { color: #d2d2d2; font-size: clamp(14px, 2vw, 18px); letter-spacing: 0.3px; text-shadow: 0 0 20px rgba(255,215,0,0.1); }
    .hero-countdown { margin-top: 10px; width: 100%; max-width: 560px; }
    .hero-countdown-title { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,215,0,0.8); margin-bottom: 12px; }
    .hero-countdown-row { display: flex; justify-content: center; gap: clamp(10px, 2.2vw, 20px); flex-wrap: wrap; }
    .hero-countdown-cell { min-width: 76px; padding: 12px 14px 14px; border-radius: 16px; background: rgba(255,215,0,0.06); border: 1px solid rgba(255,215,0,0.22); box-sizing: border-box; }
    .hero-countdown-num { font-size: clamp(24px, 4.6vw, 34px); font-weight: 800; font-variant-numeric: tabular-nums; background: linear-gradient(90deg, #ffd700, #fff4b0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.15; }
    .hero-countdown-unit { font-size: 10px; color: #9a9a9a; text-transform: lowercase; letter-spacing: 0.5px; margin-top: 6px; }
    .hero-speaker-btn { display: inline-block; margin-top: 6px; padding: 12px 30px; border-radius: 999px; font-size: 14px; font-weight: 800; letter-spacing: 0.5px; text-decoration: none !important; color: #000; background: linear-gradient(90deg, #b8860b, #ffd700, #fff4b0); box-shadow: 0 10px 28px rgba(255,215,0,0.35), 0 0 30px rgba(212,175,55,0.2); transition: transform 0.25s ease, box-shadow 0.25s ease; }
    .hero-speaker-btn:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 14px 38px rgba(255,215,0,0.45), 0 0 42px rgba(212,175,55,0.3); }
    @keyframes heroFloat { 0% { transform: translateY(0); } 100% { transform: translateY(28px); } }
    @keyframes heroRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes heroRotateReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
    @keyframes heroLogoIn { 0% { opacity: 0; transform: translateY(16px) scale(0.94); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes heroPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.012); } }
    @keyframes heroShine { 0% { transform: translateX(-130%); } 100% { transform: translateX(130%); } }
    @media (max-width: 1024px) { .hero-logo { max-width: 520px; max-height: 34vh; } .gold-glow { width: 380px; height: 380px; } .hero-logo-wrap { width: min(88vw, 600px); } }
    @media (max-width: 768px) { .hero-ring.ring-one, .hero-ring.ring-two { animation: none; } .hero-logo-wrap::after { animation: none; } }
    @media (max-width: 600px) { .hero-section { height: 90vh; } .hero-logo { max-width: 100%; max-height: 26vh; } .hero-logo-wrap { width: 90vw; border-radius: 22px; } .gold-glow { width: 260px; height: 260px; filter: blur(32px); } .gold-glow.top-right { top: -100px; right: -100px; } .gold-glow.bottom-left { bottom: -100px; left: -100px; } .hero-badge { font-size: 11px; padding: 7px 14px; } .hero-subtext { font-size: 13px; max-width: 90%; } .hero-countdown-cell { min-width: 68px; padding: 10px 10px 12px; } .hero-speaker-btn { width: 92%; max-width: 330px; padding: 12px 18px; font-size: 13px; } }

    /* MARQUEE */
    .marquee-strip { width: 100%; overflow: hidden; position: relative; padding: 14px 0; background: rgba(0,0,0,0.6); border-top: 1px solid rgba(255,215,0,0.15); border-bottom: 1px solid rgba(255,215,0,0.15); backdrop-filter: blur(10px); }
    .marquee-strip::before, .marquee-strip::after { content: ""; position: absolute; top: 0; width: 120px; height: 100%; z-index: 2; }
    .marquee-strip::before { left: 0; background: linear-gradient(to right, #000, transparent); }
    .marquee-strip::after { right: 0; background: linear-gradient(to left, #000, transparent); }
    .marquee-track { display: flex; width: max-content; gap: 18px; animation: scroll 18s linear infinite; align-items: center; white-space: nowrap; }
    .marquee-track span { color: #ffd700; font-weight: 500; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase; text-shadow: 0 0 10px rgba(255,215,0,0.25); }
    @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @media(max-width:768px){ .marquee-track span { font-size: 12px; } .marquee-strip::before, .marquee-strip::after { width: 60px; } }

    /* ABOUT SECTION */
    .about-section { padding: 120px 8%; background: radial-gradient(circle at top, #111 0%, #000 60%); position: relative; }
    .about-section::before { content: ""; position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(212,175,55,0.15), transparent 70%); top: -100px; left: -100px; filter: blur(80px); animation: floatGlow 8s ease-in-out infinite alternate; }
    @keyframes floatGlow { from { transform: translateY(0px); } to { transform: translateY(40px); } }
    .about-title { font-size: 50px; text-align: center; font-weight: 700; margin-bottom: 20px; background: linear-gradient(90deg, #D4AF37, #FFD700, #FFF5CC); -webkit-background-clip: text; -webkit-text-fill-color: transparent; opacity: 0; transform: translateY(40px); }
    .about-subtitle { text-align: center; color: #bbb; max-width: 750px; margin: auto; margin-bottom: 80px; font-size: 18px; opacity: 0; transform: translateY(40px); }
    .about-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
    .about-card { background: linear-gradient(145deg, #0f0f0f, #070707); border: 1px solid rgba(255,255,255,0.06); padding: 35px; border-radius: 18px; transition: 0.4s ease; position: relative; overflow: hidden; opacity: 0; transform: translateY(60px); }
    .about-card::before { content: ""; position: absolute; left: 0; top: 20%; width: 4px; height: 60%; border-radius: 10px; background: linear-gradient(180deg, #D4AF37, #FFD700, #FFF5CC); box-shadow: 0 0 15px rgba(212,175,55,0.7); opacity: 0.4; transition: 0.4s ease; }
    .about-card:hover { transform: translateY(-12px) scale(1.02); border: 1px solid rgba(212,175,55,0.6); box-shadow: 0 0 50px rgba(212,175,55,0.25); }
    .about-card:hover::before { height: 100%; top: 0; opacity: 1; box-shadow: 0 0 25px rgba(212,175,55,1); }
    .about-icon { width: 50px; height: 50px; margin-bottom: 20px; }
    .about-icon svg { width: 100%; height: 100%; fill: url(#goldGradient); transition: transform 0.3s ease; }
    .about-card:hover svg { transform: scale(1.15) rotate(3deg); }
    .about-card h3 { font-size: 22px; font-weight: 600; margin-bottom: 10px; color: #ffffff; text-shadow: 0 0 8px rgba(255,255,255,0.15); }
    .about-card:hover h3 { text-shadow: 0 0 12px rgba(212,175,55,0.6); }
    .about-card p { color: #aaa; font-size: 15px; line-height: 1.6; }
    .about-counter-wrap { margin-top: 48px; display: grid; grid-template-columns: repeat(4, minmax(170px, 1fr)); gap: 18px; padding-top: 32px; border-top: 1px solid rgba(255,215,0,0.22); }
    .about-counter-card {
      position: relative;
      overflow: hidden;
      min-height: 185px;
      border-radius: 24px;
      padding: 26px 16px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: radial-gradient(circle at 50% -20%, rgba(255,215,0,0.3), rgba(255,215,0,0.03) 45%), linear-gradient(165deg, #171717, #070707 72%);
      border: 1px solid rgba(255,215,0,0.36);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.15), 0 20px 45px rgba(0,0,0,0.55), 0 0 28px rgba(255,215,0,0.12);
      transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
    }
    .about-counter-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, transparent 32%, rgba(255,255,255,0.14) 50%, transparent 68%);
      transform: translateX(-130%);
      animation: counterSweep 4.6s linear infinite;
      pointer-events: none;
    }
    .about-counter-card::after {
      content: "";
      position: absolute;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      right: -38px;
      top: -42px;
      background: radial-gradient(circle, rgba(255,215,0,0.28), rgba(255,215,0,0));
      pointer-events: none;
    }
    .about-counter-card:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: rgba(255,215,0,0.68);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 26px 55px rgba(0,0,0,0.65), 0 0 38px rgba(255,215,0,0.24);
    }
    .about-counter-card h3 {
      font-size: clamp(38px, 5.2vw, 60px);
      font-weight: 900;
      color: #ffd700;
      line-height: 1;
      letter-spacing: 0.8px;
      font-variant-numeric: tabular-nums;
      text-shadow: 0 0 26px rgba(255,215,0,0.45);
    }
    .about-counter-card p {
      margin-top: 14px;
      font-size: 12.5px;
      color: #f0e2ad;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
    }
    @keyframes counterSweep { 0% { transform: translateX(-130%); } 100% { transform: translateX(130%); } }
    .highlight-box { text-align: center; margin-top: 90px; opacity: 0; transform: translateY(40px); }
    .highlight-box h2 { font-size: 36px; font-weight: 700; background: linear-gradient(90deg, #D4AF37, #FFD700, #FFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .highlight-box p { margin-top: 15px; color: #bbb; }
    .show { opacity: 1 !important; transform: translateY(0) !important; transition: all 0.8s ease; }
    @media(max-width:980px){ .about-counter-wrap { grid-template-columns: repeat(2, 1fr); } }
    @media(max-width:768px){ .about-section { padding: 80px 6%; } .about-title { font-size: 34px; } .about-subtitle { font-size: 16px; margin-bottom: 50px; } .about-card { padding: 25px; } .about-counter-wrap { margin-top: 34px; gap: 12px; padding-top: 22px; } .about-counter-card { min-height: 160px; padding: 20px 12px; } .highlight-box h2 { font-size: 26px; } }
    @media(max-width:520px){ .about-counter-wrap { grid-template-columns: 1fr; } }

    /* ATTEND SECTION */
    .attend-section { position: relative; padding: 120px 8%; background: radial-gradient(circle at 20% 10%, rgba(255, 215, 0, 0.12), transparent 30%), radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.10), transparent 35%), linear-gradient(180deg, #000 0%, #070707 50%, #000 100%); overflow: hidden; color: #fff; }
    .attend-section::before { content: ""; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 48px 48px; mask-image: radial-gradient(circle at center, black 35%, transparent 75%); pointer-events: none; }
    .attend-header { position: relative; z-index: 2; text-align: center; max-width: 850px; margin: 0 auto 70px; }
    .attend-badge { display: inline-block; padding: 10px 22px; margin-bottom: 22px; border: 1px solid rgba(255, 215, 0, 0.35); border-radius: 999px; background: rgba(212, 175, 55, 0.08); color: #ffe68a; font-size: 13px; letter-spacing: 1.6px; text-transform: uppercase; }
    .attend-header h2 { font-size: clamp(38px, 5vw, 66px); line-height: 1.05; margin-bottom: 20px; font-weight: 800; background: linear-gradient(90deg, #b8860b 0%, #ffd700 30%, #fff4b0 55%, #d4af37 80%, #fff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 35px rgba(255, 215, 0, 0.18); }
    .attend-header p { color: #cfcfcf; font-size: 18px; line-height: 1.8; }
    .attend-grid { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
    .attend-card { position: relative; padding: 34px; min-height: 285px; border-radius: 28px; background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.015)), linear-gradient(180deg, #101010, #050505); border: 1px solid rgba(255, 215, 0, 0.16); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 22px 70px rgba(0,0,0,0.55); transition: all 0.35s ease; overflow: hidden; }
    .attend-card::after { content: ""; position: absolute; top: -80px; right: -80px; width: 180px; height: 180px; background: radial-gradient(circle, rgba(255,215,0,0.18), transparent 70%); opacity: 0; transition: 0.35s ease; }
    .attend-card:hover { transform: translateY(-12px); border-color: rgba(255, 215, 0, 0.55); box-shadow: 0 0 45px rgba(212,175,55,0.22), 0 28px 80px rgba(0,0,0,0.75); }
    .attend-card:hover::after { opacity: 1; }
    .attend-icon { width: 64px; height: 64px; display: grid; place-items: center; margin-bottom: 26px; border-radius: 20px; background: linear-gradient(145deg, rgba(255,215,0,0.18), rgba(212,175,55,0.04)); border: 1px solid rgba(255,215,0,0.26); box-shadow: 0 0 30px rgba(212,175,55,0.15); }
    .attend-icon svg { width: 32px; height: 32px; fill: #ffd700; filter: drop-shadow(0 0 10px rgba(255,215,0,0.35)); }
    .attend-card h3 { color: #ffffff; font-size: 22px; line-height: 1.25; margin-bottom: 14px; font-weight: 700; }
    .attend-card p { color: #b9b9b9; font-size: 15.5px; line-height: 1.75; }
    .attend-highlight { position: relative; z-index: 2; max-width: 980px; margin: 70px auto 0; padding: 28px 34px; text-align: center; border-radius: 26px; border: 1px solid rgba(255, 215, 0, 0.32); background: linear-gradient(90deg, rgba(212,175,55,0.14), rgba(255,255,255,0.04), rgba(212,175,55,0.14)); color: #fff2b0; font-size: clamp(20px, 3vw, 34px); font-weight: 800; line-height: 1.35; box-shadow: 0 0 55px rgba(212,175,55,0.12); }
    @media (max-width: 1000px) { .attend-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 650px) { .attend-section { padding: 85px 5%; } .attend-grid { grid-template-columns: 1fr; } .attend-card { padding: 28px; min-height: auto; } .attend-header p { font-size: 16px; } }

    /* JOURNEY SECTION */
    .journey-section { padding: 140px 8%; background: #000; color: #fff; }
    .journey-header { text-align: center; margin-bottom: 80px; }
    .journey-header h2 { font-size: 48px; font-weight: 800; background: linear-gradient(90deg,#FFD700,#fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .journey-header p { color: #ccc; }
    .journey-flow { display: flex; justify-content: center; align-items: center; gap: 30px; flex-wrap: wrap; }
    .journey-step { text-align: center; max-width: 200px; transition: 0.6s ease; }
    .journey-step.animate { transform: translateY(0); opacity: 1; }
    .journey-step.hidden { opacity: 0; transform: translateY(50px); }
    .circle { width: 70px; height: 70px; border-radius: 50%; margin: auto; margin-bottom: 12px; background: #111; border: 1px solid rgba(255,215,0,0.5); color: #FFD700; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(255,215,0,0.3); }
    .journey-step.active .circle { animation: pulse 2s infinite; }
    @keyframes pulse { 0% { box-shadow: 0 0 10px rgba(255,215,0,0.4); } 50% { box-shadow: 0 0 30px rgba(255,215,0,0.9); } 100% { box-shadow: 0 0 10px rgba(255,215,0,0.4); } }
    .journey-step h3 { color: #fff; }
    .journey-step p { color: #bbb; font-size: 13px; }
    .line { width: 60px; height: 2px; background: linear-gradient(90deg,#FFD700,transparent); opacity: 0.4; }
    .journey-highlight { margin-top: 100px; text-align: center; font-size: 30px; font-weight: 800; background: linear-gradient(90deg,#FFD700,#fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .journey-cta { margin-top: 90px; text-align: center; position: relative; }
    .journey-cta a { display: inline-block; padding: 16px 42px; border-radius: 999px; font-size: 18px; font-weight: 800; text-decoration: none !important; outline: none; color: #000; background: linear-gradient(90deg, #b8860b, #ffd700, #fff4b0); box-shadow: 0 10px 30px rgba(255,215,0,0.35), 0 0 40px rgba(212,175,55,0.25); transition: 0.3s ease; position: relative; overflow: hidden; }
    .journey-cta a::before { content: ""; position: absolute; top: 0; left: -120%; width: 120%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,0.5), transparent); transition: 0.6s; }
    .journey-cta a:hover::before { left: 120%; }
    .journey-cta a:hover { transform: translateY(-4px) scale(1.05); box-shadow: 0 15px 45px rgba(255,215,0,0.45), 0 0 60px rgba(212,175,55,0.35); }
    @media(max-width:900px){ .journey-flow { flex-direction: column; } .line { display: none; } }
    @media (max-width: 768px) { .journey-cta a { width: 100%; max-width: 320px; } }

    /* SPEAKERS SECTION */
    .speakers-section { padding: 130px 8%; background: #000; color: #fff; }
    .speakers-header { text-align: center; margin-bottom: 90px; }
    .speakers-header h2 { font-size: clamp(36px,5vw,58px); font-weight: 800; background: linear-gradient(90deg,#FFD700,#fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .speakers-header p { color: #cfcfcf; }
    .speakers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
    .speaker-card { background: linear-gradient(145deg, #111, #050505); padding: 34px 28px; border-radius: 22px; text-align: center; border: 1px solid rgba(255,255,255,0.06); transition: 0.35s ease; position: relative; overflow: hidden; animation: float 6s ease-in-out infinite; }
    .speaker-card:nth-child(2n) { animation-delay: 1s; }
    .speaker-card::before { content: ""; position: absolute; left: 0; top: 0; width: 3px; height: 100%; background: linear-gradient(#FFD700,#D4AF37); }
    .speaker-card:hover { transform: translateY(-10px); border-color: rgba(255,215,0,0.5); box-shadow: 0 0 40px rgba(212,175,55,0.25); }
    .speaker-img { width: 110px; height: 110px; margin: auto; margin-bottom: 18px; border-radius: 50%; overflow: hidden; border: 2px solid rgba(255,215,0,0.4); box-shadow: 0 0 25px rgba(255,215,0,0.15); }
    .speaker-img img { width: 100%; height: 100%; object-fit: cover; }
    .speaker-card h3 { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 6px; }
    .designation { color: #c8c8c8; font-size: 14px; margin-bottom: 14px; }
    .tag { display: inline-block; padding: 6px 14px; font-size: 12px; border-radius: 999px; background: linear-gradient(90deg,#FFD700,#D4AF37); color: #000; font-weight: 700; }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @media(max-width:900px){ .speakers-grid { grid-template-columns: repeat(2, 1fr); } }
    @media(max-width:600px){ .speakers-grid { grid-template-columns: 1fr; } }

    /* EXPERIENCE SECTION */
    .experience-section { position: relative; padding: 120px 6%; background: radial-gradient(circle at 50% 35%, rgba(255, 215, 0, 0.12), transparent 30%), linear-gradient(180deg, #000 0%, #0a0a0a 50%, #000 100%); color: #fff; overflow: hidden; }
    .experience-section::before { content: ""; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; }
    .experience-header { text-align: center; max-width: 850px; margin: 0 auto 80px; }
    .experience-badge { display: inline-block; padding: 8px 18px; border-radius: 999px; border: 1px solid rgba(255, 215, 0, 0.35); background: rgba(212, 175, 55, 0.08); color: #ffe68a; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; }
    .experience-header h2 { font-size: clamp(30px, 4vw, 60px); margin: 20px 0; font-weight: 900; background: linear-gradient(90deg,#b8860b,#ffd700,#fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .experience-header p { color: #cfcfcf; font-size: 16px; line-height: 1.7; }
    .experience-stage { position: relative; max-width: 1200px; margin: 0 auto; min-height: 700px; }
    .stage-glow { position: absolute; inset: 50%; width: 500px; height: 500px; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(circle, rgba(255,215,0,0.25), transparent 60%); filter: blur(25px); }
    .experience-center { position: absolute; inset: 50%; width: 300px; height: 300px; transform: translate(-50%, -50%); border-radius: 50%; display: grid; place-items: center; background: linear-gradient(145deg,#141414,#050505); border: 1px solid rgba(255,215,0,0.4); box-shadow: 0 0 70px rgba(212,175,55,0.25); text-align: center; }
    .center-ring span { padding: 6px 14px; border-radius: 999px; background: linear-gradient(90deg,#d4af37,#ffd700); color: #000; font-size: 12px; font-weight: 800; }
    .center-ring h3 { font-size: 28px; margin: 12px 0; background: linear-gradient(90deg,#b8860b,#ffd700,#fff3b0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .center-ring p { color: #d7d7d7; font-size: 14px; }
    .experience-card { position: absolute; width: 290px; padding: 24px; border-radius: 24px; background: linear-gradient(145deg,#111,#050505); border: 1px solid rgba(255,215,0,0.15); box-shadow: 0 20px 60px rgba(0,0,0,0.6); transition: 0.3s ease; }
    .experience-card:hover { transform: translateY(-8px); border-color: rgba(255,215,0,0.5); }
    .experience-card .number { color: #FFD700; font-weight: 900; display: inline-block; margin-bottom: 8px; }
    .experience-card h3 { margin-bottom: 8px; font-weight: 800; background: linear-gradient(90deg,#ffffff,#ffd700,#b8860b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .card-1 { top: 0; left: 3%; } .card-2 { top: 0; right: 3%; } .card-3 { top: 260px; left: 0; } .card-4 { top: 260px; right: 0; } .card-5 { bottom: 0; left: 10%; } .card-6 { bottom: 0; right: 10%; }
    .experience-highlight { text-align: center; margin-top: 70px; font-size: clamp(20px, 3vw, 34px); font-weight: 900; color: #fff2b0; }
    @media (max-width: 1024px) { .experience-section { padding: 80px 5%; } .experience-stage { display: flex; flex-direction: column; align-items: center; gap: 16px; min-height: auto; } .stage-glow, .experience-center { position: relative; transform: none; inset: auto; } .stage-glow { width: 320px; height: 320px; } .experience-center { width: 100%; max-width: 420px; padding: 26px 18px; height: auto; border-radius: 24px; } .experience-card { position: relative !important; width: 100%; max-width: 420px; padding: 20px; } .card-1, .card-2, .card-3, .card-4, .card-5, .card-6 { top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; } .experience-header h2 { font-size: 30px; } .experience-header p { font-size: 14px; } }
    @media (max-width: 480px) { .experience-card { border-radius: 18px; padding: 18px; } .experience-center { padding: 20px 16px; } .stage-glow { width: 260px; height: 260px; } }

    /* ACCESS SECTION */
    .access-section { position: relative; padding: 120px 8%; background: linear-gradient(135deg, #050505 0%, #000 45%, #101010 100%); color: #fff; overflow: hidden; }
    .access-section::before { content: ""; position: absolute; top: -180px; right: -120px; width: 480px; height: 480px; background: radial-gradient(circle, rgba(255, 215, 0, 0.22), transparent 68%); filter: blur(30px); }
    .access-wrap { position: relative; z-index: 2; max-width: 1180px; margin: auto; display: grid; grid-template-columns: 0.9fr 1.25fr; gap: 60px; align-items: center; }
    .access-label { display: inline-block; margin-bottom: 22px; padding: 10px 20px; border-radius: 999px; border: 1px solid rgba(255, 215, 0, 0.35); color: #ffe58a; background: rgba(212, 175, 55, 0.08); font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; }
    .access-left h2 { font-size: clamp(38px, 5vw, 64px); line-height: 1.05; font-weight: 900; margin-bottom: 22px; background: linear-gradient(90deg, #d4af37, #ffd700, #fff3b0, #ffffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .access-left p { color: #c9c9c9; font-size: 18px; line-height: 1.8; }
    .access-ticket { position: relative; padding: 34px; border-radius: 34px; background: linear-gradient(145deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02)), linear-gradient(180deg, #141414, #030303); border: 1px solid rgba(255, 215, 0, 0.30); box-shadow: 0 0 70px rgba(212,175,55,0.18), 0 30px 90px rgba(0,0,0,0.85); }
    .access-ticket::before, .access-ticket::after { content: ""; position: absolute; top: 50%; width: 36px; height: 72px; transform: translateY(-50%); background: #020202; border: 1px solid rgba(255, 215, 0, 0.25); }
    .access-ticket::before { left: -1px; border-radius: 0 40px 40px 0; border-left: 0; }
    .access-ticket::after { right: -1px; border-radius: 40px 0 0 40px; border-right: 0; }
    .ticket-top { display: flex; justify-content: space-between; gap: 20px; align-items: center; }
    .ticket-top span { color: #bcbcbc; font-size: 12px; letter-spacing: 2px; }
    .ticket-top strong { color: #000; padding: 10px 18px; border-radius: 999px; background: linear-gradient(90deg, #d4af37, #ffd700, #fff3b0); font-size: 13px; letter-spacing: 1px; }
    .ticket-divider { height: 1px; margin: 28px 0; background: linear-gradient(90deg, transparent, rgba(255,215,0,0.6), transparent); }
    .access-items { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
    .access-item { display: flex; gap: 18px; padding: 22px; border-radius: 24px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.07); transition: 0.35s ease; }
    .access-item:hover { transform: translateY(-8px); border-color: rgba(255, 215, 0, 0.45); box-shadow: 0 0 35px rgba(212,175,55,0.16); }
    .access-icon { min-width: 52px; width: 52px; height: 52px; display: grid; place-items: center; border-radius: 18px; background: linear-gradient(145deg, rgba(255,215,0,0.22), rgba(212,175,55,0.04)); border: 1px solid rgba(255,215,0,0.28); }
    .access-icon svg { width: 28px; height: 28px; fill: #ffd700; filter: drop-shadow(0 0 10px rgba(255,215,0,0.35)); }
    .access-item h3 { font-size: 20px; color: #fff; margin-bottom: 6px; }
    .access-item p { font-size: 14px; line-height: 1.6; color: #b8b8b8; }
    .ticket-bottom { margin-top: 30px; padding-top: 26px; border-top: 1px dashed rgba(255,215,0,0.35); display: flex; justify-content: space-between; align-items: center; gap: 18px; }
    .ticket-bottom span { color: #fff2b0; font-weight: 700; }
    .ticket-bottom a { text-decoration: none; color: #000; font-weight: 900; padding: 14px 26px; border-radius: 999px; background: linear-gradient(90deg, #d4af37, #ffd700, #fff3b0); box-shadow: 0 0 28px rgba(255,215,0,0.24); }
    @media (max-width: 950px) { .access-wrap { grid-template-columns: 1fr; } }
    @media (max-width: 650px) { .access-section { padding: 90px 5%; } .access-ticket { padding: 24px; } .access-items { grid-template-columns: 1fr; } .ticket-top, .ticket-bottom { flex-direction: column; align-items: flex-start; } }

    /* AGENDA SECTION */
    .agenda-section { padding: 130px 8%; background: radial-gradient(circle at center, #0a0a0a 0%, #000 70%); color: #fff; }
    .agenda-header { text-align: center; margin-bottom: 100px; }
    .agenda-header h2 { font-size: 52px; font-weight: 800; background: linear-gradient(90deg, #D4AF37, #FFD700, #FFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .agenda-header p { color: #aaa; margin-top: 10px; }
    .timeline { position: relative; max-width: 1000px; margin: auto; }
    .timeline::after { content: ''; position: absolute; width: 3px; background: linear-gradient(#D4AF37, #FFD700, transparent); top: 0; bottom: 0; left: 50%; margin-left: -1.5px; }
    .timeline-item { padding: 20px 40px; position: relative; width: 50%; }
    .timeline-item.left { left: 0; }
    .timeline-item.right { left: 50%; }
    .timeline-item::before { content: ''; position: absolute; top: 30px; width: 16px; height: 16px; border-radius: 50%; background: #FFD700; border: 2px solid #000; box-shadow: 0 0 15px #FFD700; z-index: 1; }
    .timeline-item.left::before { right: -8px; }
    .timeline-item.right::before { left: -8px; }
    .content { padding: 25px; background: linear-gradient(145deg, #111, #050505); border-radius: 15px; border: 1px solid rgba(255,255,255,0.05); transition: 0.3s; }
    .content:hover { transform: scale(1.05); border: 1px solid rgba(212,175,55,0.6); box-shadow: 0 0 25px rgba(212,175,55,0.2); }
    .time { font-size: 14px; color: #FFD700; font-weight: 600; }
    .content h3 { margin-top: 8px; font-size: 20px; font-weight: 700; background: linear-gradient(90deg, #D4AF37, #FFD700, #FFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .content p { margin-top: 8px; font-size: 14px; color: #bbb; }
    @media(max-width:768px){ .timeline::after { left: 20px; } .timeline-item { width: 100%; padding-left: 60px; padding-right: 20px; } .timeline-item.right { left: 0%; } .timeline-item.left::before, .timeline-item.right::before { left: 10px; } }

    /* PARTNERS SECTION */
    .partners-section { position: relative; padding: 120px 0; background: radial-gradient(circle at top, #0a0a0a 0%, #000 65%); overflow: hidden; }
    .partners-header { text-align: center; padding: 0 8%; margin-bottom: 46px; }
    .partners-header h2 { font-size: clamp(34px, 5vw, 58px); font-weight: 800; background: linear-gradient(90deg, #b8860b, #ffd700, #fff4b0, #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .partners-header p { margin-top: 12px; color: #c4c4c4; font-size: 16px; }
    .partners-carousel { position: relative; overflow: hidden; mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%); -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%); }
    .partners-track { display: flex; width: max-content; gap: 20px; animation: partnerScroll 30s linear infinite; padding: 10px 0; }
    .partners-carousel:hover .partners-track { animation-play-state: paused; }
    .partner-card { min-width: 300px; max-width: 300px; border-radius: 22px; padding: 22px; background: linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.015)), linear-gradient(180deg, #111, #050505); border: 1px solid rgba(255,215,0,0.18); box-shadow: 0 16px 45px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 14px; justify-content: space-between; }
    .partner-logo-wrap { height: 70px; display: flex; align-items: center; justify-content: center; border-radius: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px; }
    .partner-logo-wrap img { max-width: 100%; max-height: 46px; width: auto; height: auto; object-fit: contain; display: block; }
    .partner-meta small { color: #ffd979; font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; }
    .partner-meta h3 { margin-top: 8px; color: #fff; font-size: 20px; font-weight: 700; }
    @keyframes partnerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @media (max-width: 768px) { .partners-section { padding: 90px 0; } .partners-header { padding: 0 6%; } .partner-card { min-width: 250px; max-width: 250px; } .partner-meta h3 { font-size: 17px; } .partners-track { gap: 14px; animation-duration: 22s; } }

    /* CTA SECTION */
    .cta-section { position: relative; padding: 150px 8%; background: radial-gradient(circle at center, #0a0a0a 0%, #000 75%), linear-gradient(180deg, rgba(255,215,0,0.05), transparent); text-align: center; overflow: hidden; box-shadow: inset 0 0 120px rgba(255,215,0,0.08); }
    .cta-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 70px 70px; opacity: 0.25; pointer-events: none; }
    .cta-glow { position: absolute; top: 50%; left: 50%; width: 700px; height: 700px; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(255,215,0,0.22), transparent 60%); filter: blur(40px); animation: pulseGlow 4s ease-in-out infinite; }
    @keyframes pulseGlow { 0%,100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.08); } }
    .cta-content { position: relative; z-index: 2; }
    .cta-badge { display: inline-block; padding: 10px 22px; margin-bottom: 25px; border-radius: 999px; background: linear-gradient(90deg, #D4AF37, #FFD700); color: #000; font-weight: 700; font-size: 13px; }
    .cta-content h2 { font-size: clamp(34px, 5vw, 56px); font-weight: 900; line-height: 1.2; background: linear-gradient(90deg, #b8860b, #ffd700, #fff4b0, #ffffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .cta-content p { margin-top: 20px; font-size: 18px; color: #c0c0c0; }
    .cta-btn { display: inline-block; margin-top: 40px; padding: 18px 50px; border-radius: 999px; font-size: 18px; font-weight: 800; text-decoration: none !important; color: #000; background: linear-gradient(90deg, #b8860b, #ffd700, #fff4b0); box-shadow: 0 10px 30px rgba(255,215,0,0.35), 0 0 35px rgba(212,175,55,0.25); transition: 0.3s ease; position: relative; overflow: hidden; filter: none; }
    .cta-btn:hover { transform: translateY(-4px) scale(1.05); box-shadow: 0 15px 45px rgba(255,215,0,0.45), 0 0 60px rgba(212,175,55,0.35); }
    .cta-sub { margin-top: 12px; color: #aaa; font-size: 14px; }
    .cta-nominate-row { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 14px; margin-top: 24px; }
    .cta-btn-nominate { display: inline-block; padding: 14px 22px; border-radius: 999px; font-size: 15px; font-weight: 700; text-decoration: none !important; color: #ffd700; background: rgba(255,215,0,0.08); border: 1px solid rgba(255,215,0,0.45); transition: 0.3s ease; }
    .cta-btn-nominate:hover { background: rgba(255,215,0,0.15); border-color: #ffd700; transform: translateY(-2px); }
    .cta-trust { margin-top: 30px; font-size: 14px; color: #bdbdbd; line-height: 1.8; position: relative; --tick: #ffd700; letter-spacing: 0.2px; }
    .cta-trust::selection { background: transparent; }
    @media(max-width:768px){ .cta-section { padding: 100px 6%; } .cta-btn { width: 100%; max-width: 320px; } .cta-nominate-row { flex-direction: column; } .cta-btn-nominate { width: 100%; max-width: 340px; text-align: center; box-sizing: border-box; } }

    /* FOOTER — site chrome only (no hero-style frames/glow/grid) */
    .site-footer { padding: 48px 5% 36px; background: #0a0a0a; border-top: 1px solid #1c1c1c; }
    .footer-inner { max-width: 560px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .footer-brand-logo { width: auto; max-width: min(92vw, 380px); height: auto; display: block; margin: 0; object-fit: contain; opacity: 0.88; }
    .footer-tagline { margin: 0; font-size: 13px; line-height: 1.5; color: #8a8a8a; font-weight: 500; }
    .footer-copy { margin: 0; font-size: 12px; line-height: 1.6; color: #555; }
    .footer-credit { margin: 0; font-size: 12px; line-height: 1.6; color: #555; }
    .footer-credit a { color: #6e6e6e; text-decoration: underline; text-underline-offset: 3px; transition: color 0.2s ease; }
    .footer-credit a:hover { color: #9a9a9a; }
    @media (max-width: 480px) { .site-footer { padding: 36px 5% 28px; } .footer-brand-logo { max-width: 260px; } .footer-tagline { font-size: 12px; } }
  `;

  return (
    <div style={{ background: "#000", fontFamily: "'Poppins', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{globalStyles}</style>
      {isLoading ? (
        <div className="launch-screen">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={`spark-${index}`}
              className={`launch-sparkle ${showSparkles ? "active" : ""}`}
              style={{
                left: "50%",
                top: "50%",
                animationDelay: `${index * 0.02}s`,
                "--spark-x": `${Math.cos((index / 24) * Math.PI * 2) * (120 + (index % 4) * 24)}px`,
                "--spark-y": `${Math.sin((index / 24) * Math.PI * 2) * (120 + (index % 4) * 24)}px`,
              }}
            ></span>
          ))}
          <div className="launch-center">
            <p className="launch-title">Website launch in</p>
            {launchCount > 0 ? (
              <h1 className="launch-count">{launchCount}</h1>
            ) : (
              <h1 className="launch-open">Sparkles... Website Open!</h1>
            )}
            <p className="launch-sub">Get ready for the Telugu Creators Summit vibes</p>
          </div>
        </div>
      ) : (
        <>

      {/* SVG GRADIENT DEFINITION */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFF5CC" />
          </linearGradient>
        </defs>
      </svg>

      {/* HERO SECTION */}
      <section className="hero-section scroll-section" ref={addToSectionRefs}>
        <div className="hero-grid"></div>
        <div className="gold-glow top-right"></div>
        <div className="gold-glow bottom-left"></div>
        <div className="hero-ring ring-one"></div>
        <div className="hero-ring ring-two"></div>
        <div className="hero-content">
          <span className="hero-badge">May Edition 2026</span>
          <div className="hero-logo-wrap">
            <img
              src={HERO_LOGO_URL}
              alt="Hero Logo"
              className="hero-logo"
            />
          </div>
          <p className="hero-subtext">Creators. Influence. Growth. One powerful summit.</p>
          <div className="hero-countdown" aria-live="polite">
            <p className="hero-countdown-title">10 May 2026 · 9:00 AM IST</p>
            <div className="hero-countdown-row">
              <div className="hero-countdown-cell">
                <div className="hero-countdown-num">{heroCountdown.days}</div>
                <div className="hero-countdown-unit">days</div>
              </div>
              <div className="hero-countdown-cell">
                <div className="hero-countdown-num">{String(heroCountdown.hours).padStart(2, "0")}</div>
                <div className="hero-countdown-unit">hours</div>
              </div>
              <div className="hero-countdown-cell">
                <div className="hero-countdown-num">{String(heroCountdown.minutes).padStart(2, "0")}</div>
                <div className="hero-countdown-unit">mins</div>
              </div>
              <div className="hero-countdown-cell">
                <div className="hero-countdown-num">{String(heroCountdown.seconds).padStart(2, "0")}</div>
                <div className="hero-countdown-unit">seconds</div>
              </div>
            </div>
          </div>
          <a
            href="https://learn.superaiacademy.com/web/checkout/69f1205e575814549be59b60"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-speaker-btn"
          >
            Register Your Spot Now!
          </a>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-strip">
        <div className="marquee-track">
          <span> Telugu Creators Summit 2026</span>
          <span>•</span>
          <span>Creators • Influencers • Brands</span>
          <span>•</span>
          <span>Monetization • Growth • Networking</span>
          <span>•</span>
          <span>Build Your Personal Brand</span>
          <span>•</span>
          <span>Join The Creator Revolution</span>
          <span>•</span>

          <span> Telugu Creators Summit 2026</span>
          <span>•</span>
          <span>Creators • Influencers • Brands</span>
          <span>•</span>
          <span>Monetization • Growth • Networking</span>
          <span>•</span>
          <span>Build Your Personal Brand</span>
          <span>•</span>
          <span>Join The Creator Revolution</span>
          <span>•</span>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <section className="about-section scroll-section" ref={addToSectionRefs}>
        <h2 className="about-title" ref={addToRevealRefs}>About The Event</h2>
        <p className="about-subtitle" ref={addToRevealRefs}>
          Telugu Creators Summit 2026 is a premium gathering of digital creators, influencers, 
          and storytellers from Telugu states — designed to connect, collaborate, and scale 
          in the new creator economy.
        </p>

        <div className="about-grid">
          <div className="about-card" ref={addToRevealRefs}>
            <div className="about-icon">
              <svg viewBox="0 0 24 24">
                <path d="M17 10.5V7a5 5 0 0 0-10 0v3.5A2.5 2.5 0 0 0 4.5 13v5A2 2 0 0 0 6.5 20h11a2 2 0 0 0 2-2v-5a2.5 2.5 0 0 0-2.5-2.5ZM9 7a3 3 0 0 1 6 0v3H9Z"/>
              </svg>
            </div>
            <h3>Creator Ecosystem</h3>
            <p>Meet reel creators, YouTubers, influencers, and storytellers under one powerful platform.</p>
          </div>

          <div className="about-card" ref={addToRevealRefs}>
            <div className="about-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2a5 5 0 0 0-5 5c0 3.25 5 9 5 9s5-5.75 5-9a5 5 0 0 0-5-5Zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/>
              </svg>
            </div>
            <h3>Power Networking</h3>
            <p>Build real connections with creators, brands, and collaborators who can scale your journey.</p>
          </div>

          <div className="about-card" ref={addToRevealRefs}>
            <div className="about-icon">
              <svg viewBox="0 0 24 24">
                <path d="M13 2L3 14h7v8l10-12h-7z"/>
              </svg>
            </div>
            <h3>Growth Strategies</h3>
            <p>Learn content growth, monetization, and brand building directly from industry leaders.</p>
          </div>

          <div className="about-card" ref={addToRevealRefs}>
            <div className="about-icon">
              <svg viewBox="0 0 24 24">
                <path d="M4 4h16v12H5.17L4 17.17V4Zm2 2v6h12V6H6Zm0 8h8v2H6v-2Z"/>
              </svg>
            </div>
            <h3>Live Experience</h3>
            <p>Experience high-energy sessions, creator meetups, and real-time collaboration opportunities.</p>
          </div>
        </div>

        <div className="highlight-box" ref={addToRevealRefs}>
          <h2>300 Creators • One Stage • Unlimited Impact</h2>
          <p>Be part of the most powerful Telugu creator gathering of 2026 - May Edition.</p>
        </div>

        <div className="about-counter-wrap" ref={counterSectionRef}>
          <div className="about-counter-card">
            <h3>{counterValues[0]}+</h3>
            <p>Speakers</p>
          </div>
          <div className="about-counter-card">
            <h3>{counterValues[1]}+</h3>
            <p>Creators</p>
          </div>
          <div className="about-counter-card">
            <h3>{counterValues[2]}</h3>
            <p>Creator Awards</p>
          </div>
          <div className="about-counter-card">
            <h3>{counterValues[3]}</h3>
            <p>Powerful Summit</p>
          </div>
        </div>
      </section>

      {/* ATTEND SECTION */}
      <section className="attend-section scroll-section" ref={addToSectionRefs}>
        <div className="attend-bg-glow"></div>
        <div className="attend-header">
          <span className="attend-badge">For Telugu Digital Creators</span>
          <h2>Who Should Attend?</h2>
          <p>
            If you create content, build influence, or want to grow your personal brand
            in the Telugu digital space — this summit is built for you.
          </p>
        </div>

        <div className="attend-grid">
          <div className="attend-card">
            <div className="attend-icon">
              <svg viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 12 14.5 2.5 2.5 0 0 0 12 9.5Zm5.25-2.75a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"/></svg>
            </div>
            <h3>Instagram Reel Creators</h3>
            <p>For creators making reels, short videos, comedy, lifestyle, education, or entertainment content.</p>
          </div>

          <div className="attend-card">
            <div className="attend-icon">
              <svg viewBox="0 0 24 24"><path d="M21.8 8s-.2-1.6-.8-2.3c-.8-.8-1.7-.8-2.1-.9C16 4.5 12 4.5 12 4.5s-4 0-6.9.3c-.4.1-1.3.1-2.1.9C2.4 6.4 2.2 8 2.2 8S2 9.9 2 11.8v.4C2 14.1 2.2 16 2.2 16s.2 1.6.8 2.3c.8.8 1.9.8 2.4.9 1.8.2 6.6.3 6.6.3s4 0 6.9-.3c.4-.1 1.3-.1 2.1-.9.6-.7.8-2.3.8-2.3s.2-1.9.2-3.8v-.4C22 9.9 21.8 8 21.8 8ZM10 15.2V8.8l5.5 3.2L10 15.2Z"/></svg>
            </div>
            <h3>YouTubers & Video Creators</h3>
            <p>For creators who want to grow their channel, improve content quality, and build loyal audiences.</p>
          </div>

          <div className="attend-card">
            <div className="attend-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2 15 8.5 22 9.2 16.7 13.8 18.3 21 12 17.3 5.7 21 7.3 13.8 2 9.2 9 8.5 12 2Z"/></svg>
            </div>
            <h3>Influencers & Personal Brands</h3>
            <p>For people who want to turn visibility into authority, collaborations, and income.</p>
          </div>

          <div className="attend-card">
            <div className="attend-icon">
              <svg viewBox="0 0 24 24"><path d="M3 4h18v4H3V4Zm0 6h8v10H3V10Zm10 0h8v4h-8v-4Zm0 6h8v4h-8v-4Z"/></svg>
            </div>
            <h3>Digital Marketers & Agencies</h3>
            <p>For marketers who want to connect with creators and understand the creator economy.</p>
          </div>

          <div className="attend-card">
            <div className="attend-icon">
              <svg viewBox="0 0 24 24"><path d="M4 7h16v13H4V7Zm2 2v9h12V9H6Zm3-5h6l1 2H8l1-2Z"/></svg>
            </div>
            <h3>Business Owners & Brands</h3>
            <p>For brands looking to collaborate with Telugu creators for promotion, storytelling, and growth.</p>
          </div>

          <div className="attend-card">
            <div className="attend-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2c3.5 2.2 5.5 5.2 5.5 8.5 0 4-2.7 7.4-5.5 11.5-2.8-4.1-5.5-7.5-5.5-11.5C6.5 7.2 8.5 4.2 12 2Zm0 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
            </div>
            <h3>Aspiring Creators</h3>
            <p>For beginners who want clarity, confidence, and direction to start their creator journey.</p>
          </div>
        </div>

        <div className="attend-highlight">
          From beginner creators to established influencers — this is your stage to connect, learn, and grow.
        </div>
      </section>

      {/* JOURNEY SECTION */}
      <section className="journey-section scroll-section" ref={addToSectionRefs}>
        <div className="journey-header">
          <h2>Your Creator Transformation</h2>
          <p>This is not just an event — it’s a turning point.</p>
        </div>

        <div className="journey-flow">
          <div className="journey-step" ref={addToStepRefs}>
            <div className="circle">01</div>
            <h3>Confusion</h3>
            <p>Not sure what to post, grow, or monetize.</p>
          </div>
          <div className="line"></div>

          <div className="journey-step" ref={addToStepRefs}>
            <div className="circle">02</div>
            <h3>Clarity</h3>
            <p>Learn proven systems & strategies.</p>
          </div>
          <div className="line"></div>

          <div className="journey-step" ref={addToStepRefs}>
            <div className="circle">03</div>
            <h3>Connections</h3>
            <p>Meet creators & brands.</p>
          </div>
          <div className="line"></div>

          <div className="journey-step" ref={addToStepRefs}>
            <div className="circle">04</div>
            <h3>Growth</h3>
            <p>Build your audience & authority.</p>
          </div>
          <div className="line"></div>

          <div className="journey-step" ref={addToStepRefs}>
            <div className="circle">05</div>
            <h3>Monetization</h3>
            <p>Turn content into income.</p>
          </div>
        </div>

        <div className="journey-highlight">
          You don’t attend this event. You evolve through it.
        </div>
        <div className="journey-cta">
          <a href="https://learn.superaiacademy.com/l/8ffc599ac2" target="_blank" rel="noopener noreferrer">
            Register Your Spot - May Edition
          </a>
        </div>
      </section>

      {/* SPEAKERS SECTION */}
      <section className="speakers-section scroll-section" ref={addToSectionRefs}>
        <div className="speakers-header">
          <h2>Featured Speakers</h2>
          <p>Learn from creators who are already winning in the digital space.</p>
        </div>

        <div className="speakers-grid">
         

          <div className="speaker-card">
            <div className="speaker-img">
              <img src="https://nikeelugunda.com/wp-content/uploads/2026/05/BNS-Srinivas-scaled.png" alt="Speaker" />
            </div>
            <h3>BNS Srinivas</h3>
            <p className="designation">Founder, Telugu SUPER Humans</p>
            <span className="tag">YouTube Growth</span>
          </div>

          <div className="speaker-card">
            <div className="speaker-img">
              <img src="https://nikeelugunda.com/wp-content/uploads/2026/05/images.jpg" alt="Speaker" />
            </div>
            <h3>Gampa Nageshwar Rao</h3>
            <p className="designation">Founder, Impact International</p>
            <span className="tag">Motivational Speaker</span>
          </div>

          <div className="speaker-card">
            <div className="speaker-img">
              <img src="https://nikeelugunda.com/wp-content/uploads/2026/05/sravya.jpg" alt="Speaker" />
            </div>
            <h3>Dr. Sravya Buggana</h3>
            <p className="designation">Senior Gynecologist & Obstetrician</p>
            <span className="tag">Instagram Creator</span>
          </div>

          <div className="speaker-card">
            <div className="speaker-img">
              <img src="https://nikeelugunda.com/wp-content/uploads/2026/05/images-1.jpg" alt="Speaker" />
            </div>
            <h3>PVS Swetha</h3>
            <p className="designation">Dubbing Artiste</p>
            <span className="tag">Instagram Creator</span>
          </div>

          

          <div className="speaker-card">
            <div className="speaker-img">
              <img src="https://nikeelugunda.com/wp-content/uploads/2026/05/channels4_profile-1.jpg" alt="Speaker" />
            </div>
            <h3>Anil Geela</h3>
            <p className="designation">My Village Show</p>
            <span className="tag">Actor</span>
          </div>

{/*           
#000 */}
      </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="experience-section scroll-section" ref={addToSectionRefs}>
        <div className="experience-header">
          <span className="experience-badge">Summit Experience</span>
          <h2>Inside The Summit Experience</h2>
          <p>One powerful day designed to help Telugu creators connect, learn, collaborate, and grow.</p>
        </div>

        <div className="experience-stage">
          <div className="stage-glow"></div>
          <div className="experience-center">
            <div className="center-ring">
              <span>LIVE</span>
              <h3>Creator Energy</h3>
              <p>Meet. Learn. Create. Grow.</p>
            </div>
          </div>

          <div className="experience-card card-1">
            <span className="number">01</span>
            <h3>Power Keynotes</h3>
            <p>Learn from creators, growth experts, and digital leaders.</p>
          </div>

          <div className="experience-card card-2">
            <span className="number">02</span>
            <h3>Creator Networking</h3>
            <p>Meet reel makers, YouTubers, influencers, and brand builders.</p>
          </div>

          <div className="experience-card card-3">
            <span className="number">03</span>
            <h3>Live Panel Discussions</h3>
            <p>Real conversations on growth, monetization, AI, branding, and collaborations.</p>
          </div>

          <div className="experience-card card-4">
            <span className="number">04</span>
            <h3>Collaboration Zone</h3>
            <p>Find creators and brands to work with after the event.</p>
          </div>

          <div className="experience-card card-5">
            <span className="number">05</span>
            <h3>Growth Sessions</h3>
            <p>Practical systems for reels, YouTube, personal branding, and income.</p>
          </div>

          <div className="experience-card card-6">
            <span className="number">06</span>
            <h3>Recognition Spotlights</h3>
            <p>Celebrate emerging Telugu creators and powerful creator stories.</p>
          </div>
        </div>

        <div className="experience-highlight">
          One day. One community. Infinite creator possibilities.
        </div>
      </section>

      {/* ACCESS SECTION */}
      <section className="access-section scroll-section" ref={addToSectionRefs}>
        <div className="access-wrap">
          <div className="access-left">
            <span className="access-label">Included With Registration</span>
            <h2>Your Creator Pass Unlocks More</h2>
            <p>
              Every registered attendee gets a premium event experience designed for comfort,
              networking, memories, and creator-level access.
            </p>
          </div>

          <div className="access-ticket">
            <div className="ticket-top">
              <span>TELUGU CREATORS SUMMIT 2026</span>
              <strong>CREATOR PASS</strong>
            </div>

            <div className="ticket-divider"></div>

            <div className="access-items">
              <div className="access-item">
                <div className="access-icon">
                  <svg viewBox="0 0 24 24"><path d="M20 7h-2.2A3 3 0 0 0 12 4.6 3 3 0 0 0 6.2 7H4a2 2 0 0 0-2 2v3h20V9a2 2 0 0 0-2-2ZM9 7a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm6 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1ZM3 14v6a2 2 0 0 0 2 2h6v-8H3Zm10 0v8h6a2 2 0 0 0 2-2v-6h-8Z"/></svg>
                </div>
                <div>
                  <h3>Swag</h3>
                  <p>Premium summit goodies and creator memories.</p>
                </div>
              </div>

              <div className="access-item">
                <div className="access-icon">
                  <svg viewBox="0 0 24 24"><path d="M7 2h2v20H7v-8H5V7a5 5 0 0 1 2-5Zm7 0h2v8h1V2h2v8h1V2h2v9a4 4 0 0 1-4 4v7h-2v-7a4 4 0 0 1-4-4V2h2v8h1V2Z"/></svg>
                </div>
                <div>
                  <h3>Lunch</h3>
                  <p>Enjoy lunch and conversations with fellow creators.</p>
                </div>
              </div>

              <div className="access-item">
                <div className="access-icon">
                  <svg viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v4a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6V6a2 2 0 0 1 2-2Zm5 4v8h2V8H9Zm4 0v8h2V8h-2Z"/></svg>
                </div>
                <div>
                  <h3>Creator Pass</h3>
                  <p>Your official access badge for the summit.</p>
                </div>
              </div>

              <div className="access-item">
                <div className="access-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 2 3 6v6c0 5.5 3.8 9.7 9 10 5.2-.3 9-4.5 9-10V6l-9-4Zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7Z"/></svg>
                </div>
                <div>
                  <h3>Event Access</h3>
                  <p>Entry to sessions, networking zones, and creator experiences.</p>
                </div>
              </div>
            </div>

            <div className="ticket-bottom">
              <span>Limited to 300 Members Only</span>
              <a href="https://learn.superaiacademy.com/l/8ffc599ac2" target="_blank" rel="noopener noreferrer">Register Today</a>
            </div>
          </div>
        </div>
      </section>

      {/* AGENDA SECTION */}
      <section className="agenda-section scroll-section" ref={addToSectionRefs}>
        <div className="agenda-header">
          <h2>Event Agenda</h2>
          <p>Experience a power-packed day designed for creators.</p>
        </div>

        <div className="timeline">
          <div className="timeline-item left">
            <div className="content">
              <span className="time">10:00 AM</span>
              <h3>Registration & Networking</h3>
              <p>Meet fellow creators, connect, and kickstart the experience.</p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="content">
              <span className="time">11:00 AM</span>
              <h3>Opening Keynote</h3>
              <p>Inspiring session from top creators and industry leaders.</p>
            </div>
          </div>

          <div className="timeline-item left">
            <div className="content">
              <span className="time">12:30 PM</span>
              <h3>Creator Sessions</h3>
              <p>Deep dive into content strategies, growth, and monetization.</p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="content">
              <span className="time">1:30 PM</span>
              <h3>Lunch & Networking</h3>
              <p>Enjoy lunch while building meaningful creator connections.</p>
            </div>
          </div>

          <div className="timeline-item left">
            <div className="content">
              <span className="time">2:30 PM</span>
              <h3>Panel Discussion</h3>
              <p>Real conversations on growth, branding, and collaborations.</p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="content">
              <span className="time">4:00 PM</span>
              <h3>Collaboration & Open Networking</h3>
              <p>Find creators, partners, and opportunities to grow together.</p>
            </div>
          </div>

          <div className="timeline-item left">
            <div className="content">
              <span className="time">5:00 PM</span>
              <h3>Closing & Recognition</h3>
              <p>Celebrating creators and wrapping up an unforgettable experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS SECTION */}
      <section className="partners-section scroll-section" ref={addToSectionRefs}>
        <div className="partners-header">
          <h2>Our Partners</h2>
          <p>Strong collaborations powering the Telugu Creators Summit experience.</p>
        </div>

        <div className="partners-carousel">
          <div className="partners-track">
            {[...partners, ...partners].map((partner, index) => (
              <article className="partner-card" key={`${partner.name}-${index}`}>
                <div className="partner-logo-wrap">
                  <img src={`${process.env.PUBLIC_URL}${partner.logo}`} alt={`${partner.name} logo`} loading="lazy" />
                </div>
                <div className="partner-meta">
                  <small>{partner.label}</small>
                  <h3>{partner.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section scroll-section" ref={addToSectionRefs}>
        <div className="cta-grid"></div>
        <div className="cta-glow"></div>

        <div className="cta-content">
          <div className="cta-badge">Only 300 Creator Passes Available</div>
          <h2>
            This Is Where Telugu Creators Level Up.
            <br />
            Are You In?
          </h2>
          <p>
            Join the most powerful creator gathering of 2026.  
            Learn. Network. Monetize. Grow faster than ever before.
          </p>

          <div className="cta-actions">
            <a href="https://learn.superaiacademy.com/l/8ffc599ac2" target="_blank" rel="noopener noreferrer" className="cta-btn primary">
              Secure Your Spot For May Edition
            </a>
            <div className="cta-sub">
              <span>Filling Fast</span>
              <span>•</span>
              <span>Limited Seats</span>
            </div>
            <div className="cta-nominate-row">
              <a href="https://forms.gle/MJ7JG4VJeYkf9biR7" target="_blank" rel="noopener noreferrer" className="cta-btn-nominate">
                Nominate yourself as a Speaker
              </a>
              <a href="https://forms.gle/c1nyyz9p2uszBZSZ6" target="_blank" rel="noopener noreferrer" className="cta-btn-nominate">
                Nominate for the Awards
              </a>
            </div>
          </div>

          <div className="cta-trust">
            ✔ Instant Access & Confirmation  <br />
            ✔ Swag + Lunch Included  <br />
            ✔ Premium Networking Experience  
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <img src={HERO_LOGO_URL} alt="Telugu Creators Summit" className="footer-brand-logo" loading="lazy" />
          <p className="footer-tagline">Creators · Influence · Growth</p>
          <p className="footer-copy">© 2026 Telugu Creators Summit. All rights reserved.</p>
          <p className="footer-credit">
            Designed by{" "}
            <a href="https://digitalconnect.in" target="_blank" rel="noopener noreferrer">
              Digital Connect
            </a>
          </p>
        </div>
      </footer>
        </>
      )}
    </div>
  );
}

export default App;