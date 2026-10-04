"use client";

import { useEffect, useRef, useState } from "react";

import { calculateAccuracy, calculateWpm } from "../lib/typing";

const WORDS_POOL = [
  "the",
  "quick",
  "brown",
  "fox",
  "jumps",
  "over",
  "lazy",
  "dog",
  "practice",
  "typing",
  "accuracy",
  "speed",
  "keyboard",
  "focus",
  "rhythm",
  "steady",
  "flow",
  "cursor",
  "screen",
  "window",
  "skills",
  "perfect",
  "habit",
  "daily",
  "improvement",
];

const TIME_OPTIONS = [15, 30, 60, 120];
const WORD_OPTIONS = [10, 25, 50, 100];
const DEFAULT_TIME = 30;
const DEFAULT_WORDS = 25;

function buildTargetText(wordCount: number) {
  const words: string[] = [];

  for (let index = 0; index < wordCount; index += 1) {
    words.push(WORDS_POOL[index % WORDS_POOL.length]);
  }

  return words.join(" ");
}

export default function Home() {
  const inputRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"time" | "words">("time");
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME);
  const [selectedWords, setSelectedWords] = useState(DEFAULT_WORDS);
  const [targetText, setTargetText] = useState(buildTargetText(DEFAULT_WORDS));
  const [typedText, setTypedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isStarted || isFinished || mode !== "time") {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          setIsFinished(true);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isStarted, isFinished, mode]);

  const resetTest = () => {
    setTypedText("");
    setIsStarted(false);
    setIsFinished(false);
    setTimeLeft(selectedTime);
    setTargetText(mode === "time" ? buildTargetText(DEFAULT_WORDS) : buildTargetText(selectedWords));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") return;

    if (event.key === "Escape") {
      resetTest();
      return;
    }

    if (isFinished) {
      return;
    }

    if (event.key.length !== 1 && event.key !== "Backspace") {
      return;
    }

    if (!isStarted) {
      setIsStarted(true);
    }

    event.preventDefault();

    if (event.key === "Backspace") {
      setTypedText((previous) => previous.slice(0, -1));
      return;
    }

    const nextValue = typedText + event.key;

    if (nextValue.length > targetText.length) {
      return;
    }

    setTypedText(nextValue);

    if (nextValue.length >= targetText.length) {
      setIsFinished(true);
    }
  };

  const totalTypedCharacters = typedText.length;
  const correctCharacters = typedText
    .split("")
    .filter((char, index) => char === targetText[index]).length;
  const incorrectCharacters = totalTypedCharacters - correctCharacters;
  const accuracy = calculateAccuracy(correctCharacters, totalTypedCharacters);
  const elapsedSeconds = mode === "time" ? selectedTime - timeLeft : Math.max(1, totalTypedCharacters / 5);
  const wpm = calculateWpm(correctCharacters, elapsedSeconds);

  const renderedCharacters = targetText.split("").map((char, index) => {
    const typedChar = typedText[index];

    let className = "text-zinc-500";

    if (typedChar == null) {
      className = "text-zinc-400";
    } else if (typedChar === char) {
      className = "text-emerald-600";
    } else {
      className = "text-red-500 bg-red-100";
    }

    if (index === typedText.length && !isFinished) {
      className += " border-b-2 border-zinc-900";
    }

    return (
      <span key={`${char}-${index}`} className={`text-2xl ${className}`}>
        {char}
      </span>
    );
  });

  const statusLabel = isFinished
    ? "Completed"
    : isStarted
      ? "Typing..."
      : "Press any key to start";

  const handleModeChange = (nextMode: "time" | "words") => {
    setMode(nextMode);
    setTypedText("");
    setIsStarted(false);
    setIsFinished(false);
    setTimeLeft(selectedTime);
    setTargetText(nextMode === "time" ? buildTargetText(DEFAULT_WORDS) : buildTargetText(selectedWords));
  };

  const handleTimeSelect = (seconds: number) => {
    setSelectedTime(seconds);
    setTimeLeft(seconds);
    setTypedText("");
    setIsStarted(false);
    setIsFinished(false);
    setTargetText(mode === "time" ? buildTargetText(DEFAULT_WORDS) : buildTargetText(selectedWords));
  };

  const handleWordsSelect = (words: number) => {
    setSelectedWords(words);
    setTypedText("");
    setIsStarted(false);
    setIsFinished(false);
    setTargetText(buildTargetText(words));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_20%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/75 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">TypeFlow</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Typing Practice</h1>
          </div>

          <div className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
            {mode === "time" ? `${timeLeft}s remaining` : `${selectedWords} words`}
          </div>
        </header>

        <section className="mb-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-400">Build speed and focus</p>
            <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-white md:text-5xl">
              Train your hands. Sharpen your rhythm.
            </h2>
            <p className="mt-4 max-w-xl text-base text-slate-300 md:text-lg">
              Practice with focused time challenges and word goals designed to help you type cleaner, faster, and with more confidence.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-sm font-medium text-cyan-300">
                {mode === "time" ? `${selectedTime}s challenge` : `${selectedWords}-word sprint`}
              </div>
              <div className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-sm font-medium text-slate-300">
                keyboard focus
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/30">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Quick stats</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Current WPM</div>
                <div className="mt-2 text-3xl font-semibold text-white">{wpm.toFixed(1)}</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Accuracy</div>
                <div className="mt-2 text-3xl font-semibold text-white">{accuracy.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-full bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => handleModeChange("time")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === "time" ? "bg-cyan-500 text-slate-950" : "text-slate-300 hover:text-white"
                }`}
              >
                Time mode
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("words")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === "words" ? "bg-cyan-500 text-slate-950" : "text-slate-300 hover:text-white"
                }`}
              >
                Words mode
              </button>
            </div>

            {mode === "time" ? (
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map((seconds) => (
                  <button
                    key={seconds}
                    type="button"
                    onClick={() => handleTimeSelect(seconds)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      selectedTime === seconds
                        ? "bg-white text-slate-950"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {WORD_OPTIONS.map((words) => (
                  <button
                    key={words}
                    type="button"
                    onClick={() => handleWordsSelect(words)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      selectedWords === words
                        ? "bg-white text-slate-950"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {words}w
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            ref={inputRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="outline-none"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {statusLabel}
              </p>

              <button
                type="button"
                onClick={resetTest}
                className="rounded-full border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Restart
              </button>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-6 leading-relaxed shadow-inner shadow-slate-950/80">
              {renderedCharacters}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-800/80 p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">WPM</div>
                <div className="mt-2 text-3xl font-semibold text-white">{wpm.toFixed(1)}</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-800/80 p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Accuracy</div>
                <div className="mt-2 text-3xl font-semibold text-white">{accuracy.toFixed(1)}%</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-800/80 p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Errors</div>
                <div className="mt-2 text-3xl font-semibold text-white">{incorrectCharacters}</div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-slate-300">
              <span>Correct characters: {correctCharacters} / {targetText.length}</span>
              <span>{timeLeft}s left</span>
            </div>

            {isFinished && (
              <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-white">Test complete</h2>
                  <button
                    type="button"
                    onClick={resetTest}
                    className="rounded-full bg-cyan-400 px-3 py-1.5 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
                  >
                    Try again
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-950/60 p-3">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">WPM</div>
                    <div className="mt-1 text-2xl font-semibold text-white">{wpm.toFixed(1)}</div>
                  </div>
                  <div className="rounded-xl bg-slate-950/60 p-3">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Accuracy</div>
                    <div className="mt-1 text-2xl font-semibold text-white">{accuracy.toFixed(1)}%</div>
                  </div>
                  <div className="rounded-xl bg-slate-950/60 p-3">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Errors</div>
                    <div className="mt-1 text-2xl font-semibold text-white">{incorrectCharacters}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}