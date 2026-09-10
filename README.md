# VakyaRachna AI (Angular)

AI-powered writing tool built with Angular for writing assistance, refinement, and content transformation.

## Tech Stack

- Angular 17 (standalone components)
- TypeScript
- Tailwind CSS + SCSS
- Angular Material (selectively used)
- Google AI Studio (Gemini)

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

For local development, add your Google AI Studio key to `src/environments/environment.local.ts` (this file is ignored by Git):

```bash
cp src/environments/environment.local.example.ts src/environments/environment.local.ts
```

Example:

```ts
export const environment = {
  production: false,
  googleAiApiKey: 'AIza...',
  googleAiModel: 'gemini-3.6-flash'
};
```

### Amplify Deployment

In the Amplify Console, open your app's branch settings and add an environment variable named `GOOGLE_AI_API_KEY` with your Google AI Studio API key. The build specification validates this variable and generates `environment.prod.ts` only in the build environment before running the production build. It also sets the model to `gemini-3.6-flash`.

The current app calls Google AI Studio directly from the browser, so the key is included in the published JavaScript bundle. Restrict the key by HTTP referrer and API usage in Google Cloud. For a secret that must never reach users, move the Gemini request to a server-side API or Amplify function.
