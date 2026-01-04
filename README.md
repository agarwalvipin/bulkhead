# Bulkhead

![Version](https://img.shields.io/badge/version-2.3.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**AI-Assisted Software Development Life Cycle (Governance System)**

This repository hosts **Bulkhead**, a mature governance framework designed to enforce security, architectural integrity, and deterministic execution in AI-assisted coding workflows.

## 🚀 Quick Start

### Prerequisites
- **Antigravity** (Google Deepmind) or compatible AI agent environment.
- **Node.js 16+** (for schema validation).
- **Python 3.9+** (if running Python examples).
- **jq** (for manifest handling in update script).

### Your First Workflow
1.  **Initialize**: Copy `.bulkhead/templates/00-triage.template.md` to `.bulkhead/architecture/00-triage.md`.
2.  **Define**: Describe your change in the Triage document.
3.  **Validate**: Run `pre-commit run --all-files` to check your JSON.
4.  **Execute**: Follow the 8-phase workflow below.

## 📚 Documentation
- **Core Governance**: [FLOW_AND_GOVERNANCE.md](.bulkhead/governance/FLOW_AND_GOVERNANCE.md)
- **Schemas**: [.bulkhead/schemas/](.bulkhead/schemas/)
- **Templates**: [.bulkhead/templates/](.bulkhead/templates/)
- **Examples**: [examples/](examples/)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

## 🔧 Workflows

Workflows are organized in `.agent/workflows/` with logical categories:

| Category | Path | Workflows |
|----------|------|-----------|
| **Orchestrator** | `bulkhead.md` | Smart entry point with state detection |
| **Core SDLC** | `core/` | `phase-0-triage` → `phase-7-verify`, `phase-status`, `phase-checkpoint` |
| **Orchestrators** | `orchestrators/` | `epic-orchestrator`, `modernization` |
| **Integrations** | `integrations/` | `github-project`, `pr-manager`, `changelog`, `feedback-loop` |
| **Specialized** | `specialized/` | `code-review`, `refactoring-executor`, `promote` |

**Usage:** 
- **Smart menu:** `/bulkhead` (shows context-aware options based on project state)
- **Orchestrator commands:** `/bulkhead start <phase>`, `/bulkhead continue`, `/bulkhead status`
- **Direct phase:** `/phase-0-triage`, `/phase-status`
- **Integrations:** `/pr-manager`, `/github-project`
- **Specialized:** `/code-review security`, `/modernization`

## ⚡ 8-Phase Workflow

| Phase | Name | Artifacts | Goal |
| :--- | :--- | :--- | :--- |
| **0** | **Triage** | `00-triage.{md,json}` | Classify risk (Major vs Minor). |
| **1** | **Context** | `01-context.{md,json}` | Analyze blast radius & dependencies. |
| **2** | **Design** | `02-design.{md,json}` | Architectural Design & Trade-offs. |
| **3** | **Security** | `03-security.{md,json}` | Threat Modeling (STRIDE). |
| **4** | **Decision** | `04-decision.{md,json}` | **Human Gate**: Approve or Abort. |
| **5** | **Plan** | `05-plan.{md,json}` | Deterministic execution plan. |
| **6** | **Execute** | `06-report.md` | Coding & Implementation. |
| **7** | **Verify** | `07-verify.md` | Final Quality Gate. |

### Visual Workflow
```mermaid
flowchart TD
    subgraph "Phase 0-1: Analysis"
        P0[Phase 0: Triage] -->|Major| P1[Phase 1: Context]
        P0 -->|Minor| P7[Phase 7: Fast Track]
    end

    subgraph "Phase 2-3: Engineering"
        P1 --> P2[Phase 2: Design]
        P2 --> P3[Phase 3: Security]
    end

    subgraph "Phase 4: Governance"
        P3 --> P4{Phase 4: Decision}
        P4 -->|APPROVED| P5[Phase 5: Plan]
        P4 -->|ABORT| Stop
    end

    subgraph "Phase 5-7: Delivery"
        P5 --> P6[Phase 6: Execution]
        P6 --> P7[Phase 7: Verification]
    end
```

## 🛠 Features

### Double-Write Rule
Every phase produces two artifacts:
1.  **Human-Readable (`.md`)**: For reasoning, audit, and communication.
2.  **Machine-Enforceable (`.json`)**: For strict validation and automation.

### Human Firewall
**Phase 4** requires an explicit human signature in the `04-decision.json` file. The AI agent is forbidden from proceeding to code generation without this signed authorization.

### Automated Validation
We use JSON Schema to strictly validate all governance artifacts.
- **CI/CD**: GitHub Actions workflow automatically validates all PRs.
- **Local**: Pre-commit hooks ensure validity before commit.

### Adaptive Rigor Framework
Configure governance intensity based on change type:

| Profile | Use Case | JSON Artifacts | Human Gate |
|---------|----------|----------------|------------|
| `sandbox` | Prototyping | Lightweight | Optional (cannot merge to protected branches) |
| `standard` | Features | Key phases (0, 4) | Required |
| `maximum` | Architecture | All phases | Strict |

Configure in `.bulkhead/config.yaml`:
```yaml
version: "2.0"
rigor_profile: standard  # sandbox | standard | maximum
```

## 📂 Project Structure

### Source Repository (this repo)
```
.
├── workflows/              # Workflow definitions (copied to .agent/ in targets)
│   ├── bulkhead.md         # Smart orchestrator (start here)
│   ├── core/               # 8-phase SDLC workflows
│   ├── orchestrators/      # Large project management
│   ├── integrations/       # GitHub, PR, changelog
│   └── specialized/        # Reviews, refactoring, promote
├── rules/                  # Governance rules (copied to .agent/ in targets)
├── schemas/                # JSON Schemas for validation
├── templates/              # Blank templates for new tasks
├── governance/             # Core rules and philosophy
├── migrations/             # Version migration scripts
├── architecture/           # Example governance artifacts
├── examples/               # Complete worked examples
├── docs/                   # Documentation and guides
├── VERSION                 # Current framework version
├── CHANGELOG.md            # Version history
├── onboard.sh              # Onboarding script
├── update.sh               # Update script with merge support
└── uninstall.sh            # Uninstall script
```

### Onboarded Project Structure
```
your-project/
├── .agent/                 # Workflows & rules (Antigravity convention)
│   ├── workflows/
│   │   ├── bulkhead.md     # Smart orchestrator
│   │   ├── core/           # Phase workflows
│   │   ├── orchestrators/  # Epic & modernization
│   │   ├── integrations/   # GitHub, PR, changelog
│   │   └── specialized/    # Reviews, promote
│   └── rules/              # Governance rules
├── .bulkhead/
│   ├── architecture/       # Your governance artifacts
│   ├── governance/         # Philosophy docs
│   ├── schemas/            # JSON Schemas
│   ├── templates/          # Phase templates
│   ├── migrations/         # Version migrations
│   ├── manifest.json       # Version tracking
│   ├── config.yaml         # Rigor configuration
│   ├── update.sh           # Update script
│   └── uninstall.sh        # Uninstall script
└── .github/workflows/      # CI/CD validation
```

## 📦 Onboarding to an Existing Project

### Quick Setup (Script)

```bash
# Clone this repo
git clone https://github.com/agarwalvipin/bulkhead.git

# Run the onboarding script
cd bulkhead
./onboard.sh /path/to/your/project
```

This will:
- Copy governance files into `.bulkhead/` directory
- Copy `.agent/` workflows to project root
- Create `.bulkhead/manifest.json` with version tracking and checksums
- Detect and handle conflicts with existing files

### Manual Setup

```bash
# Copy .agent to project root
cp -r .agent /path/to/your/project/

# Create .bulkhead directory and copy contents
mkdir -p /path/to/your/project/.bulkhead
cp -r schemas templates governance /path/to/your/project/.bulkhead/
cp update.sh /path/to/your/project/.bulkhead/

# Create the architecture ledger
mkdir -p /path/to/your/project/.bulkhead/architecture
```

📖 See the full [Onboarding Guide](docs/onboarding.md) for details.

## 🔄 Updating Bulkhead

Once onboarded, you can update to the latest version:

```bash
# Check for updates
.bulkhead/update.sh --check

# Apply update (with backup and merge)
.bulkhead/update.sh
```

The update script will:
1. **Backup** your current files to `.bulkhead/backup/`
2. **Preserve** any local customizations via 3-way merge
3. **Update** the manifest with the new version

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License
MIT

