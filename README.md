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

For local development, add your key to `src/environments/environment.ts` (or copy the example file to `src/environments/environment.local.ts` for local overrides):

```bash
cp src/environments/environment.local.example.ts src/environments/environment.local.ts
```

Example `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  groqApiKey: 'gsk_...'
};
```

### Amplify Deployment

In the Amplify Console, open your app's branch settings and add an environment variable named `GROQ_API_KEY` with your Groq API key. The build specification validates this variable and generates `environment.prod.ts` only in the build environment before running the production build.

The current app calls Groq directly from the browser, so the key is included in the published JavaScript bundle. Use a restricted key for this deployment. For a secret that must never reach users, move the Groq request to a server-side API or Amplify function.
