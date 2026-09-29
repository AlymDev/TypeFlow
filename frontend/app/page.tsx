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
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-6">
      <div className="w-full max-w-5xl rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-full bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() => handleModeChange("time")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "time" ? "bg-zinc-900 text-white" : "text-zinc-700"
              }`}
            >
              Time mode
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("words")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "words" ? "bg-zinc-900 text-white" : "text-zinc-700"
              }`}
            >
              Words mode
            </button>
          </div>

          {mode === "time" ? (
            <div className="flex gap-2">
              {TIME_OPTIONS.map((seconds) => (
                <button
                  key={seconds}
                  type="button"
                  onClick={() => handleTimeSelect(seconds)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    selectedTime === seconds ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {seconds}s
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-2">
              {WORD_OPTIONS.map((words) => (
                <button
                  key={words}
                  type="button"
                  onClick={() => handleWordsSelect(words)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    selectedWords === words ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {words}w
                </button>
              ))}
            </div>
          )}

          {mode === "time" && (
            <div className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">
              Time left: {timeLeft}s
            </div>
          )}
        </div>

        <div
          ref={inputRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="outline-none"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-zinc-500">
            {statusLabel}
          </p>

          <div className="rounded-xl bg-zinc-50 p-6 leading-relaxed">
            {renderedCharacters}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-zinc-100 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">WPM</div>
              <div className="mt-1 text-2xl font-semibold">{wpm.toFixed(1)}</div>
            </div>
            <div className="rounded-xl bg-zinc-100 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Accuracy</div>
              <div className="mt-1 text-2xl font-semibold">{accuracy.toFixed(1)}%</div>
            </div>
            <div className="rounded-xl bg-zinc-100 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Errors</div>
              <div className="mt-1 text-2xl font-semibold">{incorrectCharacters}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-zinc-600">
              Correct characters: {correctCharacters} / {targetText.length}
            </p>
            <button
              type="button"
              onClick={resetTest}
              className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              Restart
            </button>
          </div>

          {isFinished && (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-zinc-900">Test complete</h2>
                <button
                  type="button"
                  onClick={resetTest}
                  className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-700"
                >
                  Try again
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">WPM</div>
                  <div className="mt-1 text-2xl font-semibold">{wpm.toFixed(1)}</div>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Accuracy</div>
                  <div className="mt-1 text-2xl font-semibold">{accuracy.toFixed(1)}%</div>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Errors</div>
                  <div className="mt-1 text-2xl font-semibold">{incorrectCharacters}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}