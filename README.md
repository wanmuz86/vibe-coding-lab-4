# Task Manager Training Starter

A small in-memory task list for an AI-assisted development course. Participants share this baseline, then use it for codebase understanding, repository-aware planning, specification work, agent harness setup, agentic feature development, and build–test–fix loops.

The application is intentionally small: React and TypeScript on Vite, with plain CSS and no backend.

## Prerequisites

Install a supported Node.js version before installing dependencies. npm is included with Node.js.

| Runtime | Supported versions                                  |
| ------- | --------------------------------------------------- |
| Node.js | 22.12 or newer on the 22 line, or 24 and newer      |
| npm     | 10 or newer, as shipped with those Node.js releases |

Node.js 20 is not supported. Vitest 5, which runs the tests, requires Node.js 22.12+ or Node.js 24+.

This repository includes an `.nvmrc` file set to Node.js 22. If you use nvm, run `nvm use` in the project directory.

## Installation and startup

From the project root:

```bash
npm ci
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

`npm ci` installs the exact dependency tree in `package-lock.json`. Use it for class machines and for a clean reinstall. Use `npm install` only when you intend to update dependencies and refresh the lockfile.

To serve the production build locally:

```bash
npm run build
npm run preview
```

## Commands

| Command                | What it does                                                         |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run dev`          | Starts the Vite development server                                   |
| `npm run build`        | Typechecks the project, then creates the production build in `dist/` |
| `npm run preview`      | Serves the production build locally                                  |
| `npm test`             | Runs the test suite once and exits                                   |
| `npm run test:watch`   | Runs tests again when files change                                   |
| `npm run lint`         | Runs ESLint and fails on errors or warnings                          |
| `npm run typecheck`    | Runs the TypeScript project build without emitting JavaScript        |
| `npm run format`       | Rewrites files with Prettier                                         |
| `npm run format:check` | Checks formatting without changing files                             |
| `npm run check`        | Runs lint, typecheck, tests, format check, and build                 |

`npm run check` is the full baseline check. It should pass on a clean checkout.

## Features

- Add a task from a labelled title field and an Add Task button
- Submit the form with Enter
- Trim surrounding whitespace before a task is added
- Show visible feedback when the title is empty or only whitespace
- Keep tasks with the same title as separate items
- Mark a task complete or incomplete
- Delete a task
- Show how many tasks are still remaining
- Show an empty state when the list has no tasks

Each task has an `id`, a `title`, and a `completed` flag. Updates and deletions use the task id.

There is no maximum title length in this baseline.

## Data and reset

Tasks live in React state for the current page. The app starts with three fictional sample tasks, one of which is already complete. Refreshing the browser loads those sample tasks again. Nothing is written to local storage, a database, or a server.

## Directory overview

```text
src/app          Page composition and the main interface tests
src/components   Form, list, and task row
src/hooks        Task state for one running app
src/domain       Task type and pure task operations
src/data         Fictional starting tasks
src/styles       Global stylesheet
src/test         Test setup
```

`App` composes the page. Components render the interface from props. `useTasks` holds the list for that running app. Domain functions change task data without rendering anything. `initialTasks` is the sample data.

## Troubleshooting

**`npm run check` or `npm test` exits immediately with an engine or syntax error.**  
Check `node -v`. Install Node.js 22.12+ or Node.js 24+, then open a new terminal so the new version is on your `PATH`.

**`npm ci` cannot find `package-lock.json`.**  
Run the command from the project root, the directory that contains `package.json`.

**The page is blank.**  
Use the `http://localhost` URL from `npm run dev`. Opening `index.html` as a file does not start Vite.

**Port 5173 is already in use.**  
Stop the other dev server, or start this one on another port:

```bash
npm run dev -- --port 5174
```

**A fresh install still looks broken.**  
Stop the dev server, delete `node_modules`, and run `npm ci` again. Do not delete `package-lock.json`.

**Lint or formatting fails after you edit.**  
Run `npm run format`, then `npm run check`. Fix the remaining lint and type errors in the code. The baseline treats warnings as failures.
