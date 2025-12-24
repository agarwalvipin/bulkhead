# Phase 0: Triage

## Analysis
- **Request**: Add semantic versioning and update mechanism to Bulkhead framework
- **Scope**:
    - New `VERSION` file at repo root
    - New `.bulkhead-manifest.json` created in onboarded projects
    - New `update.sh` script with merge capability
    - Updates to existing `onboard.sh` to write manifest
    - Updates to `README.md` documentation

## Classification
- **Score**: 7
- **Type**: MAJOR
- **Rationale**: 
  - Introduces new capability (update mechanism) that didn't exist before
  - Affects multiple files across the framework
  - Merge strategy requires careful design to avoid data loss
  - Impacts all future onboarded projects
  - Changes the operational contract between Bulkhead and consuming projects
