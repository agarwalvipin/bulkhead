# Phase 1: Context

## Blast Radius Analysis

### Files to Create (NEW)
| File | Purpose |
|------|---------|
| `VERSION` | Single source of truth for framework version |
| `update.sh` | Update script with merge capability |
| `CHANGELOG.md` | Track changes between versions |

### Files to Modify
| File | Change |
|------|--------|
| `onboard.sh` | Write `.bulkhead-manifest.json` to target project |
| `README.md` | Document versioning and update workflow |

### Files Created in Onboarded Projects
| File | Purpose |
|------|---------|
| `.bulkhead-manifest.json` | Tracks installed version, date, checksums |

## Dependencies
- No external dependencies required
- Uses standard bash utilities (`git`, `shasum`, `diff`)

## Risk Assessment
- **Low risk** to existing onboarded projects (backwards compatible)
- **Medium risk** in merge logic (potential for data loss if bugs exist)
