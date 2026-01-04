---
description: Performs architecture, code, or security reviews. Use with subcommand: /review architecture, /review code, /review security
---

# Review Workflow

**Goal:** Perform focused analysis based on review type.

## Usage

```bash
/review architecture   # Evaluate architectural options
/review code           # Review PR/diff for correctness
/review security       # Deep-dive threat modeling
```

---

## Mode: Architecture

**When:** Evaluating architectural choices *before* detailed design or coding.

### Protocol

1. **Proposal Analysis**
   - Review the feature request or problem statement
   - Identify core concerns: Scalability, Maintainability, Security, Performance

2. **Options Generation**
   - Propose 2-3 distinct approaches
   - Example: "Monolith Extension" vs "Microservice" vs "Serverless"

3. **Trade-off Analysis**
   For each option:
   - **Pros**: Benefits
   - **Cons**: Drawbacks/Risks
   - **Cost**: Estimated effort (High/Medium/Low)

4. **Output**: `architecture/review-[topic].md`

```markdown
# Architectural Review: [Topic]

## Problem Statement
[...]

## Options
### Option 1: [Name]
- **Pros**: [...]
- **Cons**: [...]
- **Cost**: [High/Medium/Low]

### Option 2: [Name]
- **Pros**: [...]
- **Cons**: [...]

## Recommendation
[Selected Option] because [Rationale].
```

---

## Mode: Code

**When:** Reviewing a PR, branch, or set of file changes.

### Protocol

1. **Diff Analysis**
   - Read the git diff or list of modified files
   - Identify scope of changes

2. **Review Criteria**
   - **Correctness**: Does it do what it claims?
   - **Security**: New vulnerabilities (Injection, Auth, etc.)?
   - **Style**: Follows project patterns?
   - **Architecture**: Violates module boundaries?

3. **Output**: Review comment or report

```markdown
# Code Review Report

## Summary
- **Risk Level**: [Low/Medium/High]
- **Status**: [Approve / Request Changes]

## Findings

### [Critical/Major/Minor] - [Issue Title]
- **File**: `path/to/file:line`
- **Issue**: Description
- **Suggestion**: How to fix

### [Nit] - [Style suggestion]
- ...
```

---

## Mode: Security

**When:** Deep-dive security audit of architecture or codebase.

### Protocol

1. **Attack Surface Analysis**
   - Entry points: API, UI, Workers
   - Data sinks: DB, Logs, External APIs
   - Trust boundaries

2. **Threat Modeling**
   - **OWASP Top 10** vulnerabilities
   - **Logic Flaws** (e.g., price manipulation)
   - **Infrastructure Risks** (open ports, weak secrets)

3. **Output**: `architecture/security-audit.md`

```markdown
# Security Audit Report

## Scope
[Repository/Component List]

## Critical Findings

### 1. [Vulnerability Name]
- **Severity**: Critical/High/Medium/Low
- **Location**: `file.py:line`
- **Fix**: Recommended remediation

## Recommendations
- [ ] Enable 2FA
- [ ] Sanitize all inputs
- [ ] Rotate exposed keys
```

---

## Routing

After review completion:
- **Architecture Review** → May trigger `/phase-2-design`
- **Code Review** → Approve PR or request changes
- **Security Review** → May trigger `/phase-3-security` for formal threat model
