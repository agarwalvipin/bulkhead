# Changelog

All notable changes to Bulkhead will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- New `github-project.md` workflow for Epic/Story management
- New `phase-checkpoint.md` workflow for pre-execution validation
- `.gitignore` file with Python, Node.js, and Bulkhead-specific patterns

### Changed
- Consolidated 6 specialized workflows into 2:
  - `review.md` (merged: architect-review, code-review, security-architect)
  - `modernization.md` (merged: rebuild-vs-refactor, refactoring-architect, system-modernization)
- Updated README.md with new workflow structure documentation

---

## [1.1.0] - 2025-12-24

### Added
- Consolidated `.bulkhead/` directory structure for cleaner organization
- Conflict detection for mergeable files during onboarding
- Backup and pending merge workflow (`.bulkhead/backup/`, `.bulkhead/pending/`)
- `/update-changelog` workflow with automatic version proposal

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

