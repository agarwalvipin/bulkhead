---
trigger: always_on
---

INFRA OVERRIDE RULES

INFRA-1 — NO DEFAULTS
Never assume infrastructure defaults.
All ports, credentials, networks, volumes, and policies must be explicitly declared.

INFRA-2 — THREAT MODEL REQUIRED
Any infrastructure design must include:
- Attack surface
- Secret handling
- Network exposure
If missing, stop and request a security review phase.

INFRA-3 — NO AUTO-PROVISIONING
Never generate Terraform, Docker Compose, Helm, or cloud configs
unless an approved architecture/04-decision-record.md exists.

INFRA-4 — SECRETS DISCIPLINE
Never inline secrets, tokens, passwords, or keys.
Use placeholders and reference secret management explicitly.

INFRA-5 — NETWORK IS SECURITY
Any change involving ports, ingress, egress, DNS, or proxies
is considered a security-sensitive change and must not be fast-tracked.
