# Add AI Agent Integration Requirements

## Goal

Update the report generation requirements so the team boundary is clear: the report-generation team owns user context collection, orchestration, UI triggers, persistence, editing, export, and integration with an external AI agent; the AI agent team owns model selection, prompt strategy, model configuration, and generated-content internals.

## What I Already Know

- The current requirements document is `report-generation/requirements-analysis.md`.
- The team has already removed login/register/auth and runtime LLM configuration from its scope.
- Another team owns the AI agent used for generation.
- The AI agent team expects this module to provide one-click generation based on user context.
- The one-click generation must support at least two modes: output an outline, or output a full report document.

## Requirements

- Clarify the ownership split between the report-generation team and the AI agent team.
- Add AI agent integration as an in-scope orchestration capability, not as model implementation.
- Describe one-click outline generation and one-click document generation.
- Define the suggested request and response contract for cross-team integration.
- Add mock/canned-response support as an integration testing requirement.
- Update MVP scope, risks, open questions, acceptance checklist, and development breakdown.

## Acceptance Criteria

- [x] Requirements document states that AI model configuration and agent internals remain out of scope.
- [x] Requirements document states that our system assembles user context and calls the external AI agent.
- [x] Requirements document defines outline and document generation modes.
- [x] Requirements document includes key request and response fields for the integration contract.
- [x] Requirements document includes failure handling, retry, status/progress, and mock integration requirements.

## Definition of Done

- `report-generation/requirements-analysis.md` updated.
- Markdown reviewed for clarity and UTF-8 Chinese text preserved.
- Changes committed and pushed to the user's fork branch.
- No PR opened.

## Out of Scope

- Implementing the AI agent.
- Selecting or configuring LLM providers, model names, API keys, prompts, or tool chains.
- Opening a GitHub PR in this task.

## Technical Notes

- This is a documentation change only.
- Cross-team integration should be treated as an explicit data contract because generation crosses team and service boundaries.
