
# NASA Explorer
## 1. Project Overview
React application for view planets and exoplanets.
Functional requirements and application behavior must be defined in OpenSpec. Do not invent features or assume unconfirmed requirements. Ask first.

## 2. Tech Stack
- Next.js, React, TypeScript, SCSS
- Vitest for testing
Vite is listed in the initial context but must be verified.
Before making changes, inspect `package.json`, scripts, dependencies and configuration. Preserve the existing architecture. Do not change frameworks or install dependencies without approval.

## 3. Coding Standards
- Prefer functional components and custom hooks when appropriate.
- Use TypeScript strict mode where supported.
- Avoid `any`, duplicated logic and unnecessary abstractions.
- Keep components focused, aiming for fewer than 200 lines.
- Follow existing naming and architectural conventions.
- Handle loading, empty, success and error states where relevant.
- Avoid refactoring unrelated code.

## 4. UI and Design
- Dark mode only.
- Primary: `#96262F`
- Background: `#121A28`
- Accent: `#184C9A`
- Ever use rem for tipography
- Minimum typography size: `1rem`, unless justified by accessibility or design requirements.
- Support mobile and desktop.
- Use these Figma references:
  - `figma/home-mobile.png`
  - `figma/home.png`
  - `figma/detail-mobile.png`
  - `figma/detail.png`

Inspect mockups before implementing UI. Maintain visual consistency, semantic HTML, keyboard accessibility and sufficient contrast. Ask before inventing major interactions or design elements.

## 5. Testing
- Unit tests for business logic.
- Integration tests for API services.
- Test relevant edge cases and UI states.
- Reuse the existing testing framework.
- Run relevant tests, type checking and linting when available.
- Never claim checks passed unless they were executed.
- Report failures and unresolved issues.

## 6. OpenSpec / SDD
OpenSpec is the source of truth for approved requirements and changes.
- Explore the existing project before proposing changes.
- Define proposals, specifications and acceptance criteria before implementation.
- Divide work into small, verifiable tasks with explicit dependencies.
- Keep implementation aligned with approved specifications.

## 7. Change Control and Learning
Implement **one task at a time**. Approval of an overall plan does not authorize implementation of every task.
After each task, report changes, verification results and unresolved issues, then wait for approval before continuing.