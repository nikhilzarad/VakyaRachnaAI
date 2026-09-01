# VakyaRachna AI (Angular)

AI-powered writing tool built with Angular for writing assistance, refinement, and content transformation.

## Tech Stack

- Angular 17 (standalone components)
- TypeScript
- Tailwind CSS + SCSS
- Angular Material (selectively used)
- Groq API (LLaMA 3.1)

## Features

- Improve, Rewrite, Summarize, Expand, Formal, Casual, Shorten, Fix Grammar
- Custom instruction mode
- Use output as next input
- Local session history (last 5 transformations)
- Word and character counts
- Copy result to clipboard
- Ctrl/Cmd + Enter to run

## Project Structure

- src/app/app.component.ts: app shell and orchestration
- src/app/components/: UI components (action bar, input, output, history, custom prompt)
- src/app/services/ai.service.ts: API call logic
- src/app/utils/text-helpers.ts: text utilities
- src/app/actions.ts: action definitions

## Run Locally

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

## Environment

Set your Groq key in Angular environment files:

- src/environments/environment.ts
- src/environments/environment.prod.ts
