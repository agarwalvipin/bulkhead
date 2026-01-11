---
description: Healthcare systems, HIPAA compliance, PHI handling, medical data
category: domains
auto_load:
  - when: "hipaa"
    in: ["files", "config"]
  - when: "hl7"
    in: ["files", "dependencies"]
related_skills:
  - practices/security.md
---

# Healthcare Domain

Patterns and compliance requirements for healthcare applications.

---

## Core Concepts

| Concept | Description |
|---------|-------------|
| **PHI** | Protected Health Information |
| **HIPAA** | Health Insurance Portability and Accountability Act |
| **BAA** | Business Associate Agreement |
| **EHR/EMR** | Electronic Health/Medical Records |
| **HL7/FHIR** | Healthcare data exchange standards |

---

## HIPAA Compliance

### Protected Health Information (PHI)

PHI includes any individually identifiable health information:

| PHI Category | Examples |
|--------------|----------|
| **Identifiers** | Name, SSN, MRN, address, phone |
| **Dates** | Birth date, admission, discharge |
| **Medical** | Diagnoses, treatments, medications |
| **Financial** | Insurance, billing, account numbers |
| **Biometric** | Fingerprints, voice, photos |

### Technical Safeguards

```python
# ✅ Encrypt PHI at rest and in transit
from cryptography.fernet import Fernet

class PHIEncryption:
    def __init__(self, key: bytes):
        self.cipher = Fernet(key)
    
    def encrypt(self, plaintext: str) -> bytes:
        return self.cipher.encrypt(plaintext.encode())
    
    def decrypt(self, ciphertext: bytes) -> str:
        return self.cipher.decrypt(ciphertext).decode()
```

### Access Controls

```python
from enum import Enum
from typing import Literal

class AccessLevel(Enum):
    NONE = 0
    READ = 1
    WRITE = 2
    ADMIN = 3

class PHIAccessPolicy:
    """Role-based access to PHI with minimum necessary."""
    
    ROLE_PERMISSIONS = {
        "physician": {"patient_records": AccessLevel.WRITE},
        "nurse": {"patient_records": AccessLevel.READ},
        "billing": {"billing_records": AccessLevel.WRITE},
        "admin": {"*": AccessLevel.ADMIN},
    }
    
    def can_access(
        self, role: str, resource: str, level: AccessLevel
    ) -> bool:
        perms = self.ROLE_PERMISSIONS.get(role, {})
        allowed = perms.get(resource) or perms.get("*")
        return allowed and allowed.value >= level.value
```

---

## Audit Logging

HIPAA requires detailed access logs for PHI.

```python
from datetime import datetime
from pydantic import BaseModel

class AccessLog(BaseModel):
    """HIPAA-compliant audit log entry."""
    timestamp: datetime
    user_id: str
    user_role: str
    patient_id: str
    resource_type: str
    action: Literal["read", "create", "update", "delete"]
    reason: str
    ip_address: str
    success: bool

# Log every PHI access
async def log_phi_access(log: AccessLog) -> None:
    await audit_store.append(log)  # Append-only, immutable
```

---

## Data Standards

### HL7 FHIR

```python
from pydantic import BaseModel
from datetime import date

class FHIRPatient(BaseModel):
    """FHIR R4 Patient resource (simplified)."""
    resourceType: str = "Patient"
    id: str
    identifier: list[dict]
    name: list[dict]
    gender: Literal["male", "female", "other", "unknown"]
    birthDate: date
    
    @classmethod
    def from_internal(cls, patient: Patient) -> "FHIRPatient":
        return cls(
            id=patient.mrn,
            identifier=[{"system": "MRN", "value": patient.mrn}],
            name=[{
                "family": patient.last_name,
                "given": [patient.first_name]
            }],
            gender=patient.gender.lower(),
            birthDate=patient.dob,
        )
```

### ICD-10 Codes

```python
# Diagnosis codes must be validated
ICD10_PATTERN = r"^[A-Z]\d{2}(\.\d{1,4})?$"

def validate_icd10(code: str) -> bool:
    """Validate ICD-10 diagnosis code format."""
    import re
    return bool(re.match(ICD10_PATTERN, code))

# Examples: "J06.9" (URI), "I10" (Hypertension)
```

---

## De-identification

### Safe Harbor Method (18 Identifiers)

```python
PHI_IDENTIFIERS = [
    "name", "address", "dates", "phone", "fax",
    "email", "ssn", "mrn", "health_plan_id",
    "account_number", "license", "vehicle_id",
    "device_serial", "url", "ip_address",
    "biometric", "photo", "other_unique_id"
]

def deidentify_patient(patient: dict) -> dict:
    """Remove all 18 HIPAA identifiers."""
    safe_data = patient.copy()
    for field in PHI_IDENTIFIERS:
        if field in safe_data:
            safe_data[field] = "[REDACTED]"
    # Generalize dates to year only
    if "birth_date" in safe_data:
        safe_data["birth_year"] = safe_data["birth_date"].year
        del safe_data["birth_date"]
    return safe_data
```

---

## Anti-patterns

| Anti-pattern | Risk | Better Approach |
|--------------|------|-----------------|
| **PHI in logs** | Audit failure | Structured, filtered logging |
| **Unencrypted storage** | Breach | Encryption at rest |
| **Shared credentials** | Attribution | Individual accounts |
| **No access logs** | HIPAA violation | Comprehensive audit trail |
| **PHI in URLs** | Exposure in logs | POST body, headers |
| **Missing BAAs** | Legal liability | Vendor agreements |

---

## Checklist

- [ ] All PHI encrypted at rest (AES-256)
- [ ] TLS 1.2+ for all data in transit
- [ ] Role-based access with minimum necessary
- [ ] Audit logging for all PHI access
- [ ] BAAs with all vendors handling PHI
- [ ] Incident response procedures documented
- [ ] Regular security training for staff
- [ ] Data backup and disaster recovery tested

---

## References

- [HHS HIPAA Guidance](https://www.hhs.gov/hipaa/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [HL7 FHIR Specification](https://www.hl7.org/fhir/)
- [OCR HIPAA Breach Portal](https://ocrportal.hhs.gov/ocr/breach/)
