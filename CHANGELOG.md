# Changelog

All notable changes to Bulkhead will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

