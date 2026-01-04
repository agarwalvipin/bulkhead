# Onboarding Bulkhead to an Existing Project

This guide explains how to integrate the Bulkhead governance framework into your existing codebase.

## Prerequisites

- **Antigravity** (Google Deepmind) or compatible AI agent
- **Git** repository
- **Node.js 16+** (for schema validation, optional)

---

## Quick Onboarding (Script)

Run the onboarding script from this repository:

```bash
# Clone this repo (if you haven't)
git clone https://github.com/agarwalvipin/bulkhead.git

# Run the onboarding script
cd bulkhead
./onboard.sh /path/to/your/project
```

This copies all necessary files to your project and prompts you to configure:

1. **Project Management Mode**: Choose between Implicit (artifacts only) or External (GitHub/Jira).
2. **Rigor Profile**: Standard, Sandbox, or Maximum.


---

## Manual Onboarding

If you prefer manual setup:

### Step 1: Copy Framework Directories

```bash
# From the bulkhead repo root
mkdir -p /path/to/your/project/.agent
mkdir -p /path/to/your/project/.bulkhead

# Agent workflows and rules
cp -r workflows /path/to/your/project/.agent/
cp -r rules /path/to/your/project/.agent/

# Bulkhead components
cp -r schemas /path/to/your/project/.bulkhead/
cp -r templates /path/to/your/project/.bulkhead/
cp -r governance /path/to/your/project/.bulkhead/
mkdir -p /path/to/your/project/.bulkhead/architecture
```

### Step 2: Copy CI/CD Configuration

```bash
cp .pre-commit-config.yaml /path/to/your/project/
mkdir -p /path/to/your/project/.github/workflows
cp .github/workflows/validate-schemas.yml /path/to/your/project/.github/workflows/
```

### Step 3: Copy Scripts

```bash
cp update.sh /path/to/your/project/.bulkhead/
cp uninstall.sh /path/to/your/project/.bulkhead/
chmod +x /path/to/your/project/.bulkhead/*.sh
```

### Step 4: Commit the Framework

```bash
cd /path/to/your/project
git add .agent .bulkhead .pre-commit-config.yaml .github
git commit -m "feat: add Bulkhead governance framework"
```

---

## What Gets Added

| Directory | Purpose |
|-----------|---------|
| `.agent/rules/` | Rules the AI follows (always active) |
| `.agent/workflows/` | Slash commands (see below) |
| `.agent/workflows/core/` | 8-phase SDLC workflows |
| `.agent/workflows/orchestrators/` | Large project management |
| `.agent/workflows/integrations/` | GitHub, PR, changelog |
| `.agent/workflows/specialized/` | Reviews, refactoring, promote |
| `.bulkhead/schemas/` | JSON Schema validation for artifacts |
| `.bulkhead/templates/` | Blank templates for each phase |
| `.bulkhead/governance/` | Core philosophy documentation |
| `.bulkhead/architecture/` | Where your governance artifacts live |

---

## Using the Framework

### Start a New Change

```bash
# Ask Antigravity to show the workflow menu
/bulkhead
```

### Available Slash Commands

**Orchestrator:**
| Command | Purpose |
|---------|---------|
| `/bulkhead` | Smart menu based on project state |
| `/bulkhead start <phase>` | Start a specific phase |
| `/bulkhead continue` | Continue to next phase |
| `/bulkhead status` | View governance dashboard |

**Core SDLC (in `core/`):**
| Command | Purpose |
|---------|---------|
| `/phase-0-triage` | Classify change as MAJOR/MINOR |
| `/phase-1-context` through `/phase-7-verify` | SDLC phases |
| `/phase-status` | Read-only status dashboard |
| `/phase-checkpoint` | Validate artifacts before execution |

**Integrations (in `integrations/`):**
| Command | Purpose |
|---------|---------|
| `/github-project` | GitHub Project/Epic/Story management |
| `/pr-manager` | Create and manage PRs |
| `/changelog` | Update CHANGELOG and bump version |
| `/feedback-loop` | Capture learnings |

**Specialized (in `specialized/`):**
| Command | Purpose |
|---------|---------|
| `/code-review` | Review a PR or branch |
| `/promote` | Upgrade from sandbox to standard rigor |

**Orchestrators (in `orchestrators/`):**
| Command | Purpose |
|---------|---------|
| `/modernization` | Rebuild vs refactor analysis |
| `/epic-orchestrator` | Manage multi-epic projects |

---

## Customization

### Modify Rules

Edit `.agent/rules/*.md` to customize AI behavior for your project.

### Extend Schemas

Add new properties to `.bulkhead/schemas/*.json` if you need additional fields.

### Project-Specific Templates

Customize `.bulkhead/templates/*.md` with your project's conventions.

---

## Uninstalling

To remove Bulkhead from your project:

```bash
.bulkhead/uninstall.sh
```

Options:
- `--force` - Skip confirmation
- `--keep-architecture` - Preserve your governance artifacts

