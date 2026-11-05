# Prototype Instructions

Project showcase: use Chinese technical descriptions only (overview, framework, mechanisms, implementation approach, evolution, limitations and repository links). Do not copy project source code, installers or project attachments into the site. Exclude both timetable repositories and Personal-Source-Site itself. Only Personal-Knowledge-Base, DSH-Memory and SERA-Retrieval are included. Keep the existing warm ivory / olive / serif design and fluid layout.

Project articles must be detailed technical archives, not short summaries. Cover planned goals, problem definition, design principles and choices, technical paths, implementation schemes, architecture and mechanisms, evolution roadmap and records, major releases/events, evidence and current boundaries. Keep research evidence in the authoring workflow; project pages must be self-contained and link externally only to the project repository root. Do not render chapter citations, document/source-code links, bibliography or commit links. Integrate the technical details in the article itself, and distinguish historical facts, current published implementation and proposed work. Use a project directory plus chapter subpages with previous/next navigation for long articles.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
