#!/bin/bash

# Create main directories based on analysss/analysis structure
mkdir -p {affidavit_work/{analysis,corrections,recommendations,versions},analysis_outputs,backups/affidavits}
mkdir -p case_2025_137857/{01_court_documents,02_evidence,03_analysis,04_financial_records,05_affidavits,06_legal_research}
mkdir -p docs/{analysis,evidence,legal,technical}
mkdir -p evidence/{bank_records,shopify_reports,invoices,correspondence}
mkdir -p jax-dan-response/{AD,analysis-output,evidence-attachments,source-documents,financial-analysis}
mkdir -p tools
mkdir -p config

echo "Repository structure created successfully"
