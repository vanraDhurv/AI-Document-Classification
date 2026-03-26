# AI Document Classification - Project Overview

## 🎯 Mission
Build an intelligent document management system with:
- Multi-user authentication
- Automatic document classification  
- Text extraction from PDF/DOCX/TXT
- Metadata & entity extraction
- AI-powered summarization
- Semantic search capabilities
- Role-based access control
- Complete audit logging

---

## 📊 Current Architecture

```
Browser (localhost:3001)
        ↓
React Frontend (Material-UI)
        ↓
FastAPI Backend (localhost:8000)
        ↓
SQLite Database (documents.db) + File Storage (uploads/)
```

---

## 🚀 Current Status

### ✅ Working (In-Memory Backend)
- Frontend: React dashboard with upload, search, view
- Auth: Login for admin/hr/finance users
- Documents: Upload, list, view, download, delete
- File storage: PDFs/DOCX/TXT saved to `backend/uploads/`
- Date handling: All crashes fixed
- Field mapping: All data displays correctly

**No code changes needed for frontend!**

### 🔄 Ready to Deploy (Production Backend)

#### Files Prepared:
- `backend/main_production.py` ← NEW production code (620 lines)
- `BACKEND_REQUIREMENTS.md` ← Feature specifications
- `DEPLOYMENT_GUIDE.md` ← Step-by-step deployment

#### What's Included:
✅ **SQLite Database** - Persistent storage  
✅ **Text Extraction** - PDF (PyPDF2), DOCX (python-docx), TXT (native)  
✅ **Metadata Extraction** - Auto-detect title, author, date  
✅ **Entity Extraction** - Find emails, amounts, phone numbers  
✅ **Classification** - Auto-categorize into 6 document types  
✅ **Summarization** - TF-IDF extractive summaries  
✅ **Role-Based Access** - HR users see HR docs only, Finance sees Finance only  
✅ **Access Logging** - Track all uploads, views, downloads, deletes  

---

## 📦 Project Structure

```
AI-Document-Classification/
├── frontend/                          # React application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.js         # ✅ Main document list
│   │   │   ├── DocumentView.js      # ✅ Document detail view
│   │   │   ├── SearchPage.js        # ✅ Search results
│   │   │   └── LoginPage.js         # ✅ User auth
│   │   ├── services/
│   │   │   ├── api.js               # ✅ HTTP client with Bearer token
│   │   │   └── AuthContext.js       # ✅ Auth state management
│   │   └── App.js
│   ├── package.json
│   └── build/
│
├── backend/                           # FastAPI application
│   ├── main.py                      # ✅ Current (in-memory, working)
│   ├── main_backup_inmemory.py      # ← Will be created on deploy
│   ├── main_production.py           # ✅ NEW (SQLite + AI, ready)
│   ├── requirements.txt             # ✅ Updated with all deps
│   ├── uploads/                     # ← File storage (auto-created)
│   └── documents.db                 # ← SQLite (auto-created on first run)
│
├── BACKEND_REQUIREMENTS.md          # ✅ Feature specifications
├── DEPLOYMENT_GUIDE.md              # ✅ Step-by-step deployment
└── This File (README)
```

---

## 🔑 Test Users

| Username | Password | Role    | Restrictions                    |
|----------|----------|---------|-------------------------------- |
| admin    | admin123 | admin   | Can see all documents           |
| hr       | hr123    | hr      | Can only see HR category docs   |
| finance  | finance123 | finance| Can only see Finance docs       |

---

## 🛠️ Quick Start

### 1. **Frontend** (Already Running)
```bash
cd frontend
npm start  # Runs on http://localhost:3001
```

### 2. **Backend** (Current In-Memory - Working)
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. **Ready to Upgrade to Production?**
```bash
# See DEPLOYMENT_GUIDE.md for:
# - Backup current backend
# - Install new dependencies
# - Swap to production backend
# - Test with curl commands
```

---

## 📝 API Endpoints

### Authentication
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Login with credentials |
| `/auth/logout` | POST | Logout (invalidate token) |
| `/auth/me` | GET | Get current user info |

### Documents
| Endpoint | Method | Purpose | Role-Based |
|----------|--------|---------|------------|
| `/documents/` | GET | List user's documents | ✅ HR/Finance filtered |
| `/documents/{id}` | GET | Get document details | ✅ HR/Finance filtered |
| `/documents/upload` | POST | Upload new document | Auto-classified |
| `/documents/{id}/download` | GET | Download file | ✅ HR/Finance filtered |
| `/documents/{id}` | DELETE | Delete document | Owner + admin only |

### Search
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/search/?q=text` | GET | Text-based search |

### Admin Only
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/logs/` | GET | View all access logs |

---

## 🔐 Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend: POST /auth/login
   ↓
3. Backend validates password hash
   ↓
4. Backend returns:
   {
     "access_token": "uuid-string",
     "token_type": "bearer",
     "user": { "id": 1, "username": "admin", ... }
   }
   ↓
5. Frontend stores token in localStorage
   ↓
6. Frontend adds "Authorization: Bearer <token>" to all requests
   ↓
7. Backend validates token on each request
```

---

## 📊 Document Upload Flow (Production Backend)

```
1. User selects file (PDF/DOCX/TXT)
   ↓
2. Upload to POST /documents/upload
   ↓
3. Backend:
   a) Saves file to disk
   b) Extracts text using appropriate library
   c) Auto-extracts metadata (title, author, date)
   d) Auto-extracts entities (emails, amounts, phone)
   e) Auto-classifies into category (Finance/HR/Legal/etc.)
   f) Generates TF-IDF summary
   g) Stores in SQLite DB
   ↓
4. Returns DocumentResponse with all fields
   ↓
5. Frontend:
   a) Stores token from response
   b) Displays in dashboard
   c) Shows category badge, author, file size
```

---

## 🔍 Role-Based Access Control (Production Backend)

### Admin User
- Can see ALL documents uploaded by anyone
- Can view access logs
- Can delete any document

### HR User
- Can only see documents in "HR" category
- Cannot see Finance, Legal, Contracts, Technical Reports
- Uploading a document auto-classifies it
- If classified as Finance/Legal/etc., HR user won't see it

### Finance User
- Can only see documents in "Finance" category
- Cannot see HR, Legal, Contracts, Technical Reports
- Same upload/classification rules as HR

### Regular User
- Can only see documents they uploaded
- No cross-user visibility

---

## 📋 Document Categories

| Category | Triggered By Keywords |
|----------|----------------------|
| Finance | invoice, payment, financial, budget, expense, revenue |
| HR | employee, recruitment, salary, benefits, hiring, performance |
| Legal | contract, agreement, legal, terms, law, attorney |
| Contracts | contract, agreement, terms, signature, parties |
| Technical Reports | technical, report, system, software, architecture |
| General | (default if no match) |

---

## 🧠 AI Features (Production Backend)

### Text Extraction
- **PDF**: First 10 pages via PyPDF2 (handles scanned PDFs via OCR if available)
- **DOCX**: All paragraphs via python-docx
- **TXT**: Raw file content
- **Fallback**: "[Unable to extract text]" if extraction fails

### Metadata Extraction
- **Title**: First non-empty line of document (max 100 chars)
- **Author**: Extracted from "Author:" or "By:" patterns, fallback to uploader name
- **Date**: Regex matching YYYY-MM-DD or MM/DD/YYYY formats

### Entity Extraction
- **Emails**: all@example.com patterns
- **Amounts**: $1,234.56 currency amounts
- **Phone Numbers**: (123) 456-7890 format
- Stored as JSON in database

### Summarization (Extractive)
- Uses TF-IDF vectorization on sentences
- Returns top 3 most important sentences in order
- Fallback to first 500 chars if < 3 sentences
- Optimized for first 2000 characters of document

### Classification
- Keyword-based approach (no ML model needed)
- 6 categories: Finance, HR, Legal, Contracts, Technical Reports, General
- Searches both file content and filename
- Auto-applied on upload

---

## 📊 Database Schema (Production Backend)

### SQLite Database: `documents.db`

#### Table: User
```
id (INTEGER, PRIMARY KEY)
username (TEXT, UNIQUE) - for login
password (TEXT) - SHA256 hash
full_name (TEXT) - display name
email (TEXT)
role (TEXT) - admin, hr, finance, user
created_at (DATETIME)
```

#### Table: Document
```
id (INTEGER, PRIMARY KEY)
filename (TEXT) - UUID-based storage name
original_filename (TEXT) - what user uploaded
category (TEXT) - auto-classified
size (INTEGER) - file size in bytes
path (TEXT) - disk location
author (TEXT) - extracted or uploader name
title (TEXT) - extracted from document
summary (TEXT) - TF-IDF summary
text_content (TEXT) - first 5000 chars
entities (TEXT) - JSON: emails, amounts, phones
mime_type (TEXT) - application/pdf, etc.
uploader_id (INTEGER, FK to User) - who uploaded
upload_date (DATETIME) - when uploaded
last_accessed (DATETIME) - when user viewed it
```

#### Table: AccessLog
```
id (INTEGER, PRIMARY KEY)
user_id (INTEGER, FK to User)
document_id (INTEGER, FK to Document)
action (TEXT) - upload, view, download, delete
timestamp (DATETIME)
```

---

## 🧪 Testing Commands (After Deploying Production Backend)

### 1. Health Check
```bash
curl http://localhost:8000/health
# {"status": "ok"}
```

### 2. Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}'
```

### 3. Upload Test
```bash
TOKEN="<from login response>"
curl -X POST http://localhost:8000/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/file.pdf"
```

### 4. List Documents
```bash
TOKEN="<from login response>"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/documents/
```

### 5. View Document Details
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/documents/1
# Includes: title, summary, entities, category, etc.
```

### 6. Search
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/search/?q=invoice"
```

### 7. View Access Logs (Admin Only)
```bash
ADMIN_TOKEN="<from admin login>"
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:8000/logs/
```

---

## 🚀 Deployment Checklist

- [ ] Read `DEPLOYMENT_GUIDE.md`
- [ ] Backup current `backend/main.py` → `backend/main_backup_inmemory.py`
- [ ] Update `backend/requirements.txt` with production dependencies
- [ ] Run `pip install -r requirements.txt`
- [ ] Swap `backend/main_production.py` → `backend/main.py`
- [ ] Restart backend (kill old process, start new one)
- [ ] Test login with curl
- [ ] Upload a test PDF
- [ ] Verify auto-classification worked
- [ ] Verify summary was generated
- [ ] Test role-based access (HR user can't see Finance docs)
- [ ] Check access logs as admin
- [ ] Restart frontend to clear any state issues

---

## 📲 Frontend Features (Already Working)

### Pages
- **LoginPage**: Enter credentials, get token
- **Dashboard**: List documents, upload new ones, filter by category
- **DocumentView**: See full details (title, summary, entities, metadata)
- **SearchPage**: Text search results
- **Settings**: View profile (extensible)

### UI Components
- Material-UI dark theme with gradient backgrounds
- Responsive layout for mobile/tablet/desktop
- Drag-and-drop file upload
- Category filtering
- Date formatting with fallbacks
- Loading states and error handling

### Features
- Bearer token auth stored in localStorage
- Auto-logout on 401 responses
- File download directly from browser
- Delete documents with confirmation
- Real-time document count

---

## 🐛 Known Limitations & Future Enhancements

### Current Version
- Text summarization: First 2000 chars only (prevent huge processing)
- Entity extraction: Regex-based (no advanced NER)
- Semantic search: Text-based fallback (SentenceTransformers planned)
- Role-based access: 3 roles + admin (extensible)

### Future Enhancements
- [ ] Add SentenceTransformers for semantic search
- [ ] Add FAISS for embedding storage/retrieval
- [ ] Add spaCy for advanced NER
- [ ] Add OCR for scanned PDFs
- [ ] Add UI for access logs viewer
- [ ] Add document tagging/favorites
- [ ] Add document sharing between users
- [ ] Add full-text search with Elasticsearch
- [ ] Add ML model for classification

---

## 📞 Support & Troubleshooting

### Backend won't start
- Kill existing process: `lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9`
- Restart: `uvicorn main:app --port 8000`

### "ModuleNotFoundError" errors
- Reinstall: `pip install -r requirements.txt --upgrade`
- Check Python version: `python --version` (3.8+)

### Database locked
- SQLite only allows one writer at a time
- Restart backend to clear any locks

### File upload fails
- Check disk space: `df -h`
- Check permissions on `uploads/` directory
- Check file size (should be < 500MB)

### Search returns no results
- Make sure documents have `text_content` populated
- Try broader search terms
- Check user role restrictions

---

## 📖 Documentation Files

- **README.md** ← You are here
- **BACKEND_REQUIREMENTS.md** - Feature specifications & code examples
- **DEPLOYMENT_GUIDE.md** - Step-by-step production deployment
- **frontend/ALIGNMENT_GUIDE.md** - Frontend architecture notes

---

## 🎓 Learning Resources

### Text Extraction
- PyPDF2 docs: Text extraction from PDFs
- python-docx docs: DOCX parsing

### NLP/ML
- TF-IDF: Text mining technique for scoring importance
- SentenceTransformers: Semantic embeddings (future)
- FAISS: Vector similarity search (future)

### Backend
- FastAPI: Modern Python web framework
- SQLModel: ORM combining Pydantic + SQLAlchemy
- uvicorn: ASGI server

### Frontend
- React: Component-based UI framework
- Material-UI: Google Material Design components
- axios: HTTP client  
- react-router-dom: Client-side routing

---

## 📜 License

This project is part of an AI Document Classification system for demonstration purposes.

---

## 🎯 Next Steps

**Recommended Path**:
1. ✅ Read this README
2. ✅ Read `DEPLOYMENT_GUIDE.md`
3. ✅ Review `BACKEND_REQUIREMENTS.md` for implementation details
4. ✅ Backup current backend
5. ✅ Update dependencies
6. ✅ Deploy production backend
7. ✅ Run test commands from DEPLOYMENT_GUIDE.md
8. ✅ Verify all features working
9. 🎉 System is production-ready!

