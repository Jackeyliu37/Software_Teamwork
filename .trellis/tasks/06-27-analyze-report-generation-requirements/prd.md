# Analyze Report Generation Requirements

## Goal

Read `report-generation/报告生成需求说明书.pdf` and produce a complete requirements analysis document for the report generation system so the team can use it for follow-up development planning.

## What I Already Know

* The user wants no PR for now; work should be committed and pushed only to the user's fork branch.
* The source PDF is already in the repository under `report-generation/`.
* The generated analysis should use the PDF content as the source material.
* The PDF has 6 pages.
* PyMuPDF can extract text, but the PDF text layer has Chinese encoding/mapping corruption, so extraction requires manual reconstruction from the readable structure.
* Windows Chinese OCR is installed, but current PowerShell/.NET binding attempts were not usable without additional WinRT metadata wiring.

## Assumptions (Temporary)

* The output should be a Markdown requirements analysis document stored next to the PDF.
* The intended system is an intelligent report-generation system supporting two fixed report types: `迎峰度夏检查报告` and `煤库库存审计报告`.
* The analysis should call out uncertain terms that could not be perfectly recovered from the PDF text layer.

## Open Questions

* None for this first analysis draft.

## Requirements (Evolving)

* Generate a complete requirements analysis document in Markdown.
* Include functional requirements, roles, workflows, data objects, non-functional expectations, risks, open questions, and MVP recommendations.
* Commit and push to the existing fork branch only; do not open a PR.

## Acceptance Criteria (Evolving)

* [ ] `report-generation/requirements-analysis.md` exists.
* [ ] The analysis covers all major PDF sections from overview through statistics/monitoring.
* [ ] Uncertain OCR/extraction terms are marked clearly.
* [ ] Changes are committed and pushed to `origin/docs/add-report-generation-document`.
* [ ] No PR is opened.

## Definition of Done (Team Quality Bar)

* Verify generated Markdown exists and is readable.
* Verify git status is clean after commit.
* Verify branch has been pushed to the user's fork.

## Out of Scope

* Editing the original PDF.
* Building the report-generation system in this task.
* Opening a GitHub PR.

## Technical Notes

* Temporary extraction files are under `.tmp/pdf-analysis/` and are not intended for commit.
* Because the PDF text layer is partially corrupted, the generated analysis is based on recoverable extracted text plus manual reconstruction of clearly readable section intent.
