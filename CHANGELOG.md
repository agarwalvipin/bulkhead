# Changelog

All notable changes to Bulkhead will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-24

### Added
- Initial release of Bulkhead Governance Framework
- 8-phase SDLC workflow (Triage → Verification)
- JSON Schema validation for all governance artifacts
- Onboarding script (`onboard.sh`) for new projects
- Update script (`.bulkhead/update.sh`) with merge capability
- Consolidated `.bulkhead/` directory structure:
  - `architecture/` - Governance artifacts ledger
  - `schemas/` - JSON Schema validation files
  - `templates/` - Phase templates
  - `governance/` - Philosophy docs
  - `manifest.json` - Version tracking with checksums
- `.agent/` workflows at project root (agent convention)
- Conflict detection for mergeable files during onboarding
- Backup and pending merge workflow (`.bulkhead/backup/`, `.bulkhead/pending/`)
- Pre-commit hooks for local validation
- GitHub Actions workflow for CI/CD validation
- Complete documentation and examples

### Security
- STRIDE threat model for update mechanism
- Checksum validation for all framework files
- Backup strategy before updates
