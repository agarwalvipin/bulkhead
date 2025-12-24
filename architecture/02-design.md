# Phase 2: Design

## Overview
Add semantic versioning and safe update mechanism to Bulkhead framework.

## Architectural Decisions

### 1. Version Source of Truth
- Single `VERSION` file at repo root containing semantic version (e.g., `1.0.0`)
- Simple, parseable, no dependencies

### 2. Manifest File (`.bulkhead-manifest.json`)
Created in each onboarded project to track:
```json
{
  "bulkhead_version": "1.0.0",
  "installed_at": "2025-12-24T07:35:00Z",
  "source_repo": "https://github.com/agarwalvipin/bulkhead.git",
  "checksums": {
    ".agent/": "sha256:...",
    "schemas/": "sha256:...",
    "templates/": "sha256:..."
  }
}
```

### 3. Update Script (`update.sh`) Flow
```
┌─────────────────────────────────────────────┐
│  1. Validate current manifest exists        │
│  2. Fetch latest from source repo           │
│  3. Compare versions (skip if same)         │
│  4. Backup current files                    │
│  5. Detect local modifications via checksum │
│  6. For each component:                     │
│     - If unchanged: overwrite               │
│     - If modified: merge or prompt          │
│  7. Update manifest with new version        │
│  8. Show changelog of what changed          │
└─────────────────────────────────────────────┘
```

### 4. Merge Strategy
- **Unmodified files**: Direct overwrite (safe)
- **Modified files**: 
  - Create `.bulkhead-backup/` with originals
  - Attempt 3-way merge using `git merge-file`
  - On conflict: keep both versions, notify user

## Trade-offs

| Decision | Pros | Cons | Selected |
|----------|------|------|----------|
| VERSION file | Simple, no deps | Manual bump required | ✅ |
| package.json | NPM ecosystem | Adds Node.js dependency | ❌ |
| Git tags only | Native to git | Can't track in target | ❌ |
