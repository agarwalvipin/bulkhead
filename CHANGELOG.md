# Changelog

All notable changes to Bulkhead will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.0] - 2026-01-04

### Added
- **Automated Test Suite** (`tests/`)
  - Implemented `pytest` + `jsonschema` validation suite
  - Added comprehensive valid/invalid test data for all 5 key phases
  - Added `run_tests.sh` helper script
  - Added GitHub Actions workflow (`.github/workflows/tests.yml`) for automated testing
- **Tutorials**
  - New step-by-step guide: `docs/tutorials/01-getting-started.md`
  - Cross-referenced tutorials in main README and example projects
- **Enhanced Documentation**
  - **Comparison Table** in README showing Bulkhead vs Traditional SDLC vs Unstructured AI
  - **"See It In Action"** section highlighting example projects
  - **Expanded FAQ** addressing naming confusion (Resilience4j), CI/CD integration, and ROI
  - **"Testing"** section in README

### Changed
- Improved README positioning to clearly distinguish from resilience engineering patterns
- Updated `examples/python-fastapi-jwt/README.md` to link to the new tutorial

---

## [2.3.0] - 2026-01-04

### Added
- **Workflow folder organization** - Workflows now organized into logical categories:
  - `core/` - 8-phase SDLC workflows (phase-0 through phase-7, checkpoint, status)
  - `orchestrators/` - Large project management (epic-orchestrator, modernization)
  - `integrations/` - External tools (github-project, pr-manager, changelog, feedback-loop)
  - `specialized/` - Focused workflows (code-review, refactoring-executor, promote)
- **`_index.md` files** for each category with documentation and workflow listings
- **Enhanced `bulkhead.md` orchestrator** with state detection and context-aware menus
- **Migration file** `migrations/2.3.0.json` to clean up old flat workflows during updates

### Changed
- Simplified workflow command names (e.g., `/int-pr-manager` → `/pr-manager`)
- Updated all cross-references in workflows to use new folder paths
- Updated `onboard.sh` output to show new folder structure
- `bulkhead.md` now shows interactive menu based on project state

---

## [2.2.0] - 2026-01-04

### Added
- **`uninstall.sh`** - Clean removal of Bulkhead from target projects
  - `--force` flag to skip confirmation
  - `--keep-architecture` to preserve user artifacts
- **Migration system** in `update.sh` for handling file moves/deletes between versions
- **New schemas**: `verification-report.schema.json`, `execution-report.schema.json`, `modernization-plan.schema.json`
- **`/bulkhead-promote` workflow** - Upgrade from sandbox to standard rigor

### Changed
- **Restructured source repository**: `workflows/` and `rules/` now at root level
  - `onboard.sh` copies these to `.agent/` in target projects
  - Cleaner separation between source repo and target project structure
- Updated all phase workflows (0-7) to use `.bulkhead/architecture/` paths
- Fixed `ai-governance-rules.md`: Phase 4 → Phase 6 for coding
- Updated `README.md` with new project structure documentation

### Fixed
- Workflow paths now correctly reference `.bulkhead/architecture/` for target projects
- AI Governance Rule incorrectly stated coding starts at Phase 4 (now Phase 6)

---

## [2.1.2] - 2025-12-25

### Fixed
- Documentation inconsistencies for workflow naming convention
- Updated historical CHANGELOG entries to use current file names

---

## [2.1.1] - 2025-12-24

### Changed
- Flattened workflow structure from subdirectories to flat with category prefixes:
  - `bulkhead.md` - main orchestrator (no prefix)
  - `phase-*` for 8-phase SDLC (unchanged)
  - `spec-*` for specialized (`spec-code-review.md`, `spec-modernization.md`)
  - `int-*` for integrations (`int-github-project.md`, `int-update-changelog.md`)

### Fixed
- Workflows now correctly discovered by Antigravity (subdirectories not supported)

---

## [2.1.0] - 2025-12-24

### Added
- `onboard.sh` now creates default `.bulkhead/config.yaml` during onboarding
- `update.sh --list-backups` to view available backup snapshots
- `update.sh --rollback [timestamp]` to restore from backup
- Rollback supports `--force` flag to skip confirmation

---

## [2.0.0] - 2025-12-24

### Added
- **`/bulkhead` orchestrator workflow** - Unified entry point for 8-phase SDLC
- **`/phase-status` dashboard** - Read-only governance status view
- **Adaptive Rigor Framework** with three profiles:
  - `sandbox` - Rapid prototyping (cannot merge to protected branches)
  - `standard` - Feature development (default)
  - `maximum` - Architecture/security-critical changes
- New `config.schema.json` for `.bulkhead/config.yaml` validation
- New `templates/config.yaml` with documented rigor options
- Sandbox merge restrictions in `phase-checkpoint.md`
- Section 5 "Adaptive Rigor Framework" in `FLOW_AND_GOVERNANCE.md`
- Interactive Adaptive Rigor section in `docs/index.html`

### Changed
- Enhanced `phase-checkpoint.md` with rigor profile validation
- Updated `README.md` with orchestrator commands and rigor documentation
- Updated navigation in `docs/index.html`

---

## [1.2.0] - 2025-12-24

### Added
- Organized workflows into subdirectories: `core/`, `specialized/`, `integrations/`
- New `int-github-project.md` workflow for Epic/Story management
- New `phase-checkpoint.md` workflow for pre-execution validation
- `.gitignore` file with Python, Node.js, and Bulkhead-specific patterns

### Changed
- Consolidated 6 specialized workflows into 2:
  - `spec-code-review.md` (merged: architect-review, code-review, security-architect)
  - `spec-modernization.md` (merged: rebuild-vs-refactor, refactoring-architect, system-modernization)
- Updated README.md with new workflow structure documentation

---

## [1.1.0] - 2025-12-24

### Added
- Consolidated `.bulkhead/` directory structure for cleaner organization
- Conflict detection for mergeable files during onboarding
- Backup and pending merge workflow (`.bulkhead/backup/`, `.bulkhead/pending/`)
- `/int-update-changelog` workflow with automatic version proposal

### Changed
- Moved `schemas/`, `templates/`, `governance/`, `architecture/` into `.bulkhead/`
- Update script now at `.bulkhead/update.sh`
- Manifest file now at `.bulkhead/manifest.json`

---

## [1.0.0] - 2025-12-24

### Added
- Initial release of Bulkhead Governance Framework
- 8-phase SDLC workflow (Triage → Verification)
- JSON Schema validation for all governance artifacts
- Onboarding script (`onboard.sh`) for new projects
- Update script with merge capability
- Version tracking via manifest
- `.agent/` workflows at project root (agent convention)
- Pre-commit hooks for local validation
- GitHub Actions workflow for CI/CD validation
- Complete documentation and examples

### Security
- STRIDE threat model for update mechanism
- Checksum validation for all framework files
- Backup strategy before updates

