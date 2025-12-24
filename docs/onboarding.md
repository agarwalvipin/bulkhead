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

This copies all necessary files to your project.

---

## Manual Onboarding

If you prefer manual setup:

### Step 1: Copy Framework Directories

```bash
# From the bulkhead repo root
cp -r .agent /path/to/your/project/
cp -r schemas /path/to/your/project/
cp -r templates /path/to/your/project/
cp -r governance /path/to/your/project/
```

### Step 2: Copy CI/CD Configuration

```bash
cp .pre-commit-config.yaml /path/to/your/project/
mkdir -p /path/to/your/project/.github/workflows
cp .github/workflows/validate-schemas.yml /path/to/your/project/.github/workflows/
```

### Step 3: Create the Architecture Ledger

```bash
mkdir -p /path/to/your/project/architecture
```

### Step 4: Commit the Framework

```bash
cd /path/to/your/project
git add .agent schemas templates governance .pre-commit-config.yaml .github
git commit -m "feat: add Bulkhead governance framework"
```

---

## What Gets Added

| Directory | Purpose |
|-----------|---------|
| `.agent/rules/` | Rules the AI follows (always active) |
| `.agent/workflows/` | Slash commands (`/phase-0-triage`, etc.) |
| `schemas/` | JSON Schema validation for artifacts |
| `templates/` | Blank templates for each phase |
| `governance/` | Core philosophy documentation |
| `architecture/` | Where your governance artifacts live |

---

## Using the Framework

### Start a New Change

```bash
# Copy the triage template
cp templates/00-triage.template.md architecture/00-triage.md

# Ask Antigravity to classify the change
/phase-0-triage
```

### Available Slash Commands

| Command | Purpose |
|---------|---------|
| `/phase-0-triage` | Classify change as MAJOR/MINOR |
| `/phase-1-context` | Define blast radius |
| `/phase-2-design` | Propose architecture |
| `/phase-3-security` | Threat model |
| `/phase-4-decision` | Human approval gate |
| `/phase-5-plan` | Create execution plan |
| `/phase-6-execute` | Implement the plan |
| `/phase-7-verify` | Final QA gate |
| `/code-review` | Review a PR or branch |
| `/architect-review` | Standalone architecture evaluation |

---

## Customization

### Modify Rules

Edit `.agent/rules/*.md` to customize AI behavior for your project.

### Extend Schemas

Add new properties to `schemas/*.json` if you need additional fields.

### Project-Specific Templates

Customize `templates/*.md` with your project's conventions.
