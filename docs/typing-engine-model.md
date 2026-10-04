# Typing Engine Data Model

| Field | Type | Purpose |
|---|---|---|
| targetText | string | |
| typedText | string | |
| position | number | |
| correctCharacters | number | |
| incorrectCharacters | number | |
| totalCharacters | number | |
| isRunning | boolean | |
| isFinished | boolean | |
| elapsedTime | number | |
| selectedMode | "time" or "words" | |
| selectedLimit | number | |



## Character Comparison

For each typed character:

- Compare it with the character at the same position in `targetText`.
- Count it as correct when the characters match.
- Count it as incorrect when they do not match.
- Advance `position` after each character.
- The test finishes when the target text is complete, the time limit expires, or the selected word count is reached.