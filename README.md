# TypeFlow

TypeFlow is a typing-speed and accuracy practice platform.

## Project Goals

- Measure typing speed in WPM.
- Track typing accuracy and errors.
- Support time-based and word-count tests.
- Let users review their results.
- Track progress in later development phases.

## Technology Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- Database: PostgreSQL
- Testing: Vitest and pytest

## Project Structure

- `frontend/` - Next.js application
- `backend/` - FastAPI application
- `docs/` - project documentation

## Current Status

Week 1 setup is complete:

- Frontend project scaffolded
- FastAPI backend skeleton created
- Typing-engine data model documented
- Backend health endpoint available at `/health`

## Running Locally

### Frontend

```powershell
cd frontend
npm install
npm run dev
