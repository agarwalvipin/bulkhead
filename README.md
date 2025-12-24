# Bulkhead

![Version](https://img.shields.io/badge/version-1.1.0-blue)
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
1.  **Initialize**: Copy `templates/00-triage.template.md` to `architecture/00-triage.md`.
2.  **Define**: Describe your change in the Triage document.
3.  **Validate**: Run `pre-commit run --all-files` to check your JSON.
4.  **Execute**: Follow the 8-phase workflow below.

## 📚 Documentation
- **Core Governance**: [FLOW_AND_GOVERNANCE.md](governance/FLOW_AND_GOVERNANCE.md)
- **Workflows**: [.agent/workflows/](.agent/workflows/)
- **Schemas**: [schemas/](schemas/)
- **Templates**: [templates/](templates/)
- **Examples**: [examples/](examples/)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

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

## 📂 Project Structure
```
.
├── .agent/workflows/       # Agent instructions for each phase
├── architecture/           # The "Ledger" - where your artifacts live
├── examples/               # Complete worked examples
├── governance/             # Core rules and philosophy
├── schemas/                # JSON Schemas for validation
├── templates/              # Blank templates for new tasks
├── VERSION                 # Current framework version
├── CHANGELOG.md            # Version history
├── onboard.sh              # Onboarding script
└── update.sh               # Update script with merge support
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
- Copy all governance framework files
- Create `.bulkhead-manifest.json` with version tracking
- Set up the update script for future updates

### Manual Setup

```bash
# Copy framework directories
cp -r .agent /path/to/your/project/
cp -r schemas /path/to/your/project/
cp -r templates /path/to/your/project/
cp -r governance /path/to/your/project/
cp update.sh /path/to/your/project/

# Create the architecture ledger
mkdir -p /path/to/your/project/architecture
```

📖 See the full [Onboarding Guide](docs/onboarding.md) for details.

## 🔄 Updating Bulkhead

Once onboarded, you can update to the latest version:

```bash
# Check for updates
./update.sh --check

# Apply update (with backup and merge)
./update.sh
```

The update script will:
1. **Backup** your current files to `.bulkhead-backup/`
2. **Preserve** any local customizations via 3-way merge
3. **Update** the manifest with the new version

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License
MIT

