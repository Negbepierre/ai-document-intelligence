# Product Requirements Document
## AI Paralegal — Contract Review System
**Version:** 1.0
**Author:** Inegbenose Pierre
**Date:** April 2026
**Status:** Live

---

## 1. Problem Statement

Legal teams and paralegals spend significant time manually reviewing contracts
against firm standards and UK legal requirements. A single contract review can
take several hours. Errors or missed clauses create legal and commercial risk.
This tool gives legal professionals an instant AI-powered first review,
flagging issues before a qualified solicitor conducts the final review.

---

## 2. Goal

Build an AI paralegal tool that:
- Accepts uploaded PDF contracts and legal documents
- Automatically reviews them against the firm knowledge base of UK legal standards
- Flags risk areas, missing clauses, and potentially unenforceable terms
- Allows the reviewer to ask specific questions about any part of the document
- Logs every review to an employee record for compliance and audit purposes

---

## 3. Target Users

| User | Need |
|------|------|
| Paralegal | First-pass contract review before escalating to a solicitor |
| Junior solicitor | Quick compliance check against firm standards |
| Managing partner | Oversight of all contract reviews conducted by staff |

---

## 4. Core Features

### 4.1 Authentication
- Staff login with email and password
- Every review is tied to an employee ID and name
- Session persists across browser refreshes

### 4.2 Document Upload
- Drag and drop or file browser PDF upload
- Text extraction from uploaded PDF
- Immediate AI review triggered on upload

### 4.3 Automated Contract Review
- Document reviewed against Keating Solicitors firm knowledge base
- Review structured into five sections: summary, parties, key terms, risk flags,
  and recommendations
- Risk flags highlighted in red throughout the review panel
- Risk count badge shown in the document review header

### 4.4 RAG Knowledge Base
- Five firm knowledge base documents stored in Amazon S3
- Indexed and retrieved via Amazon Bedrock Knowledge Bases with S3 Vectors
- Knowledge base covers: UK employment standards, NDA standards, service
  agreement standards, UK GDPR DPA standards, and commercial lease standards
- Relevant sections retrieved semantically for each document review and question

### 4.5 Document Q&A
- Chat interface for asking specific questions about the uploaded document
- Each question retrieves relevant knowledge base context and cross-references
  it against the document content
- Suggested questions provided on first load
- Full conversation history maintained within the session

### 4.6 New Document Flow
- User can upload a new document at any time via the New Document button
- State resets cleanly between documents

---

## 5. Technical Architecture