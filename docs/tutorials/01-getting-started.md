# Tutorial: Your First Bulkhead Change

This tutorial walks you through a complete "Major" change using the Bulkhead governance framework. We will use a realistic scenario: **adding JWT Authentication to a FastAPI service**.

**Prerequisites:**
- Bulkhead installed in your project (see [Installation](../../README.md#installation-60-seconds))
- Basic understanding of git

---

## The Scenario

You have an existing Python API. You need to verify that adding authentication is done securely and architecturally correctly. 

**Goal:** Add OAuth2 with JWT to `POST /token` and protect `GET /users/me`.

---

## Phase 0: Triage (Starting the Work)

Everything starts with the `/bulkhead` command.

1.  **Run the command:**
    ```bash
    /bulkhead
    ```

2.  **Select option:** `[1] Start new feature/change`

3.  **Provide Description:**
    > "Add JWT authentication using OAuth2 password flow to secure the API."

**What Happens:**
The AI analyzes your request and classifies it. In this case, because it affects security and API contracts, it classifies it as **MAJOR**.

**Outcome:**
- Created: `.bulkhead/architecture/00-triage.md`
- Created: `.bulkhead/architecture/00-triage.json`
- Status: **Phase 0 Complete**

---

## Phase 1: Context (Blast Radius)

The AI automatically proceeds to identify what files it needs to touch.

**The AI Analysis:**
- It realizes it needs to edit `src/auth.py` and `src/main.py`.
- It identifies that `config/secrets.yaml` contains keys and marks it as **Forbidden** (Read-Only or No-Access).

**Outcome:**
- Created: `.bulkhead/architecture/01-context.md` (Human readable plan)
- Created: `.bulkhead/architecture/01-context.json` (Machine lockfile)

---

## Phase 2: Design (The Blueprint)

Now the AI proposes *how* it will solve the problem.

**The Proposal:**
- Use `python-jose` for token encoding.
- Use `passlib` for hashing.
- Create a `get_current_user` dependency.

It compares alternatives (e.g., "Session Auth" vs "JWT") and selects the best one based on your project constraints.

**Outcome:**
- Created: `.bulkhead/architecture/02-design.md`
- Created: `.bulkhead/architecture/02-design.json`

---

## Phase 3: Security (The Audit)

Before writing code, the AI performs a **STRIDE** threat model on its own design.

**Findings:**
- **Spoofing:** Risk of fake tokens -> Mitigation: Verify signature with secret key.
- **Information Disclosure:** Risk of leaking password -> Mitigation: Hash passwords with bcrypt.

**Outcome:**
- Created: `.bulkhead/architecture/03-security.md`
- Created: `.bulkhead/architecture/03-security.json`

---

## Phase 4: Decision (The Human Gate)

🛑 **STOP.** The AI cannot proceed.

It presents the **Design** and **Security Report** to you.

**Your Action:**
1. Review `02-design.md` and `03-security.md`.
2. If satisfied, you approve the change.

```bash
/bulkhead approve "Approved, proceed with implementation."
```

**Outcome:**
- Created: `.bulkhead/architecture/04-decision.json` (Signed with your approval)
- **Gate Open:** The AI is now allowed to modify code.

---

## Phase 5: Plan & Execute

The AI converts the design into a task list (Phase 5) and then writes the code (Phase 6).

**Action:**
```bash
/bulkhead continue
```

The AI implements:
1. `src/auth.py` (JWT logic)
2. `src/routes/users.py` (Protected endpoint)
3. `tests/test_auth.py` (Verification)

---

## Phase 7: Verify

Finally, the AI runs the tests to prove the implementation works.

**Action:**
```bash
/bulkhead continue
```

**Outcome:**
- Runs `pytest`
- Generates `.bulkhead/architecture/07-verify.md` with test results.

---

## Conclusion

You have successfully:
1. **Triaged** the risk.
2. **Designed** a secure solution.
3. **Audited** it for security threats.
4. **Approved** it explicitly.
5. **Implemented** it deterministically.

All artifacts are saved in `.bulkhead/architecture/` for future audit.

[View the complete artifacts for this example](../../examples/python-fastapi-jwt/)
