---
description: Upgrades rigor profile from sandbox to standard, generating missing artifacts for production readiness
---

# Bulkhead Promote Workflow

**Goal:** Upgrade a sandbox project to production-ready standard rigor.

---

## When to Use

- You've been prototyping in `sandbox` mode
- Ready to merge to protected branches (main, develop, release/*)
- Need to generate full governance artifacts

---

## Protocol

### Step 1: Check Current Rigor

// turbo
```bash
if [ -f .bulkhead/config.yaml ]; then
    CURRENT_RIGOR=$(grep rigor_profile .bulkhead/config.yaml | cut -d: -f2 | tr -d ' "')
else
    CURRENT_RIGOR="standard"
fi
echo "📋 Current rigor: $CURRENT_RIGOR"
```

If already `standard` or `maximum`, exit with message.

### Step 2: Identify Missing Artifacts

// turbo
```bash
echo "🔍 Checking for missing artifacts..."

REQUIRED_JSON=(
    "00-triage.json"
    "04-decision.json"
)

for file in "${REQUIRED_JSON[@]}"; do
    if [ ! -f ".bulkhead/architecture/$file" ]; then
        echo "❌ Missing: $file"
    else
        echo "✅ Found: $file"
    fi
done
```

### Step 3: Generate Missing JSON Artifacts

For each missing artifact, the AI must:

1. Read the corresponding `.md` file
2. Generate the `.json` version following the schema
3. Validate against `.bulkhead/schemas/`

```
📝 Generating missing JSON artifacts...

For 00-triage.json:
- Read .bulkhead/architecture/00-triage.md
- Extract: complexity_score, classification, reason
- Validate against schemas/triage-decision.schema.json
- Write .bulkhead/architecture/00-triage.json

For 04-decision.json:
- Read .bulkhead/architecture/04-decision.md  
- Extract: decision, rationale, human_signature, date
- Validate against schemas/decision-record.schema.json
- Write .bulkhead/architecture/04-decision.json
```

### Step 4: Request Human Signature (if missing)

If `04-decision.json` lacks a human_signature:

```
⚠️  Human Signature Required

To promote to standard rigor, Phase 4 requires explicit human approval.

Please provide a signature string (e.g., "APPROVED-VIPIN-2025"):
```

### Step 5: Update Rigor Profile

// turbo
```bash
# Update config.yaml
sed -i 's/rigor_profile: sandbox/rigor_profile: standard/' .bulkhead/config.yaml

# Log the promotion
echo "$(date -Iseconds) PROMOTE sandbox -> standard (all artifacts generated)" >> .bulkhead/audit.log

echo "✅ Rigor upgraded to: standard"
```

### Step 6: Branch Check

```bash
BRANCH=$(git branch --show-current)
PROTECTED_BRANCHES="main master develop"

echo ""
echo "📋 Promotion Complete!"
echo ""
echo "You can now merge to protected branches:"
echo "  - main"
echo "  - develop"  
echo "  - release/*"
echo ""
echo "Current branch: $BRANCH"
```

---

## Output

```
🚀 Bulkhead Promote: sandbox → standard

Step 1: Current rigor: sandbox
Step 2: Missing artifacts identified
Step 3: Generated 00-triage.json, 04-decision.json
Step 4: Human signature obtained: APPROVED-VIPIN-2025
Step 5: Rigor updated to standard
Step 6: Ready to merge to protected branches

✅ Promotion complete!
```

---

## Error Handling

| Scenario | Action |
|----------|--------|
| Already standard/maximum | Exit with info message |
| Missing .md files | Cannot generate JSON, list missing |
| Human declines signature | Abort promotion |
| Schema validation fails | Fix and retry |

---

## Rollback

To revert to sandbox:

```bash
sed -i 's/rigor_profile: standard/rigor_profile: sandbox/' .bulkhead/config.yaml
echo "$(date -Iseconds) RIGOR_SET standard -> sandbox (manual rollback)" >> .bulkhead/audit.log
```
