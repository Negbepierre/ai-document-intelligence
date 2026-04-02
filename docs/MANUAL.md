# User Manual
## AI Paralegal — Contract Review System

**Live URL:** https://ai-document-intelligence.netlify.app
**GitHub:** https://github.com/Negbepierre/ai-document-intelligence
**Built by:** Inegbenose Pierre

---

## What This Tool Does

The AI Paralegal is a contract review system built for Keating Solicitors LLP.
It allows staff to upload PDF contracts and legal documents and receive an
instant AI-powered review against the firm knowledge base of UK legal standards.
Every review is tied to an authenticated employee record.

---

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| pierre@keating.co.uk | keating2026 | Senior Paralegal |
| admin@keating.co.uk | admin2026 | Managing Partner |
| junior@keating.co.uk | junior2026 | Junior Solicitor |

---

## How to Use It

### Step 1 — Sign In

Go to the live URL and sign in using one of the demo credentials above.
Your name, role, and employee ID will appear throughout the interface.

### Step 2 — Upload a Contract

On the upload screen, drag and drop a PDF contract into the upload zone
or click Browse Files to select one manually.

The system accepts PDF files only. Once uploaded, Claude automatically
reviews the document against the firm knowledge base. This takes
approximately 20 to 30 seconds.

### Step 3 — Review the Analysis

The left panel shows the automated review structured as follows:

- Document Summary — what type of document it is and its purpose
- Key Parties — who the parties are
- Key Terms — the most important obligations and terms
- Risk Flags — clauses that fall below firm standards, highlighted in red
- Recommendations — what must be addressed before execution

A risk count badge at the top shows how many issues were flagged.

### Step 4 — Ask Questions

The right panel is a chat interface. Type any question about the document
and Claude will answer based on both the document content and the firm
knowledge base.

Use the suggested questions as a starting point:
- What are the key risk flags in this document?
- Does the notice period comply with UK law?
- Are there any missing standard clauses?
- Is the non-compete clause enforceable?

You can ask as many questions as you like. The conversation history is
maintained throughout the session.

### Step 5 — Review a New Document

Click New Document in the header to return to the upload screen and
review a different contract.

---

## Test Documents

Five test contracts are available in the GitHub repository under the
test documents folder. They cover a range of document types with
deliberately introduced problems for demonstration purposes.

| Document | Type | Issues |
|----------|------|--------|
| Contract1_Employment_TechStart_PROBLEMATIC | Employment | Unlawful holiday, unenforceable non-compete, broken notice period |
| Contract2_NDA_Vertex_PROBLEMATIC | NDA | Overbroad definition, penalty clause, no return obligation |
| Contract3_Service_Agreement_Meridian_CLEAN | Service Agreement | Clean — minimal issues expected |
| Contract4_DPA_CloudStore_PROBLEMATIC | Data Processing | Five UK GDPR violations including unlawful US data transfer |
| Contract5_Lease_Sovereign_PROBLEMATIC | Commercial Lease | No break clause, no schedule of condition, absolute no-assignment |

---

## What Happens Behind the