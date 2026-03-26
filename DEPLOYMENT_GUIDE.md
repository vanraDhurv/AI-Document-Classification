# Production Backend Deployment Guide

## Current Status
- **Current Backend**: `backend/main.py` (in-memory, works great)
- **Production Backend**: `backend/main_production.py` ✅ (ready to deploy)
- **Frontend**: Running on `http://localhost:3001` (no changes needed)

---

## ⚠️ Before Deploying

### 1. Backup Current Backend
```bash
cd backend
cp main.py main_backup_inmemory.py
```

### 2. Update Dependencies
```bash
cd backend
```

Open `requirements.txt` and replace contents with:
```txt
fastapi
uvicorn[standard]
python-multipart
sqlmodel
sqlalchemy
PyPDF2
python-docx
scikit-learn
numpy
python-dateutil
```

Then install:
```bash
pip install -r requirements.txt --upgrade
```

**Note**: First-time dependency install takes ~2-3 minutes

---

## Deployment Steps

### Option 1: Immediate Swap (Recommended)
```bash
# From backend/ directory
cd backend

# Make current production file the active main.py
cp main_production.py main.py

# Kill previous backend (Ctrl+C in terminal)
# Restart backend:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Option 2: Keep Both Versions
```bash
cd backend

# Rename for reference
mv main.py main_legacy_inmemory.py
mv main_production.py main.py

# Restart backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## What's New in Production Backend

### ✅ Database
- SQLite (`documents.db`) auto-created on first run
- 3 tables: User, Document, AccessLog
- All data persists between restarts

### ✅ Text Extraction
- **PDF**: First 10 pages extracted via PyPDF2
- **DOCX**: Full text via python-docx
- **TXT**: Full text via file read
- Fallback to "[Unable to extract text]" if extraction fails

### ✅ Auto-Classification
Documents auto-classified into:
- `Finance` (invoices, payments, budgets)
- `HR` (employees, recruitment, salary)
- `Legal` (contracts, agreements, terms)
- `Contracts` (contract-focused documents)
- `Technical Reports` (technical/system docs)  
- `General` (default if no match)

### ✅ Metadata Extraction
Auto-extracts from document text:
- **Title**: First non-empty line
- **Author**: Detected from "Author:" or "By:" patterns
- **Date**: Detects YYYY-MM-DD format in text

### ✅ Entity Extraction
Auto-detects:
- **Emails**: all@email.addresses
- **Amounts**: $1,234.56 format
- **Phone Numbers**: (123) 456-7890 format

### ✅ Summarization
- TF-IDF extractive summarization
- Returns top 3 most important sentences
- Stored in database for fast retrieval

### ✅ Role-Based Access Control
| Role    | Can See           | Cannot See     |
|---------|-------------------|----------------|
| admin   | All documents     | N/A            |
| hr      | HR documents only | Finance, Legal |
| finance | Finance only      | HR, Legal      |
| user    | User's own uploads| Others' docs   |

### ✅ Access Logging
Every action tracked:
- Upload
- View
- Download  
- Delete

Admin can retrieve logs via `GET /logs/`

---

## Testing Production Backend

### 1. Verify SQLite Created
```bash
ls -la backend/documents.db
# Should show a file with size
```

### 2. Test Login (HR User)
```bash
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"hr","password":"hr123"}' | jq -r '.access_token')

echo "Token: $TOKEN"
```

### 3. Upload Test File
```bash
# Create a test text file
echo "This is a sample HR document about employee benefits and salary structure." > /tmp/test_hr.txt

# Upload it
curl -X POST http://localhost:8000/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/test_hr.txt" | jq

# Expected response: document with auto-extracted category "HR"
```

### 4. List Documents (Should be Auto-Classified)
```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/documents/ | jq
```

### 5. View Document Detail (With Summary & Entities)
```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/documents/1 | jq

# Should show:
# - summary: "This is a sample... employee benefits..."
# - entities: {} (no emails/amounts in this doc)
# - title: "This is a sample HR document..."
```

### 6. Search Documents
```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/search/?q=employee" | jq
```

### 7. Test Role-Based Access
```bash
# Login as Finance user
FINANCE_TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"finance","password":"finance123"}' | jq -r '.access_token')

# Try to view the HR document (should fail)
curl -s -H "Authorization: Bearer $FINANCE_TOKEN" \
  http://localhost:8000/documents/1

# Should return 403: "Access denied"
```

### 8. Check Access Logs (Admin Only)
```bash
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.access_token')

curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:8000/logs/ | jq
```

---

## Troubleshooting

### Issue: "Address already in use"
**Solution**: Kill previous backend process
```bash
lsof -i :8000
kill -9 <PID>
```

### Issue: "ModuleNotFoundError: No module named 'sqlmodel'"
**Solution**: Reinstall dependencies
```bash
cd backend
pip install -r requirements.txt --upgrade
```

### Issue: "documents.db locked"
**Solution**: Only one backend process can write at a time. Restart backend.

### Issue: PDF extraction returns empty text
**Cause**: Scanned PDF without OCR
**Workaround**: Text extraction falls back gracefully; summary won't be generated

### Issue: File upload succeeds but no entities detected
**Cause**: Text doesn't contain emails/amounts/phone numbers
**Expected behavior**: `entities: {"emails": [], "amounts": [], "phone_numbers": []}`

---

## Frontend No Changes Needed ✅

The frontend is already compatible with the production backend:
- Same API endpoints
- Same response formats
- Date handling already fixed
- Field mappings already correct

**Just restart the frontend if it's in a weird state**:
```bash
cd frontend
npm start
```

---

## Database Schema

### User Table
```
id (PK)
username (unique)
password (hashed)
full_name
email
role
created_at
```

### Document Table
```
id (PK)
filename
original_filename
category
size
path
author
title
summary
text_content (first 5000 chars)
entities (JSON string)
mime_type  
uploader_id (FK → User.id)
upload_date
last_accessed
```

### AccessLog Table
```
id (PK)
user_id (FK → User.id)
document_id (FK → Document.id)
action (text: upload, view, download, delete)
timestamp
```

---

## Rollback Plan

If production backend has issues:

```bash
cd backend

# Restore previous version
cp main_legacy_inmemory.py main.py

# Restart
# Make sure to kill old process first
```

**Note**: Backend will use in-memory storage again, but frontend still works perfectly.

---

## Next Steps After Deployment

1. ✅ Backend running on port 8000 with SQLite
2. ✅ Test all features with curl commands above
3. ✅ Login as different users and verify access control
4. ✅ Upload PDFs/DOCX files and verify text extraction
5. ✅ Check that documents are auto-classified correctly
6. ✅ Verify summaries are generated
7. ✅ Test semantic search (text-based fallback)
8. ✅ Check access logs in admin panel
9. Optional: Add UI for viewing access logs in frontend

