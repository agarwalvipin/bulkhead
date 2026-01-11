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
cp -r skills /path/to/your/project/.bulkhead/
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
| `.bulkhead/skills/` | Domain expertise modules (languages, frameworks, etc.) |
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

### Available Commands

| Command | Purpose |
|---------|---------|
| `/bulkhead` | **Primary Entry Point**. Detects project state and shows context-aware options. |
| `/bulkhead status` | View the current governance dashboard and project status. |
| `/bulkhead continue` | Intelligently resume the next logical step in your workflow. |

> [!NOTE]
> Bulkhead is designed as an integrated system. Instead of remembering dozens of individual slash commands, you only need to use `/bulkhead`. The system will guide you through the 8-phase SDLC, security audits, and deployment workflows based on your current project state.

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

