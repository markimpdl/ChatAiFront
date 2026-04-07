# ChatAI — Conversational AI Interface

A modern chat application built with **Angular 17** that integrates with a **.NET Web API** powered by an AI backend. Supports multi-turn conversations with full context history, enabling coherent, contextual dialogue across multiple exchanges.

---

## Features

- **Multi-turn conversation** — sends the full chat history on each request, allowing the AI to maintain context across the entire session
- **Reactive architecture** — built with RxJS observables and Angular's `HttpClient`, with graceful error handling
- **Environment-aware configuration** — separate `environment.ts` files for development and production, wired via Angular CLI `fileReplacements`
- **Responsive UI** — uses [ng-zorro-antd](https://ng.ant.design/) (Ant Design for Angular) for a clean, professional interface with loading states and message bubbles
- **Full test coverage** — unit tests (Karma + Jasmine) and end-to-end tests (Playwright)

---

## Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | Angular 17 (standalone components)      |
| Language    | TypeScript 5.4                          |
| UI Library  | ng-zorro-antd 17 (Ant Design)           |
| HTTP        | Angular `HttpClient` + RxJS 7.8         |
| Backend     | .NET Web API (separate repository)      |
| Unit Tests  | Karma + Jasmine                         |
| E2E Tests   | Playwright                              |

---

## Architecture

```
src/app/
├── models/
│   └── chat.model.ts        # Shared interfaces: ChatMessage, UiMessage, QuestionRequest
├── chat-ai.service.ts       # HTTP service — posts question + history, handles plain text and JSON responses
├── chat/
│   ├── chat.component.ts    # Chat UI — manages message list and conversation history state
│   ├── chat.component.html  # Template with message bubbles and input area
│   └── chat.component.css   # Component-scoped styles
└── app.component.ts         # Root standalone component
```

**Key design decisions:**
- The service uses `responseType: 'text'` and attempts `JSON.parse` with a fallback, making it compatible with both plain-text and JSON API responses without breaking changes
- Conversation history is kept as a separate `ChatMessage[]` array (API format) from the display `UiMessage[]` array (UI format), cleanly separating concerns
- All standalone components — no `NgModule` boilerplate

---

## Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI 17: `npm install -g @angular/cli`
- .NET 8 SDK (for the backend API)

### Installation

```bash
git clone https://github.com/your-username/ChatApiFront.git
cd ChatApiFront/chat-ai
npm install
```

### Configuration

Edit `src/environments/environment.ts` with your API URL:

```ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7105/api/ChatAi'
};
```

### Running

```bash
# Development server
npm start
# → http://localhost:4200

# Production build
npm run build
```

---

## API Contract

The frontend communicates with the backend via a single endpoint:

**`POST /api/ChatAi`**

```json
// Request
{
  "question": "What is dependency injection?",
  "history": [
    { "role": "user",      "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help?" }
  ]
}

// Response — plain text or JSON { "answer": "..." }
```

---

## Testing

```bash
# Unit tests (Karma + Jasmine)
npm test

# End-to-end tests (Playwright)
npm run test:e2e

# Playwright with interactive UI
npm run test:e2e:ui
```

---

## What This Project Demonstrates

- **Angular 17 standalone components** and modern Angular patterns (no legacy NgModules)
- **RxJS reactive programming** — observable-based HTTP, operator chaining (`map`, error handling)
- **Clean separation of concerns** — models, service layer, and UI components are fully decoupled
- **API integration** — adaptive response parsing, environment-based configuration
- **Testing discipline** — both unit and integration-level E2E tests with Playwright
- **Component-level state management** without external libraries

---

## Related

- **Backend repository:** [ChatAiApi](https://github.com/markimpdl/ChatAiApi) — .NET 8 Web API that connects to the AI model

---

## License

MIT
