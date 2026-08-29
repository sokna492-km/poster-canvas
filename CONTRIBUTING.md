# Contributing to Poster Studio

Thank you for your interest in contributing!

## Getting started

1. Fork the repository
2. Clone your fork: `git clone …`
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`

## Before submitting a PR

- Run `npm run lint`
- Run `npm run test`
- Keep changes focused — one feature or fix per PR
- Match existing code style (TypeScript strict, minimal abstraction)

## Project guidelines

- User code must stay in the sandbox iframe — do not add `eval`/`new Function` in the main app
- Use `configureApp()` for injectable services rather than hard-coding backends
- Add tests for compiler, data, and repository changes

## Reporting issues

Include steps to reproduce, expected vs actual behavior, and browser/OS if relevant.

## Questions

Open a GitHub issue for architecture or integration questions.
