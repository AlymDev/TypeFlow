export function calculateAccuracy(correctCharacters: number, totalCharacters: number): number {
  if (totalCharacters <= 0) {
    return 0;
  }

  return (correctCharacters / totalCharacters) * 100;
}

export function calculateWpm(correctCharacters: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) {
    return 0;
  }

  return (correctCharacters / 5) / (elapsedSeconds / 60);
}
